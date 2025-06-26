import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logRequest, logger } from "../utils/logger";

// Extend Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime: number;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers
  res.set("X-Request-ID", req.requestId);

  // Log request start
  logger.debug("Request started", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    contentType: req.get("Content-Type"),
    contentLength: req.get("Content-Length"),
  });

  // Capture original res.json to log response
  const originalJson = res.json;
  res.json = function (body) {
    // Log response details before sending
    const responseTime = Date.now() - req.startTime;

    logRequest(req, res, responseTime);

    // Log additional details for debugging
    if (res.statusCode >= 400) {
      logger.warn("Request completed with error", {
        requestId: req.requestId,
        statusCode: res.statusCode,
        responseTime,
        errorBody: typeof body === "object" ? JSON.stringify(body) : body,
      });
    } else {
      logger.debug("Request completed successfully", {
        requestId: req.requestId,
        statusCode: res.statusCode,
        responseTime,
      });
    }

    return originalJson.call(this, body);
  };

  // Handle response finish event
  res.on("finish", () => {
    const responseTime = Date.now() - req.startTime;

    // Log performance warnings
    if (responseTime > 2000) {
      logger.warn("Slow request detected", {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        responseTime,
        statusCode: res.statusCode,
      });
    }

    // Log error responses
    if (res.statusCode >= 500) {
      logger.error("Server error response", {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime,
      });
    }
  });

  // Handle response close event (client disconnected)
  res.on("close", () => {
    if (!res.finished) {
      logger.warn("Request closed by client", {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        responseTime: Date.now() - req.startTime,
      });
    }
  });

  next();
};

// Middleware to log sensitive operations
export const sensitiveOperationLogger = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sensitive operation: ${operation}`, {
      requestId: req.requestId,
      operation,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    next();
  };
};

// Middleware to log API usage for analytics
export const apiUsageLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    // Only log successful requests for analytics
    if (res.statusCode < 400) {
      logger.info("API Usage", {
        endpoint: req.route?.path || req.path,
        method: req.method,
        userId: req.user?.id,
        userRole: req.user?.role,
        responseTime: Date.now() - req.startTime,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      });
    }
  });

  next();
};
