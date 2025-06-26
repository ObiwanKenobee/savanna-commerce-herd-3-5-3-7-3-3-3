import crypto from "crypto";
import db from "../config/database";
import { logger } from "./logger";

interface OTPData {
  code: string;
  phoneNumber: string;
  purpose: "authentication" | "verification" | "password_reset";
  expiresAt: Date;
}

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a secure token for non-USSD operations
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};

// Store OTP in database with expiration
export const storeOTP = async (
  phoneNumber: string,
  code: string,
  purpose: OTPData["purpose"] = "authentication",
  expirationMinutes: number = 5,
): Promise<boolean> => {
  try {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Clean up existing OTPs for this phone number and purpose
    await db.query(
      `
      DELETE FROM user_sessions 
      WHERE device_info->>'phoneNumber' = $1 
        AND device_info->>'type' = $2
        AND device_info->>'purpose' = $3
    `,
      [phoneNumber, "otp", purpose],
    );

    // Store new OTP
    await db.query(
      `
      INSERT INTO user_sessions (
        user_id, token_hash, device_info, expires_at
      ) VALUES (NULL, $1, $2, $3)
    `,
      [
        await hashOTP(code),
        JSON.stringify({
          phoneNumber,
          type: "otp",
          purpose,
          generatedAt: new Date().toISOString(),
        }),
        expiresAt,
      ],
    );

    logger.info("OTP stored successfully", {
      phoneNumber: phoneNumber.replace(/\d{4}$/, "****"),
      purpose,
      expirationMinutes,
    });

    return true;
  } catch (error) {
    logger.error("Failed to store OTP:", error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (
  phoneNumber: string,
  code: string,
  purpose: OTPData["purpose"] = "authentication",
): Promise<{ valid: boolean; expired?: boolean; attempts?: number }> => {
  try {
    // Get OTP record
    const result = await db.query(
      `
      SELECT id, token_hash, expires_at, device_info, created_at
      FROM user_sessions 
      WHERE device_info->>'phoneNumber' = $1 
        AND device_info->>'type' = 'otp'
        AND device_info->>'purpose' = $2
      ORDER BY created_at DESC
      LIMIT 1
    `,
      [phoneNumber, purpose],
    );

    if (result.rows.length === 0) {
      return { valid: false };
    }

    const otpRecord = result.rows[0];

    // Check if expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      // Clean up expired OTP
      await db.query("DELETE FROM user_sessions WHERE id = $1", [otpRecord.id]);
      return { valid: false, expired: true };
    }

    // Verify OTP code
    const isValid = await verifyOTPHash(code, otpRecord.token_hash);

    if (isValid) {
      // Clean up used OTP
      await db.query("DELETE FROM user_sessions WHERE id = $1", [otpRecord.id]);

      logger.info("OTP verified successfully", {
        phoneNumber: phoneNumber.replace(/\d{4}$/, "****"),
        purpose,
      });

      return { valid: true };
    } else {
      // Track failed attempts
      const deviceInfo = JSON.parse(otpRecord.device_info);
      const attempts = (deviceInfo.attempts || 0) + 1;

      if (attempts >= 3) {
        // Delete OTP after 3 failed attempts
        await db.query("DELETE FROM user_sessions WHERE id = $1", [
          otpRecord.id,
        ]);

        logger.warn("OTP deleted due to too many failed attempts", {
          phoneNumber: phoneNumber.replace(/\d{4}$/, "****"),
          attempts,
        });
      } else {
        // Update attempts count
        deviceInfo.attempts = attempts;
        await db.query(
          "UPDATE user_sessions SET device_info = $1 WHERE id = $2",
          [JSON.stringify(deviceInfo), otpRecord.id],
        );
      }

      return { valid: false, attempts };
    }
  } catch (error) {
    logger.error("OTP verification error:", error);
    return { valid: false };
  }
};

// Hash OTP for secure storage
const hashOTP = async (code: string): Promise<string> => {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(code, 10);
};

// Verify OTP against hash
const verifyOTPHash = async (code: string, hash: string): Promise<boolean> => {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(code, hash);
  } catch (error) {
    logger.error("OTP hash verification error:", error);
    return false;
  }
};

// Generate OTP for USSD authentication
export const generateUSSDOTP = async (phoneNumber: string): Promise<string> => {
  const code = generateOTP();
  await storeOTP(phoneNumber, code, "authentication", 5); // 5 minutes expiration
  return code;
};

// Generate OTP for phone number verification
export const generateVerificationOTP = async (
  phoneNumber: string,
): Promise<string> => {
  const code = generateOTP();
  await storeOTP(phoneNumber, code, "verification", 10); // 10 minutes expiration
  return code;
};

// Generate OTP for password reset
export const generatePasswordResetOTP = async (
  phoneNumber: string,
): Promise<string> => {
  const code = generateOTP();
  await storeOTP(phoneNumber, code, "password_reset", 15); // 15 minutes expiration
  return code;
};

// Check rate limiting for OTP generation
export const checkOTPRateLimit = async (
  phoneNumber: string,
  maxAttempts: number = 3,
  windowMinutes: number = 60,
): Promise<{
  allowed: boolean;
  attemptsRemaining?: number;
  resetTime?: Date;
}> => {
  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

    const result = await db.query(
      `
      SELECT COUNT(*) as attempt_count
      FROM user_sessions
      WHERE device_info->>'phoneNumber' = $1
        AND device_info->>'type' = 'otp'
        AND created_at > $2
    `,
      [phoneNumber, windowStart],
    );

    const attemptCount = parseInt(result.rows[0].attempt_count);

    if (attemptCount >= maxAttempts) {
      const resetTime = new Date(
        Date.now() +
          windowMinutes * 60 * 1000 -
          (Date.now() - windowStart.getTime()),
      );
      return {
        allowed: false,
        attemptsRemaining: 0,
        resetTime,
      };
    }

    return {
      allowed: true,
      attemptsRemaining: maxAttempts - attemptCount,
    };
  } catch (error) {
    logger.error("OTP rate limit check error:", error);
    return { allowed: true }; // Allow on error to avoid blocking users
  }
};

// Clean up expired OTPs (should be run periodically)
export const cleanupExpiredOTPs = async (): Promise<number> => {
  try {
    const result = await db.query(`
      DELETE FROM user_sessions 
      WHERE device_info->>'type' = 'otp' 
        AND expires_at < NOW()
    `);

    const deletedCount = result.rowCount || 0;

    if (deletedCount > 0) {
      logger.info("Cleaned up expired OTPs", { deletedCount });
    }

    return deletedCount;
  } catch (error) {
    logger.error("OTP cleanup error:", error);
    return 0;
  }
};

// Validate phone number format for OTP
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Kenya phone number format validation
  const kenyaPhoneRegex = /^(\+254|254|0)([17]\d{8})$/;
  return kenyaPhoneRegex.test(phoneNumber);
};

// Normalize phone number to international format
export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Remove spaces and special characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // Convert to international format
  if (cleaned.startsWith("0")) {
    return "+254" + cleaned.substring(1);
  } else if (cleaned.startsWith("254")) {
    return "+" + cleaned;
  } else if (cleaned.startsWith("+254")) {
    return cleaned;
  }

  // Default: assume it's a Kenyan number without country code
  return "+254" + cleaned;
};

// Generate contextual OTP message
export const generateOTPMessage = (
  code: string,
  purpose: OTPData["purpose"],
  expirationMinutes: number = 5,
): string => {
  const baseMessage = `Your Savannah Ecosystem verification code is: ${code}`;

  switch (purpose) {
    case "authentication":
      return `${baseMessage}\nValid for ${expirationMinutes} minutes.\nDo not share this code.`;

    case "verification":
      return `${baseMessage}\nUse this code to verify your phone number.\nValid for ${expirationMinutes} minutes.`;

    case "password_reset":
      return `${baseMessage}\nUse this code to reset your password.\nValid for ${expirationMinutes} minutes.\nIf you did not request this, ignore this message.`;

    default:
      return `${baseMessage}\nValid for ${expirationMinutes} minutes.`;
  }
};

export default {
  generateOTP,
  generateSecureToken,
  storeOTP,
  verifyOTP,
  generateUSSDOTP,
  generateVerificationOTP,
  generatePasswordResetOTP,
  checkOTPRateLimit,
  cleanupExpiredOTPs,
  validatePhoneNumber,
  normalizePhoneNumber,
  generateOTPMessage,
};
