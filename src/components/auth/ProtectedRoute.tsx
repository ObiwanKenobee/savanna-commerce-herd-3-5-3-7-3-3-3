import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  securityMonitor,
  logAccessEvent,
  logNavigationEvent,
} from "@/utils/securityMonitor";
import {
  Shield,
  Lock,
  UserX,
  AlertTriangle,
  Crown,
  Users,
  Package,
  Truck,
  Eye,
  ArrowLeft,
} from "lucide-react";

export type UserRole =
  | "admin"
  | "supplier"
  | "retailer"
  | "logistics"
  | "guest";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

interface RolePermissions {
  role: UserRole;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  accessLevel: number;
}

const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "admin",
    icon: <Crown className="h-5 w-5" />,
    label: "🦁 Pride Leader",
    description: "Full administrative access to all platform features",
    color: "text-yellow-600",
    accessLevel: 5,
  },
  {
    role: "supplier",
    icon: <Package className="h-5 w-5" />,
    label: "🐘 Elephant Supplier",
    description: "Access to supplier tools, inventory, and business management",
    color: "text-blue-600",
    accessLevel: 4,
  },
  {
    role: "logistics",
    icon: <Truck className="h-5 w-5" />,
    label: "🐆 Cheetah Logistics",
    description: "Access to delivery and logistics management features",
    color: "text-purple-600",
    accessLevel: 3,
  },
  {
    role: "retailer",
    icon: <Users className="h-5 w-5" />,
    label: "🦌 Gazelle Retailer",
    description: "Access to marketplace, orders, and customer features",
    color: "text-green-600",
    accessLevel: 2,
  },
  {
    role: "guest",
    icon: <Eye className="h-5 w-5" />,
    label: "👀 Guest User",
    description: "Limited access to public marketplace features",
    color: "text-gray-600",
    accessLevel: 1,
  },
];

// Define page access requirements
const PAGE_ACCESS_RULES = {
  // Enterprise Pages
  "/watering-holes": ["admin", "supplier", "retailer"],
  "/herd-directory": ["admin", "supplier", "retailer"],
  "/swift-retailers": ["admin", "supplier"],
  "/pack-stories": ["admin", "supplier", "retailer"],

  // Dashboard Pages
  "/dashboard/retailer": ["admin", "retailer"],
  "/dashboard/supplier": ["admin", "supplier"],
  "/dashboard/logistics": ["admin", "logistics"],

  // Admin Pages
  "/admin": ["admin"],
  "/admin/*": ["admin"],

  // Management Pages
  "/inventory": ["admin", "supplier"],
  "/analytics": ["admin", "supplier", "retailer"],
  "/billing": ["admin", "supplier", "retailer"],
  "/credit": ["admin", "supplier", "retailer"],
  "/track": ["admin", "logistics", "supplier"],
  "/group-buying": ["admin", "supplier", "retailer"],
} as const;

const AccessDeniedPage = ({
  userRole,
  requiredRoles,
  currentPath,
}: {
  userRole: UserRole | null;
  requiredRoles: UserRole[];
  currentPath: string;
}) => {
  const currentRoleInfo = ROLE_PERMISSIONS.find((r) => r.role === userRole);
  const requiredRoleInfos = ROLE_PERMISSIONS.filter((r) =>
    requiredRoles.includes(r.role),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-red-200">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-800 mb-2">
              Access Restricted
            </h1>
            <p className="text-red-600">
              You don't have permission to view this page
            </p>
          </div>

          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Current Access Level:</strong>{" "}
              {currentRoleInfo?.label || "Not authenticated"}
              <br />
              <strong>Required Access:</strong>{" "}
              {requiredRoleInfos.map((r) => r.label).join(" or ")}
            </AlertDescription>
          </Alert>

          {/* Current Role */}
          {currentRoleInfo && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your Current Role</h3>
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={currentRoleInfo.color}>
                      {currentRoleInfo.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{currentRoleInfo.label}</div>
                      <div className="text-sm text-gray-600">
                        {currentRoleInfo.description}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Level {currentRoleInfo.accessLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Required Roles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Required Access Levels
            </h3>
            <div className="space-y-2">
              {requiredRoleInfos.map((roleInfo) => (
                <Card
                  key={roleInfo.role}
                  className="border-green-200 bg-green-50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={roleInfo.color}>{roleInfo.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{roleInfo.label}</div>
                        <div className="text-sm text-gray-600">
                          {roleInfo.description}
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white ml-auto">
                        Level {roleInfo.accessLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            {!userRole && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/auth">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </a>
              </Button>
            )}

            {userRole && userRole !== "admin" && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Account
                </a>
              </Button>
            )}

            <Button asChild variant="outline">
              <a href="/">
                <Users className="h-4 w-4 mr-2" />
                Return Home
              </a>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact our support team if you
              believe you should have access to this page, or check with your
              organization administrator about role permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  fallbackPath = "/auth",
  showAccessDenied = true,
}: ProtectedRouteProps) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);

  // Get user role from profile or determine based on user metadata
  const getUserRole = (): UserRole | null => {
    if (!user) return null;

    // Check profile first
    if (profile?.user_type) {
      return profile.user_type as UserRole;
    }

    // Check user metadata
    if (user.user_metadata?.user_type) {
      return user.user_metadata.user_type as UserRole;
    }

    // Check email patterns for admin
    if (user.email?.includes("admin@") || user.email?.includes("@admin.")) {
      return "admin";
    }

    // Default based on app metadata or default to retailer
    return (user.app_metadata?.role as UserRole) || "retailer";
  };

  const userRole = getUserRole();
  const currentPath = location.pathname;

  // Check if current path requires specific roles
  const getRequiredRoles = (path: string): UserRole[] => {
    // Check exact match first
    if (PAGE_ACCESS_RULES[path as keyof typeof PAGE_ACCESS_RULES]) {
      return PAGE_ACCESS_RULES[
        path as keyof typeof PAGE_ACCESS_RULES
      ] as UserRole[];
    }

    // Check wildcard patterns
    for (const [pattern, roles] of Object.entries(PAGE_ACCESS_RULES)) {
      if (pattern.endsWith("/*") && path.startsWith(pattern.slice(0, -2))) {
        return roles as UserRole[];
      }
    }

    // Use allowedRoles prop if no page rule exists
    return allowedRoles;
  };

  const requiredRoles = getRequiredRoles(currentPath);

  useEffect(() => {
    if (!loading) {
      setAccessChecked(true);
    }
  }, [loading]);

  // Show loading state
  if (loading || !accessChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Verifying Access</h2>
            <p className="text-gray-600">Checking your permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    // Security logging for unauthenticated access attempts
    logAccessEvent(currentPath, false, "unauthenticated");
    logNavigationEvent(currentPath, "Unauthenticated access attempt");

    // Store the attempted URL for redirect after login
    sessionStorage.setItem("redirectAfterLogin", currentPath);
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role-based access
  if (
    requiredRoles.length > 0 &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    // Security logging for unauthorized access attempts
    logAccessEvent(currentPath, false, userRole || "unknown");

    if (userRole && !requiredRoles.includes(userRole)) {
      logNavigationEvent(
        currentPath,
        `Role '${userRole}' attempted to access resource requiring ${requiredRoles.join(", ")}`,
      );
    }

    if (showAccessDenied) {
      return (
        <AccessDeniedPage
          userRole={userRole}
          requiredRoles={requiredRoles}
          currentPath={currentPath}
        />
      );
    } else {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Security logging for successful access
  logAccessEvent(currentPath, true, userRole || "unknown");

  // User has access - render the protected content
  return <>{children}</>;
};

// Hook to check if user has specific role
export const useHasRole = (role: UserRole): boolean => {
  const { user, profile } = useAuth();

  if (!user) return false;

  const getUserRole = (): UserRole | null => {
    if (profile?.user_type) return profile.user_type as UserRole;
    if (user.user_metadata?.user_type)
      return user.user_metadata.user_type as UserRole;
    if (user.email?.includes("admin@")) return "admin";
    return (user.app_metadata?.role as UserRole) || "retailer";
  };

  return getUserRole() === role;
};

// Hook to check if user has any of the specified roles
export const useHasAnyRole = (roles: UserRole[]): boolean => {
  const { user, profile } = useAuth();

  if (!user) return false;

  const getUserRole = (): UserRole | null => {
    if (profile?.user_type) return profile.user_type as UserRole;
    if (user.user_metadata?.user_type)
      return user.user_metadata.user_type as UserRole;
    if (user.email?.includes("admin@")) return "admin";
    return (user.app_metadata?.role as UserRole) || "retailer";
  };

  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
};

// Hook to get current user role
export const useUserRole = (): UserRole | null => {
  const { user, profile } = useAuth();

  if (!user) return null;

  if (profile?.user_type) return profile.user_type as UserRole;
  if (user.user_metadata?.user_type)
    return user.user_metadata.user_type as UserRole;
  if (user.email?.includes("admin@")) return "admin";
  return (user.app_metadata?.role as UserRole) || "retailer";
};

export default ProtectedRoute;
