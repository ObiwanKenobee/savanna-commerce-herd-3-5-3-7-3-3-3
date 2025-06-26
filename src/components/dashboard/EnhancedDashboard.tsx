import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useOrders,
  useProducts,
  useAnalyticsEvents,
} from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Globe,
  Zap,
  Target,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { RealTimeMetrics } from "./RealTimeMetrics";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

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

const QuickActionCard = ({
  title,
  description,
  icon,
  action,
  buttonText,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  buttonText: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button size="sm" onClick={action} className="mt-2">
            {buttonText}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const EnhancedDashboard = () => {
  const { user, profile } = useAuth();
  const { data: orders } = useOrders();
  const { data: products } = useProducts();
  const { data: analytics } = useAnalyticsEvents();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("overview");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please sign in to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate metrics
  const totalOrders = orders?.length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "delivered").length || 0;
  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const totalProducts = products?.length || 0;
  const activeProducts =
    products?.filter((product) => product.status === "active").length || 0;

  const metrics: MetricCard[] = [
    {
      title: "Total Revenue",
      value: `KSH ${totalRevenue.toLocaleString()}`,
      change: 12.5,
      changeType: "positive",
      icon: <DollarSign className="h-8 w-8" />,
      description: "Total earnings this month",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      change: 8.2,
      changeType: "positive",
      icon: <ShoppingCart className="h-8 w-8" />,
      description: `${completedOrders} completed, ${pendingOrders} pending`,
    },
    {
      title: "Products Listed",
      value: totalProducts,
      change: 5.1,
      changeType: "positive",
      icon: <Package className="h-8 w-8" />,
      description: `${activeProducts} active listings`,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: -1.2,
      changeType: "negative",
      icon: <Target className="h-8 w-8" />,
      description: "Orders vs page views",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "List a new product in the marketplace",
      icon: <Package className="h-5 w-5 text-primary" />,
      buttonText: "Add Product",
      action: () => {
        /* Navigate to add product */
      },
    },
    {
      title: "View Analytics",
      description: "Deep dive into your performance metrics",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      buttonText: "View Analytics",
      action: () => {
        /* Navigate to analytics */
      },
    },
    {
      title: "Manage Orders",
      description: "Review and process pending orders",
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
      buttonText: "Manage Orders",
      action: () => {
        /* Navigate to orders */
      },
    },
    {
      title: "Update Profile",
      description: "Keep your business information current",
      icon: <Users className="h-5 w-5 text-primary" />,
      buttonText: "Update Profile",
      action: () => {
        /* Navigate to profile */
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.full_name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.organization?.name} • {profile?.role} •
            {profile?.organization?.country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Status */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                System Status: All Services Operational
              </span>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Live Updates Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <MetricCardComponent key={index} metric={metric} />
            ))}
          </div>

          {/* Real-time Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-Time Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RealTimeMetrics />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders?.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.buyer?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {order.currency} {order.total_amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "processing"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {orders?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products?.slice(0, 5).map((product, index) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock_quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          KSH {product.unit_price.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {products?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No products listed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Target</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Order Fulfillment</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Customer Satisfaction</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Grains", "Fruits", "Vegetables", "Dairy", "Livestock"].map(
                    (category, index) => {
                      const percentage = Math.floor(Math.random() * 40) + 10;
                      return (
                        <div
                          key={category}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"].map(
                    (country, index) => {
                      const orders = Math.floor(Math.random() * 50) + 5;
                      return (
                        <div
                          key={country}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{country}</span>
                          <Badge variant="outline">{orders} orders</Badge>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {orders?.filter((o) => o.status === "processing").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{completedOrders}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {orders?.filter((o) => o.status === "cancelled").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{activeProducts}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {Math.floor(Math.random() * 1000) + 500}
                </p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
