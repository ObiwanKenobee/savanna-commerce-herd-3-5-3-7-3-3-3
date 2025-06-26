import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity,
  BarChart3,
  Database,
  Globe,
  Server,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  Clock,
  Users,
  Package,
  DollarSign,
  Target,
  Brain,
  Shield,
  Wifi,
  HardDrive,
  Cpu,
  MonitorSpeaker,
} from "lucide-react";

interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  score: number;
  uptime: string;
  lastCheck: string;
}

interface LayerInsights {
  frontend: {
    health: SystemHealth;
    performanceScore: number;
    activeUsers: number;
    pageLoadTime: number;
    bounceRate: number;
    userSatisfaction: number;
  };
  backend: {
    health: SystemHealth;
    apiResponseTime: number;
    throughput: number;
    errorRate: number;
    activeConnections: number;
    serverLoad: number;
  };
  database: {
    health: SystemHealth;
    queryTime: number;
    connections: number;
    storageUsed: number;
    indexEfficiency: number;
    replicationLag: number;
  };
  api: {
    health: SystemHealth;
    requestsPerMinute: number;
    successRate: number;
    avgLatency: number;
    rateLimitHits: number;
    cacheHitRate: number;
  };
}

interface WildlifeMetric {
  animal: string;
  emoji: string;
  label: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  insight: string;
}

const CriticalInsightsHub: React.FC = () => {
  const { user, profile } = useAuth();
  const [insights, setInsights] = useState<LayerInsights>({
    frontend: {
      health: {
        status: "healthy",
        score: 94,
        uptime: "99.9%",
        lastCheck: "2 mins ago",
      },
      performanceScore: 87,
      activeUsers: 2340,
      pageLoadTime: 1.2,
      bounceRate: 24.5,
      userSatisfaction: 4.6,
    },
    backend: {
      health: {
        status: "healthy",
        score: 91,
        uptime: "99.8%",
        lastCheck: "1 min ago",
      },
      apiResponseTime: 145,
      throughput: 2450,
      errorRate: 0.3,
      activeConnections: 156,
      serverLoad: 67,
    },
    database: {
      health: {
        status: "warning",
        score: 78,
        uptime: "99.7%",
        lastCheck: "3 mins ago",
      },
      queryTime: 89,
      connections: 45,
      storageUsed: 73.2,
      indexEfficiency: 92,
      replicationLag: 2.1,
    },
    api: {
      health: {
        status: "healthy",
        score: 96,
        uptime: "99.9%",
        lastCheck: "1 min ago",
      },
      requestsPerMinute: 8450,
      successRate: 99.7,
      avgLatency: 128,
      rateLimitHits: 12,
      cacheHitRate: 89.4,
    },
  });

  const [wildlifeMetrics, setWildlifeMetrics] = useState<WildlifeMetric[]>([
    {
      animal: "Cheetah",
      emoji: "🐆",
      label: "Page Speed",
      value: 1.2,
      unit: "seconds",
      status: "excellent",
      insight: "Lightning fast like a cheetah hunt - users love the speed!",
    },
    {
      animal: "Elephant",
      emoji: "🐘",
      label: "Memory Usage",
      value: 67,
      unit: "%",
      status: "good",
      insight: "Steady and reliable memory management like elephant wisdom",
    },
    {
      animal: "Lion",
      emoji: "🦁",
      label: "System Authority",
      value: 94,
      unit: "score",
      status: "excellent",
      insight: "Commanding performance worthy of the savannah king",
    },
    {
      animal: "Giraffe",
      emoji: "🦒",
      label: "Network Reach",
      value: 89.4,
      unit: "%",
      status: "good",
      insight: "High-level connectivity spanning the digital savannah",
    },
    {
      animal: "Rhino",
      emoji: "🦏",
      label: "Security Strength",
      value: 96,
      unit: "score",
      status: "excellent",
      insight: "Impenetrable defense protecting the marketplace herd",
    },
    {
      animal: "Zebra",
      emoji: "🦓",
      label: "Load Balance",
      value: 78,
      unit: "score",
      status: "warning",
      insight: "Stripes showing some strain - consider herd expansion",
    },
  ]);

  const [selectedLayer, setSelectedLayer] = useState("overview");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights((prev) => ({
        ...prev,
        frontend: {
          ...prev.frontend,
          activeUsers: Math.floor(Math.random() * 500) + 2000,
          pageLoadTime: parseFloat((Math.random() * 0.5 + 0.8).toFixed(2)),
        },
        backend: {
          ...prev.backend,
          apiResponseTime: Math.floor(Math.random() * 50) + 120,
          throughput: Math.floor(Math.random() * 500) + 2200,
          serverLoad: Math.floor(Math.random() * 20) + 60,
        },
        api: {
          ...prev.api,
          requestsPerMinute: Math.floor(Math.random() * 1000) + 8000,
          avgLatency: Math.floor(Math.random() * 40) + 110,
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
      case "good":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "excellent":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
      case "good":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const LayerHealthCard = ({
    title,
    health,
    icon,
    metrics,
  }: {
    title: string;
    health: SystemHealth;
    icon: React.ReactNode;
    metrics: { label: string; value: string | number; unit?: string }[];
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getHealthIcon(health.status)}
                <Badge className={getHealthColor(health.status)}>
                  {health.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{health.score}/100</div>
            <div className="text-sm text-muted-foreground">
              Uptime: {health.uptime}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
              <div className="font-semibold">
                {metric.value}
                {metric.unit && ` ${metric.unit}`}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Progress value={health.score} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Last check: {health.lastCheck}
        </div>
      </CardContent>
    </Card>
  );

  const WildlifeMetricCard = ({ metric }: { metric: WildlifeMetric }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{metric.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">
                {metric.animal} - {metric.label}
              </h3>
              <Badge className={getHealthColor(metric.status)}>
                {metric.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-2xl font-bold mb-1">
              {metric.value} {metric.unit}
            </div>
            <p className="text-sm text-muted-foreground">{metric.insight}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Digital Savannah - Critical Insights Command Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {insights.frontend.health.score}/100
                </div>
                <div className="text-sm text-muted-foreground">Frontend</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {insights.backend.health.score}/100
                </div>
                <div className="text-sm text-muted-foreground">Backend</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {insights.database.health.score}/100
                </div>
                <div className="text-sm text-muted-foreground">Database</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {insights.api.health.score}/100
                </div>
                <div className="text-sm text-muted-foreground">API Gateway</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {insights.frontend.activeUsers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {insights.api.requestsPerMinute.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Requests/min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedLayer} onValueChange={setSelectedLayer}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API Gateway</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Wildlife Metrics */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Savannah Wildlife Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wildlifeMetrics.map((metric, index) => (
                <WildlifeMetricCard key={index} metric={metric} />
              ))}
            </div>
          </div>

          {/* System Health Overview */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Layer Health Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LayerHealthCard
                title="Frontend Layer"
                health={insights.frontend.health}
                icon={<Smartphone className="h-6 w-6" />}
                metrics={[
                  {
                    label: "Performance Score",
                    value: insights.frontend.performanceScore,
                  },
                  {
                    label: "Page Load Time",
                    value: insights.frontend.pageLoadTime,
                    unit: "s",
                  },
                  {
                    label: "Bounce Rate",
                    value: insights.frontend.bounceRate,
                    unit: "%",
                  },
                  {
                    label: "User Satisfaction",
                    value: insights.frontend.userSatisfaction,
                    unit: "/5",
                  },
                ]}
              />
              <LayerHealthCard
                title="Backend Layer"
                health={insights.backend.health}
                icon={<Server className="h-6 w-6" />}
                metrics={[
                  {
                    label: "Response Time",
                    value: insights.backend.apiResponseTime,
                    unit: "ms",
                  },
                  {
                    label: "Throughput",
                    value: insights.backend.throughput,
                    unit: "req/s",
                  },
                  {
                    label: "Error Rate",
                    value: insights.backend.errorRate,
                    unit: "%",
                  },
                  {
                    label: "Server Load",
                    value: insights.backend.serverLoad,
                    unit: "%",
                  },
                ]}
              />
              <LayerHealthCard
                title="Database Layer"
                health={insights.database.health}
                icon={<Database className="h-6 w-6" />}
                metrics={[
                  {
                    label: "Query Time",
                    value: insights.database.queryTime,
                    unit: "ms",
                  },
                  {
                    label: "Connections",
                    value: insights.database.connections,
                  },
                  {
                    label: "Storage Used",
                    value: insights.database.storageUsed,
                    unit: "%",
                  },
                  {
                    label: "Index Efficiency",
                    value: insights.database.indexEfficiency,
                    unit: "%",
                  },
                ]}
              />
              <LayerHealthCard
                title="API Gateway"
                health={insights.api.health}
                icon={<Globe className="h-6 w-6" />}
                metrics={[
                  {
                    label: "Requests/min",
                    value: insights.api.requestsPerMinute.toLocaleString(),
                  },
                  {
                    label: "Success Rate",
                    value: insights.api.successRate,
                    unit: "%",
                  },
                  {
                    label: "Avg Latency",
                    value: insights.api.avgLatency,
                    unit: "ms",
                  },
                  {
                    label: "Cache Hit Rate",
                    value: insights.api.cacheHitRate,
                    unit: "%",
                  },
                ]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frontend" className="space-y-6">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Frontend insights show user experience metrics across web and
              mobile platforms. Cheetah-speed performance keeps users engaged in
              the digital savannah.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.frontend.activeUsers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Real-time user sessions
                </div>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.frontend.performanceScore}/100
                </div>
                <div className="text-sm text-muted-foreground">
                  Lighthouse average
                </div>
                <Progress
                  value={insights.frontend.performanceScore}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Page Load Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.frontend.pageLoadTime}s
                </div>
                <div className="text-sm text-muted-foreground">
                  Average across all pages
                </div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backend" className="space-y-6">
          <Alert>
            <Server className="h-4 w-4" />
            <AlertDescription>
              Backend systems are running like a well-coordinated pride. Server
              performance maintains the digital ecosystem with elephant-like
              reliability.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.backend.apiResponseTime}ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Average API response
                </div>
                <Progress value={82} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.backend.throughput}
                </div>
                <div className="text-sm text-muted-foreground">
                  Requests per second
                </div>
                <Progress value={90} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Server Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.backend.serverLoad}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Current CPU usage
                </div>
                <Progress
                  value={insights.backend.serverLoad}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Database showing some strain like a zebra herd. Consider
              optimization or scaling to maintain savannah harmony.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Query Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.database.queryTime}ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Average query time
                </div>
                <Progress value={78} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.database.storageUsed}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Total storage used
                </div>
                <Progress
                  value={insights.database.storageUsed}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Index Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.database.indexEfficiency}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Query optimization
                </div>
                <Progress
                  value={insights.database.indexEfficiency}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Alert>
            <Globe className="h-4 w-4" />
            <AlertDescription>
              API Gateway performing like a wise giraffe, overseeing all traffic
              with excellent visibility and control across the digital savannah.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Request Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.api.requestsPerMinute.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Requests per minute
                </div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.api.successRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Successful responses
                </div>
                <Progress value={insights.api.successRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Cache Hit Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.api.cacheHitRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Cached responses
                </div>
                <Progress value={insights.api.cacheHitRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CriticalInsightsHub;
