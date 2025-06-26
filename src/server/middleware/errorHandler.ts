import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { config } from "../config/environment";

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error
  logger.error("API Error:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.userId,
  });

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let errorCode = error.code || "INTERNAL_ERROR";
  let details = error.details || null;

  // Handle specific error types
  switch (error.name) {
    case "ValidationError":
      statusCode = 400;
      errorCode = "VALIDATION_ERROR";
      message = "Request validation failed";
      break;

    case "UnauthorizedError":
    case "JsonWebTokenError":
    case "TokenExpiredError":
      statusCode = 401;
      errorCode = "UNAUTHORIZED";
      message = "Authentication required";
      break;

    case "ForbiddenError":
      statusCode = 403;
      errorCode = "FORBIDDEN";
      message = "Access denied";
      break;

    case "NotFoundError":
      statusCode = 404;
      errorCode = "NOT_FOUND";
      message = "Resource not found";
      break;

    case "ConflictError":
      statusCode = 409;
      errorCode = "CONFLICT";
      message = "Resource conflict";
      break;

    case "RateLimitError":
      statusCode = 429;
      errorCode = "RATE_LIMIT_EXCEEDED";
      message = "Too many requests";
      break;

    // Database errors
    case "DatabaseError":
      statusCode = 500;
      errorCode = "DATABASE_ERROR";
      message = "Database operation failed";
      if (config.app.env !== "production") {
        details = error.message;
      }
      break;

    // PostgreSQL specific errors
    default:
      if (error.code) {
        switch (error.code) {
          case "23505": // Unique violation
            statusCode = 409;
            errorCode = "DUPLICATE_ENTRY";
            message = "Resource already exists";
            break;

          case "23503": // Foreign key violation
            statusCode = 400;
            errorCode = "INVALID_REFERENCE";
            message = "Referenced resource does not exist";
            break;

          case "23502": // Not null violation
            statusCode = 400;
            errorCode = "MISSING_REQUIRED_FIELD";
            message = "Required field is missing";
            break;

          case "22001": // String data too long
            statusCode = 400;
            errorCode = "DATA_TOO_LONG";
            message = "Input data exceeds maximum length";
            break;

          case "22P02": // Invalid input syntax
            statusCode = 400;
            errorCode = "INVALID_DATA_FORMAT";
            message = "Invalid data format";
            break;

          case "ECONNREFUSED":
            statusCode = 503;
            errorCode = "SERVICE_UNAVAILABLE";
            message = "External service unavailable";
            break;

          case "ETIMEOUT":
            statusCode = 504;
            errorCode = "TIMEOUT";
            message = "Request timeout";
            break;
        }
      }
      break;
  }

  // Ecosystem-specific error handling
  if (error.message.includes("wildlife")) {
    errorCode = "WILDLIFE_SERVICE_ERROR";
  } else if (error.message.includes("blockchain")) {
    errorCode = "BLOCKCHAIN_ERROR";
  } else if (error.message.includes("satellite")) {
    errorCode = "SATELLITE_DATA_ERROR";
  } else if (error.message.includes("ussd")) {
    errorCode = "USSD_SERVICE_ERROR";
  } else if (error.message.includes("mpesa")) {
    errorCode = "PAYMENT_ERROR";
  }

  // Create error response
  const errorResponse: any = {
    error: errorCode,
    message: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Add details in development mode
  if (config.app.env === "development") {
    errorResponse.stack = error.stack;
    if (details) {
      errorResponse.details = details;
    }
  }

  // Add ecosystem-specific error guidance
  switch (errorCode) {
    case "WILDLIFE_SERVICE_ERROR":
      errorResponse.guidance =
        "Wildlife tracking services may be temporarily unavailable. Please try again later.";
      break;

    case "BLOCKCHAIN_ERROR":
      errorResponse.guidance =
        "Blockchain transaction failed. Your data is safe and the operation will be retried.";
      break;

    case "SATELLITE_DATA_ERROR":
      errorResponse.guidance =
        "Satellite data is temporarily unavailable. Conservation tracking continues with cached data.";
      break;

    case "USSD_SERVICE_ERROR":
      errorResponse.guidance =
        "USSD services are experiencing issues. Try using the web interface instead.";
      break;

    case "PAYMENT_ERROR":
      errorResponse.guidance =
        "Payment processing failed. Please verify your payment details and try again.";
      break;

    case "RATE_LIMIT_EXCEEDED":
      errorResponse.guidance =
        "You have exceeded the rate limit. Please wait before making more requests.";
      errorResponse.retryAfter = 60; // seconds
      break;

    case "UNAUTHORIZED":
      errorResponse.guidance = "Please log in to access this resource.";
      break;

    case "FORBIDDEN":
      errorResponse.guidance =
        "You do not have permission to access this resource.";
      break;
  }

  // Special handling for USSD requests
  if (req.originalUrl.includes("/ussd") || req.headers["x-ussd-request"]) {
    return res.status(200).json({
      message: `SERVICE ERROR\n\n${message}\n\nPlease try again later.\n\nFor support: +254-XXX-XXXX`,
      endSession: true,
    });
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  code = "VALIDATION_ERROR";
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  code = "UNAUTHORIZED";

  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  code = "FORBIDDEN";

  constructor(message: string = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = "NOT_FOUND";

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  code = "CONFLICT";

  constructor(message: string = "Resource conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  code = "DATABASE_ERROR";

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "DatabaseError";
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ExternalServiceError extends Error {
  statusCode = 503;
  code = "EXTERNAL_SERVICE_ERROR";

  constructor(service: string, message?: string) {
    super(message || `${service} service is unavailable`);
    this.name = "ExternalServiceError";
  }
}

// Error handling utilities
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Resource not found: ${req.originalUrl}`);
  next(error);
};
