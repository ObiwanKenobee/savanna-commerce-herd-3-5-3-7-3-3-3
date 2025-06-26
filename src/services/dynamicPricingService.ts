/**
 * 🦁 Savanna Marketplace - Dynamic Pricing Algorithm
 * Wildlife-themed pricing engine optimized for Kenya market
 */

export interface PricingInputs {
  basePrice: number;
  productId: string;
  supplierId: string;
  demandFactor: number; // 0-2 (0.5 = low demand, 1 = normal, 2 = high demand)
  competitionFactor: number; // 0-2 (0 = no competition, 1 = normal, 2 = high competition)
  seasonalFactor: number; // Holiday/seasonal multiplier
  inventoryLevel: number; // 0-1 (0 = out of stock, 1 = fully stocked)
  userLoyalty?: number; // 0-1 for elephant memory pricing
  isCheetahEligible?: boolean; // 1-hour delivery premium
  fuelCostIndex?: number; // Kenya fuel price impact
  weatherImpact?: number; // Drought/flood impact on agriculture
}

export interface PricingResult {
  finalPrice: number;
  originalPrice: number;
  discount: number;
  priceFactors: {
    demand: number;
    competition: number;
    seasonal: number;
    inventory: number;
    loyalty?: number;
    cheetah?: number;
    fuel?: number;
    weather?: number;
  };
  explanation: string;
  wildlifeTheme: {
    icon: string;
    message: string;
    tier: "cheetah" | "elephant" | "lion" | "gazelle" | "buffalo";
  };
}

class DynamicPricingService {
  private kenyaHolidays = [
    { name: "Ramadan", impact: 1.3, products: ["rice", "dates", "sugar"] },
    {
      name: "Christmas",
      impact: 1.5,
      products: ["flour", "cooking oil", "rice"],
    },
    { name: "Election Period", impact: 1.2, products: ["all"] },
    {
      name: "School Opening",
      impact: 1.4,
      products: ["stationery", "uniforms"],
    },
  ];

  private competitorPrices: Map<string, number[]> = new Map();
  private userLoyaltyScores: Map<string, number> = new Map();
  private cheetahPremiumRate = 0.15; // 15% premium for 1-hour delivery

  /**
   * 🐆 Cheetah Pricing: Flash discounts for 1-hour orders
   */
  private calculateCheetahPricing(
    basePrice: number,
    isCheetahEligible: boolean,
  ): number {
    if (!isCheetahEligible) return 0;

    // Cheetah mode has both premium and discount elements
    const currentHour = new Date().getHours();
    const isRushHour =
      (currentHour >= 8 && currentHour <= 10) ||
      (currentHour >= 17 && currentHour <= 19);

    if (isRushHour) {
      // Rush hour premium (when everyone wants fast delivery)
      return basePrice * this.cheetahPremiumRate;
    } else {
      // Off-peak discount to encourage cheetah orders
      return -basePrice * 0.05; // 5% discount
    }
  }

  /**
   * 🐘 Elephant Memory: Honor past loyalty with personalized deals
   */
  private calculateElephantMemoryPricing(
    basePrice: number,
    userId: string,
    userLoyalty: number = 0,
  ): number {
    const loyaltyScore = this.userLoyaltyScores.get(userId) || userLoyalty;

    if (loyaltyScore >= 0.8) {
      // VIP Elephant - significant loyalty discount
      return -basePrice * 0.12; // 12% loyalty discount
    } else if (loyaltyScore >= 0.6) {
      // Regular Elephant - medium discount
      return -basePrice * 0.08; // 8% loyalty discount
    } else if (loyaltyScore >= 0.4) {
      // Junior Elephant - small discount
      return -basePrice * 0.04; // 4% loyalty discount
    }

    return 0; // No loyalty discount
  }

  /**
   * 🌾 Kenya-specific demand factors
   */
  private calculateKenyaDemandFactor(
    productCategory: string,
    weatherImpact: number = 1,
  ): number {
    const droughtAffectedProducts = ["maize", "flour", "sugar", "milk"];
    const floodAffectedProducts = ["vegetables", "fruits", "fresh produce"];

    // Drought increases demand for staples
    if (
      weatherImpact > 1.2 &&
      droughtAffectedProducts.some((p) => productCategory.includes(p))
    ) {
      return weatherImpact * 1.3;
    }

    // Floods increase demand for preserved foods
    if (
      weatherImpact > 1.2 &&
      floodAffectedProducts.some((p) => productCategory.includes(p))
    ) {
      return weatherImpact * 1.2;
    }

    return weatherImpact;
  }

  /**
   * 🦬 Buffalo Herd: Group buying discount calculation
   */
  private calculateGroupBuyingDiscount(
    basePrice: number,
    groupSize: number,
  ): number {
    if (groupSize < 5) return 0;

    // Buffalo herd strength: 2% discount per participant, max 25%
    const discountRate = Math.min(0.25, groupSize * 0.02);
    return -basePrice * discountRate;
  }

  /**
   * Main pricing calculation with wildlife theming
   */
  public calculateDynamicPrice(
    inputs: PricingInputs,
    userId?: string,
    groupSize?: number,
  ): PricingResult {
    const {
      basePrice,
      demandFactor,
      competitionFactor,
      seasonalFactor = 1,
      inventoryLevel,
      userLoyalty = 0,
      isCheetahEligible = false,
      fuelCostIndex = 1,
      weatherImpact = 1,
    } = inputs;

    // Core pricing algorithm
    let adjustedPrice = basePrice;
    const priceFactors: any = {};

    // 1. Demand adjustment (Gazelle effect - quick response to market changes)
    const demandAdjustment = basePrice * (0.3 * (demandFactor - 1));
    adjustedPrice += demandAdjustment;
    priceFactors.demand = demandAdjustment;

    // 2. Competition adjustment (Lion territory - protect market share)
    const competitionAdjustment = basePrice * (-0.15 * (competitionFactor - 1));
    adjustedPrice += competitionAdjustment;
    priceFactors.competition = competitionAdjustment;

    // 3. Seasonal adjustment (Migration patterns)
    const seasonalAdjustment = basePrice * (seasonalFactor - 1);
    adjustedPrice += seasonalAdjustment;
    priceFactors.seasonal = seasonalAdjustment;

    // 4. Inventory level adjustment (Acacia tree resources)
    const inventoryAdjustment = basePrice * (0.1 * (1 - inventoryLevel));
    adjustedPrice += inventoryAdjustment;
    priceFactors.inventory = inventoryAdjustment;

    // 5. Cheetah pricing (speed premium/discount)
    const cheetahAdjustment = this.calculateCheetahPricing(
      basePrice,
      isCheetahEligible,
    );
    adjustedPrice += cheetahAdjustment;
    priceFactors.cheetah = cheetahAdjustment;

    // 6. Elephant memory pricing (loyalty)
    const loyaltyAdjustment = this.calculateElephantMemoryPricing(
      basePrice,
      userId || "",
      userLoyalty,
    );
    adjustedPrice += loyaltyAdjustment;
    priceFactors.loyalty = loyaltyAdjustment;

    // 7. Kenya-specific factors
    const fuelAdjustment = basePrice * (0.05 * (fuelCostIndex - 1));
    adjustedPrice += fuelAdjustment;
    priceFactors.fuel = fuelAdjustment;

    const weatherAdjustment = basePrice * (0.1 * (weatherImpact - 1));
    adjustedPrice += weatherAdjustment;
    priceFactors.weather = weatherAdjustment;

    // 8. Group buying discount
    if (groupSize && groupSize > 1) {
      const groupDiscount = this.calculateGroupBuyingDiscount(
        basePrice,
        groupSize,
      );
      adjustedPrice += groupDiscount;
      priceFactors.group = groupDiscount;
    }

    // Ensure minimum price (cost + 5% margin)
    const minimumPrice = basePrice * 0.7;
    adjustedPrice = Math.max(adjustedPrice, minimumPrice);

    // Calculate discount/premium
    const discount = ((basePrice - adjustedPrice) / basePrice) * 100;

    // Determine wildlife theme based on pricing tier
    const wildlifeTheme = this.getWildlifeTheme(
      discount,
      isCheetahEligible,
      userLoyalty,
      groupSize,
    );

    // Generate explanation
    const explanation = this.generatePricingExplanation(
      priceFactors,
      discount,
      wildlifeTheme,
    );

    return {
      finalPrice: Math.round(adjustedPrice),
      originalPrice: basePrice,
      discount,
      priceFactors,
      explanation,
      wildlifeTheme,
    };
  }

  private getWildlifeTheme(
    discount: number,
    isCheetah: boolean,
    loyalty: number,
    groupSize?: number,
  ): any {
    if (isCheetah && discount < 0) {
      return {
        icon: "🐆",
        message: "Cheetah Speed Premium - Lightning fast delivery!",
        tier: "cheetah",
      };
    }

    if (loyalty > 0.7) {
      return {
        icon: "🐘",
        message: "Elephant Memory Reward - Thank you for your loyalty!",
        tier: "elephant",
      };
    }

    if (groupSize && groupSize > 10) {
      return {
        icon: "🦬",
        message: "Buffalo Herd Power - Massive group savings!",
        tier: "buffalo",
      };
    }

    if (discount > 15) {
      return {
        icon: "🦁",
        message: "Lion's Share Deal - King of savings!",
        tier: "lion",
      };
    }

    return {
      icon: "🦌",
      message: "Gazelle Quick Deal - Market price optimized!",
      tier: "gazelle",
    };
  }

  private generatePricingExplanation(
    factors: any,
    discount: number,
    theme: any,
  ): string {
    const explanations = [];

    if (factors.demand > 0) explanations.push("High market demand");
    if (factors.competition < 0) explanations.push("Competitive pricing");
    if (factors.cheetah > 0) explanations.push("1-hour delivery premium");
    if (factors.cheetah < 0) explanations.push("Off-peak cheetah discount");
    if (factors.loyalty < 0) explanations.push("Loyalty discount applied");
    if (factors.seasonal > 0) explanations.push("Seasonal demand increase");
    if (factors.weather > 0) explanations.push("Weather impact on supply");
    if (factors.group < 0) explanations.push("Group buying discount");

    let explanation = explanations.join(", ");
    if (!explanation) explanation = "Standard market pricing";

    return `${theme.icon} ${explanation}. ${theme.message}`;
  }

  /**
   * Update competitor prices (from Twiga/Wasoko scraping)
   */
  public updateCompetitorPrices(productId: string, prices: number[]): void {
    this.competitorPrices.set(productId, prices);
  }

  /**
   * Update user loyalty scores (Elephant Memory)
   */
  public updateUserLoyalty(userId: string, score: number): void {
    this.userLoyaltyScores.set(userId, Math.min(1, Math.max(0, score)));
  }

  /**
   * Get real-time fuel price impact from Kenya Power API
   */
  public async getFuelCostIndex(): Promise<number> {
    try {
      // In production, this would fetch from Kenya Power API
      // For now, simulate based on global fuel trends
      const mockFuelPrice = 150 + Math.random() * 20; // KES per liter
      const baselineFuelPrice = 150;
      return mockFuelPrice / baselineFuelPrice;
    } catch (error) {
      console.error("Error fetching fuel costs:", error);
      return 1; // Fallback to baseline
    }
  }

  /**
   * Get weather impact from IBM Weather API
   */
  public async getWeatherImpact(location: string): Promise<number> {
    try {
      // In production, integrate with IBM Weather API
      // Simulate drought/flood conditions
      const weatherConditions = [
        "normal",
        "drought",
        "flood",
        "normal",
        "normal",
      ];
      const condition =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

      switch (condition) {
        case "drought":
          return 1.3; // 30% price increase
        case "flood":
          return 1.2; // 20% price increase
        default:
          return 1; // Normal conditions
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return 1;
    }
  }

  /**
   * Bulk pricing calculation for multiple products
   */
  public calculateBulkPricing(
    products: PricingInputs[],
    userId?: string,
  ): PricingResult[] {
    return products.map((product) =>
      this.calculateDynamicPrice(product, userId),
    );
  }
}

// Singleton instance
export const dynamicPricingService = new DynamicPricingService();

// Export types and service
export default dynamicPricingService;
