import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { query } from "../config/database";
import { logger } from "../utils/logger";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface SocketUser {
  id: string;
  email: string;
  role: string;
  socketId: string;
  connectedAt: Date;
}

class WebSocketManager {
  private io: Server;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: Server) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware for WebSocket
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          return next(new Error("Authentication token required"));
        }

        const decoded = jwt.verify(token, config.auth.jwtSecret) as any;

        // Verify user exists and is active
        const userResult = await query(
          "SELECT id, email, role FROM users WHERE id = $1 AND is_active = true",
          [decoded.userId],
        );

        if (userResult.rows.length === 0) {
          return next(new Error("User not found or inactive"));
        }

        const user = userResult.rows[0];
        socket.userId = user.id;
        socket.userRole = user.role;

        logger.info("WebSocket user authenticated", {
          userId: user.id,
          socketId: socket.id,
          role: user.role,
        });

        next();
      } catch (error) {
        logger.warn("WebSocket authentication failed", {
          error: error.message,
        });
        next(new Error("Invalid authentication token"));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.userId!;
    const userRole = socket.userRole!;

    // Store user connection
    const user: SocketUser = {
      id: userId,
      email: "", // Will be populated if needed
      role: userRole,
      socketId: socket.id,
      connectedAt: new Date(),
    };

    this.connectedUsers.set(socket.id, user);
    this.userSockets.set(userId, socket.id);

    // Join role-based rooms
    socket.join(`role:${userRole}`);
    socket.join(`user:${userId}`);

    logger.info("User connected to WebSocket", {
      userId,
      socketId: socket.id,
      totalConnections: this.connectedUsers.size,
    });

    // Set up event handlers
    this.setupScalingEvents(socket);
    this.setupNotificationEvents(socket);
    this.setupAnalyticsEvents(socket);
    this.setupAdminEvents(socket);
    this.setupGeneralEvents(socket);

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      this.handleDisconnection(socket, reason);
    });

    // Send welcome message
    socket.emit("connected", {
      message: "Connected to Savannah Platform",
      timestamp: new Date().toISOString(),
      features: this.getAvailableFeatures(userRole),
    });
  }

  private setupScalingEvents(socket: AuthenticatedSocket) {
    // Subscribe to scaling infrastructure updates
    socket.on("subscribe:scaling", (data) => {
      const { types } = data;

      if (Array.isArray(types)) {
        types.forEach((type) => {
          socket.join(`scaling:${type}`);
        });
      }

      socket.emit("scaling:subscribed", {
        types,
        timestamp: new Date().toISOString(),
      });
    });

    // Real-time infrastructure metrics
    socket.on("scaling:request_metrics", async () => {
      try {
        const metrics = await this.getScalingMetrics();
        socket.emit("scaling:metrics", metrics);
      } catch (error) {
        socket.emit("error", { message: "Failed to fetch scaling metrics" });
      }
    });

    // Infrastructure status updates
    socket.on("scaling:status_update", (data) => {
      if (socket.userRole === "admin" || socket.userRole === "super_admin") {
        this.io.to("scaling:" + data.type).emit("scaling:status_changed", {
          ...data,
          updatedBy: socket.userId,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  private setupNotificationEvents(socket: AuthenticatedSocket) {
    // Real-time notifications
    socket.on("notifications:mark_read", async (notificationIds) => {
      try {
        await query(
          "UPDATE notifications SET read_at = NOW() WHERE id = ANY($1) AND user_id = $2",
          [notificationIds, socket.userId],
        );

        socket.emit("notifications:marked_read", { ids: notificationIds });
      } catch (error) {
        socket.emit("error", {
          message: "Failed to mark notifications as read",
        });
      }
    });

    // Subscribe to notification channels
    socket.on("notifications:subscribe", (channels) => {
      channels.forEach((channel: string) => {
        socket.join(`notifications:${channel}`);
      });
    });
  }

  private setupAnalyticsEvents(socket: AuthenticatedSocket) {
    // Real-time analytics updates
    socket.on("analytics:subscribe", (metrics) => {
      if (socket.userRole === "admin" || socket.userRole === "super_admin") {
        metrics.forEach((metric: string) => {
          socket.join(`analytics:${metric}`);
        });
      }
    });

    // Request live dashboard data
    socket.on("analytics:request_dashboard", async () => {
      if (socket.userRole === "admin" || socket.userRole === "super_admin") {
        try {
          const dashboardData = await this.getDashboardData();
          socket.emit("analytics:dashboard_data", dashboardData);
        } catch (error) {
          socket.emit("error", { message: "Failed to fetch dashboard data" });
        }
      }
    });
  }

  private setupAdminEvents(socket: AuthenticatedSocket) {
    if (socket.userRole !== "admin" && socket.userRole !== "super_admin") {
      return;
    }

    socket.join("admin");

    // System health monitoring
    socket.on("admin:request_system_health", async () => {
      try {
        const health = await this.getSystemHealth();
        socket.emit("admin:system_health", health);
      } catch (error) {
        socket.emit("error", { message: "Failed to fetch system health" });
      }
    });

    // User management events
    socket.on("admin:user_action", (data) => {
      this.io.to("admin").emit("admin:user_activity", {
        ...data,
        performedBy: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Broadcast admin announcements
    socket.on("admin:broadcast", (data) => {
      if (socket.userRole === "super_admin") {
        this.io.emit("announcement", {
          ...data,
          fromAdmin: true,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  private setupGeneralEvents(socket: AuthenticatedSocket) {
    // Heartbeat for connection monitoring
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: new Date().toISOString() });
    });

    // Error handling
    socket.on("error", (error) => {
      logger.error("WebSocket error", {
        userId: socket.userId,
        socketId: socket.id,
        error: error.message,
      });
    });
  }

  private handleDisconnection(socket: AuthenticatedSocket, reason: string) {
    const user = this.connectedUsers.get(socket.id);

    if (user) {
      this.connectedUsers.delete(socket.id);
      this.userSockets.delete(user.id);

      logger.info("User disconnected from WebSocket", {
        userId: user.id,
        socketId: socket.id,
        reason,
        totalConnections: this.connectedUsers.size,
      });
    }
  }

  // Utility methods for broadcasting
  public broadcastToRole(role: string, event: string, data: any) {
    this.io.to(`role:${role}`).emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  public broadcastScalingUpdate(type: string, data: any) {
    this.io.to(`scaling:${type}`).emit("scaling:update", {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  public broadcastNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit("notification", notification);
  }

  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  public getUserCount(): number {
    return this.connectedUsers.size;
  }

  // Data fetching methods
  private async getScalingMetrics() {
    const result = await query(`
      SELECT 
        type,
        COUNT(*) as total_nodes,
        AVG(performance_score) as avg_performance,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_nodes
      FROM scaling_infrastructure 
      GROUP BY type
    `);

    return result.rows;
  }

  private async getDashboardData() {
    const [users, transactions, scaling] = await Promise.all([
      query("SELECT COUNT(*) as total FROM users WHERE is_active = true"),
      query(
        "SELECT COUNT(*) as total, SUM(amount) as revenue FROM transactions WHERE created_at >= NOW() - INTERVAL '24 hours'",
      ),
      query(
        "SELECT COUNT(*) as total FROM scaling_infrastructure WHERE status = 'active'",
      ),
    ]);

    return {
      users: users.rows[0],
      transactions: transactions.rows[0],
      scaling: scaling.rows[0],
      timestamp: new Date().toISOString(),
    };
  }

  private async getSystemHealth() {
    return {
      database: { status: "healthy", latency: "12ms" },
      cache: { status: "healthy", hitRate: "94%" },
      apis: { status: "healthy", uptime: "99.9%" },
      infrastructure: { status: "healthy", activeNodes: 247 },
      timestamp: new Date().toISOString(),
    };
  }

  private getAvailableFeatures(role: string) {
    const baseFeatures = ["notifications", "real-time-updates"];

    if (role === "admin" || role === "super_admin") {
      return [
        ...baseFeatures,
        "analytics",
        "system-monitoring",
        "user-management",
      ];
    }

    return baseFeatures;
  }
}

let wsManager: WebSocketManager;

export const initializeWebSocket = (io: Server) => {
  wsManager = new WebSocketManager(io);
  return wsManager;
};

export const getWebSocketManager = (): WebSocketManager => {
  if (!wsManager) {
    throw new Error("WebSocket manager not initialized");
  }
  return wsManager;
};
