import { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Code,
  Book,
  Zap,
  Shield,
  Globe,
  Download,
  Copy,
  Play,
  Settings,
  Key,
  Database,
  Webhook,
  FileText,
  Terminal,
} from "lucide-react";

const ApiDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

  const apiEndpoints = [
    {
      category: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/auth/login",
          description: "Authenticate user and get access token",
          parameters: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "User email address",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "User password",
            },
          ],
          response: {
            access_token: "string",
            user: "object",
            expires_in: "number",
          },
        },
        {
          method: "POST",
          path: "/auth/refresh",
          description: "Refresh access token",
          parameters: [
            {
              name: "refresh_token",
              type: "string",
              required: true,
              description: "Valid refresh token",
            },
          ],
          response: {
            access_token: "string",
            expires_in: "number",
          },
        },
      ],
    },
    {
      category: "Products",
      endpoints: [
        {
          method: "GET",
          path: "/products",
          description: "Get list of products with filtering and pagination",
          parameters: [
            {
              name: "page",
              type: "number",
              required: false,
              description: "Page number (default: 1)",
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Items per page (default: 20)",
            },
            {
              name: "category",
              type: "string",
              required: false,
              description: "Filter by category",
            },
            {
              name: "search",
              type: "string",
              required: false,
              description: "Search term",
            },
          ],
          response: {
            products: "array",
            pagination: "object",
            total: "number",
          },
        },
        {
          method: "GET",
          path: "/products/{id}",
          description: "Get specific product details",
          parameters: [
            {
              name: "id",
              type: "string",
              required: true,
              description: "Product ID",
            },
          ],
          response: {
            id: "string",
            name: "string",
            description: "string",
            price: "number",
            supplier: "object",
          },
        },
        {
          method: "POST",
          path: "/products",
          description: "Create new product (suppliers only)",
          parameters: [
            {
              name: "name",
              type: "string",
              required: true,
              description: "Product name",
            },
            {
              name: "description",
              type: "string",
              required: false,
              description: "Product description",
            },
            {
              name: "price",
              type: "number",
              required: true,
              description: "Product price",
            },
            {
              name: "category",
              type: "string",
              required: true,
              description: "Product category",
            },
          ],
          response: {
            id: "string",
            name: "string",
            status: "string",
          },
        },
      ],
    },
    {
      category: "Orders",
      endpoints: [
        {
          method: "GET",
          path: "/orders",
          description: "Get user's orders",
          parameters: [
            {
              name: "status",
              type: "string",
              required: false,
              description: "Filter by status",
            },
            {
              name: "from_date",
              type: "string",
              required: false,
              description: "Start date (ISO format)",
            },
            {
              name: "to_date",
              type: "string",
              required: false,
              description: "End date (ISO format)",
            },
          ],
          response: {
            orders: "array",
            total: "number",
          },
        },
        {
          method: "POST",
          path: "/orders",
          description: "Create new order",
          parameters: [
            {
              name: "items",
              type: "array",
              required: true,
              description: "Array of order items",
            },
            {
              name: "delivery_address",
              type: "object",
              required: true,
              description: "Delivery address",
            },
            {
              name: "payment_method",
              type: "string",
              required: true,
              description: "Payment method",
            },
          ],
          response: {
            order_id: "string",
            status: "string",
            total_amount: "number",
          },
        },
      ],
    },
    {
      category: "Payments",
      endpoints: [
        {
          method: "POST",
          path: "/payments/mpesa",
          description: "Process M-Pesa payment",
          parameters: [
            {
              name: "phone",
              type: "string",
              required: true,
              description: "M-Pesa phone number",
            },
            {
              name: "amount",
              type: "number",
              required: true,
              description: "Amount in KES",
            },
            {
              name: "order_id",
              type: "string",
              required: true,
              description: "Order ID",
            },
          ],
          response: {
            transaction_id: "string",
            status: "string",
            checkout_url: "string",
          },
        },
        {
          method: "GET",
          path: "/payments/{id}/status",
          description: "Check payment status",
          parameters: [
            {
              name: "id",
              type: "string",
              required: true,
              description: "Payment ID",
            },
          ],
          response: {
            status: "string",
            amount: "number",
            created_at: "string",
          },
        },
      ],
    },
  ];

  const sdkExamples = {
    javascript: `
import SavannaAPI from '@savanna/api-client';

const client = new SavannaAPI({
  apiKey: '${apiKey}',
  environment: 'sandbox' // or 'production'
});

// Get products
const products = await client.products.list({
  category: 'electronics',
  limit: 10
});

// Create order
const order = await client.orders.create({
  items: [
    { product_id: 'prod_123', quantity: 2 },
    { product_id: 'prod_456', quantity: 1 }
  ],
  delivery_address: {
    street: 'Kimathi Street',
    city: 'Nairobi',
    country: 'Kenya'
  }
});`,
    python: `
import savanna_api

client = savanna_api.Client(
    api_key='${apiKey}',
    environment='sandbox'
)

# Get products
products = client.products.list(
    category='electronics',
    limit=10
)

# Create order
order = client.orders.create({
    'items': [
        {'product_id': 'prod_123', 'quantity': 2},
        {'product_id': 'prod_456', 'quantity': 1}
    ],
    'delivery_address': {
        'street': 'Kimathi Street',
        'city': 'Nairobi',
        'country': 'Kenya'
    }
})`,
    curl: `
# Get products
curl -X GET "https://api.savanna-marketplace.com/v1/products" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"

# Create order
curl -X POST "https://api.savanna-marketplace.com/v1/orders" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      {"product_id": "prod_123", "quantity": 2},
      {"product_id": "prod_456", "quantity": 1}
    ],
    "delivery_address": {
      "street": "Kimathi Street",
      "city": "Nairobi",
      "country": "Kenya"
    }
  }'`,
  };

  const webhookEvents = [
    {
      event: "order.created",
      description: "Triggered when a new order is placed",
      payload: {
        order_id: "string",
        user_id: "string",
        total_amount: "number",
        status: "string",
      },
    },
    {
      event: "payment.completed",
      description: "Triggered when payment is successfully processed",
      payload: {
        payment_id: "string",
        order_id: "string",
        amount: "number",
        method: "string",
      },
    },
    {
      event: "order.shipped",
      description: "Triggered when order is shipped",
      payload: {
        order_id: "string",
        tracking_number: "string",
        carrier: "string",
        estimated_delivery: "string",
      },
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🔌 API Documentation
          </h1>
          <p className="text-muted-foreground text-lg">
            Integrate with the Savanna Marketplace ecosystem - build powerful
            applications with our RESTful API.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Code className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">
                    API Endpoints
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">
                    Uptime SLA
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">OAuth 2.0</div>
                  <div className="text-sm text-muted-foreground">
                    Secure Auth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">
                    SDKs Available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Getting Started</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">
                        1. Get API Key
                      </h4>
                      <p className="text-sm text-blue-700">
                        Sign up for a developer account and generate your API
                        key from the dashboard.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">
                        2. Make First Request
                      </h4>
                      <p className="text-sm text-green-700">
                        Use your API key to authenticate and make your first API
                        call.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">
                        3. Build Integration
                      </h4>
                      <p className="text-sm text-purple-700">
                        Explore our SDKs and start building your marketplace
                        integration.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Terminal className="h-5 w-5" />
                    <span>Quick Example</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">curl</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(sdkExamples.curl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap">
                        {`curl -X GET "https://api.savanna-marketplace.com/v1/products" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Replace YOUR_API_KEY with your actual API key to get
                      started immediately.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Base URL & Environments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Production</h4>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                      https://api.savanna-marketplace.com/v1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Sandbox</h4>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                      https://sandbox-api.savanna-marketplace.com/v1
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {apiEndpoints.map((category, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setSelectedEndpoint(category.category)}
                      >
                        {category.category}
                        <Badge className="ml-auto">
                          {category.endpoints.length}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                {apiEndpoints.map((category) => (
                  <div key={category.category} className="space-y-4">
                    <h3 className="text-xl font-bold">{category.category}</h3>
                    {category.endpoints.map((endpoint, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={
                                  endpoint.method === "GET"
                                    ? "bg-green-500"
                                    : endpoint.method === "POST"
                                      ? "bg-blue-500"
                                      : endpoint.method === "PUT"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="font-mono">{endpoint.path}</code>
                            </div>
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              Try It
                            </Button>
                          </div>
                          <p className="text-muted-foreground">
                            {endpoint.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Parameters</h5>
                              <div className="space-y-2">
                                {endpoint.parameters.map(
                                  (param, paramIndex) => (
                                    <div
                                      key={paramIndex}
                                      className="flex items-center space-x-3 text-sm"
                                    >
                                      <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                                        {param.name}
                                      </code>
                                      <Badge variant="outline">
                                        {param.type}
                                      </Badge>
                                      {param.required && (
                                        <Badge className="bg-red-500">
                                          required
                                        </Badge>
                                      )}
                                      <span className="text-muted-foreground">
                                        {param.description}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Response</h5>
                              <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-sm">
                                <pre>
                                  {JSON.stringify(endpoint.response, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>API Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Your API Key</h4>
                    <div className="flex items-center space-x-3">
                      <Input
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="font-mono"
                        placeholder="Enter your API key"
                      />
                      <Button onClick={() => copyToClipboard(apiKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">
                        Authentication Methods
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="font-medium text-green-800">
                            Bearer Token (Recommended)
                          </h5>
                          <p className="text-sm text-green-700 mt-1">
                            Include your API key in the Authorization header
                          </p>
                          <code className="text-xs bg-green-100 px-2 py-1 rounded mt-2 block">
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-800">
                            OAuth 2.0
                          </h5>
                          <p className="text-sm text-blue-700 mt-1">
                            For third-party applications and user authentication
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Security Best Practices
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Never expose API keys in client-side code</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Use environment variables for API keys</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Rotate keys regularly</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Use HTTPS for all API calls</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Official SDKs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="bg-yellow-100 p-4 rounded-lg mb-3">
                      <Code className="h-8 w-8 mx-auto text-yellow-600" />
                    </div>
                    <h4 className="font-medium">JavaScript/Node.js</h4>
                    <p className="text-sm text-muted-foreground">
                      npm install @savanna/api-client
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-lg mb-3">
                      <Code className="h-8 w-8 mx-auto text-blue-600" />
                    </div>
                    <h4 className="font-medium">Python</h4>
                    <p className="text-sm text-muted-foreground">
                      pip install savanna-api
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-lg mb-3">
                      <Code className="h-8 w-8 mx-auto text-red-600" />
                    </div>
                    <h4 className="font-medium">PHP</h4>
                    <p className="text-sm text-muted-foreground">
                      composer require savanna/api-client
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="javascript" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  {Object.entries(sdkExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang}>
                      <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 capitalize">
                            {lang} Example
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap">{code}</pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Webhook className="h-5 w-5" />
                  <span>Webhook Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhookEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {event.event}
                        </code>
                        <Badge variant="outline">POST</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {event.description}
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-sm">
                        <pre>{JSON.stringify(event.payload, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Test Your Integration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Endpoint</label>
                        <select className="w-full mt-1 p-2 border rounded-lg">
                          <option>GET /products</option>
                          <option>POST /orders</option>
                          <option>GET /orders/{id}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Environment
                        </label>
                        <select className="w-full mt-1 p-2 border rounded-lg">
                          <option>Sandbox</option>
                          <option>Production</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Request Body (JSON)
                    </label>
                    <Textarea
                      placeholder='{"key": "value"}'
                      rows={8}
                      className="mt-1 font-mono"
                    />
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Send Request
                  </Button>

                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-100 p-3 rounded-lg text-sm">
                      Click "Send Request" to see the API response here
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;
