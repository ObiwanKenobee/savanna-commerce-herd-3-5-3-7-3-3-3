import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Eye,
  Lock,
  Users,
  MapPin,
  Clock,
} from "lucide-react";

interface DefenseLayer {
  id: string;
  name: string;
  type: "perimeter" | "detection" | "response" | "recovery";
  status: "active" | "compromised" | "maintenance" | "standby";
  effectiveness: number;
  lastUpdate: string;
  threatsBlocked: number;
  culturalBasis: string;
  modernTech: string;
}

interface SecurityIncident {
  id: string;
  type:
    | "intrusion"
    | "data-breach"
    | "malware"
    | "social-engineering"
    | "physical";
  severity: "low" | "medium" | "high" | "critical";
  status: "detected" | "investigating" | "contained" | "resolved";
  description: string;
  detectedBy: string;
  timestamp: string;
  affectedSystems: string[];
  responseTime: number;
  resolution: string;
}

interface DefenseMetrics {
  totalThreats: number;
  blockedThreats: number;
  activeIncidents: number;
  responseTime: number;
  systemUptime: number;
  culturalDefenseScore: number;
}

export const EarthenFirewall = () => {
  const [defenseLayers, setDefenseLayers] = useState<DefenseLayer[]>([
    {
      id: "layer-001",
      name: "Acacia Thorn Perimeter",
      type: "perimeter",
      status: "active",
      effectiveness: 94,
      lastUpdate: "2 minutes ago",
      threatsBlocked: 1247,
      culturalBasis: "Traditional thorn fence protection",
      modernTech: "AI-powered network perimeter security",
    },
    {
      id: "layer-002",
      name: "Hyena Pack Detection",
      type: "detection",
      status: "active",
      effectiveness: 97,
      lastUpdate: "1 minute ago",
      threatsBlocked: 892,
      culturalBasis: "Pack hunting vigilance patterns",
      modernTech: "ML threat detection algorithms",
    },
    {
      id: "layer-003",
      name: "Warrior Response Team",
      type: "response",
      status: "active",
      effectiveness: 91,
      lastUpdate: "5 minutes ago",
      threatsBlocked: 456,
      culturalBasis: "Age-grade warrior system",
      modernTech: "Automated incident response",
    },
    {
      id: "layer-004",
      name: "Village Elder Recovery",
      type: "recovery",
      status: "standby",
      effectiveness: 88,
      lastUpdate: "10 minutes ago",
      threatsBlocked: 234,
      culturalBasis: "Community healing practices",
      modernTech: "Disaster recovery automation",
    },
    {
      id: "layer-005",
      name: "Baobab Wisdom Cache",
      type: "detection",
      status: "maintenance",
      effectiveness: 0,
      lastUpdate: "2 hours ago",
      threatsBlocked: 178,
      culturalBasis: "Ancient knowledge storage",
      modernTech: "Behavioral analysis engine",
    },
  ]);

  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: "incident-001",
      type: "intrusion",
      severity: "high",
      status: "contained",
      description: "Suspicious network scanning from external IP range",
      detectedBy: "Hyena Pack Detection",
      timestamp: "15 minutes ago",
      affectedSystems: ["API Gateway", "User Database"],
      responseTime: 3.2,
      resolution: "IP range blocked, enhanced monitoring activated",
    },
    {
      id: "incident-002",
      type: "malware",
      severity: "medium",
      status: "resolved",
      description: "Malicious payload detected in file upload",
      detectedBy: "Acacia Thorn Perimeter",
      timestamp: "2 hours ago",
      affectedSystems: ["File Storage"],
      responseTime: 1.8,
      resolution: "File quarantined, system scan completed",
    },
    {
      id: "incident-003",
      type: "social-engineering",
      severity: "low",
      status: "investigating",
      description: "Phishing attempt targeting admin accounts",
      detectedBy: "Warrior Response Team",
      timestamp: "4 hours ago",
      affectedSystems: ["Email System"],
      responseTime: 0.5,
      resolution: "User training initiated, emails blocked",
    },
    {
      id: "incident-004",
      type: "data-breach",
      severity: "critical",
      status: "detected",
      description: "Unauthorized access attempt to user data",
      detectedBy: "Hyena Pack Detection",
      timestamp: "5 minutes ago",
      affectedSystems: ["User Database", "Authentication"],
      responseTime: 0,
      resolution: "Immediate containment protocol activated",
    },
  ]);

  const [metrics, setMetrics] = useState<DefenseMetrics>({
    totalThreats: 3247,
    blockedThreats: 3189,
    activeIncidents: 2,
    responseTime: 1.8,
    systemUptime: 99.7,
    culturalDefenseScore: 92,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 5),
        blockedThreats: prev.blockedThreats + Math.floor(Math.random() * 4),
      }));

      // Update defense layer metrics
      setDefenseLayers((prev) =>
        prev.map((layer) => ({
          ...layer,
          threatsBlocked:
            layer.status === "active"
              ? layer.threatsBlocked + Math.floor(Math.random() * 2)
              : layer.threatsBlocked,
        })),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "resolved":
        return "text-green-600 bg-green-100";
      case "maintenance":
      case "investigating":
        return "text-yellow-600 bg-yellow-100";
      case "compromised":
      case "detected":
        return "text-red-600 bg-red-100";
      case "standby":
      case "contained":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "perimeter":
        return "🛡️";
      case "detection":
        return "👁️";
      case "response":
        return "⚔️";
      case "recovery":
        return "🌿";
      default:
        return "🔒";
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "intrusion":
        return "🚪";
      case "malware":
        return "🦠";
      case "data-breach":
        return "📊";
      case "social-engineering":
        return "🎣";
      case "physical":
        return "🏢";
      default:
        return "⚠️";
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.totalThreats}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.blockedThreats}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.activeIncidents}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.responseTime}s
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.systemUptime}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultural Score</p>
                <p className="text-2xl font-bold text-amber-600">
                  {metrics.culturalDefenseScore}
                </p>
              </div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Defense Layers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Earthen Firewall Defense Layers (Benin City Walls Inspired)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defenseLayers.map((layer) => (
              <Card key={layer.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getTypeIcon(layer.type)}
                        </span>
                        <h3 className="font-semibold">{layer.name}</h3>
                        <Badge variant="secondary">{layer.type}</Badge>
                        <Badge className={getStatusColor(layer.status)}>
                          {layer.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Cultural Basis
                          </p>
                          <p className="font-medium">{layer.culturalBasis}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Modern Technology
                          </p>
                          <p className="font-medium">{layer.modernTech}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Threats Blocked
                          </p>
                          <p className="font-medium">{layer.threatsBlocked}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Effectiveness</p>
                          <p className="font-medium">{layer.effectiveness}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Update</p>
                          <p className="font-medium">{layer.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Layer Effectiveness</span>
                      <span>{layer.effectiveness}%</span>
                    </div>
                    <Progress value={layer.effectiveness} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Security Incidents & Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getIncidentIcon(incident.type)}
                      </span>
                      <span className="font-medium capitalize">
                        {incident.type.replace("-", " ")}
                      </span>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>

                    <p className="text-sm mb-2">{incident.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Detected By</p>
                        <p className="font-medium">{incident.detectedBy}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-medium">{incident.responseTime}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Affected Systems
                        </p>
                        <p className="font-medium">
                          {incident.affectedSystems.length} systems
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timestamp</p>
                        <p className="font-medium">{incident.timestamp}</p>
                      </div>
                    </div>

                    {incident.resolution && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                        <strong>Resolution:</strong> {incident.resolution}
                      </div>
                    )}

                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        Affected Systems:
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident.affectedSystems.map((system, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {incident.status === "resolved" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {incident.status === "detected" && (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    {incident.status === "investigating" && (
                      <Eye className="h-5 w-5 text-yellow-600" />
                    )}
                    {incident.status === "contained" && (
                      <Lock className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Security Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Deploy Defense
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Incident Response
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              System Scan
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Security Training
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Threat Intelligence
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Geo-blocking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
