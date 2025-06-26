import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Clock,
  Activity,
  Key,
  Smartphone,
  Globe,
  Database,
  Wifi,
  Zap,
  Ban,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface SecurityMetrics {
  overallScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  compliance: {
    gdpr: number;
    dataProtection: number;
    financial: number;
    accessibility: number;
  };
  authentication: {
    twoFactorEnabled: boolean;
    strongPasswords: number;
    suspiciousLogins: number;
    failedAttempts: number;
  };
  dataProtection: {
    encryptedData: number;
    backupStatus: "healthy" | "warning" | "critical";
    lastBackup: string;
    retention: number;
  };
}

interface SecurityAlert {
  id: string;
  type:
    | "authentication"
    | "data_breach"
    | "suspicious_activity"
    | "compliance"
    | "vulnerability";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  timestamp: string;
  status: "active" | "investigating" | "resolved" | "dismissed";
  affectedUsers?: number;
  location?: string;
  remediation?: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  category: "data_protection" | "financial" | "accessibility" | "security";
  status: "compliant" | "non_compliant" | "pending" | "not_applicable";
  lastChecked: string;
  description: string;
  requirements: string[];
  actions: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  result: "success" | "failure" | "warning";
  details?: any;
}

const SecurityScoreCard = ({ metrics }: { metrics: SecurityMetrics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Shield className="h-6 w-6 text-green-600" />
          <span>Security Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div
          className={`text-4xl font-bold mb-2 ${getScoreColor(metrics.overallScore)}`}
        >
          {metrics.overallScore}/100
        </div>
        <Badge
          className={`mb-4 ${
            metrics.overallScore >= 90
              ? "bg-green-100 text-green-800"
              : metrics.overallScore >= 70
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {getScoreLabel(metrics.overallScore)}
        </Badge>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Authentication</span>
              <span>
                {metrics.authentication.twoFactorEnabled ? "95%" : "60%"}
              </span>
            </div>
            <Progress
              value={metrics.authentication.twoFactorEnabled ? 95 : 60}
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Data Protection</span>
              <span>{metrics.dataProtection.encryptedData}%</span>
            </div>
            <Progress
              value={metrics.dataProtection.encryptedData}
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Compliance</span>
              <span>
                {Math.round(
                  (metrics.compliance.gdpr +
                    metrics.compliance.dataProtection) /
                    2,
                )}
                %
              </span>
            </div>
            <Progress
              value={Math.round(
                (metrics.compliance.gdpr + metrics.compliance.dataProtection) /
                  2,
              )}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SecurityAlertCard = ({
  alert,
  onInvestigate,
  onResolve,
  onDismiss,
}: {
  alert: SecurityAlert;
  onInvestigate: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "authentication":
        return <Key className="h-4 w-4" />;
      case "data_breach":
        return <Database className="h-4 w-4" />;
      case "suspicious_activity":
        return <Eye className="h-4 w-4" />;
      case "compliance":
        return <FileText className="h-4 w-4" />;
      case "vulnerability":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
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
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getTypeIcon(alert.type)}</div>
            <div className="flex-1">
              <h4 className="font-medium">{alert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>

              <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
                {alert.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {alert.location}
                    </span>
                  </>
                )}
                {alert.affectedUsers && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {alert.affectedUsers} users
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(alert.status)}>
              {alert.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        {alert.remediation && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <p className="text-sm text-blue-800">
              <strong>Recommended Action:</strong> {alert.remediation}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {alert.status === "active" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onInvestigate(alert.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Investigate
              </Button>
              <Button
                size="sm"
                onClick={() => onResolve(alert.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolve
              </Button>
            </>
          )}
          {alert.status !== "dismissed" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(alert.id)}
            >
              <Ban className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ComplianceTracker = ({ checks }: { checks: ComplianceCheck[] }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "non_compliant":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "not_applicable":
        return <Ban className="h-4 w-4 text-gray-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "not_applicable":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = Array.from(new Set(checks.map((check) => check.category)));

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-medium capitalize mb-4">
            {category.replace("_", " ")} Compliance
          </h3>
          <div className="space-y-3">
            {checks
              .filter((check) => check.category === category)
              .map((check) => (
                <Card key={check.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(check.status)}
                        <div className="flex-1">
                          <h4 className="font-medium">{check.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {check.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Last checked:{" "}
                            {new Date(check.lastChecked).toLocaleDateString()}
                          </p>

                          {check.requirements.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-1">
                                Requirements:
                              </p>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {check.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {check.actions.length > 0 &&
                            check.status === "non_compliant" && (
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-1">
                                  Required Actions:
                                </p>
                                <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                                  {check.actions.map((action, index) => (
                                    <li key={index}>{action}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>

                      <Badge className={getStatusColor(check.status)}>
                        {check.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AuditLogViewer = ({ logs }: { logs: AuditLog[] }) => {
  const [filterResult, setFilterResult] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesResult = filterResult === "all" || log.result === filterResult;
    const matchesAction =
      filterAction === "all" ||
      log.action.toLowerCase().includes(filterAction.toLowerCase());
    return matchesResult && matchesAction;
  });

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failure":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failure":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Results</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="warning">Warning</option>
        </select>

        <input
          type="text"
          placeholder="Filter by action..."
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 border rounded-md flex-1"
        />
      </div>

      {/* Logs */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getResultIcon(log.result)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">
                        {log.resource}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span>User: {log.user}</span>
                      <span className="mx-2">•</span>
                      <span>IP: {log.ipAddress}</span>
                      <span className="mx-2">•</span>
                      <span>{log.location}</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Badge className={getResultColor(log.result)}>
                  {log.result.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const SecurityDashboard = () => {
  const [securityMetrics, setSecurityMetrics] =
    useState<SecurityMetrics | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>(
    [],
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  // Mock data initialization
  useEffect(() => {
    const mockMetrics: SecurityMetrics = {
      overallScore: 78,
      vulnerabilities: { critical: 0, high: 2, medium: 5, low: 8 },
      compliance: {
        gdpr: 85,
        dataProtection: 92,
        financial: 88,
        accessibility: 76,
      },
      authentication: {
        twoFactorEnabled: true,
        strongPasswords: 89,
        suspiciousLogins: 3,
        failedAttempts: 12,
      },
      dataProtection: {
        encryptedData: 94,
        backupStatus: "healthy",
        lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        retention: 98,
      },
    };

    const mockAlerts: SecurityAlert[] = [
      {
        id: "alert_001",
        type: "suspicious_activity",
        severity: "high",
        title: "Multiple failed login attempts",
        description:
          "User account has experienced 15 failed login attempts in the last hour",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: "active",
        affectedUsers: 1,
        location: "Nairobi, Kenya",
        remediation:
          "Consider temporarily locking the account and requiring password reset",
      },
      {
        id: "alert_002",
        type: "compliance",
        severity: "medium",
        title: "Data retention policy update required",
        description:
          "Current data retention settings may not comply with latest GDPR requirements",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "investigating",
        remediation:
          "Review and update data retention policies to ensure GDPR compliance",
      },
    ];

    const mockCompliance: ComplianceCheck[] = [
      {
        id: "comp_001",
        name: "GDPR Data Processing",
        category: "data_protection",
        status: "compliant",
        lastChecked: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        description:
          "Ensure all personal data processing complies with GDPR requirements",
        requirements: [
          "Obtain explicit consent for data processing",
          "Provide clear privacy notices",
          "Implement data subject rights",
          "Maintain processing records",
        ],
        actions: [],
      },
      {
        id: "comp_002",
        name: "PCI DSS Payment Security",
        category: "financial",
        status: "pending",
        lastChecked: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        description: "Payment card data security standards compliance",
        requirements: [
          "Encrypt cardholder data",
          "Secure payment processing",
          "Regular security testing",
          "Access controls",
        ],
        actions: [
          "Complete annual PCI DSS assessment",
          "Update payment processing documentation",
        ],
      },
    ];

    const mockAuditLogs: AuditLog[] = [
      {
        id: "audit_001",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        user: "john.doe@example.com",
        action: "User Login",
        resource: "Authentication System",
        ipAddress: "197.248.12.45",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Nairobi, Kenya",
        result: "success",
      },
      {
        id: "audit_002",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        user: "jane.smith@example.com",
        action: "Order Creation",
        resource: "Order #12345",
        ipAddress: "197.248.15.32",
        userAgent: "Mozilla/5.0 (Android 11; Mobile)",
        location: "Mombasa, Kenya",
        result: "success",
      },
      {
        id: "audit_003",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: "admin@example.com",
        action: "Failed Login Attempt",
        resource: "Authentication System",
        ipAddress: "41.90.67.123",
        userAgent: "curl/7.68.0",
        location: "Unknown",
        result: "failure",
      },
    ];

    setSecurityMetrics(mockMetrics);
    setSecurityAlerts(mockAlerts);
    setComplianceChecks(mockCompliance);
    setAuditLogs(mockAuditLogs);
  }, []);

  const handleInvestigateAlert = (alertId: string) => {
    setSecurityAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "investigating" as const }
          : alert,
      ),
    );

    toast({
      title: "Investigation started",
      description: "Security alert is being investigated",
    });
  };

  const handleResolveAlert = (alertId: string) => {
    setSecurityAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "resolved" as const }
          : alert,
      ),
    );

    toast({
      title: "Alert resolved ✅",
      description: "Security alert has been marked as resolved",
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setSecurityAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "dismissed" as const }
          : alert,
      ),
    );

    toast({
      title: "Alert dismissed",
      description: "Security alert has been dismissed",
    });
  };

  const activeAlerts = securityAlerts.filter(
    (alert) => alert.status === "active",
  ).length;
  const criticalAlerts = securityAlerts.filter(
    (alert) => alert.severity === "critical",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Shield className="h-8 w-8 text-green-600" />
            <span>Security & Compliance</span>
          </h1>
          <p className="text-gray-600">
            Comprehensive security monitoring and compliance management for
            African markets
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Run Security Scan
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Security Alert:</strong> You have {criticalAlerts}{" "}
            critical security {criticalAlerts === 1 ? "issue" : "issues"} that
            require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Security Score */}
        <div className="lg:col-span-1">
          {securityMetrics && <SecurityScoreCard metrics={securityMetrics} />}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts" className="relative">
                Alerts
                {activeAlerts > 0 && (
                  <Badge className="ml-2 bg-red-600 text-white text-xs">
                    {activeAlerts}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Threats</p>
                        <p className="text-2xl font-bold text-red-600">
                          {activeAlerts}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">2FA Adoption</p>
                        <p className="text-2xl font-bold text-green-600">
                          {securityMetrics?.authentication.strongPasswords}%
                        </p>
                      </div>
                      <Key className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Data Encrypted</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {securityMetrics?.dataProtection.encryptedData}%
                        </p>
                      </div>
                      <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Alerts Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityAlerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`${
                              alert.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : alert.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="space-y-4">
                {securityAlerts.length > 0 ? (
                  securityAlerts.map((alert) => (
                    <SecurityAlertCard
                      key={alert.id}
                      alert={alert}
                      onInvestigate={handleInvestigateAlert}
                      onResolve={handleResolveAlert}
                      onDismiss={handleDismissAlert}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-20">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                      <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                      <p className="text-gray-600">No active security alerts</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <ComplianceTracker checks={complianceChecks} />
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <AuditLogViewer logs={auditLogs} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
