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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  GitBranch,
  Deployment,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Server,
  Database,
  Cloud,
  Shield,
  Cpu,
  HardDrive,
  Network,
  Gauge,
  Users,
  Package,
  Rocket,
  Eye,
  RefreshCw,
  Terminal,
  Globe,
  Zap,
} from "lucide-react";

interface DeploymentStatus {
  id: string;
  environment: string;
  status: "success" | "running" | "failed" | "pending";
  version: string;
  timestamp: string;
  duration: string;
  wildlife: string;
}

interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  icon: React.ReactNode;
  endpoint: string;
}

interface InfrastructureMetric {
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  threshold: number;
  icon: React.ReactNode;
}

const DevOpsDashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([
    {
      id: "1",
      environment: "Production (Kenya-East)",
      status: "success",
      version: "v2.4.1",
      timestamp: "5 minutes ago",
      duration: "3m 24s",
      wildlife: "🦁",
    },
    {
      id: "2",
      environment: "Staging (Nairobi)",
      status: "running",
      version: "v2.5.0-rc1",
      timestamp: "2 minutes ago",
      duration: "1m 45s",
      wildlife: "🦓",
    },
    {
      id: "3",
      environment: "Development",
      status: "success",
      version: "v2.5.0-dev",
      timestamp: "1 hour ago",
      duration: "2m 12s",
      wildlife: "🦛",
    },
  ]);

  const [services, setServices] = useState<ServiceHealth[]>([
    {
      name: "Web Application",
      status: "healthy",
      uptime: 99.97,
      responseTime: 156,
      icon: <Globe className="h-4 w-4" />,
      endpoint: "https://savanna-marketplace.com",
    },
    {
      name: "API Gateway",
      status: "healthy",
      uptime: 99.94,
      responseTime: 89,
      icon: <Server className="h-4 w-4" />,
      endpoint: "/api/v1/health",
    },
    {
      name: "Database (PostgreSQL)",
      status: "healthy",
      uptime: 99.99,
      responseTime: 12,
      icon: <Database className="h-4 w-4" />,
      endpoint: "db.savanna-marketplace.com",
    },
    {
      name: "Redis Cache",
      status: "healthy",
      uptime: 99.95,
      responseTime: 3,
      icon: <Zap className="h-4 w-4" />,
      endpoint: "redis.savanna-marketplace.com",
    },
    {
      name: "M-Pesa Gateway",
      status: "degraded",
      uptime: 97.2,
      responseTime: 2340,
      icon: <Shield className="h-4 w-4" />,
      endpoint: "payments.savanna-marketplace.com",
    },
    {
      name: "USSD Service",
      status: "healthy",
      uptime: 98.8,
      responseTime: 450,
      icon: <Network className="h-4 w-4" />,
      endpoint: "ussd.savanna-marketplace.com",
    },
  ]);

  const [infrastructure, setInfrastructure] = useState<InfrastructureMetric[]>([
    {
      name: "CPU Usage",
      value: 34,
      unit: "%",
      status: "normal",
      threshold: 80,
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      name: "Memory Usage",
      value: 67,
      unit: "%",
      status: "warning",
      threshold: 85,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Disk Usage",
      value: 23,
      unit: "%",
      status: "normal",
      threshold: 90,
      icon: <HardDrive className="h-4 w-4" />,
    },
    {
      name: "Network I/O",
      value: 156,
      unit: "MB/s",
      status: "normal",
      threshold: 500,
      icon: <Network className="h-4 w-4" />,
    },
  ]);

  const [pipelineStatus, setPipelineStatus] = useState({
    totalBuilds: 1247,
    successRate: 94.2,
    avgBuildTime: "4m 23s",
    activeBuilds: 3,
    queuedBuilds: 1,
    lastDeployment: "5 minutes ago",
  });

  const [securityScans, setSecurityScans] = useState({
    lastScan: "2 hours ago",
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 7,
      low: 15,
    },
    complianceScore: 96.8,
    penTestStatus: "Passed",
  });

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setInfrastructure((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(
            0,
            Math.min(100, metric.value + (Math.random() - 0.5) * 5),
          ),
        })),
      );

      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "healthy":
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "failed":
      case "down":
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "healthy":
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
      case "down":
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "running":
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            🚀 DevOps Command Center
          </h1>
          <p className="text-slate-600">
            Infrastructure monitoring & deployment dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={isAutoRefresh ? "default" : "secondary"}
            className="flex items-center space-x-1"
          >
            <div
              className={`w-2 h-2 rounded-full ${isAutoRefresh ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
            />
            <span>{isAutoRefresh ? "LIVE" : "PAUSED"}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="border-slate-200"
          >
            {isAutoRefresh ? (
              <Eye className="h-4 w-4" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isAutoRefresh ? "Pause" : "Resume"}
          </Button>
          <span className="text-sm text-slate-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Pipeline Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Builds
                </CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pipelineStatus.totalBuilds}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {pipelineStatus.successRate}%
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Build Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pipelineStatus.avgBuildTime}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Builds
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {pipelineStatus.activeBuilds}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pipelineStatus.queuedBuilds} queued
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((service, index) => (
              <Card
                key={index}
                className={`border ${getStatusColor(service.status)}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    {service.icon}
                    <span>{service.name}</span>
                  </CardTitle>
                  {getStatusIcon(service.status)}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">
                        {service.uptime}%
                      </div>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {service.responseTime}ms
                      </div>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <div className="grid gap-4">
            {deployments.map((deployment) => (
              <Card
                key={deployment.id}
                className={`border ${getStatusColor(deployment.status)}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{deployment.wildlife}</span>
                      <div>
                        <CardTitle className="text-lg">
                          {deployment.environment}
                        </CardTitle>
                        <CardDescription>
                          Version {deployment.version}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(deployment.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(deployment.status)}
                      >
                        {deployment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Duration: {deployment.duration}</span>
                    <span>{deployment.timestamp}</span>
                  </div>
                  {deployment.status === "running" && (
                    <Progress value={65} className="mt-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`border ${getStatusColor(service.status)}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {service.icon}
                      <div>
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <CardDescription>{service.endpoint}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(service.status)}
                      >
                        {service.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {service.uptime}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uptime (30 days)
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {service.responseTime}ms
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avg Response Time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {infrastructure.map((metric, index) => (
              <Card
                key={index}
                className={`border ${getStatusColor(metric.status)}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    {metric.icon}
                    <span>{metric.name}</span>
                  </CardTitle>
                  {getStatusIcon(metric.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value.toFixed(1)}
                    {metric.unit}
                  </div>
                  <Progress
                    value={(metric.value / metric.threshold) * 100}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Threshold: {metric.threshold}
                    {metric.unit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resource Usage Over Time Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Trends</CardTitle>
              <CardDescription>
                System resource utilization over the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <Gauge className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">
                    Interactive charts would be displayed here
                  </p>
                  <p className="text-sm text-slate-500">
                    Integration with Grafana or custom charting library
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Security Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {securityScans.complianceScore}%
                </div>
                <Progress
                  value={securityScans.complianceScore}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Last scan: {securityScans.lastScan}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Vulnerabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-red-600">Critical</span>
                    <span className="font-semibold">
                      {securityScans.vulnerabilities.critical}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">High</span>
                    <span className="font-semibold">
                      {securityScans.vulnerabilities.high}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Medium</span>
                    <span className="font-semibold">
                      {securityScans.vulnerabilities.medium}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Low</span>
                    <span className="font-semibold">
                      {securityScans.vulnerabilities.low}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Penetration Test</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {securityScans.penTestStatus}
                </div>
                <p className="text-sm text-muted-foreground">
                  Latest assessment completed successfully
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>🦏 Rhino Guard Status</AlertTitle>
            <AlertDescription>
              All security systems operational. Vulture Watch AI is actively
              monitoring for threats. Next automated security scan scheduled for
              tomorrow at 2:00 AM EAT.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevOpsDashboard;
