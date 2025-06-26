import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  user_type: string;
  role?: string;
  organization?: {
    name?: string;
  };
  first_name?: string;
  last_name?: string;
}

interface DashboardRoute {
  path: string;
  title: string;
  description: string;
  icon: string;
  animalSpirit: string;
  features: string[];
}

export const getDashboardRoute = (
  user: User | null,
  profile: UserProfile | null,
): DashboardRoute => {
  if (!user || !profile) {
    return {
      path: "/auth",
      title: "Authentication Required",
      description: "Please sign in to access your dashboard",
      icon: "🔐",
      animalSpirit: "Authentication Gate",
      features: ["Sign in to continue"],
    };
  }

  const userType = profile.user_type || "retailer";
  const isAdmin = profile.role === "admin" || profile.user_type === "admin";

  // Check for supermarket chains
  const organizationName = profile.organization?.name?.toLowerCase() || "";
  const isSupermarket =
    organizationName.includes("naivas") ||
    organizationName.includes("quickmart") ||
    organizationName.includes("china square") ||
    organizationName.includes("tuskys") ||
    organizationName.includes("carrefour");

  // Admin users get full system access
  if (isAdmin) {
    return {
      path: "/admin/dashboard",
      title: "Pride Leader Dashboard",
      description: "Command the entire digital savannah ecosystem",
      icon: "🦁",
      animalSpirit: "Lion - Rule with wisdom and authority",
      features: [
        "Complete system oversight",
        "User management & analytics",
        "Revenue & performance metrics",
        "Security & compliance monitoring",
        "Growth toolkit access",
        "Infrastructure management",
      ],
    };
  }

  // Supermarket users get specialized dashboard
  if (isSupermarket) {
    return {
      path: "/supermarket/dashboard",
      title: "Herd Commander Dashboard",
      description: "Manage multiple branches with ecosystem intelligence",
      icon: "🐘",
      animalSpirit: "Elephant - Lead with memory and strength",
      features: [
        "Multi-branch coordination",
        "Bulk buying & pricing algorithms",
        "Supply chain optimization",
        "Customer traffic analysis",
        "Competitor price monitoring",
        "Herd buying campaigns",
      ],
    };
  }

  // Role-specific routing for regular users
  switch (userType) {
    case "supplier":
      return {
        path: "/dashboard/supplier-unified",
        title: "Resource Guardian Dashboard",
        description: "Optimize supply chains across the savannah",
        icon: "🦏",
        animalSpirit: "Rhino - Strong, reliable, and protective",
        features: [
          "Inventory management & forecasting",
          "Retailer relationship tracking",
          "Demand prediction analytics",
          "Product performance insights",
          "Commission & payment tracking",
          "Quality control monitoring",
        ],
      };

    case "logistics":
      return {
        path: "/dashboard/logistics",
        title: "Migration Coordinator Dashboard",
        description: "Navigate delivery routes across the digital savannah",
        icon: "🦓",
        animalSpirit: "Zebra - Organized movement in perfect harmony",
        features: [
          "Route optimization & tracking",
          "Delivery performance metrics",
          "Driver earnings & rankings",
          "Fleet management tools",
          "Weather-aware planning",
          "Customer satisfaction tracking",
        ],
      };

    case "retailer":
    default:
      return {
        path: "/dashboard/retailer-unified",
        title: "Swift Hunter Dashboard",
        description: "Fast-paced retail operations and customer engagement",
        icon: "🐆",
        animalSpirit: "Cheetah - Speed and agility in every transaction",
        features: [
          "Real-time inventory tracking",
          "Customer credit management",
          "Group buying participation",
          "Sales performance analytics",
          "Stock optimization alerts",
          "Payment processing",
        ],
      };
  }
};

export const getAlternativeDashboards = (
  currentUserType: string,
): DashboardRoute[] => {
  const allRoutes = [
    {
      path: "/dashboard/retailer-unified",
      title: "Swift Hunter Dashboard",
      description: "Fast-paced retail operations",
      icon: "🐆",
      animalSpirit: "Cheetah - Speed and agility",
      features: ["Inventory tracking", "Credit management", "Group buying"],
    },
    {
      path: "/dashboard/supplier-unified",
      title: "Resource Guardian Dashboard",
      description: "Supply chain optimization",
      icon: "🦏",
      animalSpirit: "Rhino - Strength and reliability",
      features: [
        "Demand forecasting",
        "Retailer relations",
        "Product insights",
      ],
    },
    {
      path: "/dashboard/logistics",
      title: "Migration Coordinator Dashboard",
      description: "Delivery route management",
      icon: "🦓",
      animalSpirit: "Zebra - Organized movement",
      features: [
        "Route optimization",
        "Performance tracking",
        "Fleet management",
      ],
    },
    {
      path: "/supermarket/dashboard",
      title: "Herd Commander Dashboard",
      description: "Multi-branch coordination",
      icon: "🐘",
      animalSpirit: "Elephant - Memory and leadership",
      features: ["Branch management", "Bulk buying", "Traffic analysis"],
    },
    {
      path: "/admin/dashboard",
      title: "Pride Leader Dashboard",
      description: "Complete ecosystem control",
      icon: "🦁",
      animalSpirit: "Lion - Ultimate authority",
      features: ["System oversight", "User management", "Revenue analytics"],
    },
  ];

  // Return all routes except current user's primary route
  return allRoutes.filter((route) => {
    const routeUserType = route.path.includes("retailer")
      ? "retailer"
      : route.path.includes("supplier")
        ? "supplier"
        : route.path.includes("logistics")
          ? "logistics"
          : route.path.includes("supermarket")
            ? "supermarket"
            : route.path.includes("admin")
              ? "admin"
              : "";
    return routeUserType !== currentUserType;
  });
};

export const getUserTypeFromPath = (path: string): string => {
  if (path.includes("admin")) return "admin";
  if (path.includes("supermarket")) return "supermarket";
  if (path.includes("supplier")) return "supplier";
  if (path.includes("logistics")) return "logistics";
  if (path.includes("retailer")) return "retailer";
  return "unknown";
};

export const isUserAuthorizedForPath = (
  user: User | null,
  profile: UserProfile | null,
  path: string,
): boolean => {
  if (!user || !profile) return false;

  const userType = profile.user_type || "retailer";
  const isAdmin = profile.role === "admin" || profile.user_type === "admin";
  const organizationName = profile.organization?.name?.toLowerCase() || "";
  const isSupermarket =
    organizationName.includes("naivas") ||
    organizationName.includes("quickmart") ||
    organizationName.includes("china square");

  // Admin can access everything
  if (isAdmin) return true;

  // Check specific path authorizations
  if (path.includes("/admin/") && !isAdmin) return false;
  if (path.includes("/supermarket/") && !isSupermarket && !isAdmin)
    return false;

  // Users can access their own type and general routes
  const pathUserType = getUserTypeFromPath(path);
  return pathUserType === userType || pathUserType === "unknown";
};

export const redirectToAppropiateDashboard = (
  user: User | null,
  profile: UserProfile | null,
  navigate: (path: string) => void,
): void => {
  const route = getDashboardRoute(user, profile);
  navigate(route.path);
};

// Analytics tracking for dashboard usage
export const trackDashboardAccess = (
  user: User | null,
  profile: UserProfile | null,
  path: string,
): void => {
  if (!user || !profile) return;

  const event = {
    user_id: user.id,
    user_type: profile.user_type,
    dashboard_path: path,
    organization: profile.organization?.name,
    timestamp: new Date().toISOString(),
    session_id: user.id + Date.now(), // Simple session tracking
  };

  // In a real implementation, this would send to analytics service
  console.log("Dashboard Access Tracked:", event);

  // Could integrate with services like:
  // - Google Analytics
  // - Mixpanel
  // - Custom analytics endpoint
  // - Supabase analytics tables
};
