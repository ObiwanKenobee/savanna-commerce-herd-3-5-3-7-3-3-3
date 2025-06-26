/**
 * 🗺️ Location-Based Bundle Optimizer
 * Delivers optimized bundles based on Kenyan counties and connectivity
 */

interface LocationData {
  county: string;
  region: "urban" | "semi-urban" | "rural" | "remote";
  connectivityScore: number; // 1-10 (10 = excellent, 1 = poor)
  averageSpeed: "2g" | "3g" | "4g" | "5g";
  dataAffordability: "high" | "medium" | "low";
  primaryLanguage: "en" | "sw" | "ki" | "luo" | "kam" | "luy";
  marketType: "wholesale" | "retail" | "mixed" | "agricultural";
  economicActivity: "high" | "medium" | "low";
  recommendedBundle: "urban" | "rural" | "basic";
}

// Comprehensive Kenyan county data
export const KENYAN_COUNTIES: Record<string, LocationData> = {
  // Major Urban Centers
  NAIROBI: {
    county: "Nairobi",
    region: "urban",
    connectivityScore: 9,
    averageSpeed: "4g",
    dataAffordability: "medium",
    primaryLanguage: "en",
    marketType: "wholesale",
    economicActivity: "high",
    recommendedBundle: "urban",
  },
  MOMBASA: {
    county: "Mombasa",
    region: "urban",
    connectivityScore: 8,
    averageSpeed: "4g",
    dataAffordability: "medium",
    primaryLanguage: "sw",
    marketType: "mixed",
    economicActivity: "high",
    recommendedBundle: "urban",
  },
  KISUMU: {
    county: "Kisumu",
    region: "urban",
    connectivityScore: 7,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "luo",
    marketType: "retail",
    economicActivity: "medium",
    recommendedBundle: "urban",
  },
  NAKURU: {
    county: "Nakuru",
    region: "urban",
    connectivityScore: 7,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "en",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "urban",
  },

  // Semi-Urban Counties
  KIAMBU: {
    county: "Kiambu",
    region: "semi-urban",
    connectivityScore: 6,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "mixed",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  MACHAKOS: {
    county: "Machakos",
    region: "semi-urban",
    connectivityScore: 6,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "kam",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  KAJIADO: {
    county: "Kajiado",
    region: "semi-urban",
    connectivityScore: 5,
    averageSpeed: "3g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  MURANGA: {
    county: "Murang'a",
    region: "semi-urban",
    connectivityScore: 6,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  NYERI: {
    county: "Nyeri",
    region: "semi-urban",
    connectivityScore: 6,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },

  // Rural Counties with Decent Connectivity
  KAKAMEGA: {
    county: "Kakamega",
    region: "rural",
    connectivityScore: 5,
    averageSpeed: "3g",
    dataAffordability: "low",
    primaryLanguage: "luy",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  BUNGOMA: {
    county: "Bungoma",
    region: "rural",
    connectivityScore: 4,
    averageSpeed: "3g",
    dataAffordability: "low",
    primaryLanguage: "luy",
    marketType: "agricultural",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  KITUI: {
    county: "Kitui",
    region: "rural",
    connectivityScore: 4,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "kam",
    marketType: "agricultural",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  EMBU: {
    county: "Embu",
    region: "rural",
    connectivityScore: 5,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },

  // Remote/Challenging Connectivity Counties
  TURKANA: {
    county: "Turkana",
    region: "remote",
    connectivityScore: 2,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  MARSABIT: {
    county: "Marsabit",
    region: "remote",
    connectivityScore: 2,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  MANDERA: {
    county: "Mandera",
    region: "remote",
    connectivityScore: 2,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  WAJIR: {
    county: "Wajir",
    region: "remote",
    connectivityScore: 2,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  GARISSA: {
    county: "Garissa",
    region: "remote",
    connectivityScore: 3,
    averageSpeed: "2g",
    dataAffordability: "low",
    primaryLanguage: "en",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },

  // Central Kenya
  KIRINYAGA: {
    county: "Kirinyaga",
    region: "rural",
    connectivityScore: 5,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
  NYANDARUA: {
    county: "Nyandarua",
    region: "rural",
    connectivityScore: 4,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "ki",
    marketType: "agricultural",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },

  // Coast Region
  KILIFI: {
    county: "Kilifi",
    region: "rural",
    connectivityScore: 4,
    averageSpeed: "3g",
    dataAffordability: "low",
    primaryLanguage: "sw",
    marketType: "retail",
    economicActivity: "low",
    recommendedBundle: "basic",
  },
  KWALE: {
    county: "Kwale",
    region: "rural",
    connectivityScore: 4,
    averageSpeed: "3g",
    dataAffordability: "low",
    primaryLanguage: "sw",
    marketType: "agricultural",
    economicActivity: "low",
    recommendedBundle: "basic",
  },

  // Default fallback
  UNKNOWN: {
    county: "Unknown",
    region: "semi-urban",
    connectivityScore: 5,
    averageSpeed: "3g",
    dataAffordability: "medium",
    primaryLanguage: "en",
    marketType: "mixed",
    economicActivity: "medium",
    recommendedBundle: "rural",
  },
};

// Bundle configurations for different scenarios
export const BUNDLE_CONFIGS = {
  urban: {
    name: "Urban Bundle",
    maxSize: "2MB",
    features: [
      "full-ui",
      "animations",
      "voice-commands",
      "real-time-updates",
      "advanced-features",
    ],
    components: [
      "dashboard",
      "analytics",
      "advanced-search",
      "real-time-chat",
      "video-support",
    ],
    imageQuality: "high",
    enablePrefetching: true,
    enableServiceWorker: true,
    lazyLoadThreshold: "50px",
  },
  rural: {
    name: "Rural Bundle",
    maxSize: "1MB",
    features: [
      "core-ui",
      "basic-animations",
      "offline-support",
      "ussd-fallback",
    ],
    components: ["basic-dashboard", "simple-search", "essential-features"],
    imageQuality: "medium",
    enablePrefetching: false,
    enableServiceWorker: true,
    lazyLoadThreshold: "100px",
  },
  basic: {
    name: "Basic Bundle",
    maxSize: "500KB",
    features: ["minimal-ui", "offline-first", "ussd-primary", "no-animations"],
    components: ["essential-only", "text-based-ui", "basic-forms"],
    imageQuality: "low",
    enablePrefetching: false,
    enableServiceWorker: false,
    lazyLoadThreshold: "200px",
  },
};

// Network-based M-Pesa prefixes to county mapping
export const MPESA_COUNTY_MAP: Record<string, string> = {
  // Safaricom M-Pesa prefixes (simplified mapping)
  "254701": "NAIROBI",
  "254702": "NAIROBI",
  "254703": "MOMBASA",
  "254704": "KISUMU",
  "254705": "NAKURU",
  "254706": "KIAMBU",
  "254707": "TURKANA",
  "254708": "MARSABIT",
  "254709": "MANDERA",
  "254710": "KAKAMEGA",
  "254711": "BUNGOMA",
  "254712": "KITUI",
  "254713": "MACHAKOS",
  "254714": "KAJIADO",
  "254715": "MURANGA",
  "254716": "NYERI",
  "254717": "EMBU",
  "254718": "KIRINYAGA",
  "254719": "NYANDARUA",
  "254720": "KILIFI",
  "254721": "KWALE",
  "254722": "GARISSA",
  "254723": "WAJIR",
};

export class LocationOptimizer {
  private detectedCounty: string = "UNKNOWN";
  private locationData: LocationData;
  private overrides: Partial<LocationData> = {};

  constructor() {
    this.detectLocation();
    this.locationData = this.getLocationData();
  }

  /**
   * Detect user location from various sources
   */
  private detectLocation(): void {
    // Priority 1: User preference from localStorage
    const storedCounty = localStorage.getItem("user-county");
    if (storedCounty && KENYAN_COUNTIES[storedCounty]) {
      this.detectedCounty = storedCounty;
      return;
    }

    // Priority 2: M-Pesa number prefix
    const mpesaNumber = localStorage.getItem("mpesa-number");
    if (mpesaNumber && mpesaNumber.length >= 6) {
      const prefix = mpesaNumber.substring(0, 6);
      const county = MPESA_COUNTY_MAP[prefix];
      if (county) {
        this.detectedCounty = county;
        localStorage.setItem("user-county", county);
        return;
      }
    }

    // Priority 3: Browser geolocation (if available and permitted)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.detectCountyFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          // Geolocation failed, use IP-based detection
          this.detectCountyFromIP();
        },
        { timeout: 5000, enableHighAccuracy: false },
      );
    } else {
      this.detectCountyFromIP();
    }

    // Priority 4: Network quality analysis
    this.analyzeNetworkQuality();
  }

  /**
   * Rough county detection from coordinates (simplified)
   */
  private detectCountyFromCoordinates(lat: number, lng: number): void {
    // Simplified coordinate mapping for major counties
    const coordinateMap = [
      { county: "NAIROBI", lat: -1.2921, lng: 36.8219, radius: 0.5 },
      { county: "MOMBASA", lat: -4.0435, lng: 39.6682, radius: 0.3 },
      { county: "KISUMU", lat: -0.0917, lng: 34.768, radius: 0.3 },
      { county: "NAKURU", lat: -0.3031, lng: 36.08, radius: 0.4 },
    ];

    for (const location of coordinateMap) {
      const distance = this.calculateDistance(
        lat,
        lng,
        location.lat,
        location.lng,
      );
      if (distance <= location.radius) {
        this.detectedCounty = location.county;
        localStorage.setItem("user-county", location.county);
        return;
      }
    }
  }

  /**
   * Calculate distance between coordinates
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Detect county from IP (would use IP geolocation service in production)
   */
  private detectCountyFromIP(): void {
    // In production, this would call an IP geolocation service
    // For now, default to Nairobi as most common
    this.detectedCounty = "NAIROBI";
  }

  /**
   * Analyze network quality to infer location type
   */
  private analyzeNetworkQuality(): void {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;

      // Infer rural/urban based on connection quality
      if (effectiveType === "2g" || downlink < 1) {
        // Likely rural or remote area
        this.overrides.region = "rural";
        this.overrides.connectivityScore = Math.min(
          this.overrides.connectivityScore || 5,
          3,
        );
      } else if (effectiveType === "4g" && downlink > 5) {
        // Likely urban area
        this.overrides.region = "urban";
        this.overrides.connectivityScore = Math.max(
          this.overrides.connectivityScore || 5,
          7,
        );
      }
    }
  }

  /**
   * Get location data with overrides applied
   */
  private getLocationData(): LocationData {
    const baseData =
      KENYAN_COUNTIES[this.detectedCounty] || KENYAN_COUNTIES.UNKNOWN;
    return { ...baseData, ...this.overrides };
  }

  /**
   * Get recommended bundle type
   */
  public getRecommendedBundle(): keyof typeof BUNDLE_CONFIGS {
    return this.locationData.recommendedBundle;
  }

  /**
   * Get bundle configuration
   */
  public getBundleConfig() {
    const bundleType = this.getRecommendedBundle();
    return BUNDLE_CONFIGS[bundleType];
  }

  /**
   * Get optimized module path
   */
  public getOptimizedModulePath(basePath: string): string {
    const bundleType = this.getRecommendedBundle();

    // Return different module versions based on bundle type
    switch (bundleType) {
      case "basic":
        return basePath.replace(/\.js$/, ".basic.js");
      case "rural":
        return basePath.replace(/\.js$/, ".rural.js");
      case "urban":
      default:
        return basePath;
    }
  }

  /**
   * Should load component based on location constraints
   */
  public shouldLoadComponent(
    component: string,
    priority: "essential" | "important" | "nice-to-have",
  ): boolean {
    const bundleConfig = this.getBundleConfig();

    // Essential components always load
    if (priority === "essential") return true;

    // Important components load for rural and urban
    if (
      priority === "important" &&
      this.locationData.recommendedBundle !== "basic"
    )
      return true;

    // Nice-to-have components only for urban
    if (
      priority === "nice-to-have" &&
      this.locationData.recommendedBundle === "urban"
    )
      return true;

    return false;
  }

  /**
   * Get optimized image quality
   */
  public getImageQuality(): "low" | "medium" | "high" {
    return this.getBundleConfig().imageQuality;
  }

  /**
   * Get localized content based on primary language
   */
  public getLocalizedContent(content: Record<string, string>): string {
    const language = this.locationData.primaryLanguage;
    return (
      content[language] || content["en"] || content[Object.keys(content)[0]]
    );
  }

  /**
   * Get time-based optimization (Kenya timezone)
   */
  public getTimeBasedOptimization(): {
    isPeakHours: boolean;
    recommendedAction: "prefetch" | "defer" | "normal";
  } {
    const now = new Date();
    const kenyaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }),
    );
    const hour = kenyaTime.getHours();

    // Peak hours: 6-9 AM (morning prep), 12-2 PM (lunch), 6-8 PM (evening shopping)
    const isPeakHours =
      (hour >= 6 && hour <= 9) ||
      (hour >= 12 && hour <= 14) ||
      (hour >= 18 && hour <= 20);

    let recommendedAction: "prefetch" | "defer" | "normal" = "normal";

    if (isPeakHours && this.locationData.connectivityScore >= 7) {
      recommendedAction = "prefetch"; // Preload during peak hours if good connectivity
    } else if (isPeakHours && this.locationData.connectivityScore < 4) {
      recommendedAction = "defer"; // Defer non-essential during peak hours if poor connectivity
    }

    return { isPeakHours, recommendedAction };
  }

  /**
   * Get current location data
   */
  public getLocationData(): LocationData {
    return this.locationData;
  }

  /**
   * Override location settings (for testing or user preference)
   */
  public setLocationOverrides(overrides: Partial<LocationData>): void {
    this.overrides = { ...this.overrides, ...overrides };
    this.locationData = this.getLocationData();
  }

  /**
   * Export location-optimized configuration for webpack/vite
   */
  public getWebpackConfig() {
    const bundleConfig = this.getBundleConfig();

    return {
      performance: {
        maxAssetSize: this.parseSize(bundleConfig.maxSize),
        maxEntrypointSize: this.parseSize(bundleConfig.maxSize),
      },
      resolve: {
        alias: {
          "@/components/heavy":
            bundleConfig.name === "Basic Bundle"
              ? "@/components/lightweight"
              : "@/components/full",
        },
      },
    };
  }

  private parseSize(sizeStr: string): number {
    const num = parseFloat(sizeStr);
    if (sizeStr.includes("KB")) return num * 1024;
    if (sizeStr.includes("MB")) return num * 1024 * 1024;
    return num;
  }
}

// Singleton instance
export const locationOptimizer = new LocationOptimizer();

// Helper functions
export const getOptimizedBundle = () => locationOptimizer.getBundleConfig();
export const shouldLoadComponent = (
  component: string,
  priority: "essential" | "important" | "nice-to-have",
) => locationOptimizer.shouldLoadComponent(component, priority);
export const getImageQuality = () => locationOptimizer.getImageQuality();
export const getLocalizedText = (content: Record<string, string>) =>
  locationOptimizer.getLocalizedContent(content);
