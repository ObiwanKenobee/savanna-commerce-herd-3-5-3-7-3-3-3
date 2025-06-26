import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  QrCode,
  Share2,
  Filter,
  Grid,
  List,
  TrendingUp,
  Users,
  Package,
  Award,
} from "lucide-react";

// Components
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { MarketplaceHero } from "@/components/openMarket/MarketplaceHero";
import { SellerShops } from "@/components/openMarket/SellerShops";
import { ProductCategories } from "@/components/openMarket/ProductCategories";
import { FeaturedSellers } from "@/components/openMarket/FeaturedSellers";
import { MarketAnalytics } from "@/components/openMarket/MarketAnalytics";

interface MarketStats {
  totalShops: number;
  activeSellers: number;
  todaysOrders: number;
  avgRating: number;
}

export default function OpenMarket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState<MarketStats>({
    totalShops: 1247,
    activeSellers: 892,
    todaysOrders: 156,
    avgRating: 4.6,
  });

  const marketCategories = [
    { id: "all", name: "All Products", icon: "🛒", count: 2847 },
    { id: "produce", name: "Fresh Produce", icon: "🥬", count: 567 },
    { id: "grains", name: "Grains & Cereals", icon: "🌾", count: 234 },
    { id: "dairy", name: "Dairy Products", icon: "🥛", count: 89 },
    { id: "meat", name: "Meat & Poultry", icon: "🍖", count: 123 },
    { id: "fruits", name: "Fruits", icon: "🍎", count: 345 },
    { id: "spices", name: "Spices & Herbs", icon: "🌿", count: 156 },
    { id: "crafts", name: "Handcrafts", icon: "🏺", count: 78 },
    { id: "textiles", name: "Textiles", icon: "🧵", count: 92 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <SavannahNavigation />

      {/* Hero Section */}
      <MarketplaceHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Market Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">
                {stats.totalShops}
              </div>
              <div className="text-sm text-orange-600">Active Shops</div>
              <div className="flex items-center justify-center mt-2">
                <Package className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-xs text-orange-500">Growing daily</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {stats.activeSellers}
              </div>
              <div className="text-sm text-green-600">Active Sellers</div>
              <div className="flex items-center justify-center mt-2">
                <Users className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Online now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">
                {stats.todaysOrders}
              </div>
              <div className="text-sm text-blue-600">Today's Orders</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-xs text-blue-500">+23% vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">
                {stats.avgRating}
              </div>
              <div className="text-sm text-yellow-600">Avg Rating</div>
              <div className="flex items-center justify-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                <span className="text-xs text-yellow-500">
                  Excellent service
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <ProductCategories
          categories={marketCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Search and Filter Bar */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4" />
                <Input
                  placeholder="Search for products, shops, or sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-200 hover:bg-orange-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-200 hover:bg-orange-50"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Near Me
                </Button>

                <div className="flex border border-orange-200 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="shops" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger
              value="shops"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              All Shops
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Featured Sellers
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Market Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shops" className="space-y-6">
            <SellerShops
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              viewMode={viewMode}
            />
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <FeaturedSellers />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MarketAnalytics />
          </TabsContent>
        </Tabs>

        {/* Call to Action for Sellers */}
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Start Selling?</h3>
            <p className="text-orange-100 max-w-2xl mx-auto">
              Join thousands of successful sellers in our Savannah marketplace.
              Get your personalized shop, QR code, and powerful marketing tools.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <Package className="h-4 w-4 mr-2" />
                Create Your Shop
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
