import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Clock,
  Package,
  Heart,
  Share2,
  QrCode,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  Award,
  Eye,
} from "lucide-react";

interface Shop {
  id: string;
  name: string;
  owner: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  products: number;
  orders: number;
  joinedDate: string;
  isVerified: boolean;
  isOnline: boolean;
  avatar: string;
  banner: string;
  specialties: string[];
  badges: string[];
  responseRate: number;
  qrCode: string;
  featured: boolean;
}

interface SellerShopsProps {
  searchQuery: string;
  selectedCategory: string;
  viewMode: "grid" | "list";
}

export const SellerShops = ({
  searchQuery,
  selectedCategory,
  viewMode,
}: SellerShopsProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock data
  const mockShops: Shop[] = [
    {
      id: "shop_001",
      name: "Mama Wanjiku's Fresh Greens",
      owner: "Grace Wanjiku",
      description:
        "Family-owned organic farm specializing in fresh vegetables and herbs. Serving the community for over 15 years with love and dedication.",
      rating: 4.9,
      reviewCount: 847,
      location: "Nakuru Central Market",
      category: "produce",
      products: 47,
      orders: 2340,
      joinedDate: "2019-03-15",
      isVerified: true,
      isOnline: true,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Organic Vegetables", "Fresh Herbs", "Seasonal Fruits"],
      badges: ["Top Seller", "Eco-Friendly", "Quick Response"],
      responseRate: 98,
      qrCode: "QR_MAMA_WANJIKU_001",
      featured: true,
    },
    {
      id: "shop_002",
      name: "Nyama Fresh Butchery",
      owner: "John Kimani",
      description:
        "Premium quality meat and poultry. Halal certified with daily fresh deliveries from our own farm.",
      rating: 4.7,
      reviewCount: 523,
      location: "Nairobi Industrial Area",
      category: "meat",
      products: 23,
      orders: 1876,
      joinedDate: "2020-07-22",
      isVerified: true,
      isOnline: false,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Fresh Meat", "Halal Certified", "Farm to Table"],
      badges: ["Halal Certified", "Premium Quality"],
      responseRate: 94,
      qrCode: "QR_NYAMA_FRESH_002",
      featured: false,
    },
    {
      id: "shop_003",
      name: "Spice Kingdom",
      owner: "Fatuma Hassan",
      description:
        "Authentic African spices and herbs sourced directly from local farmers. Traditional blends passed down through generations.",
      rating: 4.8,
      reviewCount: 334,
      location: "Mombasa Old Town",
      category: "spices",
      products: 67,
      orders: 1234,
      joinedDate: "2021-01-10",
      isVerified: true,
      isOnline: true,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Traditional Spices", "Herbal Blends", "Coastal Flavors"],
      badges: ["Authentic", "Traditional Recipes"],
      responseRate: 96,
      qrCode: "QR_SPICE_KINGDOM_003",
      featured: true,
    },
    {
      id: "shop_004",
      name: "Karibu Crafts",
      owner: "Peter Mwangi",
      description:
        "Handmade African crafts and textiles. Supporting local artisans and preserving traditional techniques.",
      rating: 4.6,
      reviewCount: 267,
      location: "Nairobi CBD",
      category: "crafts",
      products: 89,
      orders: 987,
      joinedDate: "2020-11-05",
      isVerified: false,
      isOnline: true,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Handmade Crafts", "Traditional Art", "Custom Orders"],
      badges: ["Artisan Made", "Cultural Heritage"],
      responseRate: 89,
      qrCode: "QR_KARIBU_CRAFTS_004",
      featured: false,
    },
    {
      id: "shop_005",
      name: "Grain Masters",
      owner: "Samuel Kipchoge",
      description:
        "Premium grains and cereals from highland farms. Specializing in organic and traditional varieties.",
      rating: 4.5,
      reviewCount: 445,
      location: "Eldoret Market",
      category: "grains",
      products: 34,
      orders: 1567,
      joinedDate: "2019-08-12",
      isVerified: true,
      isOnline: true,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Highland Grains", "Organic Cereals", "Bulk Orders"],
      badges: ["Organic Certified", "Highland Quality"],
      responseRate: 92,
      qrCode: "QR_GRAIN_MASTERS_005",
      featured: false,
    },
    {
      id: "shop_006",
      name: "Dairy Delights",
      owner: "Mary Chebet",
      description:
        "Fresh dairy products from happy, grass-fed cows. Daily deliveries of milk, yogurt, and cheese.",
      rating: 4.8,
      reviewCount: 612,
      location: "Nakuru Dairy Zone",
      category: "dairy",
      products: 18,
      orders: 2890,
      joinedDate: "2018-12-03",
      isVerified: true,
      isOnline: true,
      avatar: "/api/placeholder/100/100",
      banner: "/api/placeholder/400/200",
      specialties: ["Fresh Milk", "Artisan Cheese", "Organic Yogurt"],
      badges: ["Farm Fresh", "Daily Delivery", "Premium Quality"],
      responseRate: 97,
      qrCode: "QR_DAIRY_DELIGHTS_006",
      featured: true,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setShops(mockShops);
      setFilteredShops(mockShops);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter shops based on search and category
    let filtered = shops;

    if (searchQuery) {
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.category === selectedCategory);
    }

    setFilteredShops(filtered);
  }, [searchQuery, selectedCategory, shops]);

  const toggleFavorite = (shopId: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(shopId)) {
      newFavorites.delete(shopId);
    } else {
      newFavorites.add(shopId);
    }
    setFavorites(newFavorites);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <Card key={idx} className="animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {filteredShops.map((shop) => (
          <Card
            key={shop.id}
            className="hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex">
              {/* Shop Image */}
              <div className="w-48 h-32 bg-gradient-to-br from-orange-200 to-green-200 flex items-center justify-center">
                <span className="text-4xl">
                  {shop.category === "produce" && "🥬"}
                  {shop.category === "meat" && "🥩"}
                  {shop.category === "spices" && "🌿"}
                  {shop.category === "crafts" && "🏺"}
                  {shop.category === "grains" && "🌾"}
                  {shop.category === "dairy" && "🥛"}
                  {![
                    "produce",
                    "meat",
                    "spices",
                    "crafts",
                    "grains",
                    "dairy",
                  ].includes(shop.category) && "🛒"}
                </span>
              </div>

              {/* Shop Details */}
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {shop.name}
                      </h3>
                      {shop.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {shop.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {shop.featured && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      by {shop.owner}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {shop.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(shop.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(shop.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {shop.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{shop.rating}</span>
                      <span>({shop.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{shop.products} products</span>
                    </div>
                  </div>

                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Visit Shop
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredShops.map((shop) => (
        <Card
          key={shop.id}
          className="hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          {/* Shop Banner */}
          <div className="relative h-48 bg-gradient-to-br from-orange-200 to-green-200 flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {shop.category === "produce" && "🥬"}
              {shop.category === "meat" && "🥩"}
              {shop.category === "spices" && "🌿"}
              {shop.category === "crafts" && "🏺"}
              {shop.category === "grains" && "🌾"}
              {shop.category === "dairy" && "🥛"}
              {![
                "produce",
                "meat",
                "spices",
                "crafts",
                "grains",
                "dairy",
              ].includes(shop.category) && "🛒"}
            </span>

            {/* Status Indicators */}
            <div className="absolute top-3 left-3 flex gap-2">
              {shop.featured && (
                <Badge className="bg-orange-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {shop.isOnline && (
                <Badge className="bg-green-500 text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  Online
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toggleFavorite(shop.id)}
                className="bg-white/90 hover:bg-white"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.has(shop.id) ? "fill-current text-red-500" : ""}`}
                />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Shop Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {shop.name}
                  </h3>
                  {shop.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600">by {shop.owner}</p>
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={shop.avatar} alt={shop.owner} />
                <AvatarFallback>
                  {shop.owner
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Shop Description */}
            <p className="text-sm text-gray-700 line-clamp-2">
              {shop.description}
            </p>

            {/* Shop Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{shop.rating}</span>
                <span>({shop.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>{shop.products}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{shop.orders}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{shop.location}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              {shop.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {shop.badges.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{shop.badges.length - 2} more
                </Badge>
              )}
            </div>

            {/* Specialties */}
            <div className="text-xs text-gray-500">
              <span className="font-medium">Specialties: </span>
              {shop.specialties.slice(0, 2).join(", ")}
              {shop.specialties.length > 2 && "..."}
            </div>

            {/* Action Button */}
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Visit Shop
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
