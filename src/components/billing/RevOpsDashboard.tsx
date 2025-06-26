import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Crown,
  Star,
  Shield,
  Zap,
} from "lucide-react";

interface RevenueMetrics {
  totalRevenue: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
  churnRate: number;
  grossMargin: number;
  netRevenue: number;
}

interface UserSegment {
  segment: string;
  count: number;
  revenue: number;
  churnRate: number;
  arpu: number;
  growth: number;
  icon: string;
}

interface ChurnAnalysis {
  timeframe: string;
  churned: number;
  retained: number;
  reactivated: number;
  reasons: { reason: string; percentage: number }[];
}

interface PaymentMetrics {
  method: string;
  volume: number;
  revenue: number;
  successRate: number;
  avgProcessingTime: number;
}

const RevOpsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    totalRevenue: 2845000,
    mrr: 1250000,
    arr: 15000000,
    arpu: 3850,
    ltv: 24500,
    cac: 8200,
    churnRate: 4.2,
    grossMargin: 68.5,
    netRevenue: 1947300,
  });

  const [userSegments, setUserSegments] = useState<UserSegment[]>([
    {
      segment: "Retailers (Free)",
      count: 2847,
      revenue: 0,
      churnRate: 12.5,
      arpu: 0,
      growth: 23.4,
      icon: "🦓",
    },
    {
      segment: "Retailers (Pro)",
      count: 456,
      revenue: 684000,
      churnRate: 3.8,
      arpu: 1500,
      growth: 18.7,
      icon: "🦁",
    },
    {
      segment: "Suppliers (Growth)",
      count: 89,
      revenue: 756500,
      churnRate: 2.1,
      arpu: 8500,
      growth: 15.2,
      icon: "🐘",
    },
    {
      segment: "Suppliers (Enterprise)",
      count: 23,
      revenue: 575000,
      churnRate: 1.2,
      arpu: 25000,
      growth: 8.9,
      icon: "🌳",
    },
    {
      segment: "Logistics Partners",
      count: 1203,
      revenue: 180300,
      churnRate: 8.7,
      arpu: 150,
      growth: 31.5,
      icon: "🏍️",
    },
  ]);

  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis>({
    timeframe: "Last 30 days",
    churned: 67,
    retained: 1589,
    reactivated: 23,
    reasons: [
      { reason: "Price too high", percentage: 35 },
      { reason: "Lack of features", percentage: 28 },
      { reason: "Poor customer support", percentage: 18 },
      { reason: "Technical issues", percentage: 12 },
      { reason: "Business closure", percentage: 7 },
    ],
  });

  const [paymentMetrics, setPaymentMetrics] = useState<PaymentMetrics[]>([
    {
      method: "M-Pesa",
      volume: 1847,
      revenue: 1650000,
      successRate: 97.3,
      avgProcessingTime: 12,
    },
    {
      method: "Airtel Money",
      volume: 234,
      revenue: 198000,
      successRate: 94.8,
      avgProcessingTime: 18,
    },
    {
      method: "Credit/Debit Card",
      volume: 156,
      revenue: 789000,
      successRate: 92.1,
      avgProcessingTime: 8,
    },
    {
      method: "Bank Transfer",
      volume: 45,
      revenue: 208000,
      successRate: 98.9,
      avgProcessingTime: 1440,
    },
  ]);

  const renderRevenueOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">
                  KES {(revenueMetrics.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Recurring Revenue
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  KES {(revenueMetrics.mrr / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-blue-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.7% vs last month
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ARPU</p>
                <p className="text-2xl font-bold text-purple-600">
                  KES {revenueMetrics.arpu.toLocaleString()}
                </p>
                <p className="text-xs text-purple-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% vs last month
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {revenueMetrics.churnRate}%
                </p>
                <p className="text-xs text-green-500 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.8% vs last month
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LTV:CAC Ratio */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>LTV:CAC Health Score</span>
          </CardTitle>
          <CardDescription>
            Lifetime Value to Customer Acquisition Cost ratio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  Customer Lifetime Value (LTV)
                </div>
                <div className="text-2xl font-bold text-green-600">
                  KES {revenueMetrics.ltv.toLocaleString()}
                </div>
              </div>
              <div className="text-4xl text-gray-300">÷</div>
              <div className="space-y-1 text-right">
                <div className="text-sm text-gray-600">
                  Customer Acquisition Cost (CAC)
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  KES {revenueMetrics.cac.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {(revenueMetrics.ltv / revenueMetrics.cac).toFixed(1)}:1
              </div>
              <div className="text-sm text-gray-600">LTV:CAC Ratio</div>
              <Badge variant="default" className="mt-2 bg-green-600">
                Healthy (Target: 3:1+)
              </Badge>
            </div>

            <Progress
              value={Math.min(
                100,
                (revenueMetrics.ltv / revenueMetrics.cac / 3) * 100,
              )}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserSegments = () => (
    <div className="space-y-6">
      {/* Segment Overview */}
      <div className="grid gap-4">
        {userSegments.map((segment, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{segment.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{segment.segment}</h3>
                    <p className="text-sm text-gray-600">
                      {segment.count.toLocaleString()} users
                    </p>
                  </div>
                </div>
                <Badge variant={segment.growth > 15 ? "default" : "secondary"}>
                  {segment.growth > 0 ? "+" : ""}
                  {segment.growth}% growth
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Revenue</div>
                  <div className="font-semibold text-green-600">
                    KES {(segment.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">ARPU</div>
                  <div className="font-semibold">
                    KES {segment.arpu.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Churn Rate</div>
                  <div
                    className={`font-semibold ${
                      segment.churnRate < 5
                        ? "text-green-600"
                        : segment.churnRate < 10
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {segment.churnRate}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Growth</div>
                  <div className="font-semibold text-blue-600">
                    +{segment.growth}%
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Engage Segment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upsell Opportunities */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span>Upsell Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>High-Value Prospects Identified</AlertTitle>
              <AlertDescription>
                234 free retailers show high engagement (over 50 orders/month).
                Target conversion rate: 30% - potential KES 105K additional MRR
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">
                  🦓 → 🦁 Retailer Upgrades
                </h4>
                <div className="text-sm space-y-1">
                  <div>• 234 high-engagement free users</div>
                  <div>• Avg monthly orders: 67</div>
                  <div>• Conversion potential: 30%</div>
                  <div className="font-medium text-green-600">
                    Revenue opportunity: KES 105K MRR
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">
                  🐘 → 🌳 Supplier Upgrades
                </h4>
                <div className="text-sm space-y-1">
                  <div>• 12 growth suppliers at threshold</div>
                  <div>• Avg monthly GMV: KES 800K</div>
                  <div>• Conversion potential: 25%</div>
                  <div className="font-medium text-green-600">
                    Revenue opportunity: KES 75K MRR
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <Crown className="h-4 w-4 mr-2" />
              Launch Targeted Upsell Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChurnAnalysis = () => (
    <div className="space-y-6">
      {/* Churn Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {churnAnalysis.churned}
            </div>
            <div className="text-sm text-gray-600">Churned Users</div>
            <div className="text-xs text-red-500">
              {(
                (churnAnalysis.churned /
                  (churnAnalysis.churned + churnAnalysis.retained)) *
                100
              ).toFixed(1)}
              % churn rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {churnAnalysis.retained}
            </div>
            <div className="text-sm text-gray-600">Retained Users</div>
            <div className="text-xs text-green-500">
              {(
                (churnAnalysis.retained /
                  (churnAnalysis.churned + churnAnalysis.retained)) *
                100
              ).toFixed(1)}
              % retention rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {churnAnalysis.reactivated}
            </div>
            <div className="text-sm text-gray-600">Reactivated Users</div>
            <div className="text-xs text-blue-500">Win-back success</div>
          </CardContent>
        </Card>
      </div>

      {/* Churn Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Reasons Analysis</CardTitle>
          <CardDescription>
            Understanding why users leave helps improve retention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {churnAnalysis.reasons.map((reason, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{reason.reason}</span>
                  <span className="font-medium">{reason.percentage}%</span>
                </div>
                <Progress value={reason.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retention Strategies */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>🐘 Elephant Memory Retention Program</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">At-Risk User Detection</h4>
                <div className="text-sm space-y-1">
                  <div>• 47 users show declining activity</div>
                  <div>• 23 have payment issues</div>
                  <div>• 12 submitted negative feedback</div>
                </div>
                <Button size="sm" className="mt-3 w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Trigger Outreach
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">Win-Back Campaign</h4>
                <div className="text-sm space-y-1">
                  <div>• 15% discount for churned users</div>
                  <div>• Personal success manager</div>
                  <div>• Feature request priority</div>
                </div>
                <Button size="sm" className="mt-3 w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Offers
                </Button>
              </div>
            </div>

            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                Automated retention triggers reduce churn by 23% on average.
                Current program prevents ~15 churns per month (KES 57K saved
                MRR).
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentAnalytics = () => (
    <div className="space-y-6">
      {/* Payment Methods Performance */}
      <div className="grid gap-4">
        {paymentMetrics.map((method, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.method}</h3>
                    <p className="text-sm text-gray-600">
                      {method.volume} transactions
                    </p>
                  </div>
                </div>
                <Badge
                  variant={method.successRate > 95 ? "default" : "secondary"}
                >
                  {method.successRate}% Success Rate
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Revenue</div>
                  <div className="font-semibold text-green-600">
                    KES {(method.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Volume</div>
                  <div className="font-semibold">{method.volume}</div>
                </div>
                <div>
                  <div className="text-gray-600">Success Rate</div>
                  <div
                    className={`font-semibold ${
                      method.successRate > 95
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {method.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Processing</div>
                  <div className="font-semibold">
                    {method.avgProcessingTime < 60
                      ? `${method.avgProcessingTime}s`
                      : `${Math.floor(method.avgProcessingTime / 60)}m`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collections & Dunning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Collections & Dunning Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-lg font-bold text-orange-600">
                  KES 234K
                </div>
                <div className="text-sm text-gray-600">
                  Outstanding Payments
                </div>
                <div className="text-xs text-orange-500">47 accounts</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-lg font-bold text-red-600">KES 89K</div>
                <div className="text-sm text-gray-600">30+ Days Overdue</div>
                <div className="text-xs text-red-500">12 accounts</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-lg font-bold text-green-600">87%</div>
                <div className="text-sm text-gray-600">Collection Rate</div>
                <div className="text-xs text-green-500">This month</div>
              </div>
            </div>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertTitle>Automated Dunning Active</AlertTitle>
              <AlertDescription>
                SMS reminders sent to 23 accounts. M-Pesa auto-debit scheduled
                for 8 accounts. Escalation to personal calls triggered for 3
                high-value accounts.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Phone className="h-4 w-4 mr-2" />
                Manual Collection Call
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS Reminders
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Overdue Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            📊 Revenue Operations Dashboard
          </h1>
          <p className="text-green-600">
            Complete RevOps analytics for the Savanna ecosystem
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Metrics</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          <TabsTrigger value="payments">Payment Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          {renderRevenueOverview()}
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          {renderUserSegments()}
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          {renderChurnAnalysis()}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {renderPaymentAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevOpsDashboard;
