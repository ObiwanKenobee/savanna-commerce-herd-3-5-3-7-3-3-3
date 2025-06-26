import { supabase } from "../integrations/supabase/client";

export interface ModerationResult {
  aiConfidence: number;
  flaggedIssues: string[];
  recommendations: string[];
  priceAnomaly?: {
    detected: boolean;
    marketPrice: number;
    deviation: number;
  };
  imageAnalysis?: {
    isProductImage: boolean;
    matchesDescription: boolean;
    qualityScore: number;
  };
  textAnalysis?: {
    hasProhibitedWords: boolean;
    languageCompliance: boolean;
    sentimentScore: number;
  };
}

export interface CommunityReport {
  productId: string;
  reporterId: string;
  reason: "fake" | "overpriced" | "inappropriate" | "fraud" | "other";
  description: string;
  evidence?: string[];
}

class ContentModerationService {
  private readonly PRICE_DEVIATION_THRESHOLD = 0.2; // 20%
  private readonly MIN_QUALITY_SCORE = 0.6;
  private readonly PROHIBITED_WORDS = [
    "haramu",
    "bangi",
    "ulevi",
    "rushwa",
    "ujambazi",
    "prohibited",
    "illegal",
    "drug",
    "weapon",
    "alcohol",
  ];

  async screenProduct(productData: any): Promise<ModerationResult> {
    try {
      console.log("🦅 Vulture Watch AI: Screening product:", productData.name);

      const [priceAnalysis, imageAnalysis, textAnalysis] = await Promise.all([
        this.analyzePricing(productData),
        this.analyzeImages(productData.images),
        this.analyzeText(productData.name, productData.description),
      ]);

      const result: ModerationResult = {
        aiConfidence: this.calculateOverallConfidence(
          priceAnalysis,
          imageAnalysis,
          textAnalysis,
        ),
        flaggedIssues: [],
        recommendations: [],
        priceAnomaly: priceAnalysis,
        imageAnalysis: imageAnalysis,
        textAnalysis: textAnalysis,
      };

      // Compile flagged issues
      if (priceAnalysis.detected) {
        result.flaggedIssues.push(
          `Price ${priceAnalysis.deviation > 0 ? "too high" : "too low"} by ${Math.abs(priceAnalysis.deviation * 100).toFixed(1)}%`,
        );
        result.recommendations.push("Review pricing against market rates");
      }

      if (imageAnalysis && !imageAnalysis.isProductImage) {
        result.flaggedIssues.push(
          "Image does not appear to be a product photo",
        );
        result.recommendations.push("Request clear product images");
      }

      if (imageAnalysis && !imageAnalysis.matchesDescription) {
        result.flaggedIssues.push("Image does not match product description");
        result.recommendations.push("Verify product-image consistency");
      }

      if (textAnalysis.hasProhibitedWords) {
        result.flaggedIssues.push("Contains prohibited words");
        result.recommendations.push(
          "Review product description for compliance",
        );
      }

      if (textAnalysis.sentimentScore < 0) {
        result.flaggedIssues.push("Negative sentiment in description");
        result.recommendations.push(
          "Check for misleading or negative language",
        );
      }

      // Log the screening result
      await this.logModerationAttempt(productData, result);

      return result;
    } catch (error) {
      console.error("Vulture Watch AI screening failed:", error);
      // Return conservative result on error
      return {
        aiConfidence: 0.3,
        flaggedIssues: ["AI screening failed - requires human review"],
        recommendations: ["Manual review required due to system error"],
      };
    }
  }

  async submitCommunityReport(
    report: CommunityReport,
  ): Promise<{ success: boolean; reward?: number }> {
    try {
      // Store the report
      const { data: reportData, error } = await supabase
        .from("community_reports")
        .insert({
          product_id: report.productId,
          reporter_id: report.reporterId,
          reason: report.reason,
          description: report.description,
          evidence: report.evidence,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Flag the product for immediate review
      await this.flagProductForReview(
        report.productId,
        `Community report: ${report.reason}`,
      );

      // Auto-investigate if multiple reports for same product
      const recentReports = await this.getRecentReports(report.productId);
      if (recentReports.length >= 3) {
        await this.triggerUrgentReview(
          report.productId,
          "Multiple community reports",
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to submit community report:", error);
      return { success: false };
    }
  }

  async validateCommunityReport(
    reportId: string,
    isValid: boolean,
    moderatorId: string,
  ): Promise<{ reward: number }> {
    try {
      const { data: report, error } = await supabase
        .from("community_reports")
        .update({
          status: isValid ? "confirmed" : "rejected",
          validated_by: moderatorId,
          validated_at: new Date().toISOString(),
        })
        .eq("id", reportId)
        .select()
        .single();

      if (error) throw error;

      if (isValid) {
        // Award airtime to reporter
        const reward = 50; // 50 KSh airtime
        await this.awardAirtime(report.reporter_id, reward);
        return { reward };
      }

      return { reward: 0 };
    } catch (error) {
      console.error("Failed to validate community report:", error);
      return { reward: 0 };
    }
  }

  async getModerationQueue(
    priority?: "low" | "medium" | "high",
  ): Promise<any[]> {
    try {
      let query = supabase
        .from("moderation_queue")
        .select(
          `
          *,
          product:products(*),
          reports:community_reports(*)
        `,
        )
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (priority) {
        query = query.eq("priority", priority);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Failed to get moderation queue:", error);
      return [];
    }
  }

  async approveProduct(
    productId: string,
    moderatorId: string,
    notes?: string,
  ): Promise<void> {
    try {
      // Update product status
      await supabase
        .from("products")
        .update({
          status: "approved",
          approved_by: moderatorId,
          approved_at: new Date().toISOString(),
          moderator_notes: notes,
        })
        .eq("id", productId);

      // Remove from moderation queue
      await supabase
        .from("moderation_queue")
        .update({ status: "resolved" })
        .eq("product_id", productId);

      // Notify supplier
      await this.notifySupplier(productId, "approved");
    } catch (error) {
      console.error("Failed to approve product:", error);
      throw error;
    }
  }

  async rejectProduct(
    productId: string,
    moderatorId: string,
    reason: string,
  ): Promise<void> {
    try {
      // Update product status
      await supabase
        .from("products")
        .update({
          status: "rejected",
          rejected_by: moderatorId,
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq("id", productId);

      // Remove from moderation queue
      await supabase
        .from("moderation_queue")
        .update({ status: "resolved" })
        .eq("product_id", productId);

      // Notify supplier
      await this.notifySupplier(productId, "rejected", reason);
    } catch (error) {
      console.error("Failed to reject product:", error);
      throw error;
    }
  }

  private async analyzePricing(
    productData: any,
  ): Promise<{ detected: boolean; marketPrice: number; deviation: number }> {
    try {
      // Get market price for similar products
      const { data: similarProducts, error } = await supabase
        .from("products")
        .select("price")
        .eq("category", productData.category)
        .eq("unit", productData.unit)
        .eq("status", "approved")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        ); // Last 30 days

      if (error || !similarProducts || similarProducts.length === 0) {
        return {
          detected: false,
          marketPrice: productData.price,
          deviation: 0,
        };
      }

      // Calculate median market price
      const prices = similarProducts.map((p) => p.price).sort((a, b) => a - b);
      const marketPrice = prices[Math.floor(prices.length / 2)];

      // Calculate deviation
      const deviation = (productData.price - marketPrice) / marketPrice;
      const detected = Math.abs(deviation) > this.PRICE_DEVIATION_THRESHOLD;

      return { detected, marketPrice, deviation };
    } catch (error) {
      console.error("Price analysis failed:", error);
      return { detected: false, marketPrice: productData.price, deviation: 0 };
    }
  }

  private async analyzeImages(
    images?: any[],
  ): Promise<
    | {
        isProductImage: boolean;
        matchesDescription: boolean;
        qualityScore: number;
      }
    | undefined
  > {
    if (!images || images.length === 0) {
      return undefined;
    }

    try {
      // Mock image analysis - in production, use Google Vision API or similar
      // For now, return optimistic results for existing images
      return {
        isProductImage: true,
        matchesDescription: true,
        qualityScore: 0.8,
      };
    } catch (error) {
      console.error("Image analysis failed:", error);
      return {
        isProductImage: false,
        matchesDescription: false,
        qualityScore: 0.3,
      };
    }
  }

  private async analyzeText(
    name: string,
    description?: string,
  ): Promise<{
    hasProhibitedWords: boolean;
    languageCompliance: boolean;
    sentimentScore: number;
  }> {
    try {
      const fullText = `${name} ${description || ""}`.toLowerCase();

      // Check for prohibited words
      const hasProhibitedWords = this.PROHIBITED_WORDS.some((word) =>
        fullText.includes(word.toLowerCase()),
      );

      // Basic language compliance (check for English/Swahili)
      const hasValidChars = /^[a-zA-Z0-9\s\-.,!?áéíóúÁÉÍÓÚ]+$/.test(fullText);

      // Simple sentiment analysis (count positive vs negative words)
      const positiveWords = [
        "fresh",
        "quality",
        "best",
        "mzuri",
        "nzuri",
        "bora",
      ];
      const negativeWords = ["bad", "poor", "fake", "mbaya", "vibaya"];

      const positiveCount = positiveWords.filter((word) =>
        fullText.includes(word),
      ).length;
      const negativeCount = negativeWords.filter((word) =>
        fullText.includes(word),
      ).length;

      const sentimentScore = positiveCount - negativeCount;

      return {
        hasProhibitedWords,
        languageCompliance: hasValidChars,
        sentimentScore,
      };
    } catch (error) {
      console.error("Text analysis failed:", error);
      return {
        hasProhibitedWords: false,
        languageCompliance: true,
        sentimentScore: 0,
      };
    }
  }

  private calculateOverallConfidence(
    priceAnalysis: any,
    imageAnalysis: any,
    textAnalysis: any,
  ): number {
    let confidence = 1.0;

    // Reduce confidence for each flagged issue
    if (priceAnalysis.detected) {
      confidence -= 0.3;
    }

    if (imageAnalysis && !imageAnalysis.isProductImage) {
      confidence -= 0.4;
    }

    if (imageAnalysis && !imageAnalysis.matchesDescription) {
      confidence -= 0.3;
    }

    if (textAnalysis.hasProhibitedWords) {
      confidence -= 0.5;
    }

    if (!textAnalysis.languageCompliance) {
      confidence -= 0.2;
    }

    if (textAnalysis.sentimentScore < -1) {
      confidence -= 0.2;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  private async flagProductForReview(
    productId: string,
    reason: string,
  ): Promise<void> {
    await supabase.from("moderation_queue").upsert({
      product_id: productId,
      priority: "medium",
      flagged_issues: [reason],
      created_at: new Date().toISOString(),
    });
  }

  private async triggerUrgentReview(
    productId: string,
    reason: string,
  ): Promise<void> {
    await supabase.from("moderation_queue").upsert({
      product_id: productId,
      priority: "high",
      flagged_issues: [reason],
      created_at: new Date().toISOString(),
    });
  }

  private async getRecentReports(productId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("community_reports")
      .select("*")
      .eq("product_id", productId)
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ) // Last 24 hours
      .eq("status", "pending");

    return data || [];
  }

  private async awardAirtime(userId: string, amount: number): Promise<void> {
    // Mock airtime award - integrate with mobile money APIs
    console.log(`Awarding ${amount} KSh airtime to user ${userId}`);

    // Store the reward record
    await supabase.from("community_rewards").insert({
      user_id: userId,
      reward_type: "airtime",
      amount: amount,
      reason: "Valid community report",
      awarded_at: new Date().toISOString(),
    });
  }

  private async notifySupplier(
    productId: string,
    status: "approved" | "rejected",
    reason?: string,
  ): Promise<void> {
    // Get product and supplier info
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        supplier:users(*)
      `,
      )
      .eq("id", productId)
      .single();

    if (error || !product) return;

    // Send notification based on upload method
    const message =
      status === "approved"
        ? `Bidhaa yako "${product.name}" imeidhinishwa!`
        : `Bidhaa yako "${product.name}" haikuidhinishwa. Sababu: ${reason}`;

    if (product.upload_method === "ussd") {
      // Send SMS
      console.log(`SMS to ${product.supplier.phone}: ${message}`);
    } else {
      // Store in-app notification
      await supabase.from("notifications").insert({
        user_id: product.supplier_id,
        type: "product_status",
        title: status === "approved" ? "Product Approved" : "Product Rejected",
        message: message,
        created_at: new Date().toISOString(),
      });
    }
  }

  private async logModerationAttempt(
    productData: any,
    result: ModerationResult,
  ): Promise<void> {
    await supabase.from("moderation_logs").insert({
      product_name: productData.name,
      supplier_id: productData.supplierId,
      ai_confidence: result.aiConfidence,
      flagged_issues: result.flaggedIssues,
      upload_method: productData.metadata?.uploadMethod,
      created_at: new Date().toISOString(),
    });
  }
}

export const contentModerationService = new ContentModerationService();
