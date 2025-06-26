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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  PridePointsWidget,
  SavannahChallenges,
} from "@/components/wildlife/PridePoints";
import { SwahiliWisdom } from "@/components/wildlife/SwahiliWisdom";
import { useSavannahAudio } from "@/hooks/useSavannahAudio";
import { InsightsDashboard } from "@/components/enterprise/InsightsDashboard";
import { ActivityFeed } from "@/components/enterprise/ActivityFeed";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  MapPin,
  Star,
  Clock,
  Package,
  Users,
  BarChart3,
  Shield,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  DollarSign,
  Calendar,
  Truck,
  Phone,
  Mail,
  Globe,
  Settings,
  Plus,
  Edit,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";

interface SupplierMetrics {
  rhinoScore: number;
  pridePoints: number;
  onTimeDelivery: number;
  stockAccuracy: number;
  retailerRating: number;
  totalRetailers: number;
  monthlyGMV: number;
  commissionsOwed: number;
  rank: string;
  tier: "Young Cub" | "Herd Member" | "Mighty Elephant" | "Alpha Leader";
}

interface WateringHole {
  id: string;
  name: string;
  category: string;
  activeTraders: number;
  volume: number;
  trending: boolean;
  growth: number;
  location: string;
}

const EnhancedSupplierHub = () => {
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const { playSuccessRoar, playClickSound } = useSavannahAudio();
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [activeWateringHole, setActiveWateringHole] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");

  const supplierMetrics: SupplierMetrics = {
    rhinoScore: 87,
    pridePoints: 2340,
    onTimeDelivery: 94.8,
    stockAccuracy: 97.2,
    retailerRating: 4.7,
    totalRetailers: 156,
    monthlyGMV: 4200000,
    commissionsOwed: 84000,
    rank: "#34",
    tier: "Mighty Elephant",
  };

  const wateringHoles: WateringHole[] = [
    {
      id: "fresh-produce",
      name: "Fresh Produce Oasis",
      category: "Agriculture",
      activeTraders: 234,
      volume: 1200000,
      trending: true,
      growth: 18.5,
      location: "Nairobi",
    },
    {
      id: "tech-savanna",
      name: "Tech Savanna Hub",
      category: "Electronics",
      activeTraders: 189,
      volume: 2100000,
      trending: true,
      growth: 24.2,
      location: "Mombasa",
    },
    {
      id: "fashion-plains",
      name: "Fashion Plains",
      category: "Clothing",
      activeTraders: 156,
      volume: 890000,
      trending: false,
      growth: 8.7,
      location: "Kisumu",
    },
    {
      id: "construction-rocks",
      name: "Construction Rocks",
      category: "Building Materials",
      activeTraders: 98,
      volume: 1500000,
      trending: true,
      growth: 15.3,
      location: "Nakuru",
    },
  ];

  const challenges = [
    {
      id: "great-migration",
      name: "Great Migration Challenge",
      description: "Serve 100 retailers this quarter",
      progress: 67,
      target: 100,
      reward: 500,
      type: "seasonal" as const,
      emoji: "🦬",
    },
    {
      id: "waterhole-visits",
      name: "Watering Hole Visits",
      description: "Post products to 5 different hubs",
      progress: 3,
      target: 5,
      reward: 250,
      type: "daily" as const,
      emoji: "💧",
    },
    {
      id: "herd-builder",
      name: "Herd Builder",
      description: "Refer 3 new suppliers this month",
      progress: 1,
      target: 3,
      reward: 750,
      type: "referral" as const,
      emoji: "🐘",
    },
  ];

  const handleWateringHoleClick = (holeId: string) => {
    setActiveWateringHole(holeId);
    playClickSound();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Alpha Leader":
        return "from-purple-500 to-pink-500";
      case "Mighty Elephant":
        return "from-blue-500 to-cyan-500";
      case "Herd Member":
        return "from-green-500 to-emerald-500";
      default:
        return "from-yellow-500 to-orange-500";
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case "Alpha Leader":
        return "🦁";
      case "Mighty Elephant":
        return "🐘";
      case "Herd Member":
        return "🦌";
      default:
        return "🐾";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      <SavannahNavigation
        userRole="supplier"
        pridePoints={supplierMetrics.pridePoints}
        notifications={3}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">
                {getTierEmoji(supplierMetrics.tier)}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mighty Elephant Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Leading the herd with wisdom and strength
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={`bg-gradient-to-r ${getTierColor(supplierMetrics.tier)} text-white`}
              >
                {supplierMetrics.tier}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-300 text-green-700"
              >
                Rank {supplierMetrics.rank} in Kenya
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => playSuccessRoar()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Products
            </Button>
            <Button variant="outline" className="border-green-200">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Wisdom Section */}
        <SwahiliWisdom context="cooperation" variant="banner" />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Rhino Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 mb-2">
                {supplierMetrics.rhinoScore}/100
              </div>
              <Progress
                value={supplierMetrics.rhinoScore}
                className="h-2 mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Strength & reliability rating
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Truck className="w-4 h-4 mr-2 text-blue-600" />
                On-Time Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {supplierMetrics.onTimeDelivery}%
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.3% this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Active Retailers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 mb-2">
                {supplierMetrics.totalRetailers}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12 this week
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                Monthly GMV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 mb-2">
                KSH {(supplierMetrics.monthlyGMV / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.5% growth
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tabs or Desktop Grid */}
        {isMobile ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="hubs" className="text-xs">
                Hubs
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <PridePointsWidget
                currentPoints={supplierMetrics.pridePoints}
                nextTierPoints={3000}
                currentTier={supplierMetrics.tier}
                nextTier="Alpha Leader"
                badges={[
                  "Reliable Elephant",
                  "Quality Master",
                  "Quick Responder",
                ]}
              />
              <SavannahChallenges challenges={challenges} />
            </TabsContent>

            <TabsContent value="hubs" className="mt-6">
              {/* Watering Holes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-xl mr-2">🏞️</span>
                    Active Watering Holes
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Trading hubs where your products can reach the most gazelles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {wateringHoles.map((hole) => (
                      <Card
                        key={hole.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                          activeWateringHole === hole.id
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                        onClick={() => handleWateringHoleClick(hole.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {hole.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {hole.category}
                              </p>
                            </div>
                            {hole.trending && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Active Traders
                              </span>
                              <span className="font-medium">
                                {hole.activeTraders}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Volume
                              </span>
                              <span className="font-medium">
                                KSH {(hole.volume / 1000000).toFixed(1)}M
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth
                              </span>
                              <span className="font-medium text-green-600">
                                +{hole.growth}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {hole.location}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                            >
                              Join Hub
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <InsightsDashboard userRole="supplier" />
              <div className="mt-6">
                <ActivityFeed userRole="supplier" maxItems={5} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <InsightsDashboard userRole="supplier" />
              {/* Watering Holes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-xl mr-2">🏞️</span>
                    Active Watering Holes
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Trading hubs where your products can reach the most gazelles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wateringHoles.map((hole) => (
                      <Card
                        key={hole.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                          activeWateringHole === hole.id
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                        onClick={() => handleWateringHoleClick(hole.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {hole.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {hole.category}
                              </p>
                            </div>
                            {hole.trending && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Active Traders
                              </span>
                              <span className="font-medium">
                                {hole.activeTraders}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Volume
                              </span>
                              <span className="font-medium">
                                KSH {(hole.volume / 1000000).toFixed(1)}M
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth
                              </span>
                              <span className="font-medium text-green-600">
                                +{hole.growth}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {hole.location}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                            >
                              Join Hub
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Herd Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="sales">Sales</TabsTrigger>
                      <TabsTrigger value="retailers">Retailers</TabsTrigger>
                      <TabsTrigger value="products">Products</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stock Accuracy</span>
                            <span className="font-medium">
                              {supplierMetrics.stockAccuracy}%
                            </span>
                          </div>
                          <Progress
                            value={supplierMetrics.stockAccuracy}
                            className="h-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Retailer Rating</span>
                            <span className="font-medium">
                              {supplierMetrics.retailerRating}/5.0
                            </span>
                          </div>
                          <Progress
                            value={supplierMetrics.retailerRating * 20}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pride Points Widget */}
              <PridePointsWidget
                currentPoints={supplierMetrics.pridePoints}
                nextTierPoints={3000}
                currentTier={supplierMetrics.tier}
                nextTier="Alpha Leader"
                badges={[
                  "Reliable Elephant",
                  "Quality Master",
                  "Quick Responder",
                ]}
              />

              {/* Challenges */}
              <SavannahChallenges challenges={challenges} />

              {/* Activity Feed */}
              <ActivityFeed
                userRole="supplier"
                maxItems={6}
                showFilters={false}
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Retailer Requests
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSupplierHub;
