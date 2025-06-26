import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  price: number;
  lastRestocked: string;
  supplier: string;
  status: "healthy" | "low" | "out" | "overstock";
  trend: "up" | "down" | "stable";
  emoji: string;
}

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const inventoryItems: InventoryItem[] = [
    {
      id: "1",
      name: "Maize Flour (Unga)",
      category: "staples",
      currentStock: 450,
      minThreshold: 100,
      maxCapacity: 1000,
      unit: "kg",
      price: 120,
      lastRestocked: "2025-01-14",
      supplier: "Unga Ltd",
      status: "healthy",
      trend: "up",
      emoji: "🌽",
    },
    {
      id: "2",
      name: "Sugar",
      category: "staples",
      currentStock: 25,
      minThreshold: 50,
      maxCapacity: 500,
      unit: "kg",
      price: 180,
      lastRestocked: "2025-01-10",
      supplier: "Mumias Sugar",
      status: "low",
      trend: "down",
      emoji: "🍯",
    },
    {
      id: "3",
      name: "Cooking Oil",
      category: "cooking",
      currentStock: 0,
      minThreshold: 20,
      maxCapacity: 200,
      unit: "liters",
      price: 320,
      lastRestocked: "2025-01-05",
      supplier: "Bidco",
      status: "out",
      trend: "down",
      emoji: "🛢️",
    },
    {
      id: "4",
      name: "Rice",
      category: "staples",
      currentStock: 850,
      minThreshold: 100,
      maxCapacity: 600,
      unit: "kg",
      price: 150,
      lastRestocked: "2025-01-12",
      supplier: "Mwea Rice",
      status: "overstock",
      trend: "stable",
      emoji: "🍚",
    },
    {
      id: "5",
      name: "Tea Leaves",
      category: "beverages",
      currentStock: 80,
      minThreshold: 30,
      maxCapacity: 150,
      unit: "kg",
      price: 450,
      lastRestocked: "2025-01-13",
      supplier: "Kenya Tea",
      status: "healthy",
      trend: "up",
      emoji: "🍃",
    },
  ];

  const categories = [
    { id: "all", name: "All Categories", emoji: "📦" },
    { id: "staples", name: "Staples", emoji: "🌾" },
    { id: "cooking", name: "Cooking", emoji: "🥘" },
    { id: "beverages", name: "Beverages", emoji: "☕" },
    { id: "household", name: "Household", emoji: "🏠" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "out":
        return "bg-red-100 text-red-800";
      case "overstock":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockLevel = (item: InventoryItem) => {
    return (item.currentStock / item.maxCapacity) * 100;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalItems: inventoryItems.length,
    lowStock: inventoryItems.filter(
      (item) => item.status === "low" || item.status === "out",
    ).length,
    healthy: inventoryItems.filter((item) => item.status === "healthy").length,
    totalValue: inventoryItems.reduce(
      (sum, item) => sum + item.currentStock * item.price,
      0,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🌳 Baobab Stock
                </h1>
                <p className="text-gray-600">
                  Visual inventory tracker with AI alerts
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Items
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalItems}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Needs Attention
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.lowStock}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Healthy Stock
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.healthy}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Value
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        KES {stats.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="🔍 Search inventory... (e.g., unga, sugar, oil)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* AI Alerts */}
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🐘</span>
                <div className="flex-1">
                  <div className="font-semibold text-orange-800 mb-2">
                    🧠 Elephant Memory AI Alerts
                  </div>
                  <div className="space-y-2 text-sm text-orange-700">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        <strong>Order maize now</strong> — 3 shops nearby ran
                        out yesterday
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        <strong>Sugar demand peak</strong> — Expected 40%
                        increase next week
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>
                        <strong>Cooking oil shipment</strong> — Arriving
                        tomorrow from Bidco
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-gray-600">{item.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(item.trend)}
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Stock Level Visual */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Stock Level</span>
                        <span>
                          {item.currentStock} {item.unit}
                        </span>
                      </div>

                      <div className="relative">
                        <Progress
                          value={getStockLevel(item)}
                          className="h-6 bg-gray-200"
                        />

                        {/* Tree visualization overlay */}
                        <div className="absolute top-0 left-0 w-full h-6 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {getStockLevel(item) > 75
                              ? "🌲"
                              : getStockLevel(item) > 50
                                ? "🌳"
                                : getStockLevel(item) > 25
                                  ? "🌿"
                                  : "🥀"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: {item.minThreshold}</span>
                        <span>Max: {item.maxCapacity}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price/unit:</span>
                        <div className="font-semibold">KES {item.price}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last restocked:</span>
                        <div className="font-semibold">
                          {new Date(item.lastRestocked).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Package className="h-4 w-4 mr-1" />
                        Reorder
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Forecast
                      </Button>
                    </div>

                    {/* Auto-restock suggestion */}
                    {item.status === "low" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                        <div className="font-medium text-yellow-800 mb-1">
                          🤖 Auto-Restock Suggestion
                        </div>
                        <div className="text-yellow-700">
                          Order {item.maxCapacity - item.currentStock}{" "}
                          {item.unit} to reach optimal level
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <span className="text-6xl mb-4 block">📦</span>
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button>Add Your First Item</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default InventoryPage;
