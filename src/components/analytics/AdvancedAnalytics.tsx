import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Eye,
  Star,
  MapPin,
  Calendar,
  Download,
  Share2,
  Filter,
  Zap,
  Target,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  trend: number[];
  period: string;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

interface ProductPerformance {
  name: string;
  revenue: number;
  orders: number;
  stock: number;
  growth: number;
  category: string;
}

interface CustomerInsights {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  retention: number;
  color: string;
}

interface GeographicData {
  county: string;
  orders: number;
  revenue: number;
  customers: number;
  growth: number;
}

const MetricCard = ({ metric }: { metric: MetricCard }) => {
  const getTrendColor = (changeType: string) => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const TrendIcon =
    metric.changeType === "increase"
      ? TrendingUp
      : metric.changeType === "decrease"
        ? TrendingDown
        : () => <span>→</span>;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">{metric.icon}</div>
            <div>
              <p className="text-sm text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`flex items-center space-x-1 ${getTrendColor(metric.changeType)}`}
            >
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {Math.abs(metric.change)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">{metric.period}</p>
          </div>
        </div>

        {/* Mini trend chart */}
        <div className="mt-4 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metric.trend.map((value, index) => ({ index, value }))}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  metric.changeType === "increase"
                    ? "#10b981"
                    : metric.changeType === "decrease"
                      ? "#ef4444"
                      : "#6b7280"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const SalesOverview = ({ data }: { data: SalesData[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Sales Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  name === "revenue"
                    ? `KES ${value.toLocaleString()}`
                    : value.toLocaleString(),
                  name === "revenue"
                    ? "Revenue"
                    : name === "orders"
                      ? "Orders"
                      : "Customers",
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Revenue (KES)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductPerformanceTable = ({
  products,
}: {
  products: ProductPerformance[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Top Performing Products</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <span className="text-sm font-medium text-green-800">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-right">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-medium">
                    KES {product.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="font-medium">{product.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p
                    className={`font-medium ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}
                  >
                    {product.stock}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <div
                    className={`flex items-center space-x-1 ${
                      product.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.growth > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(product.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CustomerSegmentation = ({
  segments,
}: {
  segments: CustomerInsights[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Customer Segmentation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, count }) => `${segment}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Details */}
          <div className="space-y-4">
            {segments.map((segment) => (
              <div key={segment.segment} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="font-medium">{segment.segment}</span>
                  </div>
                  <Badge variant="outline">{segment.count} customers</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <p className="font-medium">
                      KES {segment.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Order:</span>
                    <p className="font-medium">
                      KES {segment.avgOrderValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Retention Rate:</span>
                    <span>{segment.retention}%</span>
                  </div>
                  <Progress value={segment.retention} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GeographicAnalysis = ({ data }: { data: GeographicData[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Geographic Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((location, index) => (
            <div
              key={location.county}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-800">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{location.county}</p>
                  <p className="text-sm text-gray-600">
                    {location.customers} customers
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-right">
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="font-medium">{location.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-medium">
                    KES {location.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <div
                    className={`flex items-center space-x-1 ${
                      location.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {location.growth > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(location.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const InsightsAndRecommendations = () => {
  const insights = [
    {
      type: "opportunity",
      title: "Expand to Mombasa Market",
      description:
        "Mombasa shows 45% higher demand for your top products but has low supplier density.",
      impact: "High",
      action: "Consider establishing a distribution center in Mombasa",
      icon: <Target className="h-5 w-5 text-green-600" />,
    },
    {
      type: "warning",
      title: "Inventory Alert",
      description:
        "3 of your top-selling products are running low on stock and may cause stockouts.",
      impact: "Medium",
      action: "Reorder: Maize Flour (5 days left), Cooking Oil (3 days left)",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    {
      type: "success",
      title: "Customer Retention Improving",
      description:
        "Your premium customer segment retention has increased by 23% this quarter.",
      impact: "High",
      action: "Consider creating a loyalty program to further boost retention",
      icon: <Award className="h-5 w-5 text-blue-600" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>AI Insights & Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{insight.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge
                      variant="outline"
                      className={
                        insight.impact === "High"
                          ? "border-red-300 text-red-700"
                          : insight.impact === "Medium"
                            ? "border-amber-300 text-amber-700"
                            : "border-green-300 text-green-700"
                      }
                    >
                      {insight.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {insight.description}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {insight.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductPerformance[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerInsights[]>(
    [],
  );
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const { user } = useAuth();

  // Mock data generation
  useEffect(() => {
    // Generate mock metrics
    const mockMetrics: MetricCard[] = [
      {
        title: "Total Revenue",
        value: "KES 2.4M",
        change: 12.5,
        changeType: "increase",
        icon: <DollarSign className="h-5 w-5 text-green-600" />,
        trend: [100, 120, 110, 140, 135, 155, 170],
        period: "vs last month",
      },
      {
        title: "Orders",
        value: "1,247",
        change: 8.2,
        changeType: "increase",
        icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
        trend: [80, 85, 90, 88, 95, 100, 105],
        period: "vs last month",
      },
      {
        title: "Customers",
        value: "892",
        change: 15.3,
        changeType: "increase",
        icon: <Users className="h-5 w-5 text-purple-600" />,
        trend: [60, 65, 70, 75, 72, 80, 85],
        period: "vs last month",
      },
      {
        title: "Avg Order Value",
        value: "KES 1,924",
        change: 3.1,
        changeType: "decrease",
        icon: <Package className="h-5 w-5 text-amber-600" />,
        trend: [2000, 1950, 1980, 1920, 1940, 1930, 1924],
        period: "vs last month",
      },
    ];

    // Generate mock sales data
    const mockSalesData: SalesData[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockSalesData.push({
        date: date.toISOString(),
        revenue: Math.floor(Math.random() * 100000) + 50000,
        orders: Math.floor(Math.random() * 50) + 20,
        customers: Math.floor(Math.random() * 30) + 15,
        avgOrderValue: Math.floor(Math.random() * 1000) + 1500,
      });
    }

    // Generate mock product data
    const mockProducts: ProductPerformance[] = [
      {
        name: "Premium Maize Flour",
        revenue: 456000,
        orders: 234,
        stock: 45,
        growth: 23.5,
        category: "Food & Beverages",
      },
      {
        name: "Cooking Oil 20L",
        revenue: 320000,
        orders: 156,
        stock: 8,
        growth: 15.2,
        category: "Food & Beverages",
      },
      {
        name: "Rice 25kg",
        revenue: 280000,
        orders: 189,
        stock: 67,
        growth: -5.3,
        category: "Food & Beverages",
      },
      {
        name: "Sugar 50kg",
        revenue: 245000,
        orders: 98,
        stock: 23,
        growth: 8.7,
        category: "Food & Beverages",
      },
    ];

    // Generate mock customer segments
    const mockSegments: CustomerInsights[] = [
      {
        segment: "Premium Buyers",
        count: 125,
        revenue: 890000,
        avgOrderValue: 7120,
        retention: 85,
        color: "#10b981",
      },
      {
        segment: "Regular Customers",
        count: 456,
        revenue: 1200000,
        avgOrderValue: 2630,
        retention: 72,
        color: "#3b82f6",
      },
      {
        segment: "Occasional Buyers",
        count: 311,
        revenue: 310000,
        avgOrderValue: 996,
        retention: 45,
        color: "#f59e0b",
      },
    ];

    // Generate mock geographic data
    const mockGeographic: GeographicData[] = [
      {
        county: "Nairobi",
        orders: 456,
        revenue: 1200000,
        customers: 234,
        growth: 12.5,
      },
      {
        county: "Kiambu",
        orders: 234,
        revenue: 680000,
        customers: 156,
        growth: 8.3,
      },
      {
        county: "Mombasa",
        orders: 189,
        revenue: 520000,
        customers: 98,
        growth: 18.7,
      },
      {
        county: "Nakuru",
        orders: 145,
        revenue: 380000,
        customers: 87,
        growth: 5.2,
      },
      {
        county: "Uasin Gishu",
        orders: 123,
        revenue: 290000,
        customers: 65,
        growth: -2.1,
      },
    ];

    setMetrics(mockMetrics);
    setSalesData(mockSalesData);
    setProductData(mockProducts);
    setCustomerSegments(mockSegments);
    setGeographicData(mockGeographic);
  }, [timeRange]);

  const exportData = () => {
    // Mock export functionality
    console.log("Exporting analytics data...");
    toast({
      title: "Export started",
      description: "Your analytics report will be downloaded shortly",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span>Advanced Analytics</span>
          </h1>
          <p className="text-gray-600">
            Deep insights into your business performance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SalesOverview data={salesData} />
          <div className="grid lg:grid-cols-2 gap-6">
            <ProductPerformanceTable products={productData.slice(0, 3)} />
            <CustomerSegmentation segments={customerSegments} />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductPerformanceTable products={productData} />

          {/* Product Categories Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        category: "Food & Beverages",
                        revenue: 1200000,
                        orders: 567,
                      },
                      { category: "Agriculture", revenue: 890000, orders: 234 },
                      { category: "Textiles", revenue: 450000, orders: 123 },
                      { category: "Electronics", revenue: 320000, orders: 89 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "revenue"
                          ? `KES ${value.toLocaleString()}`
                          : value.toLocaleString(),
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      name="Revenue (KES)"
                    />
                    <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerSegmentation segments={customerSegments} />

          {/* Customer Lifetime Value */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Lifetime Value Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      {
                        month: "Jan",
                        newCustomers: 45,
                        returning: 234,
                        clv: 12500,
                      },
                      {
                        month: "Feb",
                        newCustomers: 67,
                        returning: 267,
                        clv: 13200,
                      },
                      {
                        month: "Mar",
                        newCustomers: 89,
                        returning: 289,
                        clv: 14100,
                      },
                      {
                        month: "Apr",
                        newCustomers: 56,
                        returning: 312,
                        clv: 14800,
                      },
                      {
                        month: "May",
                        newCustomers: 78,
                        returning: 334,
                        clv: 15600,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#3b82f6"
                      name="New Customers"
                    />
                    <Line
                      type="monotone"
                      dataKey="returning"
                      stroke="#10b981"
                      name="Returning Customers"
                    />
                    <Line
                      type="monotone"
                      dataKey="clv"
                      stroke="#f59e0b"
                      name="Avg CLV (KES)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <GeographicAnalysis data={geographicData} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsAndRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
