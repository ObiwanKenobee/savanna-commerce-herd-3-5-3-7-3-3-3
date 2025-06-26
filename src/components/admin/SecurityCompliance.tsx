import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
  FileText,
  Lock,
  Users,
  Globe,
  Database,
  Zap,
} from "lucide-react";

interface SecurityAlert {
  id: string;
  type: "fraud" | "suspicious" | "policy" | "data_breach" | "authentication";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedUsers: number;
  timestamp: string;
  status: "open" | "investigating" | "resolved" | "false_positive";
  riskScore: number;
}

interface VultureWatchDetection {
  id: string;
  pattern: string;
  confidence: number;
  supplierId: string;
  supplierName: string;
  details: string;
  detectedAt: string;
  actions: string[];
  falsePositiveRate: number;
}

interface ComplianceRule {
  id: string;
  name: string;
  type: "GDPR" | "KYC" | "Data_Protection" | "Financial" | "Content";
  region: string;
  status: "active" | "draft" | "review";
  lastUpdated: string;
  compliance: number;
  violations: number;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  target: string;
  timestamp: string;
  result: "success" | "failed" | "warning";
  ipAddress: string;
  details: string;
}

interface DisputeCase {
  id: string;
  type: "payment" | "delivery" | "quality" | "service" | "contract";
  parties: {
    complainant: string;
    respondent: string;
  };
  amount: number;
  description: string;
  status: "open" | "mediation" | "arbitration" | "resolved" | "escalated";
  priority: "low" | "medium" | "high" | "urgent";
  submittedAt: string;
  mediator?: string;
}

const SecurityCompliance = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [gdprMode, setGdprMode] = useState(false);

  const securityAlerts: SecurityAlert[] = [
    {
      id: "1",
      type: "fraud",
      severity: "high",
      title: "Vulture Watch: Suspicious Pricing Pattern",
      description:
        'Supplier "Quick Cash Ltd" shows coordinated price manipulation',
      affectedUsers: 1,
      timestamp: "2 hours ago",
      status: "investigating",
      riskScore: 87,
    },
    {
      id: "2",
      type: "suspicious",
      severity: "medium",
      title: "Multiple Failed Login Attempts",
      description: 'User account "mama.mboga@gmail.com" - 15 failed attempts',
      affectedUsers: 1,
      timestamp: "4 hours ago",
      status: "open",
      riskScore: 64,
    },
    {
      id: "3",
      type: "data_breach",
      severity: "critical",
      title: "Unauthorized Data Access Attempt",
      description:
        "SQL injection attempt on user database detected and blocked",
      affectedUsers: 0,
      timestamp: "6 hours ago",
      status: "resolved",
      riskScore: 95,
    },
  ];

  const vultureDetections: VultureWatchDetection[] = [
    {
      id: "1",
      pattern: "Fake Review Farming",
      confidence: 94,
      supplierId: "SUP001",
      supplierName: "Suspicious Produce Co.",
      details: "AI detected 47 fake positive reviews from bot accounts",
      detectedAt: "3 hours ago",
      actions: ["Account Flagged", "Reviews Hidden", "Supplier Notified"],
      falsePositiveRate: 2.3,
    },
    {
      id: "2",
      pattern: "Price Coordination Scheme",
      confidence: 89,
      supplierId: "SUP002",
      supplierName: "Coordinated Cartel Ltd.",
      details:
        "Synchronized price changes across multiple suppliers in maize category",
      detectedAt: "5 hours ago",
      actions: ["Investigation Started", "Prices Monitored"],
      falsePositiveRate: 5.1,
    },
  ];

  const complianceRules: ComplianceRule[] = [
    {
      id: "1",
      name: "GDPR Data Protection",
      type: "GDPR",
      region: "EU",
      status: "active",
      lastUpdated: "2024-01-15",
      compliance: 96,
      violations: 2,
    },
    {
      id: "2",
      name: "Kenya Data Protection Act",
      type: "Data_Protection",
      region: "Kenya",
      status: "active",
      lastUpdated: "2024-01-20",
      compliance: 89,
      violations: 5,
    },
    {
      id: "3",
      name: "Anti-Money Laundering (AML)",
      type: "Financial",
      region: "East Africa",
      status: "active",
      lastUpdated: "2024-01-18",
      compliance: 92,
      violations: 3,
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "1",
      action: "User Data Export",
      user: "admin@savanna.com",
      role: "Super Admin",
      target: "User ID: 12345",
      timestamp: "2024-01-20 14:30:00",
      result: "success",
      ipAddress: "192.168.1.100",
      details: "GDPR data export request processed",
    },
    {
      id: "2",
      action: "Supplier Suspension",
      user: "moderator@savanna.com",
      role: "Content Moderator",
      target: "Supplier ID: SUP001",
      timestamp: "2024-01-20 13:45:00",
      result: "success",
      ipAddress: "192.168.1.101",
      details: "Suspended for policy violations",
    },
  ];

  const disputeCases: DisputeCase[] = [
    {
      id: "1",
      type: "quality",
      parties: {
        complainant: "Retail Plus Ltd",
        respondent: "Fresh Farm Co.",
      },
      amount: 45000,
      description: "Delivered maize quality below agreed standards",
      status: "mediation",
      priority: "high",
      submittedAt: "2024-01-19",
      mediator: "Sarah Wairimu",
    },
    {
      id: "2",
      type: "payment",
      parties: {
        complainant: "Dairy Dreams",
        respondent: "Kiosk Network",
      },
      amount: 23000,
      description: "Payment delayed beyond agreed terms",
      status: "open",
      priority: "medium",
      submittedAt: "2024-01-20",
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "success":
        return "bg-green-100 text-green-800";
      case "investigating":
      case "mediation":
        return "bg-blue-100 text-blue-800";
      case "open":
      case "failed":
        return "bg-red-100 text-red-800";
      case "false_positive":
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🦏 Rhino Guard</h1>
          <p className="text-muted-foreground">
            Prevent fraud and ensure data protection across the savanna
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Security Report
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Threat Analysis
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Threat Level
                </p>
                <p className="text-2xl font-bold text-green-600">Low</p>
              </div>
              <div className="text-2xl">🦏</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold text-orange-600">7</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fraud Prevented
                </p>
                <p className="text-2xl font-bold text-red-600">KSH 234K</p>
              </div>
              <div className="text-2xl">🦅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Compliance Score
                </p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vulture" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vulture">🦅 Vulture Watch</TabsTrigger>
          <TabsTrigger value="alerts">⚠️ Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">📋 Compliance</TabsTrigger>
          <TabsTrigger value="audit">📝 Audit Logs</TabsTrigger>
          <TabsTrigger value="disputes">⚖️ Waterhole Court</TabsTrigger>
        </TabsList>

        <TabsContent value="vulture" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🦅 Vulture Watch AI - Fraud Detection Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      Growth Lever: Reduce chargebacks by 30%
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    AI detects suspicious patterns like fake listings, review
                    manipulation, and price coordination before they impact the
                    marketplace.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">97.3%</p>
                      <p className="text-sm text-muted-foreground">
                        Detection Accuracy
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">2.1%</p>
                      <p className="text-sm text-muted-foreground">
                        False Positive Rate
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">156</p>
                      <p className="text-sm text-muted-foreground">
                        Threats Blocked Today
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {vultureDetections.map((detection) => (
                    <Card
                      key={detection.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">
                              {detection.pattern}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {detection.supplierName} (ID:{" "}
                              {detection.supplierId})
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-1">
                              {detection.confidence}% confident
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {detection.detectedAt}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm mb-3">{detection.details}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {detection.actions.map((action) => (
                            <Badge
                              key={action}
                              variant="outline"
                              className="text-xs"
                            >
                              {action}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            False Positive Rate: {detection.falsePositiveRate}%
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Take Action
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter Alerts
              </Button>
            </div>

            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1 capitalize">
                          {alert.type.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Affected Users:
                        </span>
                        <span className="ml-1 font-medium">
                          {alert.affectedUsers}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Risk Score:
                        </span>
                        <span
                          className={`ml-1 font-medium ${
                            alert.riskScore > 80
                              ? "text-red-600"
                              : alert.riskScore > 60
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {alert.riskScore}/100
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1">{alert.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-3 w-3 mr-1" />
                        False Positive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 GDPR/KYC Compliance Toggle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Switch between Kenyan/EU data rules for expansion prep
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm">Kenyan Regulations</span>
                    <Switch checked={gdprMode} onCheckedChange={setGdprMode} />
                    <span className="text-sm">EU GDPR Mode</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {complianceRules.map((rule) => (
                    <Card
                      key={rule.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {rule.type} • {rule.region}
                            </p>
                          </div>
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Last Updated:
                            </span>
                            <span className="ml-1">{rule.lastUpdated}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Compliance:
                            </span>
                            <span className="ml-1 font-medium text-green-600">
                              {rule.compliance}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Violations:
                            </span>
                            <span className="ml-1 font-medium text-red-600">
                              {rule.violations}
                            </span>
                          </div>
                        </div>

                        <Progress
                          value={rule.compliance}
                          className="h-2 mb-3"
                        />

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Compliance Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📝 Admin Activity Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    Track all admin actions for accountability and security
                    compliance.
                  </p>
                </div>

                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(log.result)}>
                            {log.result}
                          </Badge>
                          <span className="font-medium">{log.action}</span>
                          <span className="text-sm text-muted-foreground">
                            by {log.user}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Target: {log.target} • IP: {log.ipAddress}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {log.details}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disputes" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚖️ Waterhole Court - Dispute Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">
                      Mediate "waterhole" negotiations between suppliers and
                      buyers
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    AI-powered dispute resolution with human mediators for
                    complex cases.
                  </p>
                </div>

                <div className="space-y-4">
                  {disputeCases.map((dispute) => (
                    <Card
                      key={dispute.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">
                              Case #{dispute.id}
                            </h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {dispute.type.replace("_", " ")} Dispute
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getPriorityColor(dispute.priority)}
                            >
                              {dispute.priority}
                            </Badge>
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Complainant:
                            </span>
                            <span className="ml-1 font-medium">
                              {dispute.parties.complainant}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Respondent:
                            </span>
                            <span className="ml-1 font-medium">
                              {dispute.parties.respondent}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Amount:
                            </span>
                            <span className="ml-1 font-medium">
                              KSH {dispute.amount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Submitted:
                            </span>
                            <span className="ml-1">{dispute.submittedAt}</span>
                          </div>
                        </div>

                        <p className="text-sm mb-3">{dispute.description}</p>

                        {dispute.mediator && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                            <span className="text-sm text-blue-800">
                              👩‍⚖️ Mediator: {dispute.mediator}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Review Case
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            Assign Mediator
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default SecurityCompliance;
