import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Filter,
  TrendingUp,
  Award,
  Users,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Heart,
  Share2,
  Eye,
} from "lucide-react";

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
    tier: string;
    verified: boolean;
    location: string;
  };
  rating: number;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  helpful: number;
  category: "product" | "supplier" | "delivery" | "platform";
  verified_purchase: boolean;
  images?: string[];
  response?: {
    author: string;
    content: string;
    timestamp: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    // Mock reviews data
    const mockReviews: Review[] = [
      {
        id: "1",
        reviewer: {
          name: "Mary Wanjiku",
          avatar: "/avatars/mary.jpg",
          tier: "Elephant Supplier",
          verified: true,
          location: "Nairobi, Kenya",
        },
        rating: 5,
        title: "Outstanding Platform for B2B Trading",
        content:
          "🐘 As an elephant supplier, I've found this platform incredibly powerful for connecting with retailers across East Africa. The group buying features have increased my sales by 340% in just 6 months. The wildlife metaphor system makes complex trading fun and intuitive!",
        timestamp: "2 days ago",
        likes: 89,
        dislikes: 2,
        helpful: 156,
        category: "platform",
        verified_purchase: true,
        images: ["/reviews/mary-stats.jpg", "/reviews/mary-dashboard.jpg"],
        response: {
          author: "Savanna Support Team",
          content:
            "Thank you Mary! 🦁 Your success story inspires our entire pride. We're thrilled to see your business growing in our digital savanna ecosystem.",
          timestamp: "1 day ago",
        },
      },
      {
        id: "2",
        reviewer: {
          name: "James Kiprotich",
          avatar: "/avatars/james.jpg",
          tier: "Gazelle Retailer",
          verified: true,
          location: "Eldoret, Kenya",
        },
        rating: 4,
        title: "Fast Delivery Like a Cheetah",
        content:
          "🦌 The delivery system is impressive! My orders arrive within 24 hours even in rural areas. The logistics network truly operates like cheetahs - swift and efficient. Only issue is the mobile app can be slow on older phones, but the USSD option saves the day!",
        timestamp: "1 week ago",
        likes: 45,
        dislikes: 1,
        helpful: 78,
        category: "delivery",
        verified_purchase: true,
      },
      {
        id: "3",
        reviewer: {
          name: "Grace Muthoni",
          avatar: "/avatars/grace.jpg",
          tier: "Lion Administrator",
          verified: true,
          location: "Mombasa, Kenya",
        },
        rating: 5,
        title: "Revolutionary Impact on Our Business Ecosystem",
        content:
          "🦁 Managing our regional operations has never been easier. The admin dashboard provides real-time insights across 12 countries. The AI-powered predictions helped us avoid supply shortages during the rainy season. This platform is the future of African trade!",
        timestamp: "2 weeks ago",
        likes: 124,
        dislikes: 0,
        helpful: 201,
        category: "platform",
        verified_purchase: true,
        images: ["/reviews/admin-dashboard.jpg"],
      },
      {
        id: "4",
        reviewer: {
          name: "Samuel Ochieng",
          avatar: "/avatars/samuel.jpg",
          tier: "Cheetah Driver",
          verified: false,
          location: "Kisumu, Kenya",
        },
        rating: 3,
        title: "Good for Small Orders, Needs Improvement for Bulk",
        content:
          "🐆 The platform works well for small deliveries, and the route optimization is excellent. However, bulk order coordination could be better. Sometimes the group buying pools fill up too quickly, leaving smaller retailers behind.",
        timestamp: "3 weeks ago",
        likes: 23,
        dislikes: 8,
        helpful: 45,
        category: "product",
        verified_purchase: false,
      },
      {
        id: "5",
        reviewer: {
          name: "Fatuma Hassan",
          avatar: "/avatars/fatuma.jpg",
          tier: "Elephant Supplier",
          verified: true,
          location: "Nakuru, Kenya",
        },
        rating: 5,
        title: "Transformed Our Agricultural Supply Chain",
        content:
          "🌾 This platform connected us directly with over 200 retailers across Kenya and Tanzania. The predictive analytics helped us optimize our harvesting schedule. Revenue increased by 280% since joining the digital savanna pride!",
        timestamp: "1 month ago",
        likes: 67,
        dislikes: 3,
        helpful: 134,
        category: "supplier",
        verified_purchase: true,
        response: {
          author: "Agricultural Partnership Team",
          content:
            "Amazing to see your agricultural business thriving, Fatuma! 🌱 Your success in the digital savanna shows the power of connecting traditional farming with modern technology.",
          timestamp: "3 weeks ago",
        },
      },
    ];

    setReviews(mockReviews);
  }, []);

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter((r) => r.verified_purchase).length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    return { rating, count, percentage: (count / totalReviews) * 100 };
  });

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter !== "all" && review.category !== selectedFilter)
      return false;
    if (selectedRating !== "all" && review.rating !== parseInt(selectedRating))
      return false;
    return true;
  });

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void,
  ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
      />
    ));
  };

  const reviewStats = [
    { label: "Average Rating", value: averageRating.toFixed(1), icon: Star },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      icon: MessageSquare,
    },
    {
      label: "Verified Purchases",
      value: `${((verifiedReviews / totalReviews) * 100).toFixed(0)}%`,
      icon: CheckCircle,
    },
    { label: "Response Rate", value: "94%", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ⭐ Reviews & Ratings
          </h1>
          <p className="text-muted-foreground text-lg">
            Authentic feedback from our savanna community - building trust
            through transparency.
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {reviewStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-amber-600" />
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Rating Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground w-12">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Review Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">This Month</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">+23%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">5-Star Reviews</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium">Avg Response Time</span>
                  <span className="font-bold text-amber-600">4.2 hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Verified Buyers</span>
                  <span className="font-bold text-purple-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="write-review">Write Review</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filter by:</span>
                  </div>

                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-1 border rounded-lg"
                  >
                    <option value="all">All Categories</option>
                    <option value="platform">Platform</option>
                    <option value="product">Products</option>
                    <option value="supplier">Suppliers</option>
                    <option value="delivery">Delivery</option>
                  </select>

                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="px-3 py-1 border rounded-lg"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>

                  <Button variant="outline" size="sm">
                    Most Helpful
                  </Button>
                  <Button variant="outline" size="sm">
                    Most Recent
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <Card
                  key={review.id}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={review.reviewer.avatar} />
                            <AvatarFallback>
                              {review.reviewer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {review.reviewer.name}
                              </span>
                              {review.reviewer.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              )}
                              <Badge variant="outline">
                                {review.reviewer.tier}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.reviewer.location} • {review.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 font-medium">
                              {review.rating}.0
                            </span>
                          </div>
                          <Badge
                            className={`mt-1 ${
                              review.verified_purchase
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {review.verified_purchase
                              ? "Verified Purchase"
                              : "Unverified"}
                          </Badge>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div>
                        <h4 className="font-semibold text-lg mb-2">
                          {review.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {review.content}
                        </p>
                      </div>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
                            >
                              <Eye className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Review Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Like ({review.likes})
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {review.category}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Official Response */}
                      {review.response && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">
                              Official Response
                            </Badge>
                            <span className="text-sm font-medium">
                              {review.response.author}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {review.response.timestamp}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {review.response.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="write-review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      Overall Rating
                    </label>
                    <div className="flex items-center space-x-2 mt-2">
                      {renderStars(newRating, true, setNewRating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {newRating > 0
                          ? `${newRating} star${newRating > 1 ? "s" : ""}`
                          : "Select rating"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Review Category
                    </label>
                    <select className="w-full mt-1 p-2 border rounded-lg">
                      <option value="">Select category...</option>
                      <option value="platform">Platform Experience</option>
                      <option value="product">Product Quality</option>
                      <option value="supplier">Supplier Service</option>
                      <option value="delivery">Delivery & Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Your Review</label>
                    <Textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Share your experience with the savanna community..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Your review will be public and help other pride members
                      make informed decisions.
                    </div>
                    <Button
                      disabled={newRating === 0 || newReview.trim() === ""}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-reviews" className="space-y-6">
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't written any reviews yet. Share your experience
                  with the community!
                </p>
                <Button>Write Your First Review</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-bold text-green-600">96.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Review Response Rate</span>
                      <span className="font-bold">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Review Length</span>
                      <span className="font-bold">127 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Mentioned Feature</span>
                      <span className="font-bold">Fast Delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Group Buying</span>
                      <Badge>+45%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mobile App</span>
                      <Badge>+32%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Customer Service</span>
                      <Badge>+28%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>USSD Feature</span>
                      <Badge>+21%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reviews;
