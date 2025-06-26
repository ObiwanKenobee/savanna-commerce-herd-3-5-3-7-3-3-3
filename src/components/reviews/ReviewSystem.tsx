import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Camera,
  Shield,
  Award,
  TrendingUp,
  Filter,
  CheckCircle,
  AlertTriangle,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    avatar: string;
    type: "retailer" | "supplier" | "logistics";
    verified: boolean;
    total_reviews: number;
  };
  reviewee: {
    id: string;
    name: string;
    type: "retailer" | "supplier" | "logistics";
  };
  order_id?: string;
  rating: number;
  title: string;
  content: string;
  categories: {
    product_quality?: number;
    delivery_speed?: number;
    customer_service?: number;
    packaging?: number;
    value_for_money?: number;
  };
  pros: string[];
  cons: string[];
  photos?: string[];
  verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  responses: Array<{
    id: string;
    responder: {
      name: string;
      type: "business_owner" | "admin" | "customer";
    };
    content: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
  status: "published" | "pending" | "rejected";
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number;
  };
  category_averages: {
    product_quality: number;
    delivery_speed: number;
    customer_service: number;
    packaging: number;
    value_for_money: number;
  };
}

const StarRating = ({
  rating,
  size = "sm",
  interactive = false,
  onRatingChange,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= (hoverRating || rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
};

const ReviewCard = ({
  review,
  onHelpful,
  onResponse,
}: {
  review: Review;
  onHelpful: (reviewId: string, helpful: boolean) => void;
  onResponse: (reviewId: string) => void;
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const contentPreview =
    review.content.length > 200
      ? review.content.substring(0, 200) + "..."
      : review.content;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "supplier":
        return "🐘";
      case "logistics":
        return "🐆";
      default:
        return "🦌";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.reviewer.avatar} />
              <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">{review.reviewer.name}</p>
                {review.reviewer.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
                <Badge variant="outline" className="text-xs">
                  {getTypeIcon(review.reviewer.type)} {review.reviewer.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {review.verified_purchase && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Title */}
        {review.title && <h4 className="font-medium">{review.title}</h4>}

        {/* Category Ratings */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(review.categories).map(
            ([category, rating]) =>
              rating && (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600 capitalize">
                    {category.replace(/_/g, " ")}:
                  </span>
                  <StarRating rating={rating} size="sm" />
                </div>
              ),
          )}
        </div>

        {/* Review Content */}
        <div>
          <p className="text-gray-700 leading-relaxed">
            {showFullContent ? review.content : contentPreview}
          </p>
          {review.content.length > 200 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFullContent(!showFullContent)}
              className="p-0 h-auto text-green-600"
            >
              {showFullContent ? "Show less" : "Read more"}
            </Button>
          )}
        </div>

        {/* Pros and Cons */}
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {review.pros.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-600 mb-2">
                  👍 Pros:
                </h5>
                <ul className="text-sm space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-600 mb-2">
                  👎 Cons:
                </h5>
                <ul className="text-sm space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2 flex items-center">
              <Camera className="h-4 w-4 mr-1" />
              Photos ({review.photos.length})
            </h5>
            <div className="flex space-x-2">
              {review.photos.slice(0, 3).map((photo, index) => (
                <div
                  key={index}
                  className="h-16 w-16 bg-gray-100 rounded border cursor-pointer hover:opacity-80"
                  onClick={() => setShowPhotos(true)}
                >
                  <img
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              ))}
              {review.photos.length > 3 && (
                <div
                  className="h-16 w-16 bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:opacity-80"
                  onClick={() => setShowPhotos(true)}
                >
                  <span className="text-xs text-gray-600">
                    +{review.photos.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Response */}
        {review.responses.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 space-y-3">
            <h5 className="text-sm font-medium text-blue-800">
              Response from {review.reviewee.name}:
            </h5>
            {review.responses.map((response) => (
              <div key={response.id} className="text-sm">
                <p className="text-blue-700">{response.content}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {new Date(response.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful(review.id, true)}
              className="text-green-600 hover:text-green-700"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful ({review.helpful_count})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful(review.id, false)}
              className="text-red-600 hover:text-red-700"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />({review.not_helpful_count}
              )
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResponse(review.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewStats = ({ stats }: { stats: ReviewStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>Customer Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-600 mb-2">
            {stats.average_rating.toFixed(1)}
          </div>
          <StarRating rating={stats.average_rating} size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Based on {stats.total_reviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          <h4 className="font-medium">Rating Distribution</h4>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm w-8">{rating}★</span>
              <Progress
                value={
                  (stats.rating_distribution[rating] / stats.total_reviews) *
                  100
                }
                className="flex-1 h-2"
              />
              <span className="text-sm text-gray-600 w-12">
                {stats.rating_distribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Category Averages */}
        <div className="space-y-3">
          <h4 className="font-medium">Category Ratings</h4>
          {Object.entries(stats.category_averages).map(([category, rating]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-sm capitalize">
                {category.replace(/_/g, " ")}
              </span>
              <StarRating rating={rating} size="sm" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const WriteReviewDialog = ({
  isOpen,
  onClose,
  onSubmit,
  revieweeId,
  revieweeName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
  revieweeId: string;
  revieweeName: string;
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState({
    product_quality: 0,
    delivery_speed: 0,
    customer_service: 0,
    packaging: 0,
    value_for_money: 0,
  });
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide an overall rating",
        variant: "destructive",
      });
      return;
    }

    const reviewData = {
      reviewee_id: revieweeId,
      rating,
      title,
      content,
      categories: Object.fromEntries(
        Object.entries(categories).filter(([_, value]) => value > 0),
      ),
      pros: pros.filter((pro) => pro.trim()),
      cons: cons.filter((con) => con.trim()),
    };

    onSubmit(reviewData);
    onClose();

    // Reset form
    setRating(0);
    setTitle("");
    setContent("");
    setCategories({
      product_quality: 0,
      delivery_speed: 0,
      customer_service: 0,
      packaging: 0,
      value_for_money: 0,
    });
    setPros([""]);
    setCons([""]);
  };

  const addProCon = (type: "pros" | "cons") => {
    if (type === "pros") {
      setPros([...pros, ""]);
    } else {
      setCons([...cons, ""]);
    }
  };

  const updateProCon = (
    type: "pros" | "cons",
    index: number,
    value: string,
  ) => {
    if (type === "pros") {
      const newPros = [...pros];
      newPros[index] = value;
      setPros(newPros);
    } else {
      const newCons = [...cons];
      newCons[index] = value;
      setCons(newCons);
    }
  };

  const removeProCon = (type: "pros" | "cons", index: number) => {
    if (type === "pros") {
      setPros(pros.filter((_, i) => i !== index));
    } else {
      setCons(cons.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review for {revieweeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label>Overall Rating *</Label>
            <div className="mt-2">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <Label>Category Ratings (Optional)</Label>
            <div className="space-y-3 mt-2">
              {Object.entries(categories).map(([category, value]) => (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm capitalize">
                    {category.replace(/_/g, " ")}
                  </span>
                  <StarRating
                    rating={value}
                    size="sm"
                    interactive
                    onRatingChange={(newRating) =>
                      setCategories((prev) => ({
                        ...prev,
                        [category]: newRating,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title">Review Title</Label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Review Content */}
          <div>
            <Label htmlFor="content">Your Review</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your detailed experience..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>What did you like? (Pros)</Label>
              <div className="space-y-2 mt-2">
                {pros.map((pro, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={pro}
                      onChange={(e) =>
                        updateProCon("pros", index, e.target.value)
                      }
                      placeholder="Something positive..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    {pros.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProCon("pros", index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addProCon("pros")}
                  className="w-full"
                >
                  Add Another Pro
                </Button>
              </div>
            </div>

            <div>
              <Label>What could be improved? (Cons)</Label>
              <div className="space-y-2 mt-2">
                {cons.map((con, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={con}
                      onChange={(e) =>
                        updateProCon("cons", index, e.target.value)
                      }
                      placeholder="Something to improve..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                    {cons.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProCon("cons", index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addProCon("cons")}
                  className="w-full"
                >
                  Add Another Con
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={rating === 0}
            >
              Submit Review
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ReviewSystem = ({
  entityId,
  entityName,
  entityType = "supplier",
}: {
  entityId: string;
  entityName: string;
  entityType?: "supplier" | "retailer" | "logistics";
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { user } = useAuth();

  // Mock data - In production, this would come from Supabase
  useEffect(() => {
    const mockStats: ReviewStats = {
      average_rating: 4.3,
      total_reviews: 127,
      rating_distribution: {
        5: 67,
        4: 34,
        3: 15,
        2: 8,
        1: 3,
      },
      category_averages: {
        product_quality: 4.5,
        delivery_speed: 4.1,
        customer_service: 4.4,
        packaging: 4.2,
        value_for_money: 4.0,
      },
    };

    const mockReviews: Review[] = [
      {
        id: "rev_001",
        reviewer: {
          id: "user_001",
          name: "Sarah Kamau",
          avatar: "",
          type: "retailer",
          verified: true,
          total_reviews: 23,
        },
        reviewee: {
          id: entityId,
          name: entityName,
          type: entityType,
        },
        order_id: "ORD-12345",
        rating: 5,
        title: "Excellent quality and fast delivery!",
        content:
          "I've been ordering from this supplier for months now and they never disappoint. The maize flour quality is consistently excellent, packaging is professional, and delivery is always on time. Highly recommended for any retailer looking for reliable suppliers.",
        categories: {
          product_quality: 5,
          delivery_speed: 5,
          customer_service: 4,
          packaging: 5,
          value_for_money: 4,
        },
        pros: [
          "Consistent high quality",
          "Fast delivery",
          "Professional packaging",
          "Responsive customer service",
        ],
        cons: ["Slightly higher price than competitors"],
        photos: ["/mock-review-photo1.jpg", "/mock-review-photo2.jpg"],
        verified_purchase: true,
        helpful_count: 12,
        not_helpful_count: 1,
        responses: [
          {
            id: "resp_001",
            responder: {
              name: entityName,
              type: "business_owner",
            },
            content:
              "Thank you Sarah for the wonderful review! We're committed to maintaining these high standards and truly appreciate your continued trust in our products.",
            created_at: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ],
        created_at: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: "published",
      },
    ];

    setStats(mockStats);
    setReviews(mockReviews);
  }, [entityId, entityName, entityType]);

  const handleSubmitReview = async (reviewData: any) => {
    try {
      // In production, this would call Supabase
      console.log("Submitting review:", reviewData);

      toast({
        title: "Review submitted! ⭐",
        description:
          "Thank you for your feedback. Your review is being processed.",
      });

      // Simulate adding the review
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        reviewer: {
          id: user?.id || "current_user",
          name: user?.user_metadata?.first_name || "Anonymous",
          avatar: "",
          type: "retailer",
          verified: true,
          total_reviews: 1,
        },
        reviewee: {
          id: entityId,
          name: entityName,
          type: entityType,
        },
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        categories: reviewData.categories,
        pros: reviewData.pros,
        cons: reviewData.cons,
        verified_purchase: true,
        helpful_count: 0,
        not_helpful_count: 0,
        responses: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "published",
      };

      setReviews((prev) => [newReview, ...prev]);
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpful_count: helpful
              ? review.helpful_count + 1
              : review.helpful_count,
            not_helpful_count: !helpful
              ? review.not_helpful_count + 1
              : review.not_helpful_count,
          };
        }
        return review;
      }),
    );

    toast({
      title: helpful ? "Marked as helpful" : "Feedback recorded",
      description: "Thank you for your feedback!",
    });
  };

  const handleResponse = (reviewId: string) => {
    // In production, this would open a response dialog
    console.log("Responding to review:", reviewId);
    toast({
      title: "Response feature",
      description: "Response functionality would be implemented here",
    });
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filter === "all") return true;
      const rating = parseInt(filter);
      return review.rating === rating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful_count - a.helpful_count;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Reviews & Ratings</span>
          </h2>
          <p className="text-gray-600">
            See what customers are saying about {entityName}
          </p>
        </div>

        <Button
          onClick={() => setShowWriteReview(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Star className="h-4 w-4 mr-2" />
          Write Review
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1">
          {stats && <ReviewStats stats={stats} />}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label>Filter by Rating:</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {filteredAndSortedReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={handleHelpful}
                  onResponse={handleResponse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Star className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your experience with {entityName}
              </p>
              <Button
                onClick={() => setShowWriteReview(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Write First Review
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Dialog */}
      <WriteReviewDialog
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleSubmitReview}
        revieweeId={entityId}
        revieweeName={entityName}
      />
    </div>
  );
};

export default ReviewSystem;
