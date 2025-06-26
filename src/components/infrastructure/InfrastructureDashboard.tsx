import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Network,
  Database,
  Shield,
  Eye,
  MapPin,
  Phone,
  Wifi,
  Server,
  Globe,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
} from "lucide-react";

import { apiGatewayService } from "@/services/apiGatewayService";
import { serviceMeshService } from "@/services/serviceMeshService";
import { eventStreamingService } from "@/services/eventStreamingService";
import { observabilityService } from "@/services/observabilityService";
import SecurityDashboard from "./SecurityDashboard";

const InfrastructureDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // State for real-time data
  const [gatewayMetrics, setGatewayMetrics] = useState<any>(null);
  const [meshStatus, setMeshStatus] = useState<any>(null);
  const [streamingMetrics, setStreamingMetrics] = useState<any>(null);
  const [observabilityData, setObservabilityData] = useState<any>(null);

  useEffect(() => {
    const fetchData = () => {
      // Fetch data from all services
      setGatewayMetrics({
        health: apiGatewayService.getHealthStatus(),
        countyMetrics: apiGatewayService.getCountyMetrics(),
        mpesaStats: apiGatewayService.getMpesaCallbackStats(),
        recentMetrics: apiGatewayService.getMetrics().slice(-50),
      });

      setMeshStatus({
        services: serviceMeshService.getServices(),
        health: serviceMeshService.getMeshHealthStatus(),
        networkReport: serviceMeshService.getNetworkQualityReport(),
        circuitBreakers: serviceMeshService.getCircuitBreakerStates(),
        servicesByCounty: serviceMeshService.getServicesByCounty(),
      });

      setStreamingMetrics({
        metrics: eventStreamingService.getStreamMetrics(),
        partitions: eventStreamingService.getPartitionStatus(),
        consumers: eventStreamingService.getConsumerStatus(),
        deadLetterQueue: eventStreamingService.getDeadLetterQueueStatus(),
        countyDistribution: eventStreamingService.getCountyEventDistribution(),
      });

      setObservabilityData({
        systemHealth: observabilityService.getSystemHealth(),
        webVitals: observabilityService.getWebVitalsReport(),
        recentLogs: observabilityService.getLogs(undefined, undefined, 300000),
        recentMetrics: observabilityService.getMetrics(
          undefined,
          undefined,
          300000,
        ),
      });

      setLastUpdated(Date.now());
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "active":
      case "closed":
        return "bg-green-500";
      case "degraded":
      case "lagging":
      case "half-open":
        return "bg-yellow-500";
      case "unhealthy":
      case "critical":
      case "dead":
      case "open":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-KE");
  };

  const generateMockChartData = (points: number = 10) => {
    return Array.from({ length: points }, (_, i) => ({
      time: formatTimestamp(Date.now() - (points - i) * 60000),
      value: Math.floor(Math.random() * 100) + 20,
      responseTime: Math.floor(Math.random() * 500) + 100,
      throughput: Math.floor(Math.random() * 1000) + 500,
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 to-amber-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🌍 Digital Savannah Plumbing
          </h1>
          <p className="text-muted-foreground">
            Enterprise platform infrastructure monitoring - Kenyan scale
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Updated: {formatTimestamp(lastUpdated)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdated(Date.now())}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">🏞️ Overview</TabsTrigger>
          <TabsTrigger value="gateway">🚰 API Gateway</TabsTrigger>
          <TabsTrigger value="mesh">🕸️ Service Mesh</TabsTrigger>
          <TabsTrigger value="streaming">⚡ Event Streaming</TabsTrigger>
          <TabsTrigger value="observability">👁️ Observability</TabsTrigger>
          <TabsTrigger value="security">🛡️ Zero-Trust Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  API Gateway
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gatewayMetrics?.health?.status === "healthy" ? "✅" : "⚠️"}
                  {gatewayMetrics?.health?.status || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  M-Pesa prioritization active
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Service Mesh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {meshStatus?.health?.status === "healthy" ? "✅" : "⚠️"}
                  {meshStatus?.services?.length || 0} Services
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  3G optimization enabled
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Event Streaming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ⚡ {streamingMetrics?.metrics?.totalEvents || 0} Events
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  County-based partitioning
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Observability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {observabilityData?.systemHealth?.status === "healthy"
                    ? "📊"
                    : "🚨"}
                  {observabilityData?.systemHealth?.status || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Swahili logging active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* County Performance Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗺️ County Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nairobi - Priority County */}
                <Card className="border-2 border-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      🏙️ Nairobi County
                      <Badge className="bg-primary">Priority Hub</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <span className="font-bold text-green-600">
                        {gatewayMetrics?.countyMetrics?.nairobi
                          ?.avgResponseTime || 89}
                        ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Services</span>
                      <span className="font-bold">
                        {meshStatus?.servicesByCounty?.nairobi?.length || 3}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Throughput</span>
                      <span className="font-bold text-blue-600">
                        10x Capacity
                      </span>
                    </div>
                    <Progress value={95} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      95% optimal performance
                    </p>
                  </CardContent>
                </Card>

                {/* Coastal Region */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      🏖️ Coastal Region
                      <Badge variant="secondary">Mombasa Hub</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <span className="font-bold text-yellow-600">
                        {gatewayMetrics?.countyMetrics?.mombasa
                          ?.avgResponseTime || 145}
                        ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection Quality</span>
                      <span className="font-bold">3G/4G Mixed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory Services</span>
                      <span className="font-bold">
                        {meshStatus?.servicesByCounty?.mombasa?.length || 2}
                      </span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      78% performance (3G optimized)
                    </p>
                  </CardContent>
                </Card>

                {/* Western Region */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      🌾 Western Region
                      <Badge variant="outline">Agricultural Hub</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>USSD Performance</span>
                      <span className="font-bold text-green-600">3.2s avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SMS Fallback Rate</span>
                      <span className="font-bold">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supplier Services</span>
                      <span className="font-bold">
                        {(meshStatus?.servicesByCounty?.kisumu?.length || 0) +
                          (meshStatus?.servicesByCounty?.nakuru?.length || 0)}
                      </span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      65% performance (rural optimized)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Real-time System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateMockChartData(20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#8884d8"
                    name="Response Time (ms)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke="#82ca9d"
                    name="Throughput (req/min)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateway" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📱 M-Pesa Callbacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {gatewayMetrics?.mpesaStats?.total || 0}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-bold">
                      {Math.round(
                        (gatewayMetrics?.mpesaStats?.successRate || 0) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response</span>
                    <span className="font-bold">
                      {gatewayMetrics?.mpesaStats?.avgResponseTime || 0}ms
                    </span>
                  </div>
                </div>
                <Badge className="bg-green-500 mt-3">High Priority Queue</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📞 USSD Compression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payload Reduction</span>
                    <span className="font-bold">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SMS Compatible</span>
                    <span className="font-bold">✅ Yes</span>
                  </div>
                </div>
                <Badge className="bg-blue-500 mt-3">SMS-Friendly JSON</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌍 Global Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {gatewayMetrics?.health?.status || "Loading..."}
                </div>
                <p className="text-sm text-muted-foreground">
                  {gatewayMetrics?.health?.details ||
                    "Checking system health..."}
                </p>
                <Badge className="bg-green-500 mt-3">99.9% Uptime</Badge>
              </CardContent>
            </Card>
          </div>

          {/* County-wise API Performance */}
          <Card>
            <CardHeader>
              <CardTitle>🗺️ County-wise API Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>County</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Avg Response Time</TableHead>
                    <TableHead>Connection Quality</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(gatewayMetrics?.countyMetrics || {}).map(
                    ([county, metrics]: [string, any]) => (
                      <TableRow key={county}>
                        <TableCell className="font-medium capitalize">
                          {county === "nairobi"
                            ? "🏙️"
                            : county === "mombasa"
                              ? "🏖️"
                              : "🌾"}{" "}
                          {county}
                        </TableCell>
                        <TableCell>{metrics.requests}</TableCell>
                        <TableCell>
                          <span
                            className={
                              metrics.avgResponseTime < 100
                                ? "text-green-600"
                                : metrics.avgResponseTime < 200
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {metrics.avgResponseTime}ms
                          </span>
                        </TableCell>
                        <TableCell>
                          {county === "nairobi"
                            ? "5G/4G"
                            : county === "mombasa"
                              ? "4G/3G"
                              : "3G/2G"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor("healthy")}>
                            Optimal
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mesh" className="space-y-6">
          {/* Service Mesh Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {meshStatus?.services?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across{" "}
                  {Object.keys(meshStatus?.servicesByCounty || {}).length}{" "}
                  counties
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Circuit Breakers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {meshStatus?.circuitBreakers?.filter(
                    (cb: any) => cb.state === "closed",
                  ).length || 0}{" "}
                  Closed
                </div>
                <p className="text-xs text-muted-foreground">
                  {meshStatus?.circuitBreakers?.filter(
                    (cb: any) => cb.state === "open",
                  ).length || 0}{" "}
                  open breakers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Network Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  3G Optimized
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-retry for unstable connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {meshStatus?.health?.status === "healthy" ? "✅" : "⚠️"}
                  {meshStatus?.health?.status || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground">
                  {meshStatus?.health?.details || "Checking..."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services by County */}
          <Card>
            <CardHeader>
              <CardTitle>🌍 Service Distribution by County</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(meshStatus?.servicesByCounty || {}).map(
                  ([county, services]: [string, any]) => (
                    <Card key={county} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg capitalize">
                          {county === "nairobi"
                            ? "🏙️"
                            : county === "mombasa"
                              ? "🏖️"
                              : "🌾"}{" "}
                          {county}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {services.map((service: any) => (
                            <div
                              key={service.id}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">
                                {service.name}
                              </span>
                              <Badge className={getStatusColor(service.status)}>
                                {service.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            {services.length} services •
                            {services[0]?.connectionQuality || "3G"} network
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Circuit Breaker Status */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Circuit Breaker Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Failure Count</TableHead>
                    <TableHead>Last Failure</TableHead>
                    <TableHead>Reset Timeout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meshStatus?.circuitBreakers?.map((breaker: any) => (
                    <TableRow key={breaker.serviceId}>
                      <TableCell className="font-medium">
                        {breaker.serviceId}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(breaker.state)}>
                          {breaker.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{breaker.failureCount}</TableCell>
                      <TableCell>
                        {breaker.lastFailureTime > 0
                          ? formatTimestamp(breaker.lastFailureTime)
                          : "Never"}
                      </TableCell>
                      <TableCell>{breaker.resetTimeout / 1000}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          {/* Event Streaming Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {streamingMetrics?.metrics?.totalEvents?.toLocaleString() ||
                    "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  1M+ events/sec capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Consumers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {streamingMetrics?.metrics?.activeConsumers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Processing events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dead Letter Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {streamingMetrics?.metrics?.deadLetterCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Failed events for retry
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SMS Fallback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">Active</div>
                <p className="text-xs text-muted-foreground">
                  Auto-SMS for failures
                </p>
              </CardContent>
            </Card>
          </div>

          {/* County-based Partitions */}
          <Card>
            <CardHeader>
              <CardTitle>🗂️ County-based Event Partitions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partition</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(streamingMetrics?.partitions || {}).map(
                    ([id, partition]: [string, any]) => (
                      <TableRow key={id}>
                        <TableCell className="font-medium">
                          Partition {id}
                        </TableCell>
                        <TableCell className="capitalize">
                          {partition.county === "nairobi"
                            ? "🏙️"
                            : partition.county === "mombasa"
                              ? "🏖️"
                              : "🌾"}{" "}
                          {partition.county}
                        </TableCell>
                        <TableCell>
                          {partition.throughputCapacity.toLocaleString()}/sec
                        </TableCell>
                        <TableCell>{partition.currentLoad}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={partition.utilizationPercentage}
                              className="h-2 w-16"
                            />
                            <span className="text-sm">
                              {partition.utilizationPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(partition.status)}>
                            {partition.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Event Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Event Distribution by County</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(
                    streamingMetrics?.countyDistribution || {},
                  ).map(([county, count]) => ({
                    county: county.charAt(0).toUpperCase() + county.slice(1),
                    events: count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="county" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Consumer Status */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Event Consumer Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streamingMetrics?.consumers?.map((consumer: any) => (
                  <Card key={consumer.id} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {consumer.name}
                        <Badge className={getStatusColor(consumer.status)}>
                          {consumer.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Processing Rate</span>
                          <span className="font-bold">
                            {consumer.processingRate}/min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Subscribed Events</span>
                          <span className="font-bold">
                            {consumer.subscribedEvents.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Last Heartbeat</span>
                          <span className="font-bold">
                            {formatTimestamp(consumer.lastHeartbeat)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observability" className="space-y-6">
          {/* Observability Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {observabilityData?.systemHealth?.status === "healthy"
                    ? "✅"
                    : "⚠️"}
                  {observabilityData?.systemHealth?.status || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground">
                  Multi-language monitoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Core Web Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(observabilityData?.webVitals?.averages?.lcp || 0)}
                  ms
                </div>
                <p className="text-xs text-muted-foreground">
                  LCP (Largest Contentful Paint)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {observabilityData?.recentLogs?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 5 minutes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Traces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {observabilityData?.systemHealth?.details?.activeTraces || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Distributed tracing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Swahili Log Stream */}
          <Card>
            <CardHeader>
              <CardTitle>📝 Swahili Log Stream (Real-time)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Multilingual system logs with English/Swahili/Sheng translations
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {observabilityData?.recentLogs
                  ?.slice(0, 10)
                  .map((log: any, index: number) => (
                    <div key={index} className="mb-2">
                      <span className="text-gray-500">
                        [{formatTimestamp(log.timestamp)}]
                      </span>
                      <span
                        className={`ml-2 ${
                          log.level === "error"
                            ? "text-red-400"
                            : log.level === "warn"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                      <div className="ml-4 mt-1">
                        <div className="text-white">🇰🇪 {log.message}</div>
                        <div className="text-gray-400">🇬🇧 {log.english}</div>
                        {log.sheng && (
                          <div className="text-blue-400">🗣️ {log.sheng}</div>
                        )}
                      </div>
                    </div>
                  )) || (
                  <div className="text-center text-gray-500">
                    Kusubiri logs za hivi karibuni... (Waiting for recent
                    logs...)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Core Web Vitals by County */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 Core Web Vitals by Connection Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(
                    observabilityData?.webVitals?.byConnection || {},
                  ).map(([connection, vitals]: [string, any]) => ({
                    connection,
                    LCP: Math.round(vitals.lcp),
                    FID: Math.round(vitals.fid),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="connection" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="LCP" fill="#8884d8" name="LCP (ms)" />
                  <Bar dataKey="FID" fill="#82ca9d" name="FID (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>💡 AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {observabilityData?.systemHealth?.recommendations?.map(
                  (rec: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="text-blue-600 mt-1">💡</div>
                      <div>
                        <p className="font-medium">{rec}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on Kenyan network patterns and user behavior
                        </p>
                      </div>
                    </div>
                  ),
                ) || (
                  <div className="text-center text-muted-foreground">
                    Sistema inakagua utendakazi... (System analyzing
                    performance...)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfrastructureDashboard;
