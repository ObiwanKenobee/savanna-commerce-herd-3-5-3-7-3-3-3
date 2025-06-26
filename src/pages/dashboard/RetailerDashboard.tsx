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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Phone,
  MessageSquare,
  Gift,
  Crown,
  Heart,
  Truck,
} from "lucide-react";

interface CreditInfo {
  limit: number;
  used: number;
  available: number;
  nextPayment: string;
  paymentAmount: number;
  status: "good" | "warning" | "overdue";
}

interface GroupBuyingPool {
  id: string;
  product: string;
  currentParticipants: number;
  targetParticipants: number;
  discount: number;
  timeLeft: string;
  pricePerUnit: number;
  image: string;
}

interface SalesInsight {
  product: string;
  sales: number;
  profit: number;
  trend: "up" | "down" | "stable";
  competitorPrice: number;
  yourPrice: number;
  recommendation: string;
}

const RetailerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    limit: 50000,
    used: 23500,
    available: 26500,
    nextPayment: "2024-01-15",
    paymentAmount: 5000,
    status: "good",
  });

  const [groupPools, setGroupPools] = useState<GroupBuyingPool[]>([
    {
      id: "1",
      product: "Maize Flour - 2kg Bags",
      currentParticipants: 47,
      targetParticipants: 50,
      discount: 12,
      timeLeft: "2 days",
      pricePerUnit: 85,
      image: "/api/placeholder/60/60",
    },
    {
      id: "2",
      product: "Cooking Oil - 500ml",
      currentParticipants: 32,
      targetParticipants: 40,
      discount: 8,
      timeLeft: "4 days",
      pricePerUnit: 120,
      image: "/api/placeholder/60/60",
    },
    {
      id: "3",
      product: "Sugar - 1kg Packets",
      currentParticipants: 15,
      targetParticipants: 30,
      discount: 15,
      timeLeft: "6 days",
      pricePerUnit: 95,
      image: "/api/placeholder/60/60",
    },
  ]);

  const [salesInsights, setSalesInsights] = useState<SalesInsight[]>([
    {
      product: "Maize Flour 2kg",
      sales: 156,
      profit: 4680,
      trend: "up",
      competitorPrice: 95,
      yourPrice: 98,
      recommendation: "Consider lowering price by KES 2 to match competitors",
    },
    {
      product: "Cooking Oil 500ml",
      sales: 89,
      profit: 1780,
      trend: "down",
      competitorPrice: 125,
      yourPrice: 120,
      recommendation: "Great pricing! Consider stocking more units",
    },
    {
      product: "Sugar 1kg",
      sales: 203,
      profit: 2030,
      trend: "up",
      competitorPrice: 98,
      yourPrice: 95,
      recommendation: "Excellent margin, top performer this month",
    },
  ]);

  const [todayStats, setTodayStats] = useState({
    revenue: 12450,
    orders: 23,
    profit: 3127,
    customers: 18,
  });

  const creditUtilization = (creditInfo.used / creditInfo.limit) * 100;

  const renderHuntingGround = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white p-4 md:p-6 h-auto flex-col space-y-2"
          onClick={() => navigate("/marketplace")}
        >
          <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-semibold text-sm md:text-base">
            Quick Order
          </span>
          <span className="text-xs md:text-sm opacity-90">USSD: *384*7#</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-orange-300 text-orange-700 p-4 md:p-6 h-auto flex-col space-y-2"
          onClick={() => (window.location.href = "/marketplace?filter=deals")}
        >
          <Zap className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-semibold text-sm md:text-base">
            Cheetah Deals
          </span>
          <span className="text-xs md:text-sm">Flash discounts</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-purple-300 text-purple-700 p-4 md:p-6 h-auto flex-col space-y-2 sm:col-span-2 lg:col-span-1"
          onClick={() =>
            window.scrollTo({
              top: document.querySelector("#group-pools")?.offsetTop || 0,
              behavior: "smooth",
            })
          }
        >
          <Users className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-semibold text-sm md:text-base">
            Group Buying
          </span>
          <span className="text-xs md:text-sm">Join pools</span>
        </Button>
      </div>

      {/* Today's Performance */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Today's Hunting Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                KES {todayStats.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todayStats.orders}
              </div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                KES {todayStats.profit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Profit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {todayStats.customers}
              </div>
              <div className="text-sm text-gray-600">Customers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group Buying Pools */}
      <Card className="border-purple-200" id="group-pools">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Active Group Buying Pools</span>
          </CardTitle>
          <CardDescription>
            Join other retailers to unlock bulk discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupPools.map((pool) => (
              <div
                key={pool.id}
                className="border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center p-4 space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={pool.image}
                      alt={pool.product}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm md:text-base truncate">
                        {pool.product}
                      </div>
                      <div className="text-sm text-gray-600">
                        KES {pool.pricePerUnit} per unit
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                        <span className="text-green-600 font-medium">
                          {pool.discount}% discount
                        </span>
                        <span className="text-gray-500">
                          • {pool.timeLeft} left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end space-x-4 sm:space-x-0 sm:space-y-2">
                    <div className="text-center sm:text-right">
                      <div className="text-sm">
                        <span className="font-medium">
                          {pool.currentParticipants}
                        </span>
                        <span className="text-gray-500">
                          /{pool.targetParticipants} shops
                        </span>
                      </div>
                      <Progress
                        value={
                          (pool.currentParticipants / pool.targetParticipants) *
                          100
                        }
                        className="w-20 sm:w-24 h-2 mt-1"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                      onClick={() => {
                        setGroupPools((prev) =>
                          prev.map((p) =>
                            p.id === pool.id
                              ? {
                                  ...p,
                                  currentParticipants:
                                    p.currentParticipants + 1,
                                }
                              : p,
                          ),
                        );
                        alert(
                          `Successfully joined ${pool.product} group buying pool!`,
                        );
                      }}
                    >
                      Join Pool
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWaterholeCredit = () => (
    <div className="space-y-6">
      {/* Credit Overview */}
      <Card
        className={`border-2 ${
          creditInfo.status === "good"
            ? "border-green-200 bg-green-50"
            : creditInfo.status === "warning"
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span>Waterhole Credit Status</span>
            <Badge
              variant={creditInfo.status === "good" ? "default" : "destructive"}
            >
              {creditInfo.status === "good"
                ? "Good Standing"
                : creditInfo.status === "warning"
                  ? "Payment Due Soon"
                  : "Overdue"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Credit Visual */}
            <div className="relative">
              <div className="flex justify-between text-sm mb-2">
                <span>Credit Utilization</span>
                <span>{creditUtilization.toFixed(1)}%</span>
              </div>
              <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    creditUtilization < 70
                      ? "bg-green-500"
                      : creditUtilization < 90
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${creditUtilization}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                  💧 Waterhole Level
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Used: KES {creditInfo.used.toLocaleString()}</span>
                <span>
                  Available: KES {creditInfo.available.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Credit Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-lg font-bold text-blue-600">
                  KES {creditInfo.limit.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Credit Limit</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-lg font-bold text-green-600">
                  KES {creditInfo.available.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available Credit</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-lg font-bold text-orange-600">
                  KES {creditInfo.paymentAmount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Next Payment Due</div>
                <div className="text-xs text-gray-500">
                  {creditInfo.nextPayment}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // Simulate M-Pesa payment
                  alert(
                    "M-Pesa STK Push sent to your phone. Please complete payment with your PIN.",
                  );
                  // In real implementation, integrate with M-Pesa API
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Pay via M-Pesa
              </Button>
              <Button variant="outline" onClick={() => navigate("/billing")}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  alert(
                    "Credit limit increase request submitted. We will review and respond within 2 business days.",
                  );
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Limit Increase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">KES 5,000</div>
                  <div className="text-sm text-gray-600">Jan 1, 2024</div>
                </div>
              </div>
              <Badge variant="default">Paid</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">KES 5,000</div>
                  <div className="text-sm text-gray-600">Jan 15, 2024</div>
                </div>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBaobabInsights = () => (
    <div className="space-y-6">
      {/* Sales Performance */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Sales Performance vs Nearby Shops</span>
          </CardTitle>
          <CardDescription>
            Based on anonymous market data from your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{insight.product}</div>
                      <div className="text-sm text-gray-600">
                        {insight.sales} units sold this month
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {insight.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : insight.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <span className="font-medium text-green-600">
                        KES {insight.profit.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Profit</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Your Price</div>
                    <div className="font-medium">KES {insight.yourPrice}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Market Average</div>
                    <div className="font-medium">
                      KES {insight.competitorPrice}
                    </div>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    💡 {insight.recommendation}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Top Performer
                </span>
              </div>
              <div className="text-lg font-bold">Sugar 1kg</div>
              <div className="text-sm text-green-700">
                203 units sold, KES 2,030 profit
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  Needs Attention
                </span>
              </div>
              <div className="text-lg font-bold">Cooking Oil 500ml</div>
              <div className="text-sm text-yellow-700">
                Sales down 15% this week
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                🛒 Welcome back, {profile?.business_name || "Retailer"}!
              </h1>
              <p className="text-green-600 mt-1">
                Your hunting ground is ready. Let's grow your pride today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600">
                🦓 Waterhole Starter
              </Badge>
              <Button variant="outline" className="border-green-300">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Lion's Pride
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="hunting" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="hunting"
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Hunting Ground</span>
              </TabsTrigger>
              <TabsTrigger
                value="credit"
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Waterhole Credit</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Baobab Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hunting">{renderHuntingGround()}</TabsContent>

            <TabsContent value="credit">{renderWaterholeCredit()}</TabsContent>

            <TabsContent value="insights">{renderBaobabInsights()}</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default RetailerDashboard;
