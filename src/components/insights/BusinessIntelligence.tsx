import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Truck,
  Target,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Activity,
  Crown,
  Shield,
  Lightbulb,
  Star,
  Award,
  Timer,
  MapPin,
  Calendar,
} from "lucide-react";

interface BusinessMetric {
  category: string;
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  insight: string;
  priority: "critical" | "high" | "medium" | "low";
  action?: string;
}

interface CrossPlatformAnalysis {
  platform: "web" | "mobile" | "ussd" | "api";
  users: number;
  revenue: number;
  conversionRate: number;
  avgSessionTime: number;
  topFeature: string;
  performance: number;
}

interface MarketIntelligence {
  region: string;
  demand: number;
  supply: number;
  priceIndex: number;
  competition: number;
  opportunity: number;
  risks: string[];
  recommendations: string[];
}

interface PredictiveInsight {
  type: "demand" | "revenue" | "user_growth" | "market_shift";
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: "high" | "medium" | "low";
  recommendation: string;
}

const BusinessIntelligence: React.FC = () => {
  const { user, profile } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([
    {
      category: "Revenue",
      title: "Total GMV",
      value: 45.2,
      unit: "M KSH",
      trend: "up",
      change: 23.4,
      insight: "Strong growth driven by supermarket partnerships",
      priority: "high",
      action: "Scale China Square integration",
    },
    {
      category: "Users",
      title: "Active Traders",
      value: 12840,
      unit: "users",
      trend: "up",
      change: 18.2,
      insight: "USSD adoption accelerating in rural areas",
      priority: "high",
      action: "Expand USSD features",
    },
    {
      category: "Operations",
      title: "Order Fulfillment",
      value: 94.6,
      unit: "%",
      trend: "up",
      change: 3.2,
      insight: "Logistics optimization showing results",
      priority: "medium",
      action: "Optimize last-mile delivery",
    },
    {
      category: "Technology",
      title: "System Uptime",
      value: 99.8,
      unit: "%",
      trend: "stable",
      change: 0.1,
      insight: "Infrastructure performing excellently",
      priority: "low",
      action: "Maintain current monitoring",
    },
    {
      category: "Growth",
      title: "Market Penetration",
      value: 34.7,
      unit: "%",
      trend: "up",
      change: 12.8,
      insight: "Expanding beyond Nairobi successfully",
      priority: "critical",
      action: "Accelerate rural expansion",
    },
    {
      category: "Efficiency",
      title: "Cost per Acquisition",
      value: 89,
      unit: "KSH",
      trend: "down",
      change: -15.4,
      insight: "Marketing efficiency improving",
      priority: "medium",
      action: "Invest in referral programs",
    },
  ]);

  const [crossPlatformData, setCrossPlatformData] = useState<
    CrossPlatformAnalysis[]
  >([
    {
      platform: "web",
      users: 8450,
      revenue: 28500000,
      conversionRate: 12.4,
      avgSessionTime: 8.2,
      topFeature: "Group Buying",
      performance: 94,
    },
    {
      platform: "mobile",
      users: 3240,
      revenue: 12800000,
      conversionRate: 15.8,
      avgSessionTime: 6.1,
      topFeature: "Quick Orders",
      performance: 91,
    },
    {
      platform: "ussd",
      users: 1150,
      revenue: 3900000,
      conversionRate: 8.9,
      avgSessionTime: 2.4,
      topFeature: "Price Checks",
      performance: 87,
    },
    {
      platform: "api",
      users: 890,
      revenue: 15600000,
      conversionRate: 45.2,
      avgSessionTime: 12.8,
      topFeature: "Bulk Orders",
      performance: 98,
    },
  ]);

  const [marketIntelligence, setMarketIntelligence] = useState<
    MarketIntelligence[]
  >([
    {
      region: "Nairobi",
      demand: 89,
      supply: 76,
      priceIndex: 105,
      competition: 85,
      opportunity: 78,
      risks: ["High competition", "Rising delivery costs"],
      recommendations: ["Focus on premium services", "Optimize logistics hubs"],
    },
    {
      region: "Mombasa",
      demand: 72,
      supply: 68,
      priceIndex: 98,
      competition: 62,
      opportunity: 89,
      risks: ["Port delays affecting supply"],
      recommendations: [
        "Expand supplier network",
        "Develop coastal partnerships",
      ],
    },
    {
      region: "Nakuru",
      demand: 68,
      supply: 45,
      priceIndex: 92,
      competition: 41,
      opportunity: 94,
      risks: ["Limited infrastructure", "Seasonal demand"],
      recommendations: [
        "Build local warehouses",
        "Agricultural season planning",
      ],
    },
    {
      region: "Kisumu",
      demand: 54,
      supply: 38,
      priceIndex: 88,
      competition: 35,
      opportunity: 96,
      risks: ["Transport connectivity"],
      recommendations: [
        "Partner with local cooperatives",
        "Mobile payment integration",
      ],
    },
  ]);

  const [predictiveInsights, setPredictiveInsights] = useState<
    PredictiveInsight[]
  >([
    {
      type: "demand",
      title: "Maize Flour Shortage Alert",
      prediction: "23% increase in demand expected in next 2 weeks",
      confidence: 94,
      timeframe: "14 days",
      impact: "high",
      recommendation:
        "Increase maize flour inventory by 1,200 units across major hubs",
    },
    {
      type: "revenue",
      title: "Q4 Revenue Forecast",
      prediction: "Revenue growth of 28% expected in Q4",
      confidence: 87,
      timeframe: "3 months",
      impact: "high",
      recommendation: "Prepare infrastructure for 30% capacity increase",
    },
    {
      type: "user_growth",
      title: "Rural User Expansion",
      prediction: "USSD users will grow by 45% in next month",
      confidence: 91,
      timeframe: "30 days",
      impact: "medium",
      recommendation: "Enhance USSD menu system and add more local languages",
    },
    {
      type: "market_shift",
      title: "Supermarket Partnership Impact",
      prediction: "B2B transactions will represent 60% of GMV by Q1 2025",
      confidence: 83,
      timeframe: "6 months",
      impact: "high",
      recommendation: "Develop enterprise sales team and B2B-specific features",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "web":
        return "💻";
      case "mobile":
        return "📱";
      case "ussd":
        return "☎️";
      case "api":
        return "🔗";
      default:
        return "📊";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Business Intelligence Command Center
          </h2>
          <p className="text-muted-foreground">
            Comprehensive insights across all business dimensions and user
            touchpoints
          </p>
        </div>
        <div className="flex gap-4">
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
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="nakuru">Nakuru</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="platforms">Cross-Platform</TabsTrigger>
          <TabsTrigger value="markets">Market Intel</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🦁</div>
                <div className="text-2xl font-bold text-green-700">45.2M</div>
                <div className="text-sm text-green-600">Total GMV (KSH)</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-blue-700">12,840</div>
                <div className="text-sm text-blue-600">Active Users</div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-purple-700">94.6%</div>
                <div className="text-sm text-purple-600">Fulfillment Rate</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-orange-700">34.7%</div>
                <div className="text-sm text-orange-600">
                  Market Penetration
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Critical Business Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {businessMetrics
                  .filter((m) => m.priority === "critical")
                  .map((metric, index) => (
                    <Alert key={index} className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription>
                        <strong>{metric.title}:</strong> {metric.insight}
                        {metric.action && (
                          <div className="mt-2">
                            <Button size="sm" variant="destructive">
                              {metric.action}
                            </Button>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Key Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {metric.category}
                      </Badge>
                      <h3 className="font-semibold">{metric.title}</h3>
                    </div>
                    <Badge className={getPriorityColor(metric.priority)}>
                      {metric.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold">
                      {metric.value.toLocaleString()} {metric.unit}
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span
                        className={`text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {metric.insight}
                  </p>

                  {metric.action && (
                    <Button size="sm" className="w-full">
                      {metric.action}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cross-Platform Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crossPlatformData.map((platform, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getPlatformIcon(platform.platform)}
                    </span>
                    <div>
                      <div className="text-lg">
                        {platform.platform.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Top Feature: {platform.topFeature}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Users: </span>
                        <span className="font-medium">
                          {platform.users.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium">
                          KSH {(platform.revenue / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Conversion:{" "}
                        </span>
                        <span className="font-medium">
                          {platform.conversionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Session: </span>
                        <span className="font-medium">
                          {platform.avgSessionTime}min
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Score</span>
                        <span>{platform.performance}%</span>
                      </div>
                      <Progress value={platform.performance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="markets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketIntelligence.map((market, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {market.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{market.demand}</div>
                        <div className="text-xs text-muted-foreground">
                          Demand
                        </div>
                        <Progress value={market.demand} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{market.supply}</div>
                        <div className="text-xs text-muted-foreground">
                          Supply
                        </div>
                        <Progress value={market.supply} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {market.opportunity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Opportunity
                        </div>
                        <Progress
                          value={market.opportunity}
                          className="h-1 mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Risks:</h4>
                      <div className="space-y-1">
                        {market.risks.map((risk, riskIndex) => (
                          <div
                            key={riskIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span>{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Recommendations:
                      </h4>
                      <div className="space-y-1">
                        {market.recommendations.map((rec, recIndex) => (
                          <div
                            key={recIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Lightbulb className="h-3 w-3 text-blue-500" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="space-y-4">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {insight.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confidence
                          </Badge>
                          <Badge variant="outline">
                            <Timer className="h-3 w-3 mr-1" />
                            {insight.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-900 mb-1">
                        Prediction:
                      </h4>
                      <p className="text-blue-800">{insight.prediction}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-900 mb-1">
                        Recommendation:
                      </h4>
                      <p className="text-green-800">{insight.recommendation}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">Implement</Button>
                      <Button size="sm" variant="outline">
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Parameters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;
