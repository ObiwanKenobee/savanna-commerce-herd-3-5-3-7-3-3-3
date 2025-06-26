import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  Package,
  DollarSign,
  Bell,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";

interface PricingAlert {
  id: string;
  supplier: string;
  product: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  timestamp: string;
  status: "flagged" | "approved" | "rejected";
  category: string;
}

interface StockoutPrediction {
  id: string;
  product: string;
  supplier: string;
  currentStock: number;
  predictedDays: number;
  confidence: number;
  category: string;
  region: string;
  trendingScore: number;
}

interface PolicyViolation {
  id: string;
  type: "pricing" | "quality" | "delivery" | "terms";
  supplier: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "open" | "investigating" | "resolved";
}

const MarketplaceGovernance = () => {
  const [selectedTab, setSelectedTab] = useState("pricing");

  const pricingAlerts: PricingAlert[] = [
    {
      id: "1",
      supplier: "Maize Masters Ltd",
      product: "White Maize (50kg bag)",
      oldPrice: 3500,
      newPrice: 4200,
      changePercent: 20,
      timestamp: "2 hours ago",
      status: "flagged",
      category: "Grains",
    },
    {
      id: "2",
      supplier: "Fresh Produce Co.",
      product: "Tomatoes (20kg crate)",
      oldPrice: 1200,
      newPrice: 1800,
      changePercent: 50,
      timestamp: "4 hours ago",
      status: "flagged",
      category: "Vegetables",
    },
    {
      id: "3",
      supplier: "Dairy Dreams",
      product: "Fresh Milk (1L)",
      oldPrice: 65,
      newPrice: 75,
      changePercent: 15.4,
      timestamp: "6 hours ago",
      status: "approved",
      category: "Dairy",
    },
  ];

  const stockoutPredictions: StockoutPrediction[] = [
    {
      id: "1",
      product: "Cooking Oil (5L)",
      supplier: "Golden Oil Mills",
      currentStock: 45,
      predictedDays: 3,
      confidence: 94,
      category: "Cooking Essentials",
      region: "Nairobi",
      trendingScore: 8.7,
    },
    {
      id: "2",
      product: "Rice (25kg bag)",
      supplier: "Import Foods Ltd",
      currentStock: 23,
      predictedDays: 2,
      confidence: 89,
      category: "Grains",
      region: "Mombasa",
      trendingScore: 9.2,
    },
    {
      id: "3",
      product: "Sugar (2kg pack)",
      supplier: "Sweet Solutions",
      currentStock: 67,
      predictedDays: 5,
      confidence: 76,
      category: "Baking",
      region: "Kisumu",
      trendingScore: 7.8,
    },
  ];

  const policyViolations: PolicyViolation[] = [
    {
      id: "1",
      type: "delivery",
      supplier: "Late Logistics Co.",
      description: "Consistent delivery delays >48hrs past promised time",
      severity: "high",
      timestamp: "1 day ago",
      status: "investigating",
    },
    {
      id: "2",
      type: "quality",
      supplier: "Questionable Produce",
      description: "Multiple customer complaints about product quality",
      severity: "medium",
      timestamp: "3 days ago",
      status: "open",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "flagged":
      case "open":
        return "bg-red-100 text-red-800";
      case "approved":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const PricingAlertCard = ({ alert }: { alert: PricingAlert }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{alert.product}</h4>
            <p className="text-sm text-muted-foreground">{alert.supplier}</p>
          </div>
          <div className="flex items-center gap-2">
            {alert.changePercent > 15 && <span className="text-lg">🐺</span>}
            <Badge className={getStatusColor(alert.status)}>
              {alert.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Previous Price:</span>
            <span>KSH {alert.oldPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>New Price:</span>
            <span className="font-bold">
              KSH {alert.newPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Change:</span>
            <span
              className={`font-bold ${alert.changePercent > 15 ? "text-red-600" : "text-green-600"}`}
            >
              +{alert.changePercent}%
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Review
          </Button>
          <Button size="sm" variant="default" className="flex-1">
            Suggest Price
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const StockoutCard = ({ prediction }: { prediction: StockoutPrediction }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{prediction.product}</h4>
            <p className="text-sm text-muted-foreground">
              {prediction.supplier}
            </p>
            <p className="text-xs text-muted-foreground">{prediction.region}</p>
          </div>
          <div className="text-right">
            <div className="text-lg">🌳</div>
            <Badge variant="outline" className="text-xs">
              {prediction.confidence}% confidence
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Current Stock:</span>
            <span
              className={
                prediction.currentStock < 50 ? "text-red-600 font-bold" : ""
              }
            >
              {prediction.currentStock} units
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stockout in:</span>
            <span className="font-bold text-orange-600">
              {prediction.predictedDays} days
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Trending Score:</span>
            <span className="font-bold">{prediction.trendingScore}/10</span>
          </div>
        </div>

        <Progress
          value={(prediction.currentStock / 100) * 100}
          className="h-2 mb-3"
        />

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Bell className="h-3 w-3 mr-1" />
            Notify Supplier
          </Button>
          <Button size="sm" variant="default" className="flex-1">
            <Package className="h-3 w-3 mr-1" />
            Suggest Restock
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🏞️ Waterhole Rules</h1>
          <p className="text-muted-foreground">
            Enforce policies and optimize marketplace balance
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Policy Settings
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Actions
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pricing Alerts
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {pricingAlerts.filter((a) => a.status === "flagged").length}
                </p>
              </div>
              <div className="text-2xl">🐺</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stockout Risk
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    stockoutPredictions.filter((p) => p.predictedDays <= 3)
                      .length
                  }
                </p>
              </div>
              <div className="text-2xl">🌳</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Policy Violations
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {policyViolations.filter((v) => v.status === "open").length}
                </p>
              </div>
              <div className="text-2xl">⚖️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Balance Score
                </p>
                <p className="text-2xl font-bold text-green-600">8.7</p>
              </div>
              <div className="text-2xl">⚖️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">🐺 Predatory Pricing</TabsTrigger>
          <TabsTrigger value="stockouts">🌳 Acacia Depletion</TabsTrigger>
          <TabsTrigger value="violations">⚖️ Waterhole Laws</TabsTrigger>
          <TabsTrigger value="balance">🦁 Ecosystem Health</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🐺 Dynamic Pricing Alerts - Predatory Behavior Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">
                      Growth Lever Active: Auto-suggest competitive pricing
                    </span>
                  </div>
                  <p className="text-sm text-amber-700">
                    AI automatically suggests competitive prices to flagged
                    suppliers, improving market balance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingAlerts.map((alert) => (
                    <PricingAlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stockouts" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌳 Acacia Tree Depletion - ML-Powered Stockout Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Growth Lever: Proactive restock nudges
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Machine learning models predict stockouts 5-7 days in
                    advance, enabling proactive supplier notifications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stockoutPredictions.map((prediction) => (
                    <StockoutCard key={prediction.id} prediction={prediction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="violations" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚖️ Waterhole Laws - Policy Enforcement Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyViolations.map((violation) => (
                    <div
                      key={violation.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {violation.supplier}
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {violation.type} violation
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getSeverityColor(violation.severity)}
                          >
                            {violation.severity}
                          </Badge>
                          <Badge className={getStatusColor(violation.status)}>
                            {violation.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm mb-3">{violation.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {violation.timestamp}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Investigate
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="balance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🦁 Supply-Demand Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Maize Supply</span>
                      <span>Balanced</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Dairy Demand</span>
                      <span>High</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Fruit Supply</span>
                      <span>Low</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Market Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Stability</span>
                    <Badge variant="secondary">8.4/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Supplier Diversity</span>
                    <Badge variant="secondary">7.8/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <Badge variant="secondary">9.1/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivery Performance</span>
                    <Badge variant="secondary">8.7/10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Optimization Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Boost Fruit Supplier Recruitment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Adjust Dairy Price Incentives
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Enhance Quality Controls
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Launch Market Balance Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceGovernance;
