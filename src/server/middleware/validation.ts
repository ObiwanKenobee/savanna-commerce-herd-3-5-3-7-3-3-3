import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { logger } from "../utils/logger";

// Type for validation schema
interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

// Validation middleware factory
export const validate = (schema: ValidationSchema | ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('body' in schema || 'query' in schema || 'params' in schema) {
        // Schema is a ValidationSchema object
        const validationSchema = schema as ValidationSchema;
        
        // Validate request body
        if (validationSchema.body) {
          req.body = validationSchema.body.parse(req.body);
        }

        // Validate query parameters
        if (validationSchema.query) {
          req.query = validationSchema.query.parse(req.query);
        }

        // Validate route parameters
        if (validationSchema.params) {
          req.params = validationSchema.params.parse(req.params);
        }
      } else {
        // Schema is a simple ZodSchema for body validation
        req.body = (schema as ZodSchema).parse(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn("Validation error", {
          errors: error.errors,
          path: req.path,
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      }

      next(error);
    }
  };
};

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val) || 1)
      .pipe(z.number().min(1)),
    limit: z
      .string()
      .transform((val) => parseInt(val) || 10)
      .pipe(z.number().min(1).max(100)),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().uuid("Invalid ID format"),
  }),

  // Search query
  search: z.object({
    q: z
      .string()
      .min(1, "Search query required")
      .max(100, "Search query too long"),
    type: z.string().optional(),
    filters: z.string().optional(),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};

// User validation schemas
export const userSchemas = {
  register: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    firstName: z.string().min(1, "First name required").max(50),
    lastName: z.string().min(1, "Last name required").max(50),
    phone: z
      .string()
      .regex(/^\+254[0-9]{9}$/, "Invalid Kenyan phone number format")
      .optional(),
    role: z.enum(["user", "supplier", "retailer"]).default("user"),
  }),

  login: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password required"),
    rememberMe: z.boolean().optional().default(false),
  }),

  updateProfile: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z
      .string()
      .regex(/^\+254[0-9]{9}$/)
      .optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
  }),
};

// Scaling infrastructure validation schemas
export const scalingSchemas = {
  createBiomeExpansion: z.object({
    name: z.string().min(1, "Name required").max(100),
    type: z.enum(["matatu_mesh", "maasai_api", "elephant_blockchain"]),
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      description: z.string().max(200),
    }),
    configuration: z.record(z.any()),
    isActive: z.boolean().default(true),
  }),

  updateInfrastructure: z.object({
    name: z.string().min(1).max(100).optional(),
    configuration: z.record(z.any()).optional(),
    isActive: z.boolean().optional(),
    metadata: z.record(z.any()).optional(),
  }),

  deployPhase: z.object({
    phaseId: z.enum(["alpha", "beta", "gamma"]),
    terrain: z.string().min(1, "Terrain required"),
    techStack: z.array(z.string()).min(1, "At least one technology required"),
    bioIntegration: z.string().min(1, "Bio-integration description required"),
    targetMetrics: z.object({
      coverage: z.number().min(0).max(100),
      efficiency: z.number().min(0).max(100),
      sustainability: z.number().min(0).max(100),
    }),
  }),
};

// Payment validation schemas
export const paymentSchemas = {
  initiateMpesa: z.object({
    amount: z
      .number()
      .min(1, "Amount must be greater than 0")
      .max(300000, "Amount exceeds limit"),
    phoneNumber: z
      .string()
      .regex(/^\+254[0-9]{9}$/, "Invalid phone number format"),
    description: z.string().min(1, "Description required").max(100),
    reference: z.string().min(1, "Reference required").max(50),
  }),

  webhookMpesa: z.object({
    Body: z.object({
      stkCallback: z.object({
        MerchantRequestID: z.string(),
        CheckoutRequestID: z.string(),
        ResultCode: z.number(),
        ResultDesc: z.string(),
        CallbackMetadata: z
          .object({
            Item: z.array(
              z.object({
                Name: z.string(),
                Value: z.any(),
              }),
            ),
          })
          .optional(),
      }),
    }),
  }),
};

// Analytics validation schemas
export const analyticsSchemas = {
  trackEvent: z.object({
    event: z.string().min(1, "Event name required"),
    properties: z.record(z.any()).optional(),
    userId: z.string().uuid().optional(),
    sessionId: z.string().optional(),
    timestamp: z.string().datetime().optional(),
  }),

  getMetrics: z.object({
    metric: z.enum(["users", "revenue", "transactions", "scaling_metrics"]),
    timeframe: z.enum(["hour", "day", "week", "month", "year"]),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    groupBy: z.string().optional(),
  }),
};

// Admin validation schemas
export const adminSchemas = {
  createUser: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    role: z.enum(["user", "supplier", "retailer", "admin", "super_admin"]),
    isActive: z.boolean().default(true),
    permissions: z.array(z.string()).optional(),
  }),

  updateUser: z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z
      .enum(["user", "supplier", "retailer", "admin", "super_admin"])
      .optional(),
    isActive: z.boolean().optional(),
    permissions: z.array(z.string()).optional(),
  }),

  systemConfig: z.object({
    key: z.string().min(1, "Config key required"),
    value: z.any(),
    description: z.string().optional(),
    isPublic: z.boolean().default(false),
  }),
};

// File upload validation
export const fileUploadSchemas = {
  image: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z
      .string()
      .refine(
        (type) => type.startsWith("image/"),
        "Only image files are allowed",
      ),
    size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
  }),

  document: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z
      .string()
      .refine(
        (type) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(type),
        "Only PDF and Word documents are allowed",
      ),
    size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  }),
};

// Export the validation middleware with a more descriptive name for backward compatibility
export const validateRequest = validate;

// Export validation middleware for full request validation
export const validationMiddleware = validate;

// Sanitization middleware
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Remove potential XSS content from strings
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj !== null && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Rate limiting specific to validation failures
export const validationRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Track validation failures per IP
  const failures = req.app.locals.validationFailures || new Map();
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxFailures = 20;

  const clientFailures = failures.get(clientIP) || [];
  const recentFailures = clientFailures.filter(
    (time: number) => now - time < windowMs,
  );

  if (recentFailures.length >= maxFailures) {
    logger.warn("Validation rate limit exceeded", {
      ip: clientIP,
      failures: recentFailures.length,
      requestId: req.requestId,
    });

    return res.status(429).json({
      success: false,
      message: "Too many validation errors. Please slow down.",
      retryAfter: Math.ceil(windowMs / 1000),
    });
  }

  req.app.locals.validationFailures = failures;
  next();
};
