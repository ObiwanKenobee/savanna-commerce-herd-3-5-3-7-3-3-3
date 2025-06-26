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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Camera,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  BarChart3,
  Package,
  Users,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Eye,
  Crown,
  Shield,
  Truck,
  DollarSign,
  Percent,
  Calendar,
  Bell,
  Image,
  Sparkles,
  Brain,
  FileText,
  Award,
  ThumbsUp,
  Activity,
} from "lucide-react";

interface ProductListing {
  id: string;
  name: string;
  originalName: string;
  aiSuggestedName: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: "active" | "pending" | "out_of_stock";
  views: number;
  orders: number;
}

interface CompetitorData {
  name: string;
  price: number;
  marketShare: number;
  yourPosition: number;
}

interface StockoutPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  dailySales: number;
  daysUntilStockout: number;
  confidence: number;
  riskLevel: "high" | "medium" | "low";
}

interface PromotionCampaign {
  id: string;
  productName: string;
  currentStock: number;
  suggestedDiscount: number;
  targetShops: number;
  potentialRevenue: number;
  urgency: "high" | "medium" | "low";
  reason: string;
}

const EnhancedSupplierDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  // Rhino Scorecard Data
  const [scorecard, setScorecard] = useState({
    overall: 87,
    onTimeDelivery: 94,
    stockAccuracy: 91,
    customerRating: 4.6,
    responseTime: 2.3,
    rank: 2,
    totalSuppliers: 156,
    badges: ["🦁", "🐘", "🦓"],
  });

  // Competitive Analysis
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([
    { name: "Bidco East Africa", price: 85, marketShare: 35, yourPosition: 2 },
    {
      name: "Kapa Oil Refineries",
      price: 90,
      marketShare: 25,
      yourPosition: 1,
    },
    { name: "Local Suppliers", price: 95, marketShare: 20, yourPosition: 1 },
  ]);

  // Product Listings with AI
  const [products, setProducts] = useState<ProductListing[]>([
    {
      id: "1",
      name: "Maize Flour 1kg",
      originalName: "Maize Flour 1kg",
      aiSuggestedName: "Soko Bora Unga 1kg (Lion Brand)",
      price: 85,
      stock: 450,
      category: "Flour",
      image: "/api/placeholder/80/80",
      status: "active",
      views: 234,
      orders: 67,
    },
    {
      id: "2",
      name: "Cooking Oil 500ml",
      originalName: "Cooking Oil 500ml",
      aiSuggestedName: "Golden Savanna Oil 500ml (Premium)",
      price: 125,
      stock: 12,
      category: "Cooking Oil",
      image: "/api/placeholder/80/80",
      status: "active",
      views: 189,
      orders: 23,
    },
  ]);

  // Stockout Predictions
  const [stockoutPredictions, setStockoutPredictions] = useState<
    StockoutPrediction[]
  >([
    {
      productId: "2",
      productName: "Cooking Oil 500ml",
      currentStock: 12,
      dailySales: 8,
      daysUntilStockout: 1.5,
      confidence: 94,
      riskLevel: "high",
    },
    {
      productId: "1",
      productName: "Maize Flour 1kg",
      currentStock: 450,
      dailySales: 25,
      daysUntilStockout: 18,
      confidence: 87,
      riskLevel: "low",
    },
  ]);

  // Dynamic Promotions
  const [promotions, setPromotions] = useState<PromotionCampaign[]>([
    {
      id: "1",
      productName: "Expired Milk Cartons (100 units)",
      currentStock: 100,
      suggestedDiscount: 15,
      targetShops: 50,
      potentialRevenue: 42500,
      urgency: "high",
      reason: "Clear expired inventory before total loss",
    },
    {
      id: "2",
      productName: "Seasonal Rice (200kg)",
      currentStock: 200,
      suggestedDiscount: 10,
      targetShops: 30,
      potentialRevenue: 54000,
      urgency: "medium",
      reason: "End of season clearance opportunity",
    },
  ]);

  const playSound = (type: "success" | "alert" | "notification") => {
    console.log(
      `🔊 ${type === "success" ? "🦁 Lion roar" : type === "alert" ? "⚠️ Alert" : "🐦 Bird chirp"}`,
    );
    if ("vibrate" in navigator) {
      navigator.vibrate(type === "success" ? [100, 50, 100] : [50]);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    // Simulate upload and AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate AI suggestions
    const newProduct = {
      id: Date.now().toString(),
      name: "New Product",
      originalName: "Product Name from Image",
      aiSuggestedName: '🤖 AI Suggested: "Premium Savanna Blend (Fresh)"',
      price: 0,
      stock: 0,
      category: "New",
      image: "/api/placeholder/80/80",
      status: "pending" as const,
      views: 0,
      orders: 0,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setUploading(false);
    playSound("success");
  };

  const renderPrideCatalog = () => (
    <div className="space-y-6">
      {/* AI-Powered Product Upload */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>🧠 AI-Powered Product Listing</span>
          </CardTitle>
          <CardDescription>
            🐘 Elephant Memory suggests optimal titles and descriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Image className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <p className="font-medium">Upload Product Images</p>
                <p className="text-sm text-gray-600">
                  AI will analyze and suggest improvements
                </p>
              </label>
            </div>

            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert(
                    "📱 WhatsApp integration: Send product photos to +254-XXXX to auto-list!",
                  );
                }}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                📱 WhatsApp Bulk Upload
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Snap photos → Send to WhatsApp → Auto-list products
              </p>
            </div>
          </div>

          {/* AI Processing Indicator */}
          {uploading && (
            <Alert className="border-blue-200 bg-blue-50">
              <Sparkles className="h-4 w-4 animate-spin" />
              <AlertDescription>
                🤖 AI is analyzing your images and generating optimized product
                listings...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Product Listings with AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>📦 Your Pride Catalog</CardTitle>
          <CardDescription>
            AI-optimized product listings for maximum visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    {/* Current vs AI Suggested Names */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Current Name:
                        </label>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      {product.name !== product.aiSuggestedName && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-blue-600">
                            🤖 AI Suggestion:
                          </label>
                          <p className="font-medium text-blue-800">
                            {product.aiSuggestedName}
                          </p>
                          <Button
                            size="sm"
                            className="mt-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? { ...p, name: p.aiSuggestedName }
                                    : p,
                                ),
                              );
                              playSound("success");
                            }}
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            Apply AI Suggestion
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Product Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-medium">KES {product.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Stock:</span>
                        <p className="font-medium">{product.stock} units</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Views:</span>
                        <p className="font-medium">{product.views}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders:</span>
                        <p className="font-medium">{product.orders}</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Percent className="h-4 w-4 mr-1" />
                        Create Promotion
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRhinoScorecard = () => (
    <div className="space-y-6">
      {/* Overall Rhino Score */}
      <Card className="border-gray-400 bg-gradient-to-br from-gray-50 to-stone-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-gray-600" />
            <span>🦏 Rhino Scorecard</span>
            <Badge className="bg-gray-600">{scorecard.overall}/100</Badge>
          </CardTitle>
          <CardDescription>
            Your supplier strength in the savanna ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Score Display */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-gray-600"
                  style={{
                    background: `conic-gradient(#6b7280 ${scorecard.overall * 3.6}deg, transparent 0deg)`,
                  }}
                />
                <div className="relative z-10 text-center">
                  <div className="text-3xl">🦏</div>
                  <div className="font-bold text-2xl">{scorecard.overall}</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold">
              Rank #{scorecard.rank} of {scorecard.totalSuppliers} suppliers
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-Time Delivery</span>
                  <span className="font-medium">
                    {scorecard.onTimeDelivery}%
                  </span>
                </div>
                <Progress value={scorecard.onTimeDelivery} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stock Accuracy</span>
                  <span className="font-medium">
                    {scorecard.stockAccuracy}%
                  </span>
                </div>
                <Progress value={scorecard.stockAccuracy} className="h-2" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Rating</span>
                  <span className="font-medium">
                    {scorecard.customerRating}/5.0
                  </span>
                </div>
                <Progress
                  value={(scorecard.customerRating / 5) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span className="font-medium">
                    {scorecard.responseTime}h avg
                  </span>
                </div>
                <Progress
                  value={Math.max(0, 100 - scorecard.responseTime * 20)}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Wildlife Badges */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">🏆 Wildlife Badges Earned</h3>
            <div className="grid grid-cols-3 gap-4">
              {scorecard.badges.includes("🦁") ? (
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl">🦁</div>
                  <div className="text-sm font-medium">Lion Partner</div>
                  <div className="text-xs text-gray-500">
                    Top 5% Performance
                  </div>
                </div>
              ) : (
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl grayscale">🦁</div>
                  <div className="text-sm">Lion Partner</div>
                  <div className="text-xs text-gray-400">Need 95+ score</div>
                </div>
              )}

              {scorecard.badges.includes("🐘") ? (
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl">🐘</div>
                  <div className="text-sm font-medium">Elephant Reliable</div>
                  <div className="text-xs text-gray-500">95%+ On-time</div>
                </div>
              ) : (
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl grayscale">🐘</div>
                  <div className="text-sm">Elephant Reliable</div>
                  <div className="text-xs text-gray-400">
                    Need 95%+ delivery
                  </div>
                </div>
              )}

              {scorecard.badges.includes("🦓") ? (
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl">🦓</div>
                  <div className="text-sm font-medium">Zebra Consistent</div>
                  <div className="text-xs text-gray-500">
                    Consistent Quality
                  </div>
                </div>
              ) : (
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl grayscale">🦓</div>
                  <div className="text-sm">Zebra Consistent</div>
                  <div className="text-xs text-gray-400">
                    Need 90%+ accuracy
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span>🎯 Competitive Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorData.map((competitor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{competitor.name}</h3>
                  <Badge
                    variant={
                      competitor.yourPosition === 1 ? "default" : "secondary"
                    }
                  >
                    You're #{competitor.yourPosition}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Their Price:</span>
                    <p className="font-medium">KES {competitor.price}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Market Share:</span>
                    <p className="font-medium">{competitor.marketShare}%</p>
                  </div>
                </div>
                {competitor.yourPosition > 1 && (
                  <Alert className="mt-3 border-orange-200 bg-orange-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      💡 Lower your price by KES {competitor.price - 80} to
                      become #1 in this category
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stockout Predictions */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <span>🌵 Drought Predictions</span>
          </CardTitle>
          <CardDescription>
            AI predicts when your products will run out of stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockoutPredictions.map((prediction) => (
              <div
                key={prediction.productId}
                className={`p-4 border rounded-lg ${
                  prediction.riskLevel === "high"
                    ? "border-red-300 bg-red-50"
                    : prediction.riskLevel === "medium"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{prediction.productName}</h3>
                  <Badge
                    variant={
                      prediction.riskLevel === "high"
                        ? "destructive"
                        : prediction.riskLevel === "medium"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {prediction.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Current Stock:</span>
                    <p className="font-medium">
                      {prediction.currentStock} units
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Daily Sales:</span>
                    <p className="font-medium">{prediction.dailySales} units</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Days Left:</span>
                    <p className="font-medium">
                      {prediction.daysUntilStockout.toFixed(1)} days
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <p className="font-medium">{prediction.confidence}%</p>
                  </div>
                </div>

                {prediction.riskLevel === "high" && (
                  <div className="bg-red-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      🚨 Urgent Restock Needed!
                    </p>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        playSound("alert");
                        alert(
                          "🚨 Emergency restock alert sent to procurement team!",
                        );
                      }}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Alert Procurement
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMigrationSpecials = () => (
    <div className="space-y-6">
      {/* Dynamic Promotion Engine */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-green-600" />
            <span>⚡ Dynamic Promotion Engine</span>
          </CardTitle>
          <CardDescription>
            AI-powered promotional campaigns to maximize revenue and clear
            inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotions.map((promo) => (
              <Card
                key={promo.id}
                className={`border-2 ${
                  promo.urgency === "high"
                    ? "border-red-300 bg-red-50"
                    : promo.urgency === "medium"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-green-300 bg-green-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{promo.productName}</h3>
                      <p className="text-sm text-gray-600">{promo.reason}</p>
                    </div>
                    <Badge
                      variant={
                        promo.urgency === "high"
                          ? "destructive"
                          : promo.urgency === "medium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {promo.urgency.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      <p className="font-medium">{promo.currentStock} units</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Suggested Discount:</span>
                      <p className="font-medium text-green-600">
                        {promo.suggestedDiscount}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Target Shops:</span>
                      <p className="font-medium">{promo.targetShops} shops</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Potential Revenue:</span>
                      <p className="font-medium">
                        KES {promo.potentialRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border mb-3">
                    <h4 className="font-medium mb-2">🎯 Promotion Preview</h4>
                    <p className="text-sm">
                      "⚡ Flash Sale: {promo.productName} -{" "}
                      {promo.suggestedDiscount}% OFF! Limited time offer for the
                      first {promo.targetShops} shops. Stock moving fast - order
                      now!"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        playSound("success");
                        alert(
                          `🦁 Promotion launched! Targeting ${promo.targetShops} shops with ${promo.suggestedDiscount}% discount.`,
                        );
                      }}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Launch Promotion
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Customize Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="h-4 w-4 mr-1" />
                      Select Shops
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Promotions */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Active Migration Campaigns</CardTitle>
          <CardDescription>
            Your current promotional campaigns and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Sugar Rush Sale",
                discount: 12,
                shopsTargeted: 45,
                shopsParticipated: 32,
                revenue: 89600,
                endDate: "2024-02-20",
                status: "active",
              },
              {
                name: "Maize Flour Madness",
                discount: 8,
                shopsTargeted: 60,
                shopsParticipated: 60,
                revenue: 156000,
                endDate: "2024-02-15",
                status: "completed",
              },
            ].map((campaign, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <Badge
                    variant={
                      campaign.status === "active" ? "default" : "secondary"
                    }
                  >
                    {campaign.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Discount:</span>
                    <p className="font-medium">{campaign.discount}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Participation:</span>
                    <p className="font-medium">
                      {campaign.shopsParticipated}/{campaign.shopsTargeted}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <p className="font-medium">
                      KES {campaign.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium">{campaign.endDate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Participation Rate</span>
                    <span>
                      {Math.round(
                        (campaign.shopsParticipated / campaign.shopsTargeted) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (campaign.shopsParticipated / campaign.shopsTargeted) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Analytics
                  </Button>
                  {campaign.status === "active" && (
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotion Performance Insights */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>📊 Migration Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">KES 245K</div>
              <div className="text-sm text-gray-600">
                Revenue from Promotions
              </div>
              <div className="text-xs text-green-500 mt-1">
                ↗ +23% vs last month
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">
                Avg Participation Rate
              </div>
              <div className="text-xs text-blue-500 mt-1">
                ↗ +12% vs last month
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">157</div>
              <div className="text-sm text-gray-600">Shops Reached</div>
              <div className="text-xs text-purple-500 mt-1">
                ↗ +34 new shops
              </div>
            </div>
          </div>

          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <Award className="h-4 w-4" />
            <AlertDescription>
              🏆 Top Performing Strategy: "Limited Time Flash Sales" have 94%
              participation rate and generate 45% more revenue than regular
              promotions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                🏭 {profile?.business_name || "Supplier"} Command Center
              </h1>
              <p className="text-green-600 mt-1">
                🦏 Rule your territory with strength and intelligence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-gray-600">
                🦏 Rhino Score: {scorecard.overall}
              </Badge>
              <Button variant="outline" className="border-purple-300">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Baobab
              </Button>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="catalog" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="catalog"
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>📦 Pride Catalog</span>
              </TabsTrigger>
              <TabsTrigger
                value="scorecard"
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>🦏 Rhino Scorecard</span>
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>⚡ Migration Specials</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog">{renderPrideCatalog()}</TabsContent>

            <TabsContent value="scorecard">
              {renderRhinoScorecard()}
            </TabsContent>

            <TabsContent value="promotions">
              {renderMigrationSpecials()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EnhancedSupplierDashboard;
