/**
 * Service Mesh - "The Pipeline Network"
 * Manages 100+ microservices communication with 3G optimization
 * Auto-retries for unstable connections, Swahili error logs
 */

export interface ServiceNode {
  id: string;
  name: string;
  type: "supplier" | "retailer" | "logistics" | "payment" | "inventory";
  status: "healthy" | "degraded" | "unhealthy";
  location: string;
  county: string;
  lastHeartbeat: number;
  responseTime: number;
  connectionQuality: "5G" | "4G" | "3G" | "2G" | "Edge";
}

export interface ServiceCall {
  id: string;
  fromService: string;
  toService: string;
  endpoint: string;
  timestamp: number;
  duration: number;
  status: "success" | "retry" | "failed";
  retryAttempt: number;
  errorMessage?: string;
  swahiliError?: string;
}

export interface CircuitBreakerState {
  serviceId: string;
  state: "closed" | "open" | "half-open";
  failureCount: number;
  lastFailureTime: number;
  resetTimeout: number;
}

class ServiceMeshService {
  private services: Map<string, ServiceNode> = new Map();
  private serviceCalls: ServiceCall[] = [];
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private retryConfig = {
    maxAttempts: 3,
    perTryTimeout: 2000, // 2s timeout for Kenyan 3G
    retryOn: ["5xx", "reset", "connect-failure", "refused-stream"],
  };

  constructor() {
    this.initializeServices();
    this.startHealthChecks();
  }

  private initializeServices(): void {
    // Initialize core services with Kenyan locations
    const coreServices: Partial<ServiceNode>[] = [
      {
        id: "payment-nairobi",
        name: "M-Pesa Payment Service",
        type: "payment",
        location: "Nairobi",
        county: "nairobi",
        connectionQuality: "4G",
      },
      {
        id: "inventory-mombasa",
        name: "Coastal Inventory Hub",
        type: "inventory",
        location: "Mombasa",
        county: "mombasa",
        connectionQuality: "3G",
      },
      {
        id: "logistics-kisumu",
        name: "Western Logistics Network",
        type: "logistics",
        location: "Kisumu",
        county: "kisumu",
        connectionQuality: "3G",
      },
      {
        id: "supplier-nakuru",
        name: "Rift Valley Suppliers",
        type: "supplier",
        location: "Nakuru",
        county: "nakuru",
        connectionQuality: "4G",
      },
      {
        id: "retailer-eldoret",
        name: "North Rift Retailers",
        type: "retailer",
        location: "Eldoret",
        county: "eldoret",
        connectionQuality: "3G",
      },
    ];

    coreServices.forEach((service) => {
      const fullService: ServiceNode = {
        id: service.id!,
        name: service.name!,
        type: service.type!,
        status: "healthy",
        location: service.location!,
        county: service.county!,
        lastHeartbeat: Date.now(),
        responseTime: this.getExpectedResponseTime(service.connectionQuality!),
        connectionQuality: service.connectionQuality!,
      };

      this.services.set(service.id!, fullService);
      this.initializeCircuitBreaker(service.id!);
    });
  }

  private getExpectedResponseTime(connectionQuality: string): number {
    const baseTimes = {
      "5G": 50,
      "4G": 100,
      "3G": 200,
      "2G": 500,
      Edge: 1000,
    };
    return baseTimes[connectionQuality as keyof typeof baseTimes] || 200;
  }

  private initializeCircuitBreaker(serviceId: string): void {
    this.circuitBreakers.set(serviceId, {
      serviceId,
      state: "closed",
      failureCount: 0,
      lastFailureTime: 0,
      resetTimeout: 60000, // 1 minute
    });
  }

  async callService(
    fromServiceId: string,
    toServiceId: string,
    endpoint: string,
    payload?: any,
  ): Promise<any> {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Check circuit breaker
    const circuitBreaker = this.circuitBreakers.get(toServiceId);
    if (circuitBreaker?.state === "open") {
      if (
        Date.now() - circuitBreaker.lastFailureTime <
        circuitBreaker.resetTimeout
      ) {
        throw new Error(`Circuit breaker open for service: ${toServiceId}`);
      } else {
        // Transition to half-open
        circuitBreaker.state = "half-open";
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        console.log(
          `🦌 Service call attempt ${attempt}: ${fromServiceId} → ${toServiceId}`,
        );

        const result = await this.executeServiceCall(
          toServiceId,
          endpoint,
          payload,
          attempt,
        );

        // Record successful call
        this.recordServiceCall({
          id: callId,
          fromService: fromServiceId,
          toService: toServiceId,
          endpoint,
          timestamp: startTime,
          duration: Date.now() - startTime,
          status: "success",
          retryAttempt: attempt,
        });

        // Reset circuit breaker on success
        this.resetCircuitBreaker(toServiceId);

        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`🦏 Service call failed (attempt ${attempt}):`, error);

        // Update circuit breaker
        this.updateCircuitBreaker(toServiceId, false);

        if (attempt < this.retryConfig.maxAttempts) {
          // Wait before retry (exponential backoff optimized for 3G)
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    // All retries failed
    const swahiliError = this.translateErrorToSwahili(
      lastError?.message || "Service call failed",
    );

    this.recordServiceCall({
      id: callId,
      fromService: fromServiceId,
      toService: toServiceId,
      endpoint,
      timestamp: startTime,
      duration: Date.now() - startTime,
      status: "failed",
      retryAttempt: this.retryConfig.maxAttempts,
      errorMessage: lastError?.message,
      swahiliError,
    });

    throw new Error(swahiliError);
  }

  private async executeServiceCall(
    serviceId: string,
    endpoint: string,
    payload: any,
    attempt: number,
  ): Promise<any> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    // Simulate network latency based on connection quality and county
    const baseLatency = this.getExpectedResponseTime(service.connectionQuality);
    const jitter = Math.random() * 100; // Network jitter
    const totalLatency = baseLatency + jitter;

    // Simulate 3G packet loss (higher failure rate on retries)
    const packetLossRate = this.getPacketLossRate(
      service.connectionQuality,
      attempt,
    );
    if (Math.random() < packetLossRate) {
      throw new Error(
        `Network timeout - ${service.connectionQuality} connection unstable`,
      );
    }

    // Wait for simulated network delay
    await new Promise((resolve) => setTimeout(resolve, totalLatency));

    // Simulate service response based on type
    return this.generateServiceResponse(service, endpoint, payload);
  }

  private getPacketLossRate(
    connectionQuality: string,
    attempt: number,
  ): number {
    const baseLossRates = {
      "5G": 0.001,
      "4G": 0.01,
      "3G": 0.05,
      "2G": 0.15,
      Edge: 0.3,
    };

    const baseLoss =
      baseLossRates[connectionQuality as keyof typeof baseLossRates] || 0.05;

    // Increase failure rate on retries (network congestion)
    return Math.min(baseLoss * attempt, 0.5);
  }

  private generateServiceResponse(
    service: ServiceNode,
    endpoint: string,
    payload: any,
  ): any {
    // Generate realistic responses based on service type
    switch (service.type) {
      case "payment":
        return this.generatePaymentResponse(service, endpoint);
      case "inventory":
        return this.generateInventoryResponse(service, endpoint);
      case "logistics":
        return this.generateLogisticsResponse(service, endpoint);
      case "supplier":
        return this.generateSupplierResponse(service, endpoint);
      case "retailer":
        return this.generateRetailerResponse(service, endpoint);
      default:
        return { success: true, serviceId: service.id, timestamp: Date.now() };
    }
  }

  private generatePaymentResponse(service: ServiceNode, endpoint: string): any {
    if (endpoint.includes("mpesa")) {
      return {
        transactionId: `MP${Date.now()}`,
        status: "completed",
        amount: "KSH 2,500",
        phoneNumber: "254712345678",
        timestamp: new Date().toISOString(),
        location: service.location,
      };
    }
    return { paymentStatus: "processed", serviceLocation: service.location };
  }

  private generateInventoryResponse(
    service: ServiceNode,
    endpoint: string,
  ): any {
    const coastalProducts =
      service.county === "mombasa"
        ? { fish: 500, coconuts: 200, rice: 1000 }
        : { maizeFlour: 800, beans: 400, tea: 300 };

    return {
      inventory: coastalProducts,
      warehouse: service.location,
      lastUpdated: new Date().toISOString(),
      stockLevel: "normal",
    };
  }

  private generateLogisticsResponse(
    service: ServiceNode,
    endpoint: string,
  ): any {
    return {
      vehiclesAvailable: Math.floor(Math.random() * 20) + 5,
      estimatedDelivery: service.county === "nairobi" ? "2 hours" : "1 day",
      routes: [
        `${service.location} → Nairobi`,
        `${service.location} → Mombasa`,
      ],
      fuelEfficiency: "optimized",
    };
  }

  private generateSupplierResponse(
    service: ServiceNode,
    endpoint: string,
  ): any {
    return {
      farmingRegion: service.location,
      seasonalProducts: ["maize", "beans", "potatoes"],
      pricePerKg: { maize: 45, beans: 120, potatoes: 80 },
      harvestSeason: "ongoing",
    };
  }

  private generateRetailerResponse(
    service: ServiceNode,
    endpoint: string,
  ): any {
    return {
      shopLocation: service.location,
      dailyCustomers: Math.floor(Math.random() * 200) + 50,
      popularProducts: ["maize flour", "cooking oil", "sugar"],
      paymentMethods: ["mpesa", "cash", "credit"],
    };
  }

  private updateCircuitBreaker(serviceId: string, success: boolean): void {
    const breaker = this.circuitBreakers.get(serviceId);
    if (!breaker) return;

    if (success) {
      this.resetCircuitBreaker(serviceId);
    } else {
      breaker.failureCount++;
      breaker.lastFailureTime = Date.now();

      // Open circuit breaker after 5 failures
      if (breaker.failureCount >= 5) {
        breaker.state = "open";
        console.warn(`🚨 Circuit breaker opened for service: ${serviceId}`);
      }
    }
  }

  private resetCircuitBreaker(serviceId: string): void {
    const breaker = this.circuitBreakers.get(serviceId);
    if (breaker) {
      breaker.state = "closed";
      breaker.failureCount = 0;
      breaker.lastFailureTime = 0;
    }
  }

  private recordServiceCall(call: ServiceCall): void {
    this.serviceCalls.push(call);

    // Keep only last 5,000 calls for memory efficiency
    if (this.serviceCalls.length > 5000) {
      this.serviceCalls = this.serviceCalls.slice(-5000);
    }
  }

  private translateErrorToSwahili(errorMessage: string): string {
    const translations: Record<string, string> = {
      "Service not found": "Huduma haijapatikana",
      "Network timeout": "Muda wa mtandao umeisha",
      "Connection failed": "Muunganisho umeshindikana",
      "Circuit breaker open": "Huduma imepumzika kwa muda",
      "Service unavailable": "Huduma haipatikani kwa sasa",
    };

    for (const [english, swahili] of Object.entries(translations)) {
      if (errorMessage.includes(english)) {
        return swahili;
      }
    }

    return errorMessage;
  }

  private startHealthChecks(): void {
    setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  private performHealthChecks(): void {
    this.services.forEach((service, serviceId) => {
      const timeSinceLastHeartbeat = Date.now() - service.lastHeartbeat;

      if (timeSinceLastHeartbeat > 60000) {
        // 1 minute
        service.status = "unhealthy";
        console.warn(
          `🦏 Service unhealthy: ${serviceId} (no heartbeat for ${Math.round(timeSinceLastHeartbeat / 1000)}s)`,
        );
      } else if (timeSinceLastHeartbeat > 30000) {
        // 30 seconds
        service.status = "degraded";
      } else {
        service.status = "healthy";
        service.lastHeartbeat = Date.now();
      }
    });
  }

  // Public monitoring methods
  getServices(): ServiceNode[] {
    return Array.from(this.services.values());
  }

  getServiceCalls(): ServiceCall[] {
    return [...this.serviceCalls];
  }

  getCircuitBreakerStates(): CircuitBreakerState[] {
    return Array.from(this.circuitBreakers.values());
  }

  getServicesByCounty(): Record<string, ServiceNode[]> {
    const servicesByCounty: Record<string, ServiceNode[]> = {};

    this.services.forEach((service) => {
      if (!servicesByCounty[service.county]) {
        servicesByCounty[service.county] = [];
      }
      servicesByCounty[service.county].push(service);
    });

    return servicesByCounty;
  }

  getNetworkQualityReport(): Record<
    string,
    { services: number; avgResponseTime: number; connectionQuality: string }
  > {
    const report: Record<
      string,
      { services: number; totalResponseTime: number; connectionQuality: string }
    > = {};

    this.services.forEach((service) => {
      if (!report[service.county]) {
        report[service.county] = {
          services: 0,
          totalResponseTime: 0,
          connectionQuality: service.connectionQuality,
        };
      }

      report[service.county].services++;
      report[service.county].totalResponseTime += service.responseTime;
    });

    const finalReport: Record<
      string,
      { services: number; avgResponseTime: number; connectionQuality: string }
    > = {};
    Object.entries(report).forEach(([county, data]) => {
      finalReport[county] = {
        services: data.services,
        avgResponseTime: Math.round(data.totalResponseTime / data.services),
        connectionQuality: data.connectionQuality,
      };
    });

    return finalReport;
  }

  getMeshHealthStatus(): {
    status: "healthy" | "degraded" | "critical";
    details: string;
  } {
    const totalServices = this.services.size;
    const healthyServices = Array.from(this.services.values()).filter(
      (s) => s.status === "healthy",
    ).length;
    const unhealthyServices = Array.from(this.services.values()).filter(
      (s) => s.status === "unhealthy",
    ).length;

    const healthyPercentage = healthyServices / totalServices;

    if (healthyPercentage >= 0.9) {
      return {
        status: "healthy",
        details: `${healthyServices}/${totalServices} services healthy`,
      };
    } else if (healthyPercentage >= 0.7) {
      return {
        status: "degraded",
        details: `${unhealthyServices} services need attention`,
      };
    } else {
      return {
        status: "critical",
        details: `${unhealthyServices} services down - immediate action required`,
      };
    }
  }
}

export const serviceMeshService = new ServiceMeshService();
export default serviceMeshService;
