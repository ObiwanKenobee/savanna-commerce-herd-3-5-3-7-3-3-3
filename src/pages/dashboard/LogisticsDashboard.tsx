import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  MapPin,
  Clock,
  Star,
  Zap,
  Target,
  TrendingUp,
  Award,
  Navigation as NavigationIcon,
  Fuel,
  CloudRain,
  Sun,
  AlertTriangle,
  CheckCircle,
  Phone,
  MessageSquare,
  Route,
  Calendar,
  DollarSign,
  Trophy,
  Timer,
  Gauge,
  Activity,
  ThumbsUp,
  Shield,
  Users,
  Package,
} from "lucide-react";

interface DeliveryTask {
  id: string;
  type: "pickup" | "delivery";
  customer: string;
  location: string;
  distance: number;
  payment: number;
  urgency: "high" | "medium" | "low";
  estimatedTime: number;
  packageWeight: number;
  status: "available" | "assigned" | "in_progress" | "completed";
  weatherBonus: boolean;
  timeBonus: boolean;
}

interface DriverStats {
  totalEarnings: number;
  todayEarnings: number;
  dailyGoal: number;
  completedDeliveries: number;
  rating: number;
  onTimeRate: number;
  fuelEfficiency: number;
  rank: number;
  totalDrivers: number;
  badges: string[];
}

interface RouteOptimization {
  route: string;
  distance: number;
  estimatedTime: number;
  fuelCost: number;
  profit: number;
  weatherAlert?: string;
  trafficLevel: "low" | "medium" | "high";
}

const LogisticsDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState("Nairobi CBD");

  const [driverStats, setDriverStats] = useState<DriverStats>({
    totalEarnings: 45600,
    todayEarnings: 2400,
    dailyGoal: 3000,
    completedDeliveries: 8,
    rating: 4.7,
    onTimeRate: 94,
    fuelEfficiency: 15.2,
    rank: 23,
    totalDrivers: 487,
    badges: ["🦁", "⚡", "🎯"],
  });

  const [availableTasks, setAvailableTasks] = useState<DeliveryTask[]>([
    {
      id: "1",
      type: "delivery",
      customer: "Mama Jane's Kiosk",
      location: "Westlands, 2.3km",
      distance: 2.3,
      payment: 250,
      urgency: "high",
      estimatedTime: 25,
      packageWeight: 15,
      status: "available",
      weatherBonus: true,
      timeBonus: false,
    },
    {
      id: "2",
      type: "pickup",
      customer: "Bidco Warehouse",
      location: "Industrial Area, 4.1km",
      distance: 4.1,
      payment: 180,
      urgency: "medium",
      estimatedTime: 35,
      packageWeight: 25,
      status: "available",
      weatherBonus: false,
      timeBonus: true,
    },
    {
      id: "3",
      type: "delivery",
      customer: "Kisumu Supermart",
      location: "Kisumu, 8.7km",
      distance: 8.7,
      payment: 450,
      urgency: "low",
      estimatedTime: 45,
      packageWeight: 35,
      status: "available",
      weatherBonus: true,
      timeBonus: true,
    },
  ]);

  const [routeOptimization, setRouteOptimization] = useState<RouteOptimization>(
    {
      route: "Westlands → Industrial Area → Kisumu",
      distance: 15.1,
      estimatedTime: 105,
      fuelCost: 230,
      profit: 650,
      weatherAlert: "Rain expected after 3 PM - 2x bonus for completing early!",
      trafficLevel: "medium",
    },
  );

  const playSound = (type: "success" | "alert" | "notification") => {
    console.log(
      `🔊 ${type === "success" ? "🦁 Lion roar" : type === "alert" ? "⚠️ Alert" : "🐦 Bird chirp"}`,
    );
    if ("vibrate" in navigator) {
      navigator.vibrate(type === "success" ? [100, 50, 100] : [50]);
    }
  };

  const dailyProgress =
    (driverStats.todayEarnings / driverStats.dailyGoal) * 100;

  const renderSafariBoard = () => (
    <div className="space-y-6">
      {/* Gamified Header */}
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>🏆 Safari Quest Board</span>
          </CardTitle>
          <CardDescription>
            Complete deliveries to unlock achievements and climb the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {driverStats.completedDeliveries}
              </div>
              <div className="text-sm text-gray-600">Deliveries Today</div>
              <div className="text-xs text-green-500">Target: 10 for Gold</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {driverStats.rating}
              </div>
              <div className="text-sm text-gray-600">Driver Rating</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i <= driverStats.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                #{driverStats.rank}
              </div>
              <div className="text-sm text-gray-600">Rank This Week</div>
              <div className="text-xs text-purple-500">
                of {driverStats.totalDrivers} drivers
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">🏅 Safari Achievements</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {driverStats.badges.includes("🦁") ? (
                <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-2xl">🦁</div>
                  <div className="text-xs font-medium">Speed King</div>
                </div>
              ) : (
                <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                  <div className="text-2xl grayscale">🦁</div>
                  <div className="text-xs">Speed King</div>
                </div>
              )}

              {driverStats.badges.includes("⚡") ? (
                <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-2xl">⚡</div>
                  <div className="text-xs font-medium">Lightning</div>
                </div>
              ) : (
                <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                  <div className="text-2xl grayscale">⚡</div>
                  <div className="text-xs">Lightning</div>
                </div>
              )}

              {driverStats.badges.includes("🎯") ? (
                <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                  <div className="text-2xl">🎯</div>
                  <div className="text-xs font-medium">Precision</div>
                </div>
              ) : (
                <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                  <div className="text-2xl grayscale">🎯</div>
                  <div className="text-xs">Precision</div>
                </div>
              )}

              {/* Locked Achievements */}
              <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                <div className="text-2xl grayscale">🦏</div>
                <div className="text-xs">Tank</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                <div className="text-2xl grayscale">🐘</div>
                <div className="text-xs">Reliable</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded border opacity-50">
                <div className="text-2xl grayscale">👑</div>
                <div className="text-xs">King</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-green-600" />
            <span>📦 Available Safari Missions</span>
          </CardTitle>
          <CardDescription>
            Choose your next adventure - higher risk, higher reward!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableTasks.map((task) => (
              <Card
                key={task.id}
                className={`border-2 ${
                  task.urgency === "high"
                    ? "border-red-300 bg-red-50"
                    : task.urgency === "medium"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-green-300 bg-green-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          task.type === "pickup"
                            ? "bg-blue-100 border-blue-300"
                            : "bg-green-100 border-green-300"
                        }`}
                      >
                        {task.type === "pickup" ? (
                          <Package className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Truck className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{task.customer}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimatedTime}min
                          </span>
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {task.packageWeight}kg
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        KES {task.payment}
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <Badge
                          variant={
                            task.urgency === "high"
                              ? "destructive"
                              : task.urgency === "medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {task.urgency.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bonus Indicators */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.weatherBonus && (
                      <Badge className="bg-blue-500 text-white">
                        <CloudRain className="h-3 w-3 mr-1" />
                        2x Weather Bonus
                      </Badge>
                    )}
                    {task.timeBonus && (
                      <Badge className="bg-orange-500 text-white">
                        <Timer className="h-3 w-3 mr-1" />
                        Rush Hour Bonus
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setAvailableTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        );
                        setDriverStats((prev) => ({
                          ...prev,
                          completedDeliveries: prev.completedDeliveries + 1,
                        }));
                        playSound("success");
                        alert(
                          `🦁 Mission accepted! Navigate to ${task.customer}. Lion roars with approval!`,
                        );
                      }}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Accept Mission
                    </Button>
                    <Button size="sm" variant="outline">
                      <NavigationIcon className="h-4 w-4 mr-1" />
                      Preview Route
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Adjustments */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span>⚡ Real-Time Safari Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert className="border-blue-200 bg-blue-50">
              <CloudRain className="h-4 w-4" />
              <AlertDescription>
                🌧️ Rain Alert: Heavy rains expected from 3 PM. Complete
                deliveries early for 2x bonus pay!
              </AlertDescription>
            </Alert>

            <Alert className="border-yellow-200 bg-yellow-50">
              <Route className="h-4 w-4" />
              <AlertDescription>
                🚧 Route Update: Avoid Uhuru Highway - Use Ngong Road for 15%
                faster delivery + bonus points!
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                ⚡ Surge Alert: High demand in Westlands area - 1.5x pay
                multiplier for next 2 hours!
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHerdWealth = () => (
    <div className="space-y-6">
      {/* Animated Earnings Tracker */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <span>💰 Daily Wealth Progress</span>
          </CardTitle>
          <CardDescription>
            Your safari jeep is moving toward today's treasure goal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Safari Jeep Progress */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-2">
              <span>Today's Progress</span>
              <span className="font-medium">
                KES {driverStats.todayEarnings} / {driverStats.dailyGoal}
              </span>
            </div>
            <div className="relative w-full h-8 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-in-out"
                style={{ width: `${Math.min(100, dailyProgress)}%` }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-1000 ease-in-out"
                style={{ left: `${Math.min(95, Math.max(2, dailyProgress))}%` }}
              >
                🚙
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>KES 0</span>
              <span>Goal: KES {driverStats.dailyGoal}</span>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                KES {driverStats.todayEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Today's Earnings</div>
              <div className="text-xs text-green-500 mt-1">
                {Math.round(dailyProgress)}% of goal
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                KES{" "}
                {Math.round(
                  driverStats.todayEarnings /
                    Math.max(1, driverStats.completedDeliveries),
                )}
              </div>
              <div className="text-sm text-gray-600">Avg per Delivery</div>
              <div className="text-xs text-blue-500 mt-1">
                {driverStats.completedDeliveries} deliveries
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                KES{" "}
                {driverStats.dailyGoal - driverStats.todayEarnings > 0
                  ? driverStats.dailyGoal - driverStats.todayEarnings
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Still Needed</div>
              <div className="text-xs text-purple-500 mt-1">
                {Math.max(
                  0,
                  Math.ceil(
                    (driverStats.dailyGoal - driverStats.todayEarnings) / 250,
                  ),
                )}{" "}
                more deliveries
              </div>
            </div>
          </div>

          {/* Goal Achievement Alert */}
          {dailyProgress >= 100 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                🏆 Congratulations! You've reached your daily goal! Bonus
                missions now available with 25% extra pay!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Fuel Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fuel className="h-6 w-6 text-orange-600" />
            <span>⛽ Smart Fuel Tracker</span>
          </CardTitle>
          <CardDescription>
            Optimize your routes for maximum profit per liter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Route Analysis */}
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">
                📍 Recommended Route Analysis
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-medium">{routeOptimization.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Distance:</span>
                  <span className="font-medium">
                    {routeOptimization.distance}km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-medium">
                    {Math.floor(routeOptimization.estimatedTime / 60)}h{" "}
                    {routeOptimization.estimatedTime % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Cost:</span>
                  <span className="font-medium text-orange-600">
                    KES {routeOptimization.fuelCost}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Net Profit:</span>
                  <span className="font-bold text-green-600">
                    KES {routeOptimization.profit}
                  </span>
                </div>
              </div>
            </div>

            {/* Traffic and Weather Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity
                    className={`h-4 w-4 ${
                      routeOptimization.trafficLevel === "low"
                        ? "text-green-500"
                        : routeOptimization.trafficLevel === "medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  />
                  <span className="font-medium">Traffic Level</span>
                </div>
                <div
                  className={`text-sm ${
                    routeOptimization.trafficLevel === "low"
                      ? "text-green-600"
                      : routeOptimization.trafficLevel === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {routeOptimization.trafficLevel.toUpperCase()}
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Weather</span>
                </div>
                <div className="text-sm text-gray-600">Sunny, 26°C</div>
              </div>
            </div>

            {/* Weather Bonus Alert */}
            {routeOptimization.weatherAlert && (
              <Alert className="border-blue-200 bg-blue-50">
                <CloudRain className="h-4 w-4" />
                <AlertDescription>
                  {routeOptimization.weatherAlert}
                </AlertDescription>
              </Alert>
            )}

            {/* Fuel Efficiency Tips */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">
                🌿 Fuel Efficiency Tips
              </h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>
                  • Maintain steady speed between 40-60 km/h for optimal
                  efficiency
                </li>
                <li>
                  • Your current efficiency: {driverStats.fuelEfficiency} km/L
                  (Above average!)
                </li>
                <li>
                  • Plan multiple stops in same area to reduce total distance
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span>📊 Weekly Herd Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Weekly Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">94%</div>
                <div className="text-sm text-gray-600">On-Time Rate</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">47</div>
                <div className="text-sm text-gray-600">Deliveries</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">
                  KES 18.2K
                </div>
                <div className="text-sm text-gray-600">Weekly Earnings</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">4.7⭐</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Leaderboard Position */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">🏆 Weekly Leaderboard</h3>
                  <p className="text-sm text-gray-600">
                    You're #{driverStats.rank} out of {driverStats.totalDrivers}{" "}
                    drivers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl">🥉</div>
                  <div className="text-sm font-medium">Bronze Level</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Silver</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  Complete 3 more deliveries to reach Silver rank
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-orange-800">
                🚙 {profile?.full_name || "Safari Driver"} Command Center
              </h1>
              <p className="text-orange-600 mt-1">
                🦁 Navigate the savanna, earn your pride, build your wealth!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                <span
                  className={`text-sm font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}
                >
                  {isOnline ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>
              <Badge variant="default" className="bg-orange-600">
                📍 {currentLocation}
              </Badge>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="safari" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="safari"
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>🎯 Safari Board</span>
              </TabsTrigger>
              <TabsTrigger
                value="wealth"
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>💰 Herd Wealth</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="safari">{renderSafariBoard()}</TabsContent>

            <TabsContent value="wealth">{renderHerdWealth()}</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LogisticsDashboard;
