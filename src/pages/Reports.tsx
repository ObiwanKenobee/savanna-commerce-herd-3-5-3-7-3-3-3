import { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  FileText,
  PieChart,
  LineChart,
  DollarSign,
  Users,
  ShoppingCart,
  Truck,
  Target,
  Award,
  Globe,
  Zap,
  Eye,
  Share2,
  Settings,
} from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  icon: React.ElementType;
  metrics: string[];
}

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("last-30-days");

  const reportTemplates: ReportTemplate[] = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description:
        "High-level overview of platform performance and key business metrics",
      category: "executive",
      frequency: "Weekly",
      lastGenerated: "2 hours ago",
      icon: BarChart3,
      metrics: ["Revenue", "User Growth", "Transaction Volume", "Market Share"],
    },
    {
      id: "financial-performance",
      name: "Financial Performance",
      description:
        "Comprehensive financial analysis with revenue breakdowns and projections",
      category: "financial",
      frequency: "Monthly",
      lastGenerated: "1 day ago",
      icon: DollarSign,
      metrics: ["Revenue", "Profit Margins", "Cost Analysis", "ROI"],
    },
    {
      id: "user-engagement",
      name: "User Engagement",
      description:
        "User behavior analysis, retention rates, and engagement metrics",
      category: "analytics",
      frequency: "Weekly",
      lastGenerated: "6 hours ago",
      icon: Users,
      metrics: [
        "DAU/MAU",
        "Session Duration",
        "Retention Rate",
        "Feature Usage",
      ],
    },
    {
      id: "sales-performance",
      name: "Sales Performance",
      description:
        "Sales metrics, conversion rates, and product performance analysis",
      category: "sales",
      frequency: "Daily",
      lastGenerated: "30 minutes ago",
      icon: TrendingUp,
      metrics: [
        "Sales Volume",
        "Conversion Rate",
        "Average Order Value",
        "Top Products",
      ],
    },
    {
      id: "supply-chain",
      name: "Supply Chain Analytics",
      description:
        "Supplier performance, delivery metrics, and logistics optimization",
      category: "operations",
      frequency: "Weekly",
      lastGenerated: "4 hours ago",
      icon: Truck,
      metrics: [
        "Delivery Times",
        "Supplier Ratings",
        "Inventory Levels",
        "Logistics Costs",
      ],
    },
    {
      id: "market-intelligence",
      name: "Market Intelligence",
      description:
        "Market trends, competitive analysis, and growth opportunities",
      category: "strategic",
      frequency: "Monthly",
      lastGenerated: "3 days ago",
      icon: Target,
      metrics: ["Market Size", "Competition", "Trends", "Opportunities"],
    },
    {
      id: "customer-satisfaction",
      name: "Customer Satisfaction",
      description:
        "Customer feedback, support metrics, and satisfaction scores",
      category: "customer",
      frequency: "Weekly",
      lastGenerated: "1 day ago",
      icon: Award,
      metrics: ["NPS Score", "Support Tickets", "Reviews", "Retention"],
    },
    {
      id: "regional-performance",
      name: "Regional Performance",
      description:
        "Performance metrics across different African markets and regions",
      category: "geographic",
      frequency: "Monthly",
      lastGenerated: "5 days ago",
      icon: Globe,
      metrics: [
        "Regional Revenue",
        "User Distribution",
        "Market Penetration",
        "Growth Rates",
      ],
    },
  ];

  const dashboardMetrics = [
    {
      title: "Total Revenue",
      value: "KSH 450.2M",
      change: "+23.5%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Active Users",
      value: "89,432",
      change: "+12.8%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Transaction Volume",
      value: "2.4M",
      change: "+18.2%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Average Order Value",
      value: "KSH 8,750",
      change: "+5.7%",
      trend: "up",
      period: "vs last month",
    },
  ];

  const topPerformingProducts = [
    {
      name: "Solar Panels",
      revenue: "KSH 45.2M",
      growth: "+67%",
      orders: "1,234",
    },
    {
      name: "Mobile Phones",
      revenue: "KSH 38.7M",
      growth: "+34%",
      orders: "2,456",
    },
    {
      name: "Agricultural Tools",
      revenue: "KSH 29.4M",
      growth: "+89%",
      orders: "567",
    },
    {
      name: "Office Supplies",
      revenue: "KSH 22.1M",
      growth: "+23%",
      orders: "3,421",
    },
    { name: "Textiles", revenue: "KSH 18.9M", growth: "+12%", orders: "1,876" },
  ];

  const regionalData = [
    {
      region: "East Africa",
      revenue: "KSH 180M",
      users: "34.5K",
      growth: "+28%",
    },
    {
      region: "West Africa",
      revenue: "KSH 95M",
      users: "18.2K",
      growth: "+45%",
    },
    {
      region: "Southern Africa",
      revenue: "KSH 120M",
      users: "25.1K",
      growth: "+19%",
    },
    {
      region: "Central Africa",
      revenue: "KSH 55M",
      users: "11.6K",
      growth: "+67%",
    },
  ];

  const filteredReports = reportTemplates.filter(
    (report) =>
      selectedCategory === "all" || report.category === selectedCategory,
  );

  const categories = [
    { value: "all", label: "All Reports", count: reportTemplates.length },
    {
      value: "executive",
      label: "Executive",
      count: reportTemplates.filter((r) => r.category === "executive").length,
    },
    {
      value: "financial",
      label: "Financial",
      count: reportTemplates.filter((r) => r.category === "financial").length,
    },
    {
      value: "analytics",
      label: "Analytics",
      count: reportTemplates.filter((r) => r.category === "analytics").length,
    },
    {
      value: "operations",
      label: "Operations",
      count: reportTemplates.filter((r) => r.category === "operations").length,
    },
    {
      value: "strategic",
      label: "Strategic",
      count: reportTemplates.filter((r) => r.category === "strategic").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              📊 Reports & Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive business intelligence and data-driven insights for
              the savanna ecosystem.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="last-year">Last year</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics.map((metric, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {metric.title}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {metric.period}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <BarChart3 className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reports">Report Library</TabsTrigger>
            <TabsTrigger value="dashboard">Live Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedCategory(category.value)}
                      className="space-x-2"
                    >
                      <span>{category.label}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const Icon = report.icon;
                return (
                  <Card
                    key={report.id}
                    className="hover:shadow-xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Icon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {report.name}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {report.frequency}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {report.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Key Metrics
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {report.metrics.map((metric, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Last generated: {report.lastGenerated}
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Top Performing Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.orders} orders
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{product.revenue}</div>
                          <div className="text-sm text-green-600">
                            {product.growth}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Regional Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{region.region}</span>
                          <div className="text-right">
                            <span className="font-bold">{region.revenue}</span>
                            <div className="text-sm text-green-600">
                              {region.growth}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{region.users} users</span>
                          <span>Growing {region.growth}</span>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Sales by Category</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">
                      Sales Distribution Chart
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5" />
                    <span>Revenue Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">
                      Revenue Trend Chart
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>User Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">
                      User Growth Chart
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Cohort Analysis
                      </h4>
                      <p className="text-sm text-blue-700">
                        Track user retention and behavior patterns over time
                      </p>
                      <Button size="sm" className="mt-2">
                        View Analysis
                      </Button>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">
                        Funnel Analysis
                      </h4>
                      <p className="text-sm text-green-700">
                        Analyze conversion rates through your sales funnel
                      </p>
                      <Button size="sm" className="mt-2">
                        View Funnel
                      </Button>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">
                        Segmentation
                      </h4>
                      <p className="text-sm text-purple-700">
                        Segment users by behavior, demographics, and preferences
                      </p>
                      <Button size="sm" className="mt-2">
                        Create Segments
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Customer Acquisition Cost</span>
                      <span className="font-bold">KSH 450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Lifetime Value</span>
                      <span className="font-bold">KSH 12,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Monthly Recurring Revenue</span>
                      <span className="font-bold">KSH 25.4M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Churn Rate</span>
                      <span className="font-bold text-red-600">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Net Promoter Score</span>
                      <span className="font-bold text-green-600">72</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>AI-Generated Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h4 className="font-medium mb-2">🚀 Growth Opportunity</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Solar panel demand is expected to increase by 340% in Q2
                      due to new government incentives. Consider expanding
                      supplier partnerships in renewable energy sector.
                    </p>
                    <Badge className="bg-blue-600">95% Confidence</Badge>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
                    <h4 className="font-medium mb-2">📈 Market Expansion</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Uganda and Tanzania markets show 78% readiness for
                      platform expansion. Low competition and high demand for
                      B2B marketplace solutions.
                    </p>
                    <Badge className="bg-green-600">91% Confidence</Badge>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
                    <h4 className="font-medium mb-2">⚡ Optimization</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Route optimization can improve delivery efficiency by 23%
                      using alternative logistics partners. Potential cost
                      savings of KSH 2.3M monthly.
                    </p>
                    <Badge className="bg-orange-600">87% Confidence</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Create Custom Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Report Name</label>
                      <input
                        type="text"
                        placeholder="My Custom Report"
                        className="w-full mt-1 p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full mt-1 p-2 border rounded-lg">
                        <option>Financial</option>
                        <option>Operations</option>
                        <option>Analytics</option>
                        <option>Strategic</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Data Sources</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        "Orders",
                        "Users",
                        "Products",
                        "Payments",
                        "Reviews",
                        "Analytics",
                        "Geography",
                        "Time",
                      ].map((source) => (
                        <label
                          key={source}
                          className="flex items-center space-x-2"
                        >
                          <input type="checkbox" />
                          <span className="text-sm">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Metrics to Include
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {[
                        "Revenue",
                        "Growth Rate",
                        "User Count",
                        "Conversion Rate",
                        "Average Order",
                        "Market Share",
                      ].map((metric) => (
                        <label
                          key={metric}
                          className="flex items-center space-x-2"
                        >
                          <input type="checkbox" />
                          <span className="text-sm">{metric}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Frequency</label>
                      <select className="w-full mt-1 p-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Format</label>
                      <select className="w-full mt-1 p-2 border rounded-lg">
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                        <option>PowerPoint</option>
                      </select>
                    </div>
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
