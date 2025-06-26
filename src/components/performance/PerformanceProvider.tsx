/**
 * 🚀 Performance Provider Component
 * Central hub for all Kenya-optimized performance features
 */

import React, { useEffect } from "react";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";
import BatteryAwareMonitor from "./BatteryAwareMonitor";
import USSDFallback, { addJSDetection } from "./USSDFallback";
import WildlifeRouteTransition from "./WildlifeRouteTransition";

interface PerformanceProviderProps {
  children: React.ReactNode;
  enableUSSDFallback?: boolean;
  enableBatteryMonitoring?: boolean;
  enableRouteTransitions?: boolean;
  className?: string;
}

const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  enableUSSDFallback = true,
  enableBatteryMonitoring = true,
  enableRouteTransitions = true,
  className = "",
}) => {
  const {
    config,
    isSlowConnection,
    isLowPowerMode,
    currentHour,
    userLocation,
    triggerPrefetch,
  } = usePerformanceOptimization();

  // Initialize JavaScript detection for USSD fallback
  useEffect(() => {
    addJSDetection();

    // Add performance monitoring classes to body
    document.body.classList.add("js-loaded");
    document.body.classList.add(`${userLocation.county.toLowerCase()}-region`);
    document.body.classList.add(
      `connectivity-${userLocation.connectivityScore}`,
    );

    if (isSlowConnection) {
      document.body.classList.add("slow-connection");
    }

    if (isLowPowerMode) {
      document.body.classList.add("low-power-mode");
    }

    // Add time-based classes
    const timeClass = getTimeBasedClass(currentHour);
    document.body.classList.add(timeClass);

    // Cleanup function
    return () => {
      const classesToRemove = [
        "js-loaded",
        `${userLocation.county.toLowerCase()}-region`,
        `connectivity-${userLocation.connectivityScore}`,
        "slow-connection",
        "low-power-mode",
        timeClass,
      ];

      classesToRemove.forEach((cls) => {
        document.body.classList.remove(cls);
      });
    };
  }, [userLocation, isSlowConnection, isLowPowerMode, currentHour]);

  // Time-based prefetching
  useEffect(() => {
    if (!config.enablePrefetching) return;

    const schedulePrefetch = () => {
      // Morning prefetch (6-8 AM): Breakfast items
      if (currentHour >= 6 && currentHour <= 8) {
        triggerPrefetch("maize-flour");
      }

      // Lunch time (12-2 PM): Quick meals
      if (currentHour >= 12 && currentHour <= 14) {
        triggerPrefetch("cooking-oil");
      }

      // Evening shopping (6-8 PM): General products
      if (currentHour >= 18 && currentHour <= 20) {
        triggerPrefetch("deals");
        triggerPrefetch("suppliers");
      }

      // Business hours (9-5 PM): B2B content
      if (currentHour >= 9 && currentHour <= 17) {
        triggerPrefetch("suppliers");
      }
    };

    // Schedule prefetch with slight delay to avoid blocking
    const timeoutId = setTimeout(schedulePrefetch, 2000);
    return () => clearTimeout(timeoutId);
  }, [currentHour, config.enablePrefetching, triggerPrefetch]);

  // Network quality monitoring
  useEffect(() => {
    const monitorNetworkQuality = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;

        // Add bandwidth indicator
        const indicator = document.createElement("div");
        indicator.className = `bandwidth-indicator bandwidth-${connection.effectiveType}`;
        indicator.textContent = "📶";
        indicator.style.display = isSlowConnection ? "block" : "none";

        document.body.appendChild(indicator);

        // Show indicator briefly when connection changes
        const showIndicator = () => {
          indicator.classList.add("visible");
          setTimeout(() => indicator.classList.remove("visible"), 3000);
        };

        connection.addEventListener("change", showIndicator);

        return () => {
          connection.removeEventListener("change", showIndicator);
          document.body.removeChild(indicator);
        };
      }
    };

    return monitorNetworkQuality();
  }, [isSlowConnection]);

  // Service Worker registration for offline capabilities
  useEffect(() => {
    if ("serviceWorker" in navigator && config.enablePrefetching) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("🦁 Service Worker registered:", registration);

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        } catch (error) {
          console.log("Service Worker registration failed:", error);
        }
      };

      registerSW();
    }
  }, [config.enablePrefetching]);

  const getTimeBasedClass = (hour: number): string => {
    if (hour >= 5 && hour < 10) return "morning-mode";
    if (hour >= 10 && hour < 16) return "midday-mode";
    if (hour >= 16 && hour < 20) return "evening-mode";
    return "night-mode";
  };

  const showUpdateNotification = () => {
    const notification = document.createElement("div");
    notification.className = "sw-update-available";
    notification.innerHTML = `
      <div>🦁 New version available / Toleo jipya linapatikana</div>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #2D5016;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        margin-left: 1rem;
        cursor: pointer;
        font-weight: bold;
      ">
        Update / Sasisha
      </button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 10000);
  };

  // Create component tree based on enabled features
  let content = children;

  if (enableRouteTransitions && config.enableAnimations) {
    content = <WildlifeRouteTransition>{content}</WildlifeRouteTransition>;
  }

  if (enableBatteryMonitoring) {
    content = <BatteryAwareMonitor>{content}</BatteryAwareMonitor>;
  }

  return (
    <div className={`performance-provider ${className}`}>
      {/* USSD Fallback for no-JS scenarios */}
      {enableUSSDFallback && (
        <USSDFallback showAfterTimeout={5000} forceShow={false} />
      )}

      {/* Main performance-optimized content */}
      <div className="performance-content">{content}</div>

      {/* Performance debugging info (dev only) */}
      {process.env.NODE_ENV === "development" && <PerformanceDebugInfo />}
    </div>
  );
};

// Development debugging component
const PerformanceDebugInfo: React.FC = () => {
  const {
    config,
    networkInfo,
    userLocation,
    isSlowConnection,
    isLowPowerMode,
  } = usePerformanceOptimization();

  const [showDebug, setShowDebug] = React.useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          background: "#2D5016",
          color: "white",
          border: "none",
          padding: "0.5rem",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.8rem",
          zIndex: 10000,
        }}
      >
        🔧 Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "1rem",
        borderRadius: "8px",
        fontSize: "0.8rem",
        maxWidth: "300px",
        zIndex: 10000,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <strong>Performance Debug</strong>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div>
        <strong>County:</strong> {userLocation.county}
      </div>
      <div>
        <strong>Connectivity:</strong> {userLocation.connectivityScore}/10
      </div>
      <div>
        <strong>Network:</strong> {networkInfo?.effectiveType || "unknown"}
      </div>
      <div>
        <strong>Slow Connection:</strong>{" "}
        {isSlowConnection ? "🐌 Yes" : "🐆 No"}
      </div>
      <div>
        <strong>Low Power:</strong> {isLowPowerMode ? "🔋 Yes" : "⚡ No"}
      </div>
      <div>
        <strong>Animations:</strong> {config.enableAnimations ? "✅" : "❌"}
      </div>
      <div>
        <strong>Image Quality:</strong> {config.imageQuality}
      </div>
      <div>
        <strong>Prefetching:</strong> {config.enablePrefetching ? "✅" : "❌"}
      </div>
      <div>
        <strong>Voice Commands:</strong>{" "}
        {config.enableVoiceCommands ? "🎤" : "❌"}
      </div>
      <div>
        <strong>Loading Strategy:</strong> {config.loadingStrategy}
      </div>
    </div>
  );
};

export default PerformanceProvider;

// Convenience hooks for common performance patterns
export const useKenyanTime = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Convert to Kenya time
  const kenyaTime = new Date(
    currentTime.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }),
  );
  const hour = kenyaTime.getHours();

  return {
    kenyaTime,
    hour,
    isBusinessHours: hour >= 8 && hour <= 18,
    isPeakHours:
      (hour >= 6 && hour <= 9) ||
      (hour >= 12 && hour <= 14) ||
      (hour >= 18 && hour <= 20),
    timeOfDay:
      hour >= 5 && hour < 10
        ? "morning"
        : hour >= 10 && hour < 16
          ? "midday"
          : hour >= 16 && hour < 20
            ? "evening"
            : "night",
  };
};

export const useAdaptiveLoading = () => {
  const { config, isSlowConnection, shouldLoadComponent } =
    usePerformanceOptimization();

  return {
    shouldLoad: shouldLoadComponent,
    loadingStrategy: config.loadingStrategy,
    imageQuality: config.imageQuality,
    isSlowConnection,
    enableAnimations: config.enableAnimations,
    enablePrefetching: config.enablePrefetching,
  };
};
