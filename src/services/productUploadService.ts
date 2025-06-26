import { supabase } from "../integrations/supabase/client";
import { contentModerationService } from "./contentModerationService";
import { fraudPreventionService } from "./fraudPreventionService";
import { userRoleService } from "./userRoleService";

export interface ProductUploadData {
  name: string;
  price: number;
  unit: string;
  category: string;
  description?: string;
  images: File[] | string[];
  supplierId: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  metadata?: {
    uploadMethod: "web" | "ussd" | "whatsapp" | "bulk";
    culturalTag?: "maasai" | "refugee" | "cooperative";
    verificationLevel: "basic" | "verified" | "certified";
  };
}

export interface USSDProductData {
  name: string;
  price: string;
  unit: string;
  imageBase64?: string;
  phoneNumber: string;
}

export interface BulkUploadData {
  csvFile: File;
  cooperativeId: string;
  apiKey: string;
}

export interface ProductModerationResult {
  status: "approved" | "pending" | "rejected";
  aiScore: number;
  flaggedIssues: string[];
  moderatorNotes?: string;
  estimatedApprovalTime: number;
}

class ProductUploadService {
  private readonly AI_CONFIDENCE_THRESHOLD = 0.85;
  private readonly HIGH_VALUE_THRESHOLD = 10000; // KSh

  async uploadProduct(
    data: ProductUploadData,
  ): Promise<ProductModerationResult> {
    try {
      // Step 1: User role verification
      const roleVerification = await userRoleService.verifyUploadPermissions(
        data.supplierId,
      );
      if (!roleVerification.canUpload) {
        throw new Error(`Upload denied: ${roleVerification.reason}`);
      }

      // Step 2: Fraud prevention checks
      const fraudCheck =
        await fraudPreventionService.validateProductUpload(data);
      if (fraudCheck.riskLevel === "high") {
        await this.logSecurityEvent(
          "high_risk_upload",
          data.supplierId,
          fraudCheck.reasons,
        );
        throw new Error("Upload blocked due to security concerns");
      }

      // Step 3: AI pre-screening
      const moderationResult =
        await contentModerationService.screenProduct(data);

      // Step 4: Determine approval workflow
      const needsHumanReview = this.requiresHumanReview(data, moderationResult);

      // Step 5: Store product with appropriate status
      const productId = await this.storeProduct(
        data,
        moderationResult,
        needsHumanReview,
      );

      // Step 6: Handle auto-approval or queue for review
      if (
        !needsHumanReview &&
        moderationResult.aiConfidence > this.AI_CONFIDENCE_THRESHOLD
      ) {
        await this.autoApproveProduct(productId);
        return {
          status: "approved",
          aiScore: moderationResult.aiConfidence,
          flaggedIssues: [],
          estimatedApprovalTime: 0,
        };
      }

      // Step 7: Queue for human moderation
      await this.queueForHumanReview(productId, moderationResult);

      return {
        status: "pending",
        aiScore: moderationResult.aiConfidence,
        flaggedIssues: moderationResult.flaggedIssues,
        estimatedApprovalTime: this.estimateReviewTime(data, moderationResult),
      };
    } catch (error) {
      console.error("Product upload failed:", error);
      throw error;
    }
  }

  async uploadViaUSSD(data: USSDProductData): Promise<string> {
    try {
      // Validate phone number and get user
      const user = await this.validateUSSDUser(data.phoneNumber);

      // Convert USSD data to standard format
      const productData: ProductUploadData = {
        name: data.name.toUpperCase(), // USSD typically in caps
        price: parseFloat(data.price),
        unit: this.standardizeUnit(data.unit),
        category: await this.inferCategoryFromName(data.name),
        supplierId: user.id,
        metadata: {
          uploadMethod: "ussd",
          verificationLevel: user.verification_level || "basic",
        },
      };

      // Handle image if provided
      if (data.imageBase64) {
        const imageFile = await this.base64ToFile(
          data.imageBase64,
          "ussd-upload.jpg",
        );
        productData.images = [imageFile];
      }

      const result = await this.uploadProduct(productData);

      // Send SMS confirmation
      await this.sendUSSDConfirmation(data.phoneNumber, result);

      return `Product ${data.name} submitted. Status: ${result.status}. Ref: ${Date.now()}`;
    } catch (error) {
      console.error("USSD upload failed:", error);
      throw new Error("Samahani, kuongeza bidhaa kumeshindikana. Jaribu tena.");
    }
  }

  async uploadViaBulk(
    data: BulkUploadData,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      // Verify aggregator permissions
      const permissions = await userRoleService.verifyAggregatorPermissions(
        data.cooperativeId,
        data.apiKey,
      );
      if (!permissions.canBulkUpload) {
        throw new Error("Bulk upload permissions denied");
      }

      // Parse CSV
      const products = await this.parseCSV(data.csvFile);

      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      // Process in batches to avoid overwhelming the system
      const batchSize = 10;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (product, index) => {
            try {
              const productData: ProductUploadData = {
                ...product,
                supplierId: data.cooperativeId,
                metadata: {
                  uploadMethod: "bulk",
                  verificationLevel: "certified",
                },
              };

              await this.uploadProduct(productData);
              results.success++;
            } catch (error) {
              results.failed++;
              results.errors.push(
                `Row ${i + index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }
          }),
        );
      }

      return results;
    } catch (error) {
      console.error("Bulk upload failed:", error);
      throw error;
    }
  }

  async uploadViaWhatsApp(
    phoneNumber: string,
    images: string[],
    voiceNote?: string,
  ): Promise<string> {
    try {
      // Parse voice note using AI (Swahili NLP)
      const productInfo = voiceNote
        ? await this.parseSwahiliVoiceNote(voiceNote)
        : null;

      // If no voice note, request basic info via WhatsApp
      if (!productInfo) {
        await this.requestProductInfoViaWhatsApp(phoneNumber);
        return "Tuma sauti yako ukieleza bidhaa: jina, bei, na aina.";
      }

      const user = await this.validateWhatsAppUser(phoneNumber);

      const productData: ProductUploadData = {
        name: productInfo.name,
        price: productInfo.price,
        unit: productInfo.unit || "piece",
        category: await this.inferCategoryFromName(productInfo.name),
        description: productInfo.description,
        supplierId: user.id,
        images: images,
        metadata: {
          uploadMethod: "whatsapp",
          verificationLevel: user.verification_level || "basic",
        },
      };

      const result = await this.uploadProduct(productData);

      return `Asante! Bidhaa "${productInfo.name}" imepokewa. Hali: ${result.status === "approved" ? "Imeidhinishwa" : "Inasubiri uhakiki"}.`;
    } catch (error) {
      console.error("WhatsApp upload failed:", error);
      return "Samahani, kuongeza bidhaa kumeshindikana. Jaribu tena.";
    }
  }

  private requiresHumanReview(
    data: ProductUploadData,
    moderation: any,
  ): boolean {
    const conditions = [
      // New suppliers need review
      data.metadata?.verificationLevel === "basic",
      // High-value items need review
      data.price > this.HIGH_VALUE_THRESHOLD,
      // AI flagged issues
      moderation.flaggedIssues.length > 0,
      // Low AI confidence
      moderation.aiConfidence < this.AI_CONFIDENCE_THRESHOLD,
      // Cultural products need special handling
      data.metadata?.culturalTag === "maasai" ||
        data.metadata?.culturalTag === "refugee",
    ];

    return conditions.some((condition) => condition);
  }

  private async storeProduct(
    data: ProductUploadData,
    moderation: any,
    needsReview: boolean,
  ): Promise<string> {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        price: data.price,
        unit: data.unit,
        category: data.category,
        description: data.description,
        supplier_id: data.supplierId,
        status: needsReview ? "pending" : "approved",
        ai_moderation_score: moderation.aiConfidence,
        upload_method: data.metadata?.uploadMethod,
        cultural_tag: data.metadata?.culturalTag,
        verification_level: data.metadata?.verificationLevel,
        location: data.location,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Store images if provided
    if (data.images && data.images.length > 0) {
      await this.storeProductImages(product.id, data.images);
    }

    return product.id;
  }

  private async storeProductImages(
    productId: string,
    images: (File | string)[],
  ): Promise<void> {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let imageUrl: string;

      if (image instanceof File) {
        // Upload file to Supabase storage
        const fileName = `${productId}_${i}_${Date.now()}.jpg`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, image);

        if (error) throw error;
        imageUrl = data.path;
      } else {
        // Image is already a URL
        imageUrl = image;
      }

      // Store image reference
      await supabase.from("product_images").insert({
        product_id: productId,
        image_url: imageUrl,
        is_primary: i === 0,
      });
    }
  }

  private async autoApproveProduct(productId: string): Promise<void> {
    await supabase
      .from("products")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "ai_system",
      })
      .eq("id", productId);
  }

  private async queueForHumanReview(
    productId: string,
    moderation: any,
  ): Promise<void> {
    await supabase.from("moderation_queue").insert({
      product_id: productId,
      ai_score: moderation.aiConfidence,
      flagged_issues: moderation.flaggedIssues,
      priority: this.calculateModerationPriority(moderation),
      created_at: new Date().toISOString(),
    });
  }

  private calculateModerationPriority(
    moderation: any,
  ): "low" | "medium" | "high" {
    if (
      moderation.flaggedIssues.some(
        (issue: string) => issue.includes("fraud") || issue.includes("illegal"),
      )
    ) {
      return "high";
    }
    if (moderation.aiConfidence < 0.5) {
      return "high";
    }
    if (moderation.flaggedIssues.length > 2) {
      return "medium";
    }
    return "low";
  }

  private estimateReviewTime(data: ProductUploadData, moderation: any): number {
    // Estimate in minutes
    const baseTime = 30; // 30 minutes base
    const complexityMultiplier = moderation.flaggedIssues.length * 10;
    const priorityMultiplier = data.price > this.HIGH_VALUE_THRESHOLD ? 0.5 : 1;

    return Math.round((baseTime + complexityMultiplier) * priorityMultiplier);
  }

  private async validateUSSDUser(phoneNumber: string): Promise<any> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phoneNumber)
      .single();

    if (error || !user) {
      throw new Error("User not found. Register first via *384*REG#");
    }

    return user;
  }

  private async validateWhatsAppUser(phoneNumber: string): Promise<any> {
    return this.validateUSSDUser(phoneNumber);
  }

  private standardizeUnit(unit: string): string {
    const unitMap: Record<string, string> = {
      KILO: "kg",
      LITA: "ltr",
      PIECE: "piece",
      KG: "kg",
      L: "ltr",
      PCS: "piece",
    };

    return unitMap[unit.toUpperCase()] || unit.toLowerCase();
  }

  private async inferCategoryFromName(name: string): Promise<string> {
    const keywords: Record<string, string> = {
      unga: "staples",
      sukari: "staples",
      mchele: "staples",
      nyama: "meat",
      samaki: "fish",
      mboga: "vegetables",
      matunda: "fruits",
      maziwa: "dairy",
    };

    const lowerName = name.toLowerCase();
    for (const [keyword, category] of Object.entries(keywords)) {
      if (lowerName.includes(keyword)) {
        return category;
      }
    }

    return "general";
  }

  private async base64ToFile(base64: string, fileName: string): Promise<File> {
    const response = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob = await response.blob();
    return new File([blob], fileName, { type: "image/jpeg" });
  }

  private async parseCSV(file: File): Promise<Partial<ProductUploadData>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText.split("\n");
          const headers = lines[0].split(",");

          const products = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
              const values = line.split(",");
              return {
                name: values[0]?.trim(),
                price: parseFloat(values[1]) || 0,
                unit: values[2]?.trim() || "piece",
                category: values[3]?.trim() || "general",
                description: values[4]?.trim(),
                images: values[5] ? [values[5].trim()] : [],
              };
            });

          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }

  private async parseSwahiliVoiceNote(voiceNote: string): Promise<any> {
    // Mock AI voice parsing - in production, use Speech-to-Text + NLP
    // For now, return a structured format based on common Swahili patterns
    return {
      name: "Unga Pembe", // Extract from voice
      price: 120, // Extract price
      unit: "kg",
      description: "Unga mzuri wa kupika",
    };
  }

  private async sendUSSDConfirmation(
    phoneNumber: string,
    result: ProductModerationResult,
  ): Promise<void> {
    // Mock SMS sending - integrate with Africa's Talking or similar
    console.log(`SMS to ${phoneNumber}: Product status - ${result.status}`);
  }

  private async requestProductInfoViaWhatsApp(
    phoneNumber: string,
  ): Promise<void> {
    // Mock WhatsApp message - integrate with WhatsApp Business API
    console.log(`WhatsApp to ${phoneNumber}: Please provide product details`);
  }

  private async logSecurityEvent(
    event: string,
    userId: string,
    details: any,
  ): Promise<void> {
    await supabase.from("security_logs").insert({
      event_type: event,
      user_id: userId,
      details: details,
      timestamp: new Date().toISOString(),
    });
  }
}

export const productUploadService = new ProductUploadService();
