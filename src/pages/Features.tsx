import React, { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Users,
  Brain,
  Shield,
  Smartphone,
  BarChart3,
  Globe,
  Heart,
  TrendingUp,
  Package,
  Truck,
  MessageSquare,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  Award,
  Lightbulb,
  Eye,
  Settings,
  Calendar,
  CreditCard,
  Lock,
  Wifi,
  Database,
  CloudLightning,
  Headphones,
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  benefits: string[];
  userTypes: string[];
  status: "live" | "beta" | "coming-soon";
  metrics?: {
    adoption: number;
    satisfaction: number;
    improvement: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Features = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: "all",
      name: "All Features",
      description: "Complete platform overview",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-gray-500",
    },
    {
      id: "ai",
      name: "AI & Automation",
      description: "Intelligent systems that work for you",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "marketplace",
      name: "Marketplace",
      description: "Core trading and commerce features",
      icon: <Package className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "logistics",
      name: "Logistics & Delivery",
      description: "Optimized supply chain management",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      id: "community",
      name: "Community & Social",
      description: "Connect and collaborate with peers",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "payments",
      name: "Payments & Finance",
      description: "Secure and flexible payment solutions",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      id: "mobile",
      name: "Mobile & Accessibility",
      description: "Works on every device, everywhere",
      icon: <Smartphone className="h-5 w-5" />,
      color: "bg-cyan-500",
    },
  ];

  const features: Feature[] = [
    // AI & Automation
    {
      id: "elephant-memory",
      name: "Elephant Memory AI",
      description:
        "AI-powered inventory management that learns your patterns and predicts reorder needs",
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      category: "ai",
      benefits: [
        "95% stockout prevention",
        "40% time savings on inventory management",
        "85% prediction accuracy",
        "Automatic reorder suggestions",
      ],
      userTypes: ["Retailers", "Suppliers"],
      status: "live",
      metrics: {
        adoption: 78,
        satisfaction: 92,
        improvement: "40% efficiency gain",
      },
    },
    {
      id: "demand-forecasting",
      name: "Demand Forecasting",
      description:
        "Predict market demand using seasonal patterns, local events, and historical data",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      category: "ai",
      benefits: [
        "Seasonal trend analysis",
        "Event-based demand spikes",
        "Regional market insights",
        "Inventory optimization",
      ],
      userTypes: ["Suppliers", "Retailers"],
      status: "live",
      metrics: {
        adoption: 65,
        satisfaction: 88,
        improvement: "30% demand accuracy",
      },
    },
    {
      id: "price-optimization",
      name: "Dynamic Pricing AI",
      description:
        "Optimize pricing based on market conditions, competition, and demand patterns",
      icon: <Target className="h-8 w-8 text-purple-500" />,
      category: "ai",
      benefits: [
        "Competitive pricing alerts",
        "Market-based recommendations",
        "Profit margin optimization",
        "Real-time price adjustments",
      ],
      userTypes: ["Suppliers"],
      status: "beta",
    },

    // Marketplace
    {
      id: "group-buying",
      name: "Herd Group Buying",
      description:
        "Pool orders with other businesses to get bulk discounts and better pricing",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      category: "marketplace",
      benefits: [
        "Up to 35% cost savings",
        "Access to premium suppliers",
        "Reduced minimum order quantities",
        "Community-driven negotiations",
      ],
      userTypes: ["Retailers"],
      status: "live",
      metrics: {
        adoption: 84,
        satisfaction: 95,
        improvement: "35% cost reduction",
      },
    },
    {
      id: "advanced-search",
      name: "Smart Product Discovery",
      description:
        "AI-powered search with filters, recommendations, and visual product matching",
      icon: <Eye className="h-8 w-8 text-blue-500" />,
      category: "marketplace",
      benefits: [
        "Visual search capabilities",
        "Personalized recommendations",
        "Advanced filtering options",
        "Similar product suggestions",
      ],
      userTypes: ["Retailers", "Suppliers"],
      status: "live",
      metrics: {
        adoption: 91,
        satisfaction: 89,
        improvement: "60% faster product discovery",
      },
    },
    {
      id: "marketplace-analytics",
      name: "Market Intelligence",
      description:
        "Real-time market data, pricing trends, and competitive analysis",
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      category: "marketplace",
      benefits: [
        "Real-time price monitoring",
        "Competitor analysis",
        "Market trend insights",
        "Performance benchmarking",
      ],
      userTypes: ["Suppliers", "Retailers"],
      status: "live",
      metrics: {
        adoption: 72,
        satisfaction: 87,
        improvement: "45% better pricing decisions",
      },
    },

    // Logistics
    {
      id: "cheetah-delivery",
      name: "Cheetah Speed Delivery",
      description:
        "Optimized logistics network with real-time tracking and route optimization",
      icon: <Truck className="h-8 w-8 text-orange-500" />,
      category: "logistics",
      benefits: [
        "Same-day delivery options",
        "Real-time tracking",
        "Route optimization",
        "Cost-effective shipping",
      ],
      userTypes: ["Retailers", "Logistics Partners"],
      status: "live",
      metrics: {
        adoption: 76,
        satisfaction: 93,
        improvement: "50% faster delivery",
      },
    },
    {
      id: "inventory-sync",
      name: "Multi-Location Inventory",
      description:
        "Sync inventory across multiple locations with automatic stock level updates",
      icon: <Database className="h-8 w-8 text-orange-500" />,
      category: "logistics",
      benefits: [
        "Real-time stock synchronization",
        "Multi-warehouse management",
        "Automatic stock transfers",
        "Low stock alerts",
      ],
      userTypes: ["Suppliers", "Large Retailers"],
      status: "live",
      metrics: {
        adoption: 68,
        satisfaction: 85,
        improvement: "25% inventory efficiency",
      },
    },

    // Community
    {
      id: "community-forum",
      name: "Pride Community",
      description:
        "Connect with other traders, share experiences, and learn from the community",
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      category: "community",
      benefits: [
        "Peer-to-peer learning",
        "Success story sharing",
        "Expert advice access",
        "Networking opportunities",
      ],
      userTypes: ["All Users"],
      status: "live",
      metrics: {
        adoption: 82,
        satisfaction: 91,
        improvement: "70% knowledge sharing",
      },
    },
    {
      id: "mentorship",
      name: "Mentorship Program",
      description:
        "Connect new traders with experienced mentors for guidance and support",
      icon: <Award className="h-8 w-8 text-green-500" />,
      category: "community",
      benefits: [
        "Expert guidance",
        "Accelerated learning",
        "Business strategy advice",
        "Network expansion",
      ],
      userTypes: ["New Users", "Experienced Traders"],
      status: "beta",
    },

    // Payments
    {
      id: "mpesa-integration",
      name: "M-Pesa Integration",
      description:
        "Seamless mobile money payments with instant processing and reconciliation",
      icon: <CreditCard className="h-8 w-8 text-red-500" />,
      category: "payments",
      benefits: [
        "Instant mobile payments",
        "Automatic reconciliation",
        "Low transaction fees",
        "Wide acceptance",
      ],
      userTypes: ["All Users"],
      status: "live",
      metrics: {
        adoption: 94,
        satisfaction: 96,
        improvement: "80% faster payments",
      },
    },
    {
      id: "credit-scoring",
      name: "Trade Credit System",
      description:
        "AI-powered credit scoring for trade credit and payment terms",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      category: "payments",
      benefits: [
        "AI-based credit scoring",
        "Flexible payment terms",
        "Risk assessment",
        "Credit history building",
      ],
      userTypes: ["Established Traders"],
      status: "beta",
    },

    // Mobile
    {
      id: "ussd-support",
      name: "USSD Feature Phone Support",
      description:
        "Full platform access via USSD for feature phones and low-connectivity areas",
      icon: <Smartphone className="h-8 w-8 text-cyan-500" />,
      category: "mobile",
      benefits: [
        "Works on any phone",
        "No internet required",
        "SMS notifications",
        "Simple menu navigation",
      ],
      userTypes: ["Rural Traders", "Feature Phone Users"],
      status: "live",
      metrics: {
        adoption: 45,
        satisfaction: 79,
        improvement: "100% accessibility",
      },
    },
    {
      id: "offline-mode",
      name: "Offline Functionality",
      description:
        "Continue working even without internet connection, sync when connected",
      icon: <Wifi className="h-8 w-8 text-cyan-500" />,
      category: "mobile",
      benefits: [
        "Works without internet",
        "Automatic sync",
        "Offline data access",
        "Uninterrupted workflow",
      ],
      userTypes: ["All Mobile Users"],
      status: "live",
      metrics: {
        adoption: 67,
        satisfaction: 83,
        improvement: "90% uptime improvement",
      },
    },
  ];

  const filteredFeatures =
    selectedCategory === "all"
      ? features
      : features.filter((feature) => feature.category === selectedCategory);

  const getStatusColor = (status: Feature["status"]) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700 border-green-200";
      case "beta":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "coming-soon":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: Feature["status"]) => {
    switch (status) {
      case "live":
        return "✅ Live";
      case "beta":
        return "🧪 Beta";
      case "coming-soon":
        return "🚀 Coming Soon";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="edge-to-edge min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      <SavannahNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="responsive-container">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6 space-x-3">
              <Zap className="h-16 w-16" />
              <h1 className="text-5xl font-bold">Platform Features</h1>
              <Star className="h-16 w-16" />
            </div>
            <p className="text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover the powerful tools and features that make Digital Savanna
              the leading B2B marketplace in Africa
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>50+ Features</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Built for Africa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-container py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCategory === category.id
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              {selectedCategory === "all"
                ? "All Features"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <Badge className="bg-blue-100 text-blue-700">
              {filteredFeatures.length} features
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() =>
                  setSelectedFeature(
                    selectedFeature === feature.id ? null : feature.id,
                  )
                }
              >
                <CardContent className="p-6">
                  {/* Feature Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <div>
                        <h3 className="font-bold text-xl">{feature.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(feature.status)}>
                            {getStatusText(feature.status)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {
                              categories.find((c) => c.id === feature.category)
                                ?.name
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {selectedFeature === feature.id ? "−" : "+"}
                    </Button>
                  </div>

                  {/* Feature Description */}
                  <p className="text-gray-600 mb-4">{feature.description}</p>

                  {/* User Types */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm text-gray-500">For:</span>
                    {feature.userTypes.map((userType) => (
                      <Badge
                        key={userType}
                        variant="outline"
                        className="text-xs"
                      >
                        {userType}
                      </Badge>
                    ))}
                  </div>

                  {/* Metrics */}
                  {feature.metrics && (
                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {feature.metrics.adoption}%
                        </div>
                        <div className="text-xs text-gray-600">Adoption</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {feature.metrics.satisfaction}%
                        </div>
                        <div className="text-xs text-gray-600">
                          Satisfaction
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {feature.metrics.improvement}
                        </div>
                        <div className="text-xs text-gray-600">Impact</div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedFeature === feature.id && (
                    <div className="mt-6 pt-4 border-t space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">
                          Key Benefits:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {feature.benefits.map((benefit) => (
                            <div
                              key={benefit}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Try Feature
                        </Button>
                        <Button variant="outline">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Platform Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  95%
                </div>
                <div className="text-sm text-gray-600">
                  Customer Satisfaction
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Active Features</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  40%
                </div>
                <div className="text-sm text-gray-600">
                  Average Efficiency Gain
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  24/7
                </div>
                <div className="text-sm text-gray-600">
                  Platform Availability
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience These Features?
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of African entrepreneurs who are already leveraging
              our powerful platform
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default Features;
