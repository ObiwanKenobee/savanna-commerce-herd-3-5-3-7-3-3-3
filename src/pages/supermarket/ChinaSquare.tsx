import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Package,
  TrendingDown,
  Globe,
  Upload,
  DollarSign,
  Truck,
  BarChart3,
  Languages,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Zap,
  Target,
} from "lucide-react";

interface AlibabaProduct {
  id: string;
  name: string;
  chineseName: string;
  supplier: string;
  moq: number;
  unitPrice: number;
  totalCost: number;
  shippingTime: string;
  category: string;
  status: "pending" | "imported" | "live" | "out-of-stock";
}

interface BulkImport {
  id: string;
  shipmentId: string;
  products: number;
  totalValue: number;
  status: "processing" | "shipped" | "customs" | "delivered";
  estimatedArrival: string;
  currentLocation: string;
  progress: number;
}

interface PricingStrategy {
  id: string;
  algorithm: "termite-mound" | "elephant-memory" | "lion-pride";
  description: string;
  targetMargin: number;
  competitorData: {
    naivas: number;
    quickmart: number;
    tuskys: number;
  };
  currentPrice: number;
  suggestedPrice: number;
  active: boolean;
}

const ChinaSquare = () => {
  const [alibabaProducts, setAlibabaProducts] = useState<AlibabaProduct[]>([]);
  const [bulkImports, setBulkImports] = useState<BulkImport[]>([]);
  const [pricingStrategies, setPricingStrategies] = useState<PricingStrategy[]>(
    [],
  );
  const [activeTab, setActiveTab] = useState("bulk-import");

  useEffect(() => {
    // Mock Alibaba products data
    const mockAlibabaProducts: AlibabaProduct[] = [
      {
        id: "ali-001",
        name: "Electric Rice Cooker 1.8L",
        chineseName: "电饭煲 1.8升",
        supplier: "Guangzhou Kitchen Appliances Ltd",
        moq: 100,
        unitPrice: 25,
        totalCost: 2500,
        shippingTime: "15-20 days",
        category: "Electronics",
        status: "live",
      },
      {
        id: "ali-002",
        name: "LED Desk Lamp with USB",
        chineseName: "USB LED台灯",
        supplier: "Shenzhen Lighting Co",
        moq: 500,
        unitPrice: 8,
        totalCost: 4000,
        shippingTime: "12-18 days",
        category: "Electronics",
        status: "pending",
      },
      {
        id: "ali-003",
        name: "Stainless Steel Thermos 500ml",
        chineseName: "不锈钢保温杯 500ml",
        supplier: "Beijing Thermal Products",
        moq: 200,
        unitPrice: 12,
        totalCost: 2400,
        shippingTime: "10-15 days",
        category: "Home & Garden",
        status: "imported",
      },
    ];

    // Mock bulk imports data
    const mockBulkImports: BulkImport[] = [
      {
        id: "import-001",
        shipmentId: "CHIN-2024-001",
        products: 1250,
        totalValue: 45000,
        status: "shipped",
        estimatedArrival: "March 15, 2024",
        currentLocation: "Indian Ocean (en route to Mombasa)",
        progress: 65,
      },
      {
        id: "import-002",
        shipmentId: "CHIN-2024-002",
        products: 800,
        totalValue: 28000,
        status: "customs",
        estimatedArrival: "March 8, 2024",
        currentLocation: "Mombasa Port - Customs Clearance",
        progress: 85,
      },
    ];

    // Mock pricing strategies
    const mockPricingStrategies: PricingStrategy[] = [
      {
        id: "strategy-001",
        algorithm: "termite-mound",
        description:
          "Auto-undercuts competitors by 2% while maintaining minimum margin",
        targetMargin: 25,
        competitorData: {
          naivas: 3500,
          quickmart: 3200,
          tuskys: 3400,
        },
        currentPrice: 3150,
        suggestedPrice: 3136, // 2% below Quickmart
        active: true,
      },
      {
        id: "strategy-002",
        algorithm: "elephant-memory",
        description: "Uses 90-day price history to optimize seasonal pricing",
        targetMargin: 30,
        competitorData: {
          naivas: 180,
          quickmart: 175,
          tuskys: 185,
        },
        currentPrice: 170,
        suggestedPrice: 172, // Based on historical data
        active: true,
      },
    ];

    setAlibabaProducts(mockAlibabaProducts);
    setBulkImports(mockBulkImports);
    setPricingStrategies(mockPricingStrategies);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700";
      case "imported":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "out-of-stock":
        return "bg-red-100 text-red-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "customs":
        return "bg-orange-100 text-orange-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAlgorithmEmoji = (algorithm: string) => {
    switch (algorithm) {
      case "termite-mound":
        return "🐜";
      case "elephant-memory":
        return "🐘";
      case "lion-pride":
        return "🦁";
      default:
        return "🤖";
    }
  };

  const activateTermiteMoundPricing = (strategyId: string) => {
    alert(
      `🐜 Termite Mound Algorithm Activated!\n\nAuto-undercutting competitors by 2%\nPrice updated in real-time across all channels\nUSSD pricing hotline (*384*PRICE#) synchronized`,
    );
  };

  const syncAlibabaProducts = () => {
    alert(
      `🐘 Alibaba Sync Initiated!\n\nConnecting to Alibaba.com API...\nScanning for new products in your categories\nUpdating MOQ and pricing data\nBilingual interface ready (中文/Kiswahili)`,
    );
  };

  const totalStats = {
    activeProducts: alibabaProducts.filter((p) => p.status === "live").length,
    totalInventoryValue: alibabaProducts.reduce(
      (sum, p) => sum + p.totalCost,
      0,
    ),
    pendingImports: bulkImports.filter((i) => i.status !== "delivered").length,
    activePricingStrategies: pricingStrategies.filter((s) => s.active).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            🐘 China Square Command Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Elephant Memory Intelligence</strong> - Bulk import mastery
            with Alibaba integration, bilingual commerce, and termite mound
            pricing algorithms for maximum market penetration.
          </p>
          <div className="mt-4 text-sm text-red-600 font-medium">
            Alibaba Direct Sync • Bilingual Interface (中文/Kiswahili) • Termite
            Mound Pricing • Bulk Import Portal
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <div className="text-3xl font-bold text-red-700">
                {totalStats.activeProducts}
              </div>
              <div className="text-sm text-red-600">Live Products</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                USD {totalStats.totalInventoryValue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Inventory Value</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Truck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.pendingImports}
              </div>
              <div className="text-sm text-blue-600">Pending Imports</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.activePricingStrategies}
              </div>
              <div className="text-sm text-purple-600">Active Strategies</div>
            </CardContent>
          </Card>
        </div>

        {/* Termite Mound Alert */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <TrendingDown className="h-4 w-4" />
          <AlertDescription>
            <strong>🐜 Termite Mound Active:</strong> Auto-undercutting
            Quickmart by 2% on electronics category. Current advantage: KSH 64
            below nearest competitor. Revenue impact: +12% this week.
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bulk-import">📦 Bulk Import</TabsTrigger>
            <TabsTrigger value="alibaba-sync">🌏 Alibaba Sync</TabsTrigger>
            <TabsTrigger value="pricing">🐜 Pricing Algorithms</TabsTrigger>
            <TabsTrigger value="bilingual">🗣️ Bilingual Interface</TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Shipments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Active Shipments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bulkImports.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {shipment.shipmentId}
                          </h4>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            USD {shipment.totalValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shipment.products} products
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Location:</span>
                          <span className="font-medium">
                            {shipment.currentLocation}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>ETA:</span>
                          <span>{shipment.estimatedArrival}</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          {shipment.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Import Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Import Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        15.2
                      </div>
                      <div className="text-sm text-blue-500">
                        Avg Days to Deliver
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        94%
                      </div>
                      <div className="text-sm text-green-500">
                        On-Time Delivery
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        2.3%
                      </div>
                      <div className="text-sm text-purple-500">
                        Customs Delays
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        67%
                      </div>
                      <div className="text-sm text-orange-500">
                        Cost Savings vs Local
                      </div>
                    </div>
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>🐘 Elephant Memory:</strong> Based on 90-day
                      history, optimal import timing is 3rd week of each month
                      for electronics category.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alibaba-sync" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Alibaba Product Sync</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-3 mb-4">
                      <Button onClick={syncAlibabaProducts}>
                        <Upload className="h-4 w-4 mr-2" />
                        Sync New Products
                      </Button>
                      <Button variant="outline">
                        <Languages className="h-4 w-4 mr-2" />
                        Switch to 中文
                      </Button>
                    </div>

                    {alibabaProducts.map((product) => (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {product.chineseName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Supplier:
                            </span>
                            <div className="font-medium">
                              {product.supplier}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">MOQ:</span>
                            <div className="font-medium">
                              {product.moq} units
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Unit Price:
                            </span>
                            <div className="font-medium">
                              USD {product.unitPrice}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Total Cost:
                            </span>
                            <div className="font-medium">
                              USD {product.totalCost.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          <Button size="sm">Import Product</Button>
                          <Button size="sm" variant="outline">
                            Update Pricing
                          </Button>
                          <Button size="sm" variant="outline">
                            View on Alibaba
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Bilingual Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">
                      🇨🇳 Chinese Integration
                    </h5>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Direct supplier communication</li>
                      <li>• Product description translation</li>
                      <li>• WeChat Work integration</li>
                      <li>• Currency conversion (USD/KES)</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">
                      🇰🇪 Kiswahili Interface
                    </h5>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Product names in Kiswahili</li>
                      <li>• Local market terminology</li>
                      <li>• USSD integration support</li>
                      <li>• Cultural context adaptation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>🐜 Termite Mound Pricing Algorithms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {pricingStrategies.map((strategy) => (
                  <div key={strategy.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {getAlgorithmEmoji(strategy.algorithm)}
                        </span>
                        <div>
                          <h4 className="font-semibold capitalize">
                            {strategy.algorithm.replace("-", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {strategy.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={strategy.active ? "default" : "secondary"}
                      >
                        {strategy.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-sm text-blue-600">Naivas</div>
                        <div className="font-bold">
                          KSH {strategy.competitorData.naivas}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-sm text-green-600">Quickmart</div>
                        <div className="font-bold">
                          KSH {strategy.competitorData.quickmart}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="text-sm text-orange-600">Current</div>
                        <div className="font-bold">
                          KSH {strategy.currentPrice}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-sm text-purple-600">Suggested</div>
                        <div className="font-bold">
                          KSH {strategy.suggestedPrice}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => activateTermiteMoundPricing(strategy.id)}
                        disabled={strategy.active}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {strategy.active ? "Active" : "Activate"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bilingual" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">🗣️</div>
                <h3 className="text-xl font-bold mb-2">
                  Bilingual Commerce Interface
                </h3>
                <p className="text-muted-foreground">
                  Advanced Chinese-Kiswahili interface with WeChat integration,
                  supplier communication tools, and cultural context adaptation
                  for seamless cross-border commerce.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChinaSquare;
