/**
 * 🌍 Savanna Marketplace - Comprehensive API Integrations Configuration
 * Centralized configuration for all external and internal API services
 */

// Safe environment variable access for both browser and Node.js environments
const getEnvVar = (key: string, defaultValue: string = ""): string => {
  try {
    if (typeof window !== "undefined") {
      // Browser environment - use import.meta.env for Vite
      return (import.meta.env as any)[key] || defaultValue;
    }
    // Node environment - fallback for SSR or build processes
    return typeof process !== "undefined" && process.env
      ? process.env[key] || defaultValue
      : defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Helper for boolean environment variables
const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  return value === "true" || value === "1" || defaultValue;
};

export interface APIConfig {
  name: string;
  baseUrl: string;
  version: string;
  authentication: "apiKey" | "oauth" | "basic" | "bearer" | "custom";
  environment: "development" | "staging" | "production";
  region?: string;
  enabled: boolean;
  rateLimit?: {
    requests: number;
    window: number; // milliseconds
  };
  timeout?: number;
  retries?: number;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  description: string;
  documentation?: string;
  healthCheck?: string;
}

// ============================================================================
// 1. PAYMENT & FINANCIAL APIS
// ============================================================================

export const PAYMENT_APIS: Record<string, APIConfig> = {
  mpesa: {
    name: "M-Pesa STK Push API",
    baseUrl: "https://sandbox.safaricom.co.ke",
    version: "v1",
    authentication: "oauth",
    environment: getEnvVar("VITE_MPESA_ENVIRONMENT", "development") as
      | "development"
      | "staging"
      | "production",
    region: "Kenya",
    enabled: !!getEnvVar("VITE_MPESA_CONSUMER_KEY"),
    rateLimit: { requests: 1000, window: 60000 },
    timeout: 30000,
    retries: 3,
    priority: "critical",
    category: "Payment",
    description: "Primary payment method for Kenya - M-Pesa mobile money",
    documentation: "https://developer.safaricom.co.ke/docs",
    healthCheck: "/oauth/v1/generate",
  },

  stripe: {
    name: "Stripe Payment Processing",
    baseUrl: "https://api.stripe.com",
    version: "v1",
    authentication: "bearer",
    environment: (getEnvVar("STRIPE_SECRET_KEY").includes("sk_test")
      ? "development"
      : "production") as "development" | "staging" | "production",
    region: "Global",
    enabled: !!getEnvVar("VITE_STRIPE_PUBLISHABLE_KEY"),
    rateLimit: { requests: 100, window: 60000 },
    timeout: 15000,
    retries: 2,
    priority: "high",
    category: "Payment",
    description: "International card payments and fraud detection",
    documentation: "https://stripe.com/docs/api",
    healthCheck: "/v1/charges",
  },
};

// ============================================================================
// 2. CREDIT & BNPL APIS
// ============================================================================

export const CREDIT_APIS: Record<string, APIConfig> = {
  internal_credit: {
    name: "Waterhole Credit Engine",
    baseUrl: getEnvVar(
      "CREDIT_SCORING_API_URL",
      "http://localhost:8080/api/credit",
    ),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("WATERHOLE_CREDIT_ENABLED"),
    rateLimit: { requests: 500, window: 60000 },
    timeout: 5000,
    retries: 2,
    priority: "critical",
    category: "Credit",
    description: "Internal BNPL and credit scoring system",
    documentation: "/api/credit/docs",
    healthCheck: "/api/credit/health",
  },
};

// ============================================================================
// 3. COMMUNICATION APIS
// ============================================================================

export const COMMUNICATION_APIS: Record<string, APIConfig> = {
  africas_talking: {
    name: "Africa's Talking USSD & SMS",
    baseUrl: "https://api.africastalking.com",
    version: "v1",
    authentication: "apiKey",
    environment: "development",
    region: "Africa",
    enabled: !!getEnvVar("VITE_AFRICAS_TALKING_API_KEY"),
    rateLimit: { requests: 200, window: 60000 },
    timeout: 15000,
    retries: 2,
    priority: "critical",
    category: "Communication",
    description: "USSD services and SMS for feature phones",
    documentation: "https://developers.africastalking.com",
    healthCheck: "/version1/user",
  },
};

// ============================================================================
// 4. LOGISTICS & DELIVERY APIS
// ============================================================================

export const LOGISTICS_APIS: Record<string, APIConfig> = {
  google_maps: {
    name: "Google Maps Platform",
    baseUrl: "https://maps.googleapis.com",
    version: "v1",
    authentication: "apiKey",
    environment: "development",
    region: "Global",
    enabled: !!getEnvVar("VITE_GOOGLE_MAPS_API_KEY"),
    rateLimit: { requests: 100, window: 60000 },
    timeout: 10000,
    retries: 2,
    priority: "critical",
    category: "Logistics",
    description: "Route optimization, geocoding, and mapping services",
    documentation: "https://developers.google.com/maps",
    healthCheck: "/maps/api/geocode/json",
  },

  cheetah_logistics: {
    name: "Cheetah Logistics Engine",
    baseUrl: getEnvVar(
      "LOGISTICS_API_URL",
      "http://localhost:8080/api/logistics",
    ),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("ROUTE_OPTIMIZATION_ENABLED"),
    rateLimit: { requests: 1000, window: 60000 },
    timeout: 5000,
    retries: 2,
    priority: "critical",
    category: "Logistics",
    description: "Internal route optimization and delivery management",
    documentation: "/api/logistics/docs",
    healthCheck: "/api/logistics/health",
  },
};

// ============================================================================
// 5. AI/ML & DATA APIS
// ============================================================================

export const AI_ML_APIS: Record<string, APIConfig> = {
  elephant_memory_ai: {
    name: "Elephant Memory AI Engine",
    baseUrl: getEnvVar("AI_SERVICE_URL", "http://localhost:8080/api/ai"),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("DEMAND_FORECASTING_ENABLED"),
    rateLimit: { requests: 300, window: 60000 },
    timeout: 10000,
    retries: 2,
    priority: "high",
    category: "AI/ML",
    description: "Internal AI for demand forecasting and dynamic pricing",
    documentation: "/api/ai/docs",
    healthCheck: "/api/ai/health",
  },
};

// ============================================================================
// 6. SUPPLIER & INVENTORY APIS
// ============================================================================

export const SUPPLIER_APIS: Record<string, APIConfig> = {
  internal_inventory: {
    name: "Savanna Inventory Service",
    baseUrl: getEnvVar(
      "INVENTORY_API_URL",
      "http://localhost:8080/api/inventory",
    ),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("REAL_TIME_SYNC_ENABLED"),
    rateLimit: { requests: 1000, window: 60000 },
    timeout: 3000,
    retries: 3,
    priority: "critical",
    category: "Supplier",
    description: "Real-time inventory synchronization and management",
    documentation: "/api/inventory/docs",
    healthCheck: "/api/inventory/health",
  },
};

// ============================================================================
// 7. SECURITY & COMPLIANCE APIS
// ============================================================================

export const SECURITY_APIS: Record<string, APIConfig> = {
  internal_security: {
    name: "Savanna Security Engine",
    baseUrl: getEnvVar(
      "SECURITY_API_URL",
      "http://localhost:8080/api/security",
    ),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("SECURITY_MONITORING_ENABLED"),
    rateLimit: { requests: 500, window: 60000 },
    timeout: 5000,
    retries: 2,
    priority: "critical",
    category: "Security",
    description: "Internal security monitoring and fraud detection",
    documentation: "/api/security/docs",
    healthCheck: "/api/security/health",
  },
};

// ============================================================================
// 8. CORE INFRASTRUCTURE APIS
// ============================================================================

export const INFRASTRUCTURE_APIS: Record<string, APIConfig> = {
  supabase: {
    name: "Supabase Database & Auth",
    baseUrl: getEnvVar("VITE_SUPABASE_URL", "https://localhost:54321"),
    version: "v1",
    authentication: "bearer",
    environment: "development",
    region: "Global",
    enabled: !!getEnvVar("VITE_SUPABASE_URL"),
    rateLimit: { requests: 500, window: 60000 },
    timeout: 10000,
    retries: 2,
    priority: "critical",
    category: "Infrastructure",
    description:
      "Primary database, authentication, and real-time subscriptions",
    documentation: "https://supabase.com/docs",
    healthCheck: "/rest/v1/",
  },

  api_gateway: {
    name: "Savanna API Gateway",
    baseUrl: getEnvVar("API_GATEWAY_URL", "http://localhost:8080/api"),
    version: getEnvVar("API_GATEWAY_VERSION", "v1"),
    authentication: "bearer",
    environment: "development",
    region: "Kenya",
    enabled: getEnvBool("ENABLE_API_RATE_LIMITING"),
    rateLimit: { requests: 2000, window: 60000 },
    timeout: 30000,
    retries: 3,
    priority: "critical",
    category: "Infrastructure",
    description: "Central API gateway with rate limiting and request routing",
    documentation: "/api/docs",
    healthCheck: "/api/health",
  },
};

// ============================================================================
// CONSOLIDATED API REGISTRY
// ============================================================================

export const ALL_APIS = {
  ...PAYMENT_APIS,
  ...CREDIT_APIS,
  ...COMMUNICATION_APIS,
  ...LOGISTICS_APIS,
  ...AI_ML_APIS,
  ...SUPPLIER_APIS,
  ...SECURITY_APIS,
  ...INFRASTRUCTURE_APIS,
};

// ============================================================================
// API MANAGEMENT UTILITIES
// ============================================================================

export class APIManager {
  private static instance: APIManager;
  private healthCheckResults: Map<string, boolean> = new Map();
  private lastHealthCheck: Map<string, number> = new Map();

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  /**
   * Get all enabled APIs
   */
  getEnabledAPIs(): APIConfig[] {
    return Object.values(ALL_APIS).filter((api) => api.enabled);
  }

  /**
   * Get APIs by category
   */
  getAPIsByCategory(category: string): APIConfig[] {
    return Object.values(ALL_APIS).filter(
      (api) =>
        api.category.toLowerCase() === category.toLowerCase() && api.enabled,
    );
  }

  /**
   * Get critical APIs
   */
  getCriticalAPIs(): APIConfig[] {
    return Object.values(ALL_APIS).filter(
      (api) => api.priority === "critical" && api.enabled,
    );
  }

  /**
   * Check API health status
   */
  async checkAPIHealth(apiName: string): Promise<boolean> {
    const api = ALL_APIS[apiName];
    if (!api || !api.enabled) return false;

    // Cache health check results for 5 minutes
    const lastCheck = this.lastHealthCheck.get(apiName) || 0;
    const now = Date.now();
    if (now - lastCheck < 300000) {
      // 5 minutes
      return this.healthCheckResults.get(apiName) || false;
    }

    try {
      if (!api.healthCheck) return true; // Assume healthy if no health check endpoint

      // Build headers based on API type
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add proper authentication headers based on API name and type
      if (apiName === "supabase") {
        // Supabase requires 'apikey' header with the anon key
        const supabaseKey = getEnvVar("VITE_SUPABASE_ANON_KEY");
        if (supabaseKey) {
          headers["apikey"] = supabaseKey;
          headers["Authorization"] = `Bearer ${supabaseKey}`;
        }
      } else if (api.authentication === "apiKey") {
        headers["X-API-Key"] = "health-check";
      }

      const response = await fetch(`${api.baseUrl}${api.healthCheck}`, {
        method: "GET",
        headers,
      });

      const isHealthy = response.ok;
      this.healthCheckResults.set(apiName, isHealthy);
      this.lastHealthCheck.set(apiName, now);

      return isHealthy;
    } catch (error) {
      console.warn(`Health check failed for ${api.name}:`, error);
      this.healthCheckResults.set(apiName, false);
      this.lastHealthCheck.set(apiName, now);
      return false;
    }
  }

  /**
   * Get API configuration summary
   */
  getConfigurationSummary() {
    const enabled = this.getEnabledAPIs();
    const byCategory = enabled.reduce(
      (acc, api) => {
        acc[api.category] = (acc[api.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byPriority = enabled.reduce(
      (acc, api) => {
        acc[api.priority] = (acc[api.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: enabled.length,
      categories: byCategory,
      priorities: byPriority,
      critical: this.getCriticalAPIs().length,
      regions: [...new Set(enabled.map((api) => api.region).filter(Boolean))],
    };
  }

  /**
   * Initialize all APIs
   */
  async initializeAPIs(): Promise<void> {
    try {
      console.log("🚀 Initializing Savanna Marketplace API Integrations...");

      const summary = this.getConfigurationSummary();
      console.log("📊 API Configuration Summary:", summary);

      // Check critical APIs first
      const criticalAPIs = this.getCriticalAPIs();
      console.log(`🔥 Checking ${criticalAPIs.length} critical APIs...`);

      for (const api of criticalAPIs) {
        const isHealthy = await this.checkAPIHealth(
          Object.keys(ALL_APIS).find((key) => ALL_APIS[key] === api) || "",
        );

        if (isHealthy) {
          console.log(`✅ ${api.name} - Healthy`);
        } else {
          console.warn(`⚠️ ${api.name} - Health check failed`);
        }
      }

      console.log("🦁 Savanna Marketplace API initialization complete!");
    } catch (error) {
      console.error("Failed to initialize APIs:", error);
    }
  }
}

// Safe initialization - disabled by default to prevent immediate health check errors
// APIs will be initialized manually when needed
// if (typeof window !== 'undefined') {
//   try {
//     APIManager.getInstance().initializeAPIs().catch(console.error);
//   } catch (error) {
//     console.error('Failed to auto-initialize APIs:', error);
//   }
// }

export default APIManager;
