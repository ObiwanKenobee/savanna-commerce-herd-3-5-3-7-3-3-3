import { supabase } from "../integrations/supabase/client";

export type KenyanCounties =
  | "Nairobi"
  | "Mombasa"
  | "Kisumu"
  | "Nakuru"
  | "Eldoret"
  | "Thika"
  | "Malindi"
  | "Nyeri"
  | "Meru"
  | "Embu"
  | "Garissa"
  | "Kakamega"
  | "Kitale"
  | "Machakos"
  | "Kericho"
  | "Isiolo"
  | "Nanyuki"
  | "Voi"
  | "Kilifi"
  | "Lamu";

export type AlertPriority = "lion" | "elephant" | "tortoise";

export interface AdminAlert {
  id: string;
  priority: AlertPriority;
  title: string;
  message: string;
  county?: KenyanCounties;
  requiresHuman: boolean;
  ussdFallback: string;
  timestamp: Date;
  resolved: boolean;
  actionTaken?: string;
}

export interface MarketplacePulse {
  gmvTicker: {
    current: number;
    change24h: number;
    changePercent: number;
  };
  liveOrders: {
    county: KenyanCounties;
    orderCount: number;
    value: number;
    coordinates: [number, number];
  }[];
  droughtAlerts: {
    county: KenyanCounties;
    severity: "low" | "medium" | "high";
    affectedSuppliers: number;
  }[];
}

export interface FraudMetrics {
  simCardViolations: {
    count: number;
    threshold: number;
    percentage: number;
  };
  priceGougingAlerts: {
    product: string;
    supplier: string;
    currentPrice: number;
    medianPrice: number;
    deviation: number;
  }[];
  ghostStockListings: {
    productId: string;
    reportCount: number;
    supplierId: string;
    status: "investigating" | "delisted" | "verified";
  }[];
}

export interface LogisticsOps {
  deliveryNetwork: {
    bodaBodaActive: number;
    trucksActive: number;
    utilizationRate: number;
  };
  fuelPriceImpact: {
    currentPrice: number;
    change: number;
    deliveryCostIncrease: number;
  };
  matatuIntegration: {
    peakHourRoutes: number;
    offPeakRoutes: number;
    efficiency: number;
  };
}

export interface FinancialControls {
  mpesaReconciliation: {
    failedTransactions: number;
    recoveryRate: number;
    avgRecoveryTime: number;
  };
  bnplExposure: {
    totalExposure: number;
    riskByCounty: {
      county: KenyanCounties;
      riskScore: number;
      exposure: number;
    }[];
  };
}

export interface ContentModeration {
  swahiliNlpFlags: {
    flaggedWord: string;
    context: string;
    action: "auto-quarantine" | "human-review" | "approved";
    confidence: number;
  }[];
  supplierTrustScores: {
    supplierId: string;
    supplierName: string;
    rhinoRating: number; // 1-5 horns
    deliveryScore: number;
    priceConsistency: number;
    overallScore: number;
  }[];
}

export interface HyperlocalInventory {
  droughtPrediction: {
    county: KenyanCounties;
    riskLevel: number; // 0-1
    affectedProducts: string[];
    recommendedStockLevel: number;
  }[];
  crossBorderSync: {
    product: string;
    kenyaPrice: number;
    tanzaniaPrice: number;
    arbitrageOpportunity: number;
    recommendation: "buy" | "sell" | "hold";
  }[];
}

export interface SupplierLeaderboard {
  supplierId: string;
  supplierName: string;
  volume: number;
  reliability: number;
  maneSize: "small" | "medium" | "large" | "alpha"; // Based on volume
  pawRating: number; // 1-5 paws for reliability
  businessType: string;
  county: KenyanCounties;
}

export interface BaobabTreeData {
  category: string;
  stockLevel: number; // 0-1 (leaf density)
  urgentReplenishment: boolean; // fruit drops
  subCategories: {
    name: string;
    stockLevel: number;
    priority: "low" | "medium" | "high";
  }[];
}

class SavannaCommandCenterService {
  private readonly POLLING_INTERVAL = 15000; // 15 seconds
  private readonly USSD_SYNC_INTERVAL = 60000; // 60 seconds

  async getDashboardOverview(): Promise<{
    marketplacePulse: MarketplacePulse;
    fraudMetrics: FraudMetrics;
    logisticsOps: LogisticsOps;
    financialControls: FinancialControls;
    contentModeration: ContentModeration;
    hyperlocalInventory: HyperlocalInventory;
    alerts: AdminAlert[];
    lastUpdated: Date;
  }> {
    try {
      const [
        marketplacePulse,
        fraudMetrics,
        logisticsOps,
        financialControls,
        contentModeration,
        hyperlocalInventory,
        alerts,
      ] = await Promise.all([
        this.getMarketplacePulse(),
        this.getFraudMetrics(),
        this.getLogisticsOps(),
        this.getFinancialControls(),
        this.getContentModeration(),
        this.getHyperlocalInventory(),
        this.getAlerts(),
      ]);

      return {
        marketplacePulse,
        fraudMetrics,
        logisticsOps,
        financialControls,
        contentModeration,
        hyperlocalInventory,
        alerts,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Failed to load dashboard overview:", error);
      throw error;
    }
  }

  async getMarketplacePulse(): Promise<MarketplacePulse> {
    // In production, this would query real transaction data
    const mockGMV = await this.calculateGMV();
    const liveOrders = await this.getLiveOrdersByCounty();
    const droughtAlerts = await this.getDroughtAlerts();

    return {
      gmvTicker: mockGMV,
      liveOrders,
      droughtAlerts,
    };
  }

  async getFraudMetrics(): Promise<FraudMetrics> {
    const [simViolations, priceGouging, ghostStock] = await Promise.all([
      this.getSIMCardViolations(),
      this.getPriceGougingAlerts(),
      this.getGhostStockListings(),
    ]);

    return {
      simCardViolations: simViolations,
      priceGougingAlerts: priceGouging,
      ghostStockListings: ghostStock,
    };
  }

  async getLogisticsOps(): Promise<LogisticsOps> {
    return {
      deliveryNetwork: {
        bodaBodaActive: 234,
        trucksActive: 45,
        utilizationRate: 0.78,
      },
      fuelPriceImpact: {
        currentPrice: 165.5, // KES per liter
        change: 12.3,
        deliveryCostIncrease: 0.15,
      },
      matatuIntegration: {
        peakHourRoutes: 89,
        offPeakRoutes: 156,
        efficiency: 0.82,
      },
    };
  }

  async getFinancialControls(): Promise<FinancialControls> {
    return {
      mpesaReconciliation: {
        failedTransactions: 23,
        recoveryRate: 0.94,
        avgRecoveryTime: 1.8, // minutes
      },
      bnplExposure: {
        totalExposure: 2450000, // KES
        riskByCounty: [
          { county: "Nairobi", riskScore: 0.25, exposure: 980000 },
          { county: "Mombasa", riskScore: 0.35, exposure: 450000 },
          { county: "Kisumu", riskScore: 0.28, exposure: 320000 },
          { county: "Nakuru", riskScore: 0.22, exposure: 380000 },
          { county: "Eldoret", riskScore: 0.31, exposure: 320000 },
        ],
      },
    };
  }

  async getContentModeration(): Promise<ContentModeration> {
    return {
      swahiliNlpFlags: [
        {
          flaggedWord: "pumba",
          context: 'Not a warthog - means "rubbish" in Sheng',
          action: "auto-quarantine",
          confidence: 0.92,
        },
        {
          flaggedWord: "bonoko",
          context: "Slang for fake/counterfeit goods",
          action: "human-review",
          confidence: 0.76,
        },
      ],
      supplierTrustScores: await this.getSupplierTrustScores(),
    };
  }

  async getHyperlocalInventory(): Promise<HyperlocalInventory> {
    return {
      droughtPrediction: [
        {
          county: "Turkana",
          riskLevel: 0.85,
          affectedProducts: ["maize", "beans", "millet"],
          recommendedStockLevel: 150, // percentage of normal
        },
        {
          county: "Marsabit",
          riskLevel: 0.72,
          affectedProducts: ["maize", "sorghum"],
          recommendedStockLevel: 130,
        },
      ],
      crossBorderSync: [
        {
          product: "Sugar",
          kenyaPrice: 180,
          tanzaniaPrice: 165,
          arbitrageOpportunity: 8.3,
          recommendation: "buy",
        },
      ],
    };
  }

  async getSupplierLeaderboard(): Promise<SupplierLeaderboard[]> {
    const { data, error } = await supabase
      .from("suppliers")
      .select(
        `
        id,
        business_name,
        county,
        business_type,
        performance_metrics
      `,
      )
      .order("volume", { ascending: false })
      .limit(10);

    if (error) throw error;

    return (data || []).map((supplier, index) => ({
      supplierId: supplier.id,
      supplierName: supplier.business_name,
      volume: supplier.performance_metrics?.volume || Math.random() * 100000,
      reliability: supplier.performance_metrics?.reliability || Math.random(),
      maneSize:
        index < 2
          ? "alpha"
          : index < 5
            ? "large"
            : index < 8
              ? "medium"
              : "small",
      pawRating:
        Math.floor(supplier.performance_metrics?.reliability * 5) ||
        Math.floor(Math.random() * 5) + 1,
      businessType: supplier.business_type,
      county: supplier.county,
    }));
  }

  async getBaobabTreeData(): Promise<BaobabTreeData[]> {
    const categories = [
      "Staples",
      "Vegetables",
      "Fruits",
      "Meat",
      "Dairy",
      "Grains",
      "Spices",
    ];

    return categories.map((category) => ({
      category,
      stockLevel: Math.random(),
      urgentReplenishment: Math.random() < 0.3,
      subCategories: [
        {
          name: `${category} Sub 1`,
          stockLevel: Math.random(),
          priority: "low" as const,
        },
        {
          name: `${category} Sub 2`,
          stockLevel: Math.random(),
          priority: "medium" as const,
        },
        {
          name: `${category} Sub 3`,
          stockLevel: Math.random(),
          priority: "high" as const,
        },
      ],
    }));
  }

  // Admin Action Methods
  async executeEmergencyPriceCap(
    product: string,
    maxPrice: number,
    county?: KenyanCounties,
  ): Promise<void> {
    console.log(
      `🚨 Emergency price cap activated: ${product} max ${maxPrice} KES in ${county || "all counties"}`,
    );

    await supabase.from("price_controls").insert({
      product,
      max_price: maxPrice,
      county,
      activated_by: "admin",
      activation_type: "emergency",
      created_at: new Date().toISOString(),
    });

    // Send SMS alerts to suppliers
    await this.sendSupplierAlerts(
      product,
      county,
      `Emergency price cap: Max ${maxPrice} KES for ${product}`,
    );
  }

  async forceInventorySync(): Promise<void> {
    console.log("🔄 Force inventory sync initiated");

    // Trigger USSD-to-web data reconciliation
    await supabase.rpc("force_inventory_sync");

    // Log the action
    await this.logAdminAction(
      "force_inventory_sync",
      "USSD-to-web data reconciliation",
    );
  }

  async blacklistSupplier(supplierId: string, reason: string): Promise<void> {
    console.log(`🚫 Blacklisting supplier: ${supplierId}, Reason: ${reason}`);

    await supabase
      .from("suppliers")
      .update({
        status: "blacklisted",
        blacklist_reason: reason,
        blacklisted_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    // Create alert
    await this.createAlert({
      priority: "elephant",
      title: "Supplier Blacklisted",
      message: `Supplier ${supplierId} has been blacklisted: ${reason}`,
      requiresHuman: false,
      ussdFallback: "*384*BAN#",
    });
  }

  async createAlert(
    alert: Omit<AdminAlert, "id" | "timestamp" | "resolved">,
  ): Promise<AdminAlert> {
    const newAlert: AdminAlert = {
      id: `alert_${Date.now()}`,
      timestamp: new Date(),
      resolved: false,
      ...alert,
    };

    await supabase.from("admin_alerts").insert({
      id: newAlert.id,
      priority: newAlert.priority,
      title: newAlert.title,
      message: newAlert.message,
      county: newAlert.county,
      requires_human: newAlert.requiresHuman,
      ussd_fallback: newAlert.ussdFallback,
      timestamp: newAlert.timestamp.toISOString(),
      resolved: newAlert.resolved,
    });

    return newAlert;
  }

  async resolveAlert(alertId: string, actionTaken: string): Promise<void> {
    await supabase
      .from("admin_alerts")
      .update({
        resolved: true,
        action_taken: actionTaken,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", alertId);
  }

  // Helper methods
  private async calculateGMV() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", yesterday.toISOString());

    if (error) throw error;

    const currentGMV = (data || []).reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0,
    );

    return {
      current: currentGMV,
      change24h: currentGMV * 0.12, // Mock 12% growth
      changePercent: 12.3,
    };
  }

  private async getLiveOrdersByCounty() {
    // Mock real-time order data by county
    const counties: KenyanCounties[] = [
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
    ];
    const coordinates: Record<KenyanCounties, [number, number]> = {
      Nairobi: [-1.2921, 36.8219],
      Mombasa: [-4.0435, 39.6682],
      Kisumu: [-0.0917, 34.768],
      Nakuru: [-0.3031, 36.08],
      Eldoret: [0.5143, 35.2698],
      Thika: [-1.0332, 37.0744],
      Malindi: [-3.2175, 40.1167],
      Nyeri: [-0.4167, 36.95],
      Meru: [0.0467, 37.65],
      Embu: [-0.5314, 37.45],
      Garissa: [-0.4569, 39.64],
      Kakamega: [0.2839, 34.7519],
      Kitale: [1.0158, 35.0061],
      Machakos: [-1.5177, 37.2634],
      Kericho: [-0.3681, 35.2861],
      Isiolo: [0.3542, 37.5833],
      Nanyuki: [0.0167, 37.0667],
      Voi: [-3.3961, 38.5561],
      Kilifi: [-3.5053, 39.902],
      Lamu: [-2.2717, 40.902],
    };

    return counties.map((county) => ({
      county,
      orderCount: Math.floor(Math.random() * 50) + 5,
      value: Math.floor(Math.random() * 100000) + 10000,
      coordinates: coordinates[county],
    }));
  }

  private async getDroughtAlerts() {
    return [
      {
        county: "Turkana" as KenyanCounties,
        severity: "high" as const,
        affectedSuppliers: 23,
      },
      {
        county: "Marsabit" as KenyanCounties,
        severity: "medium" as const,
        affectedSuppliers: 12,
      },
    ];
  }

  private async getSIMCardViolations() {
    const totalNewOrders = 1000;
    const violations = 67;
    return {
      count: violations,
      threshold: 50, // 5% threshold = 50 violations
      percentage: (violations / totalNewOrders) * 100,
    };
  }

  private async getPriceGougingAlerts() {
    return [
      {
        product: "Unga Pembe 1kg",
        supplier: "Nakuru Supplies Ltd",
        currentPrice: 180,
        medianPrice: 140,
        deviation: 28.6,
      },
      {
        product: "Cooking Oil 1L",
        supplier: "Coast Distributors",
        currentPrice: 320,
        medianPrice: 260,
        deviation: 23.1,
      },
    ];
  }

  private async getGhostStockListings() {
    return [
      {
        productId: "prod_123",
        reportCount: 5,
        supplierId: "supp_456",
        status: "investigating" as const,
      },
      {
        productId: "prod_789",
        reportCount: 3,
        supplierId: "supp_101",
        status: "delisted" as const,
      },
    ];
  }

  private async getSupplierTrustScores() {
    return [
      {
        supplierId: "supp_001",
        supplierName: "Nakuru Farmers Coop",
        rhinoRating: 5,
        deliveryScore: 0.95,
        priceConsistency: 0.88,
        overallScore: 0.91,
      },
      {
        supplierId: "supp_002",
        supplierName: "Mombasa Fresh Foods",
        rhinoRating: 4,
        deliveryScore: 0.87,
        priceConsistency: 0.92,
        overallScore: 0.89,
      },
    ];
  }

  private async getAlerts(): Promise<AdminAlert[]> {
    const { data, error } = await supabase
      .from("admin_alerts")
      .select("*")
      .eq("resolved", false)
      .order("timestamp", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch alerts:", error);
      return this.getMockAlerts();
    }

    return (data || []).map((alert) => ({
      id: alert.id,
      priority: alert.priority as AlertPriority,
      title: alert.title,
      message: alert.message,
      county: alert.county as KenyanCounties,
      requiresHuman: alert.requires_human,
      ussdFallback: alert.ussd_fallback,
      timestamp: new Date(alert.timestamp),
      resolved: alert.resolved,
      actionTaken: alert.action_taken,
    }));
  }

  private getMockAlerts(): AdminAlert[] {
    return [
      {
        id: "alert_001",
        priority: "lion",
        title: "M-Pesa API Outage",
        message:
          "M-Pesa payments failing system-wide. Auto-switched to Equity Bank API.",
        requiresHuman: true,
        ussdFallback: "*384*MPESA#",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        resolved: false,
      },
      {
        id: "alert_002",
        priority: "elephant",
        title: "Fraud Pattern Detected",
        message: "12 fake maize listings detected in Kibera",
        county: "Nairobi",
        requiresHuman: true,
        ussdFallback: "*384*REVIEW#",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        resolved: false,
      },
    ];
  }

  private async sendSupplierAlerts(
    product: string,
    county: KenyanCounties | undefined,
    message: string,
  ): Promise<void> {
    // Mock SMS sending - integrate with Africa's Talking
    console.log(
      `📱 Sending SMS alerts to suppliers in ${county || "all counties"}: ${message}`,
    );
  }

  private async logAdminAction(action: string, details: string): Promise<void> {
    await supabase.from("admin_action_logs").insert({
      action,
      details,
      timestamp: new Date().toISOString(),
      admin_id: "current_admin", // In production, get from auth context
    });
  }

  formatKES(amount: number, locale: string = "en"): string {
    return locale === "sw"
      ? `Sh${amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`
      : `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  }
}

export const savannaCommandCenter = new SavannaCommandCenterService();
