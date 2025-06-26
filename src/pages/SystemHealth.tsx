import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Server,
  Database,
  Wifi,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Download,
  Bell,
  Globe,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface ServiceStatus {
  name: string;
  status: "online" | "degraded" | "offline";
  uptime: string;
  responseTime: number;
  version: string;
  location: string;
}

const SystemHealth = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Mock system metrics
    const mockMetrics: SystemMetric[] = [
      {
        name: "CPU Usage",
        value: 23,
        unit: "%",
        status: "healthy",
        trend: "stable",
        lastUpdated: "2 minutes ago",
      },
      {
        name: "Memory Usage",
        value: 67,
        unit: "%",
        status: "warning",
        trend: "up",
        lastUpdated: "1 minute ago",
      },
      {
        name: "Storage Usage",
        value: 45,
        unit: "%",
        status: "healthy",
        trend: "stable",
        lastUpdated: "30 seconds ago",
      },
      {
        name: "Network Throughput",
        value: 89,
        unit: "Mbps",
        status: "healthy",
        trend: "up",
        lastUpdated: "1 minute ago",
      },
      {
        name: "Database Connections",
        value: 156,
        unit: "active",
        status: "healthy",
        trend: "stable",
        lastUpdated: "45 seconds ago",
      },
      {
        name: "API Response Time",
        value: 234,
        unit: "ms",
        status: "healthy",
        trend: "down",
        lastUpdated: "30 seconds ago",
      },
    ];

    const mockServices: ServiceStatus[] = [
      {
        name: "Main API Gateway",
        status: "online",
        uptime: "99.98%",
        responseTime: 45,
        version: "v2.4.1",
        location: "Nairobi, Kenya",
      },
      {
        name: "User Authentication",
        status: "online",
        uptime: "99.95%",
        responseTime: 67,
        version: "v1.8.3",
        location: "Lagos, Nigeria",
      },
      {
        name: "Payment Processing",
        status: "online",
        uptime: "99.99%",
        responseTime: 123,
        version: "v3.1.0",
        location: "Cape Town, SA",
      },
      {
        name: "Notification Service",
        status: "degraded",
        uptime: "97.82%",
        responseTime: 456,
        version: "v1.5.2",
        location: "Kampala, Uganda",
      },
      {
        name: "Analytics Engine",
        status: "online",
        uptime: "99.87%",
        responseTime: 89,
        version: "v2.0.1",
        location: "Dar es Salaam, TZ",
      },
      {
        name: "File Storage",
        status: "online",
        uptime: "99.91%",
        responseTime: 234,
        version: "v1.9.4",
        location: "Kigali, Rwanda",
      },
    ];

    setSystemMetrics(mockMetrics);
    setServices(mockServices);
  }, []);

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch fresh data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "text-green-600 bg-green-100";
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
      case "offline":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const overallHealth = {
    status: services.every((s) => s.status === "online")
      ? "healthy"
      : services.some((s) => s.status === "offline")
        ? "critical"
        : "warning",
    uptime: "99.94%",
    activeUsers: "12,847",
    totalTransactions: "2.3M",
    revenue: "KSH 450M",
  };

  const recentIncidents = [
    {
      id: 1,
      title: "Temporary API Slowdown",
      description:
        "Payment processing experienced 2-minute delays due to high traffic",
      timestamp: "2 hours ago",
      status: "resolved",
      impact: "low",
    },
    {
      id: 2,
      title: "Scheduled Maintenance",
      description: "Database optimization completed successfully",
      timestamp: "1 day ago",
      status: "resolved",
      impact: "none",
    },
    {
      id: 3,
      title: "Network Optimization",
      description: "Upgraded network infrastructure in East Africa region",
      timestamp: "3 days ago",
      status: "resolved",
      impact: "positive",
    },
  ];

  const businessMetrics = [
    { label: "Active Users", value: "12,847", change: "+8.2%", icon: Users },
    {
      label: "Daily Transactions",
      value: "8,934",
      change: "+12.4%",
      icon: ShoppingCart,
    },
    {
      label: "Revenue Today",
      value: "KSH 1.2M",
      change: "+15.7%",
      icon: DollarSign,
    },
    {
      label: "Platform Uptime",
      value: "99.94%",
      change: "+0.1%",
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              🔋 System Health Monitor
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time monitoring of our digital savanna ecosystem health and
              performance.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Health Status */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full ${getStatusColor(overallHealth.status)}`}
                >
                  {overallHealth.status === "healthy" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : overallHealth.status === "warning" ? (
                    <AlertTriangle className="h-8 w-8" />
                  ) : (
                    <AlertTriangle className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {overallHealth.status === "healthy"
                      ? "All Systems Operational"
                      : overallHealth.status === "warning"
                        ? "Minor Issues Detected"
                        : "System Issues Detected"}
                  </h2>
                  <p className="text-muted-foreground">
                    Platform is running smoothly across all regions
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {overallHealth.uptime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Uptime (30 days)
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {overallHealth.activeUsers}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {businessMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {metric.label}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {metric.change}
                      </div>
                    </div>
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="services">Service Status</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">
                          {metric.value}
                          <span className="text-lg text-muted-foreground ml-1">
                            {metric.unit}
                          </span>
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>

                      {metric.name.includes("Usage") && (
                        <Progress
                          value={metric.value}
                          className={`h-3 ${
                            metric.value > 80
                              ? "text-red-600"
                              : metric.value > 60
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        />
                      )}

                      <div className="text-sm text-muted-foreground">
                        Updated {metric.lastUpdated}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-4">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${getStatusColor(service.status)}`}
                        >
                          <Server className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.location} • Version {service.version}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="font-bold">{service.uptime}</div>
                          <div className="text-xs text-muted-foreground">
                            Uptime
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {service.responseTime}ms
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Response
                          </div>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <Card
                  key={incident.id}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            incident.status === "resolved"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {incident.status === "resolved" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{incident.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {incident.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {incident.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            incident.impact === "positive"
                              ? "bg-green-100 text-green-700"
                              : incident.impact === "low"
                                ? "bg-yellow-100 text-yellow-700"
                                : incident.impact === "none"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-red-100 text-red-700"
                          }
                        >
                          {incident.impact} impact
                        </Badge>
                        <Badge
                          className={
                            incident.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Response Time Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>API Gateway</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">45ms</span>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Queries</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">23ms</span>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>File Uploads</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">890ms</span>
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Regional Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>East Africa</span>
                      <Badge className="bg-green-100 text-green-700">
                        Excellent
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>West Africa</span>
                      <Badge className="bg-green-100 text-green-700">
                        Good
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Southern Africa</span>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Fair
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Central Africa</span>
                      <Badge className="bg-green-100 text-green-700">
                        Good
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Memory Usage Detected:</strong> Server cluster 2
                  is using 67% memory. Consider scaling up if usage continues to
                  increase.
                </AlertDescription>
              </Alert>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  <strong>Scheduled Maintenance:</strong> Database optimization
                  scheduled for tonight at 2:00 AM EAT. Expected downtime: 15
                  minutes.
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Improvement:</strong> API response times
                  improved by 15% after infrastructure optimization.
                </AlertDescription>
              </Alert>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Notification Channels</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>Email Alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>SMS Alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span>Slack Integration</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Alert Thresholds</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>CPU Usage</span>
                        <span>80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage</span>
                        <span>85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span>500ms</span>
                      </div>
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

export default SystemHealth;
