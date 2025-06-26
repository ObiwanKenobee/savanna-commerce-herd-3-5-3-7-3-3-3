import AdminNavigation from "@/components/admin/AdminNavigation";
import InfrastructureDashboard from "@/components/infrastructure/InfrastructureDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  AlertTriangle,
  Activity,
  Network,
  Database,
  Shield,
  Zap,
  Globe,
  Phone,
  Wifi,
  Server,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

const AdminInfrastructurePage = () => {
  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "M-Pesa Timeout Rate Elevated",
      message:
        "M-Pesa callback timeout rate in Western region is at 8.5% (threshold: 10%)",
      timestamp: "2 minutes ago",
      county: "western",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      title: "USSD Performance Optimized",
      message:
        "Successfully reduced USSD session duration by 23% in rural areas",
      timestamp: "15 minutes ago",
      county: "nyanza",
      severity: "low",
    },
    {
      id: 3,
      type: "error",
      title: "Service Mesh Circuit Breaker Triggered",
      message:
        "Payment service circuit breaker opened due to high failure rate",
      timestamp: "1 hour ago",
      county: "nairobi",
      severity: "high",
    },
  ];

  const quickActions = [
    {
      title: "Restart Payment Gateway",
      description: "Restart M-Pesa callback processing",
      icon: RefreshCw,
      action: "restart_payment_gateway",
      severity: "high",
    },
    {
      title: "Scale Event Streaming",
      description: "Add partition capacity for high traffic",
      icon: BarChart3,
      action: "scale_streaming",
      severity: "medium",
    },
    {
      title: "Export System Logs",
      description: "Download Swahili logs for analysis",
      icon: Download,
      action: "export_logs",
      severity: "low",
    },
    {
      title: "Deploy Health Checks",
      description: "Update service mesh health monitoring",
      icon: Upload,
      action: "deploy_health_checks",
      severity: "medium",
    },
  ];

  const infrastructureMetrics = [
    {
      category: "API Gateway",
      metrics: [
        {
          name: "M-Pesa Callback Success Rate",
          value: "99.2%",
          status: "healthy",
        },
        { name: "USSD Compression Ratio", value: "78%", status: "optimal" },
        { name: "County Response Times", value: "89ms avg", status: "healthy" },
        { name: "Request Throughput", value: "45K/sec", status: "healthy" },
      ],
    },
    {
      category: "Service Mesh",
      metrics: [
        { name: "Active Services", value: "127", status: "healthy" },
        { name: "Circuit Breakers Closed", value: "98%", status: "healthy" },
        { name: "3G Connection Retries", value: "12%", status: "optimal" },
        { name: "Service Discovery Health", value: "100%", status: "healthy" },
      ],
    },
    {
      category: "Event Streaming",
      metrics: [
        { name: "Events Processed", value: "2.3M/min", status: "healthy" },
        { name: "Partition Utilization", value: "67%", status: "optimal" },
        { name: "Dead Letter Queue", value: "23 events", status: "attention" },
        { name: "Consumer Lag", value: "< 1s", status: "healthy" },
      ],
    },
    {
      category: "Observability",
      metrics: [
        { name: "Log Ingestion Rate", value: "150K/min", status: "healthy" },
        { name: "Alert Rules Active", value: "47", status: "healthy" },
        { name: "Trace Completion", value: "99.7%", status: "healthy" },
        { name: "Metric Retention", value: "30 days", status: "healthy" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-500";
      case "optimal":
        return "bg-blue-500";
      case "attention":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📝";
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`🔧 Executing quick action: ${action}`);
    // In a real implementation, this would trigger actual infrastructure operations
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            🌍 Infrastructure Plumbing Control Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage enterprise platform infrastructure for Kenya's
            Digital Savannah
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">🏞️ Live Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">🚨 System Alerts</TabsTrigger>
            <TabsTrigger value="metrics">📊 Metrics</TabsTrigger>
            <TabsTrigger value="actions">⚙️ Quick Actions</TabsTrigger>
            <TabsTrigger value="configuration">🔧 Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <InfrastructureDashboard />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Warning Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <p className="text-xs text-muted-foreground">
                    Monitor closely
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Info Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <p className="text-xs text-muted-foreground">
                    System updates
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall healthy
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚨 Active System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      className={`border-l-4 ${
                        alert.type === "error"
                          ? "border-l-red-500"
                          : alert.type === "warning"
                            ? "border-l-yellow-500"
                            : "border-l-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">
                              {getAlertIcon(alert.type)}
                            </span>
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge variant="outline" className="capitalize">
                              {alert.county}
                            </Badge>
                            <Badge
                              className={`${
                                alert.severity === "high"
                                  ? "bg-red-500"
                                  : alert.severity === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <AlertDescription>{alert.message}</AlertDescription>
                          <p className="text-xs text-muted-foreground mt-2">
                            {alert.timestamp}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                          <Button size="sm">Resolve</Button>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* County-specific Alert Trends */}
            <Card>
              <CardHeader>
                <CardTitle>🗺️ Alert Trends by County</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">🏙️ Nairobi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Critical</span>
                          <Badge className="bg-red-500">1</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Warning</span>
                          <Badge className="bg-yellow-500">0</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Info</span>
                          <Badge className="bg-blue-500">2</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        🌾 Western Region
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Critical</span>
                          <Badge className="bg-red-500">0</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Warning</span>
                          <Badge className="bg-yellow-500">2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Info</span>
                          <Badge className="bg-blue-500">1</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        🏖️ Coastal Region
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Critical</span>
                          <Badge className="bg-red-500">0</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Warning</span>
                          <Badge className="bg-yellow-500">1</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Info</span>
                          <Badge className="bg-blue-500">0</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Infrastructure Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infrastructureMetrics.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.category === "API Gateway" && (
                        <Zap className="h-5 w-5" />
                      )}
                      {category.category === "Service Mesh" && (
                        <Network className="h-5 w-5" />
                      )}
                      {category.category === "Event Streaming" && (
                        <Activity className="h-5 w-5" />
                      )}
                      {category.category === "Observability" && (
                        <BarChart3 className="h-5 w-5" />
                      )}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">
                            {metric.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{metric.value}</span>
                            <Badge className={getStatusColor(metric.status)}>
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Kenyan-specific Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>🇰🇪 Kenya-specific Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      📱 M-Pesa Integration
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Callback Success Rate</span>
                        <span className="font-bold text-green-600">99.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <span className="font-bold">89ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Volume</span>
                        <span className="font-bold">45K/hour</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      📞 USSD Performance
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Session Duration (90th)</span>
                        <span className="font-bold">2.8s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drop Rate (Rural)</span>
                        <span className="font-bold text-yellow-600">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression Ratio</span>
                        <span className="font-bold text-green-600">78%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      🌐 Network Quality
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>5G Coverage</span>
                        <span className="font-bold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>4G Coverage</span>
                        <span className="font-bold">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3G Fallback Rate</span>
                        <span className="font-bold">17%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Quick Infrastructure Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Execute common infrastructure management tasks with one click
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Card
                        key={index}
                        className="border-2 hover:border-primary transition-colors cursor-pointer"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {action.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {action.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`${
                                action.severity === "high"
                                  ? "bg-red-500"
                                  : action.severity === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            >
                              {action.severity} priority
                            </Badge>
                            <Button size="sm">Execute</Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Chaos Engineering Test Suite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧪 Chaos Engineering Test Suite
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Test system resilience with controlled failures
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Simulate Safaricom API Outage:</strong> Test
                      M-Pesa fallback mechanisms during rush hour traffic. Uses
                      Kenya's 3G packet loss statistics as parameters.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Phone className="h-6 w-6 mb-2" />
                      M-Pesa Outage
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Wifi className="h-6 w-6 mb-2" />
                      3G Degradation
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Server className="h-6 w-6 mb-2" />
                      Service Mesh Failure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔧 Infrastructure Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">API Gateway Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>M-Pesa Callback Priority</span>
                        <Badge className="bg-green-500">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>USSD Compression</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rate Limiting</span>
                        <Badge className="bg-blue-500">50K/sec</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      Service Mesh Configuration
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Auto-retry (3G)</span>
                        <Badge className="bg-green-500">3 attempts</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Circuit Breaker Threshold</span>
                        <Badge className="bg-blue-500">5 failures</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Timeout (per try)</span>
                        <Badge className="bg-blue-500">2 seconds</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Event Streaming Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Nairobi Partition Capacity</span>
                        <Badge className="bg-green-500">10K events/sec</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Fallback</span>
                        <Badge className="bg-green-500">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dead Letter Retention</span>
                        <Badge className="bg-blue-500">7 days</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      Observability Configuration
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Swahili Logging</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Metric Retention</span>
                        <Badge className="bg-blue-500">30 days</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Alert Rules</span>
                        <Badge className="bg-blue-500">47 active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>🌍 Environment Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>
                      <span className="text-green-600">
                        MPESA_PRIORITY_ENABLED
                      </span>
                      =true
                    </div>
                    <div>
                      <span className="text-green-600">
                        USSD_COMPRESSION_RATIO
                      </span>
                      =0.78
                    </div>
                    <div>
                      <span className="text-green-600">
                        KENYAN_3G_OPTIMIZATION
                      </span>
                      =true
                    </div>
                    <div>
                      <span className="text-green-600">SWAHILI_LOGGING</span>
                      =enabled
                    </div>
                    <div>
                      <span className="text-green-600">
                        COUNTY_PARTITIONING
                      </span>
                      =nairobi:10x
                    </div>
                    <div>
                      <span className="text-green-600">
                        SMS_FALLBACK_ENABLED
                      </span>
                      =true
                    </div>
                    <div>
                      <span className="text-green-600">
                        CIRCUIT_BREAKER_THRESHOLD
                      </span>
                      =5
                    </div>
                    <div>
                      <span className="text-green-600">
                        MATATU_LOAD_BALANCING
                      </span>
                      =adaptive
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

export default AdminInfrastructurePage;
