import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Star,
  Shield,
  Zap,
} from "lucide-react";

interface ProductMetrics {
  totalProducts: number;
  pendingApproval: number;
  approvedToday: number;
  rejectedToday: number;
  averageApprovalTime: number;
  topCategories: Array<{ category: string; count: number; trend: number }>;
  supplierStats: Array<{ supplier: string; products: number; rating: number }>;
  priceAlerts: Array<{
    product: string;
    oldPrice: number;
    newPrice: number;
    change: number;
  }>;
  geographicDistribution: Array<{
    region: string;
    products: number;
    suppliers: number;
  }>;
  uploadMethods: Array<{ method: string; count: number; percentage: number }>;
  moderationStats: {
    aiApproved: number;
    humanReviewed: number;
    communityReported: number;
    averageScore: number;
  };
}

interface RealTimeAlert {
  id: string;
  type: "price_surge" | "stock_shortage" | "fraud_detected" | "high_demand";
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  category?: string;
  region?: string;
}

export const ProductAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ProductMetrics>({
    totalProducts: 0,
    pendingApproval: 0,
    approvedToday: 0,
    rejectedToday: 0,
    averageApprovalTime: 0,
    topCategories: [],
    supplierStats: [],
    priceAlerts: [],
    geographicDistribution: [],
    uploadMethods: [],
    moderationStats: {
      aiApproved: 0,
      humanReviewed: 0,
      communityReported: 0,
      averageScore: 0,
    },
  });

  const [realTimeAlerts, setRealTimeAlerts] = useState<RealTimeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadAnalyticsData();

    // Set up real-time updates
    const interval = setInterval(() => {
      loadAnalyticsData();
      checkForAlerts();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Mock data - in production, fetch from analytics service
      const mockMetrics: ProductMetrics = {
        totalProducts: 1247,
        pendingApproval: 23,
        approvedToday: 156,
        rejectedToday: 12,
        averageApprovalTime: 18,
        topCategories: [
          { category: "Staples", count: 345, trend: 12 },
          { category: "Vegetables", count: 289, trend: -5 },
          { category: "Fruits", count: 234, trend: 18 },
          { category: "Meat", count: 167, trend: 8 },
          { category: "Dairy", count: 123, trend: -2 },
        ],
        supplierStats: [
          { supplier: "Nakuru Farmers Coop", products: 89, rating: 4.8 },
          { supplier: "Maasai Mara Traders", products: 67, rating: 4.6 },
          { supplier: "Kiambu Coffee Farmers", products: 45, rating: 4.9 },
          { supplier: "Mombasa Fish Market", products: 38, rating: 4.4 },
          { supplier: "Turkana Artisans", products: 29, rating: 4.7 },
        ],
        priceAlerts: [
          {
            product: "Unga Pembe 1kg",
            oldPrice: 120,
            newPrice: 140,
            change: 16.7,
          },
          {
            product: "Sukari Nyeupe 1kg",
            oldPrice: 150,
            newPrice: 170,
            change: 13.3,
          },
          {
            product: "Mchele wa India 1kg",
            oldPrice: 180,
            newPrice: 200,
            change: 11.1,
          },
        ],
        geographicDistribution: [
          { region: "Nairobi", products: 312, suppliers: 89 },
          { region: "Central Kenya", products: 267, suppliers: 76 },
          { region: "Rift Valley", products: 234, suppliers: 65 },
          { region: "Western Kenya", products: 189, suppliers: 52 },
          { region: "Coast", products: 145, suppliers: 38 },
          { region: "Northern Kenya", products: 100, suppliers: 28 },
        ],
        uploadMethods: [
          { method: "Web Upload", count: 567, percentage: 45.5 },
          { method: "USSD", count: 389, percentage: 31.2 },
          { method: "WhatsApp", count: 178, percentage: 14.3 },
          { method: "Bulk CSV", count: 113, percentage: 9.0 },
        ],
        moderationStats: {
          aiApproved: 89,
          humanReviewed: 67,
          communityReported: 12,
          averageScore: 0.87,
        },
      };

      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkForAlerts = () => {
    // Mock real-time alerts
    const mockAlerts: RealTimeAlert[] = [
      {
        id: "alert_001",
        type: "price_surge",
        message: "20+ maize flour submissions in last hour - possible shortage",
        severity: "high",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        category: "staples",
        region: "Nairobi",
      },
      {
        id: "alert_002",
        type: "high_demand",
        message: "High demand for tomatoes in Mombasa - 15 orders pending",
        severity: "medium",
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        category: "vegetables",
        region: "Coast",
      },
      {
        id: "alert_003",
        type: "fraud_detected",
        message: "Suspicious bulk upload detected - 50+ identical products",
        severity: "high",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
    ];

    setRealTimeAlerts(mockAlerts);
  };

  const renderOverviewCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="text-2xl font-bold">
                  {metrics.totalProducts.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this week
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold">{metrics.pendingApproval}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Avg {metrics.averageApprovalTime}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved Today
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.approvedToday}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% vs yesterday
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  AI Accuracy
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {(metrics.moderationStats.averageScore * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  Vulture Watch AI
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRealTimeAlerts = () => {
    if (realTimeAlerts.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Real-Time Alerts</span>
            <Badge variant="destructive" className="ml-auto">
              {realTimeAlerts.filter((a) => a.severity === "high").length} High
              Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realTimeAlerts.map((alert) => (
              <Alert
                key={alert.id}
                className={
                  alert.severity === "high"
                    ? "border-red-200 bg-red-50"
                    : alert.severity === "medium"
                      ? "border-orange-200 bg-orange-50"
                      : "border-blue-200 bg-blue-50"
                }
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    alert.severity === "high"
                      ? "text-red-600"
                      : alert.severity === "medium"
                        ? "text-orange-600"
                        : "text-blue-600"
                  }`}
                />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                        {alert.category && ` • ${alert.category}`}
                        {alert.region && ` • ${alert.region}`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCategoryAnalysis = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Top Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topCategories.map((category, index) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.count} products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={category.trend > 0 ? "default" : "secondary"}
                    >
                      {category.trend > 0 ? "+" : ""}
                      {category.trend}%
                    </Badge>
                    {category.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Top Suppliers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.supplierStats.map((supplier, index) => (
                <div
                  key={supplier.supplier}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.supplier}</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.products} products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{supplier.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPriceAlerts = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Price Alerts</span>
            <Badge variant="outline">{metrics.priceAlerts.length} active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.priceAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p className="font-medium">{alert.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.oldPrice} KSh → {alert.newPrice} KSh
                  </p>
                </div>
                <Badge variant="destructive">+{alert.change.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGeographicDistribution = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.geographicDistribution.map((region, index) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{region.region}</span>
                  <div className="text-sm text-muted-foreground">
                    {region.products} products • {region.suppliers} suppliers
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(region.products / metrics.totalProducts) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUploadMethods = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Upload Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.uploadMethods.map((method, index) => (
              <div key={method.method} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{method.method}</span>
                  <div className="text-sm text-muted-foreground">
                    {method.count} ({method.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderModerationStats = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Moderation Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {metrics.moderationStats.aiApproved}
              </p>
              <p className="text-sm text-green-700">AI Auto-Approved</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {metrics.moderationStats.humanReviewed}
              </p>
              <p className="text-sm text-blue-700">Human Reviewed</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {metrics.moderationStats.communityReported}
              </p>
              <p className="text-sm text-orange-700">Community Reported</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {(metrics.moderationStats.averageScore * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-purple-700">Average AI Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Product Analytics Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
                Refresh
              </Button>
            </div>
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time insights into product uploads, moderation, and marketplace
            activity
          </p>
        </CardHeader>
      </Card>

      {renderOverviewCards()}
      {renderRealTimeAlerts()}

      {/* Detailed Analytics */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories & Suppliers</TabsTrigger>
          <TabsTrigger value="geography">Geographic</TabsTrigger>
          <TabsTrigger value="methods">Upload Methods</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {renderCategoryAnalysis()}
          {renderPriceAlerts()}
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          {renderGeographicDistribution()}
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {renderUploadMethods()}
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          {renderModerationStats()}
        </TabsContent>
      </Tabs>

      {/* Cultural Integration Notice */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🦅</div>
            <div>
              <h4 className="font-medium text-orange-900">
                Savannah Analytics Intelligence
              </h4>
              <p className="text-sm text-orange-700">
                This dashboard provides real-time insights into the Savannah
                marketplace ecosystem, including multi-channel uploads (USSD,
                Web, WhatsApp, Bulk CSV), AI moderation performance, cultural
                verification effectiveness, and regional market trends across
                Kenya.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalyticsDashboard;
