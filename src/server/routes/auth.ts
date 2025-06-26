import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../config/database";
import { config } from "../config/environment";
import { logger } from "../utils/logger";
import { validate } from "../middleware/validation";
import { sendSMS } from "../services/sms";
import { generateOTP, verifyOTP } from "../utils/otp";

// Define JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phoneNumber: z.string().optional(),
  role: z
    .enum(["user", "supplier", "retailer", "chief", "student", "elder"])
    .default("user"),
  tribe: z.string().optional(),
  locationCounty: z.string().optional(),
  locationSubcounty: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const ussdLoginSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string().optional(),
});

// Register new user
router.post(
  "/register",
  validate({ body: registerSchema }),
  async (req: Request, res: Response) => {
    try {
      const userData = req.body;

      // Check if user already exists
      const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1 OR phone_number = $2",
        [userData.email, userData.phoneNumber],
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          error: "User already exists",
          message: "A user with this email or phone number already exists",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Insert user
      const result = await db.query(
        `
      INSERT INTO users (
        email, password_hash, first_name, last_name, phone_number, 
        role, tribe, location_county, location_subcounty
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, email, first_name, last_name, role, created_at
    `,
        [
          userData.email,
          passwordHash,
          userData.firstName,
          userData.lastName,
          userData.phoneNumber,
          userData.role,
          userData.tribe,
          userData.locationCounty,
          userData.locationSubcounty,
        ],
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.auth.jwtSecret as jwt.Secret,
        { expiresIn: config.auth.jwtExpiry } as jwt.SignOptions
      );

      // Store session
      await db.query(
        `
      INSERT INTO user_sessions (user_id, token_hash, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
        [
          user.id,
          await bcrypt.hash(token, 10),
          JSON.stringify({ userAgent: req.get("User-Agent") }),
          req.ip,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ],
      );

      logger.info("User registered successfully", {
        userId: user.id,
        email: user.email,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration",
      });
    }
  },
);

// Login user
router.post(
  "/login",
  validate({ body: loginSchema }),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const result = await db.query(
        `
      SELECT id, email, password_hash, first_name, last_name, role, 
             phone_number, tribe, location_county, is_verified, is_active
      FROM users 
      WHERE email = $1
    `,
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(401).json({
          error: "Account deactivated",
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.auth.jwtSecret as jwt.Secret,
        { expiresIn: config.auth.jwtExpiry } as jwt.SignOptions
      );

      // Store session
      await db.query(
        `
      INSERT INTO user_sessions (user_id, token_hash, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
        [
          user.id,
          await bcrypt.hash(token, 10),
          JSON.stringify({ userAgent: req.get("User-Agent") }),
          req.ip,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ],
      );

      logger.info("User logged in successfully", {
        userId: user.id,
        email: user.email,
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          phoneNumber: user.phone_number,
          tribe: user.tribe,
          locationCounty: user.location_county,
          isVerified: user.is_verified,
        },
        token,
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login",
      });
    }
  },
);

// USSD-based authentication for rural users
router.post(
  "/ussd-login",
  validate({ body: ussdLoginSchema }),
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber, otp } = req.body;

      if (!otp) {
        // Generate and send OTP
        const otpCode = generateOTP();

        // Store OTP temporarily (in production, use Redis)
        await db.query(
          `
        INSERT INTO user_sessions (user_id, token_hash, device_info, expires_at)
        VALUES (NULL, $1, $2, $3)
      `,
          [
            await bcrypt.hash(otpCode, 10),
            JSON.stringify({ phoneNumber, type: "otp" }),
            new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          ],
        );

        // Send OTP via SMS
        await sendSMS(
          phoneNumber,
          `Your Savannah Ecosystem login code is: ${otpCode}. Valid for 5 minutes.`,
        );

        return res.json({
          message: "OTP sent successfully",
          nextStep: "Enter the OTP received via SMS",
        });
      }

      // Verify OTP and authenticate
      const otpResult = await db.query(
        `
      SELECT us.id, u.id as user_id, u.email, u.first_name, u.last_name, u.role
      FROM user_sessions us
      LEFT JOIN users u ON u.phone_number = $1
      WHERE us.device_info->>'phoneNumber' = $1 
        AND us.device_info->>'type' = 'otp'
        AND us.expires_at > NOW()
      ORDER BY us.created_at DESC
      LIMIT 1
    `,
        [phoneNumber],
      );

      if (otpResult.rows.length === 0) {
        return res.status(401).json({
          error: "Invalid or expired OTP",
          message: "Please request a new OTP",
        });
      }

      const session = otpResult.rows[0];
      const otpValid = await bcrypt.compare(otp, session.token_hash);

      if (!otpValid) {
        return res.status(401).json({
          error: "Invalid OTP",
          message: "The OTP entered is incorrect",
        });
      }

      // Clean up OTP session
      await db.query("DELETE FROM user_sessions WHERE id = $1", [session.id]);

      if (!session.user_id) {
        return res.status(404).json({
          error: "User not found",
          message:
            "No account found with this phone number. Please register first.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: session.user_id, email: session.email, role: session.role },
        config.auth.jwtSecret as jwt.Secret,
        { expiresIn: config.auth.jwtExpiry } as jwt.SignOptions
      );

      // Store new session
      await db.query(
        `
      INSERT INTO user_sessions (user_id, token_hash, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
        [
          session.user_id,
          await bcrypt.hash(token, 10),
          JSON.stringify({
            phoneNumber,
            type: "ussd_login",
            userAgent: req.get("User-Agent"),
          }),
          req.ip,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ],
      );

      logger.info("USSD login successful", {
        userId: session.user_id,
        phoneNumber,
      });

      res.json({
        message: "USSD login successful",
        user: {
          id: session.user_id,
          email: session.email,
          firstName: session.first_name,
          lastName: session.last_name,
          role: session.role,
        },
        token,
        ussdAccess: true,
      });
    } catch (error) {
      logger.error("USSD login error:", error);
      res.status(500).json({
        error: "USSD login failed",
        message: "An error occurred during USSD authentication",
      });
    }
  },
);

// Logout
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      // Invalidate session
      const tokenHash = await bcrypt.hash(token, 10);
      await db.query("DELETE FROM user_sessions WHERE token_hash = $1", [
        tokenHash,
      ]);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      message: "An error occurred during logout",
    });
  }
});

// Verify token
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
        message: "Authorization token is required",
      });
    }

    const decoded = jwt.verify(token, config.auth.jwtSecret) as JWTPayload;

    // Check if session exists
    const sessionResult = await db.query(
      `
      SELECT us.id, u.id, u.email, u.first_name, u.last_name, u.role, u.is_active
      FROM user_sessions us
      JOIN users u ON u.id = us.user_id
      WHERE us.user_id = $1 AND us.expires_at > NOW()
    `,
      [decoded.userId],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid session",
        message: "Session has expired or is invalid",
      });
    }

    const user = sessionResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        error: "Account deactivated",
        message: "Your account has been deactivated",
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Token verification error:", error);
    res.status(401).json({
      error: "Invalid token",
      message: "Token verification failed",
    });
  }
});

export { router as authRoutes };
