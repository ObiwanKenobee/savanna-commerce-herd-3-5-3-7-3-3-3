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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CriticalInsightsHub from "@/components/insights/CriticalInsightsHub";
import {
  Upload,
  Camera,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  BarChart3,
  Package,
  Users,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Eye,
  Crown,
  Shield,
  Truck,
  DollarSign,
  Percent,
  Calendar,
  Bell,
  Image,
  Sparkles,
  Brain,
  FileText,
  Award,
  ThumbsUp,
  Activity,
  Globe,
  Settings,
  Mail,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface ProductListing {
  id: string;
  name: string;
  originalName: string;
  aiSuggestedName: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: "active" | "pending" | "out_of_stock";
  views: number;
  orders: number;
  margin: number;
  supplier: string;
}

interface CompetitorData {
  name: string;
  price: number;
  marketShare: number;
  yourPosition: number;
}

interface StockoutPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  dailySales: number;
  daysUntilStockout: number;
  confidence: number;
  riskLevel: "high" | "medium" | "low";
}

interface PromotionCampaign {
  id: string;
  productName: string;
  currentStock: number;
  suggestedDiscount: number;
  targetShops: number;
  potentialRevenue: number;
  urgency: "high" | "medium" | "low";
  reason: string;
}

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

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

const MergedSupplierDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Combined state from both dashboards
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

  const [productListings, setProductListings] = useState<ProductListing[]>([
    {
      id: "1",
      name: "Premium Maize Flour 2kg",
      originalName: "Maize Flour",
      aiSuggestedName: "Premium Grade A Maize Flour 2kg",
      price: 95,
      stock: 450,
      category: "Grains",
      image: "/api/placeholder/100/100",
      status: "active",
      views: 1247,
      orders: 89,
      margin: 15,
      supplier: "Unga Holdings",
    },
    {
      id: "2",
      name: "Refined Cooking Oil 1L",
      originalName: "Cooking Oil",
      aiSuggestedName: "Pure Refined Sunflower Oil 1L",
      price: 280,
      stock: 234,
      category: "Oils",
      image: "/api/placeholder/100/100",
      status: "active",
      views: 892,
      orders: 67,
      margin: 12,
      supplier: "Bidco Africa",
    },
    {
      id: "3",
      name: "White Sugar 2kg",
      originalName: "Sugar",
      aiSuggestedName: "Crystal White Sugar 2kg",
      price: 165,
      stock: 0,
      category: "Sweeteners",
      image: "/api/placeholder/100/100",
      status: "out_of_stock",
      views: 456,
      orders: 0,
      margin: 8,
      supplier: "Mumias Sugar",
    },
  ]);

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
      recommendedAction: "Stock levels optimal",
      confidence: 94,
      timeframe: "Next 2 weeks",
    },
    {
      location: "Kisumu",
      product: "Sugar 2kg",
      predictedDemand: 1200,
      currentStock: 450,
      recommendedAction: "Critical restock needed - 750 units",
      confidence: 97,
      timeframe: "Next 1 week",
    },
  ]);

  const [stockoutPredictions, setStockoutPredictions] = useState<
    StockoutPrediction[]
  >([
    {
      productId: "1",
      productName: "Premium Maize Flour 2kg",
      currentStock: 450,
      dailySales: 45,
      daysUntilStockout: 10,
      confidence: 94,
      riskLevel: "medium",
    },
    {
      productId: "2",
      productName: "Refined Cooking Oil 1L",
      currentStock: 234,
      dailySales: 67,
      daysUntilStockout: 3,
      confidence: 89,
      riskLevel: "high",
    },
  ]);

  const [promotionCampaigns, setPromotionCampaigns] = useState<
    PromotionCampaign[]
  >([
    {
      id: "1",
      productName: "Premium Maize Flour 2kg",
      currentStock: 450,
      suggestedDiscount: 12,
      targetShops: 45,
      potentialRevenue: 38250,
      urgency: "medium",
      reason: "High stock levels with approaching expiry",
    },
    {
      id: "2",
      productName: "Refined Cooking Oil 1L",
      currentStock: 234,
      suggestedDiscount: 8,
      targetShops: 28,
      potentialRevenue: 58240,
      urgency: "high",
      reason: "Fast-moving inventory with high demand",
    },
  ]);

  const [retailerFeedback, setRetailerFeedback] = useState<RetailerFeedback[]>([
    {
      retailerName: "Jane's Groceries",
      rating: 5,
      comment: "Excellent quality and timely delivery. Products always fresh.",
      date: "2 days ago",
      location: "Nairobi",
      orderValue: 12500,
    },
    {
      retailerName: "City Supermarket",
      rating: 4,
      comment:
        "Good products but delivery could be faster during peak seasons.",
      date: "1 week ago",
      location: "Mombasa",
      orderValue: 45000,
    },
    {
      retailerName: "Village Store",
      rating: 5,
      comment:
        "Best supplier in the region. Consistent quality and fair pricing.",
      date: "3 days ago",
      location: "Nakuru",
      orderValue: 8900,
    },
  ]);

  // Key performance metrics
  const keyMetrics: MetricCard[] = [
    {
      title: "Rhino Score",
      value: `${metrics.rhinoScore}/100`,
      change: 5.2,
      changeType: "positive",
      icon: <Crown className="h-8 w-8" />,
      description: `Rank #${metrics.rank} of ${metrics.totalSuppliers}`,
    },
    {
      title: "Monthly GMV",
      value: `KSH ${(metrics.monthlyGMV / 1000000).toFixed(1)}M`,
      change: 12.8,
      changeType: "positive",
      icon: <DollarSign className="h-8 w-8" />,
      description: "Gross merchandise value",
    },
    {
      title: "Active Retailers",
      value: metrics.totalRetailers,
      change: 8.3,
      changeType: "positive",
      icon: <Users className="h-8 w-8" />,
      description: "Connected retail partners",
    },
    {
      title: "On-Time Delivery",
      value: `${metrics.onTimeDelivery}%`,
      change: 2.1,
      changeType: "positive",
      icon: <Truck className="h-8 w-8" />,
      description: "Reliability score",
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const MetricCardComponent = ({ metric }: { metric: MetricCard }) => {
    const getChangeIcon = () => {
      if (metric.changeType === "positive")
        return <ArrowUp className="h-3 w-3" />;
      if (metric.changeType === "negative")
        return <ArrowDown className="h-3 w-3" />;
      return null;
    };

    const getChangeColor = () => {
      if (metric.changeType === "positive") return "text-green-600";
      if (metric.changeType === "negative") return "text-red-600";
      return "text-muted-foreground";
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-2xl font-bold">{metric.value}</p>
              {metric.change !== 0 && (
                <div
                  className={`flex items-center gap-1 text-xs ${getChangeColor()}`}
                >
                  {getChangeIcon()}
                  <span>{Math.abs(metric.change)}% from last month</span>
                </div>
              )}
              {metric.description && (
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              )}
            </div>
            <div className="text-muted-foreground">{metric.icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <EnhancedNavigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to access your supplier dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🦏</div>
            <div>
              <h1 className="text-4xl font-bold">
                Rhino Supplier Command Center
              </h1>
              <p className="text-lg text-muted-foreground">
                Powerful supply chain management for the digital savannah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              🏢 {profile?.organization?.name || "Independent Supplier"}
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              🦏 Rhino Score: {metrics.rhinoScore}/100
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              🎯 Rank #{metrics.rank} of {metrics.totalSuppliers}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <MetricCardComponent key={index} metric={metric} />
          ))}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="retailers">Retailers</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="insights">Critical Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Performance Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-6 w-6" />
                    Rhino Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-Time Delivery</span>
                        <span>{metrics.onTimeDelivery}%</span>
                      </div>
                      <Progress
                        value={metrics.onTimeDelivery}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Accuracy</span>
                        <span>{metrics.stockAccuracy}%</span>
                      </div>
                      <Progress value={metrics.stockAccuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Retailer Rating</span>
                        <span>{metrics.retailerRating}/5.0</span>
                      </div>
                      <Progress
                        value={metrics.retailerRating * 20}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly GMV</span>
                      <span className="font-bold">
                        KSH {metrics.monthlyGMV.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Commissions Owed
                      </span>
                      <span className="font-bold text-green-600">
                        KSH {metrics.commissionsOwed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Active Retailers
                      </span>
                      <span className="font-bold">
                        {metrics.totalRetailers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Rank</span>
                      <span className="font-bold">#{metrics.rank}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("products")}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Add Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload new inventory
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("analytics")}
              >
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Demand Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    View forecasts
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("retailers")}
              >
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Retailer Network</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage relationships
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("campaigns")}
              >
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Launch Campaign</h3>
                  <p className="text-sm text-muted-foreground">
                    Create promotions
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Product Portfolio Management
                </CardTitle>
                <CardDescription>
                  AI-enhanced product listings with performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="oils">Oils</SelectItem>
                      <SelectItem value="sweeteners">Sweeteners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {productListings.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {product.name}
                              </h3>
                              <Badge className={getStatusColor(product.status)}>
                                {product.status.replace("_", " ").toUpperCase()}
                              </Badge>
                              {product.aiSuggestedName !==
                                product.originalName && (
                                <Badge variant="secondary">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI Enhanced
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Price:{" "}
                                </span>
                                <span className="font-medium">
                                  KSH {product.price}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Stock:{" "}
                                </span>
                                <span
                                  className={`font-medium ${product.stock < 100 ? "text-red-600" : "text-green-600"}`}
                                >
                                  {product.stock} units
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Views:{" "}
                                </span>
                                <span className="font-medium">
                                  {product.views}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Orders:{" "}
                                </span>
                                <span className="font-medium">
                                  {product.orders}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Margin:{" "}
                                </span>
                                <span className="font-medium">
                                  {product.margin}%
                                </span>
                              </div>
                            </div>

                            {product.aiSuggestedName !==
                              product.originalName && (
                              <Alert className="mt-3">
                                <Brain className="h-4 w-4" />
                                <AlertDescription>
                                  AI Suggestion: "{product.aiSuggestedName}" may
                                  improve visibility by 23%
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button size="sm">Edit Product</Button>
                            <Button size="sm" variant="outline">
                              View Analytics
                            </Button>
                            {product.status === "out_of_stock" && (
                              <Button size="sm" variant="destructive">
                                Restock Alert
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demand Forecasting */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Demand Forecasting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demandForecasts.map((forecast, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{forecast.product}</h4>
                            <p className="text-sm text-muted-foreground">
                              {forecast.location}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {forecast.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Predicted Demand:{" "}
                            </span>
                            <span className="font-medium">
                              {forecast.predictedDemand} units
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Current Stock:{" "}
                            </span>
                            <span className="font-medium">
                              {forecast.currentStock} units
                            </span>
                          </div>
                        </div>
                        <Alert>
                          <Target className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong>{forecast.timeframe}:</strong>{" "}
                            {forecast.recommendedAction}
                          </AlertDescription>
                        </Alert>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stockout Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Stockout Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockoutPredictions.map((prediction, index) => (
                      <Card
                        key={index}
                        className={`p-4 border ${getRiskColor(prediction.riskLevel)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            {prediction.productName}
                          </h4>
                          <Badge className={getRiskColor(prediction.riskLevel)}>
                            {prediction.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Current Stock:{" "}
                            </span>
                            <span className="font-medium">
                              {prediction.currentStock} units
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Daily Sales:{" "}
                            </span>
                            <span className="font-medium">
                              {prediction.dailySales} units
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Days Until Stockout:{" "}
                            </span>
                            <span
                              className={`font-medium ${prediction.daysUntilStockout <= 5 ? "text-red-600" : "text-green-600"}`}
                            >
                              {prediction.daysUntilStockout} days
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Confidence:{" "}
                            </span>
                            <span className="font-medium">
                              {prediction.confidence}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Restock Now</Button>
                          <Button size="sm" variant="outline">
                            Set Alert
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Retailers Tab */}
          <TabsContent value="retailers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Retailer Network Management
                </CardTitle>
                <CardDescription>
                  Monitor relationships and feedback from your retail partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {retailerFeedback.map((feedback, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {feedback.retailerName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {feedback.location}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">
                                {feedback.date}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Order: KSH {feedback.orderValue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          "{feedback.comment}"
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Orders
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  AI-Powered Promotion Campaigns
                </CardTitle>
                <CardDescription>
                  Smart campaign suggestions based on inventory and market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotionCampaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">
                            {campaign.productName}
                          </h3>
                          <Badge className={getUrgencyColor(campaign.urgency)}>
                            {campaign.urgency.toUpperCase()} PRIORITY
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Current Stock:{" "}
                              </span>
                              <span className="font-medium">
                                {campaign.currentStock} units
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Suggested Discount:{" "}
                              </span>
                              <span className="font-medium text-green-600">
                                {campaign.suggestedDiscount}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Target Shops:{" "}
                              </span>
                              <span className="font-medium">
                                {campaign.targetShops} retailers
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Potential Revenue:{" "}
                              </span>
                              <span className="font-medium text-blue-600">
                                KSH {campaign.potentialRevenue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <Alert>
                            <Brain className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>AI Insight:</strong> {campaign.reason}
                            </AlertDescription>
                          </Alert>

                          <div className="flex gap-2">
                            <Button className="flex-1">Launch Campaign</Button>
                            <Button variant="outline">Customize</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Critical Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Critical Supply Chain Insights
              </h2>
              <p className="text-muted-foreground">
                Comprehensive analytics across frontend, backend, API, and
                database layers
              </p>
            </div>
            <CriticalInsightsHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MergedSupplierDashboard;
