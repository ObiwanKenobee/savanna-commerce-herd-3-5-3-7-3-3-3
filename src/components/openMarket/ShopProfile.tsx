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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Users,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  orders: number;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ShopData {
  id: string;
  name: string;
  owner: string;
  description: string;
  story: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  phone: string;
  email: string;
  website?: string;
  products: Product[];
  totalOrders: number;
  joinedDate: string;
  isVerified: boolean;
  isOnline: boolean;
  avatar: string;
  banner: string;
  specialties: string[];
  badges: string[];
  responseRate: number;
  responseTime: string;
  achievements: string[];
  socialImpact: string;
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface ShopProfileProps {
  shopId: string;
}

export const ShopProfile = ({ shopId }: ShopProfileProps) => {
  const [shop, setShop] = useState<ShopData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, fetch from API
  const mockShop: ShopData = {
    id: shopId,
    name: "Mama Wanjiku's Fresh Greens",
    owner: "Grace Wanjiku",
    description:
      "Family-owned organic farm specializing in fresh vegetables and herbs. Serving the community for over 15 years with love and dedication.",
    story:
      "Our journey began in 1995 when Mama Wanjiku started a small kitchen garden behind our home in Nakuru. What began as a way to feed our family has grown into a thriving business that now supplies fresh, organic vegetables to over 500 families every week. We believe in farming with love, respect for the earth, and care for our community.",
    rating: 4.9,
    reviewCount: 847,
    location: "Nakuru Central Market, Stall 23B",
    category: "Fresh Produce",
    phone: "+254 712 345 678",
    email: "mamawanjiku@gmail.com",
    website: "www.mamawanjikugreens.co.ke",
    products: [
      {
        id: "prod_001",
        name: "Organic Kale",
        price: 150,
        image: "/api/placeholder/200/200",
        category: "Leafy Greens",
        inStock: true,
        rating: 4.9,
        orders: 1247,
      },
      {
        id: "prod_002",
        name: "Fresh Spinach",
        price: 120,
        image: "/api/placeholder/200/200",
        category: "Leafy Greens",
        inStock: true,
        rating: 4.8,
        orders: 892,
      },
      {
        id: "prod_003",
        name: "Organic Tomatoes",
        price: 200,
        image: "/api/placeholder/200/200",
        category: "Vegetables",
        inStock: false,
        rating: 4.7,
        orders: 567,
      },
    ],
    totalOrders: 5670,
    joinedDate: "2019-03-15",
    isVerified: true,
    isOnline: true,
    avatar: "/api/placeholder/150/150",
    banner: "/api/placeholder/800/300",
    specialties: [
      "Organic Vegetables",
      "Fresh Herbs",
      "Seasonal Fruits",
      "Kitchen Gardens",
    ],
    badges: [
      "Top Seller",
      "Eco-Friendly",
      "Quick Response",
      "Community Leader",
    ],
    responseRate: 98,
    responseTime: "Usually responds within 2 hours",
    achievements: [
      "Best Organic Seller 2023",
      "Community Impact Award",
      "Sustainability Champion",
    ],
    socialImpact:
      "Employs 12 local women and supports 30 smallholder farmers in the region",
    operatingHours: {
      monday: "6:00 AM - 6:00 PM",
      tuesday: "6:00 AM - 6:00 PM",
      wednesday: "6:00 AM - 6:00 PM",
      thursday: "6:00 AM - 6:00 PM",
      friday: "6:00 AM - 6:00 PM",
      saturday: "6:00 AM - 8:00 PM",
      sunday: "7:00 AM - 4:00 PM",
    },
  };

  const mockReviews: Review[] = [
    {
      id: "rev_001",
      customerName: "John Mwangi",
      rating: 5,
      comment:
        "Always fresh vegetables! Mama Wanjiku's kale is the best in Nakuru. Quick delivery and excellent customer service.",
      date: "2024-01-10",
      verified: true,
    },
    {
      id: "rev_002",
      customerName: "Sarah Chebet",
      rating: 5,
      comment:
        "Been buying from this shop for 2 years. Quality is consistent and prices are fair. Highly recommend!",
      date: "2024-01-08",
      verified: true,
    },
    {
      id: "rev_003",
      customerName: "Peter Kamau",
      rating: 4,
      comment:
        "Good quality vegetables. Sometimes they run out of stock early, but overall very satisfied.",
      date: "2024-01-05",
      verified: false,
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setShop(mockShop);
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [shopId]);

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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-4 flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={shop.avatar} alt={shop.owner} />
              <AvatarFallback className="text-lg bg-orange-500 text-white">
                {shop.owner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                {shop.isVerified && (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                )}
                {shop.isOnline && (
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                )}
              </div>
              <p className="text-white/90">by {shop.owner}</p>
              <Badge className="bg-orange-500 text-white mt-1">
                {shop.category}
              </Badge>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 hover:bg-white"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
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

        <CardContent className="p-6">
          {/* Shop Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {renderStars(shop.rating)}
              </div>
              <div className="text-lg font-bold">{shop.rating}</div>
              <div className="text-sm text-gray-600">
                ({shop.reviewCount} reviews)
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {shop.products.length}
              </div>
              <div className="text-sm text-gray-600">Products</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {shop.totalOrders.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {shop.responseRate}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4">{shop.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.badges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {shop.location}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {shop.phone}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {shop.responseTime}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop Now
            </Button>
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shop Details Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shop.products.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-green-200 to-orange-200 flex items-center justify-center">
                  <Package className="h-16 w-16 text-green-600" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <Badge
                      variant={product.inStock ? "default" : "destructive"}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {product.category}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600">
                      ({product.orders})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </div>
                    <Button size="sm" disabled={!product.inStock}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{shop.story}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Specialties</h4>
                  <ul className="space-y-1">
                    {shop.specialties.map((specialty, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Achievements</h4>
                  <ul className="space-y-1">
                    {shop.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-orange-500" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Community Impact
                </h4>
                <p className="text-green-700 text-sm">{shop.socialImpact}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {shop.reviewCount} reviews with an average rating of{" "}
                {shop.rating} stars
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.customerName}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{shop.email}</span>
                </div>
                {shop.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>{shop.website}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{shop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Member since {formatDate(shop.joinedDate)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(shop.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
