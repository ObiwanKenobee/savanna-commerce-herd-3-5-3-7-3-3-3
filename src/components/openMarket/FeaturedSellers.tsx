import { useState } from "react";
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
  TrendingUp,
  Award,
  QrCode,
  Share2,
  CheckCircle,
  Calendar,
  Users,
  ShoppingCart,
} from "lucide-react";

interface FeaturedSeller {
  id: string;
  name: string;
  owner: string;
  description: string;
  story: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  products: number;
  totalOrders: number;
  monthlyRevenue: number;
  joinedDate: string;
  isVerified: boolean;
  avatar: string;
  banner: string;
  achievements: string[];
  specialties: string[];
  socialImpact: string;
  awards: string[];
}

export const FeaturedSellers = () => {
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const featuredSellers: FeaturedSeller[] = [
    {
      id: "featured_001",
      name: "Mama Wanjiku's Fresh Greens",
      owner: "Grace Wanjiku",
      description:
        "Family-owned organic farm specializing in fresh vegetables and herbs.",
      story:
        "Started as a small kitchen garden in 1995, Mama Wanjiku's passion for organic farming has grown into a thriving business that now supplies fresh vegetables to over 500 families weekly. Her commitment to pesticide-free farming and fair prices has made her a beloved figure in the community.",
      rating: 4.9,
      reviewCount: 847,
      location: "Nakuru Central Market",
      category: "Organic Produce",
      products: 47,
      totalOrders: 5670,
      monthlyRevenue: 45000,
      joinedDate: "2019-03-15",
      isVerified: true,
      avatar: "/api/placeholder/150/150",
      banner: "/api/placeholder/600/300",
      achievements: [
        "Top Seller 2023",
        "Eco-Champion",
        "Community Leader",
        "Customer Choice Award",
      ],
      specialties: [
        "Organic Vegetables",
        "Fresh Herbs",
        "Seasonal Fruits",
        "Kitchen Gardens",
      ],
      socialImpact:
        "Employs 12 local women and supports 30 smallholder farmers",
      awards: [
        "Best Organic Seller",
        "Community Impact Award",
        "Sustainability Champion",
      ],
    },
    {
      id: "featured_002",
      name: "Spice Kingdom",
      owner: "Fatuma Hassan",
      description:
        "Authentic African spices and herbs sourced directly from local farmers.",
      story:
        "Three generations of spice expertise from the Swahili coast. Fatuma's grandmother taught her the ancient art of spice blending, and today she preserves these traditional recipes while innovating new flavors for modern kitchens.",
      rating: 4.8,
      reviewCount: 634,
      location: "Mombasa Old Town",
      category: "Spices & Herbs",
      products: 67,
      totalOrders: 4230,
      monthlyRevenue: 38000,
      joinedDate: "2020-07-22",
      isVerified: true,
      avatar: "/api/placeholder/150/150",
      banner: "/api/placeholder/600/300",
      achievements: [
        "Heritage Keeper",
        "Quality Excellence",
        "Export Success",
        "Innovation Award",
      ],
      specialties: [
        "Traditional Blends",
        "Coastal Spices",
        "Herbal Remedies",
        "Custom Mixes",
      ],
      socialImpact:
        "Preserves traditional spice knowledge and supports 25 spice farmers",
      awards: [
        "Cultural Heritage Award",
        "Export Excellence",
        "Quality Assurance",
      ],
    },
    {
      id: "featured_003",
      name: "Highland Grains Co-op",
      owner: "Samuel Kipchoge",
      description: "Premium grains and cereals from highland farms.",
      story:
        "A farmers' cooperative of 50 members working together to bring the finest highland grains to market. Our commitment to fair trade and sustainable farming practices ensures both quality products and fair compensation for our farmers.",
      rating: 4.7,
      reviewCount: 523,
      location: "Eldoret Highlands",
      category: "Grains & Cereals",
      products: 34,
      totalOrders: 3890,
      monthlyRevenue: 52000,
      joinedDate: "2018-11-08",
      isVerified: true,
      avatar: "/api/placeholder/150/150",
      banner: "/api/placeholder/600/300",
      achievements: [
        "Cooperative Leader",
        "Fair Trade Certified",
        "Quality Guarantee",
        "Bulk Supplier",
      ],
      specialties: [
        "Highland Wheat",
        "Organic Maize",
        "Ancient Grains",
        "Bulk Sales",
      ],
      socialImpact: "Fair trade cooperative supporting 50 farming families",
      awards: [
        "Cooperative Excellence",
        "Fair Trade Achievement",
        "Quality Leader",
      ],
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Featured Sellers</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Meet our outstanding sellers who embody the spirit of the Savannah
          marketplace. These entrepreneurs are making a real difference in their
          communities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredSellers.map((seller) => (
          <Card
            key={seller.id}
            className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Seller Banner */}
            <div className="relative h-48 bg-gradient-to-br from-orange-300 via-yellow-300 to-green-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">
                  {seller.category.includes("Produce") && "🥬"}
                  {seller.category.includes("Spices") && "🌿"}
                  {seller.category.includes("Grains") && "🌾"}
                </span>
              </div>

              {/* Awards Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-orange-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Featured Seller
                </Badge>
              </div>

              {/* QR Code */}
              <div className="absolute top-4 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Seller Profile */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={seller.avatar} alt={seller.owner} />
                  <AvatarFallback>
                    {seller.owner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {seller.name}
                    </h3>
                    {seller.isVerified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600">by {seller.owner}</p>
                  <p className="text-sm text-orange-600 font-medium">
                    {seller.category}
                  </p>
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{seller.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({seller.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {seller.location}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {seller.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {seller.products}
                  </div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {seller.totalOrders.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(seller.monthlyRevenue)}
                  </div>
                  <div className="text-xs text-gray-500">Monthly</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800">
                  Recent Achievements
                </h4>
                <div className="flex flex-wrap gap-1">
                  {seller.achievements.slice(0, 3).map((achievement) => (
                    <Badge
                      key={achievement}
                      variant="outline"
                      className="text-xs"
                    >
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Impact */}
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Community Impact
                  </span>
                </div>
                <p className="text-xs text-green-700">{seller.socialImpact}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Visit Shop
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Calendar className="h-3 w-3" />
                <span>Member since {formatDate(seller.joinedDate)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seller of the Month Spotlight */}
      <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Award className="h-6 w-6 text-orange-600" />
            Seller of the Month
          </CardTitle>
          <CardDescription className="text-orange-700">
            Celebrating excellence in the Savannah marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={featuredSellers[0].avatar}
                    alt={featuredSellers[0].owner}
                  />
                  <AvatarFallback className="text-lg">
                    {featuredSellers[0].owner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-orange-800">
                    {featuredSellers[0].name}
                  </h3>
                  <p className="text-orange-600">
                    by {featuredSellers[0].owner}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {featuredSellers[0].rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({featuredSellers[0].reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-orange-700 leading-relaxed">
                {featuredSellers[0].story}
              </p>

              <div className="flex gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Visit Featured Shop
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Read Full Story
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-orange-800">
                Why They're Featured
              </h4>
              <div className="space-y-3">
                {featuredSellers[0].awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-orange-700">{award}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <h5 className="font-medium text-orange-800 mb-2">
                  Monthly Highlights
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-orange-600">
                      {featuredSellers[0].totalOrders}
                    </div>
                    <div className="text-orange-500">Total Orders</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-600">98%</div>
                    <div className="text-orange-500">Response Rate</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-600">
                      {featuredSellers[0].products}
                    </div>
                    <div className="text-orange-500">Products</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-600">4.9★</div>
                    <div className="text-orange-500">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
