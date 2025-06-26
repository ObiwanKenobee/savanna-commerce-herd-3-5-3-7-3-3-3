import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../config/database";
import { logger } from "../utils/logger";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { generateNFTCertificate } from "../services/blockchain";
import { trackConservationImpact } from "../services/conservation";
import { sendUSSDUpdate } from "../services/ussd";

const router = Router();

// Validation schemas
const purchaseSchema = z.object({
  orderId: z.string(),
  purchaseAmount: z.number().positive(),
  habitatAreaProtected: z.number().positive().default(10.0),
  carbonOffset: z.number().positive().default(2.5),
  conservationProject: z.string().optional(),
  gpsCoordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

const ussdTrackingSchema = z.object({
  phoneNumber: z.string(),
  userId: z.string().uuid().optional(),
});

// Record purchase for Lion Loyalty Program
router.post(
  "/purchase",
  authenticateToken,
  validate(purchaseSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const purchaseData = req.body;

      // Start transaction
      const client = await db.getClient();
      try {
        await client.query("BEGIN");

        // Insert purchase record
        const purchaseResult = await client.query(
          `
        INSERT INTO lion_loyalty_purchases (
          user_id, order_id, purchase_amount, habitat_area_protected, 
          carbon_offset, conservation_project, gps_coordinates
        ) VALUES ($1, $2, $3, $4, $5, $6, ST_Point($7, $8))
        RETURNING id, created_at
      `,
          [
            userId,
            purchaseData.orderId,
            purchaseData.purchaseAmount,
            purchaseData.habitatAreaProtected,
            purchaseData.carbonOffset,
            purchaseData.conservationProject,
            purchaseData.gpsCoordinates?.longitude || null,
            purchaseData.gpsCoordinates?.latitude || null,
          ],
        );

        const purchase = purchaseResult.rows[0];

        // Generate NFT certificate
        const nftResult = await generateNFTCertificate({
          userId,
          purchaseId: purchase.id,
          habitatProtected: purchaseData.habitatAreaProtected,
          carbonOffset: purchaseData.carbonOffset,
          purchaseAmount: purchaseData.purchaseAmount,
        });

        // Update purchase with NFT and blockchain info
        await client.query(
          `
        UPDATE lion_loyalty_purchases 
        SET nft_certificate_id = $1, blockchain_tx_hash = $2
        WHERE id = $3
      `,
          [nftResult.nftId, nftResult.txHash, purchase.id],
        );

        // Track conservation impact
        await trackConservationImpact({
          userId,
          purchaseId: purchase.id,
          habitatArea: purchaseData.habitatAreaProtected,
          carbonOffset: purchaseData.carbonOffset,
          projectName: purchaseData.conservationProject,
        });

        await client.query("COMMIT");

        // Get user phone for USSD notification
        const userResult = await db.query(
          "SELECT phone_number FROM users WHERE id = $1",
          [userId],
        );
        const phoneNumber = userResult.rows[0]?.phone_number;

        // Send USSD notification if phone number exists
        if (phoneNumber) {
          await sendUSSDUpdate(
            phoneNumber,
            `🦁 Thank you! Your purchase protected ${purchaseData.habitatAreaProtected}m² of lion habitat. Text *384*WILD# to track impact.`,
          );
        }

        logger.info("Lion Loyalty purchase recorded", {
          userId,
          purchaseId: purchase.id,
          habitatProtected: purchaseData.habitatAreaProtected,
        });

        res.status(201).json({
          message: "Purchase recorded successfully",
          purchase: {
            id: purchase.id,
            habitatProtected: purchaseData.habitatAreaProtected,
            carbonOffset: purchaseData.carbonOffset,
            nftCertificateId: nftResult.nftId,
            blockchainTxHash: nftResult.txHash,
            createdAt: purchase.created_at,
          },
          conservationImpact: {
            totalHabitatProtected: purchaseData.habitatAreaProtected,
            carbonOffsetAchieved: purchaseData.carbonOffset,
            estimatedLionsSupported: Math.ceil(
              purchaseData.habitatAreaProtected / 10000,
            ),
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Lion Loyalty purchase error:", error);
      res.status(500).json({
        error: "Purchase recording failed",
        message: "Failed to record Lion Loyalty purchase",
      });
    }
  },
);

// Get user's conservation impact
router.get(
  "/impact/:userId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const requestUserId = (req as any).user.userId;

      // Check authorization (users can only see their own data unless admin)
      if (userId !== requestUserId && (req as any).user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied",
          message: "You can only view your own conservation impact",
        });
      }

      // Get total impact metrics
      const impactResult = await db.query(
        `
      SELECT 
        COUNT(*) as total_purchases,
        SUM(habitat_area_protected) as total_habitat_protected,
        SUM(carbon_offset) as total_carbon_offset,
        SUM(purchase_amount) as total_spent,
        MIN(created_at) as first_purchase,
        MAX(created_at) as latest_purchase
      FROM lion_loyalty_purchases 
      WHERE user_id = $1
    `,
        [userId],
      );

      const impact = impactResult.rows[0];

      // Get recent purchases
      const recentPurchasesResult = await db.query(
        `
      SELECT 
        id, order_id, purchase_amount, habitat_area_protected, 
        carbon_offset, conservation_project, nft_certificate_id,
        created_at
      FROM lion_loyalty_purchases 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `,
        [userId],
      );

      // Calculate derived metrics
      const estimatedLionsSupported = Math.ceil(
        (impact.total_habitat_protected || 0) / 10000,
      );
      const rangersFunded = Math.ceil(
        (impact.total_habitat_protected || 0) / 1000,
      );
      const treesEquivalent = Math.ceil(
        (impact.total_carbon_offset || 0) / 0.025,
      ); // Assuming 25kg CO2 per tree

      res.json({
        userId,
        conservationImpact: {
          totalPurchases: parseInt(impact.total_purchases),
          totalHabitatProtected: parseFloat(
            impact.total_habitat_protected || 0,
          ),
          totalCarbonOffset: parseFloat(impact.total_carbon_offset || 0),
          totalSpent: parseFloat(impact.total_spent || 0),
          estimatedLionsSupported,
          rangersFunded,
          treesEquivalent,
          firstPurchase: impact.first_purchase,
          latestPurchase: impact.latest_purchase,
        },
        recentPurchases: recentPurchasesResult.rows,
        achievements: {
          conservationChampion: impact.total_habitat_protected >= 100000, // 10 hectares
          carbonNeutral: impact.total_carbon_offset >= 1000, // 1 ton CO2
          prideLeader: impact.total_purchases >= 50,
          habitatGuardian: impact.total_habitat_protected >= 50000, // 5 hectares
        },
      });
    } catch (error) {
      logger.error("Conservation impact retrieval error:", error);
      res.status(500).json({
        error: "Impact retrieval failed",
        message: "Failed to retrieve conservation impact data",
      });
    }
  },
);

// USSD wildlife tracking endpoint
router.post(
  "/ussd-tracking",
  validate(ussdTrackingSchema),
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber, userId } = req.body;

      // Find user by phone or use provided userId
      let userRecord;
      if (userId) {
        const result = await db.query(
          "SELECT id, first_name, phone_number FROM users WHERE id = $1",
          [userId],
        );
        userRecord = result.rows[0];
      } else {
        const result = await db.query(
          "SELECT id, first_name, phone_number FROM users WHERE phone_number = $1",
          [phoneNumber],
        );
        userRecord = result.rows[0];
      }

      if (!userRecord) {
        return res.json({
          message: `Welcome to Savannah Wildlife Tracking!\n\nNo account found for ${phoneNumber}.\n\nReply:\n1. Register account\n2. Track as guest\n0. Exit`,
        });
      }

      // Get conservation impact
      const impactResult = await db.query(
        `
      SELECT 
        COUNT(*) as purchases,
        SUM(habitat_area_protected) as habitat_protected,
        SUM(carbon_offset) as carbon_offset
      FROM lion_loyalty_purchases 
      WHERE user_id = $1
    `,
        [userRecord.id],
      );

      const impact = impactResult.rows[0];
      const habitatProtected = parseFloat(impact.habitat_protected || 0);
      const carbonOffset = parseFloat(impact.carbon_offset || 0);
      const lionsSupported = Math.ceil(habitatProtected / 10000);
      const rangersFunded = Math.ceil(habitatProtected / 1000);

      // Get latest conservation project update
      const projectResult = await db.query(
        `
      SELECT conservation_project, created_at
      FROM lion_loyalty_purchases 
      WHERE user_id = $1 AND conservation_project IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
        [userRecord.id],
      );

      const latestProject = projectResult.rows[0];

      const response = `🦁 WILDLIFE IMPACT - ${userRecord.first_name}

🌍 CONSERVATION STATS:
• ${habitatProtected.toFixed(0)}m² habitat protected
• ${lionsSupported} lions supported
• ${rangersFunded} rangers funded
• ${carbonOffset.toFixed(1)}kg CO² offset

${latestProject ? `📍 LATEST PROJECT:\n${latestProject.conservation_project}\n` : ""}
🗓️ Updated: ${new Date().toLocaleDateString()}

Reply:
1. Real-time tracking
2. View certificates  
3. Adopt wildlife
0. Main menu`;

      res.json({
        message: response,
        userData: {
          userId: userRecord.id,
          impactMetrics: {
            habitatProtected,
            carbonOffset,
            lionsSupported,
            rangersFunded,
          },
        },
      });
    } catch (error) {
      logger.error("USSD tracking error:", error);
      res.status(500).json({
        error: "USSD tracking failed",
        message:
          "SERVICE TEMPORARILY UNAVAILABLE\n\nPlease try again later.\n\nFor support call: +254-XXX-XXXX",
      });
    }
  },
);

// Get real-time satellite updates
router.get(
  "/satellite-updates/:userId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const requestUserId = (req as any).user.userId;

      // Check authorization
      if (userId !== requestUserId && (req as any).user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied",
          message: "Unauthorized access to satellite data",
        });
      }

      // Get user's protected areas
      const areasResult = await db.query(
        `
      SELECT 
        conservation_project,
        ST_AsGeoJSON(gps_coordinates) as coordinates,
        habitat_area_protected,
        created_at
      FROM lion_loyalty_purchases 
      WHERE user_id = $1 AND gps_coordinates IS NOT NULL
      ORDER BY created_at DESC
    `,
        [userId],
      );

      // Simulate satellite data (in production, integrate with real satellite APIs)
      const satelliteUpdates = await Promise.all(
        areasResult.rows.map(async (area) => {
          const coords = JSON.parse(area.coordinates);

          // Mock satellite monitoring data
          return {
            project: area.conservation_project,
            coordinates: coords,
            areaProtected: area.habitat_area_protected,
            satelliteData: {
              lastUpdate: new Date().toISOString(),
              vegetationIndex: 0.75 + Math.random() * 0.2, // NDVI
              animalActivity: Math.floor(Math.random() * 20) + 5,
              waterSources: Math.floor(Math.random() * 3) + 1,
              humanEncroachment: Math.random() < 0.1 ? "Detected" : "None",
              weatherCondition: ["Clear", "Partly Cloudy", "Overcast"][
                Math.floor(Math.random() * 3)
              ],
              temperature: 25 + Math.random() * 10,
            },
            conservationStatus: {
              habitatHealth: Math.floor(85 + Math.random() * 15),
              wildlifePopulation: "Stable",
              threats: Math.random() < 0.2 ? ["Poaching Activity"] : [],
              recentActivity: "Lion pride sighted 2 days ago",
            },
          };
        }),
      );

      res.json({
        userId,
        lastUpdated: new Date().toISOString(),
        totalAreasMonitored: satelliteUpdates.length,
        satelliteUpdates,
        systemStatus: {
          satelliteConnection: "Active",
          dataQuality: "High",
          updateFrequency: "Every 6 hours",
          coverage: "95%",
        },
      });
    } catch (error) {
      logger.error("Satellite updates error:", error);
      res.status(500).json({
        error: "Satellite data unavailable",
        message: "Unable to retrieve satellite updates",
      });
    }
  },
);

// Get GS1 digital product passport
router.get(
  "/gs1-passport/:purchaseId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { purchaseId } = req.params;
      const userId = (req as any).user.userId;

      // Get purchase details
      const purchaseResult = await db.query(
        `
      SELECT 
        llp.*,
        u.first_name, u.last_name, u.email
      FROM lion_loyalty_purchases llp
      JOIN users u ON u.id = llp.user_id
      WHERE llp.id = $1 AND llp.user_id = $2
    `,
        [purchaseId, userId],
      );

      if (purchaseResult.rows.length === 0) {
        return res.status(404).json({
          error: "Purchase not found",
          message: "No purchase found with the specified ID",
        });
      }

      const purchase = purchaseResult.rows[0];

      // Generate GS1 digital product passport
      const passport = {
        gs1Id: `GS1-SAVANNAH-${purchase.id}`,
        productInfo: {
          name: "Lion Habitat Conservation Certificate",
          category: "Environmental Impact Product",
          description: `Certificate representing ${purchase.habitat_area_protected}m² of protected lion habitat`,
          conservationProject:
            purchase.conservation_project || "General Conservation Fund",
        },
        sustainability: {
          carbonFootprint: `-${purchase.carbon_offset}kg CO²`,
          habitatProtected: `${purchase.habitat_area_protected}m²`,
          wildlifeImpact: `${Math.ceil(purchase.habitat_area_protected / 10000)} lions supported`,
          conservationStandard: "Wildlife Conservation Society Certified",
        },
        traceability: {
          purchaseDate: purchase.created_at,
          buyer: `${purchase.first_name} ${purchase.last_name}`,
          verificationMethod: "Satellite Monitoring + Blockchain",
          blockchainTxHash: purchase.blockchain_tx_hash,
          nftCertificateId: purchase.nft_certificate_id,
        },
        location: purchase.gps_coordinates
          ? {
              type: "Point",
              coordinates: "Protected for privacy",
            }
          : null,
        certifications: [
          "Savannah Ecosystem Verified",
          "Satellite Monitored",
          "Blockchain Certified",
          "Conservation Impact Verified",
        ],
        qrCode: `https://verify.savannah.org/passport/${purchase.gs1_passport_id || purchase.id}`,
        validUntil: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      };

      res.json({
        message: "GS1 Digital Product Passport",
        passport,
        verificationUrl: passport.qrCode,
      });
    } catch (error) {
      logger.error("GS1 passport error:", error);
      res.status(500).json({
        error: "Passport generation failed",
        message: "Unable to generate digital product passport",
      });
    }
  },
);

export { router as lionLoyaltyRoutes };
