/**
 * 🦁 Wildlife Route Transition Component
 * Animated page transitions that mimic animal movements
 */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";
import "./wildlife-transitions.css";

interface WildlifeRouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

type TransitionType =
  | "cheetah"
  | "elephant"
  | "gazelle"
  | "lion"
  | "hyena"
  | "vulture"
  | "antelope"
  | "baobab";

interface RouteTransitionConfig {
  type: TransitionType;
  duration: number;
  description: string;
  trigger:
    | "fast"
    | "heavy"
    | "admin"
    | "error"
    | "loading"
    | "navigation"
    | "dashboard";
}

// Route to transition mapping
const ROUTE_TRANSITIONS: Record<string, RouteTransitionConfig> = {
  "/": {
    type: "lion",
    duration: 600,
    description: "Lion roar for homepage majesty",
    trigger: "admin",
  },
  "/products": {
    type: "cheetah",
    duration: 300,
    description: "Cheetah sprint for quick product browsing",
    trigger: "fast",
  },
  "/watering-holes": {
    type: "gazelle",
    duration: 400,
    description: "Gazelle bounce for deals discovery",
    trigger: "fast",
  },
  "/herd-directory": {
    type: "elephant",
    duration: 800,
    description: "Elephant walk for supplier directory",
    trigger: "heavy",
  },
  "/swift-retailers": {
    type: "cheetah",
    duration: 300,
    description: "Cheetah speed for swift retailers",
    trigger: "fast",
  },
  "/pack-stories": {
    type: "antelope",
    duration: 400,
    description: "Antelope path for story navigation",
    trigger: "navigation",
  },
  "/dashboard": {
    type: "baobab",
    duration: 700,
    description: "Baobab growth for dashboard emergence",
    trigger: "dashboard",
  },
  "/cart": {
    type: "gazelle",
    duration: 400,
    description: "Gazelle hop to shopping cart",
    trigger: "fast",
  },
  "/checkout": {
    type: "cheetah",
    duration: 300,
    description: "Cheetah rush for quick checkout",
    trigger: "fast",
  },
  "/error": {
    type: "hyena",
    duration: 500,
    description: "Hyena entrance for error pages",
    trigger: "error",
  },
  "/loading": {
    type: "vulture",
    duration: 1000,
    description: "Vulture circle for loading states",
    trigger: "loading",
  },
};

// Fallback transitions for unmatched routes
const FALLBACK_TRANSITIONS: Record<string, TransitionType> = {
  "/admin": "lion",
  "/dashboard": "baobab",
  "/supplier": "elephant",
  "/retail": "gazelle",
  "/help": "antelope",
};

const WildlifeRouteTransition: React.FC<WildlifeRouteTransitionProps> = ({
  children,
  className = "",
}) => {
  const location = useLocation();
  const { config, isLowPowerMode, isSlowConnection } =
    usePerformanceOptimization();
  const [currentTransition, setCurrentTransition] =
    useState<RouteTransitionConfig | null>(null);
  const [transitionKey, setTransitionKey] = useState(location.pathname);

  // Determine transition type based on route
  const getTransitionForRoute = (pathname: string): RouteTransitionConfig => {
    // Exact match
    if (ROUTE_TRANSITIONS[pathname]) {
      return ROUTE_TRANSITIONS[pathname];
    }

    // Pattern matching for dynamic routes
    for (const [route, config] of Object.entries(ROUTE_TRANSITIONS)) {
      if (pathname.startsWith(route.replace(":id", ""))) {
        return config;
      }
    }

    // Fallback based on path segments
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment && FALLBACK_TRANSITIONS[`/${firstSegment}`]) {
      return {
        type: FALLBACK_TRANSITIONS[`/${firstSegment}`],
        duration: 400,
        description: `Default transition for ${firstSegment}`,
        trigger: "navigation",
      };
    }

    // Ultimate fallback
    return {
      type: "antelope",
      duration: 400,
      description: "Default antelope path transition",
      trigger: "navigation",
    };
  };

  // Apply performance optimizations
  const getOptimizedTransition = (
    baseTransition: RouteTransitionConfig,
  ): RouteTransitionConfig => {
    let optimizedTransition = { ...baseTransition };

    // Disable animations entirely if not enabled in config
    if (!config.enableAnimations) {
      optimizedTransition.type = "antelope"; // Simplest transition
      optimizedTransition.duration = 200;
    }

    // Reduce complexity for low power mode
    if (isLowPowerMode) {
      optimizedTransition.duration = Math.min(
        optimizedTransition.duration,
        200,
      );
      optimizedTransition.type = "antelope"; // Simplest animation
    }

    // Reduce complexity for slow connections
    if (isSlowConnection) {
      optimizedTransition.duration = Math.min(
        optimizedTransition.duration,
        300,
      );
      if (
        optimizedTransition.type === "elephant" ||
        optimizedTransition.type === "vulture"
      ) {
        optimizedTransition.type = "cheetah"; // Faster alternative
      }
    }

    // Adapt duration based on loading strategy
    switch (config.loadingStrategy) {
      case "cheetah":
        optimizedTransition.duration = Math.min(
          optimizedTransition.duration,
          300,
        );
        break;
      case "tortoise":
        optimizedTransition.duration = Math.max(
          optimizedTransition.duration,
          200,
        );
        optimizedTransition.type = "antelope"; // Conservative animation
        break;
    }

    return optimizedTransition;
  };

  // Update transition when route changes
  useEffect(() => {
    const baseTransition = getTransitionForRoute(location.pathname);
    const optimizedTransition = getOptimizedTransition(baseTransition);

    setCurrentTransition(optimizedTransition);
    setTransitionKey(location.pathname + Date.now()); // Force re-render

    // Log transition for debugging
    console.log(
      `🦁 Route transition: ${location.pathname} -> ${optimizedTransition.type} (${optimizedTransition.duration}ms)`,
    );
  }, [location.pathname, config, isLowPowerMode, isSlowConnection]);

  // Add body classes for transition state
  useEffect(() => {
    if (currentTransition) {
      document.body.classList.add(`transition-${currentTransition.type}`);
      document.body.classList.add("route-transitioning");

      // Clean up after transition
      const timeout = setTimeout(() => {
        document.body.classList.remove(`transition-${currentTransition.type}`);
        document.body.classList.remove("route-transitioning");
      }, currentTransition.duration + 100);

      return () => {
        clearTimeout(timeout);
        document.body.classList.remove(`transition-${currentTransition.type}`);
        document.body.classList.remove("route-transitioning");
      };
    }
  }, [currentTransition]);

  // Add performance monitoring classes
  useEffect(() => {
    if (isLowPowerMode) {
      document.body.classList.add("low-power-mode");
    } else {
      document.body.classList.remove("low-power-mode");
    }

    if (isSlowConnection) {
      document.body.classList.add("slow-connection");
    } else {
      document.body.classList.remove("slow-connection");
    }
  }, [isLowPowerMode, isSlowConnection]);

  if (!currentTransition) {
    return <div className={className}>{children}</div>;
  }

  const transitionClassNames = `${currentTransition.type}-transition`;
  const timeout = currentTransition.duration;

  return (
    <div className={`wildlife-route-transition ${className}`}>
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames={transitionClassNames}
          timeout={timeout}
          unmountOnExit
          onEnter={(node) => {
            // Add page-specific classes
            const pageClass = `page-${location.pathname.split("/")[1] || "home"}`;
            node.classList.add(pageClass);

            // Trigger haptic feedback on mobile
            if ("vibrate" in navigator && config.enableAnimations) {
              const vibrationPattern = getVibrationPattern(
                currentTransition.type,
              );
              navigator.vibrate(vibrationPattern);
            }
          }}
          onEntered={(node) => {
            // Mark transition as complete
            node.classList.add("transition-complete");
          }}
          onExit={(node) => {
            // Prepare for exit
            node.classList.add("transition-exiting");
          }}
        >
          <div className="route-content">{children}</div>
        </CSSTransition>
      </TransitionGroup>

      {/* Transition overlay for enhanced effects */}
      {config.enableAnimations && !isLowPowerMode && (
        <TransitionOverlay
          type={currentTransition.type}
          duration={currentTransition.duration}
        />
      )}
    </div>
  );
};

// Vibration patterns for different animals
const getVibrationPattern = (type: TransitionType): number[] => {
  switch (type) {
    case "cheetah":
      return [50, 30, 50]; // Quick, sharp vibrations
    case "elephant":
      return [200, 100, 200]; // Heavy, steady vibrations
    case "lion":
      return [150, 50, 150, 50, 150]; // Powerful roar pattern
    case "gazelle":
      return [50, 50, 50, 50]; // Light, bouncy pattern
    case "hyena":
      return [100, 100, 100]; // Irregular laughing pattern
    case "vulture":
      return [300]; // Single, long vibration
    case "antelope":
      return [80, 40, 80]; // Gentle path pattern
    case "baobab":
      return [250]; // Single, grounded vibration
    default:
      return [100];
  }
};

// Enhanced transition overlay component
const TransitionOverlay: React.FC<{
  type: TransitionType;
  duration: number;
}> = ({ type, duration }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`transition-overlay ${type}-overlay`}
      style={{
        animationDuration: `${duration}ms`,
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {type === "cheetah" && <CheetahOverlay />}
      {type === "lion" && <LionOverlay />}
      {type === "elephant" && <ElephantOverlay />}
      {type === "vulture" && <VultureOverlay />}
    </div>
  );
};

// Specific overlay components for enhanced effects
const CheetahOverlay: React.FC = () => (
  <div className="cheetah-spots-overlay">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="cheetah-spot"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 50}ms`,
        }}
      />
    ))}
  </div>
);

const LionOverlay: React.FC = () => (
  <div className="lion-mane-overlay">
    <div className="mane-ripple" />
    <div className="mane-ripple" style={{ animationDelay: "0.2s" }} />
    <div className="mane-ripple" style={{ animationDelay: "0.4s" }} />
  </div>
);

const ElephantOverlay: React.FC = () => (
  <div className="elephant-dust-overlay">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="dust-particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 100}ms`,
        }}
      />
    ))}
  </div>
);

const VultureOverlay: React.FC = () => (
  <div className="vulture-circle-overlay">
    <div className="vulture-shadow" />
  </div>
);

export default WildlifeRouteTransition;

// Hook for programmatic transition control
export const useWildlifeTransition = () => {
  const location = useLocation();
  const { config } = usePerformanceOptimization();

  const triggerTransition = (type: TransitionType, duration?: number) => {
    if (!config.enableAnimations) return;

    document.body.classList.add(`transition-${type}`);
    setTimeout(() => {
      document.body.classList.remove(`transition-${type}`);
    }, duration || 400);
  };

  const getCurrentTransition = (): TransitionType => {
    const route = ROUTE_TRANSITIONS[location.pathname];
    return route?.type || "antelope";
  };

  return {
    triggerTransition,
    getCurrentTransition,
    isTransitionEnabled: config.enableAnimations,
  };
};
