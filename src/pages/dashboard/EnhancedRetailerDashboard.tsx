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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  MapPin,
  Star,
  Target,
  Phone,
  MessageSquare,
  Package,
  ShoppingCart,
  CreditCard,
  Droplets,
  Leaf,
  TreePine,
  Eye,
  Bell,
  Volume2,
  Smartphone,
  Coins,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ProductSearch {
  id: string;
  name: string;
  price: number;
  pricePerKg: number;
  supplier: string;
  distance: number;
  stockedToday: boolean;
  isCheetahDeal: boolean;
  discount?: number;
  timeLeft?: string;
  image: string;
}

interface GroupBuyingPool {
  id: string;
  product: string;
  currentShops: number;
  targetShops: number;
  discount: number;
  pricePerUnit: number;
  timeLeft: string;
  autoOptIn: boolean;
}

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  maxStock: number;
  category: string;
  lastRestocked: string;
  aiAlert?: string;
  alertLevel: "high" | "medium" | "low";
}

interface DebtorRecord {
  id: string;
  customerName: string;
  amount: number;
  daysPastDue: number;
  lastContact: string;
  phoneNumber: string;
  riskLevel: "high" | "medium" | "low";
}

const EnhancedRetailerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheetahDealsOnly, setShowCheetahDealsOnly] = useState(false);
  const [showStockedTodayOnly, setShowStockedTodayOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // Credit Dashboard State
  const [creditInfo, setCreditInfo] = useState({
    total: 50000,
    used: 32000,
    available: 18000,
    nextPayment: 5000,
    dueDate: "2024-02-15",
  });

  // Sound effects simulation
  const playSound = (type: "success" | "alert" | "notification") => {
    // In a real app, you'd play actual sound files
    console.log(
      `🔊 Playing ${type} sound - ${type === "success" ? "🦁 Lion roar" : type === "alert" ? "⚠️ Alert beep" : "🐦 Bird chirp"}`,
    );

    // Haptic feedback simulation for mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(type === "success" ? [100, 50, 100] : [50]);
    }
  };

  const [searchResults, setSearchResults] = useState<ProductSearch[]>([
    {
      id: "1",
      name: "Soko Bora Unga 2kg (Lion Brand)",
      price: 180,
      pricePerKg: 90,
      supplier: "Bidco East Africa",
      distance: 2.3,
      stockedToday: true,
      isCheetahDeal: true,
      discount: 15,
      timeLeft: "2h 15m",
      image: "/api/placeholder/60/60",
    },
    {
      id: "2",
      name: "Fresh Milk 1L (Daily)",
      price: 65,
      pricePerKg: 65,
      supplier: "Brookside Dairy",
      distance: 1.8,
      stockedToday: true,
      isCheetahDeal: false,
      image: "/api/placeholder/60/60",
    },
    {
      id: "3",
      name: "Cooking Oil 500ml (Elianto)",
      price: 125,
      pricePerKg: 250,
      supplier: "Bidco East Africa",
      distance: 2.3,
      stockedToday: false,
      isCheetahDeal: true,
      discount: 20,
      timeLeft: "45m",
      image: "/api/placeholder/60/60",
    },
  ]);

  const [groupPools, setGroupPools] = useState<GroupBuyingPool[]>([
    {
      id: "1",
      product: "Wheat Flour 2kg",
      currentShops: 8,
      targetShops: 10,
      discount: 12,
      pricePerUnit: 160,
      timeLeft: "6 hours",
      autoOptIn: true,
    },
    {
      id: "2",
      product: "Sugar 1kg Packets",
      currentShops: 15,
      targetShops: 20,
      discount: 8,
      pricePerUnit: 95,
      timeLeft: "2 days",
      autoOptIn: false,
    },
  ]);

  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Maize Flour",
      currentStock: 12,
      maxStock: 50,
      category: "Staples",
      lastRestocked: "2 days ago",
      aiAlert: "Order maize now—3 shops nearby ran out yesterday",
      alertLevel: "high",
    },
    {
      id: "2",
      name: "Cooking Oil",
      currentStock: 35,
      maxStock: 40,
      category: "Cooking",
      lastRestocked: "1 day ago",
      alertLevel: "low",
    },
    {
      id: "3",
      name: "Sugar",
      currentStock: 8,
      maxStock: 30,
      category: "Staples",
      lastRestocked: "3 days ago",
      aiAlert: "Stock running low - consider restocking by tomorrow",
      alertLevel: "medium",
    },
  ]);

  const [debtors, setDebtors] = useState<DebtorRecord[]>([
    {
      id: "1",
      customerName: "Mama Jane Kiosk",
      amount: 2500,
      daysPastDue: 5,
      lastContact: "2024-01-10",
      phoneNumber: "+254700123456",
      riskLevel: "medium",
    },
    {
      id: "2",
      customerName: "Kisumu Hardware",
      amount: 8900,
      daysPastDue: 15,
      lastContact: "2023-12-28",
      phoneNumber: "+254701234567",
      riskLevel: "high",
    },
  ]);

  const filteredSearchResults = searchResults.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCheetahFilter = !showCheetahDealsOnly || item.isCheetahDeal;
    const matchesStockedFilter = !showStockedTodayOnly || item.stockedToday;
    return matchesSearch && matchesCheetahFilter && matchesStockedFilter;
  });

  const creditUsagePercentage = (creditInfo.used / creditInfo.total) * 100;

  const renderHuntingGround = () => (
    <div className="space-y-6">
      {/* Smart Search */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-orange-600" />
            <span>🏹 Smart Hunting Search</span>
          </CardTitle>
          <CardDescription>
            Find the best deals across the savanna with AI-powered
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, suppliers, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showCheetahDealsOnly}
                onCheckedChange={setShowCheetahDealsOnly}
              />
              <label className="flex items-center space-x-1 text-sm font-medium">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Cheetah Deals Only</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showStockedTodayOnly}
                onCheckedChange={setShowStockedTodayOnly}
              />
              <label className="flex items-center space-x-1 text-sm font-medium">
                <Package className="h-4 w-4 text-green-500" />
                <span>Stocked Today</span>
              </label>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-3">
            {filteredSearchResults.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.isCheetahDeal && (
                          <Badge className="bg-yellow-500 text-black animate-pulse">
                            <Zap className="h-3 w-3 mr-1" />⚡ Cheetah Deal
                          </Badge>
                        )}
                        {item.stockedToday && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200"
                          >
                            Fresh Today
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          KES {item.price} (KES {item.pricePerKg}/kg)
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.distance}km away
                        </span>
                        <span>{item.supplier}</span>
                      </div>
                      {item.isCheetahDeal && (
                        <div className="text-sm font-medium text-orange-600">
                          {item.discount}% OFF - {item.timeLeft} left!
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        playSound("success");
                        alert(
                          "🦁 Product added to cart! Lion roars with approval!",
                        );
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                    {item.isCheetahDeal && (
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Quick View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Buying Pool */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-purple-600" />
            <span>🦓 Group Buying Pools</span>
          </CardTitle>
          <CardDescription>
            Join the herd for bulk discounts - strength in numbers!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupPools.map((pool) => (
              <div key={pool.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{pool.product}</h3>
                    <div className="text-sm text-gray-600">
                      KES {pool.pricePerUnit} per unit
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-purple-600">
                      {pool.discount}% discount
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {pool.timeLeft} left
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {pool.currentShops}/{pool.targetShops} shops joined
                    </span>
                    <span>
                      {Math.round((pool.currentShops / pool.targetShops) * 100)}
                      % complete
                    </span>
                  </div>
                  <Progress
                    value={(pool.currentShops / pool.targetShops) * 100}
                    className="h-3"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pool.autoOptIn}
                      onCheckedChange={() => {
                        setGroupPools((prev) =>
                          prev.map((p) =>
                            p.id === pool.id
                              ? { ...p, autoOptIn: !p.autoOptIn }
                              : p,
                          ),
                        );
                      }}
                    />
                    <span className="text-sm">Auto-join for this staple</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      setGroupPools((prev) =>
                        prev.map((p) =>
                          p.id === pool.id
                            ? { ...p, currentShops: p.currentShops + 1 }
                            : p,
                        ),
                      );
                      playSound("notification");
                      alert("🦓 Joined the herd! Bird chirps in celebration!");
                    }}
                  >
                    Join Pool
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBaobabStock = () => (
    <div className="space-y-6">
      {/* Visual Stock Levels */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TreePine className="h-6 w-6 text-green-600" />
            <span>🌳 Baobab Stock Tracker</span>
          </CardTitle>
          <CardDescription>
            Watch your inventory like the mighty baobab watches the savanna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockItems.map((item) => {
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              const getTreeEmoji = () => {
                if (stockPercentage > 60) return "🌳"; // Full tree
                if (stockPercentage > 30) return "🌲"; // Medium tree
                if (stockPercentage > 10) return "🌿"; // Small tree
                return "🥀"; // Withered
              };

              return (
                <Card
                  key={item.id}
                  className={`${
                    item.alertLevel === "high"
                      ? "border-red-300 bg-red-50"
                      : item.alertLevel === "medium"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-green-300 bg-green-50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTreeEmoji()}</span>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      {item.alertLevel === "high" && (
                        <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock Level</span>
                        <span className="font-medium">
                          {item.currentStock}/{item.maxStock} units
                        </span>
                      </div>
                      <Progress
                        value={stockPercentage}
                        className={`h-3 ${
                          stockPercentage < 30
                            ? "bg-red-100"
                            : stockPercentage < 60
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                      />
                      <div className="text-xs text-gray-500">
                        Last restocked: {item.lastRestocked}
                      </div>
                    </div>

                    {item.aiAlert && (
                      <Alert className="mt-3 border-orange-300 bg-orange-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          🤖 AI Alert: {item.aiAlert}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        playSound("notification");
                        navigate(
                          "/marketplace?category=" +
                            item.category.toLowerCase(),
                        );
                      }}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Restock Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hyena List - Debt Tracking */}
      <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-orange-600" />
            <span>🐺 Hyena List - Debt Tracker</span>
          </CardTitle>
          <CardDescription>
            Keep track of customers who owe money (syncs with BNPL)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {debtors.map((debtor) => (
              <div
                key={debtor.id}
                className={`p-4 border rounded-lg ${
                  debtor.riskLevel === "high"
                    ? "border-red-300 bg-red-50"
                    : debtor.riskLevel === "medium"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{debtor.customerName}</h3>
                    <div className="text-sm text-gray-600">
                      KES {debtor.amount.toLocaleString()} •{" "}
                      {debtor.daysPastDue} days overdue
                    </div>
                    <div className="text-xs text-gray-500">
                      Last contact: {debtor.lastContact}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        debtor.riskLevel === "high"
                          ? "destructive"
                          : debtor.riskLevel === "medium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {debtor.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.location.href = `tel:${debtor.phoneNumber}`;
                      }}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.location.href = `sms:${debtor.phoneNumber}?body=Hi ${debtor.customerName.split(" ")[0]}, friendly reminder about your outstanding balance of KES ${debtor.amount}. Please contact us to arrange payment. Thank you!`;
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
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

  const renderWaterholeCredit = () => {
    const getWaterholeLevel = () => {
      if (creditUsagePercentage < 30) return "High 💧💧💧";
      if (creditUsagePercentage < 70) return "Medium 💧💧";
      if (creditUsagePercentage < 90) return "Low 💧";
      return "Critical 🚨";
    };

    return (
      <div className="space-y-6">
        {/* Credit Dashboard with Waterhole Visual */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              <span>💧 Waterhole Credit Dashboard</span>
            </CardTitle>
            <CardDescription>
              Your credit flows like water in the savanna - use wisely!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Circular Waterhole Graphic */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <div className="w-full h-full rounded-full border-8 border-blue-200 bg-blue-50 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-1000 ease-in-out rounded-full"
                    style={{ height: `${creditUsagePercentage}%` }}
                  />
                  <div className="relative z-10 text-center text-white font-bold">
                    <div className="text-2xl">💧</div>
                    <div className="text-lg">{getWaterholeLevel()}</div>
                    <div className="text-sm">
                      {Math.round(100 - creditUsagePercentage)}% Available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  KES {creditInfo.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Credit Limit</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  KES {creditInfo.used.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Credit Used</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  KES {creditInfo.available.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available Credit</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Alert className="border-green-200 bg-green-50">
                <Coins className="h-4 w-4" />
                <AlertDescription>
                  💰 Quick Pay: Lipa KES{" "}
                  {creditInfo.nextPayment.toLocaleString()} to unlock KES{" "}
                  {(creditInfo.nextPayment * 4).toLocaleString()} more credit!
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    playSound("success");
                    alert(
                      "🦁 M-Pesa STK Push sent! Check your phone and enter your PIN.",
                    );
                  }}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Pay via M-Pesa
                </Button>
                <Button variant="outline" onClick={() => navigate("/billing")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Payment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    playSound("notification");
                    alert(
                      "🐘 Credit limit increase request submitted! Our elephants never forget and will review within 2 business days.",
                    );
                  }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Request Increase
                </Button>
              </div>
            </div>

            {/* Payment Reminder */}
            <Card
              className={`border-2 ${
                new Date(creditInfo.dueDate) < new Date()
                  ? "border-red-300 bg-red-50"
                  : "border-yellow-300 bg-yellow-50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Next Payment Due</h3>
                    <p className="text-sm text-gray-600">
                      KES {creditInfo.nextPayment.toLocaleString()} due on{" "}
                      {creditInfo.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    <Button size="sm" variant="outline">
                      <Volume2 className="h-4 w-4 mr-1" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Credit History */}
        <Card>
          <CardHeader>
            <CardTitle>🏛️ Waterhole History</CardTitle>
            <CardDescription>
              Your credit usage and payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  date: "2024-01-15",
                  type: "Payment",
                  amount: -5000,
                  description: "M-Pesa payment received",
                },
                {
                  date: "2024-01-10",
                  type: "Purchase",
                  amount: 3500,
                  description: "Bulk order - Maize flour",
                },
                {
                  date: "2024-01-08",
                  type: "Purchase",
                  amount: 1200,
                  description: "Cooking oil restock",
                },
              ].map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.type === "Payment"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      transaction.amount < 0
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {transaction.amount < 0 ? "" : "+"}KES{" "}
                    {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Wildlife Greeting */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                🛒 Welcome back to the Hunting Ground,{" "}
                {profile?.business_name || "Lion Pride"}!
              </h1>
              <p className="text-green-600 mt-1">
                🦁 The savanna is full of opportunities today. Let's hunt for
                the best deals!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600 animate-pulse">
                🦓 Waterhole Starter
              </Badge>
              <Button variant="outline" className="border-green-300">
                <Star className="h-4 w-4 mr-2" />
                Upgrade Pride
              </Button>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="hunting" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
              <TabsTrigger
                value="hunting"
                className="flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>🏹 Hunting Ground</span>
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="flex items-center space-x-2"
              >
                <TreePine className="h-4 w-4" />
                <span>🌳 Baobab Stock</span>
              </TabsTrigger>
              <TabsTrigger
                value="credit"
                className="flex items-center space-x-2"
              >
                <Droplets className="h-4 w-4" />
                <span>💧 Waterhole Credit</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hunting">{renderHuntingGround()}</TabsContent>

            <TabsContent value="stock">{renderBaobabStock()}</TabsContent>

            <TabsContent value="credit">{renderWaterholeCredit()}</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EnhancedRetailerDashboard;
