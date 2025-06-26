import { supabase } from "@/integrations/supabase/client";

interface BaobabScore {
  supplierId: string;
  supplierName: string;
  overallScore: number;
  onTimeDeliveryRate: number;
  stockoutFrequency: number;
  retailerRating: number;
  responseTime: number;
  qualityScore: number;
  reliabilityScore: number;
  growthScore: number;
  lastUpdated: string;
  trend: "improving" | "declining" | "stable";
  rank: number;
  badge:
    | "lion_partner"
    | "elephant_reliable"
    | "cheetah_fast"
    | "rhino_strong"
    | "zebra_consistent"
    | null;
}

interface PerformanceMetrics {
  supplierId: string;
  timeframe: "daily" | "weekly" | "monthly" | "quarterly";
  metrics: {
    totalOrders: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
    cancelledOrders: number;
    avgResponseTime: number; // hours
    stockouts: number;
    restockTime: number; // hours
    customerComplaints: number;
    positiveReviews: number;
    avgRating: number;
    revenueGenerated: number;
    profitMargin: number;
    repeatCustomers: number;
  };
  period: string;
}

interface SupplierInsight {
  supplierId: string;
  type: "opportunity" | "warning" | "achievement" | "recommendation";
  title: string;
  description: string;
  impact: "low" | "medium" | "high" | "critical";
  actionRequired: boolean;
  suggestedActions: string[];
  metric: string;
  value: number;
  benchmark: number;
  generatedAt: string;
}

interface PerformanceAlert {
  id: string;
  supplierId: string;
  alertType:
    | "late_delivery"
    | "stockout"
    | "poor_rating"
    | "slow_response"
    | "quality_issue";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  threshold: number;
  currentValue: number;
  triggeredAt: string;
  resolved: boolean;
  actionTaken?: string;
}

class SupplierAnalyticsService {
  private static instance: SupplierAnalyticsService;
  private baobabScores = new Map<string, BaobabScore>();
  private performanceMetrics = new Map<string, PerformanceMetrics[]>();
  private updateInterval = 60 * 60 * 1000; // 1 hour

  static getInstance(): SupplierAnalyticsService {
    if (!SupplierAnalyticsService.instance) {
      SupplierAnalyticsService.instance = new SupplierAnalyticsService();
    }
    return SupplierAnalyticsService.instance;
  }

  constructor() {
    this.initializeService();
    this.startPeriodicUpdates();
  }

  // Initialize analytics service
  private async initializeService() {
    console.log("🌳 Baobab Score Analytics initialized");
    await this.calculateAllBaobabScores();
    await this.generatePerformanceInsights();
  }

  // Start periodic updates
  private startPeriodicUpdates() {
    // Update Baobab scores every hour
    setInterval(() => this.calculateAllBaobabScores(), this.updateInterval);

    // Generate insights every 4 hours
    setInterval(
      () => this.generatePerformanceInsights(),
      4 * this.updateInterval,
    );

    // Check for performance alerts every 30 minutes
    setInterval(() => this.checkPerformanceAlerts(), 30 * 60 * 1000);
  }

  // Calculate Baobab Score for all suppliers
  async calculateAllBaobabScores(): Promise<void> {
    try {
      const { data: suppliers } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("organization_type", "supplier");

      if (!suppliers) return;

      for (const supplier of suppliers) {
        const score = await this.calculateBaobabScore(supplier.id);
        if (score) {
          this.baobabScores.set(supplier.id, score);

          // Store in database
          await this.storeBaobabScore(score);
        }
      }

      // Assign ranks and badges
      await this.assignRanksAndBadges();

      console.log(`🏆 Updated Baobab scores for ${suppliers.length} suppliers`);
    } catch (error) {
      console.error("Failed to calculate Baobab scores:", error);
    }
  }

  // Calculate individual Baobab Score
  async calculateBaobabScore(supplierId: string): Promise<BaobabScore | null> {
    try {
      const metrics = await this.getSupplierMetrics(supplierId, "monthly");
      if (!metrics) return null;

      // Get supplier info
      const { data: supplier } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", supplierId)
        .single();

      if (!supplier) return null;

      // Calculate component scores (0-100 scale)
      const onTimeDeliveryRate = this.calculateOnTimeDeliveryRate(metrics);
      const stockoutFrequency = this.calculateStockoutScore(metrics);
      const retailerRating = this.calculateRetailerRatingScore(metrics);
      const responseTime = this.calculateResponseTimeScore(metrics);
      const qualityScore = this.calculateQualityScore(metrics);
      const reliabilityScore = this.calculateReliabilityScore(metrics);
      const growthScore = this.calculateGrowthScore(supplierId, metrics);

      // Weighted overall score
      const overallScore =
        onTimeDeliveryRate * 0.25 + // 25% - Critical for customer satisfaction
        stockoutFrequency * 0.2 + // 20% - Inventory management
        retailerRating * 0.2 + // 20% - Customer satisfaction
        responseTime * 0.15 + // 15% - Communication
        qualityScore * 0.1 + // 10% - Product quality
        reliabilityScore * 0.05 + // 5% - Consistency
        growthScore * 0.05; // 5% - Business growth

      // Calculate trend
      const trend = await this.calculateTrend(supplierId, overallScore);

      return {
        supplierId,
        supplierName: supplier.name,
        overallScore: Math.round(overallScore * 100) / 100,
        onTimeDeliveryRate,
        stockoutFrequency: 100 - stockoutFrequency, // Invert so higher is better
        retailerRating,
        responseTime,
        qualityScore,
        reliabilityScore,
        growthScore,
        lastUpdated: new Date().toISOString(),
        trend,
        rank: 0, // Will be assigned later
        badge: null, // Will be assigned later
      };
    } catch (error) {
      console.error(
        `Failed to calculate Baobab score for supplier ${supplierId}:`,
        error,
      );
      return null;
    }
  }

  // Get comprehensive supplier metrics
  private async getSupplierMetrics(
    supplierId: string,
    timeframe: "daily" | "weekly" | "monthly" | "quarterly",
  ): Promise<PerformanceMetrics | null> {
    try {
      const days = { daily: 1, weekly: 7, monthly: 30, quarterly: 90 }[
        timeframe
      ];
      const startDate = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      // Get orders data
      const { data: orders } = await supabase
        .from("orders")
        .select(
          `
          id, status, total_amount, created_at, delivery_date, 
          delivered_at, cancelled_at, order_items(product_id, quantity)
        `,
        )
        .eq("supplier_id", supplierId)
        .gte("created_at", startDate);

      // Get product data
      const { data: products } = await supabase
        .from("products")
        .select("id, stock_quantity, status, created_at")
        .eq("supplier_id", supplierId);

      // Get reviews/ratings
      const { data: reviews } = await supabase
        .from("supplier_reviews")
        .select("rating, comment, created_at")
        .eq("supplier_id", supplierId)
        .gte("created_at", startDate);

      // Get stockout events
      const { data: stockouts } = await supabase
        .from("inventory_alerts")
        .select("created_at, resolved_at")
        .eq("supplier_id", supplierId)
        .eq("alert_type", "out_of_stock")
        .gte("created_at", startDate);

      // Calculate metrics
      const totalOrders = orders?.length || 0;
      const onTimeDeliveries =
        orders?.filter(
          (o) =>
            o.delivered_at &&
            o.delivery_date &&
            new Date(o.delivered_at) <= new Date(o.delivery_date),
        ).length || 0;

      const lateDeliveries =
        orders?.filter(
          (o) =>
            o.delivered_at &&
            o.delivery_date &&
            new Date(o.delivered_at) > new Date(o.delivery_date),
        ).length || 0;

      const cancelledOrders =
        orders?.filter((o) => o.status === "cancelled").length || 0;

      const avgRating =
        reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      const positiveReviews = reviews?.filter((r) => r.rating >= 4).length || 0;
      const customerComplaints =
        reviews?.filter((r) => r.rating <= 2).length || 0;

      const revenueGenerated =
        orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;

      // Calculate response time (mock - would need message/inquiry data)
      const avgResponseTime = 2.5; // Mock: 2.5 hours average

      return {
        supplierId,
        timeframe,
        metrics: {
          totalOrders,
          onTimeDeliveries,
          lateDeliveries,
          cancelledOrders,
          avgResponseTime,
          stockouts: stockouts?.length || 0,
          restockTime: 24, // Mock: 24 hours average restock time
          customerComplaints,
          positiveReviews,
          avgRating,
          revenueGenerated,
          profitMargin: 0.15, // Mock: 15% profit margin
          repeatCustomers: Math.floor(totalOrders * 0.3), // Mock: 30% repeat rate
        },
        period: `${startDate.split("T")[0]} to ${new Date().toISOString().split("T")[0]}`,
      };
    } catch (error) {
      console.error("Failed to get supplier metrics:", error);
      return null;
    }
  }

  // Calculate component scores
  private calculateOnTimeDeliveryRate(metrics: PerformanceMetrics): number {
    const { onTimeDeliveries, totalOrders } = metrics.metrics;
    if (totalOrders === 0) return 50; // Neutral score for new suppliers
    return (onTimeDeliveries / totalOrders) * 100;
  }

  private calculateStockoutScore(metrics: PerformanceMetrics): number {
    const { stockouts } = metrics.metrics;
    // Lower stockouts = higher score
    const maxStockouts = 10; // Threshold for 0 score
    return Math.max(0, (1 - stockouts / maxStockouts) * 100);
  }

  private calculateRetailerRatingScore(metrics: PerformanceMetrics): number {
    const { avgRating } = metrics.metrics;
    return (avgRating / 5) * 100; // Convert 5-star rating to 100-point scale
  }

  private calculateResponseTimeScore(metrics: PerformanceMetrics): number {
    const { avgResponseTime } = metrics.metrics;
    // Lower response time = higher score
    const maxResponseTime = 24; // 24 hours = 0 score
    return Math.max(0, (1 - avgResponseTime / maxResponseTime) * 100);
  }

  private calculateQualityScore(metrics: PerformanceMetrics): number {
    const { positiveReviews, customerComplaints, totalOrders } =
      metrics.metrics;
    if (totalOrders === 0) return 50;

    const qualityRatio = (positiveReviews - customerComplaints) / totalOrders;
    return Math.max(0, Math.min(100, (qualityRatio + 0.5) * 100)); // Normalize to 0-100
  }

  private calculateReliabilityScore(metrics: PerformanceMetrics): number {
    const { totalOrders, cancelledOrders } = metrics.metrics;
    if (totalOrders === 0) return 50;

    const reliabilityRate = (totalOrders - cancelledOrders) / totalOrders;
    return reliabilityRate * 100;
  }

  private calculateGrowthScore(
    supplierId: string,
    metrics: PerformanceMetrics,
  ): number {
    // Compare current period with previous period (simplified)
    const { revenueGenerated, totalOrders } = metrics.metrics;

    // Mock growth calculation (would compare with historical data)
    const growthRate = 0.15; // Mock: 15% growth
    return Math.min(100, Math.max(0, (growthRate + 0.5) * 100));
  }

  // Calculate trend based on historical scores
  private async calculateTrend(
    supplierId: string,
    currentScore: number,
  ): Promise<"improving" | "declining" | "stable"> {
    try {
      const { data: history } = await supabase
        .from("baobab_scores")
        .select("overall_score, last_updated")
        .eq("supplier_id", supplierId)
        .order("last_updated", { ascending: false })
        .limit(3);

      if (!history || history.length < 2) return "stable";

      const previousScore = history[1].overall_score;
      const scoreDiff = currentScore - previousScore;

      if (scoreDiff > 2) return "improving";
      if (scoreDiff < -2) return "declining";
      return "stable";
    } catch (error) {
      console.error("Failed to calculate trend:", error);
      return "stable";
    }
  }

  // Store Baobab score in database
  private async storeBaobabScore(score: BaobabScore): Promise<void> {
    try {
      await supabase.from("baobab_scores").upsert({
        supplier_id: score.supplierId,
        overall_score: score.overallScore,
        on_time_delivery_rate: score.onTimeDeliveryRate,
        stockout_frequency: score.stockoutFrequency,
        retailer_rating: score.retailerRating,
        response_time: score.responseTime,
        quality_score: score.qualityScore,
        reliability_score: score.reliabilityScore,
        growth_score: score.growthScore,
        trend: score.trend,
        rank: score.rank,
        badge: score.badge,
        last_updated: score.lastUpdated,
      });
    } catch (error) {
      console.error("Failed to store Baobab score:", error);
    }
  }

  // Assign ranks and badges based on performance
  private async assignRanksAndBadges(): Promise<void> {
    try {
      const scores = Array.from(this.baobabScores.values()).sort(
        (a, b) => b.overallScore - a.overallScore,
      );

      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        score.rank = i + 1;

        // Assign badges based on performance
        if (score.rank === 1 && score.overallScore >= 90) {
          score.badge = "lion_partner"; // Top 1% and excellent score
        } else if (score.reliabilityScore >= 95) {
          score.badge = "elephant_reliable"; // Exceptional reliability
        } else if (score.responseTime >= 90) {
          score.badge = "cheetah_fast"; // Fast response times
        } else if (score.qualityScore >= 90) {
          score.badge = "rhino_strong"; // High quality products
        } else if (score.onTimeDeliveryRate >= 95) {
          score.badge = "zebra_consistent"; // Consistent on-time delivery
        }

        // Update in cache and database
        this.baobabScores.set(score.supplierId, score);
        await this.storeBaobabScore(score);
      }

      console.log("🏅 Ranks and badges assigned");
    } catch (error) {
      console.error("Failed to assign ranks and badges:", error);
    }
  }

  // Generate performance insights and recommendations
  async generatePerformanceInsights(): Promise<void> {
    try {
      const insights: SupplierInsight[] = [];

      for (const [supplierId, score] of this.baobabScores) {
        const supplierInsights = await this.analyzeSupplierPerformance(
          supplierId,
          score,
        );
        insights.push(...supplierInsights);
      }

      // Store insights
      for (const insight of insights) {
        await this.storeInsight(insight);
      }

      console.log(`💡 Generated ${insights.length} performance insights`);
    } catch (error) {
      console.error("Failed to generate insights:", error);
    }
  }

  // Analyze individual supplier performance
  private async analyzeSupplierPerformance(
    supplierId: string,
    score: BaobabScore,
  ): Promise<SupplierInsight[]> {
    const insights: SupplierInsight[] = [];

    // On-time delivery insights
    if (score.onTimeDeliveryRate < 80) {
      insights.push({
        supplierId,
        type: "warning",
        title: "Poor On-Time Delivery Performance",
        description: `On-time delivery rate of ${score.onTimeDeliveryRate.toFixed(1)}% is below the 80% threshold`,
        impact: score.onTimeDeliveryRate < 60 ? "critical" : "high",
        actionRequired: true,
        suggestedActions: [
          "Review delivery logistics and planning",
          "Communicate proactively about potential delays",
          "Improve inventory forecasting",
          "Partner with reliable logistics providers",
        ],
        metric: "on_time_delivery_rate",
        value: score.onTimeDeliveryRate,
        benchmark: 80,
        generatedAt: new Date().toISOString(),
      });
    } else if (score.onTimeDeliveryRate >= 95) {
      insights.push({
        supplierId,
        type: "achievement",
        title: "Excellent Delivery Performance",
        description: `Outstanding on-time delivery rate of ${score.onTimeDeliveryRate.toFixed(1)}%`,
        impact: "medium",
        actionRequired: false,
        suggestedActions: [
          "Maintain current logistics standards",
          "Share best practices with other suppliers",
        ],
        metric: "on_time_delivery_rate",
        value: score.onTimeDeliveryRate,
        benchmark: 95,
        generatedAt: new Date().toISOString(),
      });
    }

    // Stockout frequency insights
    if (score.stockoutFrequency < 70) {
      insights.push({
        supplierId,
        type: "warning",
        title: "High Stockout Frequency",
        description: "Frequent stockouts are impacting customer satisfaction",
        impact: "high",
        actionRequired: true,
        suggestedActions: [
          "Implement demand forecasting",
          "Increase safety stock levels",
          "Improve supplier relationships",
          "Set up automatic reorder points",
        ],
        metric: "stockout_frequency",
        value: score.stockoutFrequency,
        benchmark: 70,
        generatedAt: new Date().toISOString(),
      });
    }

    // Retailer rating insights
    if (score.retailerRating < 70) {
      insights.push({
        supplierId,
        type: "warning",
        title: "Low Retailer Ratings",
        description: `Average rating of ${(score.retailerRating / 20).toFixed(1)}/5 needs improvement`,
        impact: "high",
        actionRequired: true,
        suggestedActions: [
          "Address customer feedback systematically",
          "Improve product quality controls",
          "Enhance customer service training",
          "Implement customer satisfaction surveys",
        ],
        metric: "retailer_rating",
        value: score.retailerRating,
        benchmark: 70,
        generatedAt: new Date().toISOString(),
      });
    }

    // Response time insights
    if (score.responseTime < 60) {
      insights.push({
        supplierId,
        type: "opportunity",
        title: "Slow Response Times",
        description: "Communication response times could be improved",
        impact: "medium",
        actionRequired: true,
        suggestedActions: [
          "Set up automated acknowledgment systems",
          "Designate customer service representatives",
          "Implement communication SLAs",
          "Use messaging apps for faster communication",
        ],
        metric: "response_time",
        value: score.responseTime,
        benchmark: 60,
        generatedAt: new Date().toISOString(),
      });
    }

    // Growth opportunities
    if (score.overallScore >= 80 && score.trend === "improving") {
      insights.push({
        supplierId,
        type: "opportunity",
        title: "Growth Partnership Opportunity",
        description:
          "Strong performance indicates potential for expanded partnership",
        impact: "medium",
        actionRequired: false,
        suggestedActions: [
          "Offer volume discounts for larger orders",
          "Provide priority support and resources",
          "Consider exclusive product arrangements",
          "Nominate for Lion Partner program",
        ],
        metric: "overall_score",
        value: score.overallScore,
        benchmark: 80,
        generatedAt: new Date().toISOString(),
      });
    }

    return insights;
  }

  // Store performance insight
  private async storeInsight(insight: SupplierInsight): Promise<void> {
    try {
      await supabase.from("supplier_insights").insert({
        supplier_id: insight.supplierId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        impact: insight.impact,
        action_required: insight.actionRequired,
        suggested_actions: insight.suggestedActions,
        metric: insight.metric,
        value: insight.value,
        benchmark: insight.benchmark,
        generated_at: insight.generatedAt,
      });
    } catch (error) {
      console.error("Failed to store insight:", error);
    }
  }

  // Check for performance alerts
  async checkPerformanceAlerts(): Promise<void> {
    try {
      const alerts: PerformanceAlert[] = [];

      for (const [supplierId, score] of this.baobabScores) {
        // Check various thresholds
        if (score.onTimeDeliveryRate < 70) {
          alerts.push({
            id: `alert_${supplierId}_delivery_${Date.now()}`,
            supplierId,
            alertType: "late_delivery",
            severity: score.onTimeDeliveryRate < 50 ? "critical" : "high",
            message: `On-time delivery rate dropped to ${score.onTimeDeliveryRate.toFixed(1)}%`,
            threshold: 70,
            currentValue: score.onTimeDeliveryRate,
            triggeredAt: new Date().toISOString(),
            resolved: false,
          });
        }

        if (score.stockoutFrequency < 60) {
          alerts.push({
            id: `alert_${supplierId}_stockout_${Date.now()}`,
            supplierId,
            alertType: "stockout",
            severity: "high",
            message: `High stockout frequency detected`,
            threshold: 60,
            currentValue: score.stockoutFrequency,
            triggeredAt: new Date().toISOString(),
            resolved: false,
          });
        }

        if (score.retailerRating < 60) {
          alerts.push({
            id: `alert_${supplierId}_rating_${Date.now()}`,
            supplierId,
            alertType: "poor_rating",
            severity: "medium",
            message: `Retailer ratings below acceptable threshold`,
            threshold: 60,
            currentValue: score.retailerRating,
            triggeredAt: new Date().toISOString(),
            resolved: false,
          });
        }
      }

      // Store and send alerts
      for (const alert of alerts) {
        await this.storeAlert(alert);
        await this.sendAlert(alert);
      }

      if (alerts.length > 0) {
        console.log(`🚨 Generated ${alerts.length} performance alerts`);
      }
    } catch (error) {
      console.error("Failed to check performance alerts:", error);
    }
  }

  // Store performance alert
  private async storeAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await supabase.from("performance_alerts").insert({
        alert_id: alert.id,
        supplier_id: alert.supplierId,
        alert_type: alert.alertType,
        severity: alert.severity,
        message: alert.message,
        threshold: alert.threshold,
        current_value: alert.currentValue,
        triggered_at: alert.triggeredAt,
        resolved: alert.resolved,
      });
    } catch (error) {
      console.error("Failed to store alert:", error);
    }
  }

  // Send alert notification
  private async sendAlert(alert: PerformanceAlert): Promise<void> {
    try {
      // In production, send via Slack, email, or SMS
      console.log(
        `📢 Performance Alert: ${alert.message} for supplier ${alert.supplierId}`,
      );

      // Could integrate with Slack API here
      // await axios.post(slackWebhookUrl, { text: alert.message });
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
  }

  // Get supplier dashboard data
  async getSupplierDashboard(supplierId: string) {
    try {
      const score = this.baobabScores.get(supplierId);
      const metrics = await this.getSupplierMetrics(supplierId, "monthly");

      const { data: insights } = await supabase
        .from("supplier_insights")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("generated_at", { ascending: false })
        .limit(5);

      const { data: alerts } = await supabase
        .from("performance_alerts")
        .select("*")
        .eq("supplier_id", supplierId)
        .eq("resolved", false);

      return {
        baobabScore: score,
        metrics,
        insights: insights || [],
        activeAlerts: alerts || [],
        recommendations: this.generateRecommendations(score, metrics),
      };
    } catch (error) {
      console.error("Failed to get supplier dashboard:", error);
      return null;
    }
  }

  // Generate actionable recommendations
  private generateRecommendations(
    score?: BaobabScore,
    metrics?: PerformanceMetrics | null,
  ): string[] {
    if (!score || !metrics) return [];

    const recommendations = [];

    if (score.onTimeDeliveryRate < 85) {
      recommendations.push("Focus on improving delivery time consistency");
    }

    if (score.stockoutFrequency < 75) {
      recommendations.push("Implement better inventory management practices");
    }

    if (score.retailerRating < 80) {
      recommendations.push(
        "Invest in customer service training and quality improvements",
      );
    }

    if (score.responseTime < 70) {
      recommendations.push(
        "Set up faster communication channels with customers",
      );
    }

    if (score.overallScore >= 85) {
      recommendations.push(
        "Consider applying for premium partnership benefits",
      );
    }

    return recommendations;
  }

  // Get analytics overview
  async getAnalyticsOverview() {
    try {
      const totalSuppliers = this.baobabScores.size;
      const scores = Array.from(this.baobabScores.values());

      const avgScore =
        scores.reduce((sum, s) => sum + s.overallScore, 0) / totalSuppliers;
      const topPerformers = scores.filter((s) => s.overallScore >= 85).length;
      const underPerformers = scores.filter((s) => s.overallScore < 60).length;
      const improvingSuppliers = scores.filter(
        (s) => s.trend === "improving",
      ).length;

      const badgeDistribution = {
        lion_partner: scores.filter((s) => s.badge === "lion_partner").length,
        elephant_reliable: scores.filter((s) => s.badge === "elephant_reliable")
          .length,
        cheetah_fast: scores.filter((s) => s.badge === "cheetah_fast").length,
        rhino_strong: scores.filter((s) => s.badge === "rhino_strong").length,
        zebra_consistent: scores.filter((s) => s.badge === "zebra_consistent")
          .length,
      };

      return {
        totalSuppliers,
        avgScore: Math.round(avgScore * 100) / 100,
        topPerformers,
        underPerformers,
        improvingSuppliers,
        badgeDistribution,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to get analytics overview:", error);
      return null;
    }
  }
}

export const supplierAnalyticsService = SupplierAnalyticsService.getInstance();
export type {
  BaobabScore,
  PerformanceMetrics,
  SupplierInsight,
  PerformanceAlert,
};
