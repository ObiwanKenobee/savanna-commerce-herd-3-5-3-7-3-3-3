import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  DollarSign,
  Eye,
  Globe,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Truck,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  savannaCommandCenter,
  type AlertPriority,
  type AdminAlert,
} from "../../services/savannaCommandCenterService";
import { realTimeDashboard } from "../../services/realTimeDashboardService";

interface DashboardData {
  marketplacePulse: any;
  fraudMetrics: any;
  logisticsOps: any;
  financialControls: any;
  contentModeration: any;
  hyperlocalInventory: any;
  alerts: AdminAlert[];
  lastUpdated: Date;
}

export const SavannaCommandCenter: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isSwahili, setIsSwahili] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AdminAlert | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  // Load initial data and set up real-time updates
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await savannaCommandCenter.getDashboardOverview();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Set up real-time polling
    const subId = realTimeDashboard.startDashboardPolling(
      (data: DashboardData) => {
        setDashboardData(data);
      },
    );
    setSubscriptionId(subId);

    // Request notification permission
    realTimeDashboard.requestNotificationPermission();

    // Cleanup on unmount
    return () => {
      if (subId) {
        realTimeDashboard.stopDashboardPolling(subId);
      }
    };
  }, []);

  // Handle emergency actions
  const handleEmergencyPriceCap = useCallback(
    async (product: string, maxPrice: number) => {
      try {
        await savannaCommandCenter.executeEmergencyPriceCap(product, maxPrice);
        alert(
          `Emergency price cap activated for ${product}: Max ${maxPrice} KES`,
        );
      } catch (error) {
        console.error("Failed to activate price cap:", error);
      }
    },
    [],
  );

  const handleForceSync = useCallback(async () => {
    try {
      await savannaCommandCenter.forceInventorySync();
      alert("Inventory sync initiated");
    } catch (error) {
      console.error("Failed to force sync:", error);
    }
  }, []);

  const handleBlacklistSupplier = useCallback(
    async (supplierId: string, reason: string) => {
      try {
        await savannaCommandCenter.blacklistSupplier(supplierId, reason);
        alert(`Supplier ${supplierId} blacklisted`);
      } catch (error) {
        console.error("Failed to blacklist supplier:", error);
      }
    },
    [],
  );

  const resolveAlert = useCallback(
    async (alertId: string, action: string) => {
      try {
        await savannaCommandCenter.resolveAlert(alertId, action);
        setSelectedAlert(null);
        // Refresh data
        if (subscriptionId) {
          const data = await savannaCommandCenter.getDashboardOverview();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to resolve alert:", error);
      }
    },
    [subscriptionId],
  );

  const formatKES = (amount: number) => {
    return savannaCommandCenter.formatKES(amount, isSwahili ? "sw" : "en");
  };

  const getAlertIcon = (priority: AlertPriority) => {
    const icons = {
      lion: "🦁",
      elephant: "🐘",
      tortoise: "🐢",
    };
    return icons[priority];
  };

  const getAlertColor = (priority: AlertPriority) => {
    const colors = {
      lion: "destructive",
      elephant: "default",
      tortoise: "secondary",
    };
    return colors[priority];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🦁</div>
          <h2 className="text-2xl font-bold text-orange-900">
            {isSwahili
              ? "Inaregesha Kituo cha Utawala wa Savannah..."
              : "Loading Savannah Command Center..."}
          </h2>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>{isSwahili ? "Inapakia data..." : "Loading data..."}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isSwahili
              ? "Kuna hitilafu katika kupakia data ya dashboard"
              : "Failed to load dashboard data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-800 to-amber-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🦁</div>
            <div>
              <h1 className="text-2xl font-bold">
                {isSwahili
                  ? "Kituo cha Utawala wa Savannah"
                  : "Savannah Command Center"}
              </h1>
              <p className="text-orange-100">
                {isSwahili
                  ? "Mfumo wa Kusimamia Soko la Elektroniki"
                  : "Enterprise Marketplace Operations Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Emergency Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={emergencyMode}
                onCheckedChange={setEmergencyMode}
                id="emergency-mode"
              />
              <Label htmlFor="emergency-mode" className="text-sm">
                {isSwahili ? "Hali ya Dharura" : "Emergency Mode"}
              </Label>
            </div>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={isSwahili}
                onCheckedChange={setIsSwahili}
                id="language-toggle"
              />
              <Label htmlFor="language-toggle" className="text-sm">
                {isSwahili ? "Kiswahili" : "English"}
              </Label>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-orange-100">
              {isSwahili ? "Imesasishwa" : "Updated"}:{" "}
              {dashboardData.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Bar */}
      {dashboardData.alerts.length > 0 && (
        <div className="bg-red-600 text-white p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 animate-pulse" />
              <span className="font-medium">
                {dashboardData.alerts.length}{" "}
                {isSwahili ? "Tahadhari" : "Active Alerts"}
              </span>
            </div>
            <div className="flex space-x-2">
              {dashboardData.alerts.slice(0, 3).map((alert) => (
                <Badge key={alert.id} variant="secondary" className="text-xs">
                  {getAlertIcon(alert.priority)} {alert.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {isSwahili ? "Mapato ya Leo" : "Today's GMV"}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatKES(
                      dashboardData.marketplacePulse.gmvTicker.current,
                    )}
                  </p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />+
                    {dashboardData.marketplacePulse.gmvTicker.changePercent}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    {isSwahili ? "Tahadhari za Ulaghai" : "Fraud Alerts"}
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {dashboardData.fraudMetrics.priceGougingAlerts.length}
                  </p>
                  <p className="text-xs text-red-600">
                    {isSwahili ? "Zinahitaji ufuatiliaji" : "Require attention"}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {isSwahili ? "Usafirishaji Hai" : "Active Deliveries"}
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {dashboardData.logisticsOps.deliveryNetwork.bodaBodaActive +
                      dashboardData.logisticsOps.deliveryNetwork.trucksActive}
                  </p>
                  <p className="text-xs text-blue-600">
                    {Math.round(
                      dashboardData.logisticsOps.deliveryNetwork
                        .utilizationRate * 100,
                    )}
                    % {isSwahili ? "matumizi" : "utilization"}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    {isSwahili ? "Mwingiliano wa M-Pesa" : "M-Pesa Health"}
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.round(
                      dashboardData.financialControls.mpesaReconciliation
                        .recoveryRate * 100,
                    )}
                    %
                  </p>
                  <p className="text-xs text-purple-600">
                    {
                      dashboardData.financialControls.mpesaReconciliation
                        .avgRecoveryTime
                    }
                    min {isSwahili ? "kurejesha" : "recovery"}
                  </p>
                </div>
                <Phone className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Modules */}
        <Tabs defaultValue="pulse" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pulse">
              <Activity className="h-4 w-4 mr-2" />
              {isSwahili ? "Mapigo" : "Pulse"}
            </TabsTrigger>
            <TabsTrigger value="fraud">
              <Shield className="h-4 w-4 mr-2" />
              {isSwahili ? "Ulaghai" : "Fraud"}
            </TabsTrigger>
            <TabsTrigger value="logistics">
              <Truck className="h-4 w-4 mr-2" />
              {isSwahili ? "Usafirishaji" : "Logistics"}
            </TabsTrigger>
            <TabsTrigger value="finance">
              <DollarSign className="h-4 w-4 mr-2" />
              {isSwahili ? "Kifedha" : "Finance"}
            </TabsTrigger>
            <TabsTrigger value="content">
              <Eye className="h-4 w-4 mr-2" />
              {isSwahili ? "Maudhui" : "Content"}
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <BarChart3 className="h-4 w-4 mr-2" />
              {isSwahili ? "Hesabu" : "Inventory"}
            </TabsTrigger>
          </TabsList>

          {/* Real-Time Marketplace Pulse */}
          <TabsContent value="pulse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GMV Ticker */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>
                      {isSwahili
                        ? "Kipimo cha Mapato (KES)"
                        : "GMV Ticker (KES)"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-600">
                      {formatKES(
                        dashboardData.marketplacePulse.gmvTicker.current,
                      )}
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <Badge className="bg-green-100 text-green-800">
                        +
                        {formatKES(
                          dashboardData.marketplacePulse.gmvTicker.change24h,
                        )}{" "}
                        (24h)
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        +
                        {dashboardData.marketplacePulse.gmvTicker.changePercent}
                        %
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Activity Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>
                      {isSwahili
                        ? "Ramani ya Shughuli za Kimombo"
                        : "Live Activity Map"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.marketplacePulse.liveOrders
                      .slice(0, 5)
                      .map((order, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium">{order.county}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.orderCount}{" "}
                                {isSwahili ? "maagizo" : "orders"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatKES(order.value)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Drought Alerts */}
            {dashboardData.marketplacePulse.droughtAlerts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span>
                      {isSwahili ? "Tahadhari za Ukame" : "Drought Alerts"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.marketplacePulse.droughtAlerts.map(
                      (alert, index) => (
                        <Alert key={index} className="border-orange-300">
                          <AlertDescription className="flex items-center justify-between">
                            <span>
                              <strong>{alert.county}</strong> - {alert.severity}{" "}
                              {isSwahili ? "ukame" : "drought"}
                            </span>
                            <Badge variant="outline">
                              {alert.affectedSuppliers}{" "}
                              {isSwahili
                                ? "wauzaji wameathiriwa"
                                : "suppliers affected"}
                            </Badge>
                          </AlertDescription>
                        </Alert>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Fraud Detection Hub */}
          <TabsContent value="fraud" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SIM Card Violations */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    {isSwahili ? "Uvunjaji wa SIM Card" : "SIM Card Violations"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {dashboardData.fraudMetrics.simCardViolations.percentage.toFixed(
                          1,
                        )}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.fraudMetrics.simCardViolations.count} /{" "}
                        {dashboardData.fraudMetrics.simCardViolations.threshold}
                      </p>
                    </div>
                    <Progress
                      value={
                        dashboardData.fraudMetrics.simCardViolations.percentage
                      }
                      className="w-full"
                    />
                    {dashboardData.fraudMetrics.simCardViolations.percentage >
                      5 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {isSwahili
                            ? "Kiwango cha juu cha uvunjaji kimegundulika!"
                            : "High violation rate detected!"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Price Gouging */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-700">
                    {isSwahili
                      ? "Tahadhari za Bei za Juu"
                      : "Price Gouging Alerts"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.fraudMetrics.priceGougingAlerts.map(
                      (alert, index) => (
                        <div
                          key={index}
                          className="p-3 bg-orange-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{alert.product}</p>
                              <p className="text-sm text-muted-foreground">
                                {alert.supplier}
                              </p>
                            </div>
                            <Badge variant="destructive">
                              +{alert.deviation.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            {formatKES(alert.currentPrice)} vs{" "}
                            {formatKES(alert.medianPrice)} median
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ghost Stock */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700">
                    {isSwahili ? "Bidhaa za Uongo" : "Ghost Stock Listings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.fraudMetrics.ghostStockListings.map(
                      (ghost, index) => (
                        <div
                          key={index}
                          className="p-3 bg-purple-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                Product ID: {ghost.productId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {ghost.reportCount}{" "}
                                {isSwahili ? "ripoti" : "reports"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                ghost.status === "delisted"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {ghost.status}
                            </Badge>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">
                  {isSwahili
                    ? "Vitendo vya Haraka vya Dharura"
                    : "Emergency Quick Actions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleEmergencyPriceCap("Unga Pembe", 150)}
                    className="flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>
                      {isSwahili
                        ? "Kizuizi cha Bei cha Dharura"
                        : "Emergency Price Cap"}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleForceSync}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      {isSwahili
                        ? "Lazimisha Usawa wa Hesabu"
                        : "Force Inventory Sync"}
                    </span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleBlacklistSupplier("supp_123", "Fraud detected")
                    }
                    className="flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>
                      {isSwahili
                        ? "Orodha Nyeusi ya Muuzaji"
                        : "Blacklist Supplier"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would continue here with similar detailed implementations */}
          <TabsContent value="logistics" className="space-y-6">
            <div className="text-center py-8">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {isSwahili
                  ? "Kituo cha Usafirishaji kinakuja hivi karibuni..."
                  : "Logistics Operations Center coming soon..."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {isSwahili
                  ? "Udhibiti wa Kifedha unakuja hivi karibuni..."
                  : "Financial Controls coming soon..."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="text-center py-8">
              <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {isSwahili
                  ? "Usimamizi wa Maudhui unakuja hivi karibuni..."
                  : "Content Moderation coming soon..."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {isSwahili
                  ? "Hesabu za Mahali unakuja hivi karibuni..."
                  : "Hyperlocal Inventory coming soon..."}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alerts Panel */}
        {dashboardData.alerts.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <Bell className="h-5 w-5" />
                <span>
                  {isSwahili ? "Tahadhari za Kimombo" : "Active Alerts"}
                </span>
                <Badge variant="destructive">
                  {dashboardData.alerts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getAlertIcon(alert.priority)}
                          </span>
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getAlertColor(alert.priority) as any}>
                            {alert.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">
                  {getAlertIcon(selectedAlert.priority)}
                </span>
                <span>{selectedAlert.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{selectedAlert.message}</p>
              {selectedAlert.county && (
                <p className="text-sm text-muted-foreground">
                  {isSwahili ? "Jimbo" : "County"}: {selectedAlert.county}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                USSD: {selectedAlert.ussdFallback}
              </p>

              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    resolveAlert(selectedAlert.id, "Resolved by admin")
                  }
                  className="flex-1"
                >
                  {isSwahili ? "Tatua" : "Resolve"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1"
                >
                  {isSwahili ? "Funga" : "Close"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SavannaCommandCenter;
