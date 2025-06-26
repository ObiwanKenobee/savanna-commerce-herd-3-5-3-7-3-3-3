import winston from "winston";
import path from "path";
import { config } from "../config/environment";

// Custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Custom colors for log levels
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    let logMessage = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return logMessage;
  }),
);

// Production format (JSON for log aggregation)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return JSON.stringify({
      timestamp,
      level,
      message,
      service: "savannah-platform",
      environment: config.app.env,
      ...meta,
    });
  }),
);

// Create logger instance
const logger = winston.createLogger({
  level: config.app.debug ? "debug" : "info",
  levels: logLevels,
  defaultMeta: {
    service: "savannah-platform",
    environment: config.app.env,
    version: config.app.version,
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: config.app.env === "production" ? productionFormat : logFormat,
    }),

    // Error log file
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "exceptions.log"),
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "rejections.log"),
    }),
  ],
});

// Create specialized loggers for different components
export const ecosystemLogger = logger.child({ component: "ecosystem" });
export const scalingLogger = logger.child({ component: "scaling" });
export const authLogger = logger.child({ component: "auth" });
export const paymentLogger = logger.child({ component: "payment" });
export const blockchainLogger = logger.child({ component: "blockchain" });
export const analyticsLogger = logger.child({ component: "analytics" });

// Performance logging utilities
export const logPerformance = (
  operation: string,
  startTime: number,
  metadata?: any,
) => {
  const duration = Date.now() - startTime;
  const level = duration > 1000 ? "warn" : "info";

  logger.log(level, `Performance: ${operation}`, {
    duration: `${duration}ms`,
    operation,
    ...metadata,
  });
};

// Request logging helper
export const logRequest = (req: any, res: any, responseTime: number) => {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  const contentLength = res.get("Content-Length") || "-";

  logger.http("HTTP Request", {
    method,
    url: originalUrl,
    statusCode,
    contentLength,
    responseTime: `${responseTime}ms`,
    ip,
    userAgent: req.get("User-Agent"),
  });
};

// Error logging with context
export const logError = (error: Error, context?: any) => {
  logger.error("Application Error", {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
  });
};

// Business logic logging
export const logBusinessEvent = (event: string, metadata?: any) => {
  logger.info(`Business Event: ${event}`, {
    event,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

// Security event logging
export const logSecurityEvent = (event: string, metadata?: any) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    timestamp: new Date().toISOString(),
    severity: "security",
    ...metadata,
  });
};

// Audit logging for admin actions
export const logAuditEvent = (
  action: string,
  userId: string,
  metadata?: any,
) => {
  logger.info(`Audit: ${action}`, {
    action,
    userId,
    timestamp: new Date().toISOString(),
    type: "audit",
    ...metadata,
  });
};

export { logger };

// Export specific logging functions
export const logBlockchainTransaction = (
  type: string,
  hash: string,
  userId: string,
  amount: number,
  metadata?: any
) => {
  logger.info("Blockchain transaction", {
    type,
    hash,
    userId,
    amount,
    metadata,
  });
};

export const logConservationImpact = (
  type: string,
  userId: string,
  impact: any
) => {
  logger.info("Conservation impact", {
    type,
    userId,
    impact,
  });
};

export const logSatelliteUpdate = (type: string, data: any) => {
  logger.info("Satellite update", {
    type,
    data,
  });
};
