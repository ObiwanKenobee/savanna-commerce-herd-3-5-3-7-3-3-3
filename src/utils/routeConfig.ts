/**
 * 🧭 Route Configuration for Savanna Marketplace
 * Centralized routing configuration for deployment and enterprise navigation
 */

export interface RouteConfig {
  path: string;
  roles: string[];
  fallback?: string;
  title: string;
  description: string;
}

export const ENTERPRISE_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard/retailer",
    roles: ["admin", "retailer"],
    fallback: "/dashboard",
    title: "Retailer Dashboard",
    description: "Enterprise dashboard for retailers",
  },
  {
    path: "/dashboard/supplier",
    roles: ["admin", "supplier"],
    fallback: "/dashboard",
    title: "Supplier Dashboard",
    description: "Enterprise dashboard for suppliers",
  },
  {
    path: "/dashboard/logistics",
    roles: ["admin", "logistics"],
    fallback: "/dashboard",
    title: "Logistics Dashboard",
    description: "Enterprise dashboard for logistics partners",
  },
  {
    path: "/admin",
    roles: ["admin"],
    fallback: "/dashboard",
    title: "Admin Dashboard",
    description: "Administrative control panel",
  },
  {
    path: "/watering-holes",
    roles: ["admin", "supplier", "retailer"],
    fallback: "/",
    title: "Watering Holes",
    description: "Trading hub marketplace",
  },
  {
    path: "/herd-directory",
    roles: ["admin", "supplier", "retailer"],
    fallback: "/",
    title: "Herd Directory",
    description: "Business network directory",
  },
  {
    path: "/swift-retailers",
    roles: ["admin", "supplier"],
    fallback: "/",
    title: "Swift Retailers",
    description: "High-velocity retailer network",
  },
  {
    path: "/pack-stories",
    roles: ["admin", "supplier", "retailer"],
    fallback: "/",
    title: "Pack Stories",
    description: "Success story platform",
  },
];

export const USER_ROLE_DASHBOARDS = {
  admin: "/admin",
  retailer: "/dashboard/retailer",
  supplier: "/dashboard/supplier",
  logistics: "/dashboard/logistics",
} as const;

export type UserRole = keyof typeof USER_ROLE_DASHBOARDS;

/**
 * Get dashboard route for user role
 */
export function getDashboardRoute(userRole: string): string {
  return USER_ROLE_DASHBOARDS[userRole as UserRole] || "/dashboard";
}

/**
 * Check if user has access to route
 */
export function hasRouteAccess(route: string, userRole: string): boolean {
  const routeConfig = ENTERPRISE_ROUTES.find((r) => r.path === route);
  if (!routeConfig) return true; // Public routes

  return routeConfig.roles.includes(userRole);
}

/**
 * Get fallback route for unauthorized access
 */
export function getFallbackRoute(route: string): string {
  const routeConfig = ENTERPRISE_ROUTES.find((r) => r.path === route);
  return routeConfig?.fallback || "/";
}

/**
 * Safe navigation with role checking
 */
export function safeNavigate(
  navigate: (to: string, options?: any) => void,
  route: string,
  userRole: string,
  options: any = {},
): void {
  try {
    if (hasRouteAccess(route, userRole)) {
      navigate(route, { replace: true, ...options });
    } else {
      const fallback = getFallbackRoute(route);
      console.warn(
        `🦁 Access denied to ${route} for role ${userRole}, redirecting to ${fallback}`,
      );
      navigate(fallback, { replace: true, ...options });
    }
  } catch (error) {
    console.error("🚨 Navigation error:", error);
    // Fallback to window.location for deployment safety
    window.location.href = route;
  }
}

/**
 * Get user role from various sources
 */
export function getUserRole(user: any): string {
  if (!user) return "guest";

  // Try various sources for user role
  return (
    user.user_metadata?.user_type ||
    user.user_metadata?.role ||
    user.app_metadata?.role ||
    user.role ||
    (user.email?.includes("admin@") ? "admin" : "retailer")
  );
}

/**
 * Deployment-safe route validation
 */
export function isValidRoute(path: string): boolean {
  const validPaths = [
    "/",
    "/auth",
    "/pricing",
    "/marketplace",
    "/partners",
    "/innovation",
    "/help/ussd",
    ...ENTERPRISE_ROUTES.map((r) => r.path),
    ...Object.values(USER_ROLE_DASHBOARDS),
  ];

  return validPaths.some(
    (validPath) => path === validPath || path.startsWith(validPath + "/"),
  );
}

/**
 * Handle deployment routing for SPA
 */
export function handleSPARouting(): void {
  // Handle browser back/forward buttons
  window.addEventListener("popstate", (event) => {
    const path = window.location.pathname;

    if (!isValidRoute(path)) {
      console.warn(`🧭 Invalid route detected: ${path}`);
      window.location.href = "/";
    }
  });

  // Handle page reload in development vs production
  if (typeof window !== "undefined") {
    const path = window.location.pathname;

    // In production, ensure we have proper fallbacks
    if (process.env.NODE_ENV === "production" && !isValidRoute(path)) {
      window.location.href = "/";
    }
  }
}

// Initialize SPA routing handling
if (typeof window !== "undefined") {
  handleSPARouting();
}

export default {
  ENTERPRISE_ROUTES,
  USER_ROLE_DASHBOARDS,
  getDashboardRoute,
  hasRouteAccess,
  getFallbackRoute,
  safeNavigate,
  getUserRole,
  isValidRoute,
  handleSPARouting,
};
