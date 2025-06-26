import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/environment";
import { query } from "../config/database";
import { authLogger, logSecurityEvent } from "../utils/logger";
import { AppError } from "../utils/errors";
import { AuthenticatedRequest } from "../types";

// Use the shared JWTPayload interface from ../types instead
// This is kept for backward compatibility but should be removed in future
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      logSecurityEvent("Authentication failed - No token provided", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        requestId: req.requestId,
      });

      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      config.auth.jwtSecret as Secret,
    ) as JWTPayload;

    // Check if user still exists and is active
    const userResult = await query(
      `SELECT id, email, role, is_active, last_login, created_at
       FROM users
       WHERE id = $1 AND is_active = true`,
      [decoded.userId],
    );

    if (userResult.rows.length === 0) {
      logSecurityEvent("Authentication failed - User not found or inactive", {
        userId: decoded.userId,
        ip: req.ip,
        requestId: req.requestId,
      });

      return res.status(401).json({
        success: false,
        message: "User not found or account disabled",
      });
    }

    const user = userResult.rows[0];

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Log successful authentication
    authLogger.debug("User authenticated successfully", {
      userId: user.id,
      email: user.email,
      role: user.role,
      requestId: req.requestId,
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logSecurityEvent("Authentication failed - Invalid token", {
        error: error.message,
        ip: req.ip,
        requestId: req.requestId,
      });

      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      logSecurityEvent("Authentication failed - Token expired", {
        ip: req.ip,
        requestId: req.requestId,
      });

      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }

    authLogger.error("Authentication middleware error:", error);
    next(error);
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent("Authorization failed - Insufficient permissions", {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        requestId: req.requestId,
      });

      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(["admin", "super_admin"]);

// Permission-based authorization
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Check if user has the required permission
      const permissionResult = await query(
        `SELECT 1 FROM user_permissions up
         JOIN permissions p ON up.permission_id = p.id
         WHERE up.user_id = $1 AND p.name = $2`,
        [req.user.id, permission],
      );

      if (permissionResult.rows.length === 0) {
        logSecurityEvent("Authorization failed - Missing permission", {
          userId: req.user.id,
          permission,
          requestId: req.requestId,
        });

        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`,
        });
      }

      next();
    } catch (error) {
      authLogger.error("Permission check error:", error);
      next(error);
    }
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verify(
        token,
        config.auth.jwtSecret as Secret,
      ) as JWTPayload;

      const userResult = await query(
        `SELECT id, email, role FROM users WHERE id = $1 AND is_active = true`,
        [decoded.userId],
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

// API Key authentication for external services
export const apiKeyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.get("X-API-Key");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key required",
      });
    }

    // Hash the provided key and compare with stored hash
    const keyResult = await query(
      `SELECT ak.*, u.id as user_id, u.email, u.role
       FROM api_keys ak
       JOIN users u ON ak.user_id = u.id
       WHERE ak.key_hash = $1 AND ak.is_active = true AND ak.expires_at > NOW()`,
      [hashApiKey(apiKey)],
    );

    if (keyResult.rows.length === 0) {
      logSecurityEvent("API Key authentication failed", {
        providedKey: apiKey.substring(0, 8) + "...",
        ip: req.ip,
        requestId: req.requestId,
      });

      return res.status(401).json({
        success: false,
        message: "Invalid or expired API key",
      });
    }

    const keyData = keyResult.rows[0];

    // Update last used timestamp
    await query("UPDATE api_keys SET last_used_at = NOW() WHERE id = $1", [
      keyData.id,
    ]);

    req.user = {
      id: keyData.user_id,
      email: keyData.email,
      role: keyData.role,
    };

    authLogger.info("API Key authentication successful", {
      keyId: keyData.id,
      userId: keyData.user_id,
      requestId: req.requestId,
    });

    next();
  } catch (error) {
    authLogger.error("API Key authentication error:", error);
    next(error);
  }
};

// Utility functions
const extractToken = (req: Request): string | null => {
  const authHeader = req.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Also check for token in cookies for web clients
  return req.cookies?.accessToken || null;
};

const hashApiKey = (key: string): string => {
  return bcrypt.hashSync(key, 10);
};

// Generate JWT token
export const generateToken = (payload: {
  userId: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(payload, config.auth.jwtSecret as jwt.Secret, {
    expiresIn: config.auth.jwtExpiry as any,
    issuer: "savannah-platform",
    audience: "savannah-users",
  });
};

// Generate refresh token
export const generateRefreshToken = (): string => {
  return jwt.sign({}, config.auth.jwtSecret as jwt.Secret, {
    expiresIn: config.auth.refreshTokenExpiry as any,
    issuer: "savannah-platform",
  });
};

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.auth.jwtSecret as Secret);
};

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.auth.bcryptRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Alias for authMiddleware for backward compatibility
export const authenticateToken = authMiddleware;
