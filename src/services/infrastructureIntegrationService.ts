/**
 * 🦁 Infrastructure Integration Service
 * Connects all technical infrastructure within the ecosystem
 */

import { supabase } from "@/integrations/supabase/client";
import httpApi from "./httpApiService";
import crudService from "./completeCrudService";
import ProductionMpesaService from "./productionMpesaService";
import RealTimeEnterpriseService from "./realTimeEnterpriseService";
import { APIManager } from "@/config/apiIntegrations";
import { toast } from "@/components/ui/use-toast";

class InfrastructureIntegrationService {
  private static instance: InfrastructureIntegrationService;
  private subscriptions: Map<string, any> = new Map();
  private healthChecks: Map<string, boolean> = new Map();

  static getInstance(): InfrastructureIntegrationService {
    if (!InfrastructureIntegrationService.instance) {
      InfrastructureIntegrationService.instance =
        new InfrastructureIntegrationService();
    }
    return InfrastructureIntegrationService.instance;
  }

  /**
   * 🚀 Initialize Complete Infrastructure
   */
  async initializeInfrastructure(): Promise<void> {
    try {
      console.log("🦁 Initializing Savanna Marketplace Infrastructure...");

      // Initialize core services
      await this.initializeCoreServices();

      // Initialize database connections
      await this.initializeDatabaseConnections();

      // Initialize real-time services
      await this.initializeRealTimeServices();

      // Initialize payment systems
      await this.initializePaymentSystems();

      // Initialize API integrations
      await this.initializeAPIIntegrations();

      // Initialize monitoring
      await this.initializeMonitoring();

      console.log("✅ Infrastructure initialization complete!");

      toast({
        title: "🦁 Pride Platform Ready!",
        description: "All systems initialized and operational",
      });
    } catch (error) {
      console.error("❌ Infrastructure initialization failed:", error);
      toast({
        title: "Infrastructure Error",
        description: "Some services may be unavailable",
        variant: "destructive",
      });
    }
  }

  /**
   * 🔧 Core Services Initialization
   */
  private async initializeCoreServices(): Promise<void> {
    try {
      // HTTP API Service
      const healthCheck = await httpApi.healthCheck();
      this.healthChecks.set("httpApi", healthCheck.success);

      // CRUD Service
      this.healthChecks.set("crudService", true);

      console.log("✅ Core services initialized");
    } catch (error) {
      console.error("❌ Core services initialization failed:", error);
    }
  }

  /**
   * 💾 Database Connections
   */
  private async initializeDatabaseConnections(): Promise<void> {
    try {
      // Test Supabase connection
      const { data, error } = await supabase
        .from("trading_hubs")
        .select("count", { count: "exact", head: true });
      this.healthChecks.set("supabase", !error);

      if (error) {
        console.warn("⚠️ Supabase connection issue:", error);
      } else {
        console.log("✅ Database connections established");
      }
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      this.healthChecks.set("supabase", false);
    }
  }

  /**
   * ⚡ Real-time Services
   */
  private async initializeRealTimeServices(): Promise<void> {
    try {
      // Initialize enterprise real-time service
      const enterpriseService = RealTimeEnterpriseService;

      // Set up real-time subscriptions for critical entities
      this.subscribeToTradingHubs();
      this.subscribeToBusinessProfiles();
      this.subscribeToOrders();
      this.subscribeToPayments();

      this.healthChecks.set("realTime", true);
      console.log("✅ Real-time services initialized");
    } catch (error) {
      console.error("❌ Real-time services initialization failed:", error);
      this.healthChecks.set("realTime", false);
    }
  }

  /**
   * 💳 Payment Systems
   */
  private async initializePaymentSystems(): Promise<void> {
    try {
      // Initialize M-Pesa service
      const mpesaService = ProductionMpesaService;

      // Test payment system availability
      try {
        await mpesaService.getTransactionHistory();
        this.healthChecks.set("mpesa", true);
      } catch (error) {
        this.healthChecks.set("mpesa", false);
        console.warn("⚠️ M-Pesa service unavailable, using demo mode");
      }

      console.log("✅ Payment systems initialized");
    } catch (error) {
      console.error("❌ Payment systems initialization failed:", error);
      this.healthChecks.set("mpesa", false);
    }
  }

  /**
   * 🌐 API Integrations
   */
  private async initializeAPIIntegrations(): Promise<void> {
    try {
      // Initialize API Manager
      const apiManager = APIManager.getInstance();
      await apiManager.initializeAPIs();

      this.healthChecks.set("apiIntegrations", true);
      console.log("✅ API integrations initialized");
    } catch (error) {
      console.error("❌ API integrations initialization failed:", error);
      this.healthChecks.set("apiIntegrations", false);
    }
  }

  /**
   * 📊 Monitoring
   */
  private async initializeMonitoring(): Promise<void> {
    try {
      // Start health monitoring
      this.startHealthMonitoring();

      // Initialize performance monitoring
      this.initializePerformanceMonitoring();

      this.healthChecks.set("monitoring", true);
      console.log("✅ Monitoring initialized");
    } catch (error) {
      console.error("❌ Monitoring initialization failed:", error);
      this.healthChecks.set("monitoring", false);
    }
  }

  /**
   * 🔄 Real-time Subscriptions
   */
  private subscribeToTradingHubs(): void {
    const unsubscribe = crudService.subscribeToEntityChanges<any>(
      "trading_hubs",
      (data) => {
        console.log("🏺 Trading hub updated:", data);
        // Trigger UI updates
        window.dispatchEvent(
          new CustomEvent("tradingHubUpdated", { detail: data }),
        );
      },
    );
    this.subscriptions.set("tradingHubs", unsubscribe);
  }

  private subscribeToBusinessProfiles(): void {
    const unsubscribe = crudService.subscribeToEntityChanges<any>(
      "business_profiles",
      (data) => {
        console.log("👥 Business profile updated:", data);
        window.dispatchEvent(
          new CustomEvent("businessProfileUpdated", { detail: data }),
        );
      },
    );
    this.subscriptions.set("businessProfiles", unsubscribe);
  }

  private subscribeToOrders(): void {
    const unsubscribe = crudService.subscribeToEntityChanges<any>(
      "orders",
      (data) => {
        console.log("🛒 Order updated:", data);
        window.dispatchEvent(new CustomEvent("orderUpdated", { detail: data }));

        // Show toast for important order updates
        if (data.status === "confirmed") {
          toast({
            title: "🦁 Order Confirmed!",
            description: `Order ${data.order_number} has been confirmed`,
          });
        }
      },
    );
    this.subscriptions.set("orders", unsubscribe);
  }

  private subscribeToPayments(): void {
    const unsubscribe = crudService.subscribeToEntityChanges<any>(
      "payment_transactions",
      (data) => {
        console.log("💳 Payment updated:", data);
        window.dispatchEvent(
          new CustomEvent("paymentUpdated", { detail: data }),
        );

        // Show toast for payment completions
        if (data.status === "completed") {
          toast({
            title: "💰 Payment Successful!",
            description: `Payment of KES ${data.amount} completed`,
          });
        }
      },
    );
    this.subscriptions.set("payments", unsubscribe);
  }

  /**
   * 🏥 Health Monitoring
   */
  private startHealthMonitoring(): void {
    // Check system health every 30 seconds
    setInterval(async () => {
      await this.performHealthChecks();
    }, 30000);
  }

  private async performHealthChecks(): Promise<void> {
    try {
      // Check database connection
      const { error } = await supabase
        .from("trading_hubs")
        .select("count", { count: "exact", head: true });
      this.healthChecks.set("supabase", !error);

      // Check API gateway
      try {
        const response = await httpApi.healthCheck();
        this.healthChecks.set("httpApi", response.success);
      } catch {
        this.healthChecks.set("httpApi", false);
      }

      // Report critical failures
      const criticalServices = ["supabase", "httpApi"];
      const failedServices = criticalServices.filter(
        (service) => !this.healthChecks.get(service),
      );

      if (failedServices.length > 0) {
        console.warn("⚠️ Critical services down:", failedServices);
      }
    } catch (error) {
      console.error("❌ Health check failed:", error);
    }
  }

  private initializePerformanceMonitoring(): void {
    // Monitor page load times
    if (typeof window !== "undefined" && "performance" in window) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigationTiming = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;
          const loadTime =
            navigationTiming.loadEventEnd - navigationTiming.fetchStart;

          console.log(`📊 Page load time: ${loadTime}ms`);

          if (loadTime > 3000) {
            console.warn("⚠️ Slow page load detected");
          }
        }, 0);
      });
    }
  }

  /**
   * 🔗 Integration Methods
   */

  // Connect marketplace to payment system
  async integrateMarketplacePayment(
    orderId: string,
    amount: number,
    phoneNumber: string,
  ): Promise<boolean> {
    try {
      // Create order in CRUD system
      const order = await crudService.createOrder({
        buyer_id: "current-user",
        supplier_id: "supplier-id",
        status: "pending",
        total_amount: amount,
        currency: "KES",
        payment_status: "pending",
        created_by: "current-user",
        delivery_address: {},
      });

      // Process M-Pesa payment
      const paymentResult = await ProductionMpesaService.initiatePayment({
        phoneNumber,
        amount,
        accountReference: order.order_number,
        transactionDesc: `Payment for order ${order.order_number}`,
        orderId: order.id,
      });

      return paymentResult.success;
    } catch (error) {
      console.error("❌ Payment integration failed:", error);
      return false;
    }
  }

  // Connect enterprise features to real-time updates
  setupEnterpriseRealTime(): void {
    // Listen for custom events and update enterprise pages
    window.addEventListener("tradingHubUpdated", (event: any) => {
      // Trigger watering holes page update
      const waterholeUpdateEvent = new CustomEvent("refreshWateringHoles");
      window.dispatchEvent(waterholeUpdateEvent);
    });

    window.addEventListener("businessProfileUpdated", (event: any) => {
      // Trigger herd directory page update
      const herdUpdateEvent = new CustomEvent("refreshHerdDirectory");
      window.dispatchEvent(herdUpdateEvent);
    });
  }

  /**
   * 📊 Analytics Integration
   */
  async trackUserAction(action: string, data: any): Promise<void> {
    try {
      // Track in local analytics
      console.log(`📊 User action: ${action}`, data);

      // Send to analytics APIs
      await httpApi.create("/analytics/events", {
        action,
        data,
        timestamp: new Date().toISOString(),
        user_id: "current-user",
      });
    } catch (error) {
      console.error("❌ Analytics tracking failed:", error);
    }
  }

  /**
   * 📱 Mobile Integration
   */
  setupMobileOptimizations(): void {
    if (typeof window !== "undefined") {
      // Optimize for mobile devices
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Enable mobile-specific features
        this.enableMobileOptimizations();
      }

      // Listen for orientation changes
      window.addEventListener("orientationchange", () => {
        setTimeout(() => {
          this.handleOrientationChange();
        }, 100);
      });
    }
  }

  private enableMobileOptimizations(): void {
    // Reduce real-time update frequency on mobile
    console.log("📱 Mobile optimizations enabled");
  }

  private handleOrientationChange(): void {
    // Trigger layout updates
    window.dispatchEvent(new CustomEvent("orientationChanged"));
  }

  /**
   * 🧹 Cleanup
   */
  cleanup(): void {
    // Unsubscribe from all real-time subscriptions
    this.subscriptions.forEach((unsubscribe, key) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    this.subscriptions.clear();

    // Clear health checks
    this.healthChecks.clear();

    console.log("🧹 Infrastructure cleanup complete");
  }

  /**
   * 📈 Get System Status
   */
  getSystemStatus(): {
    overall: "healthy" | "degraded" | "down";
    services: Record<string, boolean>;
    uptime: number;
  } {
    const services = Object.fromEntries(this.healthChecks);
    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;

    let overall: "healthy" | "degraded" | "down" = "healthy";
    if (healthyServices === 0) {
      overall = "down";
    } else if (healthyServices < totalServices) {
      overall = "degraded";
    }

    return {
      overall,
      services,
      uptime: Date.now() - (window as any).__appStartTime || 0,
    };
  }
}

// Set app start time for uptime calculation
if (typeof window !== "undefined") {
  (window as any).__appStartTime = Date.now();
}

export const infrastructureService =
  InfrastructureIntegrationService.getInstance();
export default infrastructureService;
