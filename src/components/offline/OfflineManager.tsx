import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  WifiOff,
  Download,
  Upload,
  Smartphone,
  Signal,
  Battery,
  Save,
  Sync,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Zap,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface OfflineAction {
  id: string;
  type: "order" | "product_update" | "message" | "review" | "inventory";
  data: any;
  timestamp: string;
  status: "pending" | "syncing" | "synced" | "failed";
  retryCount: number;
  lastError?: string;
}

interface CacheStats {
  products: number;
  orders: number;
  messages: number;
  images: number;
  totalSize: string;
}

interface ConnectivityInfo {
  online: boolean;
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  downlink: number;
  rtt: number;
  saveData: boolean;
}

const ConnectivityStatus = ({
  connectivity,
}: {
  connectivity: ConnectivityInfo;
}) => {
  const getSignalColor = () => {
    if (!connectivity.online) return "text-red-500";
    if (
      connectivity.effectiveType === "4g" ||
      connectivity.effectiveType === "3g"
    )
      return "text-green-500";
    return "text-yellow-500";
  };

  const getSignalStrength = () => {
    if (!connectivity.online) return 0;
    if (connectivity.effectiveType === "4g") return 4;
    if (connectivity.effectiveType === "3g") return 3;
    if (connectivity.effectiveType === "2g") return 2;
    return 1;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          {connectivity.online ? (
            <Wifi className={`h-5 w-5 ${getSignalColor()}`} />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <span>Connection Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge
            className={
              connectivity.online
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {connectivity.online ? "Online" : "Offline"}
          </Badge>
        </div>

        {connectivity.online && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network:</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">
                  {connectivity.effectiveType.toUpperCase()}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 h-3 rounded ${
                        bar <= getSignalStrength()
                          ? getSignalColor() + " bg-current"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Speed:</span>
              <span className="text-sm">{connectivity.downlink} Mbps</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Latency:</span>
              <span className="text-sm">{connectivity.rtt}ms</span>
            </div>

            {connectivity.saveData && (
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Data Saver mode is enabled. Some features may be limited to
                  reduce data usage.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {!connectivity.online && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're offline. Don't worry - you can still browse cached content
              and any actions will sync when you're back online.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const OfflineQueue = ({
  actions,
  onSyncAction,
  onClearQueue,
}: {
  actions: OfflineAction[];
  onSyncAction: (actionId: string) => void;
  onClearQueue: () => void;
}) => {
  const pendingActions = actions.filter((a) => a.status === "pending");
  const failedActions = actions.filter((a) => a.status === "failed");

  const getActionIcon = (type: string) => {
    switch (type) {
      case "order":
        return "📦";
      case "product_update":
        return "📝";
      case "message":
        return "💬";
      case "review":
        return "⭐";
      case "inventory":
        return "📊";
      default:
        return "📄";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "syncing":
        return "bg-blue-100 text-blue-800";
      case "synced":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Sync Queue</span>
            {pendingActions.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                {pendingActions.length} pending
              </Badge>
            )}
          </CardTitle>
          {actions.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearQueue}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>All synced! No pending actions.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getActionIcon(action.type)}</span>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {action.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(action.timestamp).toLocaleString()}
                    </p>
                    {action.lastError && (
                      <p className="text-xs text-red-600">
                        Error: {action.lastError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(action.status)}>
                    {action.status}
                  </Badge>
                  {action.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSyncAction(action.id)}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {failedActions.length > 0 && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {failedActions.length} actions failed to sync. Check your
              connection and try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const CacheManager = ({
  stats,
  onClearCache,
  onPreloadContent,
}: {
  stats: CacheStats;
  onClearCache: (type?: string) => void;
  onPreloadContent: () => void;
}) => {
  const [isPreloading, setIsPreloading] = useState(false);

  const handlePreload = async () => {
    setIsPreloading(true);
    try {
      await onPreloadContent();
      toast({
        title: "Content preloaded! 📱",
        description: "Essential content is now available offline",
      });
    } catch (error) {
      toast({
        title: "Preload failed",
        description: "Could not preload content. Check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsPreloading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <HardDrive className="h-5 w-5" />
          <span>Offline Storage</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Products cached:</span>
            <span className="font-medium">
              {stats.products.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Orders cached:</span>
            <span className="font-medium">{stats.orders.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Messages cached:</span>
            <span className="font-medium">
              {stats.messages.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Images cached:</span>
            <span className="font-medium">{stats.images.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-sm font-medium">Total storage:</span>
            <span className="font-bold">{stats.totalSize}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handlePreload}
            disabled={isPreloading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isPreloading ? (
              <>
                <Sync className="h-4 w-4 mr-2 animate-spin" />
                Preloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Preload for Offline
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClearCache("images")}
            >
              Clear Images
            </Button>
            <Button variant="outline" size="sm" onClick={() => onClearCache()}>
              Clear All
            </Button>
          </div>
        </div>

        <Alert>
          <Battery className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Offline content helps save data and battery. Essential features work
            even without internet.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export const OfflineManager = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityInfo>({
    online: navigator.onLine,
    effectiveType: "4g",
    downlink: 10,
    rtt: 50,
    saveData: false,
  });

  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    products: 0,
    orders: 0,
    messages: 0,
    images: 0,
    totalSize: "0 MB",
  });

  // Monitor connectivity
  useEffect(() => {
    const updateConnectivity = () => {
      // Simulate network info - in production, use Network Information API
      setConnectivity((prev) => ({
        ...prev,
        online: navigator.onLine,
        effectiveType: navigator.onLine ? "4g" : "slow-2g",
        downlink: navigator.onLine ? Math.random() * 20 + 5 : 0,
        rtt: navigator.onLine ? Math.random() * 100 + 20 : 1000,
      }));
    };

    window.addEventListener("online", updateConnectivity);
    window.addEventListener("offline", updateConnectivity);

    // Check for save-data preference
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      setConnectivity((prev) => ({
        ...prev,
        saveData: connection.saveData || false,
      }));
    }

    return () => {
      window.removeEventListener("online", updateConnectivity);
      window.removeEventListener("offline", updateConnectivity);
    };
  }, []);

  // Load cache stats
  useEffect(() => {
    const loadCacheStats = async () => {
      try {
        // Simulate loading cache stats
        const mockStats: CacheStats = {
          products: 156,
          orders: 23,
          messages: 45,
          images: 89,
          totalSize: "12.3 MB",
        };
        setCacheStats(mockStats);
      } catch (error) {
        console.error("Failed to load cache stats:", error);
      }
    };

    loadCacheStats();
  }, []);

  // Sync offline actions when online
  useEffect(() => {
    if (
      connectivity.online &&
      offlineActions.some((a) => a.status === "pending")
    ) {
      syncPendingActions();
    }
  }, [connectivity.online]);

  const syncPendingActions = async () => {
    const pendingActions = offlineActions.filter((a) => a.status === "pending");

    for (const action of pendingActions) {
      try {
        setOfflineActions((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, status: "syncing" } : a,
          ),
        );

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOfflineActions((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, status: "synced" } : a,
          ),
        );

        toast({
          title: "Synced successfully! ✅",
          description: `${action.type.replace("_", " ")} has been synced`,
        });
      } catch (error) {
        setOfflineActions((prev) =>
          prev.map((a) =>
            a.id === action.id
              ? {
                  ...a,
                  status: "failed",
                  retryCount: a.retryCount + 1,
                  lastError:
                    error instanceof Error ? error.message : "Sync failed",
                }
              : a,
          ),
        );
      }
    }
  };

  const handleSyncAction = async (actionId: string) => {
    const action = offlineActions.find((a) => a.id === actionId);
    if (!action) return;

    try {
      setOfflineActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, status: "syncing" } : a)),
      );

      // Simulate retry
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOfflineActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, status: "synced" } : a)),
      );

      toast({
        title: "Sync successful! ✅",
        description: "Action synced successfully",
      });
    } catch (error) {
      setOfflineActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                status: "failed",
                retryCount: a.retryCount + 1,
                lastError: "Retry failed",
              }
            : a,
        ),
      );
    }
  };

  const handleClearQueue = () => {
    setOfflineActions((prev) => prev.filter((a) => a.status === "pending"));
    toast({
      title: "Queue cleared",
      description: "Pending actions have been cleared",
    });
  };

  const handleClearCache = async (type?: string) => {
    try {
      if (type) {
        // Clear specific cache type
        setCacheStats((prev) => ({ ...prev, [type]: 0 }));
        toast({
          title: `${type} cache cleared`,
          description: "Cache has been cleared successfully",
        });
      } else {
        // Clear all cache
        setCacheStats({
          products: 0,
          orders: 0,
          messages: 0,
          images: 0,
          totalSize: "0 MB",
        });
        toast({
          title: "All cache cleared",
          description: "All offline content has been cleared",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to clear cache",
        description: "Could not clear cache",
        variant: "destructive",
      });
    }
  };

  const handlePreloadContent = async () => {
    // Simulate preloading essential content
    const essentialContent = [
      "Popular products",
      "Your recent orders",
      "Important messages",
      "Account settings",
    ];

    let loaded = 0;
    for (const content of essentialContent) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      loaded++;

      // Update progress (you could show a progress bar here)
      console.log(
        `Preloaded: ${content} (${loaded}/${essentialContent.length})`,
      );
    }

    // Update cache stats
    setCacheStats({
      products: 156,
      orders: 23,
      messages: 45,
      images: 89,
      totalSize: "15.7 MB",
    });
  };

  // Add offline action (called from other components)
  const addOfflineAction = (type: string, data: any) => {
    const action: OfflineAction = {
      id: `action_${Date.now()}`,
      type: type as any,
      data,
      timestamp: new Date().toISOString(),
      status: "pending",
      retryCount: 0,
    };

    setOfflineActions((prev) => [action, ...prev]);

    toast({
      title: "Action queued for sync 📱",
      description: `${type.replace("_", " ")} will sync when you're online`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-green-600" />
            <span>Offline Mode</span>
          </h2>
          <p className="text-gray-600">
            Manage your offline experience and data sync
          </p>
        </div>

        {connectivity.online && (
          <Button
            onClick={syncPendingActions}
            className="bg-green-600 hover:bg-green-700"
          >
            <Sync className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <ConnectivityStatus connectivity={connectivity} />
        <OfflineQueue
          actions={offlineActions}
          onSyncAction={handleSyncAction}
          onClearQueue={handleClearQueue}
        />
        <CacheManager
          stats={cacheStats}
          onClearCache={handleClearCache}
          onPreloadContent={handlePreloadContent}
        />
      </div>

      {/* Offline Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>What Works Offline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">
                ✅ Available Offline:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Browse cached products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>View order history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Read messages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Create orders (sync later)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Write reviews (sync later)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Update inventory (sync later)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-amber-600 mb-3">
                ⏳ Requires Connection:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Real-time delivery tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Live chat messages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Payment processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>New product discovery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Account verification</span>
                </li>
              </ul>
            </div>
          </div>

          <Alert className="mt-6">
            <Signal className="h-4 w-4" />
            <AlertDescription>
              <strong>Smart Data Usage:</strong> The app automatically adjusts
              quality and features based on your connection speed to save data
              and battery.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineManager;

// Export the addOfflineAction function for use in other components
export const useOfflineManager = () => {
  // This would typically use a context or global state
  const addOfflineAction = (type: string, data: any) => {
    // Store in localStorage or IndexedDB
    const actions = JSON.parse(localStorage.getItem("offlineActions") || "[]");
    const newAction = {
      id: `action_${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      status: "pending",
      retryCount: 0,
    };

    actions.push(newAction);
    localStorage.setItem("offlineActions", JSON.stringify(actions));

    return newAction;
  };

  return { addOfflineAction };
};
