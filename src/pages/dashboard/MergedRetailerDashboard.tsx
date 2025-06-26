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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Search,
  Filter,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  MapPin,
  Star,
  Target,
  Phone,
  MessageSquare,
  Package,
  ShoppingCart,
  CreditCard,
  Droplets,
  Leaf,
  TreePine,
  Eye,
  Bell,
  Volume2,
  Smartphone,
  Coins,
  Calendar,
  BarChart3,
  Crown,
  Heart,
  Truck,
  Gift,
  CheckCircle,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface ProductSearch {
  id: string;
  name: string;
  price: number;
  pricePerKg: number;
  supplier: string;
  distance: number;
  stockedToday: boolean;
  isCheetahDeal: boolean;
  discount?: number;
  timeLeft?: string;
  image: string;
}

interface GroupBuyingPool {
  id: string;
  product: string;
  currentShops: number;
  targetShops: number;
  discount: number;
  pricePerUnit: number;
  timeLeft: string;
  autoOptIn: boolean;
  currentParticipants: number;
  targetParticipants: number;
  image: string;
}

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  maxStock: number;
  category: string;
  lastRestocked: string;
  aiAlert?: string;
  alertLevel: "high" | "medium" | "low";
}

interface DebtorRecord {
  id: string;
  customerName: string;
  amount: number;
  daysPastDue: number;
  lastContact: string;
  phoneNumber: string;
  riskLevel: "high" | "medium" | "low";
}

interface CreditInfo {
  limit: number;
  used: number;
  available: number;
  nextPayment: string;
  paymentAmount: number;
  status: "good" | "warning" | "overdue";
}

interface SalesInsight {
  product: string;
  sales: number;
  profit: number;
  trend: "up" | "down" | "stable";
  competitorPrice: number;
  yourPrice: number;
  recommendation: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

const MergedRetailerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheetahDealsOnly, setShowCheetahDealsOnly] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Combined state from both dashboards
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    limit: 50000,
    used: 23500,
    available: 26500,
    nextPayment: "2024-01-15",
    paymentAmount: 5000,
    status: "good",
  });

  const [products, setProducts] = useState<ProductSearch[]>([
    {
      id: "1",
      name: "Maize Flour - Premium Grade A",
      price: 85,
      pricePerKg: 42.5,
      supplier: "Unga Holdings",
      distance: 2.3,
      stockedToday: true,
      isCheetahDeal: true,
      discount: 15,
      timeLeft: "2h 30m",
      image: "/api/placeholder/60/60",
    },
    {
      id: "2",
      name: "Cooking Oil - Refined",
      price: 320,
      pricePerKg: 160,
      supplier: "Bidco Africa",
      distance: 4.1,
      stockedToday: false,
      isCheetahDeal: false,
      image: "/api/placeholder/60/60",
    },
  ]);

  const [groupPools, setGroupPools] = useState<GroupBuyingPool[]>([
    {
      id: "1",
      product: "Maize Flour - 2kg Bags",
      currentShops: 47,
      targetShops: 50,
      currentParticipants: 47,
      targetParticipants: 50,
      discount: 12,
      timeLeft: "2 days",
      pricePerUnit: 85,
      autoOptIn: false,
      image: "/api/placeholder/60/60",
    },
    {
      id: "2",
      product: "Cooking Oil - 500ml",
      currentShops: 32,
      targetShops: 40,
      currentParticipants: 32,
      targetParticipants: 40,
      discount: 8,
      timeLeft: "1 day",
      pricePerUnit: 120,
      autoOptIn: true,
      image: "/api/placeholder/60/60",
    },
  ]);

  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Sugar 2kg",
      currentStock: 15,
      maxStock: 100,
      category: "Essentials",
      lastRestocked: "2 days ago",
      aiAlert: "Restock within 3 days - high demand period approaching",
      alertLevel: "high",
    },
    {
      id: "2",
      name: "Rice 5kg",
      currentStock: 45,
      maxStock: 80,
      category: "Grains",
      lastRestocked: "1 week ago",
      alertLevel: "medium",
    },
  ]);

  const [debtors, setDebtors] = useState<DebtorRecord[]>([
    {
      id: "1",
      customerName: "Jane Mwangi",
      amount: 1250,
      daysPastDue: 5,
      lastContact: "2 days ago",
      phoneNumber: "+254700123456",
      riskLevel: "medium",
    },
    {
      id: "2",
      customerName: "Peter Otieno",
      amount: 890,
      daysPastDue: 12,
      lastContact: "1 week ago",
      phoneNumber: "+254711987654",
      riskLevel: "high",
    },
  ]);

  const [salesInsights, setSalesInsights] = useState<SalesInsight[]>([
    {
      product: "Maize Flour 2kg",
      sales: 145,
      profit: 2180,
      trend: "up",
      competitorPrice: 95,
      yourPrice: 90,
      recommendation:
        "Consider increasing price by KSH 3 to match market average",
    },
    {
      product: "Cooking Oil 500ml",
      sales: 89,
      profit: 1560,
      trend: "down",
      competitorPrice: 125,
      yourPrice: 130,
      recommendation: "Reduce price by KSH 5 to boost competitiveness",
    },
  ]);

  // Consolidated metrics combining both dashboard approaches
  const metrics: MetricCard[] = [
    {
      title: "Total Revenue",
      value: `KSH ${(creditInfo.used * 2.5).toLocaleString()}`,
      change: 12.5,
      changeType: "positive",
      icon: <DollarSign className="h-8 w-8" />,
      description: "Total earnings this month",
    },
    {
      title: "Active Credit",
      value: `KSH ${creditInfo.used.toLocaleString()}`,
      change: 8.2,
      changeType: "positive",
      icon: <CreditCard className="h-8 w-8" />,
      description: `${creditInfo.available.toLocaleString()} available`,
    },
    {
      title: "Products Listed",
      value: products.length,
      change: 5.1,
      changeType: "positive",
      icon: <Package className="h-8 w-8" />,
      description: `${products.filter((p) => p.stockedToday).length} stocked today`,
    },
    {
      title: "Group Pool Savings",
      value: `${groupPools.reduce((acc, pool) => acc + pool.discount, 0) / groupPools.length}%`,
      change: 15.3,
      changeType: "positive",
      icon: <Users className="h-8 w-8" />,
      description: "Average discount earned",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = showCheetahDealsOnly ? product.isCheetahDeal : true;
    return matchesSearch && matchesFilter;
  });

  const getAlertColor = (level: string) => {
    switch (level) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
            Please sign in to access your retailer dashboard.
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
            <div className="text-6xl">🐆</div>
            <div>
              <h1 className="text-4xl font-bold">
                Cheetah Retailer Command Center
              </h1>
              <p className="text-lg text-muted-foreground">
                Swift operations for the savannah marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              🏪 {profile?.organization?.name || "Independent Retailer"}
            </Badge>
            <Badge
              className={`${creditInfo.status === "good" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              💳 Credit: {creditInfo.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCardComponent key={index} metric={metric} />
          ))}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="credit">Credit & Sales</TabsTrigger>
            <TabsTrigger value="groups">Group Buying</TabsTrigger>
            <TabsTrigger value="insights">Critical Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Credit Status Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Credit Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      KSH {creditInfo.limit.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Credit Limit
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      KSH {creditInfo.used.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      KSH {creditInfo.available.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      KSH {creditInfo.paymentAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next Payment: {creditInfo.nextPayment}
                    </div>
                  </div>
                </div>
                <Progress
                  value={(creditInfo.used / creditInfo.limit) * 100}
                  className="mt-4"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("procurement")}
              >
                <CardContent className="p-6 text-center">
                  <Search className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Search Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Find the best deals from suppliers
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("groups")}
              >
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Group Buying</h3>
                  <p className="text-sm text-muted-foreground">
                    Join pools for better prices
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("inventory")}
              >
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Stock Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Track inventory & alerts
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Procurement Tab */}
          <TabsContent value="procurement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-6 w-6" />
                  Smart Product Procurement
                </CardTitle>
                <CardDescription>
                  Find the best deals with AI-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showCheetahDealsOnly}
                      onCheckedChange={setShowCheetahDealsOnly}
                    />
                    <span className="text-sm">Cheetah Deals Only</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              {product.isCheetahDeal && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  🐆 Cheetah Deal
                                </Badge>
                              )}
                              {product.stockedToday && (
                                <Badge className="bg-green-100 text-green-800">
                                  📦 Fresh Stock
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Price:{" "}
                                </span>
                                <span className="font-medium">
                                  KSH {product.price}
                                </span>
                                {product.discount && (
                                  <span className="ml-1 text-green-600">
                                    (-{product.discount}%)
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Per Kg:{" "}
                                </span>
                                <span className="font-medium">
                                  KSH {product.pricePerKg}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Supplier:{" "}
                                </span>
                                <span className="font-medium">
                                  {product.supplier}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Distance:{" "}
                                </span>
                                <span className="font-medium">
                                  {product.distance} km
                                </span>
                              </div>
                            </div>
                            {product.timeLeft && (
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span className="text-sm text-orange-600">
                                  Deal expires in {product.timeLeft}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm">Add to Cart</Button>
                            <Button size="sm" variant="outline">
                              Compare
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Smart Inventory Management
                </CardTitle>
                <CardDescription>
                  AI-powered stock tracking and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`border ${getAlertColor(item.alertLevel)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <Badge className="mt-1">{item.category}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {item.currentStock}/{item.maxStock}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Last restocked: {item.lastRestocked}
                            </div>
                          </div>
                        </div>

                        <Progress
                          value={(item.currentStock / item.maxStock) * 100}
                          className="mb-3"
                        />

                        {item.aiAlert && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{item.aiAlert}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button size="sm">Restock Now</Button>
                          <Button size="sm" variant="outline">
                            View Suppliers
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credit & Sales Tab */}
          <TabsContent value="credit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Sales Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesInsights.map((insight, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{insight.product}</h4>
                          <div className="flex items-center gap-1">
                            {insight.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : insight.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-gray-600" />
                            )}
                            <span
                              className={
                                insight.trend === "up"
                                  ? "text-green-600"
                                  : insight.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }
                            >
                              {insight.trend.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Sales:{" "}
                            </span>
                            <span className="font-medium">
                              {insight.sales} units
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Profit:{" "}
                            </span>
                            <span className="font-medium">
                              KSH {insight.profit}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Your Price:{" "}
                            </span>
                            <span className="font-medium">
                              KSH {insight.yourPrice}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Market:{" "}
                            </span>
                            <span className="font-medium">
                              KSH {insight.competitorPrice}
                            </span>
                          </div>
                        </div>
                        <Alert>
                          <Target className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {insight.recommendation}
                          </AlertDescription>
                        </Alert>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Debtor Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Credit Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {debtors.map((debtor) => (
                      <Card key={debtor.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{debtor.customerName}</h4>
                          <Badge className={getRiskColor(debtor.riskLevel)}>
                            {debtor.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Amount:{" "}
                            </span>
                            <span className="font-medium text-red-600">
                              KSH {debtor.amount}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Days Overdue:{" "}
                            </span>
                            <span className="font-medium">
                              {debtor.daysPastDue}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Last Contact:{" "}
                            </span>
                            <span className="font-medium">
                              {debtor.lastContact}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Phone:{" "}
                            </span>
                            <span className="font-medium">
                              {debtor.phoneNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            SMS
                          </Button>
                          <Button size="sm">Record Payment</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Group Buying Tab */}
          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Group Buying Pools
                </CardTitle>
                <CardDescription>
                  Join with other retailers for better prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupPools.map((pool) => (
                    <Card
                      key={pool.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={pool.image}
                            alt={pool.product}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {pool.product}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>KSH {pool.pricePerUnit} per unit</span>
                              <Badge className="bg-green-100 text-green-800">
                                {pool.discount}% OFF
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                Progress: {pool.currentParticipants}/
                                {pool.targetParticipants} shops
                              </span>
                              <span>
                                {Math.round(
                                  (pool.currentParticipants /
                                    pool.targetParticipants) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (pool.currentParticipants /
                                  pool.targetParticipants) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {pool.timeLeft} remaining
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Auto opt-in:</span>
                              <Switch checked={pool.autoOptIn} />
                            </div>
                          </div>

                          <Button className="w-full">
                            {pool.currentParticipants >= pool.targetParticipants
                              ? "Pool Complete!"
                              : "Join Pool"}
                          </Button>
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
                Critical Business Insights
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

export default MergedRetailerDashboard;
