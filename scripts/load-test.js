// 🦁 Savanna Marketplace Load Testing Script
// Simulates real-world usage patterns for East African users

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// 📊 Custom Metrics
export let checkFailureRate = new Rate("check_failure_rate");
export let mpesaPaymentTime = new Trend("mpesa_payment_duration");
export let ussdSessionTime = new Trend("ussd_session_duration");
export let cartCheckoutTime = new Trend("cart_checkout_duration");
export let fraudDetectionTime = new Trend("fraud_detection_duration");
export let orderCount = new Counter("orders_processed");

// 🌍 Load Test Configuration for East African Conditions
export let options = {
  stages: [
    // 🌅 Morning Rush (8-10 AM EAT)
    { duration: "2m", target: 50 }, // Retailers checking inventory
    { duration: "5m", target: 100 }, // Peak morning activity
    { duration: "3m", target: 100 }, // Sustained load

    // 🌞 Midday Operations (12-2 PM EAT)
    { duration: "2m", target: 200 }, // Lunch break orders
    { duration: "5m", target: 300 }, // Peak midday traffic
    { duration: "3m", target: 300 }, // Heavy load testing

    // 🌅 Evening Peak (5-7 PM EAT)
    { duration: "2m", target: 400 }, // End of day rush
    { duration: "5m", target: 500 }, // Maximum load
    { duration: "5m", target: 500 }, // Stress testing

    // 🌙 Gradual Decline (7-9 PM EAT)
    { duration: "5m", target: 200 }, // Evening wind down
    { duration: "5m", target: 100 }, // Late evening
    { duration: "2m", target: 0 }, // System rest
  ],

  thresholds: {
    // 🎯 Performance Targets for Kenya Infrastructure
    http_req_duration: ["p(95)<3000"], // 95% under 3s (3G speed)
    http_req_failed: ["rate<0.02"], // < 2% errors
    check_failure_rate: ["rate<0.01"], // < 1% check failures
    mpesa_payment_duration: ["p(95)<5000"], // M-Pesa under 5s
    ussd_session_duration: ["p(95)<4000"], // USSD under 4s
    cart_checkout_duration: ["p(95)<8000"], // Checkout under 8s
    fraud_detection_duration: ["p(95)<500"], // Fraud check under 500ms
  },

  // 🌐 Browser and network simulation
  userAgent:
    "Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
};

// 🎭 User Personas for Realistic Testing
const userPersonas = [
  {
    type: "rural_retailer",
    weight: 40, // 40% of users
    behavior: "ussd_heavy",
    location: "rural_kenya",
    device: "feature_phone",
  },
  {
    type: "urban_retailer",
    weight: 35, // 35% of users
    behavior: "mobile_app",
    location: "nairobi",
    device: "smartphone",
  },
  {
    type: "supplier",
    weight: 15, // 15% of users
    behavior: "web_dashboard",
    location: "mombasa",
    device: "desktop",
  },
  {
    type: "admin",
    weight: 10, // 10% of users
    behavior: "admin_panel",
    location: "nairobi",
    device: "laptop",
  },
];

// 🏪 Product Categories (Kenya Market)
const productCategories = [
  "maize_flour",
  "cooking_oil",
  "rice",
  "sugar",
  "tea_leaves",
  "detergent",
  "soap",
  "batteries",
  "phone_credit",
  "soft_drinks",
];

// 🌍 Base URL Configuration
const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

// 🎯 Main Test Scenario
export default function () {
  // 🎲 Select random user persona
  let persona = selectUserPersona();

  group("User Journey Simulation", function () {
    group("🏠 Homepage Load", function () {
      let response = http.get(`${BASE_URL}/`);
      check(response, {
        "homepage loads": (r) => r.status === 200,
        "homepage load time": (r) => r.timings.duration < 2000,
      }) || checkFailureRate.add(1);

      sleep(randomBetween(1, 3)); // Think time
    });

    // 🔐 Authentication Flow
    if (persona.type !== "rural_retailer") {
      group("🔐 User Authentication", function () {
        authenticateUser(persona);
      });
    }

    // 📱 USSD Flow for Rural Users
    if (persona.behavior === "ussd_heavy") {
      group("📱 USSD Session", function () {
        simulateUSSDSession();
      });
    }

    // 🛒 Shopping Flow
    group("🛒 Product Browsing & Shopping", function () {
      browseProducts(persona);
      addToCart(persona);

      if (Math.random() < 0.7) {
        // 70% conversion rate
        checkoutProcess(persona);
      }
    });

    // 👑 Admin Activities
    if (persona.type === "admin") {
      group("👑 Admin Dashboard", function () {
        adminActivities();
      });
    }

    // 📊 Supplier Activities
    if (persona.type === "supplier") {
      group("🏭 Supplier Dashboard", function () {
        supplierActivities();
      });
    }
  });

  // 🎯 Think time between sessions (realistic user behavior)
  sleep(randomBetween(10, 30));
}

// 🎲 User Persona Selection
function selectUserPersona() {
  let random = Math.random() * 100;
  let cumulative = 0;

  for (let persona of userPersonas) {
    cumulative += persona.weight;
    if (random <= cumulative) {
      return persona;
    }
  }
  return userPersonas[0]; // Fallback
}

// 🔐 Authentication Simulation
function authenticateUser(persona) {
  let loginData = {
    email: `${persona.type}_${__VU}@savanna-test.com`,
    password: "testpassword123",
  };

  let response = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify(loginData),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(response, {
    "login successful": (r) => r.status === 200,
    "auth response time": (r) => r.timings.duration < 2000,
  }) || checkFailureRate.add(1);

  sleep(randomBetween(1, 2));
}

// 📱 USSD Session Simulation
function simulateUSSDSession() {
  let startTime = Date.now();

  // USSD Menu Navigation: *384*7#
  group("USSD Menu Navigation", function () {
    let response = http.post(
      `${BASE_URL}/api/ussd/session`,
      JSON.stringify({
        sessionId: `ussd_${__VU}_${Date.now()}`,
        phoneNumber: `+254700${String(__VU).padStart(6, "0")}`,
        text: "*384*7#",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "USSD session starts": (r) => r.status === 200,
      "USSD response time": (r) => r.timings.duration < 3000,
    }) || checkFailureRate.add(1);
  });

  // Place Order via USSD
  group("USSD Order Placement", function () {
    let response = http.post(
      `${BASE_URL}/api/ussd/order`,
      JSON.stringify({
        sessionId: `ussd_${__VU}_${Date.now()}`,
        productCode: "001", // Maize flour
        quantity: randomBetween(1, 10),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "USSD order placed": (r) => r.status === 200,
    }) || checkFailureRate.add(1);
  });

  let duration = Date.now() - startTime;
  ussdSessionTime.add(duration);

  sleep(randomBetween(2, 5));
}

// 🛒 Product Browsing Simulation
function browseProducts(persona) {
  // Browse marketplace
  let response = http.get(
    `${BASE_URL}/api/products?category=${getRandomCategory()}&limit=20`,
  );

  check(response, {
    "products load": (r) => r.status === 200,
    "product API response": (r) => r.timings.duration < 1500,
  }) || checkFailureRate.add(1);

  // Search functionality
  let searchTerm =
    productCategories[Math.floor(Math.random() * productCategories.length)];
  response = http.get(`${BASE_URL}/api/products/search?q=${searchTerm}`);

  check(response, {
    "search works": (r) => r.status === 200,
    "search performance": (r) => r.timings.duration < 1000,
  }) || checkFailureRate.add(1);

  sleep(randomBetween(3, 8)); // Browse time
}

// 🛒 Add to Cart Simulation
function addToCart(persona) {
  let cartData = {
    productId: randomBetween(1, 100),
    quantity: randomBetween(1, 5),
    userId: `user_${__VU}`,
  };

  let response = http.post(
    `${BASE_URL}/api/cart/add`,
    JSON.stringify(cartData),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(response, {
    "add to cart success": (r) => r.status === 200,
    "cart response time": (r) => r.timings.duration < 1000,
  }) || checkFailureRate.add(1);

  sleep(randomBetween(1, 3));
}

// 💳 Checkout Process Simulation
function checkoutProcess(persona) {
  let startTime = Date.now();

  group("Checkout Flow", function () {
    // View cart
    let response = http.get(`${BASE_URL}/api/cart`);
    check(response, {
      "cart loads": (r) => r.status === 200,
    }) || checkFailureRate.add(1);

    // Initiate checkout
    response = http.post(
      `${BASE_URL}/api/checkout/init`,
      JSON.stringify({
        paymentMethod: "mpesa",
        phoneNumber: `+254700${String(__VU).padStart(6, "0")}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "checkout initiated": (r) => r.status === 200,
    }) || checkFailureRate.add(1);
  });

  // 💰 M-Pesa Payment Simulation
  group("M-Pesa Payment", function () {
    let paymentStartTime = Date.now();

    let response = http.post(
      `${BASE_URL}/api/payments/mpesa/stk-push`,
      JSON.stringify({
        phoneNumber: `+254700${String(__VU).padStart(6, "0")}`,
        amount: randomBetween(100, 5000),
        orderId: `order_${__VU}_${Date.now()}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "M-Pesa STK push sent": (r) => r.status === 200,
      "payment initiation fast": (r) => r.timings.duration < 2000,
    }) || checkFailureRate.add(1);

    // Simulate payment confirmation
    sleep(randomBetween(10, 30)); // User enters PIN

    response = http.post(
      `${BASE_URL}/api/payments/mpesa/confirm`,
      JSON.stringify({
        checkoutRequestID: `req_${__VU}_${Date.now()}`,
        resultCode: Math.random() < 0.95 ? 0 : 1, // 95% success rate
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "payment confirmed": (r) => r.status === 200,
    }) || checkFailureRate.add(1);

    let paymentDuration = Date.now() - paymentStartTime;
    mpesaPaymentTime.add(paymentDuration);
  });

  // 🔍 Fraud Detection Check
  group("Fraud Detection", function () {
    let fraudStartTime = Date.now();

    let response = http.post(
      `${BASE_URL}/api/fraud/check`,
      JSON.stringify({
        userId: `user_${__VU}`,
        orderId: `order_${__VU}_${Date.now()}`,
        amount: randomBetween(100, 5000),
        location: persona.location,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    check(response, {
      "fraud check completes": (r) => r.status === 200,
      "fraud check fast": (r) => r.timings.duration < 500,
    }) || checkFailureRate.add(1);

    let fraudDuration = Date.now() - fraudStartTime;
    fraudDetectionTime.add(fraudDuration);
  });

  let checkoutDuration = Date.now() - startTime;
  cartCheckoutTime.add(checkoutDuration);
  orderCount.add(1);

  sleep(randomBetween(2, 5));
}

// 👑 Admin Activities Simulation
function adminActivities() {
  // Dashboard load
  let response = http.get(`${BASE_URL}/admin/dashboard`);
  check(response, {
    "admin dashboard loads": (r) => r.status === 200,
    "dashboard performance": (r) => r.timings.duration < 3000,
  }) || checkFailureRate.add(1);

  // User management
  response = http.get(`${BASE_URL}/admin/users?page=1&limit=50`);
  check(response, {
    "user list loads": (r) => r.status === 200,
  }) || checkFailureRate.add(1);

  // Security monitoring
  response = http.get(`${BASE_URL}/admin/security/alerts`);
  check(response, {
    "security alerts load": (r) => r.status === 200,
  }) || checkFailureRate.add(1);

  sleep(randomBetween(10, 20)); // Admin review time
}

// 🏭 Supplier Activities Simulation
function supplierActivities() {
  // Supplier dashboard
  let response = http.get(`${BASE_URL}/supplier/dashboard`);
  check(response, {
    "supplier dashboard loads": (r) => r.status === 200,
  }) || checkFailureRate.add(1);

  // Inventory management
  response = http.get(`${BASE_URL}/supplier/inventory`);
  check(response, {
    "inventory loads": (r) => r.status === 200,
  }) || checkFailureRate.add(1);

  // Update product
  response = http.put(
    `${BASE_URL}/api/products/${randomBetween(1, 100)}`,
    JSON.stringify({
      price: randomBetween(50, 1000),
      stock: randomBetween(0, 100),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(response, {
    "product update success": (r) => r.status === 200,
  }) || checkFailureRate.add(1);

  sleep(randomBetween(5, 15));
}

// 🛠️ Utility Functions
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCategory() {
  return productCategories[
    Math.floor(Math.random() * productCategories.length)
  ];
}

// 📊 Test Summary Report
export function handleSummary(data) {
  return {
    "load-test-summary.html": htmlReport(data),
    "load-test-summary.json": JSON.stringify(data, null, 2),
  };
}

function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>🦁 Savanna Marketplace Load Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { background: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 4px solid #007acc; }
        .success { border-left-color: #28a745; }
        .warning { border-left-color: #ffc107; }
        .error { border-left-color: #dc3545; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>🦁 Savanna Marketplace Load Test Results</h1>
    <h2>📊 Test Summary</h2>
    <div class="metric">
        <strong>Total Requests:</strong> ${data.metrics.http_reqs.count}
    </div>
    <div class="metric ${data.metrics.http_req_failed.rate < 0.02 ? "success" : "error"}">
        <strong>Error Rate:</strong> ${(data.metrics.http_req_failed.rate * 100).toFixed(2)}%
    </div>
    <div class="metric ${data.metrics.http_req_duration.p95 < 3000 ? "success" : "warning"}">
        <strong>95th Percentile Response Time:</strong> ${data.metrics.http_req_duration.p95.toFixed(2)}ms
    </div>
    
    <h2>💰 M-Pesa Performance</h2>
    <div class="metric">
        <strong>Payment Duration (95th):</strong> ${data.metrics.mpesa_payment_duration?.p95?.toFixed(2) || "N/A"}ms
    </div>
    
    <h2>📱 USSD Performance</h2>
    <div class="metric">
        <strong>USSD Session Duration (95th):</strong> ${data.metrics.ussd_session_duration?.p95?.toFixed(2) || "N/A"}ms
    </div>
    
    <h2>🛒 Business Metrics</h2>
    <div class="metric">
        <strong>Orders Processed:</strong> ${data.metrics.orders_processed?.count || 0}
    </div>
    <div class="metric">
        <strong>Checkout Duration (95th):</strong> ${data.metrics.cart_checkout_duration?.p95?.toFixed(2) || "N/A"}ms
    </div>
    
    <p><em>Generated on ${new Date().toISOString()}</em></p>
</body>
</html>
  `;
}
