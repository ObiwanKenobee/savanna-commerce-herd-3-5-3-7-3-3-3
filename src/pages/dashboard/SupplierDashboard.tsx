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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
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
} from "lucide-react";

interface SupplierMetrics {
  rhinoScore: number;
  onTimeDelivery: number;
  stockAccuracy: number;
  retailerRating: number;
  totalRetailers: number;
  monthlyGMV: number;
  commissionsOwed: number;
  rank: number;
  totalSuppliers: number;
}

interface DemandForecast {
  location: string;
  product: string;
  predictedDemand: number;
  currentStock: number;
  recommendedAction: string;
  confidence: number;
  timeframe: string;
}

interface RetailerFeedback {
  retailerName: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  orderValue: number;
}

const SupplierDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState<SupplierMetrics>({
    rhinoScore: 87,
    onTimeDelivery: 94,
    stockAccuracy: 91,
    retailerRating: 4.6,
    totalRetailers: 324,
    monthlyGMV: 2450000,
    commissionsOwed: 147000,
    rank: 3,
    totalSuppliers: 156,
  });

  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([
    {
      location: "Nakuru",
      product: "Cooking Oil 500ml",
      predictedDemand: 2400,
      currentStock: 1800,
      recommendedAction: "Increase stock by 600 units",
      confidence: 89,
      timeframe: "Next 2 weeks",
    },
    {
      location: "Mombasa",
      product: "Maize Flour 2kg",
      predictedDemand: 1800,
      currentStock: 2200,
      recommendedAction: "Adequate stock, monitor trends",
      confidence: 76,
      timeframe: "Next 2 weeks",
    },
    {
      location: "Kisumu",
      product: "Sugar 1kg",
      predictedDemand: 3200,
      currentStock: 2100,
      recommendedAction: "Critical shortage predicted - urgent restock",
      confidence: 94,
      timeframe: "Next week",
    },
  ]);

  const [recentFeedback, setRecentFeedback] = useState<RetailerFeedback[]>([
    {
      retailerName: "Mama Jane's Kiosk",
      rating: 5,
      comment: "Excellent service, always on time with fresh products!",
      date: "Jan 10, 2024",
      location: "Nairobi",
      orderValue: 15000,
    },
    {
      retailerName: "Kisumu Supermart",
      rating: 4,
      comment: "Good quality, but delivery was 2 hours late last time.",
      date: "Jan 8, 2024",
      location: "Kisumu",
      orderValue: 45000,
    },
    {
      retailerName: "Nakuru Fresh Market",
      rating: 5,
      comment: "Best supplier in the region! Keep up the great work.",
      date: "Jan 7, 2024",
      location: "Nakuru",
      orderValue: 28000,
    },
  ]);

  const [hotZones, setHotZones] = useState([
    {
      location: "Nakuru",
      growth: "+23%",
      category: "Cooking Oil",
      opportunity: "High",
    },
    {
      location: "Mombasa",
      growth: "+18%",
      category: "Flour Products",
      opportunity: "Medium",
    },
    {
      location: "Eldoret",
      growth: "+31%",
      category: "Sugar & Sweeteners",
      opportunity: "High",
    },
  ]);

  const renderPrideLeaderboard = () => (
    <div className="space-y-6">
      {/* Rhino Trust Score */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span>🦏 Rhino Trust Score</span>
            <Badge variant="default" className="bg-green-600">
              {metrics.rhinoScore}/100
            </Badge>
          </CardTitle>
          <CardDescription>
            Your overall performance rating in the savanna ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>On-Time Delivery</span>
                  <span className="font-medium">{metrics.onTimeDelivery}%</span>
                </div>
                <Progress value={metrics.onTimeDelivery} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Accuracy</span>
                  <span className="font-medium">{metrics.stockAccuracy}%</span>
                </div>
                <Progress value={metrics.stockAccuracy} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Retailer Rating</span>
                  <span className="font-medium">
                    {metrics.retailerRating}/5.0
                  </span>
                </div>
                <Progress
                  value={(metrics.retailerRating / 5) * 100}
                  className="h-2"
                />
              </div>
            </div>

            {/* Ranking */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    Rank #{metrics.rank}
                  </div>
                  <div className="text-sm text-gray-600">
                    out of {metrics.totalSuppliers} suppliers
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  KES {(metrics.monthlyGMV / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Monthly GMV</div>
              </div>
            </div>

            {/* Wildlife Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl mb-1">🦁</div>
                <div className="text-xs font-medium">Lion Partner</div>
                <div className="text-xs text-gray-500">Top 5%</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl mb-1">🐘</div>
                <div className="text-xs font-medium">Elephant Reliable</div>
                <div className="text-xs text-gray-500">94% On-time</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-dashed">
                <div className="text-2xl mb-1 opacity-50">🦓</div>
                <div className="text-xs text-gray-400">Zebra Consistent</div>
                <div className="text-xs text-gray-400">Need 96% accuracy</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-dashed">
                <div className="text-2xl mb-1 opacity-50">🦏</div>
                <div className="text-xs text-gray-400">Rhino Strong</div>
                <div className="text-xs text-gray-400">Need 98% rating</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Retailer Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Recent Retailer Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{feedback.retailerName}</div>
                    <div className="text-sm text-gray-600">
                      {feedback.location} • {feedback.date}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                <div className="text-xs text-gray-500">
                  Order Value: KES {feedback.orderValue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMigrationPlanner = () => (
    <div className="space-y-6">
      {/* AI Demand Forecasting */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>🔮 AI Demand Forecasting</span>
          </CardTitle>
          <CardDescription>
            Predictive analytics for optimal inventory management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demandForecasts.map((forecast, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  forecast.confidence > 90
                    ? "bg-green-50 border-green-200"
                    : forecast.confidence > 80
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">
                      {forecast.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      {forecast.product}
                    </div>
                  </div>
                  <Badge
                    variant={
                      forecast.confidence > 90
                        ? "default"
                        : forecast.confidence > 80
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {forecast.confidence}% Confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">
                      Predicted Demand
                    </div>
                    <div className="font-semibold text-blue-600">
                      {forecast.predictedDemand.toLocaleString()} units
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Stock</div>
                    <div className="font-semibold">
                      {forecast.currentStock.toLocaleString()} units
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Timeframe</div>
                    <div className="font-semibold">{forecast.timeframe}</div>
                  </div>
                </div>

                <Alert
                  className={
                    forecast.currentStock < forecast.predictedDemand
                      ? "border-red-300"
                      : "border-green-300"
                  }
                >
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommendation:</strong>{" "}
                    {forecast.recommendedAction}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hot Zones Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <span>🔥 Hot Zones This Week</span>
          </CardTitle>
          <CardDescription>
            High-growth areas requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotZones.map((zone, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-lg">{zone.location}</div>
                  <Badge
                    variant={
                      zone.opportunity === "High" ? "destructive" : "secondary"
                    }
                  >
                    {zone.opportunity} Opportunity
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Growth Rate</div>
                  <div className="text-xl font-bold text-green-600">
                    {zone.growth}
                  </div>
                  <div className="text-sm text-gray-600">
                    Category: {zone.category}
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWhiteLabelDen = () => (
    <div className="space-y-6">
      {/* White Label Storefront */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-purple-600" />
            <span>🏪 White-Label Storefront</span>
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-300"
            >
              Pro Feature
            </Badge>
          </CardTitle>
          <CardDescription>Create your branded online presence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Storefront Preview */}
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Your Branded Storefront
              </h3>
              <p className="text-gray-600 mb-4">
                Showcase your products with custom branding, logos, and colors
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize Storefront
                </Button>
                <Button variant="outline" className="border-purple-300">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Live Site
                </Button>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Included Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Custom domain name</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Logo and branding integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Product catalog management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Order management system</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Options:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>Mobile app integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>Multi-language support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>API integrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Revenue & Commissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                KES {(metrics.monthlyGMV / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Monthly GMV</div>
              <div className="text-xs text-green-600 mt-1">
                ↗ +12% vs last month
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                KES {(metrics.commissionsOwed / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600">Commissions Owed</div>
              <div className="text-xs text-blue-600 mt-1">
                Due: Jan 15, 2024
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.totalRetailers}
              </div>
              <div className="text-sm text-gray-600">Active Retailers</div>
              <div className="text-xs text-purple-600 mt-1">
                ↗ +23 this month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                🏭 {profile?.business_name || "Supplier"} Command Center
              </h1>
              <p className="text-green-600 mt-1">
                Manage your pride and expand your territory in the savanna.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-blue-600">
                🐘 Elephant Scale
              </Badge>
              <Button variant="outline" className="border-purple-300">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Baobab Enterprise
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="leaderboard"
                className="flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Pride Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="migration"
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>Migration Planner</span>
              </TabsTrigger>
              <TabsTrigger
                value="storefront"
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>White-Label Den</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard">
              {renderPrideLeaderboard()}
            </TabsContent>

            <TabsContent value="migration">
              {renderMigrationPlanner()}
            </TabsContent>

            <TabsContent value="storefront">
              {renderWhiteLabelDen()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;
