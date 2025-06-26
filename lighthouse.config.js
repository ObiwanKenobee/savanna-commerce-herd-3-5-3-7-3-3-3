// 🦁 Savanna Marketplace Lighthouse Configuration
// Performance monitoring for East African internet conditions

module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:5173",
        "http://localhost:5173/marketplace",
        "http://localhost:5173/cart",
        "http://localhost:5173/dashboard",
        "http://localhost:5173/admin",
      ],
      startServerCommand: "npm run preview",
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        // Simulate Kenya's internet conditions
        throttling: {
          rttMs: 150, // RTT typical for Kenya (100-200ms)
          throughputKbps: 1600, // 3G speed common in rural areas
          cpuSlowdownMultiplier: 4,
        },
        // Mobile-first approach (many users on mobile)
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        // Performance thresholds optimized for African conditions
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:pwa": ["warn", { minScore: 0.7 }],

        // Core Web Vitals for mobile users
        "audits:largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "audits:first-contentful-paint": ["warn", { maxNumericValue: 3000 }],
        "audits:cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "audits:speed-index": ["warn", { maxNumericValue: 5000 }],
        "audits:interactive": ["warn", { maxNumericValue: 6000 }],

        // Network efficiency (important for data costs)
        "audits:total-byte-weight": ["warn", { maxNumericValue: 2000000 }], // 2MB
        "audits:unused-javascript": ["warn", { maxNumericValue: 40000 }],
        "audits:unused-css-rules": ["warn", { maxNumericValue: 20000 }],
        "audits:render-blocking-resources": ["warn", { maxNumericValue: 500 }],

        // Critical for marketplace functionality
        "audits:uses-text-compression": "error",
        "audits:uses-optimized-images": "warn",
        "audits:modern-image-formats": "warn",
        "audits:efficient-animated-content": "warn",

        // Progressive Web App features (offline access)
        "audits:service-worker": "warn",
        "audits:offline-start-url": "warn",
        "audits:installable-manifest": "warn",

        // Accessibility (important for inclusive design)
        "audits:color-contrast": "error",
        "audits:image-alt": "error",
        "audits:label": "error",
        "audits:aria-roles": "error",
        "audits:keyboard-navigation": "error",

        // Security
        "audits:is-on-https": "error",
        "audits:uses-http2": "warn",
        "audits:no-vulnerable-libraries": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
    server: {
      port: 9009,
      storage: ".lighthouseci",
    },
  },

  // Custom audit configuration for Savanna Marketplace
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      // Performance
      "first-contentful-paint",
      "largest-contentful-paint",
      "speed-index",
      "cumulative-layout-shift",
      "interactive",
      "total-blocking-time",

      // Network
      "total-byte-weight",
      "render-blocking-resources",
      "unused-javascript",
      "unused-css-rules",
      "uses-text-compression",
      "uses-optimized-images",
      "modern-image-formats",

      // PWA
      "service-worker",
      "offline-start-url",
      "installable-manifest",
      "splash-screen",
      "themed-omnibox",

      // Accessibility
      "color-contrast",
      "image-alt",
      "label",
      "aria-roles",
      "keyboard-navigation",
      "focus-traps",

      // SEO
      "document-title",
      "meta-description",
      "robots-txt",
      "hreflang",
      "canonical",

      // Security
      "is-on-https",
      "uses-http2",
      "no-vulnerable-libraries",
    ],
  },
};
