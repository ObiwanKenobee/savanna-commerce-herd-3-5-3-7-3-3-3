import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Wifi,
  Shield,
  Users,
  ShoppingCart,
  Smartphone,
  MapPin,
  Heart,
  Zap,
  Eye,
} from "lucide-react";

interface MetricData {
  value: number;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  timestamp: string;
}

interface SystemHealth {
  application: MetricData;
  database: MetricData;
  payments: MetricData;
  ussd: MetricData;
  fraud: MetricData;
  inventory: MetricData;
}

interface PerformanceMetrics {
  responseTime: MetricData;
  throughput: MetricData;
  errorRate: MetricData;
  cpuUsage: MetricData;
  memoryUsage: MetricData;
  networkLatency: MetricData;
}

interface BusinessMetrics {
  activeUsers: MetricData;
  ordersPerMinute: MetricData;
  conversionRate: MetricData;
  revenuePerHour: MetricData;
  fraudAttempts: MetricData;
  ussdSessions: MetricData;
}

const PerformanceMonitor: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    application: {
      value: 99.9,
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    },
    database: {
      value: 98.5,
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    },
    payments: {
      value: 97.2,
      status: "warning",
      trend: "down",
      timestamp: new Date().toISOString(),
    },
    ussd: {
      value: 95.8,
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    },
    fraud: {
      value: 99.7,
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    },
    inventory: {
      value: 99.1,
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    },
  });

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      responseTime: {
        value: 156,
        status: "healthy",
        trend: "down",
        timestamp: new Date().toISOString(),
      },
      throughput: {
        value: 2847,
        status: "healthy",
        trend: "up",
        timestamp: new Date().toISOString(),
      },
      errorRate: {
        value: 0.12,
        status: "healthy",
        trend: "stable",
        timestamp: new Date().toISOString(),
      },
      cpuUsage: {
        value: 34,
        status: "healthy",
        trend: "stable",
        timestamp: new Date().toISOString(),
      },
      memoryUsage: {
        value: 67,
        status: "warning",
        trend: "up",
        timestamp: new Date().toISOString(),
      },
      networkLatency: {
        value: 89,
        status: "healthy",
        trend: "down",
        timestamp: new Date().toISOString(),
      },
    });

  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    activeUsers: {
      value: 1247,
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    },
    ordersPerMinute: {
      value: 23,
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    },
    conversionRate: {
      value: 3.4,
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    },
    revenuePerHour: {
      value: 45678,
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    },
    fraudAttempts: {
      value: 2,
      status: "healthy",
      trend: "down",
      timestamp: new Date().toISOString(),
    },
    ussdSessions: {
      value: 89,
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    },
  });

  const [alerts, setAlerts] = useState([
    {
      id: "1",
      severity: "warning" as const,
      title: "Memory Usage Rising",
      description: "Memory usage has increased to 67% on production servers",
      timestamp: "2 minutes ago",
      wildlife: "🐘",
    },
    {
      id: "2",
      severity: "info" as const,
      title: "Auto-scaling Triggered",
      description: "Added 2 new instances due to increased traffic",
      timestamp: "5 minutes ago",
      wildlife: "🦓",
    },
  ]);

  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate metric updates with realistic variations
      setPerformanceMetrics((prev) => ({
        ...prev,
        responseTime: {
          ...prev.responseTime,
          value: Math.max(
            50,
            prev.responseTime.value + (Math.random() - 0.5) * 20,
          ),
        },
        throughput: {
          ...prev.throughput,
          value: Math.max(
            1000,
            prev.throughput.value + (Math.random() - 0.5) * 200,
          ),
        },
        cpuUsage: {
          ...prev.cpuUsage,
          value: Math.max(
            0,
            Math.min(100, prev.cpuUsage.value + (Math.random() - 0.5) * 10),
          ),
        },
      }));

      setBusinessMetrics((prev) => ({
        ...prev,
        activeUsers: {
          ...prev.activeUsers,
          value: Math.max(
            800,
            prev.activeUsers.value + Math.floor((Math.random() - 0.5) * 50),
          ),
        },
        ordersPerMinute: {
          ...prev.ordersPerMinute,
          value: Math.max(
            0,
            prev.ordersPerMinute.value + Math.floor((Math.random() - 0.5) * 5),
          ),
        },
      }));

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "KES") {
      return `KES ${value.toLocaleString()}`;
    }
    if (unit === "%") {
      return `${value.toFixed(1)}%`;
    }
    if (unit === "ms") {
      return `${Math.round(value)}ms`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-orange-50 to-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            🦁 Savanna Pulse Monitor
          </h1>
          <p className="text-green-600">
            Real-time ecosystem health & performance tracking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={isLive ? "default" : "secondary"}
            className="flex items-center space-x-1"
          >
            <div
              className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
            />
            <span>{isLive ? "LIVE" : "PAUSED"}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="border-green-200"
          >
            {isLive ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            {isLive ? "Pause" : "Resume"}
          </Button>
          <span className="text-sm text-green-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              className={`border-l-4 ${
                alert.severity === "critical"
                  ? "border-red-500 bg-red-50"
                  : alert.severity === "warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-blue-500 bg-blue-50"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center space-x-2">
                <span>{alert.wildlife}</span>
                <span>{alert.title}</span>
                <Badge variant="outline" className="text-xs">
                  {alert.timestamp}
                </Badge>
              </AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Server className="h-4 w-4 text-green-600" />
              <span>Application Health</span>
            </CardTitle>
            {getStatusIcon(systemHealth.application.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-800">
                {formatValue(systemHealth.application.value, "%")}
              </div>
              {getTrendIcon(systemHealth.application.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.application.status)}`}
            />
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Database Performance</span>
            </CardTitle>
            {getStatusIcon(systemHealth.database.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-800">
                {formatValue(systemHealth.database.value, "%")}
              </div>
              {getTrendIcon(systemHealth.database.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.database.status)}`}
            />
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Heart className="h-4 w-4 text-purple-600" />
              <span>M-Pesa Payments</span>
            </CardTitle>
            {getStatusIcon(systemHealth.payments.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-800">
                {formatValue(systemHealth.payments.value, "%")}
              </div>
              {getTrendIcon(systemHealth.payments.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.payments.status)}`}
            />
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-orange-600" />
              <span>USSD Gateway</span>
            </CardTitle>
            {getStatusIcon(systemHealth.ussd.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-800">
                {formatValue(systemHealth.ussd.value, "%")}
              </div>
              {getTrendIcon(systemHealth.ussd.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.ussd.status)}`}
            />
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span>Vulture Watch AI</span>
            </CardTitle>
            {getStatusIcon(systemHealth.fraud.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-800">
                {formatValue(systemHealth.fraud.value, "%")}
              </div>
              {getTrendIcon(systemHealth.fraud.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.fraud.status)}`}
            />
          </CardContent>
        </Card>

        <Card className="border-teal-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span>Inventory Sync</span>
            </CardTitle>
            {getStatusIcon(systemHealth.inventory.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-teal-800">
                {formatValue(systemHealth.inventory.value, "%")}
              </div>
              {getTrendIcon(systemHealth.inventory.trend)}
            </div>
            <div
              className={`w-full h-2 rounded-full mt-2 ${getStatusColor(systemHealth.inventory.status)}`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Response Time</span>
            </CardTitle>
            <CardDescription>Average API response time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {formatValue(performanceMetrics.responseTime.value, "ms")}
            </div>
            <Progress
              value={Math.min(
                100,
                (performanceMetrics.responseTime.value / 500) * 100,
              )}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Throughput</span>
            </CardTitle>
            <CardDescription>Requests per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatValue(performanceMetrics.throughput.value, "")}
            </div>
            <Progress
              value={Math.min(
                100,
                (performanceMetrics.throughput.value / 5000) * 100,
              )}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Error Rate</span>
            </CardTitle>
            <CardDescription>5xx errors percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatValue(performanceMetrics.errorRate.value, "%")}
            </div>
            <Progress
              value={Math.min(
                100,
                (performanceMetrics.errorRate.value / 5) * 100,
              )}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>Active Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatValue(businessMetrics.activeUsers.value, "")}
            </div>
            <div className="flex items-center mt-1">
              {getTrendIcon(businessMetrics.activeUsers.trend)}
              <span className="text-sm text-gray-600 ml-1">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <span>Orders/Min</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatValue(businessMetrics.ordersPerMinute.value, "")}
            </div>
            <div className="flex items-center mt-1">
              {getTrendIcon(businessMetrics.ordersPerMinute.trend)}
              <span className="text-sm text-gray-600 ml-1">vs last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span>Revenue/Hour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {formatValue(businessMetrics.revenuePerHour.value, "KES")}
            </div>
            <div className="flex items-center mt-1">
              {getTrendIcon(businessMetrics.revenuePerHour.trend)}
              <span className="text-sm text-gray-600 ml-1">vs last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <span>USSD Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatValue(businessMetrics.ussdSessions.value, "")}
            </div>
            <div className="flex items-center mt-1">
              {getTrendIcon(businessMetrics.ussdSessions.trend)}
              <span className="text-sm text-gray-600 ml-1">active now</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
