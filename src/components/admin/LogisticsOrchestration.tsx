import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  MapPin,
  Clock,
  Star,
  AlertTriangle,
  TrendingUp,
  Users,
  Fuel,
  Route,
  Award,
  Zap,
  Settings,
  Navigation,
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  speed: number; // cheetah score
  care: number; // elephant score
  reliability: number; // rhino score
  deliveries: number;
  earnings: number;
  status: "active" | "offline" | "break";
  currentLocation: string;
  eta?: string;
}

interface DeliveryRoute {
  id: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  status: "planned" | "in-transit" | "delivered" | "delayed";
  weather: "sunny" | "rainy" | "cloudy";
  traffic: "light" | "moderate" | "heavy";
  cargo: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface RegionMetrics {
  region: string;
  activeDrivers: number;
  pendingDeliveries: number;
  avgDeliveryTime: number;
  fuelCostIndex: number;
  weatherStatus: string;
  demandLevel: number;
}

const LogisticsOrchestration = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [liveUpdates, setLiveUpdates] = useState(true);

  const drivers: Driver[] = [
    {
      id: "1",
      name: "James Mwangi",
      vehicle: "Isuzu Truck - KCA 123X",
      rating: 4.8,
      speed: 9.2, // cheetah
      care: 8.7, // elephant
      reliability: 9.5, // rhino
      deliveries: 234,
      earnings: 89000,
      status: "active",
      currentLocation: "Nairobi CBD",
      eta: "45 mins",
    },
    {
      id: "2",
      name: "Grace Wanjiku",
      vehicle: "Mitsubishi Canter - KCB 456Y",
      rating: 4.6,
      speed: 8.9,
      care: 9.1,
      reliability: 8.8,
      deliveries: 187,
      earnings: 67000,
      status: "active",
      currentLocation: "Nakuru Town",
      eta: "1hr 20mins",
    },
    {
      id: "3",
      name: "Peter Otieno",
      vehicle: "Toyota Hiace - KCC 789Z",
      rating: 4.9,
      speed: 8.5,
      care: 9.3,
      reliability: 9.8,
      deliveries: 298,
      earnings: 112000,
      status: "offline",
      currentLocation: "Kisumu Central",
    },
  ];

  const deliveryRoutes: DeliveryRoute[] = [
    {
      id: "1",
      driverId: "1",
      driverName: "James Mwangi",
      origin: "Nairobi Warehouse",
      destination: "Thika Market",
      distance: 45,
      estimatedTime: 90,
      status: "in-transit",
      weather: "sunny",
      traffic: "moderate",
      cargo: "Maize & Rice (2.5 tons)",
      priority: "high",
    },
    {
      id: "2",
      driverId: "2",
      driverName: "Grace Wanjiku",
      origin: "Nakuru Depot",
      destination: "Eldoret Hub",
      distance: 85,
      estimatedTime: 120,
      status: "planned",
      weather: "rainy",
      traffic: "light",
      cargo: "Dairy Products (1.8 tons)",
      priority: "urgent",
    },
    {
      id: "3",
      driverId: "1",
      driverName: "James Mwangi",
      origin: "Thika Market",
      destination: "Nairobi South",
      distance: 52,
      estimatedTime: 75,
      status: "planned",
      weather: "cloudy",
      traffic: "heavy",
      cargo: "Fresh Vegetables (800kg)",
      priority: "medium",
    },
  ];

  const regionMetrics: RegionMetrics[] = [
    {
      region: "Nairobi",
      activeDrivers: 45,
      pendingDeliveries: 123,
      avgDeliveryTime: 87,
      fuelCostIndex: 95,
      weatherStatus: "Clear ☀️",
      demandLevel: 89,
    },
    {
      region: "Mombasa",
      activeDrivers: 23,
      pendingDeliveries: 67,
      avgDeliveryTime: 105,
      fuelCostIndex: 102,
      weatherStatus: "Rain 🌧️",
      demandLevel: 76,
    },
    {
      region: "Kisumu",
      activeDrivers: 18,
      pendingDeliveries: 34,
      avgDeliveryTime: 95,
      fuelCostIndex: 88,
      weatherStatus: "Cloudy ☁️",
      demandLevel: 64,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-transit":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny":
        return "☀️";
      case "rainy":
        return "🌧️";
      case "cloudy":
        return "☁️";
      default:
        return "🌤️";
    }
  };

  const getTrafficIcon = (traffic: string) => {
    switch (traffic) {
      case "light":
        return "🟢";
      case "moderate":
        return "🟡";
      case "heavy":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const DriverCard = ({ driver }: { driver: Driver }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{driver.name}</h4>
            <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
            <p className="text-xs text-muted-foreground">
              {driver.currentLocation}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(driver.status)}>
              {driver.status}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{driver.rating}</span>
            </div>
          </div>
        </div>

        {/* Performance Scores */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">🐆 Speed</span>
            <span className="font-medium">{driver.speed}/10</span>
          </div>
          <Progress value={driver.speed * 10} className="h-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">🐘 Care</span>
            <span className="font-medium">{driver.care}/10</span>
          </div>
          <Progress value={driver.care * 10} className="h-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">🦏 Reliability</span>
            <span className="font-medium">{driver.reliability}/10</span>
          </div>
          <Progress value={driver.reliability * 10} className="h-1" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Deliveries:</span>
            <span className="font-medium ml-1">{driver.deliveries}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Earnings:</span>
            <span className="font-medium ml-1">
              KSH {driver.earnings.toLocaleString()}
            </span>
          </div>
        </div>

        {driver.eta && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Clock className="h-3 w-3" />
              <span>ETA: {driver.eta}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <MapPin className="h-3 w-3 mr-1" />
            Track
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Award className="h-3 w-3 mr-1" />
            Bonus
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RouteCard = ({ route }: { route: DeliveryRoute }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">Route #{route.id}</h4>
            <p className="text-sm text-muted-foreground">{route.driverName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(route.status)}>
              {route.status}
            </Badge>
            <Badge className={getPriorityColor(route.priority)}>
              {route.priority}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span>📍</span>
            <span>
              {route.origin} → {route.destination}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>📦</span>
            <span>{route.cargo}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Distance: {route.distance}km</span>
            <span>ETA: {route.estimatedTime}min</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Weather:</span>
            <span>{getWeatherIcon(route.weather)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Traffic:</span>
            <span>{getTrafficIcon(route.traffic)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Navigation className="h-3 w-3 mr-1" />
            Optimize
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Fuel className="h-3 w-3 mr-1" />
            Fuel Cost
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🦓 Migration Paths</h1>
          <p className="text-muted-foreground">
            Optimize delivery network efficiency across the savanna
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Fuel className="h-4 w-4 mr-2" />
            Fuel Calculator
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Partner Network
          </Button>
        </div>
      </div>

      {/* Live Herd Movement Map */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🗺️ Live Herd Movement Map - Safari Jeep Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🗺️</div>
              <p className="text-lg font-semibold">Kenya Logistics Network</p>
              <p className="text-sm text-muted-foreground">
                Real-time tracking with weather & traffic overlays
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {regionMetrics.map((region) => (
                <div key={region.region} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{region.region}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Drivers:</span>
                      <span className="font-medium">
                        {region.activeDrivers} 🚚
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium">
                        {region.pendingDeliveries}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Time:</span>
                      <span className="font-medium">
                        {region.avgDeliveryTime}min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather:</span>
                      <span>{region.weatherStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand:</span>
                      <span className="font-medium">{region.demandLevel}%</span>
                    </div>
                  </div>
                  <Progress value={region.demandLevel} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Growth Lever: Smart 3rd-party partnerships during rains
              </span>
            </div>
            <p className="text-sm text-green-700">
              AI automatically partners with additional logistics providers
              during heavy rain seasons to maintain delivery times.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="drivers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="drivers">🚚 Safari Drivers</TabsTrigger>
          <TabsTrigger value="routes">🛣️ Migration Routes</TabsTrigger>
          <TabsTrigger value="performance">📊 Herd Performance</TabsTrigger>
          <TabsTrigger value="optimization">⚡ Route Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="mt-6">
          <div className="space-y-6">
            {/* Driver Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Drivers
                      </p>
                      <p className="text-2xl font-bold">86</p>
                    </div>
                    <div className="text-2xl">🚚</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Rating
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">4.7</p>
                    </div>
                    <div className="text-2xl">⭐</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        On-Time Rate
                      </p>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Top Performers
                      </p>
                      <p className="text-2xl font-bold text-purple-600">12</p>
                    </div>
                    <div className="text-2xl">🏆</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Growth Lever: Incentivize top drivers with bonus tiers
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Cheetah-speed (🐆), Elephant-care (🐘), and Rhino-reliability
                (🦏) metrics unlock performance bonuses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="mt-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Route className="h-4 w-4 mr-2" />
                Optimize All Routes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliveryRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Performing Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers
                    .sort((a, b) => b.rating - a.rating)
                    .map((driver, index) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <div className="flex gap-1 text-xs">
                              <span>🐆{driver.speed}</span>
                              <span>🐘{driver.care}</span>
                              <span>🦏{driver.reliability}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{driver.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {driver.deliveries} deliveries
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Delivery Time</span>
                      <span className="text-green-600">-12% ↓</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Customer Satisfaction</span>
                      <span className="text-green-600">+8% ↑</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Fuel Efficiency</span>
                      <span className="text-green-600">+15% ↑</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Route Optimization</span>
                      <span className="text-green-600">+22% ↑</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚡ AI Route Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🧠</div>
                    <p className="font-semibold">Smart Routing Engine</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Routes Optimized Today:</span>
                      <span className="font-bold">247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Saved:</span>
                      <span className="font-bold text-green-600">
                        18.5 hours
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fuel Saved:</span>
                      <span className="font-bold text-green-600">1,240L</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Reduction:</span>
                      <span className="font-bold text-green-600">
                        KSH 89,400
                      </span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌧️ Weather Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌦️</div>
                    <p className="font-semibold">Real-time Weather Routing</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nairobi</span>
                      <span>☀️ Clear</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mombasa</span>
                      <span>🌧️ Heavy Rain</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nakuru</span>
                      <span>☁️ Cloudy</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-xs text-amber-800">
                      ⚠️ Heavy rains in Mombasa. Suggesting alternative routes
                      and 3rd-party partnerships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⛽ Fuel Cost Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⛽</div>
                    <p className="font-semibold">Dynamic Pricing</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Current Rate:</span>
                      <span className="font-bold">KSH 182/L</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Regional Variance:</span>
                      <span className="font-bold">±8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee Adjustment:</span>
                      <span className="font-bold text-green-600">-5%</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Fuel className="h-4 w-4 mr-2" />
                    Adjust Fees
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsOrchestration;
