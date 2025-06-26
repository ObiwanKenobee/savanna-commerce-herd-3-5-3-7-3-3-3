/**
 * 🌳 Savanna Marketplace - Demand Forecasting Algorithm
 * "Acacia Bloom" predictive system for Kenya market
 */

export interface ForecastingInputs {
  productId: string;
  productCategory: string;
  historicalSales: {
    date: Date;
    quantity: number;
    price: number;
    location: string;
  }[];
  weatherData?: {
    temperature: number;
    rainfall: number; // mm
    humidity: number;
    season: "dry" | "rainy" | "transitional";
  };
  socialEvents?: {
    name: string;
    type: "holiday" | "election" | "harvest" | "school" | "religious";
    impact: number; // 0.5-2.0 multiplier
    startDate: Date;
    endDate: Date;
  }[];
  economicIndicators?: {
    inflationRate: number;
    unemploymentRate: number;
    kenyaShillingRate: number; // vs USD
    fuelPrice: number;
  };
  location: {
    county: string;
    isUrban: boolean;
    population: number;
  };
}

export interface ForecastResult {
  predictions: DemandPrediction[];
  confidence: number; // 0-100%
  acaciaVisualization: {
    treeState: "seedling" | "growing" | "blooming" | "mature" | "abundant";
    leafCount: number; // Represents demand intensity
    bloomIntensity: number; // 0-100%
    seasonalPattern: string;
  };
  insights: {
    trend: "increasing" | "decreasing" | "stable" | "seasonal";
    seasonality: string;
    keyDrivers: string[];
    kenyaFactors: string[];
  };
  recommendations: {
    stockLevels: number[];
    orderTiming: Date[];
    priceOptimization: number[];
    marketingOpportunities: string[];
  };
  riskFactors: {
    weatherRisk: number; // 0-100%
    economicRisk: number;
    competitionRisk: number;
    supplyChainRisk: number;
  };
}

export interface DemandPrediction {
  date: Date;
  predictedDemand: number;
  confidenceInterval: {
    low: number;
    high: number;
  };
  factors: {
    baseline: number;
    weather: number;
    seasonal: number;
    events: number;
    economic: number;
  };
}

class DemandForecastingService {
  private kenyaHolidays = [
    {
      name: "Ramadan",
      category: "religious",
      demandMultiplier: { rice: 1.8, dates: 2.5, sugar: 1.4 },
    },
    {
      name: "Christmas",
      category: "holiday",
      demandMultiplier: { flour: 1.6, cooking_oil: 1.8, rice: 1.4 },
    },
    {
      name: "New Year",
      category: "holiday",
      demandMultiplier: { beverages: 2.0, meat: 1.5 },
    },
    {
      name: "Easter",
      category: "religious",
      demandMultiplier: { flour: 1.3, sugar: 1.2 },
    },
    {
      name: "Eid",
      category: "religious",
      demandMultiplier: { meat: 2.2, rice: 1.6, sugar: 1.3 },
    },
    {
      name: "Mashujaa Day",
      category: "holiday",
      demandMultiplier: { general: 1.2 },
    },
  ];

  private seasonalPatterns = {
    maize: {
      harvest: [10, 11, 12], // Oct-Dec
      shortage: [6, 7, 8], // Jun-Aug
      multiplier: { harvest: 0.8, shortage: 1.4 },
    },
    rice: {
      harvest: [3, 4, 5], // Mar-May (Mwea harvest)
      shortage: [11, 12, 1], // Nov-Jan
      multiplier: { harvest: 0.9, shortage: 1.3 },
    },
    vegetables: {
      rainy_season: [3, 4, 5, 10, 11], // Mar-May, Oct-Nov
      dry_season: [6, 7, 8, 9, 12, 1, 2],
      multiplier: { rainy_season: 0.7, dry_season: 1.5 },
    },
  };

  private countyCharacteristics = new Map([
    ["Nairobi", { urbanization: 0.9, purchasing_power: 1.3, volatility: 0.8 }],
    ["Mombasa", { urbanization: 0.8, purchasing_power: 1.1, volatility: 0.9 }],
    ["Kisumu", { urbanization: 0.6, purchasing_power: 0.9, volatility: 1.2 }],
    ["Nakuru", { urbanization: 0.5, purchasing_power: 1.0, volatility: 1.0 }],
    ["Meru", { urbanization: 0.3, purchasing_power: 0.8, volatility: 1.4 }],
  ]);

  /**
   * 🌳 Main Acacia Bloom forecasting algorithm
   */
  public async generateForecast(
    inputs: ForecastingInputs,
    forecastDays: number = 30,
  ): Promise<ForecastResult> {
    // 1. Analyze historical patterns (Tree Growth Rings)
    const historicalPatterns = this.analyzeHistoricalPatterns(
      inputs.historicalSales,
    );

    // 2. Calculate baseline trend (Acacia Root System)
    const baselineTrend = this.calculateBaselineTrend(inputs.historicalSales);

    // 3. Apply seasonal adjustments (Seasonal Blooming)
    const seasonalAdjustments = this.calculateSeasonalAdjustments(
      inputs.productCategory,
      forecastDays,
    );

    // 4. Weather impact analysis (Rainfall on Tree Growth)
    const weatherImpact = await this.calculateWeatherImpact(
      inputs.weatherData,
      inputs.productCategory,
      inputs.location,
    );

    // 5. Social events impact (Festival Season Effects)
    const eventsImpact = this.calculateEventsImpact(
      inputs.socialEvents || [],
      inputs.productCategory,
      forecastDays,
    );

    // 6. Economic factors (Soil Nutrients)
    const economicImpact = this.calculateEconomicImpact(
      inputs.economicIndicators,
      inputs.location,
    );

    // 7. Generate daily predictions
    const predictions = this.generateDailyPredictions(
      baselineTrend,
      seasonalAdjustments,
      weatherImpact,
      eventsImpact,
      economicImpact,
      forecastDays,
    );

    // 8. Calculate confidence levels
    const confidence = this.calculateConfidence(
      historicalPatterns,
      predictions,
    );

    // 9. Create Acacia visualization
    const acaciaVisualization = this.generateAcaciaVisualization(
      predictions,
      seasonalAdjustments,
    );

    // 10. Generate insights and recommendations
    const insights = this.generateInsights(predictions, inputs);
    const recommendations = this.generateRecommendations(
      predictions,
      insights,
      inputs,
    );
    const riskFactors = this.assessRiskFactors(inputs, predictions);

    return {
      predictions,
      confidence,
      acaciaVisualization,
      insights,
      recommendations,
      riskFactors,
    };
  }

  /**
   * 📊 Analyze historical sales patterns
   */
  private analyzeHistoricalPatterns(salesData: any[]): any {
    if (salesData.length < 7) {
      return { hasData: false, trend: "insufficient_data" };
    }

    // Sort by date
    const sortedData = salesData.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    // Calculate moving averages
    const movingAverages = this.calculateMovingAverages(sortedData, 7); // 7-day MA

    // Detect trend
    const trend = this.detectTrend(movingAverages);

    // Calculate volatility
    const volatility = this.calculateVolatility(sortedData);

    // Identify seasonal patterns
    const seasonality = this.identifySeasonality(sortedData);

    return {
      hasData: true,
      trend,
      volatility,
      seasonality,
      movingAverages,
      averageDailyDemand:
        sortedData.reduce((sum, d) => sum + d.quantity, 0) / sortedData.length,
    };
  }

  /**
   * 📈 Calculate baseline trend
   */
  private calculateBaselineTrend(salesData: any[]): number {
    if (salesData.length < 2) return 0;

    const sortedData = salesData.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const firstHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
    const secondHalf = sortedData.slice(Math.floor(sortedData.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.quantity, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.quantity, 0) / secondHalf.length;

    return (secondAvg - firstAvg) / firstAvg; // Percentage change
  }

  /**
   * 🌿 Calculate seasonal adjustments
   */
  private calculateSeasonalAdjustments(
    productCategory: string,
    forecastDays: number,
  ): number[] {
    const adjustments: number[] = [];
    const currentDate = new Date();

    for (let i = 0; i < forecastDays; i++) {
      const forecastDate = new Date(currentDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      const month = forecastDate.getMonth() + 1;

      let adjustment = 1.0; // Default no adjustment

      // Apply product-specific seasonal patterns
      if (
        this.seasonalPatterns[
          productCategory as keyof typeof this.seasonalPatterns
        ]
      ) {
        const pattern =
          this.seasonalPatterns[
            productCategory as keyof typeof this.seasonalPatterns
          ];

        if (pattern.harvest && pattern.harvest.includes(month)) {
          adjustment = pattern.multiplier.harvest;
        } else if (pattern.shortage && pattern.shortage.includes(month)) {
          adjustment = pattern.multiplier.shortage;
        }
      }

      // General seasonal patterns for Kenya
      if (month >= 6 && month <= 8) {
        adjustment *= 1.1; // Dry season - slightly higher demand for preserved foods
      } else if (month >= 3 && month <= 5) {
        adjustment *= 0.9; // Rainy season - fresh produce available
      }

      adjustments.push(adjustment);
    }

    return adjustments;
  }

  /**
   * 🌧️ Calculate weather impact
   */
  private async calculateWeatherImpact(
    weatherData: any,
    productCategory: string,
    location: any,
  ): Promise<number[]> {
    // In production, integrate with IBM Weather API
    // For now, simulate weather impact

    const impact: number[] = [];
    const baseImpact = weatherData
      ? this.getWeatherImpactForCategory(weatherData, productCategory)
      : 1.0;

    // Generate weather impact for forecast period
    for (let i = 0; i < 30; i++) {
      let dailyImpact = baseImpact;

      // Simulate weather variations
      if (weatherData?.season === "rainy") {
        if (["vegetables", "fresh_produce"].includes(productCategory)) {
          dailyImpact *= 0.8; // Lower demand for fresh produce in rainy season
        } else if (
          ["flour", "rice", "canned_goods"].includes(productCategory)
        ) {
          dailyImpact *= 1.2; // Higher demand for shelf-stable items
        }
      } else if (weatherData?.season === "dry") {
        if (["water", "beverages"].includes(productCategory)) {
          dailyImpact *= 1.4; // Higher demand for drinks in dry season
        }
      }

      impact.push(dailyImpact);
    }

    return impact;
  }

  private getWeatherImpactForCategory(weather: any, category: string): number {
    const impacts: { [key: string]: { [key: string]: number } } = {
      vegetables: { rainy: 0.7, dry: 1.3, transitional: 1.0 },
      flour: { rainy: 1.2, dry: 1.0, transitional: 1.0 },
      beverages: { rainy: 0.8, dry: 1.5, transitional: 1.0 },
      rice: { rainy: 1.1, dry: 1.0, transitional: 1.0 },
    };

    return impacts[category]?.[weather.season] || 1.0;
  }

  /**
   * 🎉 Calculate events impact
   */
  private calculateEventsImpact(
    events: any[],
    productCategory: string,
    forecastDays: number,
  ): number[] {
    const impact: number[] = new Array(forecastDays).fill(1.0);
    const currentDate = new Date();

    events.forEach((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      for (let i = 0; i < forecastDays; i++) {
        const forecastDate = new Date(currentDate);
        forecastDate.setDate(forecastDate.getDate() + i);

        if (forecastDate >= eventStart && forecastDate <= eventEnd) {
          // Find matching holiday pattern
          const holiday = this.kenyaHolidays.find((h) => h.name === event.name);
          if (holiday && holiday.demandMultiplier[productCategory]) {
            impact[i] *= holiday.demandMultiplier[productCategory];
          } else if (holiday && holiday.demandMultiplier.general) {
            impact[i] *= holiday.demandMultiplier.general;
          } else {
            impact[i] *= event.impact;
          }
        }
      }
    });

    return impact;
  }

  /**
   * 💰 Calculate economic impact
   */
  private calculateEconomicImpact(economicData: any, location: any): number {
    if (!economicData) return 1.0;

    let impact = 1.0;

    // Inflation impact
    if (economicData.inflationRate > 0.05) {
      // 5%
      impact *= 1 - economicData.inflationRate * 0.5; // Reduce demand due to inflation
    }

    // Unemployment impact
    if (economicData.unemploymentRate > 0.15) {
      // 15%
      impact *= 1 - economicData.unemploymentRate * 0.3;
    }

    // Currency strength impact (for imported goods)
    if (economicData.kenyaShillingRate > 130) {
      // Weak shilling
      impact *= 0.9; // Reduced demand for imported goods
    }

    // Fuel price impact (affects transportation costs)
    if (economicData.fuelPrice > 180) {
      // KES per liter
      impact *= 0.95; // Slightly reduced demand due to higher transport costs
    }

    // Location-specific adjustments
    const countyData = this.countyCharacteristics.get(location.county);
    if (countyData) {
      impact *= countyData.purchasing_power;
    }

    return impact;
  }

  /**
   * 📅 Generate daily predictions
   */
  private generateDailyPredictions(
    baselineTrend: number,
    seasonalAdjustments: number[],
    weatherImpact: number[],
    eventsImpact: number[],
    economicImpact: number,
    forecastDays: number,
  ): DemandPrediction[] {
    const predictions: DemandPrediction[] = [];
    const currentDate = new Date();
    const baseDemand = 100; // Baseline daily demand

    for (let i = 0; i < forecastDays; i++) {
      const forecastDate = new Date(currentDate);
      forecastDate.setDate(forecastDate.getDate() + i);

      // Calculate baseline with trend
      const baseline = baseDemand * (1 + baselineTrend * (i / 30)); // Apply trend over 30 days

      // Apply all factors
      const seasonal = seasonalAdjustments[i] || 1.0;
      const weather = weatherImpact[i] || 1.0;
      const events = eventsImpact[i] || 1.0;
      const economic = economicImpact;

      const predictedDemand = baseline * seasonal * weather * events * economic;

      // Calculate confidence interval (±20% for simplicity)
      const confidenceInterval = {
        low: predictedDemand * 0.8,
        high: predictedDemand * 1.2,
      };

      predictions.push({
        date: forecastDate,
        predictedDemand: Math.round(predictedDemand),
        confidenceInterval,
        factors: {
          baseline: Math.round(baseline),
          weather: Math.round((weather - 1) * 100), // Percentage impact
          seasonal: Math.round((seasonal - 1) * 100),
          events: Math.round((events - 1) * 100),
          economic: Math.round((economic - 1) * 100),
        },
      });
    }

    return predictions;
  }

  /**
   * 🌳 Generate Acacia visualization
   */
  private generateAcaciaVisualization(
    predictions: DemandPrediction[],
    seasonalAdjustments: number[],
  ): any {
    const averageDemand =
      predictions.reduce((sum, p) => sum + p.predictedDemand, 0) /
      predictions.length;
    const maxDemand = Math.max(...predictions.map((p) => p.predictedDemand));
    const demandIntensity = averageDemand / 100; // Normalize to baseline

    // Determine tree state based on demand level
    let treeState: any = "growing";
    if (demandIntensity < 0.5) treeState = "seedling";
    else if (demandIntensity < 0.8) treeState = "growing";
    else if (demandIntensity < 1.2) treeState = "blooming";
    else if (demandIntensity < 1.8) treeState = "mature";
    else treeState = "abundant";

    // Calculate leaf count (demand intensity visualization)
    const leafCount = Math.min(100, Math.round(demandIntensity * 50));

    // Bloom intensity based on seasonal variations
    const seasonalVariation =
      Math.max(...seasonalAdjustments) - Math.min(...seasonalAdjustments);
    const bloomIntensity = Math.min(100, seasonalVariation * 100);

    // Seasonal pattern description
    const isIncreasing =
      seasonalAdjustments[seasonalAdjustments.length - 1] >
      seasonalAdjustments[0];
    const seasonalPattern = isIncreasing
      ? "Spring Growth"
      : "Autumn Preparation";

    return {
      treeState,
      leafCount,
      bloomIntensity: Math.round(bloomIntensity),
      seasonalPattern,
    };
  }

  /**
   * 💡 Generate insights
   */
  private generateInsights(
    predictions: DemandPrediction[],
    inputs: ForecastingInputs,
  ): any {
    const trend = this.analyzeTrend(predictions);
    const seasonality = this.analyzeSeasonality(predictions);
    const keyDrivers = this.identifyKeyDrivers(predictions);
    const kenyaFactors = this.identifyKenyaFactors(inputs);

    return {
      trend,
      seasonality,
      keyDrivers,
      kenyaFactors,
    };
  }

  /**
   * 📋 Generate recommendations
   */
  private generateRecommendations(
    predictions: DemandPrediction[],
    insights: any,
    inputs: ForecastingInputs,
  ): any {
    const stockLevels = predictions.map((p) =>
      Math.round(p.predictedDemand * 1.2),
    ); // 20% buffer
    const orderTiming = this.calculateOptimalOrderTiming(predictions);
    const priceOptimization = this.calculatePriceOptimization(predictions);
    const marketingOpportunities = this.identifyMarketingOpportunities(
      predictions,
      insights,
    );

    return {
      stockLevels,
      orderTiming,
      priceOptimization,
      marketingOpportunities,
    };
  }

  /**
   * ⚠️ Assess risk factors
   */
  private assessRiskFactors(
    inputs: ForecastingInputs,
    predictions: DemandPrediction[],
  ): any {
    return {
      weatherRisk: this.calculateWeatherRisk(inputs.weatherData),
      economicRisk: this.calculateEconomicRisk(inputs.economicIndicators),
      competitionRisk: this.calculateCompetitionRisk(inputs.location),
      supplyChainRisk: this.calculateSupplyChainRisk(
        inputs.productCategory,
        inputs.location,
      ),
    };
  }

  // Utility methods
  private calculateMovingAverages(data: any[], window: number): number[] {
    const averages: number[] = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data
        .slice(i - window + 1, i + 1)
        .reduce((acc, d) => acc + d.quantity, 0);
      averages.push(sum / window);
    }
    return averages;
  }

  private detectTrend(data: number[]): string {
    if (data.length < 2) return "stable";
    const first = data[0];
    const last = data[data.length - 1];
    const change = (last - first) / first;

    if (change > 0.1) return "increasing";
    if (change < -0.1) return "decreasing";
    return "stable";
  }

  private calculateVolatility(data: any[]): number {
    const values = data.map((d) => d.quantity);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  private identifySeasonality(data: any[]): string {
    // Simplified seasonality detection
    return "weekly"; // Placeholder
  }

  private calculateConfidence(
    patterns: any,
    predictions: DemandPrediction[],
  ): number {
    if (!patterns.hasData) return 30;

    let confidence = 70; // Base confidence

    // Adjust based on data quality
    if (patterns.volatility < 0.2) confidence += 15; // Low volatility increases confidence
    if (patterns.volatility > 0.5) confidence -= 20; // High volatility decreases confidence

    // Adjust based on prediction consistency
    const predictionVariability = this.calculateVolatility(
      predictions.map((p) => ({ quantity: p.predictedDemand })),
    );
    if (predictionVariability < 0.3) confidence += 10;

    return Math.max(20, Math.min(95, confidence));
  }

  private analyzeTrend(predictions: DemandPrediction[]): string {
    const first = predictions[0].predictedDemand;
    const last = predictions[predictions.length - 1].predictedDemand;
    const change = (last - first) / first;

    if (change > 0.15) return "increasing";
    if (change < -0.15) return "decreasing";
    return "stable";
  }

  private analyzeSeasonality(predictions: DemandPrediction[]): string {
    // Analyze seasonal patterns in predictions
    const weeklyDemand = [];
    for (let i = 0; i < predictions.length; i += 7) {
      const weekDemand = predictions
        .slice(i, i + 7)
        .reduce((sum, p) => sum + p.predictedDemand, 0);
      weeklyDemand.push(weekDemand);
    }

    if (weeklyDemand.length < 2) return "insufficient_data";

    const isIncreasing =
      weeklyDemand[weeklyDemand.length - 1] > weeklyDemand[0];
    return isIncreasing ? "seasonal_increase_expected" : "seasonal_stability";
  }

  private identifyKeyDrivers(predictions: DemandPrediction[]): string[] {
    const drivers: string[] = [];

    // Analyze which factors have the most impact
    const factorImpacts = predictions.map((p) => p.factors);
    const avgWeatherImpact =
      factorImpacts.reduce((sum, f) => sum + Math.abs(f.weather), 0) /
      factorImpacts.length;
    const avgSeasonalImpact =
      factorImpacts.reduce((sum, f) => sum + Math.abs(f.seasonal), 0) /
      factorImpacts.length;
    const avgEventsImpact =
      factorImpacts.reduce((sum, f) => sum + Math.abs(f.events), 0) /
      factorImpacts.length;

    if (avgWeatherImpact > 10) drivers.push("Weather patterns");
    if (avgSeasonalImpact > 10) drivers.push("Seasonal trends");
    if (avgEventsImpact > 15) drivers.push("Social events");

    return drivers.length > 0 ? drivers : ["Market dynamics"];
  }

  private identifyKenyaFactors(inputs: ForecastingInputs): string[] {
    const factors: string[] = [];

    if (inputs.location.county === "Nairobi") {
      factors.push("Urban market dynamics");
    }

    if (["maize", "rice"].includes(inputs.productCategory)) {
      factors.push("Agricultural seasonality");
    }

    factors.push("M-Pesa payment patterns");
    factors.push("Fuel price volatility");

    return factors;
  }

  private calculateOptimalOrderTiming(predictions: DemandPrediction[]): Date[] {
    const orderDates: Date[] = [];

    // Identify demand peaks and order before them
    for (let i = 1; i < predictions.length - 1; i++) {
      const current = predictions[i].predictedDemand;
      const next = predictions[i + 1].predictedDemand;

      if (next > current * 1.2) {
        // 20% increase
        const orderDate = new Date(predictions[i].date);
        orderDate.setDate(orderDate.getDate() - 3); // Order 3 days before peak
        orderDates.push(orderDate);
      }
    }

    return orderDates;
  }

  private calculatePriceOptimization(
    predictions: DemandPrediction[],
  ): number[] {
    return predictions.map((p) => {
      const demandLevel = p.predictedDemand / 100; // Normalize
      if (demandLevel > 1.3) return 1.1; // 10% price increase for high demand
      if (demandLevel < 0.7) return 0.95; // 5% price decrease for low demand
      return 1.0; // No change
    });
  }

  private identifyMarketingOpportunities(
    predictions: DemandPrediction[],
    insights: any,
  ): string[] {
    const opportunities: string[] = [];

    if (insights.trend === "increasing") {
      opportunities.push("Promote bulk buying for growing demand");
    }

    if (insights.keyDrivers.includes("Social events")) {
      opportunities.push("Create event-specific marketing campaigns");
    }

    opportunities.push("Target group buying pools during peak demand");

    return opportunities;
  }

  private calculateWeatherRisk(weatherData: any): number {
    if (!weatherData) return 30;
    return weatherData.season === "rainy" ? 60 : 20;
  }

  private calculateEconomicRisk(economicData: any): number {
    if (!economicData) return 40;
    let risk = 20;
    if (economicData.inflationRate > 0.1) risk += 30;
    if (economicData.unemploymentRate > 0.2) risk += 25;
    return Math.min(90, risk);
  }

  private calculateCompetitionRisk(location: any): number {
    return location.isUrban ? 70 : 40; // Higher competition in urban areas
  }

  private calculateSupplyChainRisk(category: string, location: any): number {
    const importedGoods = ["electronics", "clothing", "manufactured"];
    if (importedGoods.includes(category)) return 60;
    return 30;
  }
}

export const demandForecastingService = new DemandForecastingService();
export default demandForecastingService;
