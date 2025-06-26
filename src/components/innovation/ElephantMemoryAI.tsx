import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  innovationService,
  ElephantMemoryAI as ElephantMemoryData,
  ProductPattern,
  AutoOrder,
} from "@/services/innovationService";
import {
  Brain,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Settings,
  Square,
  Play,
  BarChart3,
  Target,
  Smartphone,
  MessageSquare,
  Bell,
  Star,
  Activity,
} from "lucide-react";

interface ElephantMemoryAIProps {
  className?: string;
}

export const ElephantMemoryAI = ({ className }: ElephantMemoryAIProps) => {
  const { toast } = useToast();
  const [memoryData, setMemoryData] = useState<ElephantMemoryData | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [learningProgress, setLearningProgress] = useState(0);
  const [predictedOrders, setPredictedOrders] = useState<AutoOrder[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stockAlerts, setStockAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadElephantMemoryData();
    simulateLearningProgress();
  }, []);

  const loadElephantMemoryData = () => {
    // Mock Elephant Memory AI data
    const mockMemoryData: ElephantMemoryData = {
      user_id: "current_user",
      product_patterns: [
        {
          product_id: "unga_pembe_2kg",
          avg_weekly_sales: 10,
          seasonal_multiplier: 1.2,
          reorder_threshold: 2,
          predicted_next_order: "2024-01-23T08:00:00Z",
        },
        {
          product_id: "sukari_mumias_1kg",
          avg_weekly_sales: 8,
          seasonal_multiplier: 1.0,
          reorder_threshold: 2,
          predicted_next_order: "2024-01-24T08:00:00Z",
        },
        {
          product_id: "mafuta_cooking_oil",
          avg_weekly_sales: 5,
          seasonal_multiplier: 0.9,
          reorder_threshold: 1,
          predicted_next_order: "2024-01-25T08:00:00Z",
        },
        {
          product_id: "rice_pishori_2kg",
          avg_weekly_sales: 6,
          seasonal_multiplier: 1.1,
          reorder_threshold: 1,
          predicted_next_order: "2024-01-26T08:00:00Z",
        },
      ],
      auto_orders: [
        {
          id: "auto_order_1",
          product_id: "unga_pembe_2kg",
          scheduled_date: "2024-01-23T08:00:00Z",
          quantity: 10,
          confidence: 0.92,
          status: "scheduled",
        },
        {
          id: "auto_order_2",
          product_id: "sukari_mumias_1kg",
          scheduled_date: "2024-01-24T08:00:00Z",
          quantity: 8,
          confidence: 0.88,
          status: "scheduled",
        },
      ],
      learning_confidence: 0.85,
      opt_out_products: ["expensive_item_1"],
    };

    setMemoryData(mockMemoryData);
    setPredictedOrders(mockMemoryData.auto_orders);

    // Mock recent orders for learning
    setRecentOrders([
      {
        product: "Unga wa Pembe 2kg",
        quantity: 10,
        date: "2024-01-16",
        pattern_match: 95,
      },
      {
        product: "Sukari Mumias 1kg",
        quantity: 8,
        date: "2024-01-17",
        pattern_match: 92,
      },
      {
        product: "Mafuta Cooking Oil",
        quantity: 5,
        date: "2024-01-18",
        pattern_match: 88,
      },
    ]);

    // Mock stock alerts
    setStockAlerts([
      {
        product: "Unga wa Pembe 2kg",
        current_stock: 2,
        threshold: 2,
        urgency: "high",
      },
      {
        product: "Rice Pishori 2kg",
        current_stock: 1,
        threshold: 1,
        urgency: "medium",
      },
    ]);
  };

  const simulateLearningProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setLearningProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: "🧠 Learning Complete",
          description: "Elephant Memory AI has updated purchase patterns",
        });
      }
    }, 100);
  };

  const toggleAI = (enabled: boolean) => {
    setAiEnabled(enabled);
    toast({
      title: enabled
        ? "🐘 Elephant Memory Activated"
        : "⏸️ Elephant Memory Paused",
      description: enabled
        ? "AI will now monitor and predict your restocking needs"
        : "Automatic predictions have been paused",
    });
  };

  const executeAutoOrder = async (orderId: string) => {
    const order = predictedOrders.find((o) => o.id === orderId);
    if (!order) return;

    try {
      // Update order status
      const updatedOrders = predictedOrders.map((o) =>
        o.id === orderId ? { ...o, status: "executed" as const } : o,
      );
      setPredictedOrders(updatedOrders);

      toast({
        title: "📦 Auto-Order Executed",
        description: `Ordered ${order.quantity} units via Elephant Memory AI`,
      });
    } catch (error) {
      toast({
        title: "❌ Order Failed",
        description: "Failed to execute auto-order. Please try manually.",
        variant: "destructive",
      });
    }
  };

  const cancelAutoOrder = (orderId: string) => {
    const updatedOrders = predictedOrders.map((o) =>
      o.id === orderId ? { ...o, status: "cancelled" as const } : o,
    );
    setPredictedOrders(updatedOrders);

    toast({
      title: "🚫 Auto-Order Cancelled",
      description: "You can always re-enable predictions for this product",
    });
  };

  const optOutProduct = (productId: string) => {
    if (memoryData) {
      const updatedMemory = {
        ...memoryData,
        opt_out_products: [...memoryData.opt_out_products, productId],
      };
      setMemoryData(updatedMemory);

      toast({
        title: "📤 Product Opted Out",
        description: "AI will no longer predict orders for this product",
      });
    }
  };

  const getProductName = (productId: string) => {
    const productNames: Record<string, string> = {
      unga_pembe_2kg: "Unga wa Pembe 2kg",
      sukari_mumias_1kg: "Sukari Mumias 1kg",
      mafuta_cooking_oil: "Mafuta Cooking Oil",
      rice_pishori_2kg: "Rice Pishori 2kg",
    };
    return productNames[productId] || productId;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.75) return "text-yellow-600";
    return "text-red-600";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Elephant Memory AI Header */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-purple-700">
          <Brain className="w-8 h-8" />
          <span>Elephant Memory AI</span>
          <Package className="w-8 h-8" />
        </div>
        <p className="text-purple-600 max-w-2xl mx-auto">
          Just like elephants never forget, our AI remembers your shop's rhythms
          and automatically reorders before you run out. Set it and forget it!
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-purple-600">
          <div className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>Pattern Learning</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span>SMS Opt-out: "STOP SUGAR"</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Prevents Stockouts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Control Panel */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Settings className="w-5 h-5" />
              <span>AI Control</span>
              <Badge
                className={
                  aiEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {aiEnabled ? "Active" : "Paused"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI Toggle */}
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <div className="font-medium">Elephant Memory AI</div>
                <div className="text-sm text-gray-600">
                  Automatic pattern learning
                </div>
              </div>
              <Switch checked={aiEnabled} onCheckedChange={toggleAI} />
            </div>

            {/* Learning Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">
                  Learning Progress:
                </span>
                <span className="text-sm font-medium">{learningProgress}%</span>
              </div>
              <Progress value={learningProgress} className="h-2" />
              {learningProgress < 100 && (
                <div className="text-xs text-purple-600 flex items-center">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Analyzing purchase patterns...
                </div>
              )}
            </div>

            {/* AI Confidence */}
            {memoryData && (
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600 mb-1">
                  AI Confidence Level
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {(memoryData.learning_confidence * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">
                  Based on {memoryData.product_patterns.length} product patterns
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-green-600">
                  {predictedOrders.length}
                </div>
                <div className="text-xs text-gray-600">Predicted Orders</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-blue-600">
                  {stockAlerts.length}
                </div>
                <div className="text-xs text-gray-600">Stock Alerts</div>
              </div>
            </div>

            {/* SMS Control Info */}
            <Alert className="border-blue-300 bg-blue-50">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <div className="font-medium mb-1">SMS Control:</div>
                <div>Send "STOP SUGAR" to pause sugar predictions</div>
                <div>Send "START SUGAR" to resume</div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Predicted Auto-Orders */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Calendar className="w-5 h-5" />
              <span>Predicted Orders</span>
              <Badge className="bg-green-100 text-green-700">
                {predictedOrders.filter((o) => o.status === "scheduled").length}{" "}
                Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictedOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI is learning your patterns...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictedOrders.map((order) => (
                  <div key={order.id} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">
                          {getProductName(order.product_id)}
                        </h4>
                        <div className="text-xs text-gray-600">
                          Quantity: {order.quantity} units
                        </div>
                      </div>
                      <Badge
                        className={
                          order.status === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "executed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled:</span>
                        <span className="font-medium">
                          {new Date(order.scheduled_date).toLocaleDateString()}{" "}
                          at 8:00 AM
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Confidence:</span>
                        <span
                          className={`font-medium ${getConfidenceColor(order.confidence)}`}
                        >
                          {(order.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {order.status === "scheduled" && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => executeAutoOrder(order.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Execute Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelAutoOrder(order.id)}
                          className="flex-1"
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {order.status === "executed" && (
                      <div className="mt-2 text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Order placed successfully
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Patterns & Alerts */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <BarChart3 className="w-5 h-5" />
              <span>Learning Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stock Alerts */}
            <div>
              <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Stock Alerts
              </h4>
              <div className="space-y-2">
                {stockAlerts.map((alert, index) => (
                  <Alert key={index} className={getUrgencyColor(alert.urgency)}>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <div className="text-sm">
                        <div className="font-medium">{alert.product}</div>
                        <div>
                          Stock: {alert.current_stock} units (threshold:{" "}
                          {alert.threshold})
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            {/* Product Patterns */}
            {memoryData && (
              <div>
                <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Learned Patterns
                </h4>
                <div className="space-y-2">
                  {memoryData.product_patterns.map((pattern, index) => (
                    <div
                      key={pattern.product_id}
                      className="bg-white p-3 rounded border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium">
                          {getProductName(pattern.product_id)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => optOutProduct(pattern.product_id)}
                          className="text-xs h-6 px-2"
                        >
                          Opt Out
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span>Weekly Sales:</span>
                          <div className="font-medium">
                            {pattern.avg_weekly_sales} units
                          </div>
                        </div>
                        <div>
                          <span>Reorder Point:</span>
                          <div className="font-medium">
                            {pattern.reorder_threshold} units
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs">
                        <span className="text-gray-600">
                          Next Predicted Order:
                        </span>
                        <div className="font-medium text-purple-600">
                          {new Date(
                            pattern.predicted_next_order,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Learning Examples */}
            <div>
              <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Recent Learning
              </h4>
              <div className="space-y-2">
                {recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{order.product}</div>
                        <div className="text-gray-600">
                          {order.quantity} units on {order.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-green-600 font-medium">
                          {order.pattern_match}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elephant Memory Innovation Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-purple-700">
            Elephant Memory Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-purple-700">Stockout Prevention</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3x</div>
              <div className="text-sm text-green-700">Faster Reordering</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-blue-700">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">40%</div>
              <div className="text-sm text-orange-700">Time Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kenya Context Alert */}
      <Alert className="border-purple-300 bg-purple-50">
        <Brain className="w-4 h-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <div className="space-y-2">
            <div className="font-medium">
              Why Elephant Memory Works for Kenya:
            </div>
            <div className="text-sm space-y-1">
              <div>
                • Alleviates "stockout anxiety" common among mama mbogas
              </div>
              <div>• Works with simple SMS commands for low-tech users</div>
              <div>
                • Learns seasonal patterns like Ramadan increased demand
              </div>
              <div>• Reduces time spent on inventory management by 40%</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ElephantMemoryAI;
