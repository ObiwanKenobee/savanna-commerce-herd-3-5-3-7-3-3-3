import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Archive,
  Truck,
  Calculator,
  Bell,
  Filter,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  lastSold: string;
  movementVelocity: "fast" | "medium" | "slow" | "dead";
  status: "active" | "low_stock" | "out_of_stock" | "discontinued";
  expiryDate?: string;
  batchNumber?: string;
  notes?: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: "in" | "out" | "adjustment" | "transfer";
  quantity: number;
  reason: string;
  reference?: string;
  user: string;
  timestamp: string;
  fromLocation?: string;
  toLocation?: string;
  unitCost?: number;
}

interface InventoryAlert {
  id: string;
  type:
    | "low_stock"
    | "out_of_stock"
    | "overstocked"
    | "expiring"
    | "slow_moving";
  itemId: string;
  itemName: string;
  priority: "high" | "medium" | "low";
  message: string;
  created: string;
  acknowledged: boolean;
}

interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  fastMovingItems: number;
  slowMovingItems: number;
  averageTurnover: number;
  topPerformers: Array<{
    name: string;
    revenue: number;
    velocity: string;
  }>;
}

const InventoryItemCard = ({
  item,
  onEdit,
  onAdjustStock,
  onViewHistory,
}: {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onAdjustStock: (itemId: string, adjustment: number, reason: string) => void;
  onViewHistory: (itemId: string) => void;
}) => {
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showAdjustment, setShowAdjustment] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "discontinued":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case "fast":
        return "text-green-600";
      case "medium":
        return "text-blue-600";
      case "slow":
        return "text-yellow-600";
      case "dead":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getVelocityIcon = (velocity: string) => {
    switch (velocity) {
      case "fast":
        return <TrendingUp className="h-3 w-3" />;
      case "medium":
        return <BarChart3 className="h-3 w-3" />;
      case "slow":
        return <TrendingDown className="h-3 w-3" />;
      case "dead":
        return <XCircle className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  const stockPercentage = (item.currentStock / item.maximumStock) * 100;
  const isExpiringSoon =
    item.expiryDate &&
    new Date(item.expiryDate).getTime() - new Date().getTime() <
      30 * 24 * 60 * 60 * 1000;

  const handleStockAdjustment = () => {
    if (adjustmentQuantity !== 0 && adjustmentReason.trim()) {
      onAdjustStock(item.id, adjustmentQuantity, adjustmentReason);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      setShowAdjustment(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <Badge className={getStatusColor(item.status)}>
                {item.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>SKU: {item.sku}</span>
              <span>•</span>
              <span>{item.category}</span>
              <span>•</span>
              <div
                className={`flex items-center space-x-1 ${getVelocityColor(item.movementVelocity)}`}
              >
                {getVelocityIcon(item.movementVelocity)}
                <span>{item.movementVelocity}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewHistory(item.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stock Level */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Stock Level</span>
            <span className="text-sm text-gray-600">
              {item.currentStock} / {item.maximumStock} units
            </span>
          </div>
          <Progress
            value={stockPercentage}
            className={`h-2 ${
              stockPercentage < 20
                ? "text-red-500"
                : stockPercentage < 50
                  ? "text-yellow-500"
                  : "text-green-500"
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Reserved: {item.reservedStock}</span>
            <span>Available: {item.availableStock}</span>
          </div>
        </div>

        {/* Alerts */}
        {item.currentStock <= item.reorderPoint && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Stock is below reorder point ({item.reorderPoint} units). Consider
              reordering {item.reorderQuantity} units.
            </AlertDescription>
          </Alert>
        )}

        {isExpiringSoon && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Product expires on{" "}
              {new Date(item.expiryDate!).toLocaleDateString()}. Consider
              promoting or discounting.
            </AlertDescription>
          </Alert>
        )}

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Unit Cost:</span>
            <p className="font-medium">KES {item.unitCost.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Selling Price:</span>
            <p className="font-medium">
              KES {item.sellingPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Stock Value:</span>
            <p className="font-medium text-green-600">
              KES {(item.currentStock * item.unitCost).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Potential Revenue:</span>
            <p className="font-medium text-blue-600">
              KES {(item.availableStock * item.sellingPrice).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Supplier:</span>
            <span>{item.supplier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span>{item.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Restocked:</span>
            <span>{new Date(item.lastRestocked).toLocaleDateString()}</span>
          </div>
          {item.batchNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">Batch:</span>
              <span>{item.batchNumber}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdjustment(true)}
            className="flex-1"
          >
            <Calculator className="h-4 w-4 mr-1" />
            Adjust Stock
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => {
              /* Handle reorder */
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Reorder
          </Button>
        </div>

        {/* Stock Adjustment Dialog */}
        <Dialog open={showAdjustment} onOpenChange={setShowAdjustment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Stock: {item.currentStock} units</Label>
              </div>

              <div>
                <Label htmlFor="adjustment">Adjustment Quantity</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAdjustmentQuantity(adjustmentQuantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="adjustment"
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) =>
                      setAdjustmentQuantity(parseInt(e.target.value) || 0)
                    }
                    className="text-center w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAdjustmentQuantity(adjustmentQuantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  New stock level: {item.currentStock + adjustmentQuantity}{" "}
                  units
                </p>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Adjustment</Label>
                <Select
                  value={adjustmentReason}
                  onValueChange={setAdjustmentReason}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock_received">
                      Stock Received
                    </SelectItem>
                    <SelectItem value="stock_sold">Stock Sold</SelectItem>
                    <SelectItem value="damage">Damaged Goods</SelectItem>
                    <SelectItem value="expired">Expired Products</SelectItem>
                    <SelectItem value="theft">Theft/Loss</SelectItem>
                    <SelectItem value="recount">Physical Recount</SelectItem>
                    <SelectItem value="transfer">Stock Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAdjustment(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStockAdjustment}
                  disabled={adjustmentQuantity === 0 || !adjustmentReason}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Adjustment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const InventoryAlerts = ({
  alerts,
  onDismissAlert,
}: {
  alerts: InventoryAlert[];
  onDismissAlert: (alertId: string) => void;
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "out_of_stock":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "overstocked":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "expiring":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "slow_moving":
        return <TrendingDown className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-red-500" />
          <span>Inventory Alerts</span>
          <Badge className="bg-red-100 text-red-800">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
            <p className="text-sm">Your inventory is in good shape!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded p-3 ${getPriorityColor(alert.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium text-sm">{alert.itemName}</p>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.created).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        alert.priority === "high"
                          ? "border-red-300 text-red-700"
                          : alert.priority === "medium"
                            ? "border-yellow-300 text-yellow-700"
                            : "border-blue-300 text-blue-700"
                      }`}
                    >
                      {alert.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissAlert(alert.id)}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InventoryAnalyticsDashboard = ({
  analytics,
}: {
  analytics: InventoryAnalytics;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-green-600">
                KES {analytics.totalValue.toLocaleString()}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{analytics.totalItems}</p>
              <p className="text-xs text-gray-500">
                {analytics.lowStockItems} low stock, {analytics.outOfStockItems}{" "}
                out of stock
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fast Moving Items</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.fastMovingItems}
              </p>
              <p className="text-xs text-gray-500">
                {analytics.slowMovingItems} slow moving
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Turnover</p>
              <p className="text-2xl font-bold">
                {analytics.averageTurnover.toFixed(1)}x
              </p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const InventoryManager = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVelocity, setSelectedVelocity] = useState("all");
  const { user } = useAuth();

  // Mock data initialization
  useEffect(() => {
    const mockItems: InventoryItem[] = [
      {
        id: "inv_001",
        sku: "MF-50KG-001",
        name: "Premium Maize Flour 50kg",
        category: "Food & Beverages",
        currentStock: 45,
        reservedStock: 15,
        availableStock: 30,
        minimumStock: 20,
        maximumStock: 200,
        reorderPoint: 25,
        reorderQuantity: 100,
        unitCost: 3800,
        sellingPrice: 4200,
        supplier: "Unga Limited",
        location: "Warehouse A",
        lastRestocked: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastSold: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        movementVelocity: "fast",
        status: "low_stock",
        batchNumber: "UL-2024-001",
      },
      {
        id: "inv_002",
        sku: "CO-20L-002",
        name: "Cooking Oil 20L Premium",
        category: "Food & Beverages",
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        minimumStock: 10,
        maximumStock: 100,
        reorderPoint: 15,
        reorderQuantity: 50,
        unitCost: 5800,
        sellingPrice: 6500,
        supplier: "Bidco Africa",
        location: "Warehouse A",
        lastRestocked: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastSold: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        movementVelocity: "medium",
        status: "out_of_stock",
      },
      {
        id: "inv_003",
        sku: "SG-50KG-003",
        name: "Sugar 50kg Industrial Grade",
        category: "Food & Beverages",
        currentStock: 150,
        reservedStock: 20,
        availableStock: 130,
        minimumStock: 30,
        maximumStock: 200,
        reorderPoint: 40,
        reorderQuantity: 80,
        unitCost: 4200,
        sellingPrice: 4800,
        supplier: "Mumias Sugar",
        location: "Warehouse B",
        lastRestocked: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastSold: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        movementVelocity: "slow",
        status: "active",
        expiryDate: new Date(
          Date.now() + 20 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];

    const mockAlerts: InventoryAlert[] = [
      {
        id: "alert_001",
        type: "low_stock",
        itemId: "inv_001",
        itemName: "Premium Maize Flour 50kg",
        priority: "high",
        message: "Stock level (45 units) is below reorder point (25 units)",
        created: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
      {
        id: "alert_002",
        type: "out_of_stock",
        itemId: "inv_002",
        itemName: "Cooking Oil 20L Premium",
        priority: "high",
        message: "Product is completely out of stock",
        created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
      {
        id: "alert_003",
        type: "expiring",
        itemId: "inv_003",
        itemName: "Sugar 50kg Industrial Grade",
        priority: "medium",
        message: "Product expires in 20 days. Consider promotions.",
        created: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
      },
    ];

    const mockAnalytics: InventoryAnalytics = {
      totalValue: 2450000,
      totalItems: 3,
      lowStockItems: 1,
      outOfStockItems: 1,
      fastMovingItems: 1,
      slowMovingItems: 1,
      averageTurnover: 2.3,
      topPerformers: [
        { name: "Premium Maize Flour 50kg", revenue: 189000, velocity: "fast" },
        {
          name: "Cooking Oil 20L Premium",
          revenue: 130000,
          velocity: "medium",
        },
        {
          name: "Sugar 50kg Industrial Grade",
          revenue: 96000,
          velocity: "slow",
        },
      ],
    };

    setInventoryItems(mockItems);
    setAlerts(mockAlerts);
    setAnalytics(mockAnalytics);
  }, []);

  const handleEdit = (item: InventoryItem) => {
    console.log("Editing item:", item);
    toast({
      title: "Edit mode",
      description: `Editing ${item.name}`,
    });
  };

  const handleAdjustStock = (
    itemId: string,
    adjustment: number,
    reason: string,
  ) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.currentStock + adjustment);
          return {
            ...item,
            currentStock: newStock,
            availableStock: Math.max(0, newStock - item.reservedStock),
            status:
              newStock === 0
                ? "out_of_stock"
                : newStock <= item.reorderPoint
                  ? "low_stock"
                  : "active",
          };
        }
        return item;
      }),
    );

    toast({
      title: "Stock adjusted! 📦",
      description: `${adjustment > 0 ? "Added" : "Removed"} ${Math.abs(adjustment)} units. Reason: ${reason}`,
    });
  };

  const handleViewHistory = (itemId: string) => {
    console.log("Viewing history for item:", itemId);
    toast({
      title: "Stock History",
      description: "Opening stock movement history...",
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    toast({
      title: "Alert dismissed",
      description: "Alert has been acknowledged",
    });
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesVelocity =
      selectedVelocity === "all" || item.movementVelocity === selectedVelocity;

    return matchesSearch && matchesCategory && matchesStatus && matchesVelocity;
  });

  const categories = Array.from(
    new Set(inventoryItems.map((item) => item.category)),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Package className="h-8 w-8 text-green-600" />
            <span>Inventory Management</span>
          </h1>
          <p className="text-gray-600">
            Real-time inventory tracking and management
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && <InventoryAnalyticsDashboard analytics={analytics} />}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Alerts Sidebar */}
        <div className="lg:col-span-1">
          <InventoryAlerts
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
          />
        </div>

        {/* Main Inventory */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedVelocity}
                  onValueChange={setSelectedVelocity}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Velocity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Velocities</SelectItem>
                    <SelectItem value="fast">Fast Moving</SelectItem>
                    <SelectItem value="medium">Medium Moving</SelectItem>
                    <SelectItem value="slow">Slow Moving</SelectItem>
                    <SelectItem value="dead">Dead Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Items */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onAdjustStock={handleAdjustStock}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-20">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">
                  No inventory items match your current filters
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSelectedVelocity("all");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
