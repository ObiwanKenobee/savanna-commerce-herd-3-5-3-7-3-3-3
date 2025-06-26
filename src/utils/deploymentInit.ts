/**
 * 🚀 Deployment Initialization for Savanna Marketplace
 * Handles deployment-specific setup for Vercel, Render, AWS, etc.
 */

import { handleSPARouting } from "./routeConfig";

interface DeploymentConfig {
  environment: "development" | "production" | "staging";
  platform: "vercel" | "render" | "aws" | "netlify" | "unknown";
  baseUrl: string;
  features: {
    errorReporting: boolean;
    analytics: boolean;
    securityMonitoring: boolean;
  };
}

/**
 * Detect deployment platform
 */
function detectPlatform(): DeploymentConfig["platform"] {
  if (typeof window === "undefined") return "unknown";

  const hostname = window.location.hostname;
  const userAgent = navigator.userAgent;

  if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) {
    return "vercel";
  }
  if (hostname.includes("render.com") || hostname.includes("onrender.com")) {
    return "render";
  }
  if (hostname.includes("amazonaws.com") || hostname.includes("aws")) {
    return "aws";
  }
  if (hostname.includes("netlify.app") || hostname.includes("netlify.com")) {
    return "netlify";
  }

  return "unknown";
}

/**
 * Get deployment configuration
 */
function getDeploymentConfig(): DeploymentConfig {
  const environment =
    (process.env.NODE_ENV as DeploymentConfig["environment"]) || "development";
  const platform = detectPlatform();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return {
    environment,
    platform,
    baseUrl,
    features: {
      errorReporting: environment === "production",
      analytics: environment === "production",
      securityMonitoring: true,
    },
  };
}

/**
 * Initialize error handling for deployment
 */
function initializeErrorHandling(config: DeploymentConfig) {
  if (typeof window === "undefined") return;

  // Global error handler
  window.addEventListener("error", (event) => {
    console.error("🚨 Global Error:", event.error);

    // Log to security monitor if available
    try {
      import("../utils/securityMonitor").then(({ securityMonitor }) => {
        securityMonitor.logSecurityEvent({
          type: "navigation",
          level: "error",
          message: `Global Error: ${event.message}`,
          timestamp: new Date().toISOString(),
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            platform: config.platform,
            environment: config.environment,
          },
        });
      });
    } catch (e) {
      console.warn("Could not log to security monitor:", e);
    }
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    console.error("🚨 Unhandled Promise Rejection:", event.reason);

    try {
      import("../utils/securityMonitor").then(({ securityMonitor }) => {
        securityMonitor.logSecurityEvent({
          type: "navigation",
          level: "error",
          message: `Unhandled Promise Rejection: ${event.reason}`,
          timestamp: new Date().toISOString(),
          metadata: {
            platform: config.platform,
            environment: config.environment,
          },
        });
      });
    } catch (e) {
      console.warn("Could not log to security monitor:", e);
    }
  });
}

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring(config: DeploymentConfig) {
  if (typeof window === "undefined" || !config.features.analytics) return;

  // Monitor basic performance metrics using built-in Performance API
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        try {
          // Monitor navigation timing
          if ("navigation" in performance) {
            const timing = performance.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming;
            console.log("🏃 Performance Metrics:", {
              platform: config.platform,
              loadTime: timing.loadEventEnd - timing.loadEventStart,
              domContentLoaded:
                timing.domContentLoadedEventEnd -
                timing.domContentLoadedEventStart,
              firstByte: timing.responseStart - timing.requestStart,
            });
          }

          // Monitor basic page load performance
          if (performance.timing) {
            const pageLoadTime =
              performance.timing.loadEventEnd -
              performance.timing.navigationStart;
            console.log("🚀 Page Load Time:", pageLoadTime + "ms");
          }

          // Monitor memory usage if available
          if ("memory" in performance) {
            const memory = (performance as any).memory;
            console.log("💾 Memory Usage:", {
              used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
              total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
              limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + "MB",
            });
          }
        } catch (error) {
          console.warn("Performance monitoring error:", error);
        }
      }, 1000);
    });
  }
}

/**
 * Initialize service worker for deployment caching
 */
function initializeServiceWorker(config: DeploymentConfig) {
  if (typeof window === "undefined" || config.environment !== "production")
    return;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("🔧 SW registered:", registration);
        })
        .catch((registrationError) => {
          console.log("🔧 SW registration failed:", registrationError);
        });
    });
  }
}

/**
 * Handle deployment-specific redirects
 */
function handleDeploymentRedirects(config: DeploymentConfig) {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  const search = window.location.search;

  // Handle common deployment redirect patterns
  if (path === "/index.html") {
    window.location.replace("/" + search);
    return;
  }

  // Handle auth redirects
  const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
  if (redirectAfterLogin && path === "/auth") {
    sessionStorage.removeItem("redirectAfterLogin");
    // Will be handled by auth component
  }
}

/**
 * Main deployment initialization function
 */
export function initializeDeployment(): DeploymentConfig {
  const config = getDeploymentConfig();

  console.log("🚀 Initializing Savanna Marketplace:", {
    environment: config.environment,
    platform: config.platform,
    baseUrl: config.baseUrl,
  });

  // Initialize core systems
  initializeErrorHandling(config);
  initializePerformanceMonitoring(config);
  initializeServiceWorker(config);
  handleDeploymentRedirects(config);

  // Initialize SPA routing
  handleSPARouting();

  // Platform-specific initialization
  switch (config.platform) {
    case "vercel":
      console.log("🔧 Vercel deployment detected");
      break;
    case "render":
      console.log("🔧 Render deployment detected");
      break;
    case "aws":
      console.log("🔧 AWS deployment detected");
      break;
    case "netlify":
      console.log("🔧 Netlify deployment detected");
      break;
    default:
      console.log("🔧 Unknown deployment platform");
  }

  return config;
}

/**
 * Check deployment health
 */
export function checkDeploymentHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Basic health checks
      const checks = [
        typeof window !== "undefined",
        typeof document !== "undefined",
        !!window.location,
        !!navigator,
      ];

      const allPassed = checks.every(Boolean);

      if (allPassed) {
        console.log("✅ Deployment health check passed");
      } else {
        console.warn("⚠️ Deployment health check failed");
      }

      resolve(allPassed);
    } catch (error) {
      console.error("🚨 Deployment health check error:", error);
      resolve(false);
    }
  });
}

// Auto-initialize on import in browser environment
if (typeof window !== "undefined") {
  initializeDeployment();
}

export default {
  initializeDeployment,
  checkDeploymentHealth,
  getDeploymentConfig,
  detectPlatform,
};
