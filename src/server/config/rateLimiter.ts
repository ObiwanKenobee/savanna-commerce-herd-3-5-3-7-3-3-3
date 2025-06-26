import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Store for rate limiting (in production, use Redis)
const store = new Map();

const createLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return rateLimit({
    ...options,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: options.message,
        retryAfter: Math.round(options.windowMs / 1000),
        timestamp: new Date().toISOString(),
      });
    },
    skip: (req: Request) => {
      // Skip rate limiting for health checks
      return req.path === "/api/health";
    },
  });
};

export const limiterConfig = {
  // General API rate limiting
  api: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    message: "Too many API requests, please try again later.",
    skipSuccessfulRequests: false,
  }),

  // Authentication endpoints (stricter)
  auth: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts per 15 minutes
    message: "Too many authentication attempts, please try again later.",
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
  }),

  // Password reset (very strict)
  passwordReset: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: "Too many password reset attempts, please try again later.",
  }),

  // File upload endpoints
  upload: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: "Upload limit exceeded, please try again later.",
  }),

  // Payment endpoints (strict)
  payment: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 payment requests per hour
    message: "Payment request limit exceeded, please try again later.",
  }),

  // Search endpoints (moderate)
  search: createLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 searches per minute
    message: "Search rate limit exceeded, please slow down.",
  }),

  // Admin endpoints (moderate)
  admin: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 admin requests per 15 minutes
    message: "Admin API rate limit exceeded.",
  }),

  // WebSocket connection attempts
  websocket: createLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 connection attempts per minute
    message: "WebSocket connection limit exceeded.",
  }),
};

// Burst protection for specific endpoints
export const burstLimiter = createLimiter({
  windowMs: 1000, // 1 second
  max: 10, // 10 requests per second
  message: "Request burst limit exceeded, please slow down.",
});

// IP-based limiting for suspicious behavior
export const suspiciousActivityLimiter = createLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // 1000 requests per day
  message: "Daily request limit exceeded.",
});
