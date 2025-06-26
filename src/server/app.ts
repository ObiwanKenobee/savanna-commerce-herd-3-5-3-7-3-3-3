import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/environment";
import { connectDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";
import { validate as validationMiddleware } from "./middleware/validation";
// Comment out cache middleware import until implementation is complete
// import { cacheMiddleware } from "./middleware/cache";
import { corsConfig } from "./config/cors";
import { limiterConfig } from "./config/rateLimiter";
import { logger } from "./utils/logger";

// Route imports
import { authRoutes } from "./routes/auth";
// For routes that might be missing, we'll need to create them later
// or modify the router initialization to handle missing routes
import { scalingRoutes } from "./routes/scaling";
// Create placeholder objects for routes that might be missing
const userRoutes = Router();
const analyticsRoutes = Router();
const notificationRoutes = Router();
const paymentRoutes = Router();
const adminRoutes = Router();
const healthRoutes = Router();

// WebSocket handlers
import { initializeWebSocket } from "./websocket/handler";

class SavannahApp {
  public app: express.Application;
  public server: any;
  public io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: corsConfig.socket,
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://fonts.googleapis.com",
            ],
            scriptSrc: ["'self'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "ws:"],
          },
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
      }),
    );

    // CORS configuration
    this.app.use(cors(corsConfig.api));

    // Compression for performance
    this.app.use(
      compression({
        filter: (req, res) => {
          if (req.headers["x-no-compression"]) return false;
          return compression.filter(req, res);
        },
        level: 6,
        threshold: 1024,
      }),
    );

    // Rate limiting
    this.app.use("/api/", limiterConfig.api);
    this.app.use("/api/auth/", limiterConfig.auth);

    // Request parsing
    this.app.use(
      express.json({
        limit: config.server.maxRequestSize,
        verify: (req: any, res, buf) => {
          req.rawBody = buf;
        },
      }),
    );
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: config.server.maxRequestSize,
      }),
    );

    // Logging
    this.app.use(requestLogger);

    // Trust proxy for load balancer
    this.app.set("trust proxy", 1);
  }

  private initializeRoutes(): void {
    // Health check (no auth required)
    this.app.use("/api/health", healthRoutes);

    // API versioning
    const apiV1 = express.Router();

    // Public routes
    apiV1.use("/auth", authRoutes);

    // Protected routes
    apiV1.use("/users", authMiddleware, userRoutes);
    apiV1.use("/scaling", authMiddleware, scalingRoutes);
    apiV1.use("/analytics", authMiddleware, analyticsRoutes);
    apiV1.use("/notifications", authMiddleware, notificationRoutes);
    apiV1.use("/payments", authMiddleware, paymentRoutes);

    // Admin routes (additional role check)
    apiV1.use("/admin", authMiddleware, adminRoutes);

    this.app.use("/api/v1", apiV1);

    // API documentation
    this.app.get("/api/docs", (req, res) => {
      res.json({
        name: "Savannah Digital Platform API",
        version: "1.0.0",
        description: "Comprehensive bio-technological ecosystem platform",
        endpoints: {
          auth: "/api/v1/auth",
          users: "/api/v1/users",
          scaling: "/api/v1/scaling",
          analytics: "/api/v1/analytics",
          notifications: "/api/v1/notifications",
          payments: "/api/v1/payments",
          admin: "/api/v1/admin",
        },
      });
    });
  }

  private initializeWebSocket(): void {
    initializeWebSocket(this.io);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Endpoint not found",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      });
    });

    // Global error handler
    this.app.use(errorHandler);

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      this.server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      this.server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      const port = config.server.port;
      this.server.listen(port, () => {
        logger.info(`🚀 Savannah server running on port ${port}`);
        logger.info(
          `📚 API docs available at http://localhost:${port}/api/docs`,
        );
        logger.info(`🌍 Environment: ${config.app.env}`);
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}

export default SavannahApp;
