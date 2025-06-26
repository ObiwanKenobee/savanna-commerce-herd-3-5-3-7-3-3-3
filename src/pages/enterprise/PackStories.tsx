import React, { useState, useEffect } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Heart,
  Share2,
  MessageSquare,
  Eye,
  Calendar,
  User,
  MapPin,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Star,
  ThumbsUp,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Edit,
  Bookmark,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Quote,
  Loader2,
  Camera,
  FileText,
  Video,
  Mic,
} from "lucide-react";

interface PackStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    business_name: string;
    avatar: string;
    role: "retailer" | "supplier" | "logistics" | "admin";
    location: string;
  };
  category: string;
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves: number;
  };
  impact: {
    revenue_growth: number;
    efficiency_gain: number;
    cost_savings: number;
    time_saved: number;
  };
  media: {
    type: "image" | "video" | "audio";
    url: string;
    thumbnail?: string;
  }[];
  featured: boolean;
  verified: boolean;
  published_date: string;
  reading_time: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  success_score: number;
  status: "published" | "draft" | "pending";
}

const PackStories = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [stories, setStories] = useState<PackStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedStory, setSelectedStory] = useState<PackStory | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const categories = [
    "all",
    "growth_strategies",
    "cost_optimization",
    "digital_transformation",
    "supply_chain",
    "customer_success",
    "partnership",
    "innovation",
    "sustainability",
  ];

  const difficultyLevels = ["all", "beginner", "intermediate", "advanced"];

  const authorRoles = ["all", "retailer", "supplier", "logistics", "admin"];

  // Mock data for pack stories
  useEffect(() => {
    setStories([
      {
        id: "1",
        title:
          "From Small Kiosk to Multi-County Empire: The Mama Mboga Revolution",
        excerpt:
          "How Grace Wanjiku transformed her single fruit stall into a 47-location retail network using group buying and digital payments.",
        content: `
When Grace Wanjiku started selling fruits from a small wooden stall in Kawangware, she never imagined she'd one day run a retail empire spanning three counties. Today, her "Fresh Valley" network operates 47 locations, processes over KES 15 million monthly, and employs 180+ people.

**The Journey:**
Grace's transformation began when she joined Savanna Marketplace's group buying program in early 2022. "I was struggling to compete with the big supermarkets on pricing," she recalls. "Group buying changed everything."

**Key Strategies:**
1. **Smart Partnerships**: Formed buying cooperatives with 23 other mama mbogas
2. **Digital First**: Embraced M-Pesa BNPL for cash flow management
3. **Data-Driven**: Used platform analytics to identify high-demand products
4. **Community Focus**: Maintained personal relationships while scaling

**The Results:**
- 340% revenue growth in 18 months
- 67% reduction in procurement costs
- 45% improvement in inventory turnover
- Created 180+ jobs in her community

**Lessons Learned:**
"Success isn't about being the biggest, it's about being the smartest. Savanna Marketplace gave me the tools, but the community gave me the strength." - Grace Wanjiku

**Implementation Tips:**
- Start small with 3-5 trusted partners
- Focus on high-volume, low-margin products first
- Invest in mobile payment training for staff
- Use platform data to predict seasonal demands
        `,
        author: {
          name: "Grace Wanjiku",
          business_name: "Fresh Valley Network",
          avatar: "/api/placeholder/100/100",
          role: "retailer",
          location: "Nairobi",
        },
        category: "growth_strategies",
        tags: ["group_buying", "retail_expansion", "community", "mama_mboga"],
        metrics: {
          views: 12847,
          likes: 2341,
          shares: 567,
          comments: 189,
          saves: 843,
        },
        impact: {
          revenue_growth: 340,
          efficiency_gain: 67,
          cost_savings: 67,
          time_saved: 45,
        },
        media: [
          {
            type: "image",
            url: "/api/placeholder/600/400",
            thumbnail: "/api/placeholder/200/150",
          },
          {
            type: "video",
            url: "/api/placeholder/video",
            thumbnail: "/api/placeholder/300/200",
          },
        ],
        featured: true,
        verified: true,
        published_date: "2024-01-10",
        reading_time: 8,
        difficulty_level: "intermediate",
        success_score: 94,
        status: "published",
      },
      {
        id: "2",
        title:
          "Lightning-Fast Logistics: How Cheetah Deliveries Cut Costs by 60%",
        excerpt:
          "Peter Kimani's revolutionary route optimization system that reduced delivery costs while improving customer satisfaction.",
        content: `
Peter Kimani's "Cheetah Deliveries" was bleeding money on fuel and inefficient routes. Today, it's Kenya's most profitable last-mile delivery service, with 60% lower costs and 97% customer satisfaction.

**The Challenge:**
Traditional routing was costing KES 150 per delivery with frequent delays and frustrated customers. Fuel costs alone were eating 40% of revenue.

**The Innovation:**
Peter developed an AI-powered route optimization system using Savanna Marketplace's logistics API, combined with real-time traffic data and customer preferences.

**Key Innovations:**
1. **Smart Clustering**: Groups deliveries by location and time windows
2. **Dynamic Routing**: Adjusts routes in real-time based on traffic
3. **Customer Communication**: Automated SMS updates with precise ETAs
4. **Driver Gamification**: Performance incentives for efficiency

**The Results:**
- 60% reduction in delivery costs
- 85% improvement in on-time delivery
- 97% customer satisfaction score
- 200% increase in daily deliveries per vehicle

**Technology Stack:**
- Savanna Marketplace Logistics API
- Google Maps Platform
- Custom route optimization algorithm
- M-Pesa integration for instant payments

**Scaling Strategy:**
"We started with 3 vehicles in Nakuru. Now we're in 8 counties with 45 vehicles. The system scales beautifully." - Peter Kimani

**Next Steps:**
- Drone delivery pilot program
- Cross-border expansion to Uganda
- Partnership with e-commerce platforms
        `,
        author: {
          name: "Peter Kimani",
          business_name: "Cheetah Deliveries",
          avatar: "/api/placeholder/100/100",
          role: "logistics",
          location: "Nakuru",
        },
        category: "cost_optimization",
        tags: ["logistics", "route_optimization", "ai", "delivery"],
        metrics: {
          views: 8932,
          likes: 1654,
          shares: 432,
          comments: 112,
          saves: 521,
        },
        impact: {
          revenue_growth: 200,
          efficiency_gain: 85,
          cost_savings: 60,
          time_saved: 70,
        },
        media: [
          {
            type: "image",
            url: "/api/placeholder/600/400",
            thumbnail: "/api/placeholder/200/150",
          },
          {
            type: "audio",
            url: "/api/placeholder/audio",
          },
        ],
        featured: true,
        verified: true,
        published_date: "2024-01-08",
        reading_time: 6,
        difficulty_level: "advanced",
        success_score: 88,
        status: "published",
      },
      {
        id: "3",
        title: "Digital Transformation: From Analog to Analytics in 90 Days",
        excerpt:
          "How Ahmed Hassan's electronics shop embraced digital tools to increase sales by 156% and reduce inventory waste by 80%.",
        content: `
Ahmed Hassan's Coast Electronics was stuck in the analog age. Paper records, manual inventory, and gut-feeling purchasing decisions were slowly killing his business. Then came the 90-day digital transformation that changed everything.

**The Old Way:**
- Hand-written sales records
- Excel inventory (when lucky)
- No customer data
- 40% inventory waste
- Frequent stockouts of popular items

**The Transformation:**
Ahmed partnered with Savanna Marketplace's digital transformation team to implement a comprehensive system overhaul.

**Digital Solutions Implemented:**
1. **POS Integration**: Real-time sales tracking and customer profiles
2. **Inventory Management**: Automated reordering and demand forecasting
3. **Customer Analytics**: Purchase pattern analysis and targeted marketing
4. **Financial Dashboard**: Real-time profitability and cash flow tracking

**90-Day Results:**
- 156% increase in sales
- 80% reduction in inventory waste
- 67% improvement in cash flow
- 92% customer retention rate

**Key Learnings:**
"I was afraid of technology, but the Savanna team made it simple. Now I can't imagine running my business without data." - Ahmed Hassan

**Implementation Timeline:**
- Week 1-2: System setup and data migration
- Week 3-6: Staff training and process adaptation
- Week 7-12: Optimization and advanced features

**ROI Analysis:**
- System cost: KES 180,000
- Monthly savings: KES 95,000
- Break-even: 2.1 months
- 12-month ROI: 387%

**Best Practices:**
- Start with critical pain points
- Invest in staff training
- Use data to make decisions, not justify them
- Iterate and improve continuously
        `,
        author: {
          name: "Ahmed Hassan",
          business_name: "Coast Electronics Hub",
          avatar: "/api/placeholder/100/100",
          role: "retailer",
          location: "Mombasa",
        },
        category: "digital_transformation",
        tags: ["digitization", "pos_system", "analytics", "inventory"],
        metrics: {
          views: 6742,
          likes: 1287,
          shares: 298,
          comments: 87,
          saves: 456,
        },
        impact: {
          revenue_growth: 156,
          efficiency_gain: 67,
          cost_savings: 80,
          time_saved: 50,
        },
        media: [
          {
            type: "image",
            url: "/api/placeholder/600/400",
            thumbnail: "/api/placeholder/200/150",
          },
        ],
        featured: false,
        verified: true,
        published_date: "2024-01-05",
        reading_time: 7,
        difficulty_level: "beginner",
        success_score: 82,
        status: "published",
      },
      {
        id: "4",
        title: "Sustainable Success: Building an Eco-Friendly Supply Chain",
        excerpt:
          "How Green Supplies Kenya reduced environmental impact by 70% while increasing profitability through sustainable practices.",
        content: `
When James Muthoni started Green Supplies Kenya, sustainability was just a nice-to-have. Today, it's his biggest competitive advantage, driving 45% of his revenue growth while reducing environmental impact by 70%.

**The Sustainability Journey:**
Green Supplies began as a traditional agricultural input supplier. The transformation to sustainability started when farmers began demanding eco-friendly alternatives.

**Sustainable Initiatives:**
1. **Eco-Packaging**: Biodegradable packaging for all products
2. **Carbon-Neutral Delivery**: Electric vehicles and carbon offset programs
3. **Local Sourcing**: 85% of products sourced within 100km radius
4. **Waste Reduction**: Closed-loop packaging return system

**Environmental Impact:**
- 70% reduction in carbon footprint
- 90% reduction in plastic waste
- 60% less water usage in operations
- 100% renewable energy for warehouses

**Business Results:**
- 45% revenue growth from eco-conscious customers
- 35% premium pricing for sustainable products
- 25% cost reduction through efficiency gains
- 89% customer loyalty rate

**Customer Response:**
"Our sustainable practices attracted a new customer segment willing to pay premium prices for environmentally responsible products." - James Muthoni

**Challenges Overcome:**
- Higher initial costs for sustainable materials
- Staff training on new processes
- Supply chain complexity
- Customer education requirements

**Future Goals:**
- 100% plastic-free packaging by 2025
- Expansion to 10 new eco-product lines
- Partnership with 500+ sustainable farmers
- Launch of carbon credit marketplace

**Replication Framework:**
James has created a sustainability playbook that other suppliers can follow:
1. Assess current environmental impact
2. Identify quick wins and long-term goals
3. Engage customers in the journey
4. Measure and communicate progress
5. Continuously innovate and improve
        `,
        author: {
          name: "James Muthoni",
          business_name: "Green Supplies Kenya",
          avatar: "/api/placeholder/100/100",
          role: "supplier",
          location: "Nyeri",
        },
        category: "sustainability",
        tags: [
          "sustainability",
          "eco_friendly",
          "green_business",
          "supply_chain",
        ],
        metrics: {
          views: 4521,
          likes: 897,
          shares: 234,
          comments: 67,
          saves: 312,
        },
        impact: {
          revenue_growth: 45,
          efficiency_gain: 25,
          cost_savings: 25,
          time_saved: 15,
        },
        media: [
          {
            type: "image",
            url: "/api/placeholder/600/400",
            thumbnail: "/api/placeholder/200/150",
          },
          {
            type: "video",
            url: "/api/placeholder/video",
            thumbnail: "/api/placeholder/300/200",
          },
        ],
        featured: false,
        verified: true,
        published_date: "2024-01-03",
        reading_time: 9,
        difficulty_level: "intermediate",
        success_score: 78,
        status: "published",
      },
    ]);
  }, []);

  // Filter and sort stories
  const filteredStories = stories
    .filter((story) => {
      const matchesSearch =
        searchQuery === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || story.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "all" || story.difficulty_level === selectedLevel;
      const matchesRole =
        selectedRole === "all" || story.author.role === selectedRole;

      return matchesSearch && matchesCategory && matchesLevel && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.success_score - a.success_score;
        case "popular":
          return b.metrics.views - a.metrics.views;
        case "recent":
          return (
            new Date(b.published_date).getTime() -
            new Date(a.published_date).getTime()
          );
        case "success_score":
          return b.success_score - a.success_score;
        case "reading_time":
          return a.reading_time - b.reading_time;
        default:
          return 0;
      }
    });

  const toggleFavorite = (storyId: string) => {
    setFavorites((prev) =>
      prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId],
    );

    toast({
      title: favorites.includes(storyId)
        ? "Removed from bookmarks"
        : "Added to bookmarks",
      description: "Your reading list has been updated",
    });
  };

  const handleShare = (story: PackStory) => {
    navigator
      .share?.({
        title: story.title,
        text: story.excerpt,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "Share this story with others",
        });
      });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "retailer":
        return "🛒";
      case "supplier":
        return "🏭";
      case "logistics":
        return "🚛";
      case "admin":
        return "👑";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "retailer":
        return "bg-green-100 text-green-800";
      case "supplier":
        return "bg-blue-100 text-blue-800";
      case "logistics":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatNumber = (num: number | undefined | null) => {
    // Handle NaN, undefined, or null values
    if (isNaN(num as number) || num === null || num === undefined) {
      return "0";
    }

    const validNum = Number(num);
    if (isNaN(validNum)) {
      return "0";
    }

    if (validNum >= 1000) {
      return `${(validNum / 1000).toFixed(1)}K`;
    }
    return Math.round(validNum).toString();
  };

  // Helper function to safely get numeric values
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStoryCard = (story: PackStory) => (
    <Card
      key={story.id}
      className="group hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-300"
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📖</div>
            <div className="text-sm text-gray-600">
              {story.category.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Story Status Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {story.featured && (
            <Badge className="bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {story.verified && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Reading Time */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{story.reading_time} min</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
              {story.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {story.excerpt}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
              {getRoleIcon(story.author.role)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {story.author.name}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {story.author.business_name}
            </div>
          </div>
          <Badge className={getRoleColor(story.author.role)} variant="outline">
            {story.author.role}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {story.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag.replace("_", " ")}
            </Badge>
          ))}
          {story.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{story.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-semibold text-blue-600">
              {formatNumber(safeNumber(story.metrics.views))}
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-semibold text-green-600">
              {story.success_score}
            </div>
            <div className="text-xs text-gray-600">Score</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-semibold text-purple-600">
              +{safeNumber(story.impact.revenue_growth)}%
            </div>
            <div className="text-xs text-gray-600">Growth</div>
          </div>
        </div>

        {/* Difficulty & Date */}
        <div className="flex items-center justify-between text-sm">
          <Badge
            className={getDifficultyColor(story.difficulty_level)}
            variant="outline"
          >
            {story.difficulty_level}
          </Badge>
          <span className="text-gray-500">
            {formatDate(story.published_date)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={() => {
              setSelectedStory(story);
              setIsStoryDialogOpen(true);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavorite(story.id)}
          >
            <Bookmark
              className={`h-4 w-4 ${favorites.includes(story.id) ? "fill-blue-500 text-blue-500" : "text-gray-600"}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare(story)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStoryList = (story: PackStory) => (
    <Card key={story.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-2xl">📖</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {story.excerpt}
                </p>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                {story.featured && <Star className="h-4 w-4 text-yellow-500" />}
                {story.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{story.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{story.reading_time} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>
                  {formatNumber(safeNumber(story.metrics.views))} views
                </span>
              </div>
              <Badge
                className={getDifficultyColor(story.difficulty_level)}
                variant="outline"
              >
                {story.difficulty_level}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {story.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag.replace("_", " ")}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedStory(story);
                    setIsStoryDialogOpen(true);
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(story.id)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${favorites.includes(story.id) ? "fill-blue-500 text-blue-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <EnterpriseNavigation />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-4xl">📖</div>
              <h1 className="text-4xl font-bold text-blue-800">Pack Stories</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real success stories from the Savanna Marketplace community. Learn
              from entrepreneurs who've transformed their businesses and
              discover proven strategies for growth.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {stories.length}
                </div>
                <div className="text-sm text-gray-600">Success Stories</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {stories.length > 0
                    ? Math.round(
                        stories.reduce(
                          (sum, s) => sum + safeNumber(s.impact.revenue_growth),
                          0,
                        ) / stories.length,
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Avg Growth</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(
                    stories.reduce(
                      (sum, s) => sum + safeNumber(s.metrics.views),
                      0,
                    ),
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {stories.length > 0
                    ? Math.round(
                        stories.reduce(
                          (sum, s) => sum + safeNumber(s.reading_time),
                          0,
                        ) / stories.length,
                      )
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Avg Read Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search success stories, authors, or strategies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all"
                            ? "All Categories"
                            : category
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level === "all"
                            ? "All Levels"
                            : level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authorRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role === "all"
                            ? "All Authors"
                            : role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="success_score">
                        Success Score
                      </SelectItem>
                      <SelectItem value="reading_time">Reading Time</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
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

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found {filteredStories.length} success stories
            </div>
            {user && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            )}
          </div>

          {/* Success Stories */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredStories.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-lg font-semibold mb-2">No Stories Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or be the first to share a
                  story in this category.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Your Success Story
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredStories.map((story) =>
                viewMode === "grid"
                  ? renderStoryCard(story)
                  : renderStoryList(story),
              )}
            </div>
          )}
        </div>
      </main>

      {/* Story Detail Dialog */}
      <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl leading-tight">
                      {selectedStory.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                      {selectedStory.excerpt}
                    </DialogDescription>

                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getRoleIcon(selectedStory.author.role)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {selectedStory.author.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {selectedStory.author.business_name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getRoleColor(selectedStory.author.role)}
                        >
                          {selectedStory.author.role}
                        </Badge>
                        <Badge
                          className={getDifficultyColor(
                            selectedStory.difficulty_level,
                          )}
                        >
                          {selectedStory.difficulty_level}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStory.success_score}
                    </div>
                    <div className="text-xs text-gray-600">Success Score</div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>

                <TabsContent value="story" className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {selectedStory.content}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {selectedStory.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="impact" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          +{safeNumber(selectedStory.impact.revenue_growth)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Revenue Growth
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          +{safeNumber(selectedStory.impact.efficiency_gain)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Efficiency Gain
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          -{safeNumber(selectedStory.impact.cost_savings)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Cost Savings
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          -{safeNumber(selectedStory.impact.time_saved)}%
                        </div>
                        <div className="text-sm text-gray-600">Time Saved</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Success Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Success Score:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedStory.success_score}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Implementation Time:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedStory.reading_time} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Difficulty Level:
                          </span>
                          <Badge
                            className={getDifficultyColor(
                              selectedStory.difficulty_level,
                            )}
                          >
                            {selectedStory.difficulty_level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Author Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Business:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedStory.author.business_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Location:
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {selectedStory.author.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Role:</span>
                          <Badge
                            className={getRoleColor(selectedStory.author.role)}
                          >
                            {selectedStory.author.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="engagement" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {formatNumber(
                            safeNumber(selectedStory.metrics.views),
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Views</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-red-600">
                          {formatNumber(
                            safeNumber(selectedStory.metrics.likes),
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Likes</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">
                          {formatNumber(
                            safeNumber(selectedStory.metrics.shares),
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Shares</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {formatNumber(
                            safeNumber(selectedStory.metrics.comments),
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Comments</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {formatNumber(
                            safeNumber(selectedStory.metrics.saves),
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Saves</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Reading Stats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">
                          Reading Time:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedStory.reading_time} minutes
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">
                          Published:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedStory.published_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium">
                          {selectedStory.category
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex space-x-2">
                <Button
                  onClick={() => toggleFavorite(selectedStory.id)}
                  variant="outline"
                >
                  <Bookmark
                    className={`h-4 w-4 mr-2 ${favorites.includes(selectedStory.id) ? "fill-blue-500 text-blue-500" : "text-gray-600"}`}
                  />
                  {favorites.includes(selectedStory.id)
                    ? "Bookmarked"
                    : "Bookmark"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedStory)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Story
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Author
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <EnterpriseFooter />
    </div>
  );
};

export default PackStories;
