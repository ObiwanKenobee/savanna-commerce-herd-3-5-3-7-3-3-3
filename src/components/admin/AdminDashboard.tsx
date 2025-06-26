import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Truck,
  AlertTriangle,
  Zap,
  BarChart3,
  Globe,
  Shield,
  Target,
  Search,
  MousePointer,
  Eye,
} from "lucide-react";

interface MetricData {
  current: number;
  previous: number;
  trend: "up" | "down" | "stable";
  change: number;
}

interface SavannaPulseData {
  transactionsPerMinute: number;
  activeUsers: number;
  deliveryETAs: number;
  serverLoad: number;
  wildebeestHerd: number; // Visual load indicator
}

const AdminDashboard = () => {
  const [pulseData, setPulseData] = useState<SavannaPulseData>({
    transactionsPerMinute: 147,
    activeUsers: 2340,
    deliveryETAs: 23,
    serverLoad: 67,
    wildebeestHerd: 67,
  });

  const [revenueStreams, setRevenueStreams] = useState({
    commissions: {
      current: 2345000,
      previous: 2100000,
      trend: "up" as const,
      change: 11.7,
    },
    subscriptions: {
      current: 890000,
      previous: 920000,
      trend: "down" as const,
      change: -3.3,
    },
    advertisements: {
      current: 456000,
      previous: 420000,
      trend: "up" as const,
      change: 8.6,
    },
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseData((prev) => ({
        ...prev,
        transactionsPerMinute: Math.floor(Math.random() * 50) + 120,
        activeUsers: Math.floor(Math.random() * 200) + 2200,
        serverLoad: Math.floor(Math.random() * 30) + 60,
        wildebeestHerd: Math.floor(Math.random() * 30) + 60,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const WildebeestHerd = ({ count }: { count: number }) => {
    const herdSize = Math.ceil(count / 10);
    return (
      <div className="flex items-center justify-center gap-1 my-4">
        {Array.from({ length: Math.min(herdSize, 10) }).map((_, i) => (
          <span
            key={i}
            className="text-2xl animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            🦓
          </span>
        ))}
        <div className="ml-2 text-sm text-muted-foreground">Load: {count}%</div>
      </div>
    );
  };

  const MetricCard = ({
    title,
    icon,
    data,
    format = "number",
    suffix = "",
  }: {
    title: string;
    icon: React.ReactNode;
    data: MetricData;
    format?: "number" | "currency";
    suffix?: string;
  }) => {
    const formatValue = (value: number) => {
      if (format === "currency") {
        return `KSH ${(value / 1000).toFixed(0)}K`;
      }
      return value.toLocaleString() + suffix;
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{formatValue(data.current)}</p>
              <div
                className={`flex items-center gap-1 text-xs ${
                  data.trend === "up"
                    ? "text-green-600"
                    : data.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {data.trend === "up"
                  ? "↗️"
                  : data.trend === "down"
                    ? "↘️"
                    : "➡️"}
                <span>{Math.abs(data.change)}% from last month</span>
              </div>
            </div>
            <div className="text-muted-foreground">{icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🦁 Command Center</h1>
          <p className="text-muted-foreground">
            Oversee the savanna ecosystem in real-time
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Growth Dashboard
          </Button>
        </div>
      </div>

      {/* Savanna Pulse Widget */}
      <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            🌍 Savanna Pulse - Real-Time Ecosystem Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {pulseData.transactionsPerMinute}
              </div>
              <div className="text-sm text-muted-foreground">
                Transactions/Min
              </div>
              <div className="mt-2">⚡ Live</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {pulseData.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="mt-2">👥 Online</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {pulseData.deliveryETAs}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Delivery ETA (min)
              </div>
              <div className="mt-2">🚚 Moving</div>
            </div>

            <div className="text-center">
              <WildebeestHerd count={pulseData.wildebeestHerd} />
              <div className="text-sm text-muted-foreground">
                Server Load Balance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          💰 Revenue Streams - Pride Territory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="🦁 Commission Revenue (Lion's Share)"
            icon={<DollarSign className="h-8 w-8" />}
            data={revenueStreams.commissions}
            format="currency"
          />

          <MetricCard
            title="🐘 Subscription Revenue (Elephant Memory)"
            icon={<Users className="h-8 w-8" />}
            data={revenueStreams.subscriptions}
            format="currency"
          />

          <MetricCard
            title="🐆 Ad Revenue (Cheetah Speed)"
            icon={<Target className="h-8 w-8" />}
            data={revenueStreams.advertisements}
            format="currency"
          />
        </div>
      </div>

      {/* Quick Actions & Insights */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">🚨 Drought Alerts</TabsTrigger>
          <TabsTrigger value="growth">📈 Growth Levers</TabsTrigger>
          <TabsTrigger value="performance">⚡ Performance</TabsTrigger>
          <TabsTrigger value="ecosystem">🌿 Ecosystem</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-800">
                      Maize Stock Drought ⚠️
                    </p>
                    <p className="text-sm text-red-600">
                      Nakuru region - 85% suppliers low stock
                    </p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Intervene
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-amber-800">
                      Driver Shortage 🚚
                    </p>
                    <p className="text-sm text-amber-600">
                      Mombasa routes - Peak demand period
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Scale Fleet
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-800">
                      High Conversion Zone 📈
                    </p>
                    <p className="text-sm text-blue-600">
                      Kisumu - 34% above average
                    </p>
                  </div>
                  <Button size="sm" variant="default">
                    Boost Ads
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      USSD Onboarding Optimization
                    </span>
                    <Badge variant="secondary">+50% shops</Badge>
                  </div>
                  <Progress value={75} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">White-label Portal Launch</span>
                    <Badge variant="secondary">5 premiums</Badge>
                  </div>
                  <Progress value={60} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vulture Watch AI Deployment</span>
                    <Badge variant="secondary">-15% fraud</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Peak Performance Windows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Morning Rush (7-9 AM)</span>
                    <span className="font-bold">167 TPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lunch Peak (12-2 PM)</span>
                    <span className="font-bold">203 TPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evening Surge (5-7 PM)</span>
                    <span className="font-bold">189 TPM</span>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Schedule Promotions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 High-LTV User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Maize Wholesalers</span>
                    <Badge>KSH 45K avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dairy Cooperatives</span>
                    <Badge>KSH 67K avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fruit Exporters</span>
                    <Badge>KSH 89K avg</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm" variant="outline">
                  Launch Loyalty Program
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌍 Territory Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-sm text-muted-foreground">
                      Kenya Coverage Map
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nairobi</span>
                      <span className="text-green-600">●●●●● 95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mombasa</span>
                      <span className="text-green-600">●●●●○ 78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kisumu</span>
                      <span className="text-yellow-600">●●●○○ 56%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Nakuru</span>
                      <span className="text-red-600">●●○○○ 34%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚡ System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Response Time</span>
                      <span>234ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Database Query Speed</span>
                      <span>12ms</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Payment Success Rate</span>
                      <span>97.8%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Conversion Funnels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Visitor → Registration</span>
                      <span>12.4%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Registration → First Order</span>
                      <span>34.7%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Cart → Checkout</span>
                      <span>67.9%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ecosystem" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🦁 Pride Leaders (Top Suppliers)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🥇</span>
                      <span className="text-sm">Mama Mboga Co.</span>
                    </div>
                    <Badge>KSH 2.3M</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🥈</span>
                      <span className="text-sm">Maize Masters</span>
                    </div>
                    <Badge>KSH 1.8M</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🥉</span>
                      <span className="text-sm">Dairy Dreams</span>
                    </div>
                    <Badge>KSH 1.5M</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🐘 Elephant Memory (Loyal Buyers)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retail Champions</span>
                    <Badge variant="secondary">847 orders</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Customers</span>
                    <Badge variant="secondary">92.3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Order Value</span>
                    <Badge variant="secondary">KSH 12.4K</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🦓 Migration Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Nairobi → Mombasa</span>
                    <span>23% traffic</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Central → Coast</span>
                    <span>18% traffic</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rift Valley → Western</span>
                    <span>15% traffic</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* SEO Performance Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          🔍 SEO Performance - Digital Savannah Visibility
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Search className="h-4 w-4 text-green-600" />
                Organic Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">2.4M</div>
              <div className="text-xs text-muted-foreground">
                Monthly visitors
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                SEO Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">87/100</div>
              <div className="text-xs text-muted-foreground">
                Average across pages
              </div>
              <Progress value={87} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-purple-600" />
                CTR (Click Rate)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3.2%</div>
              <div className="text-xs text-muted-foreground">
                Search results
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">+0.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-600" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">8.7M</div>
              <div className="text-xs text-muted-foreground">Monthly total</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600">+18.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Keywords & Regional Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                🏆 Top Performing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">unga wholesale nairobi</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Pos 1</Badge>
                    <span className="text-xs text-muted-foreground">
                      45.6K clicks
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">sukari bei nafuu kenya</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Pos 2</Badge>
                    <span className="text-xs text-muted-foreground">
                      32.1K clicks
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">maharagwe jumla mombasa</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pos 3</Badge>
                    <span className="text-xs text-muted-foreground">
                      28.9K clicks
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">wholesale food suppliers</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pos 4</Badge>
                    <span className="text-xs text-muted-foreground">
                      24.3K clicks
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                🌍 Regional SEO Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇰🇪 Kenya</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">
                      1.8M visits
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇹🇿 Tanzania</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">
                      456K visits
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇺🇬 Uganda</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">
                      234K visits
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇷🇼 Rwanda</span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">
                      89K visits
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
