/**
 * 💧 Savanna Marketplace - BNPL Credit Scoring Algorithm
 * "Waterhole Refill" system for dynamic credit limit management
 */

export interface CreditScoringInputs {
  userId: string;
  userProfile: {
    phone: string;
    email: string;
    businessName?: string;
    registrationDate: Date;
    verificationLevel: "basic" | "verified" | "premium";
    kycStatus: "pending" | "approved" | "rejected";
  };
  orderHistory: {
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
    orderFrequency: number; // orders per month
    latestOrders: any[];
  };
  paymentHistory: {
    totalPayments: number;
    onTimePayments: number;
    latePayments: number;
    averagePaymentDelay: number; // days
    totalAmountPaid: number;
    lastPaymentDate: Date;
  };
  mpesaProfile: {
    phoneVerified: boolean;
    transactionFrequency: number; // transactions per month
    averageBalance?: number;
    mpesaAge: number; // months since M-Pesa registration
    statementAvailable: boolean;
  };
  socialTrust: {
    referrals: number;
    referredBy?: string;
    networkConnections: number;
    communityRating: number; // 0-5
    groupBuyingParticipation: number;
  };
  businessMetrics?: {
    monthlyRevenue?: number;
    businessAge: number; // months
    employeeCount?: number;
    businessType: string;
    businessLocation: string;
  };
}

export interface CreditScoringResult {
  creditScore: number; // 0-1000 (higher is better)
  creditLimit: number; // KES
  riskLevel: "low" | "medium" | "high" | "very_high";
  approvalStatus: "approved" | "conditionally_approved" | "rejected";
  waterholeLevel: {
    current: number; // 0-100%
    capacity: number; // KES
    refillRate: number; // KES per successful payment
    evaporationRate: number; // KES per day if inactive
  };
  factors: {
    paymentHistory: number; // 0-600 points
    socialTrust: number; // 0-300 points
    orderVolume: number; // 0-100 points
  };
  wildlifeRating: {
    tier: "hippo" | "elephant" | "rhino" | "buffalo" | "lion";
    icon: string;
    description: string;
    benefits: string[];
  };
  recommendations: string[];
  nextReviewDate: Date;
  kenyaSpecificFactors: {
    countyCreditRisk: number;
    mpesaAdoption: number;
    localEconomicConditions: number;
  };
}

class CreditScoringService {
  private kenyaCountyRiskMap = new Map([
    ["Nairobi", 0.1],
    ["Mombasa", 0.15],
    ["Kiambu", 0.08],
    ["Nakuru", 0.12],
    ["Uasin Gishu", 0.1],
    ["Kisumu", 0.18],
    ["Machakos", 0.14],
    ["Kakamega", 0.16],
    ["Meru", 0.13],
    ["Kilifi", 0.2],
  ]);

  private wildlifeTiers = {
    hippo: { min: 850, icon: "🦛", name: "Waterhole Guardian" },
    elephant: { min: 750, icon: "🐘", name: "Savanna Elder" },
    rhino: { min: 650, icon: "🦏", name: "Rhino Strength" },
    buffalo: { min: 550, icon: "🐃", name: "Herd Member" },
    lion: { min: 400, icon: "🦁", name: "Pride Starter" },
  };

  /**
   * 💧 Main credit scoring calculation with Waterhole system
   */
  public calculateCreditScore(
    inputs: CreditScoringInputs,
  ): CreditScoringResult {
    // 1. Payment History (60% weight - most important)
    const paymentScore = this.calculatePaymentHistoryScore(
      inputs.paymentHistory,
    );

    // 2. Social Trust (30% weight - community verification)
    const socialScore = this.calculateSocialTrustScore(inputs.socialTrust);

    // 3. Order Volume (10% weight - business activity)
    const volumeScore = this.calculateOrderVolumeScore(inputs.orderHistory);

    // Combine scores
    const baseScore = paymentScore + socialScore + volumeScore;

    // Apply Kenya-specific adjustments
    const kenyaAdjustments = this.calculateKenyaAdjustments(inputs);
    const finalScore = Math.max(
      0,
      Math.min(1000, baseScore + kenyaAdjustments.total),
    );

    // Calculate credit limit based on score
    const creditLimit = this.calculateCreditLimit(finalScore, inputs);

    // Determine risk level
    const riskLevel = this.calculateRiskLevel(finalScore);

    // Get approval status
    const approvalStatus = this.getApprovalStatus(
      finalScore,
      riskLevel,
      inputs,
    );

    // Calculate waterhole metrics
    const waterholeLevel = this.calculateWaterholeLevel(
      finalScore,
      creditLimit,
      inputs,
    );

    // Assign wildlife rating
    const wildlifeRating = this.assignWildlifeRating(finalScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(finalScore, inputs);

    return {
      creditScore: Math.round(finalScore),
      creditLimit,
      riskLevel,
      approvalStatus,
      waterholeLevel,
      factors: {
        paymentHistory: Math.round(paymentScore),
        socialTrust: Math.round(socialScore),
        orderVolume: Math.round(volumeScore),
      },
      wildlifeRating,
      recommendations,
      nextReviewDate: this.calculateNextReviewDate(finalScore),
      kenyaSpecificFactors: {
        countyCreditRisk: kenyaAdjustments.county,
        mpesaAdoption: kenyaAdjustments.mpesa,
        localEconomicConditions: kenyaAdjustments.economic,
      },
    };
  }

  /**
   * 💳 Payment History Score (0-600 points)
   */
  private calculatePaymentHistoryScore(paymentHistory: any): number {
    if (paymentHistory.totalPayments === 0) return 100; // New user baseline

    const onTimeRate =
      paymentHistory.onTimePayments / paymentHistory.totalPayments;
    const basePaymentScore = onTimeRate * 400; // Up to 400 points for perfect payment

    // Penalty for late payments
    const latePenalty =
      (paymentHistory.latePayments / paymentHistory.totalPayments) * 100;

    // Bonus for payment consistency (elephant memory)
    const consistencyBonus = Math.min(100, paymentHistory.totalPayments * 2); // 2 points per payment

    // Recent payment activity bonus
    const daysSinceLastPayment = paymentHistory.lastPaymentDate
      ? (Date.now() - paymentHistory.lastPaymentDate.getTime()) /
        (1000 * 60 * 60 * 24)
      : 365;
    const recencyBonus = Math.max(0, 100 - daysSinceLastPayment * 2); // Lose 2 points per day

    return Math.max(
      0,
      basePaymentScore - latePenalty + consistencyBonus + recencyBonus,
    );
  }

  /**
   * 🤝 Social Trust Score (0-300 points)
   */
  private calculateSocialTrustScore(socialTrust: any): number {
    let score = 0;

    // Referral network strength (Lion Pride effect)
    score += Math.min(100, socialTrust.referrals * 10); // 10 points per referral, max 100

    // Community rating
    score += (socialTrust.communityRating / 5) * 80; // Up to 80 points for 5-star rating

    // Network connections (Herd Size)
    score += Math.min(60, socialTrust.networkConnections * 2); // 2 points per connection, max 60

    // Group buying participation (Buffalo Herd participation)
    score += Math.min(60, socialTrust.groupBuyingParticipation * 5); // 5 points per group buy, max 60

    return score;
  }

  /**
   * 📊 Order Volume Score (0-100 points)
   */
  private calculateOrderVolumeScore(orderHistory: any): number {
    if (orderHistory.totalOrders === 0) return 10; // New user baseline

    let score = 0;

    // Total order volume
    score += Math.min(40, orderHistory.totalOrders * 2); // 2 points per order, max 40

    // Average order value (indicates business scale)
    const avgValueScore = Math.min(
      30,
      (orderHistory.averageOrderValue / 1000) * 30,
    ); // Up to 30 points
    score += avgValueScore;

    // Order frequency (business consistency)
    score += Math.min(30, orderHistory.orderFrequency * 5); // 5 points per monthly order, max 30

    return score;
  }

  /**
   * 🇰🇪 Kenya-specific adjustments
   */
  private calculateKenyaAdjustments(inputs: CreditScoringInputs): any {
    let adjustments = { county: 0, mpesa: 0, economic: 0, total: 0 };

    // County risk adjustment
    const businessLocation =
      inputs.businessMetrics?.businessLocation || "Unknown";
    const countyRisk = this.kenyaCountyRiskMap.get(businessLocation) || 0.15;
    adjustments.county = -(countyRisk * 100); // Negative adjustment for higher risk counties

    // M-Pesa adoption bonus
    if (inputs.mpesaProfile.phoneVerified) {
      adjustments.mpesa += 20; // Verified M-Pesa bonus
    }

    if (inputs.mpesaProfile.mpesaAge > 24) {
      adjustments.mpesa += 30; // Long-term M-Pesa user bonus
    }

    if (inputs.mpesaProfile.transactionFrequency > 10) {
      adjustments.mpesa += 25; // Active M-Pesa user bonus
    }

    // Economic conditions (simplified - in production, use real economic data)
    const currentMonth = new Date().getMonth();
    const isHarvestSeason = [9, 10, 11].includes(currentMonth); // Oct-Dec
    adjustments.economic = isHarvestSeason ? 15 : 0; // Harvest season bonus

    adjustments.total =
      adjustments.county + adjustments.mpesa + adjustments.economic;

    return adjustments;
  }

  /**
   * 💰 Calculate credit limit based on score and other factors
   */
  private calculateCreditLimit(
    score: number,
    inputs: CreditScoringInputs,
  ): number {
    let baseLimit = 0;

    // Base limit from credit score
    if (score >= 850)
      baseLimit = 100000; // Hippo tier
    else if (score >= 750)
      baseLimit = 75000; // Elephant tier
    else if (score >= 650)
      baseLimit = 50000; // Rhino tier
    else if (score >= 550)
      baseLimit = 25000; // Buffalo tier
    else if (score >= 400)
      baseLimit = 10000; // Lion tier
    else baseLimit = 5000; // Minimum for new users

    // Adjust based on order history
    const monthlyOrderValue =
      inputs.orderHistory.averageOrderValue *
      inputs.orderHistory.orderFrequency;
    const volumeMultiplier = Math.min(2, monthlyOrderValue / 20000); // Max 2x multiplier
    baseLimit *= volumeMultiplier;

    // M-Pesa transaction capacity adjustment
    if (inputs.mpesaProfile.averageBalance) {
      const balanceMultiplier = Math.min(
        1.5,
        inputs.mpesaProfile.averageBalance / 50000,
      ); // Max 1.5x
      baseLimit *= balanceMultiplier;
    }

    // Business size adjustment
    if (inputs.businessMetrics?.monthlyRevenue) {
      const revenueMultiplier = Math.min(
        1.8,
        inputs.businessMetrics.monthlyRevenue / 100000,
      ); // Max 1.8x
      baseLimit *= revenueMultiplier;
    }

    return Math.round(baseLimit);
  }

  /**
   * 🚨 Calculate risk level
   */
  private calculateRiskLevel(
    score: number,
  ): "low" | "medium" | "high" | "very_high" {
    if (score >= 750) return "low";
    if (score >= 600) return "medium";
    if (score >= 400) return "high";
    return "very_high";
  }

  /**
   * ✅ Get approval status
   */
  private getApprovalStatus(
    score: number,
    riskLevel: string,
    inputs: CreditScoringInputs,
  ): "approved" | "conditionally_approved" | "rejected" {
    // Reject if KYC not approved
    if (inputs.userProfile.kycStatus === "rejected") return "rejected";

    // Reject very high risk
    if (riskLevel === "very_high" && score < 350) return "rejected";

    // Conditional approval for medium-high risk
    if (riskLevel === "high" || (riskLevel === "very_high" && score >= 350)) {
      return "conditionally_approved";
    }

    // Approve low-medium risk
    return "approved";
  }

  /**
   * 💧 Calculate Waterhole Level metrics
   */
  private calculateWaterholeLevel(
    score: number,
    creditLimit: number,
    inputs: CreditScoringInputs,
  ): any {
    const utilizationRate = 0.7; // Assume 70% initial utilization
    const currentLevel = ((creditLimit * utilizationRate) / creditLimit) * 100;

    // Refill rate based on payment history
    const baseRefillRate = creditLimit * 0.1; // 10% of limit
    const paymentMultiplier =
      inputs.paymentHistory.onTimePayments /
      Math.max(1, inputs.paymentHistory.totalPayments);
    const refillRate = baseRefillRate * paymentMultiplier;

    // Evaporation rate (credit limit reduction for inactivity)
    const evaporationRate = creditLimit * 0.001; // 0.1% per day max

    return {
      current: Math.round(currentLevel),
      capacity: creditLimit,
      refillRate: Math.round(refillRate),
      evaporationRate: Math.round(evaporationRate),
    };
  }

  /**
   * 🦛 Assign wildlife rating based on score
   */
  private assignWildlifeRating(score: number): any {
    let tier = "lion"; // Default

    for (const [tierName, tierData] of Object.entries(this.wildlifeTiers)) {
      if (score >= tierData.min) {
        tier = tierName;
        break;
      }
    }

    const tierData =
      this.wildlifeTiers[tier as keyof typeof this.wildlifeTiers];

    const benefits = this.getTierBenefits(tier);

    return {
      tier,
      icon: tierData.icon,
      description: `${tierData.name} - Score: ${score}`,
      benefits,
    };
  }

  /**
   * 🎁 Get tier-specific benefits
   */
  private getTierBenefits(tier: string): string[] {
    const benefits: { [key: string]: string[] } = {
      hippo: [
        "VIP customer support",
        "Lowest interest rates (2% monthly)",
        "Extended payment terms (60 days)",
        "Premium supplier access",
        "Free delivery on all orders",
      ],
      elephant: [
        "Priority customer support",
        "Low interest rates (2.5% monthly)",
        "Extended payment terms (45 days)",
        "Early access to deals",
        "Bulk order discounts",
      ],
      rhino: [
        "Standard customer support",
        "Regular interest rates (3% monthly)",
        "Standard payment terms (30 days)",
        "Group buying access",
        "Standard delivery rates",
      ],
      buffalo: [
        "Basic customer support",
        "Standard interest rates (3.5% monthly)",
        "Standard payment terms (21 days)",
        "Limited group buying access",
        "Standard delivery rates",
      ],
      lion: [
        "Basic customer support",
        "Higher interest rates (4% monthly)",
        "Short payment terms (14 days)",
        "Basic marketplace access",
        "Standard delivery rates",
      ],
    };

    return benefits[tier] || benefits.lion;
  }

  /**
   * 💡 Generate personalized recommendations
   */
  private generateRecommendations(
    score: number,
    inputs: CreditScoringInputs,
  ): string[] {
    const recommendations: string[] = [];

    if (inputs.paymentHistory.totalPayments === 0) {
      recommendations.push(
        "🐘 Make your first purchase to start building payment history",
      );
    }

    if (inputs.paymentHistory.latePayments > 0) {
      recommendations.push("⏰ Set up M-Pesa auto-pay to avoid late payments");
    }

    if (inputs.socialTrust.referrals < 3) {
      recommendations.push(
        "🤝 Invite other business owners to increase your network",
      );
    }

    if (!inputs.mpesaProfile.phoneVerified) {
      recommendations.push(
        "📱 Verify your M-Pesa number for instant credit score boost",
      );
    }

    if (inputs.orderHistory.orderFrequency < 2) {
      recommendations.push(
        "📊 Increase order frequency to demonstrate consistent business activity",
      );
    }

    if (inputs.userProfile.verificationLevel === "basic") {
      recommendations.push(
        "🛡️ Complete business verification for higher credit limits",
      );
    }

    if (score < 600) {
      recommendations.push(
        "🌱 Join group buying pools to build community trust",
      );
    }

    return recommendations;
  }

  /**
   * 📅 Calculate next review date
   */
  private calculateNextReviewDate(score: number): Date {
    const reviewPeriods = {
      high_score: 90, // 3 months for scores > 750
      medium_score: 60, // 2 months for scores 500-750
      low_score: 30, // 1 month for scores < 500
    };

    let days = reviewPeriods.low_score;
    if (score >= 750) days = reviewPeriods.high_score;
    else if (score >= 500) days = reviewPeriods.medium_score;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);

    return nextReview;
  }

  /**
   * 🔄 Update credit score based on new payment
   */
  public updateCreditOnPayment(
    userId: string,
    paymentAmount: number,
    isOnTime: boolean,
  ): void {
    // In production, this would update the user's credit profile
    console.log(
      `💧 Waterhole refill: User ${userId} payment ${paymentAmount} KES, on-time: ${isOnTime}`,
    );
  }

  /**
   * 📊 Bulk credit assessment for multiple users
   */
  public assessBulkCredit(users: CreditScoringInputs[]): CreditScoringResult[] {
    return users.map((user) => this.calculateCreditScore(user));
  }

  /**
   * 🎯 Get credit limit recommendation based on business type
   */
  public getBusinessTypeCreditMultiplier(businessType: string): number {
    const multipliers: { [key: string]: number } = {
      grocery_store: 1.2,
      pharmacy: 1.5,
      electronics: 0.8,
      clothing: 0.9,
      restaurant: 1.1,
      hardware: 1.3,
      general_store: 1.0,
    };

    return multipliers[businessType] || 1.0;
  }
}

export const creditScoringService = new CreditScoringService();
export default creditScoringService;
