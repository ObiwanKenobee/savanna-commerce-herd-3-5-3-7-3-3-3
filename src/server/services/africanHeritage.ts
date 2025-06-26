import { query, transaction } from "../config/database";
import { logger } from "../utils/logger";
import { getWebSocketManager } from "../websocket/handler";

// 1. Granary Inventory System (Benin-inspired)
export class GranaryInventoryService {
  // Calculate optimal stock using Termite Algorithm
  async calculateOptimalStock(
    productId: string,
    productType: string,
  ): Promise<number> {
    try {
      const demandResult = await query(
        `
        SELECT AVG(quantity) as avg_demand
        FROM transactions 
        WHERE product_id = $1 
        AND created_at >= NOW() - INTERVAL '30 days'
      `,
        [productId],
      );

      const baseDemand = parseInt(demandResult.rows[0]?.avg_demand || "0");
      const seasonalFactor = this.getSeasonalFactor();

      const result = await query(
        "SELECT calculate_termite_algorithm_stock($1, $2, $3) as optimal_stock",
        [productType, baseDemand, seasonalFactor],
      );

      return result.rows[0].optimal_stock;
    } catch (error) {
      logger.error("Termite algorithm calculation error:", error);
      throw error;
    }
  }

  // Update silo conditions from IoT sensors
  async updateSiloConditions(
    granaryId: string,
    sensorData: any,
  ): Promise<void> {
    try {
      await transaction(async (client) => {
        // Update sensor readings
        for (const [sensorType, value] of Object.entries(sensorData)) {
          await client.query(
            `
            INSERT INTO iot_silo_sensors (granary_id, sensor_type, current_value, optimal_range)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (granary_id, sensor_type) DO UPDATE SET
              current_value = EXCLUDED.current_value,
              last_reading = NOW()
          `,
            [granaryId, sensorType, value, this.getOptimalRange(sensorType)],
          );
        }

        // Calculate preservation score
        const preservationScore = this.calculatePreservationScore(sensorData);

        // Update granary conditions
        await client.query(
          `
          UPDATE granary_inventory 
          SET silo_conditions = $1, preservation_score = $2, updated_at = NOW()
          WHERE id = $3
        `,
          [JSON.stringify(sensorData), preservationScore, granaryId],
        );
      });

      // Broadcast real-time updates
      const wsManager = getWebSocketManager();
      wsManager.broadcastToAll("granary:conditions_updated", {
        granaryId,
        conditions: sensorData,
        preservationScore: this.calculatePreservationScore(sensorData),
      });
    } catch (error) {
      logger.error("Silo conditions update error:", error);
      throw error;
    }
  }

  private getSeasonalFactor(): number {
    const month = new Date().getMonth();
    // Peak harvest: March-May, October-December
    if ((month >= 2 && month <= 4) || (month >= 9 && month <= 11)) {
      return 1.5; // Higher stock during harvest
    }
    // Dry season: June-September
    if (month >= 5 && month <= 8) {
      return 0.8; // Lower stock during dry season
    }
    return 1.0;
  }

  private getOptimalRange(sensorType: string): any {
    const ranges = {
      humidity: { min: 12, max: 14, unit: "%" },
      temperature: { min: 15, max: 25, unit: "°C" },
      ventilation: { min: 2, max: 5, unit: "m/s" },
      termite_activity: { min: 0, max: 0.1, unit: "activity_index" },
    };
    return (
      ranges[sensorType as keyof typeof ranges] || {
        min: 0,
        max: 100,
        unit: "unknown",
      }
    );
  }

  private calculatePreservationScore(sensorData: any): number {
    let score = 100;

    // Humidity penalty
    if (sensorData.humidity > 14) score -= (sensorData.humidity - 14) * 10;
    if (sensorData.humidity < 12) score -= (12 - sensorData.humidity) * 15;

    // Temperature penalty
    if (sensorData.temperature > 25) score -= (sensorData.temperature - 25) * 5;
    if (sensorData.temperature < 15) score -= (15 - sensorData.temperature) * 8;

    // Termite activity penalty
    if (sensorData.termite_activity > 0.1)
      score -= sensorData.termite_activity * 200;

    return Math.max(0, Math.min(100, score));
  }
}

// 2. Talking Drums Network (Yoruba-inspired)
export class TalkingDrumsService {
  // Encode transaction as drum rhythm
  encodeTransaction(transaction: any): any {
    const messageType = this.getMessageType(transaction);

    return {
      messageId: `DRUM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rhythm: this.generateRhythmPattern(messageType, transaction),
      priority: this.calculatePriority(transaction),
      transmissionPath: [],
    };
  }

  // Transmit message through drum network
  async transmitMessage(sourceNodeId: string, message: any): Promise<void> {
    try {
      const encodedRhythm = await query(
        "SELECT encode_drum_message($1, $2) as rhythm",
        [message.type, JSON.stringify(message.content)],
      );

      await query(
        `
        INSERT INTO drum_messages 
        (message_id, source_node, message_type, encoded_rhythm, decoded_content, priority)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          message.messageId,
          sourceNodeId,
          message.type,
          encodedRhythm.rows[0].rhythm,
          JSON.stringify(message.content),
          message.priority,
        ],
      );

      // Find optimal transmission path
      const path = await this.findOptimalPath(
        sourceNodeId,
        message.destination,
      );

      // Simulate drum transmission
      await this.simulateTransmission(message.messageId, path);

      logger.info("Drum message transmitted", {
        messageId: message.messageId,
        path: path.map((node) => node.node_id),
      });
    } catch (error) {
      logger.error("Drum transmission error:", error);
      throw error;
    }
  }

  // Find optimal transmission path using traditional Yoruba drum network logic
  private async findOptimalPath(
    sourceId: string,
    destinationId?: string,
  ): Promise<any[]> {
    const result = await query(
      `
      WITH RECURSIVE drum_path AS (
        SELECT node_id, location, mesh_connections, ARRAY[node_id] as path, 0 as hops
        FROM drum_network_nodes 
        WHERE node_id = $1 AND status = 'active'
        
        UNION ALL
        
        SELECT n.node_id, n.location, n.mesh_connections, 
               dp.path || n.node_id, dp.hops + 1
        FROM drum_network_nodes n
        JOIN drum_path dp ON n.node_id = ANY(dp.mesh_connections::text[])
        WHERE dp.hops < 10 AND NOT (n.node_id = ANY(dp.path))
        AND n.status = 'active'
      )
      SELECT * FROM drum_path 
      ORDER BY hops 
      LIMIT 20
    `,
      [sourceId],
    );

    return result.rows;
  }

  private async simulateTransmission(
    messageId: string,
    path: any[],
  ): Promise<void> {
    // Simulate drum transmission with delays
    for (let i = 0; i < path.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms per hop

      await query(
        `
        UPDATE drum_messages 
        SET transmission_path = $1, status = 'transmitted'
        WHERE message_id = $2
      `,
        [JSON.stringify(path.slice(0, i + 1).map((n) => n.node_id)), messageId],
      );
    }
  }

  private getMessageType(transaction: any): string {
    if (transaction.amount > 10000) return "high_value_transaction";
    if (transaction.type === "stock_update") return "stock_alert";
    if (transaction.type === "price_change") return "price_update";
    return "general_transaction";
  }

  private generateRhythmPattern(messageType: string, data: any): any {
    const patterns = {
      price_update: { pattern: "...-.-", tempo: 120, duration: 30 },
      stock_alert: { pattern: "-.-.-.--", tempo: 140, duration: 45 },
      high_value_transaction: {
        pattern: ".--.--.--",
        tempo: 100,
        duration: 60,
      },
      general_transaction: { pattern: ".-.-.-", tempo: 110, duration: 40 },
    };

    return (
      patterns[messageType as keyof typeof patterns] ||
      patterns.general_transaction
    );
  }

  private calculatePriority(transaction: any): number {
    if (transaction.amount > 50000) return 5; // High priority
    if (transaction.type === "emergency") return 4;
    if (transaction.amount > 10000) return 3;
    if (transaction.type === "stock_alert") return 2;
    return 1; // Normal priority
  }
}

// 3. Jua Kali Manufacturing Service (Mbeya iron smelting-inspired)
export class JuaKaliManufacturingService {
  // Calculate manufacturing feasibility
  async calculateManufacturingCost(
    specification: any,
    workshopId: string,
  ): Promise<any> {
    try {
      const workshop = await query(
        "SELECT * FROM jua_kali_workshops WHERE id = $1",
        [workshopId],
      );

      if (workshop.rows.length === 0) {
        throw new Error("Workshop not found");
      }

      const workshopData = workshop.rows[0];
      const materialCost = this.calculateMaterialCost(
        specification,
        workshopData,
      );
      const laborCost = this.calculateLaborCost(specification, workshopData);
      const energyCost = this.calculateSolarEnergyCost(
        specification,
        workshopData,
      );

      return {
        materialCost,
        laborCost,
        energyCost,
        totalCost: materialCost + laborCost + energyCost,
        estimatedTime: this.estimateProductionTime(specification, workshopData),
        carbonFootprint: this.calculateCarbonFootprint(
          specification,
          workshopData,
        ),
        feasibilityScore: this.calculateFeasibilityScore(
          specification,
          workshopData,
        ),
      };
    } catch (error) {
      logger.error("Manufacturing cost calculation error:", error);
      throw error;
    }
  }

  // Create manufacturing order
  async createManufacturingOrder(orderData: any): Promise<string> {
    try {
      const costAnalysis = await this.calculateManufacturingCost(
        orderData.specification,
        orderData.workshopId,
      );

      const result = await query(
        `
        INSERT INTO manufacturing_orders 
        (workshop_id, product_specification, materials_required, quantity, 
         cost_breakdown, carbon_footprint, ordered_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
        [
          orderData.workshopId,
          JSON.stringify(orderData.specification),
          JSON.stringify(orderData.materialsRequired),
          orderData.quantity,
          JSON.stringify(costAnalysis),
          costAnalysis.carbonFootprint,
          orderData.orderedBy,
        ],
      );

      const orderId = result.rows[0].id;

      // Broadcast to workshop owners
      const wsManager = getWebSocketManager();
      wsManager.broadcastToUser(
        orderData.workshopOwnerId,
        "manufacturing:new_order",
        {
          orderId,
          specification: orderData.specification,
          costAnalysis,
        },
      );

      return orderId;
    } catch (error) {
      logger.error("Manufacturing order creation error:", error);
      throw error;
    }
  }

  private calculateMaterialCost(specification: any, workshop: any): number {
    const materialPrices = {
      pet_plastic: 50, // KSh per kg
      iron_sand: 30, // KSh per kg
      matatu_parts: 100, // KSh per kg
      copper_wire: 200, // KSh per kg
    };

    let totalCost = 0;
    for (const material of workshop.recycling_materials) {
      const price =
        materialPrices[material as keyof typeof materialPrices] || 50;
      const quantity = specification.materials?.[material] || 0;
      totalCost += price * quantity;
    }

    return totalCost;
  }

  private calculateLaborCost(specification: any, workshop: any): number {
    const complexityMultiplier = specification.complexity || 1;
    const baseHourlyRate = 300; // KSh per hour
    const estimatedHours = this.estimateProductionTime(specification, workshop);

    return baseHourlyRate * estimatedHours * complexityMultiplier;
  }

  private calculateSolarEnergyCost(specification: any, workshop: any): number {
    const energyRequired = specification.energyKwh || 10; // Default 10 kWh
    const solarCostPerKwh = 15; // KSh per kWh

    return energyRequired * solarCostPerKwh;
  }

  private estimateProductionTime(specification: any, workshop: any): number {
    const baseTime = specification.baseProductionHours || 8;
    const complexityFactor = specification.complexity || 1;
    const efficiencyScore = workshop.efficiency_score || 50;

    return baseTime * complexityFactor * (100 / efficiencyScore);
  }

  private calculateCarbonFootprint(specification: any, workshop: any): number {
    const energyFootprint = (specification.energyKwh || 10) * 0.5; // kg CO2 per kWh
    const materialFootprint = (specification.totalMaterialKg || 5) * 0.3; // kg CO2 per kg material

    return energyFootprint + materialFootprint;
  }

  private calculateFeasibilityScore(specification: any, workshop: any): number {
    let score = 100;

    // Equipment capability check
    const requiredEquipment = specification.requiredEquipment || [];
    const availableEquipment = workshop.equipment || [];
    const equipmentMatch =
      requiredEquipment.filter((eq: string) => availableEquipment.includes(eq))
        .length / requiredEquipment.length;

    score *= equipmentMatch;

    // Capacity check
    const capacityUtilization =
      specification.quantity / workshop.production_capacity;
    if (capacityUtilization > 1) score *= 0.5;

    return Math.round(score);
  }
}

// 4. Data Aqueducts Service (Kushite-inspired)
export class DataAqueductsService {
  // Create offline data packet for boda boda transmission
  async createDataPacket(data: any, routeId: string): Promise<string> {
    try {
      const encryptedPayload = this.encryptData(data);
      const packetId = `AQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const result = await query(
        `
        INSERT INTO offline_data_packets 
        (packet_id, route_id, data_payload, packet_size_mb, source_hub, destination_hub, encryption_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
        [
          packetId,
          routeId,
          JSON.stringify(encryptedPayload.data),
          encryptedPayload.sizeMB,
          data.sourceHub,
          data.destinationHub,
          encryptedPayload.hash,
        ],
      );

      return packetId;
    } catch (error) {
      logger.error("Data packet creation error:", error);
      throw error;
    }
  }

  // Assign packet to boda boda carrier
  async assignCarrier(packetId: string, carrierId: string): Promise<void> {
    try {
      await query(
        `
        UPDATE offline_data_packets 
        SET carrier_assignment = $1, transmission_status = 'in_transit'
        WHERE packet_id = $2
      `,
        [JSON.stringify({ carrierId, assignedAt: new Date() }), packetId],
      );

      logger.info("Packet assigned to carrier", { packetId, carrierId });
    } catch (error) {
      logger.error("Carrier assignment error:", error);
      throw error;
    }
  }

  private encryptData(data: any): any {
    // Simplified encryption simulation
    const dataString = JSON.stringify(data);
    const sizeMB = new Blob([dataString]).size / (1024 * 1024);

    return {
      data: Buffer.from(dataString).toString("base64"),
      sizeMB: Number(sizeMB.toFixed(2)),
      hash: this.generateHash(dataString),
    };
  }

  private generateHash(data: string): string {
    // Simple hash function - in production, use proper cryptographic hash
    return Buffer.from(data).toString("base64").substring(0, 32);
  }
}

// Export all services
export const granaryService = new GranaryInventoryService();
export const drumsService = new TalkingDrumsService();
export const juaKaliService = new JuaKaliManufacturingService();
export const aqueductsService = new DataAqueductsService();
