/**
 * 🦁 The Digital Savanna Marketplace
 * Complete cultural immersion for Kenya's B2B marketplace
 */

import React, { useState, useEffect, useRef } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  Star,
  MapPin,
  Package,
  Users,
  Zap,
  Camera,
  Volume2,
  VolumeX,
  ShoppingCart,
  Eye,
  Filter,
  Grid3X3,
  List,
  Heart,
  Share2,
  Award,
  Crown,
  Shield,
  TrendingUp,
  Clock,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";

// Maasai-inspired color palette
const SAVANNA_COLORS = {
  terracotta: "#E2725B",
  acacia: "#2E8B57",
  gold: "#FFD700",
  earth: "#8B4513",
  sky: "#87CEEB",
  sunset: "#FF6B35",
  grass: "#9ACD32",
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  supplier: {
    name: string;
    rating: number;
    verified: boolean;
    prideLevel: "cub" | "lion" | "alpha";
    location: string;
  };
  stock: number;
  urgency: "high" | "medium" | "low";
  cheetahEligible: boolean;
  imageUrl: string;
  tags: string[];
  bulkDiscount?: {
    threshold: number;
    discount: number;
    currentParticipants: number;
  };
}

interface SavannaTheme {
  timeOfDay: "dawn" | "midday" | "dusk" | "night";
  soundEnabled: boolean;
  arMode: boolean;
  viewMode: "grid" | "list";
}

const DigitalSavannaMarketplace = () => {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Theme state
  const [theme, setTheme] = useState<SavannaTheme>({
    timeOfDay: "midday",
    soundEnabled: false,
    arMode: false,
    viewMode: "grid",
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Interactive state
  const [cart, setCart] = useState<Product[]>([]);
  const [baobabShaken, setBaobabShaken] = useState(false);
  const [dealsRevealed, setDealsRevealed] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredSupplier, setHoveredSupplier] = useState<string | null>(null);

  // Mock data - diverse Kenyan suppliers with cultural authenticity
  const products: Product[] = [
    {
      id: "1",
      name: "Premium Unga (Maize Flour)",
      description: "Fresh milled maize flour from Rift Valley farms",
      price: 85,
      originalPrice: 95,
      category: "Grains",
      supplier: {
        name: "Unga Pride Co-op",
        rating: 4.8,
        verified: true,
        prideLevel: "alpha",
        location: "Nakuru",
      },
      stock: 2400,
      urgency: "medium",
      cheetahEligible: true,
      imageUrl: "/api/placeholder/300/200",
      tags: ["premium", "bulk-discount", "fast-delivery"],
      bulkDiscount: {
        threshold: 100,
        discount: 0.15,
        currentParticipants: 67,
      },
    },
    {
      id: "2",
      name: "Sukuma Wiki (Collard Greens)",
      description: "Fresh picked from highland farms",
      price: 25,
      category: "Vegetables",
      supplier: {
        name: "Green Savanna Collective",
        rating: 4.6,
        verified: true,
        prideLevel: "lion",
        location: "Nyeri",
      },
      stock: 1200,
      urgency: "high",
      cheetahEligible: true,
      imageUrl: "/api/placeholder/300/200",
      tags: ["organic", "same-day"],
    },
    {
      id: "3",
      name: "Kenyan AA Coffee Beans",
      description: "Single origin beans from Kiambu highlands",
      price: 450,
      originalPrice: 520,
      category: "Beverages",
      supplier: {
        name: "Highland Pride Roasters",
        rating: 4.9,
        verified: true,
        prideLevel: "alpha",
        location: "Kiambu",
      },
      stock: 300,
      urgency: "low",
      cheetahEligible: false,
      imageUrl: "/api/placeholder/300/200",
      tags: ["premium", "export-grade", "limited"],
    },
  ];

  const hiddenDeals: Product[] = [
    {
      id: "hidden-1",
      name: "🌟 Secret Pride Spice Blend",
      description: "Grandmother's recipe from Maasai Mara",
      price: 120,
      originalPrice: 180,
      category: "Spices",
      supplier: {
        name: "Maasai Spice Masters",
        rating: 5.0,
        verified: true,
        prideLevel: "alpha",
        location: "Maasai Mara",
      },
      stock: 50,
      urgency: "high",
      cheetahEligible: true,
      imageUrl: "/api/placeholder/300/200",
      tags: ["traditional", "limited", "cultural"],
    },
  ];

  // Effects
  useEffect(() => {
    if (theme.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, that's fine
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [theme.soundEnabled]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast({
      title: "Added to Hunting Pack! 🦁",
      description: product.name + " stalked successfully",
    });
  };

  const shakeBaobabTree = () => {
    setBaobabShaken(true);

    // Reveal hidden deals
    setDealsRevealed(hiddenDeals);

    toast({
      title: "🌳 Baobab Shaken!",
      description: hiddenDeals.length + " hidden deals revealed!",
    });

    setTimeout(() => setBaobabShaken(false), 3000);
  };

  const getUrgencyBorder = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  const getPrideBadge = (level: string) => {
    switch (level) {
      case "alpha":
        return {
          icon: "👑",
          color: "bg-gradient-to-r from-yellow-400 to-orange-500",
          text: "Alpha",
        };
      case "lion":
        return {
          icon: "🦁",
          color: "bg-gradient-to-r from-orange-400 to-red-500",
          text: "Lion",
        };
      case "cub":
        return {
          icon: "🐾",
          color: "bg-gradient-to-r from-blue-400 to-indigo-500",
          text: "Cub",
        };
      default:
        return { icon: "🐾", color: "bg-gray-400", text: "Cub" };
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          theme.timeOfDay === "midday"
            ? "linear-gradient(to bottom, #87CEEB, #F0E68C)"
            : "linear-gradient(to bottom, #2F4F4F, #8B4513)",
      }}
    >
      <SavannahNavigation />

      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Flying birds */}
        <div className="absolute top-20 left-0 animate-pulse">🐦 🐦 🐦</div>

        {/* Acacia trees silhouettes */}
        <div className="absolute bottom-0 left-1/4 text-6xl opacity-30">🌳</div>
        <div className="absolute bottom-0 right-1/3 text-8xl opacity-20">
          🌴
        </div>
      </div>

      {/* Header Controls */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1
              className="text-4xl font-bold"
              style={{ color: SAVANNA_COLORS.earth }}
            >
              🌍 The Digital Savanna
            </h1>
            <Badge className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
              Watering Hole Marketplace
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Time of day selector */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTheme((prev) => ({
                  ...prev,
                  timeOfDay: prev.timeOfDay === "midday" ? "dusk" : "midday",
                }))
              }
            >
              {theme.timeOfDay === "midday" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Sound toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTheme((prev) => ({
                  ...prev,
                  soundEnabled: !prev.soundEnabled,
                }))
              }
            >
              {theme.soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            {/* AR toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTheme((prev) => ({ ...prev, arMode: !prev.arMode }))
              }
              className={theme.arMode ? "bg-blue-100" : ""}
            >
              <Camera className="h-4 w-4" />
              {theme.arMode && (
                <span className="ml-1 text-xs">Savanna Vision</span>
              )}
            </Button>

            {/* Cart */}
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Hero Section - Watering Hole */}
        <Card className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 border-none shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: SAVANNA_COLORS.earth }}
                >
                  🏺 Welcome to the Watering Hole
                </h2>
                <p className="text-lg mb-6 text-gray-700">
                  <em>"Maji ni uhai"</em> (Water is life) - Join traders from
                  across the savanna for the freshest deals and strongest
                  partnerships.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    🦁 Join the Herd - Start Trading
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    style={{
                      borderColor: SAVANNA_COLORS.terracotta,
                      color: SAVANNA_COLORS.terracotta,
                    }}
                  >
                    🍯 Graze Today's Deals
                  </Button>
                </div>
              </div>

              <div className="relative">
                {/* Interactive Baobab Tree */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className={
                      "text-9xl hover:scale-110 transition-transform " +
                      (baobabShaken ? "animate-bounce" : "")
                    }
                    onClick={shakeBaobabTree}
                  >
                    🌳
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Click the Baobab Tree to reveal hidden deals!
                  </p>
                </div>

                {/* Kiosks as interactive hotspots */}
                <div className="absolute top-4 right-4">
                  <div className="relative group cursor-pointer">
                    🏪
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        Unga Pride Co-op ⭐ 4.8
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Trail Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search the savanna marketplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant={theme.viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setTheme((prev) => ({ ...prev, viewMode: "grid" }))
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme.viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setTheme((prev) => ({ ...prev, viewMode: "list" }))
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Trail */}
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "Grains",
                "Vegetables",
                "Beverages",
                "Spices",
                "Livestock",
                "Textiles",
              ].map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category === "all" ? "🌍 All Territories" : `${category}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lion Pride Leaderboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Lion Pride Leaderboard - Top Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.slice(0, 3).map((product, index) => {
                const pride = getPrideBadge(product.supplier.prideLevel);
                return (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50"
                  >
                    <div className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {product.supplier.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.supplier.location}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">
                          {product.supplier.rating}
                        </span>
                        <Badge
                          className={pride.color + " text-white text-xs ml-2"}
                        >
                          {pride.icon} {pride.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Product Grid/List */}
        <div
          className={
            theme.viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {/* Regular Products */}
          {products.map((product) => {
            const pride = getPrideBadge(product.supplier.prideLevel);
            return (
              <Card
                key={product.id}
                className={
                  "group hover:shadow-xl transition-all duration-300 " +
                  getUrgencyBorder(product.urgency)
                }
                style={{
                  background:
                    theme.viewMode === "grid"
                      ? "linear-gradient(135deg, rgba(46, 139, 87, 0.05), rgba(226, 114, 91, 0.05))"
                      : undefined,
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.supplier.location}
                        </Badge>
                        <Badge className={pride.color + " text-white text-xs"}>
                          {pride.icon} {pride.text}
                        </Badge>
                        {product.supplier.verified && (
                          <Shield className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        KES {product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          KES {product.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>

                  {/* Supplier info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {product.supplier.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {product.supplier.name}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {product.supplier.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </div>
                  </div>

                  {/* Bulk discount indicator */}
                  {product.bulkDiscount && (
                    <div className="mb-3 p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span>🐘 Elephant Herd Buying</span>
                        <span>
                          {product.bulkDiscount.discount * 100}% off bulk orders
                        </span>
                      </div>
                      <Progress
                        value={
                          (product.bulkDiscount.currentParticipants /
                            product.bulkDiscount.threshold) *
                          100
                        }
                        className="h-2 mt-1"
                      />
                      <div className="text-xs text-gray-600 mt-1">
                        {product.bulkDiscount.currentParticipants} /{" "}
                        {product.bulkDiscount.threshold} participants
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag === "premium" && "⭐"}
                        {tag === "organic" && "🌱"}
                        {tag === "same-day" && "⚡"}
                        {tag === "cheetah-speed" && "🐆"}
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(product)}
                      className="flex-1"
                      style={{
                        background:
                          "linear-gradient(45deg, " +
                          SAVANNA_COLORS.terracotta +
                          ", " +
                          SAVANNA_COLORS.gold +
                          ")",
                      }}
                    >
                      🦁 Add to Pack
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Cheetah speed delivery indicator */}
                  {product.cheetahEligible && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <Zap className="h-3 w-3 mr-1" />
                      🐆 Cheetah Speed Delivery Available
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Hidden Deals (when revealed) */}
          {dealsRevealed.map((product) => {
            const pride = getPrideBadge(product.supplier.prideLevel);
            return (
              <Card
                key={product.id}
                className={
                  "group hover:shadow-xl transition-all duration-300 " +
                  getUrgencyBorder(product.urgency) +
                  " border-2 border-dashed border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50"
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 flex items-center gap-2">
                        🌟 {product.name}
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                          Hidden Deal!
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.supplier.location}
                        </Badge>
                        <Badge className={pride.color + " text-white text-xs"}>
                          {pride.icon} {pride.text}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">
                        KES {product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          KES {product.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>

                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full"
                    style={{
                      background:
                        "linear-gradient(135deg, " +
                        SAVANNA_COLORS.terracotta +
                        ", " +
                        SAVANNA_COLORS.gold +
                        ")",
                    }}
                  >
                    🌟 Claim Secret Deal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cultural Footer Message */}
        {dealsRevealed.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <div className="text-xl mb-2">🌳</div>
              <p className="text-gray-600">
                <em>"Ukweli hauogopi upelelezi"</em> - Truth does not fear
                investigation.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Explore the marketplace, shake the Baobab tree, and discover the
                true spirit of Ubuntu trading.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Background audio */}
      <audio ref={audioRef} loop>
        <source src="/savanna-ambient.mp3" type="audio/mpeg" />
      </audio>

      <EnterpriseFooter />
    </div>
  );
};

export default DigitalSavannaMarketplace;
