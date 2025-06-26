import { useState } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Lock,
  Key,
  Users,
  Activity,
  Zap,
} from "lucide-react";

const Settings = () => {
  // Regional configuration state
  const [regionalConfig, setRegionalConfig] = useState({
    primaryMarket: "Kenya",
    supportedCurrencies: "KSH, USD, UGX, TZS",
    languages: "English, Swahili, French",
    timeZone: "Africa/Nairobi (GMT+3)",
  });

  // API management state
  const [apiConfig, setApiConfig] = useState({
    rateLimit: "1000 requests/hour",
    version: "v2.1.0",
  });

  const handleRegionalChange = (field: string, value: string) => {
    setRegionalConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApiChange = (field: string, value: string) => {
    setApiConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const platformSettings = [
    {
      label: "Real-time Notifications",
      description: "Instant alerts for critical platform events",
      enabled: true,
    },
    {
      label: "AI-Powered Insights",
      description: "Machine learning recommendations and predictions",
      enabled: true,
    },
    {
      label: "Cross-Border Trading",
      description: "Enable international trade features",
      enabled: true,
    },
    {
      label: "Advanced Analytics",
      description: "Deep dive analytics and custom reporting",
      enabled: false,
    },
    {
      label: "White-label Options",
      description: "Custom branding for enterprise clients",
      enabled: false,
    },
  ];

  const securitySettings = [
    {
      label: "Two-Factor Authentication",
      description: "Enhanced security for admin access",
      enabled: true,
    },
    {
      label: "IP Whitelist",
      description: "Restrict access to specific IP addresses",
      enabled: false,
    },
    {
      label: "Session Timeout",
      description: "Automatic logout after inactivity",
      enabled: true,
    },
    {
      label: "API Rate Limiting",
      description: "Control API access frequency",
      enabled: true,
    },
    {
      label: "Audit Logging",
      description: "Comprehensive activity tracking",
      enabled: true,
    },
  ];

  const integrationModules = [
    {
      name: "ERP Systems",
      description: "SAP, Oracle, Microsoft Dynamics integration",
      status: "Connected",
      connections: 23,
    },
    {
      name: "Payment Gateways",
      description: "M-Pesa, PayPal, Stripe, local banking APIs",
      status: "Active",
      connections: 8,
    },
    {
      name: "Logistics Partners",
      description: "DHL, FedEx, local courier services",
      status: "Active",
      connections: 15,
    },
    {
      name: "Government APIs",
      description: "Customs, taxation, regulatory compliance",
      status: "Pending",
      connections: 4,
    },
  ];

  const userRoles = [
    {
      role: "Platform Administrator",
      users: 5,
      permissions: "Full system access",
    },
    {
      role: "Regional Manager",
      users: 12,
      permissions: "Regional operations management",
    },
    {
      role: "Analytics Manager",
      users: 8,
      permissions: "Data and reporting access",
    },
    {
      role: "Partner Manager",
      users: 15,
      permissions: "Partner relationship management",
    },
    {
      role: "Support Agent",
      users: 25,
      permissions: "Customer support functions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Platform Configuration
          </h1>
          <p className="text-muted-foreground text-lg">
            Enterprise-level system administration and configuration management
          </p>
        </div>

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="platform">Platform Settings</TabsTrigger>
            <TabsTrigger value="security">Security & Access</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <SettingsIcon className="h-5 w-5" />
                    <span>Core Platform Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformSettings.map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium">{setting.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <Switch checked={setting.enabled} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Regional Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Primary Market
                      </label>
                      <Input
                        value={regionalConfig.primaryMarket}
                        onChange={(e) =>
                          handleRegionalChange("primaryMarket", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Supported Currencies
                      </label>
                      <Input
                        value={regionalConfig.supportedCurrencies}
                        onChange={(e) =>
                          handleRegionalChange(
                            "supportedCurrencies",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Languages</label>
                      <Input
                        value={regionalConfig.languages}
                        onChange={(e) =>
                          handleRegionalChange("languages", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time Zone</label>
                      <Input
                        value={regionalConfig.timeZone}
                        onChange={(e) =>
                          handleRegionalChange("timeZone", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Performance Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      99.8%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Platform Uptime
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      1.2s
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average Response Time
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      2.4M
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Daily API Calls
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securitySettings.map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium">{setting.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            setting.enabled ? "bg-green-500" : "bg-gray-500"
                          }
                        >
                          {setting.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch checked={setting.enabled} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>API Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        API Rate Limit
                      </label>
                      <Input
                        value={apiConfig.rateLimit}
                        onChange={(e) =>
                          handleApiChange("rateLimit", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">API Version</label>
                      <Input
                        value={apiConfig.version}
                        onChange={(e) =>
                          handleApiChange("version", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full">Regenerate API Keys</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Compliance & Audit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>GDPR Compliance</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SOC 2 Type II</span>
                      <Badge className="bg-green-500">Certified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ISO 27001</span>
                      <Badge className="bg-green-500">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>PCI DSS</span>
                      <Badge className="bg-green-500">Level 1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6">
              {integrationModules.map((integration, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                      <Badge
                        className={
                          integration.status === "Connected" ||
                          integration.status === "Active"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Connections
                        </p>
                        <p className="font-bold">{integration.connections}</p>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Roles & Permissions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRoles.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{role.role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {role.permissions}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-bold">{role.users}</p>
                          <p className="text-xs text-muted-foreground">Users</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Active Users</span>
                      <span className="font-bold">65</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Users (This Month)</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Login Sessions Today</span>
                      <span className="font-bold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed Login Attempts</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">Add New User</Button>
                    <Button variant="outline" className="w-full">
                      Bulk User Import
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export User Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Reset Passwords
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>CPU Usage</span>
                      <Badge className="bg-green-500">23%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Memory Usage</span>
                      <Badge className="bg-green-500">45%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage</span>
                      <Badge className="bg-yellow-500">78%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Network</span>
                      <Badge className="bg-green-500">Normal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Database Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Primary DB</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Replica DB</span>
                      <Badge className="bg-green-500">Synced</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cache</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Backup</span>
                      <Badge className="bg-green-500">24h ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>System Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        All systems operational
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        Scheduled maintenance in 3 days
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      View All Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Scheduled Tasks</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Database Backup</span>
                        <Badge variant="outline">Daily 2:00 AM</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Log Rotation</span>
                        <Badge variant="outline">Weekly</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Scan</span>
                        <Badge variant="outline">Daily</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Emergency Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Force Cache Clear
                      </Button>
                      <Button variant="outline" className="w-full">
                        Restart Services
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Emergency Shutdown
                      </Button>
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

export default Settings;
