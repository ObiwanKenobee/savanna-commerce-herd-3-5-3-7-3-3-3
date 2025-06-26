import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { validate, commonSchemas } from "../middleware/validation";
import { query, transaction } from "../config/database";
import { logger } from "../utils/logger";
import {
  granaryService,
  drumsService,
  juaKaliService,
  aqueductsService,
} from "../services/africanHeritage";
import { z } from "zod";

const router = express.Router();

// Validation schemas for African Heritage features
const granarySchemas = {
  updateSilo: z.object({
    humidity: z.number().min(0).max(100),
    temperature: z.number().min(-10).max(60),
    ventilation: z.number().min(0).max(10),
    termite_activity: z.number().min(0).max(1),
  }),

  createGranary: z.object({
    product_id: z.string().uuid(),
    warehouse_location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      description: z.string().max(200),
    }),
    current_stock: z.number().min(0),
    termite_algorithm_config: z.record(z.any()).optional(),
  }),
};

const drumsSchemas = {
  transmitMessage: z.object({
    source_node: z.string().max(50),
    destination_node: z.string().max(50).optional(),
    message_type: z.enum([
      "price_update",
      "stock_alert",
      "transaction",
      "news",
    ]),
    content: z.record(z.any()),
    priority: z.number().min(1).max(5).default(1),
  }),

  createNode: z.object({
    node_id: z.string().max(50),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      description: z.string(),
    }),
    drum_frequency_range: z.object({
      low_hz: z.number().min(20),
      high_hz: z.number().max(20000),
    }),
    transmission_radius_km: z.number().min(1).max(100).default(50),
  }),
};

const manufacturingSchemas = {
  createWorkshop: z.object({
    workshop_name: z.string().min(1).max(200),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      description: z.string(),
    }),
    specialization: z.enum([
      "3d_printing",
      "metalwork",
      "electronics",
      "textiles",
    ]),
    equipment: z.array(z.string()),
    recycling_materials: z.array(z.string()),
  }),

  createOrder: z.object({
    workshop_id: z.string().uuid(),
    product_specification: z.record(z.any()),
    materials_required: z.record(z.any()),
    quantity: z.number().min(1),
  }),
};

// === GRANARY INVENTORY ROUTES (Benin-inspired) ===

// Get all granaries for user
router.get("/granary", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        gi.*,
        COUNT(ios.id) as sensor_count,
        AVG(ios.current_value) FILTER (WHERE ios.sensor_type = 'humidity') as avg_humidity,
        AVG(ios.current_value) FILTER (WHERE ios.sensor_type = 'temperature') as avg_temperature
      FROM granary_inventory gi
      LEFT JOIN iot_silo_sensors ios ON gi.id = ios.granary_id
      WHERE gi.created_by = $1
      GROUP BY gi.id
      ORDER BY gi.preservation_score DESC
    `,
      [req.user!.id],
    );

    res.json({
      success: true,
      data: { granaries: result.rows },
    });
  } catch (error) {
    logger.error("Get granaries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch granaries",
    });
  }
});

// Create new granary
router.post(
  "/granary",
  authMiddleware,
  validate({ body: granarySchemas.createGranary }),
  async (req, res) => {
    try {
      const {
        product_id,
        warehouse_location,
        current_stock,
        termite_algorithm_config,
      } = req.body;

      // Calculate optimal stock using termite algorithm
      const productResult = await query(
        "SELECT type FROM products WHERE id = $1",
        [product_id],
      );
      const productType = productResult.rows[0]?.type || "generic";

      const optimal_stock = await granaryService.calculateOptimalStock(
        product_id,
        productType,
      );

      const result = await query(
        `
        INSERT INTO granary_inventory
        (product_id, warehouse_location, current_stock, optimal_stock, termite_algorithm_config, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, product_id, current_stock, optimal_stock, preservation_score, created_at
      `,
        [
          product_id,
          JSON.stringify(warehouse_location),
          current_stock,
          optimal_stock,
          JSON.stringify(termite_algorithm_config || {}),
          req.user!.id,
        ],
      );

      res.status(201).json({
        success: true,
        data: { granary: result.rows[0] },
      });
    } catch (error) {
      logger.error("Create granary error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create granary",
      });
    }
  },
);

// Update silo conditions from IoT sensors
router.post(
  "/granary/:id/sensors",
  authMiddleware,
  validate({
    params: commonSchemas.idParam,
    body: granarySchemas.updateSilo,
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const sensorData = req.body;

      await granaryService.updateSiloConditions(id, sensorData);

      res.json({
        success: true,
        message: "Silo conditions updated successfully",
      });
    } catch (error) {
      logger.error("Update silo conditions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update silo conditions",
      });
    }
  },
);

// === TALKING DRUMS NETWORK ROUTES (Yoruba-inspired) ===

// Get drum network status
router.get("/drums/network", authMiddleware, async (req, res) => {
  try {
    const [nodesResult, messagesResult] = await Promise.all([
      query(`
        SELECT
          node_id, location, status, solar_charge_level, transmission_radius_km,
          array_length(mesh_connections::text[], 1) as connection_count
        FROM drum_network_nodes
        WHERE status = 'active'
        ORDER BY solar_charge_level DESC
      `),
      query(`
        SELECT
          message_type, status, COUNT(*) as count
        FROM drum_messages
        WHERE transmitted_at >= NOW() - INTERVAL '24 hours'
        GROUP BY message_type, status
      `),
    ]);

    res.json({
      success: true,
      data: {
        nodes: nodesResult.rows,
        messageStats: messagesResult.rows,
        networkHealth: nodesResult?.rows
          ? calculateNetworkHealth(nodesResult.rows)
          : 0,
      },
    });
  } catch (error) {
    logger.error("Get drum network error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch drum network status",
    });
  }
});

// Transmit message through drum network
router.post(
  "/drums/transmit",
  authMiddleware,
  validate({ body: drumsSchemas.transmitMessage }),
  async (req, res) => {
    try {
      const messageData = req.body;
      const encodedMessage = drumsService.encodeTransaction(messageData);

      await drumsService.transmitMessage(messageData.source_node, {
        ...encodedMessage,
        type: messageData.message_type,
        content: messageData.content,
        destination: messageData.destination_node,
      });

      res.json({
        success: true,
        data: {
          messageId: encodedMessage.messageId,
          rhythm: encodedMessage.rhythm,
          estimatedDelivery: "2-5 minutes",
        },
      });
    } catch (error) {
      logger.error("Drum transmission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to transmit drum message",
      });
    }
  },
);

// Create new drum network node
router.post(
  "/drums/nodes",
  requireRole(["admin"]),
  validate({ body: drumsSchemas.createNode }),
  async (req, res) => {
    try {
      const {
        node_id,
        location,
        drum_frequency_range,
        transmission_radius_km,
      } = req.body;

      const result = await query(
        `
        INSERT INTO drum_network_nodes
        (node_id, location, drum_frequency_range, transmission_radius_km)
        VALUES ($1, $2, $3, $4)
        RETURNING id, node_id, location, status, created_at
      `,
        [
          node_id,
          JSON.stringify(location),
          JSON.stringify(drum_frequency_range),
          transmission_radius_km,
        ],
      );

      res.status(201).json({
        success: true,
        data: { node: result.rows[0] },
      });
    } catch (error) {
      logger.error("Create drum node error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create drum node",
      });
    }
  },
);

// === JUA KALI MANUFACTURING ROUTES (Mbeya iron smelting-inspired) ===

// Get all workshops
router.get("/manufacturing/workshops", authMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        jkw.*,
        COUNT(mo.id) as total_orders,
        AVG(mo.quality_score) as avg_quality,
        SUM(mo.carbon_footprint) as total_carbon_saved
      FROM jua_kali_workshops jkw
      LEFT JOIN manufacturing_orders mo ON jkw.id = mo.workshop_id
      WHERE jkw.is_verified = true
      GROUP BY jkw.id
      ORDER BY jkw.efficiency_score DESC
    `);

    res.json({
      success: true,
      data: { workshops: result.rows },
    });
  } catch (error) {
    logger.error("Get workshops error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workshops",
    });
  }
});

// Create workshop
router.post(
  "/manufacturing/workshops",
  authMiddleware,
  validate({ body: manufacturingSchemas.createWorkshop }),
  async (req, res) => {
    try {
      const workshopData = req.body;

      const result = await query(
        `
        INSERT INTO jua_kali_workshops
        (workshop_name, location, specialization, equipment, recycling_materials, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, workshop_name, specialization, created_at
      `,
        [
          workshopData.workshop_name,
          JSON.stringify(workshopData.location),
          workshopData.specialization,
          JSON.stringify(workshopData.equipment),
          JSON.stringify(workshopData.recycling_materials),
          req.user!.id,
        ],
      );

      res.status(201).json({
        success: true,
        data: { workshop: result.rows[0] },
      });
    } catch (error) {
      logger.error("Create workshop error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create workshop",
      });
    }
  },
);

// Calculate manufacturing cost
router.post(
  "/manufacturing/quote",
  authMiddleware,
  validate({ body: manufacturingSchemas.createOrder }),
  async (req, res) => {
    try {
      const { workshop_id, product_specification } = req.body;

      const costAnalysis = await juaKaliService.calculateManufacturingCost(
        product_specification,
        workshop_id,
      );

      res.json({
        success: true,
        data: { quote: costAnalysis },
      });
    } catch (error) {
      logger.error("Manufacturing quote error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate manufacturing quote",
      });
    }
  },
);

// Create manufacturing order
router.post(
  "/manufacturing/orders",
  authMiddleware,
  validate({ body: manufacturingSchemas.createOrder }),
  async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        orderedBy: req.user!.id,
      };

      const orderId = await juaKaliService.createManufacturingOrder(orderData);

      res.status(201).json({
        success: true,
        data: { orderId },
      });
    } catch (error) {
      logger.error("Create manufacturing order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create manufacturing order",
      });
    }
  },
);

// === INDIGENOUS KNOWLEDGE ROUTES (Timbuktu-inspired) ===

// Get indigenous knowledge NFTs
router.get("/knowledge", async (req, res) => {
  try {
    const { knowledge_type, language_code = "sw" } = req.query;

    let whereClause = "WHERE verification_status = 'verified'";
    const params: any[] = [];

    if (knowledge_type) {
      whereClause += " AND knowledge_type = $1";
      params.push(knowledge_type);
    }

    if (language_code && language_code !== "all") {
      whereClause += ` AND language_code = $${params.length + 1}`;
      params.push(language_code);
    }

    const result = await query(
      `
      SELECT
        ikn.*,
        u.first_name, u.last_name,
        COUNT(kul.id) as usage_count,
        AVG(kul.feedback_rating) as avg_rating
      FROM indigenous_knowledge_nfts ikn
      JOIN users u ON ikn.contributor_id = u.id
      LEFT JOIN knowledge_usage_logs kul ON ikn.id = kul.nft_id
      ${whereClause}
      GROUP BY ikn.id, u.first_name, u.last_name
      ORDER BY ikn.created_at DESC
    `,
      params,
    );

    res.json({
      success: true,
      data: { knowledge: result.rows },
    });
  } catch (error) {
    logger.error("Get indigenous knowledge error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch indigenous knowledge",
    });
  }
});

// Submit new indigenous knowledge
router.post("/knowledge", authMiddleware, async (req, res) => {
  try {
    const {
      knowledge_type,
      title,
      description,
      knowledge_content,
      community_source,
      geographical_origin,
      language_code = "sw",
    } = req.body;

    const tokenId = `KNOW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await query(
      `
        INSERT INTO indigenous_knowledge_nfts
        (nft_token_id, knowledge_type, title, description, knowledge_content,
         community_source, geographical_origin, language_code, contributor_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, nft_token_id, title, verification_status, created_at
      `,
      [
        tokenId,
        knowledge_type,
        title,
        description,
        JSON.stringify(knowledge_content),
        community_source,
        JSON.stringify(geographical_origin),
        language_code,
        req.user!.id,
      ],
    );

    res.status(201).json({
      success: true,
      data: { knowledge: result.rows[0] },
    });
  } catch (error) {
    logger.error("Submit knowledge error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit indigenous knowledge",
    });
  }
});

// Helper function for network health calculation
function calculateNetworkHealth(nodes: any[]): any {
  const totalNodes = nodes.length;
  const activeNodes = nodes.filter((n) => n.status === "active").length;
  const avgCharge =
    nodes.reduce((sum, n) => sum + n.solar_charge_level, 0) / totalNodes;
  const avgConnections =
    nodes.reduce((sum, n) => sum + (n.connection_count || 0), 0) / totalNodes;

  return {
    healthScore: Math.round(
      (activeNodes / totalNodes) * 50 +
        (avgCharge / 100) * 30 +
        (avgConnections / 10) * 20,
    ),
    totalNodes,
    activeNodes,
    avgCharge: Math.round(avgCharge),
    avgConnections: Math.round(avgConnections),
  };
}

export default router;
