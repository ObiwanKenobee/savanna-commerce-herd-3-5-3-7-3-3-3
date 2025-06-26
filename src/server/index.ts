import "module-alias/register";
import SavannahApp from "./app";
import { logger } from "./utils/logger";
import { config } from "./config/environment";

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Create and start the application
const app = new SavannahApp();

app.start().catch((error) => {
  logger.error("Failed to start Savannah application:", error);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Give ongoing requests time to complete
  setTimeout(() => {
    logger.info("Forcing shutdown...");
    process.exit(1);
  }, 30000); // 30 seconds
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
