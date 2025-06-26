import db from "../config/database";
import {
  logger,
  logConservationImpact,
  logSatelliteUpdate,
} from "../utils/logger";
import { config } from "../config/environment";
import axios from "axios";

interface ConservationImpactData {
  userId: string;
  purchaseId?: string;
  habitatArea: number;
  carbonOffset: number;
  projectName?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface SatelliteData {
  vegetationIndex: number; // NDVI
  animalActivity: number;
  waterSources: number;
  humanEncroachment: boolean;
  weatherCondition: string;
  temperature: number;
  lastUpdated: string;
}

interface WildlifePopulation {
  species: string;
  count: number;
  trend: "increasing" | "stable" | "decreasing";
  confidenceLevel: number;
}

class ConservationService {
  // Track conservation impact from purchases
  async trackConservationImpact(data: ConservationImpactData): Promise<{
    success: boolean;
    impactId?: string;
    totalImpact?: any;
  }> {
    try {
      const client = await db.getClient();

      try {
        await client.query("BEGIN");

        // Calculate conservation metrics
        const lionsSupported = Math.ceil(data.habitatArea / 10000); // 1 lion per hectare
        const rangersFunded = Math.ceil(data.habitatArea / 1000); // 1 ranger per 1000m²
        const treesEquivalent = Math.ceil(data.carbonOffset / 0.025); // 25kg CO2 per tree

        // Insert impact record
        const impactResult = await client.query(
          `
          INSERT INTO conservation_impacts (
            user_id, purchase_id, habitat_area_protected, carbon_offset,
            project_name, location, lions_supported, rangers_funded,
            trees_equivalent, calculated_at
          ) VALUES ($1, $2, $3, $4, $5, ST_Point($6, $7), $8, $9, $10, NOW())
          RETURNING id
        `,
          [
            data.userId,
            data.purchaseId,
            data.habitatArea,
            data.carbonOffset,
            data.projectName,
            data.location?.longitude || null,
            data.location?.latitude || null,
            lionsSupported,
            rangersFunded,
            treesEquivalent,
          ],
        );

        const impactId = impactResult.rows[0].id;

        // Update user's total impact
        await this.updateUserTotalImpact(client, data.userId);

        // Schedule satellite monitoring if location provided
        if (data.location) {
          await this.scheduleSatelliteMonitoring(
            client,
            data.location,
            data.projectName,
          );
        }

        // Create conservation goals if this is user's first impact
        await this.checkAndCreateConservationGoals(client, data.userId);

        await client.query("COMMIT");

        // Get total impact for user
        const totalImpact = await this.getUserTotalImpact(data.userId);

        // Log conservation impact
        logConservationImpact("habitat_protection", data.userId, {
          habitatProtected: data.habitatArea,
          carbonOffset: data.carbonOffset,
          location: data.location
            ? `${data.location.latitude}, ${data.location.longitude}`
            : undefined,
        });

        logger.info("Conservation impact tracked successfully", {
          userId: data.userId,
          impactId,
          habitatArea: data.habitatArea,
          carbonOffset: data.carbonOffset,
        });

        return {
          success: true,
          impactId,
          totalImpact,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Failed to track conservation impact:", error);
      return { success: false };
    }
  }

  // Get satellite monitoring data for a location
  async getSatelliteData(
    latitude: number,
    longitude: number,
    projectName?: string,
  ): Promise<SatelliteData | null> {
    try {
      if (!config.app.debug) {
        // Using app.debug as a fallback since FEATURES doesn't exist in config
        // Return mock satellite data when feature is disabled
        return this.generateMockSatelliteData();
      }

      // In production, integrate with actual satellite API (e.g., NASA, ESA)
      const satelliteResponse = await this.fetchRealSatelliteData(
        latitude,
        longitude,
      );

      // Log satellite data update
      logSatelliteUpdate("NASA_FIRMS", {
        location: { latitude, longitude },
        type: "habitat_monitoring",
        response: satelliteResponse,
      });

      return satelliteResponse;
    } catch (error) {
      logger.error("Failed to get satellite data:", error);

      // Return mock data as fallback
      return this.generateMockSatelliteData();
    }
  }

  // Generate mock satellite data for development/demo
  private generateMockSatelliteData(): SatelliteData {
    return {
      vegetationIndex: 0.7 + Math.random() * 0.25, // NDVI between 0.7-0.95
      animalActivity: Math.floor(Math.random() * 25) + 5, // 5-30 animals
      waterSources: Math.floor(Math.random() * 4) + 1, // 1-4 water sources
      humanEncroachment: Math.random() < 0.1, // 10% chance of encroachment
      weatherCondition: ["Clear", "Partly Cloudy", "Overcast", "Light Rain"][
        Math.floor(Math.random() * 4)
      ],
      temperature: 20 + Math.random() * 15, // 20-35°C
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fetch real satellite data (placeholder for actual API integration)
  private async fetchRealSatelliteData(
    latitude: number,
    longitude: number,
  ): Promise<SatelliteData> {
    try {
      // Example: NASA FIRMS API integration
      if (config.external.nasa.apiKey) {
        const response = await axios.get(
          `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${config.external.nasa.apiKey}/MODIS_C6_1/${latitude},${longitude}/1`,
          { timeout: 10000 },
        );

        // Process NASA FIRMS data
        return this.processNASAFIRMSData(response.data);
      }

      // Fallback to mock data
      return this.generateMockSatelliteData();
    } catch (error) {
      logger.error("Satellite API request failed:", error);
      return this.generateMockSatelliteData();
    }
  }

  // Process NASA FIRMS data into our format
  private processNASAFIRMSData(firmsData: string): SatelliteData {
    // Parse CSV data and extract relevant metrics
    // This is a simplified implementation

    return {
      vegetationIndex: 0.8, // Would be calculated from MODIS data
      animalActivity: 15, // Would be inferred from fire activity and other indicators
      waterSources: 2,
      humanEncroachment: firmsData.includes("fire"), // Simplified check
      weatherCondition: "Clear",
      temperature: 28,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Monitor wildlife populations
  async getWildlifePopulation(location: {
    latitude: number;
    longitude: number;
    radius: number; // km
  }): Promise<WildlifePopulation[]> {
    try {
      // Get wildlife data from database
      const result = await db.query(
        `
        SELECT
          species,
          COUNT(*) as current_count,
          AVG(confidence_level) as avg_confidence
        FROM wildlife_sightings ws
        WHERE ST_DWithin(
          ST_Point($1, $2)::geography,
          ws.location::geography,
          $3 * 1000
        )
        AND sighting_date > NOW() - INTERVAL '30 days'
        GROUP BY species
      `,
        [location.longitude, location.latitude, location.radius],
      );

      const populations: WildlifePopulation[] = result.rows.map((row) => ({
        species: row.species,
        count: parseInt(row.current_count),
        trend: this.calculatePopulationTrend(row.species, location),
        confidenceLevel: parseFloat(row.avg_confidence) || 75,
      }));

      // Add default populations if no data
      if (populations.length === 0) {
        populations.push(
          { species: "Lion", count: 12, trend: "stable", confidenceLevel: 80 },
          {
            species: "Elephant",
            count: 8,
            trend: "increasing",
            confidenceLevel: 85,
          },
          {
            species: "Giraffe",
            count: 15,
            trend: "stable",
            confidenceLevel: 75,
          },
        );
      }

      return populations;
    } catch (error) {
      logger.error("Failed to get wildlife population data:", error);
      return [];
    }
  }

  // Calculate population trend (simplified)
  private calculatePopulationTrend(
    species: string,
    location: any,
  ): "increasing" | "stable" | "decreasing" {
    // In a real implementation, this would analyze historical data
    const trends = ["increasing", "stable", "decreasing"] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  // Get conservation achievements for user
  async getConservationAchievements(userId: string): Promise<{
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      achieved: boolean;
      progress: number;
      target: number;
    }>;
    nextGoals: Array<{
      name: string;
      description: string;
      target: number;
      current: number;
    }>;
  }> {
    try {
      // Get user's total impact
      const totalImpact = await this.getUserTotalImpact(userId);

      // Define achievement criteria
      const achievements = [
        {
          id: "first_impact",
          name: "Conservation Champion",
          description: "Made your first conservation purchase",
          achieved: totalImpact.totalPurchases > 0,
          progress: Math.min(totalImpact.totalPurchases, 1),
          target: 1,
        },
        {
          id: "habitat_protector",
          name: "Habitat Protector",
          description: "Protected 1 hectare of habitat",
          achieved: totalImpact.totalHabitatProtected >= 10000,
          progress: Math.min(totalImpact.totalHabitatProtected, 10000),
          target: 10000,
        },
        {
          id: "carbon_neutral",
          name: "Carbon Neutral",
          description: "Offset 1 ton of CO₂",
          achieved: totalImpact.totalCarbonOffset >= 1000,
          progress: Math.min(totalImpact.totalCarbonOffset, 1000),
          target: 1000,
        },
        {
          id: "lion_supporter",
          name: "Pride Leader",
          description: "Support 5 lions through habitat protection",
          achieved: totalImpact.estimatedLionsSupported >= 5,
          progress: Math.min(totalImpact.estimatedLionsSupported, 5),
          target: 5,
        },
        {
          id: "conservation_hero",
          name: "Conservation Hero",
          description: "Make 50 conservation purchases",
          achieved: totalImpact.totalPurchases >= 50,
          progress: Math.min(totalImpact.totalPurchases, 50),
          target: 50,
        },
      ];

      // Define next goals
      const nextGoals = [
        {
          name: "Mega Conservationist",
          description: "Protect 10 hectares of habitat",
          target: 100000,
          current: totalImpact.totalHabitatProtected,
        },
        {
          name: "Climate Champion",
          description: "Offset 5 tons of CO₂",
          target: 5000,
          current: totalImpact.totalCarbonOffset,
        },
        {
          name: "Wildlife Guardian",
          description: "Support 20 lions",
          target: 20,
          current: totalImpact.estimatedLionsSupported,
        },
      ].filter((goal) => goal.current < goal.target);

      return { achievements, nextGoals };
    } catch (error) {
      logger.error("Failed to get conservation achievements:", error);
      return { achievements: [], nextGoals: [] };
    }
  }

  // Update user's total conservation impact
  private async updateUserTotalImpact(
    client: any,
    userId: string,
  ): Promise<void> {
    await client.query(
      `
      UPDATE users SET metadata = metadata || jsonb_build_object(
        'conservationLastUpdated', NOW()::text,
        'conservationRecalculated', true
      )
      WHERE id = $1
    `,
      [userId],
    );
  }

  // Get user's total conservation impact
  async getUserTotalImpact(userId: string): Promise<{
    totalPurchases: number;
    totalHabitatProtected: number;
    totalCarbonOffset: number;
    estimatedLionsSupported: number;
    rangersFunded: number;
    firstPurchase?: string;
    latestPurchase?: string;
  }> {
    try {
      const result = await db.query(
        `
        SELECT
          COUNT(*) as total_purchases,
          COALESCE(SUM(habitat_area_protected), 0) as total_habitat_protected,
          COALESCE(SUM(carbon_offset), 0) as total_carbon_offset,
          MIN(created_at) as first_purchase,
          MAX(created_at) as latest_purchase
        FROM lion_loyalty_purchases
        WHERE user_id = $1
      `,
        [userId],
      );

      const impact = result.rows[0];
      const habitatProtected = parseFloat(impact.total_habitat_protected);
      const carbonOffset = parseFloat(impact.total_carbon_offset);

      return {
        totalPurchases: parseInt(impact.total_purchases),
        totalHabitatProtected: habitatProtected,
        totalCarbonOffset: carbonOffset,
        estimatedLionsSupported: Math.ceil(habitatProtected / 10000),
        rangersFunded: Math.ceil(habitatProtected / 1000),
        firstPurchase: impact.first_purchase,
        latestPurchase: impact.latest_purchase,
      };
    } catch (error) {
      logger.error("Failed to get user total impact:", error);
      return {
        totalPurchases: 0,
        totalHabitatProtected: 0,
        totalCarbonOffset: 0,
        estimatedLionsSupported: 0,
        rangersFunded: 0,
      };
    }
  }

  // Schedule satellite monitoring for a location
  private async scheduleSatelliteMonitoring(
    client: any,
    location: { latitude: number; longitude: number },
    projectName?: string,
  ): Promise<void> {
    try {
      await client.query(
        `
        INSERT INTO job_queue (job_type, job_data, priority, scheduled_at)
        VALUES ('satellite_monitoring', $1, 3, NOW() + INTERVAL '1 day')
      `,
        [
          JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            projectName,
            monitoringType: "habitat_protection",
          }),
        ],
      );
    } catch (error) {
      logger.error("Failed to schedule satellite monitoring:", error);
    }
  }

  // Check and create conservation goals for new users
  private async checkAndCreateConservationGoals(
    client: any,
    userId: string,
  ): Promise<void> {
    try {
      const existingGoals = await client.query(
        `
        SELECT COUNT(*) as goal_count
        FROM conservation_goals
        WHERE user_id = $1
      `,
        [userId],
      );

      if (parseInt(existingGoals.rows[0].goal_count) === 0) {
        // Create default goals for new conservation user
        const defaultGoals = [
          { name: "First Hectare", target: 10000, metric: "habitat_area" },
          { name: "Carbon Neutral", target: 1000, metric: "carbon_offset" },
          { name: "Pride Supporter", target: 1, metric: "lions_supported" },
        ];

        for (const goal of defaultGoals) {
          await client.query(
            `
            INSERT INTO conservation_goals (user_id, goal_name, target_value, metric_type)
            VALUES ($1, $2, $3, $4)
          `,
            [userId, goal.name, goal.target, goal.metric],
          );
        }
      }
    } catch (error) {
      logger.error("Failed to create conservation goals:", error);
    }
  }

  // Get conservation impact trends over time
  async getConservationTrends(
    timeframe: "week" | "month" | "quarter" | "year" = "month",
  ): Promise<{
    habitatTrend: Array<{ date: string; value: number }>;
    carbonTrend: Array<{ date: string; value: number }>;
    userGrowth: Array<{ date: string; value: number }>;
  }> {
    try {
      const interval = this.getTimeInterval(timeframe);

      const result = await db.query(
        `
        SELECT
          DATE_TRUNC($1, created_at) as period,
          SUM(habitat_area_protected) as habitat_protected,
          SUM(carbon_offset) as carbon_offset,
          COUNT(DISTINCT user_id) as active_users
        FROM lion_loyalty_purchases
        WHERE created_at > NOW() - INTERVAL '1 ${timeframe}'
        GROUP BY DATE_TRUNC($1, created_at)
        ORDER BY period
      `,
        [interval],
      );

      const habitatTrend = result.rows.map((row) => ({
        date: row.period,
        value: parseFloat(row.habitat_protected) || 0,
      }));

      const carbonTrend = result.rows.map((row) => ({
        date: row.period,
        value: parseFloat(row.carbon_offset) || 0,
      }));

      const userGrowth = result.rows.map((row) => ({
        date: row.period,
        value: parseInt(row.active_users) || 0,
      }));

      return { habitatTrend, carbonTrend, userGrowth };
    } catch (error) {
      logger.error("Failed to get conservation trends:", error);
      return { habitatTrend: [], carbonTrend: [], userGrowth: [] };
    }
  }

  private getTimeInterval(timeframe: string): string {
    switch (timeframe) {
      case "week":
        return "day";
      case "month":
        return "week";
      case "quarter":
        return "month";
      case "year":
        return "month";
      default:
        return "week";
    }
  }
}

// Create singleton instance
export const conservationService = new ConservationService();

// Export convenience functions
export const trackConservationImpact = async (data: ConservationImpactData) => {
  return await conservationService.trackConservationImpact(data);
};

export const getSatelliteData = async (
  latitude: number,
  longitude: number,
  projectName?: string,
) => {
  return await conservationService.getSatelliteData(
    latitude,
    longitude,
    projectName,
  );
};

export const getWildlifePopulation = async (location: {
  latitude: number;
  longitude: number;
  radius: number;
}) => {
  return await conservationService.getWildlifePopulation(location);
};

export const getConservationAchievements = async (userId: string) => {
  return await conservationService.getConservationAchievements(userId);
};

export default conservationService;
