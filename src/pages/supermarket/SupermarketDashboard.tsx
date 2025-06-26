import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  Zap,
  Eye,
  MapPin,
  Activity,
  Clock,
  Star,
  ShoppingCart,
  Target,
  Truck,
  BarChart3,
} from "lucide-react";

interface SupermarketBranch {
  id: string;
  name: string;
  chain: "naivas" | "china-square" | "quickmart";
  location: string;
  stockLevel: number;
  dailySales: number;
  customerTraffic: number;
  status: "active" | "maintenance" | "low-stock";
  lastSync: string;
}

interface PriceAlert {
  id: string;
  product: string;
  currentPrice: number;
  competitorPrice: number;
  competitor: string;
  priceChange: number;
  alertType: "lions-deal" | "price-drop" | "competitor-alert";
  severity: "low" | "medium" | "high" | "critical";
}

interface HerdBuying {
  id: string;
  product: string;
  targetQuantity: number;
  currentQuantity: number;
  discount: number;
  timeRemaining: string;
  participants: number;
}

const SupermarketDashboard = () => {
  const [branches, setBranches] = useState<SupermarketBranch[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [herdBuying, setHerdBuying] = useState<HerdBuying[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Mock supermarket branches data
    const mockBranches: SupermarketBranch[] = [
      {
        id: "naivas-001",
        name: "Naivas Nakuru",
        chain: "naivas",
        location: "Nakuru Town",
        stockLevel: 87,
        dailySales: 234000,
        customerTraffic: 1247,
        status: "active",
        lastSync: "2 minutes ago",
      },
      {
        id: "china-001",
        name: "China Square Mega",
        chain: "china-square",
        location: "Nairobi CBD",
        stockLevel: 92,
        dailySales: 456000,
        customerTraffic: 2134,
        status: "active",
        lastSync: "1 minute ago",
      },
      {
        id: "quickmart-001",
        name: "Quickmart Thika Road",
        chain: "quickmart",
        location: "Thika Road",
        stockLevel: 34,
        dailySales: 178000,
        customerTraffic: 890,
        status: "low-stock",
        lastSync: "5 minutes ago",
      },
    ];

    // Mock price alerts
    const mockPriceAlerts: PriceAlert[] = [
      {
        id: "alert-001",
        product: "Unga wa Mahindi 2kg",
        currentPrice: 140,
        competitorPrice: 125,
        competitor: "Tuskys",
        priceChange: -12,
        alertType: "lions-deal",
        severity: "high",
      },
      {
        id: "alert-002",
        product: "Cooking Oil 1L",
        currentPrice: 280,
        competitorPrice: 260,
        competitor: "Carrefour",
        priceChange: -8,
        alertType: "competitor-alert",
        severity: "medium",
      },
    ];

    // Mock herd buying data
    const mockHerdBuying: HerdBuying[] = [
      {
        id: "herd-001",
        product: "Sugar 2kg Bags",
        targetQuantity: 50,
        currentQuantity: 34,
        discount: 15,
        timeRemaining: "2h 15m",
        participants: 23,
      },
      {
        id: "herd-002",
        product: "Rice 5kg Bags",
        targetQuantity: 30,
        currentQuantity: 28,
        discount: 12,
        timeRemaining: "45m",
        participants: 19,
      },
    ];

    setBranches(mockBranches);
    setPriceAlerts(mockPriceAlerts);
    setHerdBuying(mockHerdBuying);
  }, []);

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "naivas":
        return "bg-green-100 text-green-700";
      case "china-square":
        return "bg-red-100 text-red-700";
      case "quickmart":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getChainEmoji = (chain: string) => {
    switch (chain) {
      case "naivas":
        return "🦒"; // Giraffe for Naivas (tall view across branches)
      case "china-square":
        return "🐘"; // Elephant for China Square (bulk/memory)
      case "quickmart":
        return "🐆"; // Cheetah for Quickmart (speed)
      default:
        return "🦁";
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalStats = {
    totalBranches: branches.length,
    averageStock: Math.round(
      branches.reduce((sum, b) => sum + b.stockLevel, 0) / branches.length,
    ),
    totalDailySales: branches.reduce((sum, b) => sum + b.dailySales, 0),
    totalCustomers: branches.reduce((sum, b) => sum + b.customerTraffic, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🏪 Supermarket Command Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Pride Lands Management</strong> - Monitor your supermarket
            empire across Kenya's digital savannah with real-time inventory,
            competitive pricing, and herd buying analytics.
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            Real-time Sync • Competitive Intelligence • Herd Buying Analytics •
            USSD Integration
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Store className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.totalBranches}
              </div>
              <div className="text-sm text-amber-600">Active Branches</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.averageStock}%
              </div>
              <div className="text-sm text-green-600">Avg Stock Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                KSH {totalStats.totalDailySales.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Daily Sales</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">Today's Customers</div>
            </CardContent>
          </Card>
        </div>

        {/* Price Alert */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>🦁 Lion's Deal Alert:</strong> Unga wa Mahindi prices
            dropped 12% below competitor rates. Activate "Termite Mound"
            auto-undercut algorithm to maintain 2% price advantage.
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">🌍 Overview</TabsTrigger>
            <TabsTrigger value="branches">🏪 Branches</TabsTrigger>
            <TabsTrigger value="pricing">💰 Pricing</TabsTrigger>
            <TabsTrigger value="herd-buying">🦓 Herd Buying</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Branch Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Branch Health Monitor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">
                            {getChainEmoji(branch.chain)}
                          </span>
                          <span className="font-medium">{branch.name}</span>
                          <Badge className={getChainColor(branch.chain)}>
                            {branch.chain}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {branch.lastSync}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Stock:</span>
                          <div className="font-medium">
                            {branch.stockLevel}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sales:</span>
                          <div className="font-medium">
                            KSH {branch.dailySales.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Traffic:
                          </span>
                          <div className="font-medium">
                            {branch.customerTraffic}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <Progress value={branch.stockLevel} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Herd Buying */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>🦓 Active Herd Buying</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {herdBuying.map((herd) => (
                    <div
                      key={herd.id}
                      className="p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">
                          {herd.product}
                        </h4>
                        <Badge className="bg-green-100 text-green-700">
                          {herd.discount}% off
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Progress: {herd.currentQuantity}/
                            {herd.targetQuantity}
                          </span>
                          <span>{herd.participants} participants</span>
                        </div>
                        <Progress
                          value={
                            (herd.currentQuantity / herd.targetQuantity) * 100
                          }
                          className="h-3"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Time left: {herd.timeRemaining}</span>
                          <span>
                            {herd.targetQuantity - herd.currentQuantity} needed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Price Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>🦁 Lion's Deal Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceAlerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={getAlertSeverityColor(alert.severity)}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>{alert.product}</strong> - Price dropped{" "}
                          {Math.abs(alert.priceChange)}% below{" "}
                          {alert.competitor} (KSH {alert.competitorPrice})
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Update Price</Button>
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-bold mb-2">Branch Management</h3>
                <p className="text-muted-foreground">
                  Detailed branch analytics, inventory management, and staff
                  performance metrics coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">
                  Competitive Pricing Dashboard
                </h3>
                <p className="text-muted-foreground">
                  Real-time competitor price monitoring, "Termite Mound"
                  algorithm controls, and market analysis tools.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="herd-buying" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">🦓</div>
                <h3 className="text-xl font-bold mb-2">
                  Herd Buying Campaign Manager
                </h3>
                <p className="text-muted-foreground">
                  Create and manage collective buying campaigns, bulk discount
                  triggers, and community shopping incentives.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">
                  Baobab Tree Analytics
                </h3>
                <p className="text-muted-foreground">
                  Deep market insights, margin distribution analysis,
                  cross-chain performance metrics, and predictive analytics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupermarketDashboard;
