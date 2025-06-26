import { supabase } from "../integrations/supabase/client";

export interface FraudCheckResult {
  riskLevel: "low" | "medium" | "high";
  riskScore: number; // 0-1
  reasons: string[];
  recommendations: string[];
  blockUpload: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  provider: "gps" | "network" | "mpesa" | "ip";
}

interface UserRiskProfile {
  simCardAge: number; // days
  mpesaHistoryLength: number; // months
  previousReports: number;
  uploadFrequency: number; // uploads per day
  duplicateImageScore: number; // 0-1
  locationConsistency: number; // 0-1
}

class FraudPreventionService {
  private readonly MIN_SIM_AGE_DAYS = 90; // 3 months
  private readonly MIN_MPESA_HISTORY_MONTHS = 3;
  private readonly MAX_DAILY_UPLOADS = 50;
  private readonly HIGH_RISK_THRESHOLD = 0.7;
  private readonly MEDIUM_RISK_THRESHOLD = 0.4;

  async validateProductUpload(productData: any): Promise<FraudCheckResult> {
    try {
      console.log(
        "🛡️ Fraud Prevention: Analyzing upload from:",
        productData.supplierId,
      );

      // Run all fraud checks in parallel
      const [
        userProfile,
        duplicateCheck,
        locationCheck,
        behaviorCheck,
        networkCheck,
      ] = await Promise.all([
        this.buildUserRiskProfile(productData.supplierId),
        this.checkDuplicateImages(productData.images),
        this.validateLocationData(productData.location, productData.supplierId),
        this.analyzeBehaviorPatterns(productData.supplierId),
        this.analyzeNetworkFingerprint(productData.supplierId),
      ]);

      // Calculate overall risk score
      const riskScore = this.calculateRiskScore(
        userProfile,
        duplicateCheck,
        locationCheck,
        behaviorCheck,
        networkCheck,
      );

      // Determine risk level
      let riskLevel: "low" | "medium" | "high";
      if (riskScore >= this.HIGH_RISK_THRESHOLD) {
        riskLevel = "high";
      } else if (riskScore >= this.MEDIUM_RISK_THRESHOLD) {
        riskLevel = "medium";
      } else {
        riskLevel = "low";
      }

      // Compile reasons and recommendations
      const reasons = this.compileRiskReasons(
        userProfile,
        duplicateCheck,
        locationCheck,
        behaviorCheck,
        networkCheck,
      );
      const recommendations = this.generateRecommendations(riskLevel, reasons);

      const result: FraudCheckResult = {
        riskLevel,
        riskScore,
        reasons,
        recommendations,
        blockUpload: riskLevel === "high",
      };

      // Log the fraud check
      await this.logFraudCheck(productData.supplierId, result);

      return result;
    } catch (error) {
      console.error("Fraud prevention check failed:", error);
      // Return medium risk on error to be safe
      return {
        riskLevel: "medium",
        riskScore: 0.5,
        reasons: ["System error during fraud check"],
        recommendations: ["Manual review required"],
        blockUpload: false,
      };
    }
  }

  async validateSIMCardAge(
    phoneNumber: string,
  ): Promise<{ isValid: boolean; ageDays: number }> {
    try {
      // Mock Safaricom API call - in production, integrate with Safaricom API
      // For now, simulate based on user registration date
      const { data: user, error } = await supabase
        .from("users")
        .select("created_at, phone_verified_at")
        .eq("phone", phoneNumber)
        .single();

      if (error || !user) {
        return { isValid: false, ageDays: 0 };
      }

      const verifiedDate = user.phone_verified_at || user.created_at;
      const ageDays = Math.floor(
        (Date.now() - new Date(verifiedDate).getTime()) / (24 * 60 * 60 * 1000),
      );

      return {
        isValid: ageDays >= this.MIN_SIM_AGE_DAYS,
        ageDays,
      };
    } catch (error) {
      console.error("SIM card age validation failed:", error);
      return { isValid: false, ageDays: 0 };
    }
  }

  async validateMPesaHistory(
    phoneNumber: string,
  ): Promise<{
    isValid: boolean;
    historyMonths: number;
    transactionCount: number;
  }> {
    try {
      // Mock M-Pesa API call - in production, integrate with Safaricom M-Pesa API
      // For now, check our internal M-Pesa transaction records
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: transactions, error } = await supabase
        .from("mpesa_transactions")
        .select("created_at")
        .eq("phone_number", phoneNumber)
        .gte("created_at", threeMonthsAgo.toISOString());

      if (error) {
        console.error("M-Pesa history check failed:", error);
        return { isValid: false, historyMonths: 0, transactionCount: 0 };
      }

      const transactionCount = transactions?.length || 0;
      const oldestTransaction = transactions?.reduce((oldest, t) =>
        new Date(t.created_at) < new Date(oldest.created_at) ? t : oldest,
      );

      const historyMonths = oldestTransaction
        ? Math.floor(
            (Date.now() - new Date(oldestTransaction.created_at).getTime()) /
              (30 * 24 * 60 * 60 * 1000),
          )
        : 0;

      return {
        isValid:
          historyMonths >= this.MIN_MPESA_HISTORY_MONTHS &&
          transactionCount >= 5,
        historyMonths,
        transactionCount,
      };
    } catch (error) {
      console.error("M-Pesa history validation failed:", error);
      return { isValid: false, historyMonths: 0, transactionCount: 0 };
    }
  }

  async detectLocationSpoofing(
    gpsLocation: LocationData,
    ipLocation: LocationData,
    mpesaTowerLocation?: LocationData,
  ): Promise<{ isSpoofed: boolean; confidence: number; reasons: string[] }> {
    try {
      const reasons: string[] = [];
      let suspicionScore = 0;

      // Check GPS vs IP location consistency
      const gpsIpDistance = this.calculateDistance(gpsLocation, ipLocation);
      if (gpsIpDistance > 50) {
        // 50km threshold
        suspicionScore += 0.3;
        reasons.push(
          `GPS and IP locations differ by ${gpsIpDistance.toFixed(1)}km`,
        );
      }

      // Check GPS vs M-Pesa tower location if available
      if (mpesaTowerLocation) {
        const gpsMpesaDistance = this.calculateDistance(
          gpsLocation,
          mpesaTowerLocation,
        );
        if (gpsMpesaDistance > 20) {
          // 20km threshold for M-Pesa towers
          suspicionScore += 0.4;
          reasons.push(
            `GPS and M-Pesa tower locations differ by ${gpsMpesaDistance.toFixed(1)}km`,
          );
        }
      }

      // Check for impossible movement patterns
      const recentLocations = await this.getRecentUserLocations(gpsLocation);
      const impossibleMovement = this.detectImpossibleMovement(recentLocations);
      if (impossibleMovement.detected) {
        suspicionScore += 0.5;
        reasons.push(`Impossible movement: ${impossibleMovement.reason}`);
      }

      // Check location accuracy
      if (gpsLocation.accuracy > 1000) {
        // Very low accuracy
        suspicionScore += 0.2;
        reasons.push("Very low GPS accuracy");
      }

      return {
        isSpoofed: suspicionScore > 0.6,
        confidence: suspicionScore,
        reasons,
      };
    } catch (error) {
      console.error("Location spoofing detection failed:", error);
      return {
        isSpoofed: false,
        confidence: 0,
        reasons: ["Location verification failed"],
      };
    }
  }

  private async buildUserRiskProfile(userId: string): Promise<UserRiskProfile> {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select(
          `
          *,
          products(*),
          mpesa_transactions(*)
        `,
        )
        .eq("id", userId)
        .single();

      if (error || !user) {
        throw new Error("User not found");
      }

      // Calculate SIM card age
      const simAge = await this.validateSIMCardAge(user.phone);

      // Calculate M-Pesa history
      const mpesaHistory = await this.validateMPesaHistory(user.phone);

      // Calculate upload frequency
      const recentUploads =
        user.products?.filter((p: any) => {
          const uploadDate = new Date(p.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return uploadDate > dayAgo;
        }).length || 0;

      // Get previous reports
      const { data: reports } = await supabase
        .from("community_reports")
        .select("id")
        .eq("reported_user_id", userId)
        .eq("status", "confirmed");

      return {
        simCardAge: simAge.ageDays,
        mpesaHistoryLength: mpesaHistory.historyMonths,
        previousReports: reports?.length || 0,
        uploadFrequency: recentUploads,
        duplicateImageScore: 0, // Will be filled by duplicate check
        locationConsistency: 0, // Will be filled by location check
      };
    } catch (error) {
      console.error("Failed to build user risk profile:", error);
      return {
        simCardAge: 0,
        mpesaHistoryLength: 0,
        previousReports: 0,
        uploadFrequency: 0,
        duplicateImageScore: 0,
        locationConsistency: 0,
      };
    }
  }

  private async checkDuplicateImages(
    images: any[],
  ): Promise<{ duplicateFound: boolean; similarity: number }> {
    if (!images || images.length === 0) {
      return { duplicateFound: false, similarity: 0 };
    }

    try {
      // Mock image similarity check - in production, use Google Vision API or similar
      // For now, just check if exact same image URLs exist
      const { data: existingImages, error } = await supabase
        .from("product_images")
        .select("image_url")
        .in(
          "image_url",
          images.filter((img) => typeof img === "string"),
        );

      if (error) throw error;

      const duplicateFound = existingImages && existingImages.length > 0;
      const similarity = duplicateFound ? 1.0 : 0.0;

      return { duplicateFound, similarity };
    } catch (error) {
      console.error("Duplicate image check failed:", error);
      return { duplicateFound: false, similarity: 0 };
    }
  }

  private async validateLocationData(
    location: any,
    userId: string,
  ): Promise<{ isValid: boolean; consistency: number }> {
    if (!location) {
      return { isValid: true, consistency: 1.0 };
    }

    try {
      // Get user's historical locations
      const { data: userLocations, error } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error || !userLocations || userLocations.length === 0) {
        // No historical data, assume valid
        return { isValid: true, consistency: 0.5 };
      }

      // Calculate consistency with historical locations
      const distances = userLocations.map((loc) =>
        this.calculateDistance(location, {
          lat: loc.latitude,
          lng: loc.longitude,
        }),
      );

      const avgDistance =
        distances.reduce((sum, d) => sum + d, 0) / distances.length;
      const consistency = Math.max(0, 1 - avgDistance / 100); // 100km max for full consistency

      return {
        isValid: avgDistance < 200, // 200km threshold
        consistency,
      };
    } catch (error) {
      console.error("Location validation failed:", error);
      return { isValid: true, consistency: 0.5 };
    }
  }

  private async analyzeBehaviorPatterns(
    userId: string,
  ): Promise<{ suspicious: boolean; score: number }> {
    try {
      const { data: activities, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ) // Last 7 days
        .order("created_at", { ascending: false });

      if (error || !activities) {
        return { suspicious: false, score: 0 };
      }

      let suspicionScore = 0;

      // Check for bot-like behavior (very regular intervals)
      const intervals = activities
        .slice(1)
        .map(
          (activity, i) =>
            new Date(activities[i].created_at).getTime() -
            new Date(activity.created_at).getTime(),
        );

      const avgInterval =
        intervals.reduce((sum, interval) => sum + interval, 0) /
        intervals.length;
      const intervalVariance =
        intervals.reduce(
          (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
          0,
        ) / intervals.length;

      if (intervalVariance < avgInterval * 0.1) {
        // Very regular intervals
        suspicionScore += 0.3;
      }

      // Check for rapid succession uploads
      const rapidUploads = activities.filter(
        (activity) => activity.activity_type === "product_upload",
      ).length;

      if (rapidUploads > this.MAX_DAILY_UPLOADS / 7) {
        // Weekly threshold
        suspicionScore += 0.4;
      }

      return {
        suspicious: suspicionScore > 0.5,
        score: suspicionScore,
      };
    } catch (error) {
      console.error("Behavior analysis failed:", error);
      return { suspicious: false, score: 0 };
    }
  }

  private async analyzeNetworkFingerprint(
    userId: string,
  ): Promise<{ suspicious: boolean; score: number }> {
    try {
      // Mock network analysis - in production, analyze IP patterns, device fingerprints, etc.
      // For now, just check for multiple accounts from same device/IP
      const { data: sessions, error } = await supabase
        .from("user_sessions")
        .select("ip_address, user_agent")
        .eq("user_id", userId)
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        );

      if (error || !sessions) {
        return { suspicious: false, score: 0 };
      }

      // Check for shared IP addresses with other users
      const ipAddresses = [...new Set(sessions.map((s) => s.ip_address))];
      let sharedIpScore = 0;

      for (const ip of ipAddresses) {
        const { data: otherUsers, error } = await supabase
          .from("user_sessions")
          .select("user_id")
          .eq("ip_address", ip)
          .neq("user_id", userId);

        if (otherUsers && otherUsers.length > 5) {
          // More than 5 other users from same IP
          sharedIpScore += 0.1 * otherUsers.length;
        }
      }

      return {
        suspicious: sharedIpScore > 0.4,
        score: Math.min(1.0, sharedIpScore),
      };
    } catch (error) {
      console.error("Network analysis failed:", error);
      return { suspicious: false, score: 0 };
    }
  }

  private calculateRiskScore(
    userProfile: UserRiskProfile,
    duplicateCheck: any,
    locationCheck: any,
    behaviorCheck: any,
    networkCheck: any,
  ): number {
    let score = 0;

    // SIM card age (weight: 0.2)
    if (userProfile.simCardAge < this.MIN_SIM_AGE_DAYS) {
      score += 0.2 * (1 - userProfile.simCardAge / this.MIN_SIM_AGE_DAYS);
    }

    // M-Pesa history (weight: 0.15)
    if (userProfile.mpesaHistoryLength < this.MIN_MPESA_HISTORY_MONTHS) {
      score +=
        0.15 *
        (1 - userProfile.mpesaHistoryLength / this.MIN_MPESA_HISTORY_MONTHS);
    }

    // Previous reports (weight: 0.2)
    score += 0.2 * Math.min(1, userProfile.previousReports / 3);

    // Upload frequency (weight: 0.1)
    if (userProfile.uploadFrequency > this.MAX_DAILY_UPLOADS) {
      score += 0.1;
    }

    // Duplicate images (weight: 0.15)
    if (duplicateCheck.duplicateFound) {
      score += 0.15 * duplicateCheck.similarity;
    }

    // Location consistency (weight: 0.1)
    if (!locationCheck.isValid) {
      score += 0.1 * (1 - locationCheck.consistency);
    }

    // Behavior patterns (weight: 0.05)
    if (behaviorCheck.suspicious) {
      score += 0.05 * behaviorCheck.score;
    }

    // Network fingerprint (weight: 0.05)
    if (networkCheck.suspicious) {
      score += 0.05 * networkCheck.score;
    }

    return Math.min(1.0, score);
  }

  private compileRiskReasons(
    userProfile: UserRiskProfile,
    duplicateCheck: any,
    locationCheck: any,
    behaviorCheck: any,
    networkCheck: any,
  ): string[] {
    const reasons: string[] = [];

    if (userProfile.simCardAge < this.MIN_SIM_AGE_DAYS) {
      reasons.push(
        `SIM card too new (${userProfile.simCardAge} days, minimum ${this.MIN_SIM_AGE_DAYS})`,
      );
    }

    if (userProfile.mpesaHistoryLength < this.MIN_MPESA_HISTORY_MONTHS) {
      reasons.push(
        `Insufficient M-Pesa history (${userProfile.mpesaHistoryLength} months)`,
      );
    }

    if (userProfile.previousReports > 0) {
      reasons.push(`${userProfile.previousReports} previous community reports`);
    }

    if (userProfile.uploadFrequency > this.MAX_DAILY_UPLOADS) {
      reasons.push(
        `High upload frequency (${userProfile.uploadFrequency} today)`,
      );
    }

    if (duplicateCheck.duplicateFound) {
      reasons.push("Duplicate images detected");
    }

    if (!locationCheck.isValid) {
      reasons.push("Location inconsistency detected");
    }

    if (behaviorCheck.suspicious) {
      reasons.push("Suspicious behavior patterns");
    }

    if (networkCheck.suspicious) {
      reasons.push("Suspicious network activity");
    }

    return reasons;
  }

  private generateRecommendations(
    riskLevel: string,
    reasons: string[],
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === "high") {
      recommendations.push("Block upload and require manual verification");
      recommendations.push("Request additional documentation");
      recommendations.push("Escalate to security team");
    } else if (riskLevel === "medium") {
      recommendations.push("Queue for priority human review");
      recommendations.push("Request additional verification");
    } else {
      recommendations.push("Standard review process");
    }

    return recommendations;
  }

  private calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private async getRecentUserLocations(currentLocation: any): Promise<any[]> {
    // Mock - get recent locations for movement analysis
    return [];
  }

  private detectImpossibleMovement(locations: any[]): {
    detected: boolean;
    reason: string;
  } {
    // Mock - analyze if movement between locations is physically possible
    return { detected: false, reason: "" };
  }

  private async logFraudCheck(
    userId: string,
    result: FraudCheckResult,
  ): Promise<void> {
    await supabase.from("fraud_checks").insert({
      user_id: userId,
      risk_level: result.riskLevel,
      risk_score: result.riskScore,
      reasons: result.reasons,
      blocked: result.blockUpload,
      created_at: new Date().toISOString(),
    });
  }
}

export const fraudPreventionService = new FraudPreventionService();
