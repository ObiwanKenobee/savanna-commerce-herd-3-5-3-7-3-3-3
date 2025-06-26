import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Unlock,
  Phone,
  MapPin,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  FileText,
  Zap,
  Globe,
  AlertCircle,
} from "lucide-react";

import { securityInfrastructureService } from "@/services/securityInfrastructureService";

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // State for real-time security data
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);
  const [activeIdentities, setActiveIdentities] = useState<any[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSecurityData = () => {
      setSecurityMetrics(securityInfrastructureService.getSecurityMetrics());
      setActiveIdentities(securityInfrastructureService.getActiveIdentities());
      setSecurityAlerts(securityInfrastructureService.getSecurityAlerts(false));
      setSecurityPolicies(securityInfrastructureService.getSecurityPolicies());
      setAuditLogs(securityInfrastructureService.getAuditLogs(3600000)); // Last hour
      setLastUpdated(Date.now());
    };

    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "verified":
      case "allowed":
        return "bg-green-500";
      case "warning":
      case "review":
        return "bg-yellow-500";
      case "critical":
      case "denied":
      case "fraud":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-KE");
  };

  const simulateSecurityFlow = async () => {
    const testMpesaNumber = "254712345678";
    const testCounty = "nairobi";
    const testOrderAmount = 5000;

    try {
      const result = await securityInfrastructureService.simulateSecurityFlow(
        testMpesaNumber,
        testCounty,
        testOrderAmount,
      );

      console.log("🔒 Security flow simulation result:", result);

      // Refresh data after simulation
      setTimeout(() => {
        setSecurityMetrics(securityInfrastructureService.getSecurityMetrics());
        setActiveIdentities(
          securityInfrastructureService.getActiveIdentities(),
        );
        setSecurityAlerts(
          securityInfrastructureService.getSecurityAlerts(false),
        );
        setAuditLogs(securityInfrastructureService.getAuditLogs(3600000));
      }, 1000);
    } catch (error) {
      console.error("Security flow simulation failed:", error);
    }
  };

  const generateMockThreatData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      threats: Math.floor(Math.random() * 20) + 2,
      blocked: Math.floor(Math.random() * 15) + 1,
      fraudAttempts: Math.floor(Math.random() * 5),
    }));
  };

  const generateCountySecurityData = () => {
    const counties = ["nairobi", "mombasa", "kisumu", "nakuru", "eldoret"];
    return counties.map((county) => ({
      county: county.charAt(0).toUpperCase() + county.slice(1),
      activeUsers: Math.floor(Math.random() * 5000) + 1000,
      threats: Math.floor(Math.random() * 50) + 5,
      fraudScore: Math.floor(Math.random() * 30) + 10,
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🛡️ Zero-Trust Security Infrastructure
          </h1>
          <p className="text-muted-foreground">
            M-Pesa → SPIFFE → OpenPolicyAgent → Microservices Security Pipeline
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Updated: {formatTimestamp(lastUpdated)}
          </Badge>
          <Button onClick={simulateSecurityFlow} size="sm">
            🧪 Simulate Security Flow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">🏞️ Overview</TabsTrigger>
          <TabsTrigger value="identities">🆔 SPIFFE Identities</TabsTrigger>
          <TabsTrigger value="policies">📋 Security Policies</TabsTrigger>
          <TabsTrigger value="threats">🚨 Threat Detection</TabsTrigger>
          <TabsTrigger value="audit">📊 Audit & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Identities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityMetrics?.active_identities || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  SPIFFE IDs verified
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pending Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {securityMetrics?.pending_alerts || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Fraud Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(securityMetrics?.fraud_detection_rate || 0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Detection rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Policy Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {securityMetrics?.policy_violations_24h || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Counties Monitored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {securityMetrics?.counties_monitored || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Geographic coverage
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>🔐 Zero-Trust Security Flow</CardTitle>
              <p className="text-sm text-muted-foreground">
                M-Pesa authentication → SPIFFE identity → Policy evaluation →
                Service access
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">User</span>
                  <span className="text-xs text-muted-foreground">
                    M-Pesa No.
                  </span>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-4"></div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">SPIFFE ID</span>
                  <span className="text-xs text-muted-foreground">
                    Identity
                  </span>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-purple-500 mx-4"></div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">OpenPolicyAgent</span>
                  <span className="text-xs text-muted-foreground">
                    Authorization
                  </span>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-4"></div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">Microservice</span>
                  <span className="text-xs text-muted-foreground">
                    Resource
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    🇰🇪 Kenyan Authentication
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• M-Pesa number as primary identity</li>
                    <li>• SIM card age verification (90+ days)</li>
                    <li>• Fraud scoring based on transaction history</li>
                    <li>• County-based risk assessment</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    🛡️ Zero-Trust Policies
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Location velocity checks</li>
                    <li>• High-value transaction reviews</li>
                    <li>• Rural area USSD prioritization</li>
                    <li>• Dynamic risk-based controls</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Threat Activity */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Real-time Threat Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={generateMockThreatData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Total Threats"
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Blocked"
                  />
                  <Area
                    type="monotone"
                    dataKey="fraudAttempts"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    name="Fraud Attempts"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* County Security Status */}
          <Card>
            <CardHeader>
              <CardTitle>🗺️ Security Status by County</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generateCountySecurityData().map((county, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {county.county === "Nairobi"
                          ? "🏙️"
                          : county.county === "Mombasa"
                            ? "🏖️"
                            : "🌾"}{" "}
                        {county.county}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Active Users</span>
                        <span className="font-bold">
                          {county.activeUsers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Threats Detected</span>
                        <Badge
                          className={
                            county.threats > 30
                              ? "bg-red-500"
                              : county.threats > 15
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        >
                          {county.threats}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Fraud Risk Score</span>
                        <span
                          className={`font-bold ${county.fraudScore > 25 ? "text-red-600" : county.fraudScore > 15 ? "text-yellow-600" : "text-green-600"}`}
                        >
                          {county.fraudScore}/40
                        </span>
                      </div>
                      <Progress
                        value={(county.fraudScore / 40) * 100}
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🆔 Active SPIFFE Identities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Secure Production Identity Framework for Everyone - Kenyan
                implementation
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SPIFFE ID</TableHead>
                    <TableHead>M-Pesa Number</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>User Tier</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeIdentities.slice(0, 10).map((identity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {identity.id.substring(0, 40)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {identity.mpesaNumber}
                      </TableCell>
                      <TableCell className="capitalize">
                        {identity.county}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            identity.user_tier === "enterprise"
                              ? "bg-purple-500"
                              : identity.user_tier === "premium"
                                ? "bg-blue-500"
                                : identity.user_tier === "verified"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                          }`}
                        >
                          {identity.user_tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatTimestamp(identity.issued_at)}
                      </TableCell>
                      <TableCell>
                        {formatTimestamp(identity.expires_at)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            identity.verified ? "verified" : "pending",
                          )}
                        >
                          {identity.verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Identity Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>👥 User Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["basic", "verified", "premium", "enterprise"].map(
                    (tier) => {
                      const count = activeIdentities.filter(
                        (id) => id.user_tier === tier,
                      ).length;
                      const percentage =
                        activeIdentities.length > 0
                          ? (count / activeIdentities.length) * 100
                          : 0;

                      return (
                        <div key={tier} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="capitalize">{tier}</span>
                            <span className="font-bold">{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🗺️ Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["nairobi", "mombasa", "kisumu", "nakuru", "eldoret"].map(
                    (county) => {
                      const count = activeIdentities.filter(
                        (id) => id.county === county,
                      ).length;
                      const percentage =
                        activeIdentities.length > 0
                          ? (count / activeIdentities.length) * 100
                          : 0;

                      return (
                        <div key={county} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="capitalize">{county}</span>
                            <span className="font-bold">{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⏰ Identity Lifecycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active Identities</span>
                    <span className="font-bold text-green-600">
                      {activeIdentities.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiring Soon (&lt;1h)</span>
                    <span className="font-bold text-yellow-600">
                      {
                        activeIdentities.filter(
                          (id) => id.expires_at - Date.now() < 3600000,
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified Identities</span>
                    <span className="font-bold text-blue-600">
                      {activeIdentities.filter((id) => id.verified).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Lifetime</span>
                    <span className="font-bold">24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Security Policies (OpenPolicyAgent)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Kenyan-specific authorization policies for zero-trust security
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityPolicies.map((policy, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${policy.active ? "border-l-green-500" : "border-l-gray-400"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{policy.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Priority: {policy.priority}
                          </Badge>
                          <Badge
                            className={
                              policy.active ? "bg-green-500" : "bg-gray-500"
                            }
                          >
                            {policy.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {policy.description}
                      </p>

                      {policy.county_specific && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            County-specific: {policy.county_specific}
                          </span>
                        </div>
                      )}

                      {policy.mpesa_tier_required && (
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            M-Pesa tier required: {policy.mpesa_tier_required}
                          </span>
                        </div>
                      )}

                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{policy.rule}</pre>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(policy.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit Policy
                          </Button>
                          <Button
                            size="sm"
                            variant={policy.active ? "destructive" : "default"}
                          >
                            {policy.active ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚨 Active Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.length > 0 ? (
                  securityAlerts.slice(0, 10).map((alert, index) => (
                    <Alert
                      key={index}
                      className={`border-l-4 ${
                        alert.severity === "critical"
                          ? "border-l-red-500"
                          : alert.severity === "high"
                            ? "border-l-orange-500"
                            : alert.severity === "medium"
                              ? "border-l-yellow-500"
                              : "border-l-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getSeverityIcon(alert.severity)}
                            <h3 className="font-semibold">{alert.message}</h3>
                            <Badge
                              className={`${
                                alert.severity === "critical"
                                  ? "bg-red-500"
                                  : alert.severity === "high"
                                    ? "bg-orange-500"
                                    : alert.severity === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                              }`}
                            >
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.type}</Badge>
                          </div>
                          <AlertDescription>
                            <div className="space-y-1">
                              <p>🇬🇧 {alert.message}</p>
                              <p>🇰🇪 {alert.swahili_message}</p>
                              <p className="text-xs text-muted-foreground">
                                M-Pesa: {alert.mpesa_number} • Time:{" "}
                                {formatTimestamp(alert.timestamp)}
                              </p>
                            </div>
                          </AlertDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                          <Button size="sm">Resolve</Button>
                        </div>
                      </div>
                    </Alert>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <p className="text-lg font-medium">All Clear! 🌟</p>
                    <p>No active security threats detected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fraud Detection Rules */}
          <Card>
            <CardHeader>
              <CardTitle>🕵️ Fraud Detection Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      📱 New SIM Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Flags high-value orders from SIM cards less than 90 days
                      old
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className="font-bold text-red-600">85/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Action</span>
                        <Badge className="bg-red-500">Block & Review</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      🗺️ Location Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Detects impossible travel speeds (Nairobi → Mombasa in 1
                      hour)
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className="font-bold text-orange-600">
                          90/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Action</span>
                        <Badge className="bg-orange-500">
                          Additional Verification
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      💰 M-Pesa Pattern Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Analyzes unusual M-Pesa transaction patterns and dormant
                      accounts
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className="font-bold text-yellow-600">
                          75/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Action</span>
                        <Badge className="bg-yellow-500">
                          Enhanced Verification
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Security Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Audit ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 10).map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.event}</TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {JSON.stringify(log.details).substring(0, 50)}...
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📋 Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Protection (Kenya)</span>
                    <Badge className="bg-green-500">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>M-Pesa PCI DSS</span>
                    <Badge className="bg-green-500">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GDPR (EU Users)</span>
                    <Badge className="bg-green-500">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Retention</span>
                    <Badge className="bg-blue-500">30 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔍 Audit Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Events (24h)</span>
                    <span className="font-bold">{auditLogs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Events</span>
                    <span className="font-bold">
                      {
                        auditLogs.filter((log) =>
                          log.event.includes("security"),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Policy Evaluations</span>
                    <span className="font-bold">
                      {
                        auditLogs.filter((log) => log.event.includes("policy"))
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Identity Operations</span>
                    <span className="font-bold">
                      {
                        auditLogs.filter((log) => log.event.includes("spiffe"))
                          .length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Log Ingestion Rate</span>
                    <span className="font-bold text-green-600">150/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alert Response Time</span>
                    <span className="font-bold text-blue-600">&lt; 30s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Status</span>
                    <Badge className="bg-green-500">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Health</span>
                    <Badge className="bg-green-500">Optimal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
