import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  validate,
  scalingSchemas,
  commonSchemas,
} from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import { query, transaction } from "../config/database";
import { scalingLogger } from "../utils/logger";
import { getWebSocketManager } from "../websocket/handler";

// Use shared AuthenticatedRequest interface from types
import { AuthenticatedRequest } from "../types";

interface MetricsRequestBody {
  metrics: {
    efficiency?: number;
    uptime?: number;
    coverage?: number;
    [key: string]: number | undefined;
  };
}

interface MetricsRequest extends Request {
  body: MetricsRequestBody;
}

interface InfrastructureMetrics {
  [key: string]: number;
}

interface ScalingInfrastructure {
  id: string;
  name: string;
  type: string;
  status: string;
  location: any;
  configuration?: any;
  performance_metrics?: InfrastructureMetrics;
  created_at: string;
  updated_at?: string;
}

const router = Router();

// Get all scaling infrastructure
router.get(
  "/",
  validate({ query: commonSchemas.pagination }),
  async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        sort = "created_at",
        order = "desc",
      } = req.query as any;
      const offset = (page - 1) * limit;

      const result = await query(
        `
        SELECT
          id, name, type, status, location,
          performance_metrics, created_at, updated_at,
          CASE
            WHEN status = 'active' THEN 1
            WHEN status = 'deploying' THEN 2
            WHEN status = 'maintenance' THEN 3
            ELSE 4
          END as status_priority
        FROM scaling_infrastructure
        ORDER BY status_priority, ${sort} ${order}
        LIMIT $1 OFFSET $2
      `,
        [limit, offset],
      );

      const countResult = await query(
        "SELECT COUNT(*) FROM scaling_infrastructure",
      );
      const total = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: {
          infrastructure: result.rows,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      scalingLogger.error("Get scaling infrastructure error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch scaling infrastructure",
      });
    }
  },
);

// Get infrastructure by type
router.get("/type/:type", async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    const result = await query(
      `
      SELECT
        id, name, type, status, location, configuration,
        performance_metrics, created_at, updated_at
      FROM scaling_infrastructure
      WHERE type = $1
      ORDER BY
        CASE
          WHEN status = 'active' THEN 1
          WHEN status = 'deploying' THEN 2
          WHEN status = 'maintenance' THEN 3
          ELSE 4
        END, created_at DESC
    `,
      [type],
    );

    res.json({
      success: true,
      data: { infrastructure: result.rows },
    });
  } catch (error) {
    scalingLogger.error("Get infrastructure by type error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch infrastructure by type",
    });
  }
});

// Get specific infrastructure details
router.get(
  "/:id",
  validate({ params: commonSchemas.idParam }),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await query(
        `
        SELECT
          si.*,
          u.email as created_by_email,
          u.first_name, u.last_name
        FROM scaling_infrastructure si
        LEFT JOIN users u ON si.created_by = u.id
        WHERE si.id = $1
      `,
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Infrastructure not found",
        });
      }

      // Get related metrics
      const metricsResult = await query(
        `
        SELECT metric_name, value, recorded_at
        FROM infrastructure_metrics
        WHERE infrastructure_id = $1
        ORDER BY recorded_at DESC
        LIMIT 50
      `,
        [id],
      );

      res.json({
        success: true,
        data: {
          infrastructure: result.rows[0],
          metrics: metricsResult.rows,
        },
      });
    } catch (error) {
      scalingLogger.error("Get infrastructure details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch infrastructure details",
      });
    }
  },
);

// Create new infrastructure (admin only)
router.post(
  "/",
  requireRole(["admin", "super_admin"]),
  validate({ body: scalingSchemas.createBiomeExpansion }),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, type, location, configuration, isActive } = req.body;

      const result = await transaction(async (client) => {
        const infraResult = await client.query(
          `
          INSERT INTO scaling_infrastructure
          (name, type, location, configuration, status, created_by)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, name, type, status, location, created_at
        `,
          [
            name,
            type,
            JSON.stringify(location),
            JSON.stringify(configuration),
            isActive ? "deploying" : "inactive",
            req.user.id,
          ],
        );

        const infrastructure = infraResult.rows[0];

        // Initialize performance metrics
        await client.query(
          `
          INSERT INTO infrastructure_metrics
          (infrastructure_id, metric_name, value)
          VALUES
          ($1, 'efficiency', 0),
          ($1, 'uptime', 0),
          ($1, 'coverage', 0)
        `,
          [infrastructure.id],
        );

        return infrastructure;
      });

      scalingLogger.info("Infrastructure created", {
        infrastructureId: result.id,
        type,
        createdBy: req.user.id,
      });

      // Broadcast to WebSocket clients
      const wsManager = getWebSocketManager();
      wsManager.broadcastScalingUpdate(type, {
        action: "created",
        infrastructure: result,
      });

      res.status(201).json({
        success: true,
        data: { infrastructure: result },
      });
    } catch (error) {
      scalingLogger.error("Create infrastructure error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create infrastructure",
      });
    }
  },
);

// Update infrastructure
router.put(
  "/:id",
  requireRole(["admin", "super_admin"]),
  validate({
    params: commonSchemas.idParam,
    body: scalingSchemas.updateInfrastructure,
  }),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const result = await transaction(async (client) => {
        // Build dynamic update query
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
          if (key === "configuration" || key === "metadata") {
            updateFields.push(`${key} = $${paramCount}`);
            values.push(JSON.stringify(value));
          } else {
            updateFields.push(`${key} = $${paramCount}`);
            values.push(value);
          }
          paramCount++;
        }

        if (updateFields.length === 0) {
          throw new Error("No valid update fields provided");
        }

        values.push(id);
        values.push(req.user.id);

        const infraResult = await client.query(
          `
          UPDATE scaling_infrastructure
          SET ${updateFields.join(", ")}, updated_at = NOW(), updated_by = $${paramCount}
          WHERE id = $${paramCount - 1}
          RETURNING id, name, type, status, location, updated_at
        `,
          values,
        );

        if (infraResult.rows.length === 0) {
          throw new Error("Infrastructure not found");
        }

        return infraResult.rows[0];
      });

      scalingLogger.info("Infrastructure updated", {
        infrastructureId: id,
        updates,
        updatedBy: req.user.id,
      });

      // Broadcast update
      const wsManager = getWebSocketManager();
      wsManager.broadcastScalingUpdate(result.type, {
        action: "updated",
        infrastructure: result,
      });

      res.json({
        success: true,
        data: { infrastructure: result },
      });
    } catch (error) {
      scalingLogger.error("Update infrastructure error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update infrastructure",
      });
    }
  },
);

// Record infrastructure metrics
router.post(
  "/:id/metrics",
  validate({
    params: commonSchemas.idParam,
    body: z.object({
      metrics: z.record(z.number()),
    }),
  }),
  async (req: MetricsRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { metrics } = req.body;

      if (!metrics || typeof metrics !== "object") {
        return res.status(400).json({
          success: false,
          message: "Metrics object required",
        });
      }

      const result = await transaction(async (client) => {
        const insertPromises = Object.entries(metrics).map(
          ([metricName, value]) =>
            client.query(
              `
            INSERT INTO infrastructure_metrics
            (infrastructure_id, metric_name, value)
            VALUES ($1, $2, $3)
          `,
              [id, metricName, value],
            ),
        );

        await Promise.all(insertPromises);

        // Update aggregate performance metrics
        await client.query(
          `
          UPDATE scaling_infrastructure
          SET
            performance_metrics = $1,
            updated_at = NOW()
          WHERE id = $2
        `,
          [JSON.stringify(metrics), id],
        );

        return { recorded: Object.keys(metrics).length };
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      scalingLogger.error("Record metrics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record metrics",
      });
    }
  },
);

// Get infrastructure metrics
router.get(
  "/:id/metrics",
  validate({ params: commonSchemas.idParam }),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { timeframe = "24h" } = req.query;

      let interval;
      switch (timeframe) {
        case "1h":
          interval = "1 hour";
          break;
        case "24h":
          interval = "24 hours";
          break;
        case "7d":
          interval = "7 days";
          break;
        case "30d":
          interval = "30 days";
          break;
        default:
          interval = "24 hours";
      }

      const result = await query(
        `
        SELECT
          metric_name,
          AVG(value::numeric) as avg_value,
          MIN(value::numeric) as min_value,
          MAX(value::numeric) as max_value,
          COUNT(*) as data_points
        FROM infrastructure_metrics
        WHERE infrastructure_id = $1
          AND recorded_at >= NOW() - INTERVAL '${interval}'
        GROUP BY metric_name
        ORDER BY metric_name
      `,
        [id],
      );

      const timeSeriesResult = await query(
        `
        SELECT
          metric_name, value, recorded_at
        FROM infrastructure_metrics
        WHERE infrastructure_id = $1
          AND recorded_at >= NOW() - INTERVAL '${interval}'
        ORDER BY recorded_at DESC
        LIMIT 1000
      `,
        [id],
      );

      res.json({
        success: true,
        data: {
          summary: result.rows,
          timeSeries: timeSeriesResult.rows,
          timeframe,
        },
      });
    } catch (error) {
      scalingLogger.error("Get metrics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch metrics",
      });
    }
  },
);

// Phase deployment management
router.post(
  "/phases/deploy",
  requireRole(["admin", "super_admin"]),
  validate({ body: scalingSchemas.deployPhase }),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { phaseId, terrain, techStack, bioIntegration, targetMetrics } =
        req.body;

      const result = await transaction(async (client) => {
        const phaseResult = await client.query(
          `
          INSERT INTO deployment_phases
          (phase_id, terrain, tech_stack, bio_integration, target_metrics, status, created_by)
          VALUES ($1, $2, $3, $4, $5, 'planning', $6)
          RETURNING id, phase_id, terrain, status, created_at
        `,
          [
            phaseId,
            terrain,
            JSON.stringify(techStack),
            bioIntegration,
            JSON.stringify(targetMetrics),
            req.user.id,
          ],
        );

        return phaseResult.rows[0];
      });

      scalingLogger.info("Phase deployment initiated", {
        phaseId,
        terrain,
        deployedBy: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: { phase: result },
      });
    } catch (error) {
      scalingLogger.error("Deploy phase error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to deploy phase",
      });
    }
  },
);

// Get deployment phases
router.get("/phases", async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT
        dp.*,
        COUNT(si.id) as infrastructure_count,
        AVG((si.performance_metrics->>'efficiency')::numeric) as avg_efficiency
      FROM deployment_phases dp
      LEFT JOIN scaling_infrastructure si ON si.deployment_phase = dp.id
      GROUP BY dp.id
      ORDER BY dp.created_at DESC
    `);

    res.json({
      success: true,
      data: { phases: result.rows },
    });
  } catch (error) {
    scalingLogger.error("Get phases error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch phases",
    });
  }
});
// Export the router as a named export for consistency with other modules
export { router as scalingRoutes };
