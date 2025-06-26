import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react";

interface MarketTrend {
  category: string;
  growth: number;
  volume: number;
  trend: "up" | "down" | "stable";
  icon: string;
}

interface RegionalData {
  region: string;
  sellers: number;
  orders: number;
  revenue: number;
  growth: number;
}

interface TopProduct {
  name: string;
  category: string;
  orders: number;
  revenue: number;
  seller: string;
  rating: number;
}

export const MarketAnalytics = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">(
    "month",
  );

  const marketTrends: MarketTrend[] = [
    {
      category: "Fresh Produce",
      growth: 23.5,
      volume: 1847,
      trend: "up",
      icon: "🥬",
    },
    {
      category: "Grains & Cereals",
      growth: 18.2,
      volume: 1234,
      trend: "up",
      icon: "🌾",
    },
    {
      category: "Spices & Herbs",
      growth: 15.7,
      volume: 892,
      trend: "up",
      icon: "🌿",
    },
    {
      category: "Dairy Products",
      growth: 12.3,
      volume: 567,
      trend: "up",
      icon: "🥛",
    },
    {
      category: "Handcrafts",
      growth: -5.2,
      volume: 234,
      trend: "down",
      icon: "🏺",
    },
    { category: "Textiles", growth: 8.9, volume: 445, trend: "up", icon: "🧵" },
  ];

  const regionalData: RegionalData[] = [
    {
      region: "Nairobi Metro",
      sellers: 342,
      orders: 5670,
      revenue: 2840000,
      growth: 18.5,
    },
    {
      region: "Central Kenya",
      sellers: 289,
      orders: 4230,
      revenue: 2150000,
      growth: 22.1,
    },
    {
      region: "Western Kenya",
      sellers: 234,
      orders: 3890,
      revenue: 1890000,
      growth: 19.7,
    },
    {
      region: "Coast Region",
      sellers: 198,
      orders: 2340,
      revenue: 1450000,
      growth: 15.3,
    },
    {
      region: "Rift Valley",
      sellers: 267,
      orders: 4560,
      revenue: 2230000,
      growth: 20.8,
    },
    {
      region: "Eastern Kenya",
      sellers: 156,
      orders: 1890,
      revenue: 980000,
      growth: 14.2,
    },
  ];

  const topProducts: TopProduct[] = [
    {
      name: "Organic Kale",
      category: "Fresh Produce",
      orders: 1247,
      revenue: 186750,
      seller: "Mama Wanjiku's Greens",
      rating: 4.9,
    },
    {
      name: "Highland Maize",
      category: "Grains",
      orders: 892,
      revenue: 267600,
      seller: "Highland Grains Co-op",
      rating: 4.7,
    },
    {
      name: "Pilipili Spice Mix",
      category: "Spices",
      orders: 567,
      revenue: 113400,
      seller: "Spice Kingdom",
      rating: 4.8,
    },
    {
      name: "Fresh Goat Milk",
      category: "Dairy",
      orders: 445,
      revenue: 89000,
      seller: "Dairy Delights",
      rating: 4.6,
    },
    {
      name: "Kikoy Fabric",
      category: "Textiles",
      orders: 234,
      revenue: 70200,
      seller: "Coastal Crafts",
      rating: 4.5,
    },
  ];

  const marketInsights = [
    {
      title: "Peak Shopping Hours",
      description: "Most orders placed between 10 AM - 2 PM and 6 PM - 8 PM",
      metric: "68%",
      trend: "stable",
    },
    {
      title: "Mobile Usage",
      description: "Majority of sellers access via mobile devices",
      metric: "84%",
      trend: "up",
    },
    {
      title: "QR Code Scans",
      description: "Direct shop visits via QR codes",
      metric: "32%",
      trend: "up",
    },
    {
      title: "Repeat Customers",
      description: "Customer retention rate",
      metric: "76%",
      trend: "up",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string, growth?: number) => {
    if (growth !== undefined) {
      return growth > 0
        ? "text-green-600"
        : growth < 0
          ? "text-red-600"
          : "text-blue-600";
    }
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Market Insights</h2>
          <p className="text-gray-600">
            Data-driven insights about the Savannah marketplace
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={timeframe === "week" ? "default" : "outline"}
            onClick={() => setTimeframe("week")}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            onClick={() => setTimeframe("month")}
            size="sm"
          >
            Month
          </Button>
          <Button
            variant={timeframe === "quarter" ? "default" : "outline"}
            onClick={() => setTimeframe("quarter")}
            size="sm"
          >
            Quarter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="trends">Category Trends</TabsTrigger>
          <TabsTrigger value="regions">Regional Data</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  KSh 12.4M
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+18.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">23,847</div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+22.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">1,486</div>
                <div className="text-sm text-gray-600">Active Sellers</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+12.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">4.7</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+0.2</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketInsights.map((insight, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {insight.title}
                    </h4>
                    {getTrendIcon(insight.trend)}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {insight.metric}
                  </div>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Order Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    156
                  </div>
                  <div className="text-sm text-gray-600">Orders Today</div>
                  <div className="mt-4 h-20 bg-gradient-to-t from-blue-200 to-blue-500 rounded"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Split
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Produce</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Grains</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    +19.2%
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="mt-4 h-20 bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Trends</CardTitle>
              <CardDescription>
                Growth and volume metrics by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((trend, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{trend.icon}</div>
                      <div>
                        <h4 className="font-medium">{trend.category}</h4>
                        <p className="text-sm text-gray-600">
                          {trend.volume} orders this month
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getTrendColor(trend.trend, trend.growth)}`}
                      >
                        {trend.growth > 0 ? "+" : ""}
                        {trend.growth}%
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm text-gray-500">
                          vs last month
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>
                Market activity across different regions of Kenya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalData.map((region, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <h4 className="font-medium">{region.region}</h4>
                      </div>
                      <Badge className={getTrendColor("up", region.growth)}>
                        +{region.growth}% growth
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-bold text-blue-600">
                          {region.sellers}
                        </div>
                        <div className="text-gray-600">Active Sellers</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">
                          {region.orders.toLocaleString()}
                        </div>
                        <div className="text-gray-600">Orders</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600">
                          {formatCurrency(region.revenue)}
                        </div>
                        <div className="text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Best selling products across the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-lg font-bold text-orange-600">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          by {product.seller}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.orders} orders
                      </div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
