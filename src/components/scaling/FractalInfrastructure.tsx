import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cpu,
  Zap,
  Wifi,
  Package,
  MapPin,
  Activity,
  Printer,
  Satellite,
  Hexagon,
  Route,
  Timer,
  TrendingUp,
} from "lucide-react";

interface MicroHub {
  id: string;
  location: string;
  coordinates: [number, number];
  solarCharge: number;
  starlinkConnection: boolean;
  unitsManufactured: number;
  activeOrders: number;
  swarmLevel: number;
  status: "active" | "replicating" | "offline";
}

interface SwarmRoute {
  id: string;
  weight: string;
  method: "boda" | "matatu";
  pheromoneStrength: number;
  efficiency: number;
  activeCarriers: number;
  estimatedTime: number;
}

interface MigrationCorridor {
  id: string;
  species: string;
  season: string;
  hubsDeployed: number;
  coverage: number;
  uptime: number;
}

export const FractalInfrastructure = () => {
  const [activeTab, setActiveTab] = useState("microhubs");
  const [totalHubs, setTotalHubs] = useState(127);
  const [networkUptime, setNetworkUptime] = useState(94.7);

  // Mock data
  const microHubs: MicroHub[] = [
    {
      id: "TERM_001_NAKURU",
      location: "Nakuru Wildlife Corridor",
      coordinates: [-0.3031, 36.08],
      solarCharge: 87,
      starlinkConnection: true,
      unitsManufactured: 3,
      activeOrders: 12,
      swarmLevel: 4,
      status: "active",
    },
    {
      id: "TERM_002_MAASAI",
      location: "Maasai Mara Northern Gate",
      coordinates: [-1.4061, 35.0058],
      solarCharge: 92,
      starlinkConnection: true,
      unitsManufactured: 2,
      activeOrders: 8,
      swarmLevel: 3,
      status: "replicating",
    },
    {
      id: "TERM_003_AMBOSELI",
      location: "Amboseli Water Point",
      coordinates: [-2.6424, 37.2606],
      solarCharge: 45,
      starlinkConnection: false,
      unitsManufactured: 0,
      activeOrders: 0,
      swarmLevel: 1,
      status: "offline",
    },
  ];

  const swarmRoutes: SwarmRoute[] = [
    {
      id: "SWARM_NAIROBI_NAKURU",
      weight: "< 5kg",
      method: "boda",
      pheromoneStrength: 89,
      efficiency: 94,
      activeCarriers: 23,
      estimatedTime: 45,
    },
    {
      id: "SWARM_MOMBASA_BULK",
      weight: "> 5kg",
      method: "matatu",
      pheromoneStrength: 76,
      efficiency: 87,
      activeCarriers: 8,
      estimatedTime: 120,
    },
    {
      id: "SWARM_EMERGENCY_MARA",
      weight: "< 2kg",
      method: "boda",
      pheromoneStrength: 95,
      efficiency: 98,
      activeCarriers: 5,
      estimatedTime: 30,
    },
  ];

  const migrationCorridors: MigrationCorridor[] = [
    {
      id: "CORRIDOR_WILDEBEEST_SERENGETI",
      species: "Wildebeest",
      season: "Great Migration",
      hubsDeployed: 24,
      coverage: 78,
      uptime: 96.2,
    },
    {
      id: "CORRIDOR_ELEPHANT_AMBOSELI",
      species: "Elephant",
      season: "Dry Season",
      hubsDeployed: 12,
      coverage: 65,
      uptime: 89.4,
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTotalHubs((prev) => prev + Math.floor(Math.random() * 2));
      setNetworkUptime((prev) => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(90, Math.min(99, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "replicating":
        return "bg-blue-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "boda":
        return "🏍️";
      case "matatu":
        return "🚐";
      default:
        return "📦";
    }
  };

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case "Wildebeest":
        return "🦌";
      case "Elephant":
        return "🐘";
      default:
        return "🦓";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          Fractal Infrastructure Design
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Self-replicating "Termite Mound" servers following migration
          corridors, with bee colony-inspired swarm intelligence routing
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-purple-500" />
              Total Microhubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHubs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Self-replicating network nodes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Network Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkUptime.toFixed(1)}%
            </div>
            <Progress value={networkUptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Distributed resilience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              Active Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{swarmRoutes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Swarm intelligence paths
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="microhubs" className="flex items-center gap-2">
            <Hexagon className="h-4 w-4" />
            Termite Mounds
          </TabsTrigger>
          <TabsTrigger value="swarm" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Swarm Routes
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Migration Corridors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="microhubs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hexagon className="h-5 w-5 text-purple-500" />
                Solar-Powered Termite Mound Servers
              </CardTitle>
              <CardDescription>
                Self-replicating units with Raspberry Pi clusters, Starlink
                terminals, and 3D printing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {microHubs.map((hub) => (
                <div key={hub.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(hub.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">{hub.location}</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {hub.id}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        hub.status === "active" ? "default" : "secondary"
                      }
                    >
                      {hub.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{hub.solarCharge}%</div>
                        <div className="text-muted-foreground">
                          Solar Charge
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {hub.starlinkConnection ? "Connected" : "Offline"}
                        </div>
                        <div className="text-muted-foreground">Starlink</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">
                          {hub.unitsManufactured}
                        </div>
                        <div className="text-muted-foreground">Units Made</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">{hub.activeOrders}</div>
                        <div className="text-muted-foreground">
                          Active Orders
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-sm font-medium text-purple-700 mb-1">
                      Swarm Level {hub.swarmLevel}
                    </div>
                    <Progress value={hub.swarmLevel * 20} className="h-2" />
                    <p className="text-xs text-purple-600 mt-1">
                      Replication capacity and network influence
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      View Location
                    </Button>
                    <Button size="sm" variant="outline">
                      <Cpu className="h-3 w-3 mr-1" />
                      System Status
                    </Button>
                    {hub.status === "active" && (
                      <Button size="sm" variant="outline">
                        <Printer className="h-3 w-3 mr-1" />
                        Start Replication
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swarm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-500" />
                Bee Colony Swarm Intelligence
              </CardTitle>
              <CardDescription>
                Adaptive logistics routing inspired by bee pheromone algorithms
                for optimal delivery paths
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Algorithm Logic
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      Weight &lt; 5kg
                    </Badge>
                    <span>→ Boda Swarm (motorcycles)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700">
                      Weight &gt; 5kg
                    </Badge>
                    <span>→ Matatu Hive (shared vehicles)</span>
                  </div>
                  <div className="text-muted-foreground">
                    Routes optimized via digital pheromone trails
                  </div>
                </div>
              </div>

              {swarmRoutes.map((route) => (
                <div key={route.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getMethodIcon(route.method)}
                      </span>
                      <div>
                        <h4 className="font-medium">
                          {route.id.replace(/_/g, " ")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Weight: {route.weight}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        route.method === "boda"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    >
                      {route.method}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-purple-600">
                        {route.pheromoneStrength}%
                      </div>
                      <div className="text-muted-foreground">
                        Pheromone Strength
                      </div>
                      <Progress
                        value={route.pheromoneStrength}
                        className="h-1 mt-1"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {route.efficiency}%
                      </div>
                      <div className="text-muted-foreground">
                        Route Efficiency
                      </div>
                      <Progress value={route.efficiency} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {route.activeCarriers}
                      </div>
                      <div className="text-muted-foreground">
                        Active Carriers
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">
                        {route.estimatedTime}min
                      </div>
                      <div className="text-muted-foreground">Est. Delivery</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Optimize Route
                    </Button>
                    <Button size="sm" variant="outline">
                      <Timer className="h-3 w-3 mr-1" />
                      Track Orders
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Wildlife Migration Corridors
              </CardTitle>
              <CardDescription>
                Strategic deployment following wildebeest migration patterns for
                maximum ecosystem integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {migrationCorridors.map((corridor) => (
                <div
                  key={corridor.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getSpeciesIcon(corridor.species)}
                      </span>
                      <div>
                        <h4 className="font-medium">
                          {corridor.species} Migration
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {corridor.season}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {corridor.hubsDeployed} hubs
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600">
                        {corridor.coverage}%
                      </div>
                      <div className="text-muted-foreground">Coverage</div>
                      <Progress
                        value={corridor.coverage}
                        className="h-1 mt-1"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {corridor.uptime}%
                      </div>
                      <div className="text-muted-foreground">Uptime</div>
                      <Progress value={corridor.uptime} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">
                        {corridor.hubsDeployed}
                      </div>
                      <div className="text-muted-foreground">Active Hubs</div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded p-3 text-sm">
                    <div className="font-medium text-green-700 mb-1">
                      Migration Pattern
                    </div>
                    <div className="text-muted-foreground">
                      Hubs automatically deploy along seasonal{" "}
                      {corridor.species.toLowerCase()} routes, ensuring network
                      expansion follows natural ecosystem flows.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      View Corridor
                    </Button>
                    <Button size="sm" variant="outline">
                      <Hexagon className="h-3 w-3 mr-1" />
                      Deploy Hub
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
