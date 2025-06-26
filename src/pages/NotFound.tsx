import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Search, MapPin, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Security logging for monitoring suspicious access attempts
    console.warn(
      "🦏 Security Alert: 404 - Route not found:",
      location.pathname,
      "at",
      new Date().toISOString(),
    );

    // Track potential security issues
    if (
      location.pathname.includes("admin") ||
      location.pathname.includes("api") ||
      location.pathname.includes("config")
    ) {
      console.error(
        "🚨 High Priority: Potential unauthorized access attempt to sensitive path:",
        location.pathname,
      );
    }
  }, [location.pathname]);

  const isSecurityConcern =
    location.pathname.includes("admin") ||
    location.pathname.includes("api") ||
    location.pathname.includes("config") ||
    location.pathname.includes("..") ||
    location.pathname.includes("%");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-orange-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl animate-bounce">🦁</span>
            </div>
            <div className="space-y-2">
              <Badge
                variant="destructive"
                className="bg-red-100 text-red-800 border-red-200"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Route Not Found
              </Badge>
              <CardTitle className="text-4xl font-bold text-orange-800">
                Lost in the Savannah?
              </CardTitle>
              <p className="text-orange-600 text-lg">
                Even the wisest lions sometimes take wrong paths
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Path Information */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">
                  Attempted Path:
                </span>
              </div>
              <code className="text-sm bg-white px-2 py-1 rounded border text-orange-700 break-all">
                {location.pathname}
              </code>
            </div>

            {/* Security Alert (if applicable) */}
            {isSecurityConcern && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">
                    Security Notice
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  This access attempt has been logged for security monitoring.
                  If you believe you should have access to this resource, please
                  contact support.
                </p>
              </div>
            )}

            {/* Helpful Suggestions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-800 flex items-center space-x-2">
                <span>🧭</span>
                <span>Find Your Way Back:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link to="/" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Return Home</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Link
                    to="/marketplace"
                    className="flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Browse Marketplace</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Go Back</span>
                </Button>
              </div>
            </div>

            {/* Wildlife Wisdom */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
              <div className="text-center">
                <p className="text-sm text-amber-800 italic">
                  "🐘 <strong>Elephant Wisdom:</strong> A wise elephant never
                  forgets the path home, but sometimes the best discoveries
                  happen when we explore new trails."
                </p>
              </div>
            </div>

            {/* Help Information */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Need assistance? Contact our support pride at{" "}
                <a
                  href="mailto:support@savanna-marketplace.com"
                  className="text-green-600 hover:text-green-700 underline"
                >
                  support@savanna-marketplace.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
