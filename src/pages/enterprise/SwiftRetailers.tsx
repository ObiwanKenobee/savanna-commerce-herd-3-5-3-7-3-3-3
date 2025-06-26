import React, { useState, useEffect } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Zap,
  TrendingUp,
  MapPin,
  Star,
  Clock,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  Award,
  Calendar,
  BarChart3,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Crown,
  Truck,
  Timer,
  Activity,
  Plus,
  Edit,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

interface RetailerProfile {
  id: string;
  business_name: string;
  owner_name: string;
  description: string;
  location: string;
  category: string;
  contact_info: {
    email: string;
    phone: string;
    address?: string;
  };
  performance_metrics: {
    velocity_score: number; // 0-100
    monthly_orders: number;
    average_order_value: number;
    growth_rate: number; // percentage
    response_time: number; // hours
    fulfillment_rate: number; // percentage
    customer_satisfaction: number; // 0-5
  };
  speed_indicators: {
    quick_pay: boolean;
    same_day_pickup: boolean;
    bulk_orders: boolean;
    auto_reorder: boolean;
    mobile_optimized: boolean;
  };
  trading_patterns: {
    peak_hours: string[];
    preferred_categories: string[];
    seasonal_peaks: string[];
    order_frequency: "daily" | "weekly" | "monthly";
  };
  achievements: {
    badges: string[];
    milestones: string[];
    rankings: { category: string; position: number }[];
  };
  membership_tier: "cheetah" | "gazelle" | "springbok" | "impala";
  joined_date: string;
  last_order: string;
  status: "active" | "super_active" | "dormant";
  verified: boolean;
  premium: boolean;
}

const SwiftRetailers = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("velocity");
  const [retailers, setRetailers] = useState<RetailerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRetailer, setSelectedRetailer] =
    useState<RetailerProfile | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const categories = [
    "all",
    "electronics",
    "fashion",
    "groceries",
    "pharmacy",
    "hardware",
    "automotive",
    "books",
    "home_garden",
  ];

  const locations = [
    "all",
    "nairobi",
    "mombasa",
    "kisumu",
    "nakuru",
    "eldoret",
    "thika",
    "machakos",
    "nyeri",
  ];

  const membershipTiers = ["all", "cheetah", "gazelle", "springbok", "impala"];

  // Mock data for swift retailers
  useEffect(() => {
    setRetailers([
      {
        id: "1",
        business_name: "Lightning Electronics",
        owner_name: "David Mwangi",
        description:
          "High-speed electronics retailer specializing in same-day delivery and instant payment processing across Nairobi.",
        location: "nairobi",
        category: "electronics",
        contact_info: {
          email: "david@lightning-electronics.co.ke",
          phone: "+254712345678",
          address: "Westlands, Nairobi",
        },
        performance_metrics: {
          velocity_score: 95,
          monthly_orders: 2850,
          average_order_value: 25000,
          growth_rate: 23.5,
          response_time: 0.5,
          fulfillment_rate: 98,
          customer_satisfaction: 4.8,
        },
        speed_indicators: {
          quick_pay: true,
          same_day_pickup: true,
          bulk_orders: true,
          auto_reorder: true,
          mobile_optimized: true,
        },
        trading_patterns: {
          peak_hours: ["09:00-11:00", "14:00-16:00", "19:00-21:00"],
          preferred_categories: ["smartphones", "laptops", "accessories"],
          seasonal_peaks: ["december", "march", "august"],
          order_frequency: "daily",
        },
        achievements: {
          badges: [
            "Speed Demon",
            "Volume Leader",
            "5-Star Service",
            "Tech Pioneer",
          ],
          milestones: ["1000+ Orders", "98% Fulfillment", "Top 1% Velocity"],
          rankings: [
            { category: "electronics", position: 1 },
            { category: "nairobi", position: 3 },
          ],
        },
        membership_tier: "cheetah",
        joined_date: "2022-01-15",
        last_order: "2024-01-15",
        status: "super_active",
        verified: true,
        premium: true,
      },
      {
        id: "2",
        business_name: "Flash Fashion Hub",
        owner_name: "Sarah Akinyi",
        description:
          "Trendy fashion retailer with lightning-fast inventory turnover and rapid trend adoption across Western Kenya.",
        location: "kisumu",
        category: "fashion",
        contact_info: {
          email: "sarah@flash-fashion.co.ke",
          phone: "+254723456789",
          address: "Kisumu Central",
        },
        performance_metrics: {
          velocity_score: 88,
          monthly_orders: 1650,
          average_order_value: 8500,
          growth_rate: 31.2,
          response_time: 1.2,
          fulfillment_rate: 94,
          customer_satisfaction: 4.6,
        },
        speed_indicators: {
          quick_pay: true,
          same_day_pickup: true,
          bulk_orders: false,
          auto_reorder: true,
          mobile_optimized: true,
        },
        trading_patterns: {
          peak_hours: ["10:00-12:00", "15:00-17:00"],
          preferred_categories: ["women_fashion", "accessories", "footwear"],
          seasonal_peaks: ["december", "april", "august"],
          order_frequency: "weekly",
        },
        achievements: {
          badges: ["Fashion Forward", "Trend Setter", "Customer Favorite"],
          milestones: ["500+ Orders", "90%+ Growth", "Regional Leader"],
          rankings: [
            { category: "fashion", position: 2 },
            { category: "kisumu", position: 1 },
          ],
        },
        membership_tier: "gazelle",
        joined_date: "2022-06-20",
        last_order: "2024-01-14",
        status: "super_active",
        verified: true,
        premium: false,
      },
      {
        id: "3",
        business_name: "Rapid Grocers",
        owner_name: "John Kiprotich",
        description:
          "Efficient grocery chain with optimized supply chains and quick inventory turnover serving multiple counties.",
        location: "nakuru",
        category: "groceries",
        contact_info: {
          email: "john@rapid-grocers.co.ke",
          phone: "+254734567890",
          address: "Nakuru Town",
        },
        performance_metrics: {
          velocity_score: 82,
          monthly_orders: 3200,
          average_order_value: 4500,
          growth_rate: 18.7,
          response_time: 2.1,
          fulfillment_rate: 96,
          customer_satisfaction: 4.4,
        },
        speed_indicators: {
          quick_pay: true,
          same_day_pickup: false,
          bulk_orders: true,
          auto_reorder: true,
          mobile_optimized: false,
        },
        trading_patterns: {
          peak_hours: ["06:00-08:00", "17:00-19:00"],
          preferred_categories: [
            "fresh_produce",
            "packaged_goods",
            "beverages",
          ],
          seasonal_peaks: ["december", "january", "april"],
          order_frequency: "daily",
        },
        achievements: {
          badges: ["Volume King", "Reliable Partner", "Growth Champion"],
          milestones: ["2000+ Orders", "95%+ Fulfillment", "Multi-County"],
          rankings: [
            { category: "groceries", position: 3 },
            { category: "nakuru", position: 2 },
          ],
        },
        membership_tier: "springbok",
        joined_date: "2021-11-10",
        last_order: "2024-01-15",
        status: "active",
        verified: true,
        premium: false,
      },
      {
        id: "4",
        business_name: "Quick Pharmacy Plus",
        owner_name: "Dr. Mary Wanjala",
        description:
          "Healthcare-focused retailer with rapid prescription processing and emergency medication delivery services.",
        location: "mombasa",
        category: "pharmacy",
        contact_info: {
          email: "mary@quick-pharmacy.co.ke",
          phone: "+254745678901",
          address: "Nyali, Mombasa",
        },
        performance_metrics: {
          velocity_score: 91,
          monthly_orders: 980,
          average_order_value: 12000,
          growth_rate: 28.9,
          response_time: 0.8,
          fulfillment_rate: 99,
          customer_satisfaction: 4.9,
        },
        speed_indicators: {
          quick_pay: true,
          same_day_pickup: true,
          bulk_orders: false,
          auto_reorder: false,
          mobile_optimized: true,
        },
        trading_patterns: {
          peak_hours: ["08:00-10:00", "12:00-14:00", "18:00-20:00"],
          preferred_categories: [
            "prescription",
            "otc_medicines",
            "health_supplements",
          ],
          seasonal_peaks: ["january", "june", "october"],
          order_frequency: "weekly",
        },
        achievements: {
          badges: ["Healthcare Hero", "Emergency Ready", "Trust Builder"],
          milestones: ["99% Fulfillment", "500+ Orders", "Emergency Certified"],
          rankings: [
            { category: "pharmacy", position: 1 },
            { category: "mombasa", position: 4 },
          ],
        },
        membership_tier: "cheetah",
        joined_date: "2023-02-28",
        last_order: "2024-01-15",
        status: "super_active",
        verified: true,
        premium: true,
      },
    ]);
  }, []);

  // Filter and sort retailers
  const filteredRetailers = retailers
    .filter((retailer) => {
      const matchesSearch =
        searchQuery === "" ||
        retailer.business_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        retailer.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        retailer.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || retailer.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "all" || retailer.location === selectedLocation;
      const matchesTier =
        selectedTier === "all" || retailer.membership_tier === selectedTier;

      return matchesSearch && matchesCategory && matchesLocation && matchesTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "velocity":
          return (
            b.performance_metrics.velocity_score -
            a.performance_metrics.velocity_score
          );
        case "orders":
          return (
            b.performance_metrics.monthly_orders -
            a.performance_metrics.monthly_orders
          );
        case "growth":
          return (
            b.performance_metrics.growth_rate -
            a.performance_metrics.growth_rate
          );
        case "satisfaction":
          return (
            b.performance_metrics.customer_satisfaction -
            a.performance_metrics.customer_satisfaction
          );
        case "name":
          return a.business_name.localeCompare(b.business_name);
        default:
          return 0;
      }
    });

  const handlePartner = (retailer: RetailerProfile) => {
    toast({
      title: `Partnership request sent to ${retailer.business_name}`,
      description: "You'll receive a response within 24 hours",
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "cheetah":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "gazelle":
        return "bg-green-100 text-green-800 border-green-200";
      case "springbok":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "impala":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "cheetah":
        return "🐆";
      case "gazelle":
        return "🦌";
      case "springbok":
        return "🦘";
      case "impala":
        return "🦓";
      default:
        return "🐾";
    }
  };

  const getVelocityLevel = (score: number) => {
    if (score >= 90)
      return { label: "Lightning", color: "text-yellow-600", icon: "⚡" };
    if (score >= 80)
      return { label: "Rapid", color: "text-blue-600", icon: "🚀" };
    if (score >= 70)
      return { label: "Swift", color: "text-green-600", icon: "💨" };
    return { label: "Standard", color: "text-gray-600", icon: "🏃" };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    return `KES ${(amount / 1000).toFixed(0)}K`;
  };

  const renderRetailerCard = (retailer: RetailerProfile) => {
    const velocity = getVelocityLevel(
      retailer.performance_metrics.velocity_score,
    );

    return (
      <Card
        key={retailer.id}
        className="group hover:shadow-lg transition-all duration-300 border-yellow-100 hover:border-yellow-300"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold">
                  {getTierIcon(retailer.membership_tier)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg group-hover:text-yellow-600 transition-colors">
                  {retailer.business_name}
                </CardTitle>
                <div className="text-sm text-gray-600">
                  {retailer.owner_name}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    className={getTierColor(retailer.membership_tier)}
                    variant="outline"
                  >
                    {retailer.membership_tier}
                  </Badge>
                  {retailer.status === "super_active" && (
                    <Badge
                      className="bg-red-100 text-red-800 border-red-200"
                      variant="outline"
                    >
                      Super Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xl">{velocity.icon}</span>
                <span className={`text-sm font-semibold ${velocity.color}`}>
                  {retailer.performance_metrics.velocity_score}
                </span>
              </div>
              <div className="text-xs text-gray-500">{velocity.label}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{retailer.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span className="capitalize">{retailer.category}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {retailer.description}
          </p>

          {/* Speed Indicators */}
          <div className="flex flex-wrap gap-1">
            {Object.entries(retailer.speed_indicators).map(
              ([key, enabled]) =>
                enabled && (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ),
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-sm font-semibold text-green-600">
                {formatNumber(retailer.performance_metrics.monthly_orders)}
              </div>
              <div className="text-xs text-gray-600">Monthly Orders</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-sm font-semibold text-blue-600">
                {formatCurrency(
                  retailer.performance_metrics.average_order_value,
                )}
              </div>
              <div className="text-xs text-gray-600">Avg Order</div>
            </div>
          </div>

          {/* Growth Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                +{retailer.performance_metrics.growth_rate}%
              </span>
              <span className="text-xs text-gray-600">growth</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">
                {retailer.performance_metrics.customer_satisfaction}
              </span>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-gray-600">Response:</span>
              <span className="font-medium">
                {retailer.performance_metrics.response_time}h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {retailer.performance_metrics.fulfillment_rate}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => handlePartner(retailer)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              Partner
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedRetailer(retailer);
                setIsProfileDialogOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRetailerList = (retailer: RetailerProfile) => {
    const velocity = getVelocityLevel(
      retailer.performance_metrics.velocity_score,
    );

    return (
      <Card key={retailer.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold text-2xl">
                {getTierIcon(retailer.membership_tier)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg truncate">
                  {retailer.business_name}
                </h3>
                <Badge
                  className={getTierColor(retailer.membership_tier)}
                  variant="outline"
                >
                  {retailer.membership_tier}
                </Badge>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-semibold ${velocity.color}`}>
                    {retailer.performance_metrics.velocity_score}
                  </span>
                  <span className="text-lg">{velocity.icon}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span>{retailer.owner_name}</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span className="capitalize">{retailer.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>
                    {retailer.performance_metrics.customer_satisfaction}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {retailer.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm">
                  <div className="text-green-600 font-medium">
                    {formatNumber(retailer.performance_metrics.monthly_orders)}{" "}
                    orders/mo
                  </div>
                  <div className="text-blue-600 font-medium">
                    +{retailer.performance_metrics.growth_rate}% growth
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePartner(retailer)}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Partner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <EnterpriseNavigation />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-4xl">⚡</div>
              <h1 className="text-4xl font-bold text-yellow-800">
                Swift Retailers
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with high-velocity retailers who prioritize speed,
              efficiency, and rapid growth. Partner with the fastest-moving
              businesses in Kenya's marketplace ecosystem.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {retailers.length}
                </div>
                <div className="text-sm text-gray-600">Swift Retailers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    retailers.reduce(
                      (sum, r) => sum + r.performance_metrics.velocity_score,
                      0,
                    ) / retailers.length,
                  )}
                </div>
                <div className="text-sm text-gray-600">Avg Velocity</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(
                    retailers.reduce(
                      (sum, r) => sum + r.performance_metrics.monthly_orders,
                      0,
                    ),
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Orders/mo</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    retailers.reduce(
                      (sum, r) => sum + r.performance_metrics.growth_rate,
                      0,
                    ) / retailers.length,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Avg Growth</div>
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
                      placeholder="Search swift retailers, owners, or specialties..."
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
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all"
                            ? "All Locations"
                            : location.charAt(0).toUpperCase() +
                              location.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipTiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier === "all"
                            ? "All Tiers"
                            : tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="velocity">Velocity Score</SelectItem>
                      <SelectItem value="orders">Monthly Orders</SelectItem>
                      <SelectItem value="growth">Growth Rate</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
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
              Found {filteredRetailers.length} swift retailers
            </div>
          </div>

          {/* Swift Retailers */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            </div>
          ) : filteredRetailers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2">
                  No Swift Retailers Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or explore different
                  categories.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Become a Swift Retailer
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
              {filteredRetailers.map((retailer) =>
                viewMode === "grid"
                  ? renderRetailerCard(retailer)
                  : renderRetailerList(retailer),
              )}
            </div>
          )}
        </div>
      </main>

      {/* Retailer Detail Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRetailer && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold text-2xl">
                      {getTierIcon(selectedRetailer.membership_tier)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedRetailer.business_name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedRetailer.owner_name} •{" "}
                      {selectedRetailer.category}
                    </DialogDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={getTierColor(
                          selectedRetailer.membership_tier,
                        )}
                      >
                        {selectedRetailer.membership_tier}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Velocity:{" "}
                        {selectedRetailer.performance_metrics.velocity_score}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Business Description</h4>
                    <p className="text-gray-600">
                      {selectedRetailer.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedRetailer.contact_info.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedRetailer.contact_info.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm capitalize">
                            {selectedRetailer.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Speed Indicators</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedRetailer.speed_indicators).map(
                          ([key, enabled]) => (
                            <div
                              key={key}
                              className="flex items-center space-x-2"
                            >
                              {enabled ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Minus className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm">
                                {key
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedRetailer.performance_metrics.velocity_score}
                        </div>
                        <div className="text-sm text-gray-600">
                          Velocity Score
                        </div>
                        <Progress
                          value={
                            selectedRetailer.performance_metrics.velocity_score
                          }
                          className="mt-2 h-2"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(
                            selectedRetailer.performance_metrics.monthly_orders,
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Monthly Orders
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(
                            selectedRetailer.performance_metrics
                              .average_order_value,
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Avg Order Value
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          +{selectedRetailer.performance_metrics.growth_rate}%
                        </div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {selectedRetailer.performance_metrics.response_time}h
                        </div>
                        <div className="text-sm text-gray-600">
                          Response Time
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-green-600">
                          {
                            selectedRetailer.performance_metrics
                              .fulfillment_rate
                          }
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          Fulfillment Rate
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-yellow-600">
                          {
                            selectedRetailer.performance_metrics
                              .customer_satisfaction
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          Customer Rating
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="patterns" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Trading Patterns</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">
                            Peak Hours:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedRetailer.trading_patterns.peak_hours.map(
                              (hour, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {hour}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">
                            Order Frequency:
                          </span>
                          <Badge className="ml-2" variant="outline">
                            {selectedRetailer.trading_patterns.order_frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">
                        Preferred Categories
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRetailer.trading_patterns.preferred_categories.map(
                          (category, index) => (
                            <Badge key={index} variant="secondary">
                              {category.replace("_", " ")}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Seasonal Peaks</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedRetailer.trading_patterns.seasonal_peaks.map(
                        (month, index) => (
                          <Badge
                            key={index}
                            className="bg-green-100 text-green-800"
                          >
                            {month.charAt(0).toUpperCase() + month.slice(1)}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Badges Earned</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRetailer.achievements.badges.map(
                        (badge, index) => (
                          <Badge
                            key={index}
                            className="bg-yellow-100 text-yellow-800"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {selectedRetailer.achievements.milestones.map(
                        (milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{milestone}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Rankings</h4>
                    <div className="space-y-2">
                      {selectedRetailer.achievements.rankings.map(
                        (ranking, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm font-medium">
                              {ranking.category.charAt(0).toUpperCase() +
                                ranking.category.slice(1)}
                            </span>
                            <Badge className="bg-blue-100 text-blue-800">
                              #{ranking.position}
                            </Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex space-x-2">
                <Button
                  onClick={() => handlePartner(selectedRetailer)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Partner Now
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
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

export default SwiftRetailers;
