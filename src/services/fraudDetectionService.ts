/**
 * 🦅 Savanna Marketplace - Fraud Detection Algorithm
 * "Vulture Watch" AI system for detecting fraudulent activities
 */

export interface FraudCheckInputs {
  userId: string;
  order: {
    id: string;
    quantity: number;
    totalAmount: number;
    productIds: string[];
    timestamp: Date;
    location?: {
      lat: number;
      lng: number;
    };
  };
  user: {
    id: string;
    phone: string;
    email: string;
    registrationDate: Date;
    averageOrderValue: number;
    averageOrderQuantity: number;
    orderHistory: any[];
    lastLoginLocation?: {
      lat: number;
      lng: number;
    };
  };
  supplier?: {
    id: string;
    location: {
      lat: number;
      lng: number;
    };
    verificationStatus: string;
  };
  paymentMethod: {
    type: "mpesa" | "card" | "bank";
    phone?: string;
    isVerified: boolean;
  };
}

export interface FraudResult {
  riskScore: number; // 0-100 (0 = safe, 100 = definitely fraud)
  riskLevel: "low" | "medium" | "high" | "critical";
  flags: FraudFlag[];
  recommendation: "approve" | "review" | "decline" | "verify";
  wildlifeAlert: {
    icon: string;
    message: string;
    severity: "info" | "warning" | "danger";
  };
  explanation: string;
  requiredActions: string[];
}

export interface FraudFlag {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  score: number;
  wildlifeMetaphor: string;
}

class FraudDetectionService {
  private knownFraudPatterns: Map<string, number> = new Map();
  private whitelistedUsers: Set<string> = new Set();
  private blacklistedPhones: Set<string> = new Set();
  private suspiciousLocations: Map<string, number> = new Map();

  // Kenya-specific fraud patterns
  private kenyaFraudIndicators = {
    fakeShops: ["cyber cafe", "internet", "phone booth"],
    suspiciousAreas: ["industrial area late night", "remote locations"],
    commonFraudPhones: ["+254700000000", "+254711111111"], // Example patterns
    mpesaRedFlags: [
      "unregistered number",
      "recent registration",
      "high volume low value",
    ],
  };

  /**
   * 🦅 Main Vulture Watch fraud detection
   */
  public detectFraud(inputs: FraudCheckInputs): FraudResult {
    const flags: FraudFlag[] = [];
    let totalRiskScore = 0;

    // 1. GPS Spoofing Detection (Hyena Pack Behavior)
    const gpsFlags = this.checkGPSSpoofing(inputs);
    flags.push(...gpsFlags);
    totalRiskScore += gpsFlags.reduce((sum, flag) => sum + flag.score, 0);

    // 2. Order Anomaly Detection (Elephant Memory)
    const orderFlags = this.checkOrderAnomalies(inputs);
    flags.push(...orderFlags);
    totalRiskScore += orderFlags.reduce((sum, flag) => sum + flag.score, 0);

    // 3. M-Pesa Payment Verification (Zebra Stripe Patterns)
    const paymentFlags = this.checkPaymentAnomalies(inputs);
    flags.push(...paymentFlags);
    totalRiskScore += paymentFlags.reduce((sum, flag) => sum + flag.score, 0);

    // 4. User Behavior Analysis (Cheetah Speed Analysis)
    const behaviorFlags = this.checkUserBehavior(inputs);
    flags.push(...behaviorFlags);
    totalRiskScore += behaviorFlags.reduce((sum, flag) => sum + flag.score, 0);

    // 5. Supplier Proximity Check (Lion Territory)
    const proximityFlags = this.checkSupplierProximity(inputs);
    flags.push(...proximityFlags);
    totalRiskScore += proximityFlags.reduce((sum, flag) => sum + flag.score, 0);

    // 6. Kenya-specific checks
    const kenyaFlags = this.checkKenyaSpecificPatterns(inputs);
    flags.push(...kenyaFlags);
    totalRiskScore += kenyaFlags.reduce((sum, flag) => sum + flag.score, 0);

    // Normalize risk score (0-100)
    const riskScore = Math.min(100, totalRiskScore);
    const riskLevel = this.calculateRiskLevel(riskScore);
    const recommendation = this.getRecommendation(riskScore, flags);
    const wildlifeAlert = this.getWildlifeAlert(riskLevel, flags);

    return {
      riskScore,
      riskLevel,
      flags,
      recommendation,
      wildlifeAlert,
      explanation: this.generateExplanation(flags, riskScore),
      requiredActions: this.getRequiredActions(recommendation, flags),
    };
  }

  /**
   * 🐺 GPS Spoofing Detection - Hyena Pack Behavior
   */
  private checkGPSSpoofing(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];

    if (inputs.order.location && inputs.supplier?.location) {
      const distance = this.calculateDistance(
        inputs.order.location,
        inputs.supplier.location,
      );

      // Suspicious if order location is extremely close to supplier
      if (distance < 0.05) {
        // 50 meters
        flags.push({
          type: "gps_spoofing",
          severity: "high",
          description: "Order location suspiciously close to supplier",
          score: 35,
          wildlifeMetaphor: "🐺 Hyena pack circling - GPS locations overlap",
        });
      }

      // Check for impossible travel times
      if (inputs.user.lastLoginLocation) {
        const loginDistance = this.calculateDistance(
          inputs.user.lastLoginLocation,
          inputs.order.location,
        );

        const timeDiff =
          Date.now() - inputs.user.orderHistory[0]?.timestamp || 0;
        const maxPossibleSpeed = 120; // km/h (reasonable max for Kenya roads)
        const requiredSpeed = loginDistance / (timeDiff / 3600000); // km/h

        if (requiredSpeed > maxPossibleSpeed) {
          flags.push({
            type: "impossible_travel",
            severity: "medium",
            description: "Impossible travel speed between locations",
            score: 25,
            wildlifeMetaphor:
              "🐆 Cheetah speed impossible - location jump detected",
          });
        }
      }
    }

    return flags;
  }

  /**
   * 🐘 Order Anomaly Detection - Elephant Memory
   */
  private checkOrderAnomalies(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];
    const { order, user } = inputs;

    // Quantity anomaly (much larger than usual)
    if (order.quantity > user.averageOrderQuantity * 5) {
      const severity =
        order.quantity > user.averageOrderQuantity * 10 ? "high" : "medium";
      flags.push({
        type: "quantity_anomaly",
        severity,
        description: `Order quantity ${order.quantity}x larger than average`,
        score: severity === "high" ? 30 : 20,
        wildlifeMetaphor: "🐘 Elephant-sized order - unusually large quantity",
      });
    }

    // Value anomaly
    if (order.totalAmount > user.averageOrderValue * 8) {
      flags.push({
        type: "value_anomaly",
        severity: "high",
        description: "Order value significantly higher than usual",
        score: 25,
        wildlifeMetaphor: "💎 Rhino horn value - suspicious high-value order",
      });
    }

    // Rapid fire orders (multiple orders in short time)
    const recentOrders = user.orderHistory.filter(
      (o) => Date.now() - new Date(o.timestamp).getTime() < 60 * 60 * 1000, // Last hour
    );

    if (recentOrders.length > 5) {
      flags.push({
        type: "rapid_orders",
        severity: "medium",
        description: "Multiple orders placed in short timeframe",
        score: 20,
        wildlifeMetaphor: "🦌 Gazelle stampede - rapid order placement",
      });
    }

    return flags;
  }

  /**
   * 🦓 M-Pesa Payment Verification - Zebra Stripe Patterns
   */
  private checkPaymentAnomalies(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];
    const { paymentMethod, user } = inputs;

    if (paymentMethod.type === "mpesa") {
      // Unverified M-Pesa number
      if (!paymentMethod.isVerified) {
        flags.push({
          type: "unverified_mpesa",
          severity: "medium",
          description: "M-Pesa number not verified",
          score: 20,
          wildlifeMetaphor:
            "🦓 Zebra stripes unclear - payment pattern unverified",
        });
      }

      // Phone number mismatch
      if (paymentMethod.phone && paymentMethod.phone !== user.phone) {
        flags.push({
          type: "phone_mismatch",
          severity: "high",
          description: "Payment phone differs from registered phone",
          score: 35,
          wildlifeMetaphor: "🦅 Vulture circling - payment phone mismatch",
        });
      }

      // Blacklisted phone check
      if (
        paymentMethod.phone &&
        this.blacklistedPhones.has(paymentMethod.phone)
      ) {
        flags.push({
          type: "blacklisted_phone",
          severity: "high",
          description: "Payment phone is blacklisted",
          score: 50,
          wildlifeMetaphor: "🐍 Venomous snake - known fraudulent phone",
        });
      }
    }

    return flags;
  }

  /**
   * 🐆 User Behavior Analysis - Cheetah Speed Analysis
   */
  private checkUserBehavior(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];
    const { user } = inputs;

    // New user with large order
    const accountAge = Date.now() - user.registrationDate.getTime();
    const isNewUser = accountAge < 7 * 24 * 60 * 60 * 1000; // 7 days

    if (isNewUser && inputs.order.totalAmount > 10000) {
      flags.push({
        type: "new_user_large_order",
        severity: "medium",
        description: "New user placing large order",
        score: 25,
        wildlifeMetaphor:
          "🐣 Newborn attempting lion hunt - inexperienced user, large order",
      });
    }

    // Limited order history
    if (user.orderHistory.length < 3 && inputs.order.totalAmount > 5000) {
      flags.push({
        type: "limited_history",
        severity: "medium",
        description: "Limited order history with high-value order",
        score: 20,
        wildlifeMetaphor:
          "🦌 Young gazelle big leap - limited history, high value",
      });
    }

    return flags;
  }

  /**
   * 🦁 Supplier Proximity Check - Lion Territory
   */
  private checkSupplierProximity(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];

    if (inputs.supplier && inputs.order.location) {
      const distance = this.calculateDistance(
        inputs.order.location,
        inputs.supplier.location,
      );

      // Suspiciously close (possible fake supplier)
      if (distance < 0.05) {
        // 50 meters
        flags.push({
          type: "supplier_too_close",
          severity: "high",
          description: "Order location too close to supplier",
          score: 40,
          wildlifeMetaphor: "🦁 Lions sharing territory - suspicious proximity",
        });
      }

      // Unverified supplier
      if (inputs.supplier.verificationStatus !== "verified") {
        flags.push({
          type: "unverified_supplier",
          severity: "medium",
          description: "Supplier not fully verified",
          score: 15,
          wildlifeMetaphor: "🐺 Unknown pack member - unverified supplier",
        });
      }
    }

    return flags;
  }

  /**
   * 🇰🇪 Kenya-specific fraud pattern checks
   */
  private checkKenyaSpecificPatterns(inputs: FraudCheckInputs): FraudFlag[] {
    const flags: FraudFlag[] = [];

    // Check for known Kenya fraud indicators
    const businessName = inputs.user.email.toLowerCase();

    if (
      this.kenyaFraudIndicators.fakeShops.some((pattern) =>
        businessName.includes(pattern),
      )
    ) {
      flags.push({
        type: "fake_shop_pattern",
        severity: "high",
        description: "Business name matches known fraud pattern",
        score: 35,
        wildlifeMetaphor: "🐍 Chameleon disguise - fake shop pattern detected",
      });
    }

    // Check for suspicious timing (common fraud hours in Kenya)
    const orderHour = new Date(inputs.order.timestamp).getHours();
    if (orderHour >= 2 && orderHour <= 5) {
      flags.push({
        type: "suspicious_timing",
        severity: "low",
        description: "Order placed during unusual hours",
        score: 10,
        wildlifeMetaphor: "🦉 Night owl activity - unusual timing",
      });
    }

    return flags;
  }

  /**
   * Calculate risk level based on score
   */
  private calculateRiskLevel(
    score: number,
  ): "low" | "medium" | "high" | "critical" {
    if (score >= 80) return "critical";
    if (score >= 50) return "high";
    if (score >= 25) return "medium";
    return "low";
  }

  /**
   * Get recommendation based on risk
   */
  private getRecommendation(
    score: number,
    flags: FraudFlag[],
  ): "approve" | "review" | "decline" | "verify" {
    if (score >= 80) return "decline";
    if (score >= 50) return "verify";
    if (score >= 25) return "review";
    return "approve";
  }

  /**
   * Get wildlife-themed alert
   */
  private getWildlifeAlert(riskLevel: string, flags: FraudFlag[]): any {
    switch (riskLevel) {
      case "critical":
        return {
          icon: "🦅",
          message: "VULTURE ALERT: High fraud risk detected!",
          severity: "danger",
        };
      case "high":
        return {
          icon: "🐍",
          message: "SNAKE WARNING: Suspicious activity detected",
          severity: "danger",
        };
      case "medium":
        return {
          icon: "🐺",
          message: "HYENA WATCH: Some concerns detected",
          severity: "warning",
        };
      default:
        return {
          icon: "🦌",
          message: "GAZELLE SAFE: Low risk transaction",
          severity: "info",
        };
    }
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(flags: FraudFlag[], score: number): string {
    if (flags.length === 0) {
      return "🦌 This transaction appears normal with no significant risk factors detected.";
    }

    const highRiskFlags = flags.filter((f) => f.severity === "high");
    const mediumRiskFlags = flags.filter((f) => f.severity === "medium");

    let explanation = `🦅 Fraud risk score: ${score}/100. `;

    if (highRiskFlags.length > 0) {
      explanation += `High-risk factors: ${highRiskFlags.map((f) => f.wildlifeMetaphor).join(", ")}. `;
    }

    if (mediumRiskFlags.length > 0) {
      explanation += `Medium-risk factors: ${mediumRiskFlags.map((f) => f.wildlifeMetaphor).join(", ")}.`;
    }

    return explanation;
  }

  /**
   * Get required actions based on recommendation
   */
  private getRequiredActions(
    recommendation: string,
    flags: FraudFlag[],
  ): string[] {
    const actions: string[] = [];

    switch (recommendation) {
      case "decline":
        actions.push("Block transaction immediately");
        actions.push("Flag user for manual review");
        actions.push("Notify fraud team");
        break;
      case "verify":
        actions.push("Request additional verification");
        actions.push("Manual review required");
        if (flags.some((f) => f.type.includes("phone"))) {
          actions.push("Verify M-Pesa phone number");
        }
        break;
      case "review":
        actions.push("Queue for manual review");
        actions.push("Monitor user activity");
        break;
      case "approve":
        actions.push("Process transaction normally");
        break;
    }

    return actions;
  }

  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
   */
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Update blacklisted phones
   */
  public updateBlacklist(phones: string[]): void {
    phones.forEach((phone) => this.blacklistedPhones.add(phone));
  }

  /**
   * Add user to whitelist
   */
  public whitelistUser(userId: string): void {
    this.whitelistedUsers.add(userId);
  }

  /**
   * Train fraud detection model with new patterns
   */
  public trainModel(fraudCases: any[]): void {
    fraudCases.forEach((case_) => {
      this.knownFraudPatterns.set(case_.pattern, case_.risk_score);
    });
  }
}

export const fraudDetectionService = new FraudDetectionService();
export default fraudDetectionService;
