import React, { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { PridePointsWidget } from "@/components/wildlife/PridePoints";
import { SwahiliWisdom } from "@/components/wildlife/SwahiliWisdom";
import { useSavannahAudio } from "@/hooks/useSavannahAudio";
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
  Play,
  Pause,
  MoreHorizontal,
  Filter,
  Search,
  Map,
  Compass,
} from "lucide-react";

interface LogisticsMetrics {
  cheetahScore: number;
  pridePoints: number;
  deliverySpeed: number;
  onTimeRate: number;
  customerRating: number;
  totalDeliveries: number;
  dailyEarnings: number;
  fuelEfficiency: number;
  rank: string;
  tier: "Racing Cub" | "Swift Runner" | "Speed Demon" | "Cheetah Elite";
}

interface DeliveryTask {
  id: string;
  orderNumber: string;
  pickup: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "picked_up" | "in_transit" | "delivered";
  customer: string;
  value: number;
  timeWindow: string;
}

interface Route {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
  efficiency: number;
  traffic: "light" | "medium" | "heavy";
  deliveries: number;
  earnings: number;
}

const CheetahLogistics = () => {
  const { user, profile } = useAuth();
  const { playSuccessRoar, playClickSound } = useSavannahAudio();
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(false);

  const logisticsMetrics: LogisticsMetrics = {
    cheetahScore: 92,
    pridePoints: 1870,
    deliverySpeed: 89.5,
    onTimeRate: 96.8,
    customerRating: 4.8,
    totalDeliveries: 1247,
    dailyEarnings: 3200,
    fuelEfficiency: 87.3,
    rank: "#12",
    tier: "Speed Demon",
  };

  const todayTasks: DeliveryTask[] = [
    {
      id: "DEL001",
      orderNumber: "ORD-2024-001",
      pickup: "Fresh Produce Hub, Nairobi",
      destination: "Mama Jane's Shop, Kibera",
      distance: 12.5,
      estimatedTime: 35,
      priority: "high",
      status: "pending",
      customer: "Jane Wanjiku",
      value: 1250,
      timeWindow: "9:00 AM - 11:00 AM",
    },
    {
      id: "DEL002",
      orderNumber: "ORD-2024-002",
      pickup: "Tech Savanna Hub, Westlands",
      destination: "Electronics Store, Eastleigh",
      distance: 8.3,
      estimatedTime: 25,
      priority: "medium",
      status: "picked_up",
      customer: "Ahmed Hassan",
      value: 5600,
      timeWindow: "11:00 AM - 1:00 PM",
    },
    {
      id: "DEL003",
      orderNumber: "ORD-2024-003",
      pickup: "Fashion Plains, CBD",
      destination: "Boutique, Karen",
      distance: 15.2,
      estimatedTime: 45,
      priority: "urgent",
      status: "in_transit",
      customer: "Sarah Mitchell",
      value: 3200,
      timeWindow: "2:00 PM - 4:00 PM",
    },
  ];

  const optimizedRoutes: Route[] = [
    {
      id: "route-001",
      name: "Nairobi Central Circuit",
      distance: 45.2,
      estimatedTime: 120,
      efficiency: 94.5,
      traffic: "medium",
      deliveries: 8,
      earnings: 4200,
    },
    {
      id: "route-002",
      name: "Industrial Area Express",
      distance: 32.1,
      estimatedTime: 85,
      efficiency: 91.2,
      traffic: "light",
      deliveries: 6,
      earnings: 3100,
    },
    {
      id: "route-003",
      name: "Westlands to Eastlands",
      distance: 28.7,
      estimatedTime: 95,
      efficiency: 88.7,
      traffic: "heavy",
      deliveries: 5,
      earnings: 2800,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case "Cheetah Elite":
        return "🐆";
      case "Speed Demon":
        return "⚡";
      case "Swift Runner":
        return "💨";
      default:
        return "🏃";
    }
  };

  const handleStartDelivery = (taskId: string) => {
    playSuccessRoar();
    console.log(`Starting delivery: ${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <SavannahNavigation
        userRole="driver"
        pridePoints={logisticsMetrics.pridePoints}
        notifications={2}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl animate-pulse">
                {getTierEmoji(logisticsMetrics.tier)}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Cheetah Command Center
                </h1>
                <p className="text-muted-foreground">
                  Racing across the digital savanna with lightning speed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                {logisticsMetrics.tier}
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                Rank {logisticsMetrics.rank} in Nairobi
              </Badge>
              <Badge
                className={`${isOnDuty ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
              >
                {isOnDuty ? "On Duty" : "Off Duty"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className={`${isOnDuty ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              onClick={() => {
                setIsOnDuty(!isOnDuty);
                playClickSound();
              }}
            >
              {isOnDuty ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  End Shift
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Shift
                </>
              )}
            </Button>
            <Button variant="outline" className="border-blue-200">
              <Map className="w-4 h-4 mr-2" />
              View Routes
            </Button>
          </div>
        </div>

        {/* Wisdom Section */}
        <SwahiliWisdom context="patience" variant="banner" />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                Cheetah Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700 mb-2">
                {logisticsMetrics.cheetahScore}/100
              </div>
              <Progress
                value={logisticsMetrics.cheetahScore}
                className="h-2 mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Speed & efficiency rating
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                On-Time Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 mb-2">
                {logisticsMetrics.onTimeRate}%
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +1.2% this week
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Star className="w-4 h-4 mr-2 text-blue-600" />
                Customer Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {logisticsMetrics.customerRating}/5.0
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= logisticsMetrics.customerRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                Daily Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 mb-2">
                KSH {logisticsMetrics.dailyEarnings.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% vs yesterday
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Delivery Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Today's Hunting Assignments
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    {todayTasks.length} deliveries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                className={getPriorityColor(task.priority)}
                                variant="outline"
                              >
                                {task.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace("_", " ").toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                #{task.orderNumber}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-sm font-medium">Pickup</p>
                                <p className="text-sm text-muted-foreground">
                                  {task.pickup}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Destination
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {task.destination}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {task.distance} km
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.estimatedTime} min
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                KSH {task.value}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            {task.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleStartDelivery(task.id)}
                              >
                                <NavigationIcon className="w-3 h-3 mr-1" />
                                Start Hunt
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <MapPin className="w-3 h-3 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimized Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="w-5 h-5 mr-2 text-green-600" />
                  Antelope Path Optimization
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-optimized routes for maximum speed and efficiency
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizedRoutes.map((route) => (
                    <Card
                      key={route.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                        activeRoute === route.id ? "ring-2 ring-green-500" : ""
                      }`}
                      onClick={() => {
                        setActiveRoute(route.id);
                        playClickSound();
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{route.name}</h4>
                          <Badge className="bg-green-100 text-green-700">
                            {route.efficiency}% efficient
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Distance</p>
                            <p className="font-medium">{route.distance} km</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-medium">
                              {route.estimatedTime} min
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Deliveries</p>
                            <p className="font-medium">
                              {route.deliveries} stops
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Earnings</p>
                            <p className="font-medium text-green-600">
                              KSH {route.earnings}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Activity className="w-3 h-3 mr-1" />
                            Traffic: {route.traffic}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                          >
                            Select Route
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pride Points Widget */}
            <PridePointsWidget
              currentPoints={logisticsMetrics.pridePoints}
              nextTierPoints={2500}
              currentTier={logisticsMetrics.tier}
              nextTier="Cheetah Elite"
              badges={["Speed Demon", "On-Time Master", "Customer Champion"]}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Hunt Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Deliveries
                  </span>
                  <span className="font-semibold">12/15</span>
                </div>
                <Progress value={80} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Distance
                  </span>
                  <span className="font-semibold">156 km</span>
                </div>
                <Progress value={65} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fuel Efficiency
                  </span>
                  <span className="font-semibold">
                    {logisticsMetrics.fuelEfficiency}%
                  </span>
                </div>
                <Progress
                  value={logisticsMetrics.fuelEfficiency}
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cheetah Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Start Navigation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Fuel className="w-4 h-4 mr-2" />
                  Fuel Tracker
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Break
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheetahLogistics;
