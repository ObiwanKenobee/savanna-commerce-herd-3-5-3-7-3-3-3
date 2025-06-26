import { Pool, PoolClient } from "pg";
import { config } from "./environment";
import { logger } from "../utils/logger";

class DatabaseManager {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.username,
      password: config.database.password,
      ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
      min: config.database.poolMin,
      max: config.database.poolMax,
      connectionTimeoutMillis: config.database.connectionTimeout,
      idleTimeoutMillis: 30000,
      query_timeout: 60000,
      application_name: "savannah_platform",
      statement_timeout: 60000,
    });

    this.setupPoolEvents();
  }

  private setupPoolEvents(): void {
    this.pool.on("connect", (client) => {
      logger.info("New database connection established");
    });

    this.pool.on("acquire", (client) => {
      logger.debug("Database connection acquired from pool");
    });

    this.pool.on("error", (err, client) => {
      logger.error("Database pool error:", err);
    });

    this.pool.on("remove", (client) => {
      logger.debug("Database connection removed from pool");
    });
  }

  public async connect(): Promise<void> {
    try {
      // Test the connection
      const client = await this.pool.connect();
      await client.query("SELECT NOW()");
      client.release();

      this.isConnected = true;
      logger.info("✅ Database connected successfully");

      // Set up database for optimal performance
      await this.optimizeDatabase();
    } catch (error) {
      logger.error("❌ Database connection failed:", error);

      // In development, allow server to start without database
      if (config.app.env === "development") {
        logger.warn(
          "🚧 Starting server in development mode without database connection",
        );
        this.isConnected = false;
        return;
      }

      throw error;
    }
  }

  private async optimizeDatabase(): Promise<void> {
    try {
      const client = await this.pool.connect();

      // Set session-level optimizations
      await client.query(`
        SET statement_timeout = '60s';
        SET lock_timeout = '30s';
        SET idle_in_transaction_session_timeout = '10min';
      `);

      client.release();
      logger.info("Database optimization settings applied");
    } catch (error) {
      logger.warn("Failed to apply database optimizations:", error);
    }
  }

  public async query(text: string, params?: any[]): Promise<any> {
    // In development mode without database connection, return mock data
    if (!this.isConnected && config.app.env === "development") {
      logger.debug("Mock query in development mode:", text.substring(0, 100));
      return { rows: [], rowCount: 0 };
    }

    const start = Date.now();

    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (config.app.debug) {
        logger.debug(`Query executed in ${duration}ms:`, {
          query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          params: params?.length ? "[REDACTED]" : undefined,
          rows: result.rows?.length,
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`Query failed after ${duration}ms:`, {
        query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        error: error.message,
      });
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<{
    status: string;
    latency: number;
    connections: any;
  }> {
    const start = Date.now();

    try {
      const result = await this.pool.query(
        "SELECT NOW() as current_time, version() as version",
      );
      const latency = Date.now() - start;

      const poolInfo = {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount,
      };

      return {
        status: "healthy",
        latency,
        connections: poolInfo,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        latency: Date.now() - start,
        connections: { error: error.message },
      };
    }
  }

  public async close(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info("Database pool closed");
    } catch (error) {
      logger.error("Error closing database pool:", error);
      throw error;
    }
  }

  public get connected(): boolean {
    return this.isConnected;
  }

  public get poolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Singleton instance
const db = new DatabaseManager();

export const connectDatabase = () => db.connect();
export const query = (text: string, params?: any[]) => db.query(text, params);
export const getClient = () => db.getClient();
export const transaction = <T>(callback: (client: PoolClient) => Promise<T>) =>
  db.transaction(callback);
export const closeDatabase = () => db.close();
export const dbHealthCheck = () => db.healthCheck();
export const dbStats = () => db.poolStats;

export default db;
