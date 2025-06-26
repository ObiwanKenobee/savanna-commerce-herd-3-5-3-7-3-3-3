/**
 * 🦌 Savanna Marketplace - Logistics Route Optimization
 * "Wildebeest Herding" algorithm for optimal delivery routes in Kenya
 */

export interface DeliveryOrder {
  id: string;
  customerId: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  timeWindow?: {
    start: Date;
    end: Date;
  };
  priority: "low" | "medium" | "high" | "cheetah"; // Cheetah = 1-hour delivery
  weight: number; // kg
  volume: number; // cubic meters
  specialRequirements?: string[];
  estimatedServiceTime: number; // minutes
}

export interface Vehicle {
  id: string;
  driverId: string;
  type: "boda" | "van" | "truck";
  capacity: {
    weight: number; // kg
    volume: number; // cubic meters
  };
  currentLocation: {
    lat: number;
    lng: number;
  };
  fuelEfficiency: number; // km per liter
  availability: {
    start: Date;
    end: Date;
  };
  specialCapabilities?: string[]; // e.g., refrigerated, fragile items
}

export interface RouteOptimizationResult {
  routes: OptimizedRoute[];
  totalDistance: number;
  totalTime: number; // minutes
  totalFuelCost: number;
  efficiency: {
    score: number; // 0-100
    wildlifeRating: string; // e.g., "Cheetah Efficiency"
  };
  savings: {
    distanceSaved: number;
    timeSaved: number;
    fuelSaved: number;
    co2Reduced: number; // kg
  };
  kenyaOptimizations: {
    trafficAvoidance: string[];
    weatherAdaptations: string[];
    securityRoutes: string[];
  };
}

export interface OptimizedRoute {
  vehicleId: string;
  driverId: string;
  orders: DeliveryOrder[];
  waypoints: {
    lat: number;
    lng: number;
    orderId?: string;
    estimatedArrival: Date;
    serviceTime: number;
  }[];
  totalDistance: number;
  estimatedDuration: number; // minutes
  fuelCost: number;
  wildlifeTheme: {
    icon: string;
    name: string;
    description: string;
  };
}

class LogisticsService {
  private nairoobiTrafficPatterns: Map<string, number> = new Map();
  private kenyaRoadConditions: Map<string, number> = new Map();
  private securityZones: Map<string, string> = new Map();
  private fuelPrices: Map<string, number> = new Map();

  // Kenya-specific route optimization factors
  private kenyaFactors = {
    trafficPeakHours: [7, 8, 9, 17, 18, 19], // Rush hours in Nairobi
    rainySeasonMonths: [3, 4, 5, 10, 11], // March-May, Oct-Nov
    insecureAreas: ["certain_industrial_areas", "late_night_routes"],
    bodaBodaLanes: ["traffic_jam_shortcuts", "narrow_streets"],
    majorHighways: ["thika_superhighway", "mombasa_road", "waiyaki_way"],
  };

  /**
   * 🦌 Main Wildebeest Herding optimization algorithm
   */
  public async optimizeRoutes(
    orders: DeliveryOrder[],
    vehicles: Vehicle[],
    options?: {
      includeTrafficData?: boolean;
      includeWeatherData?: boolean;
      prioritizeCheetahOrders?: boolean;
    },
  ): Promise<RouteOptimizationResult> {
    // 1. Cluster orders by proximity (Herd Formation)
    const clusters = this.clusterOrdersByProximity(orders);

    // 2. Assign vehicle types based on order requirements (Animal Selection)
    const vehicleAssignments = this.assignVehiclesByCapability(
      clusters,
      vehicles,
    );

    // 3. Solve Traveling Salesman Problem for each cluster (Migration Path)
    const optimizedRoutes: OptimizedRoute[] = [];

    for (const assignment of vehicleAssignments) {
      const route = await this.solveTSPWithKenyaFactors(
        assignment.orders,
        assignment.vehicle,
        options,
      );
      optimizedRoutes.push(route);
    }

    // 4. Calculate overall metrics
    const result = this.calculateRouteMetrics(optimizedRoutes, orders);

    // 5. Apply Kenya-specific optimizations
    result.kenyaOptimizations =
      await this.applyKenyaOptimizations(optimizedRoutes);

    return result;
  }

  /**
   * 🦌 Cluster orders by proximity (Wildebeest Herd Formation)
   */
  private clusterOrdersByProximity(orders: DeliveryOrder[]): DeliveryOrder[][] {
    const clusters: DeliveryOrder[][] = [];
    const maxClusterRadius = 5; // 5 km radius for clustering

    // Priority clustering: Cheetah orders get their own clusters
    const cheetahOrders = orders.filter(
      (order) => order.priority === "cheetah",
    );
    const regularOrders = orders.filter(
      (order) => order.priority !== "cheetah",
    );

    // Cheetah orders form individual herds (fast delivery)
    cheetahOrders.forEach((order) => {
      clusters.push([order]);
    });

    // Cluster regular orders using DBSCAN-like algorithm
    const processed = new Set<string>();

    regularOrders.forEach((order) => {
      if (processed.has(order.id)) return;

      const cluster = [order];
      processed.add(order.id);

      // Find nearby orders within cluster radius
      regularOrders.forEach((otherOrder) => {
        if (processed.has(otherOrder.id)) return;

        const distance = this.calculateDistance(
          order.location,
          otherOrder.location,
        );
        if (distance <= maxClusterRadius) {
          cluster.push(otherOrder);
          processed.add(otherOrder.id);
        }
      });

      clusters.push(cluster);
    });

    return clusters;
  }

  /**
   * 🐘 Assign vehicles by capability (Animal Selection)
   */
  private assignVehiclesByCapability(
    clusters: DeliveryOrder[][],
    vehicles: Vehicle[],
  ): { orders: DeliveryOrder[]; vehicle: Vehicle }[] {
    const assignments: { orders: DeliveryOrder[]; vehicle: Vehicle }[] = [];
    const availableVehicles = [...vehicles];

    // Sort clusters by priority (Cheetah first)
    clusters.sort((a, b) => {
      const aPriority = a.some((order) => order.priority === "cheetah")
        ? 4
        : a.some((order) => order.priority === "high")
          ? 3
          : a.some((order) => order.priority === "medium")
            ? 2
            : 1;
      const bPriority = b.some((order) => order.priority === "cheetah")
        ? 4
        : b.some((order) => order.priority === "high")
          ? 3
          : b.some((order) => order.priority === "medium")
            ? 2
            : 1;
      return bPriority - aPriority;
    });

    clusters.forEach((cluster) => {
      const totalWeight = cluster.reduce((sum, order) => sum + order.weight, 0);
      const totalVolume = cluster.reduce((sum, order) => sum + order.volume, 0);
      const hasCheetahOrder = cluster.some(
        (order) => order.priority === "cheetah",
      );

      // Select appropriate vehicle type
      let selectedVehicle: Vehicle | null = null;

      if (hasCheetahOrder || totalWeight <= 20) {
        // Use boda boda for cheetah deliveries or light loads
        selectedVehicle =
          availableVehicles.find(
            (v) =>
              v.type === "boda" &&
              v.capacity.weight >= totalWeight &&
              v.capacity.volume >= totalVolume,
          ) || null;
      }

      if (!selectedVehicle && totalWeight <= 500) {
        // Use van for medium loads
        selectedVehicle =
          availableVehicles.find(
            (v) =>
              v.type === "van" &&
              v.capacity.weight >= totalWeight &&
              v.capacity.volume >= totalVolume,
          ) || null;
      }

      if (!selectedVehicle) {
        // Use truck for heavy loads
        selectedVehicle =
          availableVehicles.find(
            (v) =>
              v.type === "truck" &&
              v.capacity.weight >= totalWeight &&
              v.capacity.volume >= totalVolume,
          ) || null;
      }

      if (selectedVehicle) {
        assignments.push({ orders: cluster, vehicle: selectedVehicle });
        // Remove assigned vehicle from available pool
        const index = availableVehicles.indexOf(selectedVehicle);
        if (index > -1) {
          availableVehicles.splice(index, 1);
        }
      }
    });

    return assignments;
  }

  /**
   * 🗺️ Solve TSP with Kenya-specific factors (Migration Path Planning)
   */
  private async solveTSPWithKenyaFactors(
    orders: DeliveryOrder[],
    vehicle: Vehicle,
    options?: any,
  ): Promise<OptimizedRoute> {
    // Create distance matrix with Kenya road conditions
    const matrix = await this.createKenyaDistanceMatrix(
      orders,
      vehicle,
      options,
    );

    // Apply TSP algorithm (using nearest neighbor with 2-opt improvement)
    const route = this.nearestNeighborTSP(
      matrix,
      orders,
      vehicle.currentLocation,
    );

    // Optimize for Kenya-specific factors
    const optimizedRoute = await this.applyKenyaRouteOptimizations(
      route,
      vehicle,
      options,
    );

    return optimizedRoute;
  }

  /**
   * 🌍 Create distance matrix considering Kenya road conditions
   */
  private async createKenyaDistanceMatrix(
    orders: DeliveryOrder[],
    vehicle: Vehicle,
    options?: any,
  ): Promise<number[][]> {
    const points = [
      vehicle.currentLocation,
      ...orders.map((order) => order.location),
    ];
    const matrix: number[][] = [];

    for (let i = 0; i < points.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < points.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          let distance = this.calculateDistance(points[i], points[j]);

          // Apply Kenya-specific adjustments
          distance = this.adjustForKenyaConditions(
            distance,
            points[i],
            points[j],
            vehicle,
            options,
          );

          matrix[i][j] = distance;
        }
      }
    }

    return matrix;
  }

  /**
   * 🇰🇪 Adjust distances for Kenya-specific conditions
   */
  private adjustForKenyaConditions(
    baseDistance: number,
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    vehicle: Vehicle,
    options?: any,
  ): number {
    let adjustedDistance = baseDistance;

    // Traffic adjustments (Nairobi-specific)
    if (options?.includeTrafficData) {
      const currentHour = new Date().getHours();
      if (this.kenyaFactors.trafficPeakHours.includes(currentHour)) {
        // Major highways get more congested
        if (this.isOnMajorHighway(from, to)) {
          adjustedDistance *= 1.8; // 80% increase during peak hours
        } else {
          adjustedDistance *= 1.4; // 40% increase on other roads
        }
      }
    }

    // Weather adjustments
    if (options?.includeWeatherData) {
      const currentMonth = new Date().getMonth() + 1;
      if (this.kenyaFactors.rainySeasonMonths.includes(currentMonth)) {
        adjustedDistance *= 1.3; // 30% increase during rainy season
      }
    }

    // Vehicle-specific adjustments
    if (vehicle.type === "boda") {
      // Boda bodas can use shortcuts but are slower on highways
      if (this.isOnMajorHighway(from, to)) {
        adjustedDistance *= 1.2; // Slower on highways
      } else {
        adjustedDistance *= 0.8; // Faster on local roads (shortcuts)
      }
    }

    // Security adjustments (avoid risky areas at night)
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour <= 6) {
      if (this.isInInsecureArea(from, to)) {
        adjustedDistance *= 1.5; // Take longer, safer routes at night
      }
    }

    return adjustedDistance;
  }

  /**
   * 🔍 Nearest Neighbor TSP with 2-opt improvement
   */
  private nearestNeighborTSP(
    matrix: number[][],
    orders: DeliveryOrder[],
    startLocation: { lat: number; lng: number },
  ): DeliveryOrder[] {
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    const route: number[] = [0]; // Start from depot (index 0)
    visited[0] = true;

    let current = 0;

    // Build initial route using nearest neighbor
    while (route.length < n) {
      let nearest = -1;
      let shortestDistance = Infinity;

      for (let i = 1; i < n; i++) {
        if (!visited[i] && matrix[current][i] < shortestDistance) {
          shortestDistance = matrix[current][i];
          nearest = i;
        }
      }

      if (nearest !== -1) {
        route.push(nearest);
        visited[nearest] = true;
        current = nearest;
      } else {
        break;
      }
    }

    // Apply 2-opt improvement
    const improvedRoute = this.twoOptImprovement(route, matrix);

    // Convert indices back to orders (excluding depot)
    return improvedRoute.slice(1).map((index) => orders[index - 1]);
  }

  /**
   * 🔄 2-opt improvement algorithm
   */
  private twoOptImprovement(route: number[], matrix: number[][]): number[] {
    let improved = true;
    let bestRoute = [...route];

    while (improved) {
      improved = false;

      for (let i = 1; i < route.length - 2; i++) {
        for (let j = i + 1; j < route.length; j++) {
          if (j - i === 1) continue;

          const newRoute = this.twoOptSwap(bestRoute, i, j);

          if (
            this.calculateRouteDistance(newRoute, matrix) <
            this.calculateRouteDistance(bestRoute, matrix)
          ) {
            bestRoute = newRoute;
            improved = true;
          }
        }
      }
    }

    return bestRoute;
  }

  /**
   * 🔀 2-opt swap operation
   */
  private twoOptSwap(route: number[], i: number, j: number): number[] {
    const newRoute = [...route];
    const section = newRoute.slice(i, j + 1).reverse();
    newRoute.splice(i, j - i + 1, ...section);
    return newRoute;
  }

  /**
   * 📏 Calculate total route distance
   */
  private calculateRouteDistance(route: number[], matrix: number[][]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += matrix[route[i]][route[i + 1]];
    }
    return totalDistance;
  }

  /**
   * 🇰🇪 Apply Kenya-specific route optimizations
   */
  private async applyKenyaRouteOptimizations(
    route: DeliveryOrder[],
    vehicle: Vehicle,
    options?: any,
  ): Promise<OptimizedRoute> {
    // Calculate waypoints with estimated arrival times
    const waypoints = await this.calculateWaypoints(route, vehicle);

    // Calculate route metrics
    const totalDistance = this.calculateTotalDistance(waypoints);
    const estimatedDuration = this.calculateEstimatedDuration(
      waypoints,
      vehicle,
    );
    const fuelCost = this.calculateFuelCost(totalDistance, vehicle);

    // Assign wildlife theme based on route characteristics
    const wildlifeTheme = this.assignWildlifeTheme(
      route,
      vehicle,
      totalDistance,
    );

    return {
      vehicleId: vehicle.id,
      driverId: vehicle.driverId,
      orders: route,
      waypoints,
      totalDistance,
      estimatedDuration,
      fuelCost,
      wildlifeTheme,
    };
  }

  /**
   * 🗺️ Calculate waypoints with estimated arrival times
   */
  private async calculateWaypoints(
    route: DeliveryOrder[],
    vehicle: Vehicle,
  ): Promise<any[]> {
    const waypoints = [];
    let currentTime = new Date();
    let currentLocation = vehicle.currentLocation;

    // Start point
    waypoints.push({
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      estimatedArrival: currentTime,
      serviceTime: 0,
    });

    // Order stops
    for (const order of route) {
      const distance = this.calculateDistance(currentLocation, order.location);
      const travelTime = this.estimateTravelTime(distance, vehicle);

      currentTime = new Date(currentTime.getTime() + travelTime * 60 * 1000);

      waypoints.push({
        lat: order.location.lat,
        lng: order.location.lng,
        orderId: order.id,
        estimatedArrival: currentTime,
        serviceTime: order.estimatedServiceTime,
      });

      // Add service time
      currentTime = new Date(
        currentTime.getTime() + order.estimatedServiceTime * 60 * 1000,
      );
      currentLocation = order.location;
    }

    return waypoints;
  }

  /**
   * 🦁 Assign wildlife theme based on route characteristics
   */
  private assignWildlifeTheme(
    route: DeliveryOrder[],
    vehicle: Vehicle,
    distance: number,
  ): any {
    const hasCheetahOrder = route.some((order) => order.priority === "cheetah");

    if (hasCheetahOrder) {
      return {
        icon: "🐆",
        name: "Cheetah Sprint",
        description: "Lightning-fast delivery route optimized for speed",
      };
    }

    if (vehicle.type === "boda") {
      return {
        icon: "🦌",
        name: "Gazelle Agility",
        description: "Quick and nimble route through city streets",
      };
    }

    if (route.length > 10) {
      return {
        icon: "🦌",
        name: "Wildebeest Migration",
        description: "Efficient bulk delivery covering many stops",
      };
    }

    if (distance > 50) {
      return {
        icon: "🐘",
        name: "Elephant Journey",
        description: "Long-distance route with careful planning",
      };
    }

    return {
      icon: "🦁",
      name: "Lion Patrol",
      description: "Standard delivery route with optimal efficiency",
    };
  }

  /**
   * Utility methods
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

  private estimateTravelTime(distance: number, vehicle: Vehicle): number {
    const baseSpeed =
      vehicle.type === "boda" ? 25 : vehicle.type === "van" ? 35 : 45; // km/h
    return (distance / baseSpeed) * 60; // minutes
  }

  private calculateTotalDistance(waypoints: any[]): number {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += this.calculateDistance(waypoints[i], waypoints[i + 1]);
    }
    return total;
  }

  private calculateEstimatedDuration(
    waypoints: any[],
    vehicle: Vehicle,
  ): number {
    let totalTime = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const distance = this.calculateDistance(waypoints[i], waypoints[i + 1]);
      totalTime += this.estimateTravelTime(distance, vehicle);
      if (waypoints[i + 1].serviceTime) {
        totalTime += waypoints[i + 1].serviceTime;
      }
    }

    return totalTime;
  }

  private calculateFuelCost(distance: number, vehicle: Vehicle): number {
    const fuelPrice = 180; // KES per liter (current Kenya average)
    const fuelNeeded = distance / vehicle.fuelEfficiency;
    return fuelNeeded * fuelPrice;
  }

  private isOnMajorHighway(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
  ): boolean {
    // Simplified check - in production, use actual road data
    return (
      Math.abs(from.lat - to.lat) > 0.05 || Math.abs(from.lng - to.lng) > 0.05
    );
  }

  private isInInsecureArea(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
  ): boolean {
    // Simplified check - in production, use security data
    return false; // Placeholder
  }

  private calculateRouteMetrics(
    routes: OptimizedRoute[],
    originalOrders: DeliveryOrder[],
  ): RouteOptimizationResult {
    const totalDistance = routes.reduce(
      (sum, route) => sum + route.totalDistance,
      0,
    );
    const totalTime = routes.reduce(
      (sum, route) => sum + route.estimatedDuration,
      0,
    );
    const totalFuelCost = routes.reduce(
      (sum, route) => sum + route.fuelCost,
      0,
    );

    // Calculate efficiency score (0-100)
    const averageOrdersPerRoute = originalOrders.length / routes.length;
    const efficiencyScore = Math.min(100, (averageOrdersPerRoute / 10) * 100);

    return {
      routes,
      totalDistance,
      totalTime,
      totalFuelCost,
      efficiency: {
        score: efficiencyScore,
        wildlifeRating:
          efficiencyScore > 80
            ? "Cheetah Efficiency"
            : efficiencyScore > 60
              ? "Lion Pride"
              : efficiencyScore > 40
                ? "Elephant Wisdom"
                : "Gazelle Learning",
      },
      savings: {
        distanceSaved: totalDistance * 0.15, // Estimated 15% savings
        timeSaved: totalTime * 0.2, // Estimated 20% time savings
        fuelSaved: totalFuelCost * 0.15,
        co2Reduced: totalDistance * 2.3 * 0.15, // kg CO2 per km * distance * savings
      },
      kenyaOptimizations: {
        trafficAvoidance: [],
        weatherAdaptations: [],
        securityRoutes: [],
      },
    };
  }

  private async applyKenyaOptimizations(
    routes: OptimizedRoute[],
  ): Promise<any> {
    return {
      trafficAvoidance: [
        "Avoid Uhuru Highway during peak hours",
        "Use Outer Ring Road bypass",
      ],
      weatherAdaptations: [
        "Extended time buffers for rainy season",
        "Alternative routes for flood-prone areas",
      ],
      securityRoutes: [
        "Daytime delivery for industrial areas",
        "Escort service for high-value cargo",
      ],
    };
  }
}

export const logisticsService = new LogisticsService();
export default logisticsService;
