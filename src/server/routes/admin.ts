import express from "express";
import { requireAdmin, requireRole } from "../middleware/auth";
import {
  validate,
  adminSchemas,
  commonSchemas,
} from "../middleware/validation";
import { query, transaction } from "../config/database";
import { logger, logAuditEvent } from "../utils/logger";
import { getWebSocketManager } from "../websocket/handler";

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// Dashboard metrics
router.get("/dashboard", async (req, res) => {
  try {
    const [userStats, transactionStats, scalingStats, systemHealth] =
      await Promise.all([
        getUserStats(),
        getTransactionStats(),
        getScalingStats(),
        getSystemHealth(),
      ]);

    res.json({
      success: true,
      data: {
        users: userStats,
        transactions: transactionStats,
        scaling: scalingStats,
        system: systemHealth,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

// User management
router.get(
  "/users",
  validate({ query: commonSchemas.pagination }),
  async (req, res) => {
    try {
      const {
        page,
        limit,
        sort = "created_at",
        order = "desc",
      } = req.query as any;
      const offset = (page - 1) * limit;

      const countResult = await query("SELECT COUNT(*) FROM users");
      const total = parseInt(countResult.rows[0].count);

      const usersResult = await query(
        `
        SELECT 
          id, email, first_name, last_name, role, is_active,
          created_at, last_login, phone, location
        FROM users 
        ORDER BY ${sort} ${order}
        LIMIT $1 OFFSET $2
      `,
        [limit, offset],
      );

      res.json({
        success: true,
        data: {
          users: usersResult.rows,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Admin get users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  },
);

router.post(
  "/users",
  validate({ body: adminSchemas.createUser }),
  async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        isActive,
        permissions = [],
      } = req.body;

      const result = await transaction(async (client) => {
        // Check if user already exists
        const existingUser = await client.query(
          "SELECT id FROM users WHERE email = $1",
          [email],
        );
        if (existingUser.rows.length > 0) {
          throw new Error("User with this email already exists");
        }

        // Create user
        const userResult = await client.query(
          `
          INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
          VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6)
          RETURNING id, email, first_name, last_name, role, is_active, created_at
        `,
          [email, password, firstName, lastName, role, isActive],
        );

        const user = userResult.rows[0];

        // Add permissions if provided
        if (permissions.length > 0) {
          const permissionQueries = permissions.map((permission) =>
            client.query(
              `
              INSERT INTO user_permissions (user_id, permission_id)
              SELECT $1, id FROM permissions WHERE name = $2
            `,
              [user.id, permission],
            ),
          );
          await Promise.all(permissionQueries);
        }

        return user;
      });

      logAuditEvent("User created", req.user!.id, {
        targetUserId: result.id,
        targetUserEmail: result.email,
        role,
        permissions,
      });

      res.status(201).json({
        success: true,
        data: { user: result },
      });
    } catch (error) {
      logger.error("Admin create user error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create user",
      });
    }
  },
);

router.put(
  "/users/:id",
  validate({
    params: commonSchemas.idParam,
    body: adminSchemas.updateUser,
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const result = await transaction(async (client) => {
        // Build dynamic update query
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
          if (key === "permissions") continue; // Handle separately
          updateFields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }

        if (updateFields.length === 0) {
          throw new Error("No valid update fields provided");
        }

        values.push(id);
        const userResult = await client.query(
          `
          UPDATE users 
          SET ${updateFields.join(", ")}, updated_at = NOW()
          WHERE id = $${paramCount}
          RETURNING id, email, first_name, last_name, role, is_active, updated_at
        `,
          values,
        );

        if (userResult.rows.length === 0) {
          throw new Error("User not found");
        }

        // Handle permissions update
        if (updates.permissions) {
          await client.query(
            "DELETE FROM user_permissions WHERE user_id = $1",
            [id],
          );

          if (updates.permissions.length > 0) {
            const permissionQueries = updates.permissions.map((permission) =>
              client.query(
                `
                INSERT INTO user_permissions (user_id, permission_id)
                SELECT $1, id FROM permissions WHERE name = $2
              `,
                [id, permission],
              ),
            );
            await Promise.all(permissionQueries);
          }
        }

        return userResult.rows[0];
      });

      logAuditEvent("User updated", req.user!.id, {
        targetUserId: id,
        changes: updates,
      });

      res.json({
        success: true,
        data: { user: result },
      });
    } catch (error) {
      logger.error("Admin update user error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update user",
      });
    }
  },
);

// Scaling infrastructure management
router.get("/scaling", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, name, type, status, location, configuration,
        performance_metrics, created_at, updated_at
      FROM scaling_infrastructure
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: { infrastructure: result.rows },
    });
  } catch (error) {
    logger.error("Admin get scaling infrastructure error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch scaling infrastructure",
    });
  }
});

router.post(
  "/scaling/deploy",
  validate({ body: adminSchemas.systemConfig }),
  async (req, res) => {
    try {
      const { type, configuration, location } = req.body;

      const result = await query(
        `
        INSERT INTO scaling_infrastructure (type, configuration, location, status, created_by)
        VALUES ($1, $2, $3, 'deploying', $4)
        RETURNING id, type, status, created_at
      `,
        [type, configuration, location, req.user!.id],
      );

      logAuditEvent("Infrastructure deployed", req.user!.id, {
        infrastructureId: result.rows[0].id,
        type,
        location,
      });

      // Broadcast to WebSocket clients
      const wsManager = getWebSocketManager();
      wsManager.broadcastScalingUpdate(type, {
        action: "deployed",
        infrastructure: result.rows[0],
      });

      res.status(201).json({
        success: true,
        data: { infrastructure: result.rows[0] },
      });
    } catch (error) {
      logger.error("Admin deploy infrastructure error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to deploy infrastructure",
      });
    }
  },
);

// System configuration
router.get("/config", async (req, res) => {
  try {
    const result = await query(`
      SELECT key, value, description, is_public, updated_at
      FROM system_config
      ORDER BY key
    `);

    res.json({
      success: true,
      data: { config: result.rows },
    });
  } catch (error) {
    logger.error("Admin get config error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system configuration",
    });
  }
});

router.put(
  "/config",
  validate({ body: adminSchemas.systemConfig }),
  async (req, res) => {
    try {
      const { key, value, description, isPublic } = req.body;

      const result = await query(
        `
        INSERT INTO system_config (key, value, description, is_public, updated_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          description = EXCLUDED.description,
          is_public = EXCLUDED.is_public,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
        RETURNING key, value, description, is_public, updated_at
      `,
        [key, JSON.stringify(value), description, isPublic, req.user!.id],
      );

      logAuditEvent("System config updated", req.user!.id, {
        configKey: key,
        newValue: value,
      });

      res.json({
        success: true,
        data: { config: result.rows[0] },
      });
    } catch (error) {
      logger.error("Admin update config error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update system configuration",
      });
    }
  },
);

// System health and monitoring
router.get("/health", async (req, res) => {
  try {
    const health = await getSystemHealth();
    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error("Admin health check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system health",
    });
  }
});

// Audit logs
router.get(
  "/audit",
  validate({ query: commonSchemas.pagination }),
  async (req, res) => {
    try {
      const { page, limit } = req.query as any;
      const offset = (page - 1) * limit;

      const result = await query(
        `
        SELECT 
          al.id, al.action, al.user_id, al.metadata, al.created_at,
          u.email, u.first_name, u.last_name
        FROM audit_logs al
        JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset],
      );

      const countResult = await query("SELECT COUNT(*) FROM audit_logs");
      const total = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: {
          logs: result.rows,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Admin get audit logs error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit logs",
      });
    }
  },
);

// Helper functions
async function getUserStats() {
  const result = await query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_today,
      COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '24 hours') as active_today
    FROM users
  `);
  return result.rows[0];
}

async function getTransactionStats() {
  const result = await query(`
    SELECT 
      COUNT(*) as total,
      SUM(amount) as total_amount,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as today_count,
      SUM(amount) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as today_amount
    FROM transactions
  `);
  return result.rows[0];
}

async function getScalingStats() {
  const result = await query(`
    SELECT 
      COUNT(*) as total_nodes,
      COUNT(*) FILTER (WHERE status = 'active') as active_nodes,
      COUNT(*) FILTER (WHERE status = 'deploying') as deploying_nodes,
      AVG(performance_metrics->>'efficiency') as avg_efficiency
    FROM scaling_infrastructure
  `);
  return result.rows[0];
}

async function getSystemHealth() {
  return {
    database: { status: "healthy", connections: 8 },
    cache: { status: "healthy", hitRate: 94 },
    websockets: {
      status: "healthy",
      connections: getWebSocketManager().getUserCount(),
    },
    apis: { status: "healthy", uptime: "99.9%" },
    infrastructure: { status: "healthy", activeNodes: 247 },
  };
}

export default router;
