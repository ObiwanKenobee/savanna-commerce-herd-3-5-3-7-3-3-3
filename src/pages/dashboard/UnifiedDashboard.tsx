import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CriticalInsightsHub from "@/components/insights/CriticalInsightsHub";
import {
  Crown,
  Store,
  Package,
  Truck,
  Users,
  BarChart3,
  Settings,
  Eye,
  Zap,
  Target,
  Globe,
  Shield,
  ArrowRight,
} from "lucide-react";

interface UserTypeConfig {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
  primaryRoute: string;
  features: string[];
  color: string;
  animalSpirit: string;
}

const UnifiedDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Define user type configurations
  const userConfigs: Record<string, UserTypeConfig> = {
    admin: {
      type: "admin",
      title: "Pride Leader Dashboard",
      description: "Command the entire digital savannah ecosystem",
      icon: <Crown className="h-8 w-8" />,
      emoji: "🦁",
      primaryRoute: "/admin/dashboard",
      features: [
        "Complete system oversight",
        "User management & analytics",
        "Revenue & performance metrics",
        "Security & compliance monitoring",
        "Growth toolkit access",
        "Infrastructure management",
      ],
      color: "from-yellow-100 to-orange-100 border-yellow-200",
      animalSpirit: "Lion - Command with authority and wisdom",
    },
    supermarket: {
      type: "supermarket",
      title: "Herd Commander Dashboard",
      description: "Manage multiple branches with ecosystem intelligence",
      icon: <Store className="h-8 w-8" />,
      emoji: "🐘",
      primaryRoute: "/supermarket/dashboard",
      features: [
        "Multi-branch coordination",
        "Bulk buying & pricing algorithms",
        "Supply chain optimization",
        "Customer traffic analysis",
        "Competitor price monitoring",
        "Herd buying campaigns",
      ],
      color: "from-blue-100 to-indigo-100 border-blue-200",
      animalSpirit: "Elephant - Lead with memory and strength",
    },
    supplier: {
      type: "supplier",
      title: "Resource Guardian Dashboard",
      description: "Optimize supply chains across the savannah",
      icon: <Package className="h-8 w-8" />,
      emoji: "🦏",
      primaryRoute: "/dashboard/supplier-unified",
      features: [
        "Inventory management & forecasting",
        "Retailer relationship tracking",
        "Demand prediction analytics",
        "Product performance insights",
        "Commission & payment tracking",
        "Quality control monitoring",
      ],
      color: "from-green-100 to-emerald-100 border-green-200",
      animalSpirit: "Rhino - Strong, reliable, and protective",
    },
    retailer: {
      type: "retailer",
      title: "Swift Hunter Dashboard",
      description: "Fast-paced retail operations and customer engagement",
      icon: <Zap className="h-8 w-8" />,
      emoji: "🐆",
      primaryRoute: "/dashboard/retailer-unified",
      features: [
        "Real-time inventory tracking",
        "Customer credit management",
        "Group buying participation",
        "Sales performance analytics",
        "Stock optimization alerts",
        "Payment processing",
      ],
      color: "from-purple-100 to-pink-100 border-purple-200",
      animalSpirit: "Cheetah - Speed and agility in every transaction",
    },
    logistics: {
      type: "logistics",
      title: "Migration Coordinator Dashboard",
      description: "Navigate delivery routes across the digital savannah",
      icon: <Truck className="h-8 w-8" />,
      emoji: "🦓",
      primaryRoute: "/dashboard/logistics",
      features: [
        "Route optimization & tracking",
        "Delivery performance metrics",
        "Driver earnings & rankings",
        "Fleet management tools",
        "Weather-aware planning",
        "Customer satisfaction tracking",
      ],
      color: "from-teal-100 to-cyan-100 border-teal-200",
      animalSpirit: "Zebra - Organized movement in perfect harmony",
    },
  };

  // Determine user type and redirect logic
  useEffect(() => {
    if (!user || !profile) return;

    const userType = profile.user_type || "retailer";
    const isAdmin = profile.role === "admin" || profile.user_type === "admin";

    // Check for supermarket chains
    const isSupermarket =
      profile.organization?.name?.toLowerCase().includes("naivas") ||
      profile.organization?.name?.toLowerCase().includes("quickmart") ||
      profile.organization?.name?.toLowerCase().includes("china square");

    // Intelligent routing based on user profile
    if (isAdmin) {
      // Admin users get full system access
      return;
    } else if (isSupermarket) {
      // Supermarket users get specialized dashboard
      setTimeout(() => navigate("/supermarket/dashboard"), 2000);
      return;
    } else {
      // Regular users get role-specific dashboards
      const config = userConfigs[userType];
      if (config) {
        setTimeout(() => navigate(config.primaryRoute), 2000);
        return;
      }
    }
  }, [user, profile, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen">
        <EnhancedNavigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to access your personalized dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <EnhancedNavigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <h2 className="text-2xl font-bold mb-4">
              Loading Your Savannah Profile...
            </h2>
            <p className="text-muted-foreground">
              Preparing your personalized dashboard experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userType = profile.user_type || "retailer";
  const isAdmin = profile.role === "admin" || profile.user_type === "admin";
  const config = userConfigs[userType] || userConfigs.retailer;

  // Check for supermarket chains
  const isSupermarket =
    profile.organization?.name?.toLowerCase().includes("naivas") ||
    profile.organization?.name?.toLowerCase().includes("quickmart") ||
    profile.organization?.name?.toLowerCase().includes("china square");

  const effectiveConfig = isSupermarket
    ? userConfigs.supermarket
    : isAdmin
      ? userConfigs.admin
      : config;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{effectiveConfig.emoji}</div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome to Your {effectiveConfig.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {effectiveConfig.description}
          </p>
          <Badge className="text-base px-4 py-2">
            {effectiveConfig.animalSpirit}
          </Badge>
        </div>

        {/* Redirecting Notice */}
        <Alert className="mb-8">
          <ArrowRight className="h-4 w-4" />
          <AlertDescription>
            Redirecting you to your specialized dashboard in 2 seconds... Or
            click below to go directly to your{" "}
            {effectiveConfig.title.toLowerCase()}.
          </AlertDescription>
        </Alert>

        {/* User Profile Card */}
        <Card className={`mb-8 bg-gradient-to-r ${effectiveConfig.color}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              {effectiveConfig.icon}
              <div>
                <div className="text-2xl">
                  {profile.first_name} {profile.last_name}
                </div>
                <div className="text-muted-foreground">
                  {profile.organization?.name || "Independent Trader"}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {effectiveConfig.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button
                size="lg"
                onClick={() => navigate(effectiveConfig.primaryRoute)}
                className="w-full md:w-auto"
              >
                Enter Your {effectiveConfig.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/analytics")}
          >
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics Hub</h3>
              <p className="text-sm text-muted-foreground">
                Performance insights and metrics
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/inventory")}
          >
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Inventory Manager</h3>
              <p className="text-sm text-muted-foreground">
                Stock levels and forecasting
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Order Management</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage all orders
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/settings")}
          >
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Account and preferences
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Insights Section */}
        {(isAdmin || isSupermarket) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-6 w-6" />
              <h2 className="text-2xl font-bold">System Critical Insights</h2>
            </div>
            <CriticalInsightsHub />
          </div>
        )}

        {/* Alternative Access Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Alternative Dashboard Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(userConfigs).map((config) => (
                <Button
                  key={config.type}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate(config.primaryRoute)}
                  disabled={config.type === userType}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-sm font-medium">{config.title}</span>
                  {config.type === userType && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
