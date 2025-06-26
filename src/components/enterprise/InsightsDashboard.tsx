import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Clock,
  Eye,
  Target,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Globe,
  Star,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Filter,
  Download,
  Share2,
} from "lucide-react";

interface InsightMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  trend: number[];
  icon: React.ReactNode;
  description: string;
  target?: number;
  unit?: string;
}

interface InsightsDashboardProps {
  userRole?: "supplier" | "retailer" | "driver" | "admin";
  timeframe?: "24h" | "7d" | "30d" | "90d";
  className?: string;
}

export const InsightsDashboard = ({
  userRole = "supplier",
  timeframe = "7d",
  className = "",
}: InsightsDashboardProps) => {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Simulated real-time data based on user role
  const getMetricsForRole = (role: string): InsightMetric[] => {
    switch (role) {
      case "supplier":
        return [
          {
            id: "revenue",
            title: "Monthly Revenue",
            value: "KSH 2.4M",
            change: 18.5,
            changeType: "positive",
            trend: [100, 120, 140, 130, 160, 180, 200],
            icon: <DollarSign className="w-5 h-5 text-green-600" />,
            description: "Revenue from product sales this month",
            target: 85,
            unit: "KSH",
          },
          {
            id: "orders",
            title: "Active Orders",
            value: 156,
            change: 12.3,
            changeType: "positive",
            trend: [80, 90, 95, 110, 120, 140, 156],
            icon: <Package className="w-5 h-5 text-blue-600" />,
            description: "Orders currently being processed",
            target: 92,
            unit: "orders",
          },
          {
            id: "retailers",
            title: "Active Retailers",
            value: 89,
            change: 8.7,
            changeType: "positive",
            trend: [70, 75, 78, 82, 85, 87, 89],
            icon: <Users className="w-5 h-5 text-purple-600" />,
            description: "Retailers who ordered this month",
            target: 75,
            unit: "retailers",
          },
          {
            id: "satisfaction",
            title: "Customer Rating",
            value: "4.8/5",
            change: 2.1,
            changeType: "positive",
            trend: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8],
            icon: <Star className="w-5 h-5 text-yellow-600" />,
            description: "Average customer satisfaction rating",
            target: 96,
            unit: "rating",
          },
        ];
      case "retailer":
        return [
          {
            id: "sales",
            title: "Weekly Sales",
            value: "KSH 485K",
            change: 15.2,
            changeType: "positive",
            trend: [300, 320, 350, 380, 420, 450, 485],
            icon: <TrendingUp className="w-5 h-5 text-green-600" />,
            description: "Sales revenue this week",
            target: 87,
            unit: "KSH",
          },
          {
            id: "inventory",
            title: "Inventory Turnover",
            value: "8.5x",
            change: 6.8,
            changeType: "positive",
            trend: [6, 6.5, 7, 7.5, 8, 8.2, 8.5],
            icon: <Refresh className="w-5 h-5 text-blue-600" />,
            description: "How quickly inventory is sold",
            target: 85,
            unit: "times",
          },
          {
            id: "customers",
            title: "Daily Customers",
            value: 234,
            change: 11.4,
            changeType: "positive",
            trend: [180, 195, 210, 220, 225, 230, 234],
            icon: <Users className="w-5 h-5 text-purple-600" />,
            description: "Average customers per day",
            target: 78,
            unit: "customers",
          },
          {
            id: "margin",
            title: "Profit Margin",
            value: "32%",
            change: 4.2,
            changeType: "positive",
            trend: [28, 29, 30, 31, 31.5, 32, 32],
            icon: <Target className="w-5 h-5 text-orange-600" />,
            description: "Average profit margin on sales",
            target: 89,
            unit: "percent",
          },
        ];
      case "driver":
        return [
          {
            id: "deliveries",
            title: "Daily Deliveries",
            value: 24,
            change: 9.1,
            changeType: "positive",
            trend: [18, 19, 21, 22, 23, 23, 24],
            icon: <Package className="w-5 h-5 text-blue-600" />,
            description: "Deliveries completed today",
            target: 92,
            unit: "deliveries",
          },
          {
            id: "ontime",
            title: "On-Time Rate",
            value: "96.8%",
            change: 2.3,
            changeType: "positive",
            trend: [92, 93, 94, 95, 96, 96.5, 96.8],
            icon: <Clock className="w-5 h-5 text-green-600" />,
            description: "Percentage of on-time deliveries",
            target: 97,
            unit: "percent",
          },
          {
            id: "earnings",
            title: "Daily Earnings",
            value: "KSH 3,200",
            change: 12.5,
            changeType: "positive",
            trend: [2500, 2700, 2800, 2900, 3000, 3100, 3200],
            icon: <DollarSign className="w-5 h-5 text-purple-600" />,
            description: "Earnings from deliveries today",
            target: 88,
            unit: "KSH",
          },
          {
            id: "rating",
            title: "Customer Rating",
            value: "4.9/5",
            change: 1.7,
            changeType: "positive",
            trend: [4.6, 4.7, 4.8, 4.8, 4.9, 4.9, 4.9],
            icon: <Star className="w-5 h-5 text-yellow-600" />,
            description: "Average delivery rating",
            target: 98,
            unit: "rating",
          },
        ];
      default:
        return [];
    }
  };

  const metrics = getMetricsForRole(userRole);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Responsive metric cards
  const MetricCard = ({ metric }: { metric: InsightMetric }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {metric.icon}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
          </div>
          <Badge
            variant={
              metric.changeType === "positive" ? "default" : "destructive"
            }
            className="text-xs"
          >
            {metric.changeType === "positive" ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(metric.change)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-2xl font-bold text-foreground">{metric.value}</div>

        <p className="text-xs text-muted-foreground">{metric.description}</p>

        {metric.target && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to target</span>
              <span>{metric.target}%</span>
            </div>
            <Progress value={metric.target} className="h-2" />
          </div>
        )}

        {/* Mini trend chart */}
        <div className="h-8 flex items-end space-x-1">
          {metric.trend.map((value, index) => (
            <div
              key={index}
              className="bg-blue-200 hover:bg-blue-300 transition-colors flex-1 rounded-sm"
              style={{
                height: `${(value / Math.max(...metric.trend)) * 100}%`,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Mobile-optimized layout
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Performance Insights</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Refresh
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-xs">
              Detailed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              {metrics.slice(0, 2).map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              {metrics.slice(2).map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Performance Insights
          </h2>
          <p className="text-muted-foreground">
            Real-time metrics and analytics for your business
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RotateCcw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Detailed Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Performance Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-end space-x-2">
                      {[65, 70, 68, 75, 82, 78, 85, 88, 92, 87, 94, 96].map(
                        (value, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm flex-1"
                            style={{ height: `${value}%` }}
                          />
                        ),
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Performance has improved 24% over the last 12 periods
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Goal Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monthly Target</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Score</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Period Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">
                        This Week
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        +18.5%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">
                        Last Week
                      </div>
                      <div className="text-2xl font-bold text-gray-600">
                        +12.3%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">
                        Two Weeks Ago
                      </div>
                      <div className="text-2xl font-bold text-gray-600">
                        +8.7%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                <div className="space-y-3">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Strong Performance</h4>
                          <p className="text-sm text-muted-foreground">
                            Your metrics are 23% above average for similar
                            businesses
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Growth Opportunity</h4>
                          <p className="text-sm text-muted-foreground">
                            Consider expanding to evening hours - 34% potential
                            increase in sales
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Attention Needed</h4>
                          <p className="text-sm text-muted-foreground">
                            Response time has increased by 15% - consider
                            optimizing processes
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsDashboard;
