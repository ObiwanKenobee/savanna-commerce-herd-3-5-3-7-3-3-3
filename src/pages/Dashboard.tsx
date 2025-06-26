import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { EnhancedDashboard } from "@/components/dashboard/EnhancedDashboard";
import { useAuth } from "@/hooks/useAuth";
import {
  redirectToAppropiateDashboard,
  trackDashboardAccess,
} from "@/utils/dashboardRouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Eye } from "lucide-react";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Smart routing - redirect users to appropriate dashboards
  useEffect(() => {
    if (user && profile) {
      // Track dashboard access for analytics
      trackDashboardAccess(user, profile, "/dashboard/legacy");

      // Redirect to appropriate dashboard after 3 seconds
      const redirectTimer = setTimeout(() => {
        redirectToAppropiateDashboard(user, profile, navigate);
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [user, profile, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen">
        <EnterpriseNavigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to access the Enterprise Command Center.
          </p>
          <Button className="mt-4" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <EnterpriseNavigation />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <EnterpriseNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Legacy Dashboard Notice */}
        <Alert className="mb-8">
          <Eye className="h-4 w-4" />
          <AlertDescription>
            You're viewing the legacy dashboard. You'll be automatically
            redirected to your optimized user-specific dashboard in a few
            seconds, or click below to go directly.
          </AlertDescription>
        </Alert>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-6 w-6" />
              Quick Navigation to Your Optimized Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate("/dashboard/retailer-unified")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🐆</span>
                <span>Retailer Dashboard</span>
                <span className="text-xs text-gray-500">
                  Swift operations & inventory
                </span>
              </Button>

              <Button
                onClick={() => navigate("/dashboard/supplier-unified")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🦏</span>
                <span>Supplier Dashboard</span>
                <span className="text-xs text-gray-500">
                  Supply chain optimization
                </span>
              </Button>

              <Button
                onClick={() => navigate("/dashboard/logistics")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🦓</span>
                <span>Logistics Dashboard</span>
                <span className="text-xs text-gray-500">
                  Route & delivery management
                </span>
              </Button>
            </div>

            {/* Special access buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/supermarket/dashboard")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🐘</span>
                <span>Supermarket Dashboard</span>
                <span className="text-xs text-gray-500">
                  Multi-branch coordination
                </span>
              </Button>

              {(profile.role === "admin" || profile.user_type === "admin") && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">🦁</span>
                  <span>Admin Dashboard</span>
                  <span className="text-xs text-gray-500">
                    Complete system control
                  </span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legacy Enhanced Dashboard */}
        <div className="opacity-75">
          <EnhancedDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
