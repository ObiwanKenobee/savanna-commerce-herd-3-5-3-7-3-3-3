import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Package,
  QrCode,
  Sun,
  TreePine,
} from "lucide-react";

interface MarketplaceHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stats: {
    totalShops: number;
    activeSellers: number;
    todaysOrders: number;
    avgRating: number;
  };
}

export const MarketplaceHero = ({
  searchQuery,
  setSearchQuery,
  stats,
}: MarketplaceHeroProps) => {
  const [featuredShop, setFeaturedShop] = useState({
    name: "Mama Wanjiku's Fresh Greens",
    rating: 4.9,
    products: 47,
    location: "Nakuru Central Market",
    specialty: "Organic Vegetables",
    badge: "Seller of the Week",
  });

  return (
    <div className="relative min-h-[500px] bg-gradient-to-br from-orange-400 via-yellow-400 to-green-400 overflow-hidden">
      {/* Savannah Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <TreePine className="h-16 w-16 text-green-800" />
        </div>
        <div className="absolute top-20 right-20">
          <Sun className="h-20 w-20 text-yellow-800" />
        </div>
        <div className="absolute bottom-10 left-1/4">
          <span className="text-6xl">🦒</span>
        </div>
        <div className="absolute bottom-20 right-1/3">
          <span className="text-4xl">🌳</span>
        </div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
          <span className="text-5xl">🐘</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <Badge className="bg-white text-orange-600 px-4 py-2 text-sm font-medium">
                🌅 Welcome to Your Savannah Marketplace
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Where Every
                <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Trade Thrives
                </span>
              </h1>

              <p className="text-xl text-white/90 max-w-lg">
                Discover authentic products from local sellers across Kenya.
                From fresh produce to handcrafted goods, your perfect find
                awaits.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
              <Input
                placeholder="Search products, shops, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-lg"
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
              >
                Search
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Browse Near Me
              </Button>
              <Button
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan Shop QR
              </Button>
              <Button
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Now
              </Button>
            </div>
          </div>

          {/* Right Side - Featured Shop Spotlight */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <Badge className="bg-orange-500 text-white mb-3">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {featuredShop.badge}
                  </Badge>

                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🥬</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800">
                    {featuredShop.name}
                  </h3>
                  <p className="text-orange-600 font-medium">
                    {featuredShop.specialty}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {featuredShop.location}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {featuredShop.rating}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {featuredShop.products}
                    </div>
                    <div className="text-xs text-gray-500">Products</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      <QrCode className="h-5 w-5 mx-auto" />
                    </div>
                    <div className="text-xs text-gray-500">QR Shop</div>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Visit Shop →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="text-white">
            <div className="text-2xl font-bold">
              {stats.totalShops.toLocaleString()}
            </div>
            <div className="text-sm text-white/80">Active Shops</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">
              {stats.activeSellers.toLocaleString()}
            </div>
            <div className="text-sm text-white/80">Sellers Online</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">
              {stats.todaysOrders.toLocaleString()}
            </div>
            <div className="text-sm text-white/80">Orders Today</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <div className="text-sm text-white/80">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-12 fill-current text-orange-50"
        >
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};
