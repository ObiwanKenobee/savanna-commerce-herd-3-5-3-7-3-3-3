import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Key,
  Code,
  Globe,
  Smartphone,
  CreditCard,
  Truck,
  MessageCircle,
  Mail,
  BarChart3,
  Cloud,
  Database,
  Wifi,
  Lock,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  Activity,
  Clock,
  Users,
  Target,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Integration {
  id: string;
  name: string;
  category:
    | "payment"
    | "logistics"
    | "communication"
    | "analytics"
    | "erp"
    | "crm"
    | "storage";
  provider: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "error" | "pending";
  isActive: boolean;
  config: Record<string, any>;
  lastSync?: string;
  endpoints: string[];
  rateLimit: {
    limit: number;
    remaining: number;
    resetTime: string;
  };
  usage: {
    thisMonth: number;
    lastMonth: number;
    limit: number;
  };
  documentation: string;
  webhooks?: Array<{
    id: string;
    url: string;
    events: string[];
    status: "active" | "inactive";
  }>;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  expiresAt?: string;
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  status: "success" | "failed" | "pending";
  attempts: number;
  payload: any;
  response?: any;
}

const IntegrationCard = ({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
  onSync,
}: {
  integration: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConfigure: (id: string) => void;
  onSync: (id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "text-green-600";
      case "logistics":
        return "text-blue-600";
      case "communication":
        return "text-purple-600";
      case "analytics":
        return "text-orange-600";
      case "erp":
        return "text-indigo-600";
      case "crm":
        return "text-pink-600";
      case "storage":
        return "text-teal-600";
      default:
        return "text-gray-600";
    }
  };

  const usagePercentage =
    (integration.usage.thisMonth / integration.usage.limit) * 100;
  const rateLimitPercentage =
    ((integration.rateLimit.limit - integration.rateLimit.remaining) /
      integration.rateLimit.limit) *
    100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${getCategoryColor(integration.category)} bg-opacity-10`}
            >
              {integration.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <p className="text-sm text-gray-600">{integration.provider}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {integration.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(integration.status)}>
              {integration.status}
            </Badge>
            <Switch
              checked={integration.isActive}
              onCheckedChange={() =>
                integration.status === "connected"
                  ? onDisconnect(integration.id)
                  : onConnect(integration.id)
              }
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {integration.description}
        </p>

        {/* Usage Stats */}
        {integration.status === "connected" && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly Usage</span>
                <span>
                  {integration.usage.thisMonth}/{integration.usage.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    usagePercentage > 90
                      ? "bg-red-500"
                      : usagePercentage > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Rate Limit</span>
                <span>
                  {integration.rateLimit.remaining}/
                  {integration.rateLimit.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    rateLimitPercentage > 90
                      ? "bg-red-500"
                      : rateLimitPercentage > 70
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(rateLimitPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Resets:{" "}
                {new Date(integration.rateLimit.resetTime).toLocaleTimeString()}
              </p>
            </div>

            {integration.lastSync && (
              <div className="text-xs text-gray-500">
                Last sync: {new Date(integration.lastSync).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {integration.status === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Connection failed. Check configuration and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {integration.status === "connected" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigure(integration.id)}
                className="flex-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSync(integration.id)}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(integration.documentation, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onConnect(integration.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const APIKeyManager = ({
  apiKeys,
  onCreateKey,
  onRevokeKey,
  onToggleKey,
}: {
  apiKeys: APIKey[];
  onCreateKey: (name: string, permissions: string[]) => void;
  onRevokeKey: (id: string) => void;
  onToggleKey: (id: string) => void;
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const availablePermissions = [
    "read:orders",
    "write:orders",
    "read:products",
    "write:products",
    "read:customers",
    "write:customers",
    "read:analytics",
    "webhooks",
  ];

  const handleCreateKey = () => {
    if (newKeyName.trim() && selectedPermissions.length > 0) {
      onCreateKey(newKeyName, selectedPermissions);
      setNewKeyName("");
      setSelectedPermissions([]);
      setShowCreateDialog(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied to clipboard",
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Keys</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <Badge
                      className={
                        apiKey.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500">
                      <span>
                        Created:{" "}
                        {new Date(apiKey.createdAt).toLocaleDateString()}
                      </span>
                      {apiKey.lastUsed && (
                        <span className="ml-4">
                          Last used:{" "}
                          {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </span>
                      )}
                      {apiKey.expiresAt && (
                        <span className="ml-4">
                          Expires:{" "}
                          {new Date(apiKey.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={apiKey.isActive}
                    onCheckedChange={() => onToggleKey(apiKey.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRevokeKey(apiKey.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Mobile App Integration"
              />
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={selectedPermissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([
                            ...selectedPermissions,
                            permission,
                          ]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((p) => p !== permission),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateKey}
                disabled={
                  !newKeyName.trim() || selectedPermissions.length === 0
                }
              >
                Create Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const WebhookManager = ({
  webhooks,
  events,
  onCreateWebhook,
  onDeleteWebhook,
  onToggleWebhook,
}: {
  webhooks: Integration["webhooks"];
  events: WebhookEvent[];
  onCreateWebhook: (url: string, events: string[]) => void;
  onDeleteWebhook: (id: string) => void;
  onToggleWebhook: (id: string) => void;
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const availableEvents = [
    "order.created",
    "order.updated",
    "order.completed",
    "payment.completed",
    "payment.failed",
    "user.created",
    "user.updated",
    "product.created",
    "product.updated",
  ];

  const handleCreateWebhook = () => {
    if (newWebhookUrl.trim() && selectedEvents.length > 0) {
      onCreateWebhook(newWebhookUrl, selectedEvents);
      setNewWebhookUrl("");
      setSelectedEvents([]);
      setShowCreateDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Endpoints */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Webhook Endpoints</h3>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        <div className="space-y-3">
          {webhooks?.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {webhook.url}
                      </code>
                      <Badge
                        className={
                          webhook.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {webhook.status}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge
                          key={event}
                          variant="outline"
                          className="text-xs"
                        >
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={webhook.status === "active"}
                      onCheckedChange={() => onToggleWebhook(webhook.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No webhooks configured</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Webhook Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={
                        event.status === "success"
                          ? "bg-green-100 text-green-800"
                          : event.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {event.status}
                    </Badge>
                    <span className="font-medium">{event.event}</span>
                    <span className="text-sm text-gray-600">
                      from {event.source}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                    {event.attempts > 1 && (
                      <span className="ml-2">({event.attempts} attempts)</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Webhook Endpoint</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="webhookUrl">Endpoint URL</Label>
              <Input
                id="webhookUrl"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhooks/savanna"
              />
            </div>

            <div>
              <Label>Events to Subscribe</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event}
                      checked={selectedEvents.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents([...selectedEvents, event]);
                        } else {
                          setSelectedEvents(
                            selectedEvents.filter((ev) => ev !== event),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={event} className="text-sm">
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWebhook}
                disabled={!newWebhookUrl.trim() || selectedEvents.length === 0}
              >
                Create Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [activeTab, setActiveTab] = useState("integrations");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  // Mock data initialization
  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: "mpesa",
        name: "M-Pesa",
        category: "payment",
        provider: "Safaricom",
        description: "Mobile money payments for Kenya and East Africa",
        icon: <Smartphone className="h-5 w-5 text-green-600" />,
        status: "connected",
        isActive: true,
        config: { shortcode: "174379", passkey: "***" },
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        endpoints: ["/api/mpesa/stkpush", "/api/mpesa/callback"],
        rateLimit: {
          limit: 1000,
          remaining: 847,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
        usage: { thisMonth: 234, lastMonth: 189, limit: 5000 },
        documentation: "https://developer.safaricom.co.ke",
        webhooks: [
          {
            id: "webhook_1",
            url: "https://api.savanna.com/webhooks/mpesa",
            events: ["payment.completed", "payment.failed"],
            status: "active",
          },
        ],
      },
      {
        id: "dhl",
        name: "DHL Express",
        category: "logistics",
        provider: "DHL",
        description: "International shipping and logistics services",
        icon: <Truck className="h-5 w-5 text-blue-600" />,
        status: "connected",
        isActive: true,
        config: { accountNumber: "123456789", apiKey: "***" },
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        endpoints: ["/api/dhl/track", "/api/dhl/ship"],
        rateLimit: {
          limit: 500,
          remaining: 456,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
        usage: { thisMonth: 67, lastMonth: 45, limit: 1000 },
        documentation: "https://developer.dhl.com",
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business",
        category: "communication",
        provider: "Meta",
        description: "Send notifications and updates via WhatsApp",
        icon: <MessageCircle className="h-5 w-5 text-green-600" />,
        status: "disconnected",
        isActive: false,
        config: {},
        endpoints: ["/api/whatsapp/send"],
        rateLimit: {
          limit: 1000,
          remaining: 1000,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
        usage: { thisMonth: 0, lastMonth: 0, limit: 10000 },
        documentation: "https://developers.facebook.com/docs/whatsapp",
      },
      {
        id: "googleanalytics",
        name: "Google Analytics",
        category: "analytics",
        provider: "Google",
        description: "Track user behavior and marketplace performance",
        icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
        status: "connected",
        isActive: true,
        config: { propertyId: "GA_MEASUREMENT_ID", trackingId: "***" },
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        endpoints: ["/api/analytics/track"],
        rateLimit: {
          limit: 10000,
          remaining: 9234,
          resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        usage: { thisMonth: 2847, lastMonth: 2156, limit: 50000 },
        documentation: "https://developers.google.com/analytics",
      },
      {
        id: "stripe",
        name: "Stripe",
        category: "payment",
        provider: "Stripe",
        description: "International credit card and online payments",
        icon: <CreditCard className="h-5 w-5 text-purple-600" />,
        status: "error",
        isActive: false,
        config: { publishableKey: "pk_***", secretKey: "sk_***" },
        endpoints: ["/api/stripe/charge", "/api/stripe/webhook"],
        rateLimit: {
          limit: 5000,
          remaining: 0,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
        usage: { thisMonth: 89, lastMonth: 67, limit: 2000 },
        documentation: "https://stripe.com/docs",
      },
    ];

    const mockApiKeys: APIKey[] = [
      {
        id: "key_1",
        name: "Mobile App",
        key: "sav_pk_1234567890abcdef1234567890abcdef",
        permissions: ["read:orders", "write:orders", "read:products"],
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
      {
        id: "key_2",
        name: "Analytics Dashboard",
        key: "sav_pk_abcdef1234567890abcdef1234567890",
        permissions: ["read:analytics", "read:orders", "read:customers"],
        createdAt: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isActive: true,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];

    const mockWebhookEvents: WebhookEvent[] = [
      {
        id: "event_1",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        event: "order.created",
        source: "Mobile App",
        status: "success",
        attempts: 1,
        payload: { order_id: "12345", amount: 5000 },
        response: { status: 200 },
      },
      {
        id: "event_2",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        event: "payment.completed",
        source: "M-Pesa Integration",
        status: "success",
        attempts: 1,
        payload: { transaction_id: "ABC123", amount: 5000 },
      },
      {
        id: "event_3",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        event: "order.updated",
        source: "Dashboard",
        status: "failed",
        attempts: 3,
        payload: { order_id: "12346", status: "shipped" },
      },
    ];

    setIntegrations(mockIntegrations);
    setApiKeys(mockApiKeys);
    setWebhookEvents(mockWebhookEvents);
  }, []);

  const handleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "connected" as const, isActive: true }
          : integration,
      ),
    );

    toast({
      title: "Integration connected! 🔗",
      description: "Integration has been successfully connected",
    });
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "disconnected" as const, isActive: false }
          : integration,
      ),
    );

    toast({
      title: "Integration disconnected",
      description: "Integration has been disconnected",
    });
  };

  const handleConfigure = (integrationId: string) => {
    console.log("Configuring integration:", integrationId);
    toast({
      title: "Configuration",
      description: "Opening configuration panel...",
    });
  };

  const handleSync = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, lastSync: new Date().toISOString() }
          : integration,
      ),
    );

    toast({
      title: "Sync completed ✅",
      description: "Integration data has been synchronized",
    });
  };

  const handleCreateApiKey = (name: string, permissions: string[]) => {
    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name,
      key: `sav_pk_${Math.random().toString(36).substring(2, 34)}`,
      permissions,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setApiKeys((prev) => [...prev, newKey]);

    toast({
      title: "API Key created! 🔑",
      description: "New API key has been generated",
    });
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));

    toast({
      title: "API Key revoked",
      description: "API key has been permanently revoked",
    });
  };

  const handleToggleApiKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId ? { ...key, isActive: !key.isActive } : key,
      ),
    );
  };

  const handleCreateWebhook = (url: string, events: string[]) => {
    // Add webhook to the first integration that supports webhooks
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.webhooks) {
          const newWebhook = {
            id: `webhook_${Date.now()}`,
            url,
            events,
            status: "active" as const,
          };
          return {
            ...integration,
            webhooks: [...integration.webhooks, newWebhook],
          };
        }
        return integration;
      }),
    );

    toast({
      title: "Webhook created! 🪝",
      description: "Webhook endpoint has been configured",
    });
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.webhooks) {
          return {
            ...integration,
            webhooks: integration.webhooks.filter((w) => w.id !== webhookId),
          };
        }
        return integration;
      }),
    );

    toast({
      title: "Webhook deleted",
      description: "Webhook endpoint has been removed",
    });
  };

  const handleToggleWebhook = (webhookId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.webhooks) {
          return {
            ...integration,
            webhooks: integration.webhooks.map((w) =>
              w.id === webhookId
                ? {
                    ...w,
                    status:
                      w.status === "active"
                        ? ("inactive" as const)
                        : ("active" as const),
                  }
                : w,
            ),
          };
        }
        return integration;
      }),
    );
  };

  const filteredIntegrations = integrations.filter(
    (integration) =>
      selectedCategory === "all" || integration.category === selectedCategory,
  );

  const categories = [
    "all",
    ...Array.from(new Set(integrations.map((i) => i.category))),
  ];
  const connectedIntegrations = integrations.filter(
    (i) => i.status === "connected",
  ).length;
  const totalApiCalls = integrations.reduce(
    (sum, i) => sum + i.usage.thisMonth,
    0,
  );

  // Get webhooks from all integrations
  const allWebhooks = integrations.flatMap((i) => i.webhooks || []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Zap className="h-8 w-8 text-green-600" />
            <span>Integration Hub</span>
          </h1>
          <p className="text-gray-600">
            Connect with external services and manage API integrations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Code className="h-4 w-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {connectedIntegrations}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Calls (Month)</p>
                <p className="text-2xl font-bold">
                  {totalApiCalls.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold">
                  {apiKeys.filter((k) => k.isActive).length}
                </p>
              </div>
              <Key className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Webhooks</p>
                <p className="text-2xl font-bold">{allWebhooks.length}</p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <Label>Category:</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onConfigure={handleConfigure}
                onSync={handleSync}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeyManager
            apiKeys={apiKeys}
            onCreateKey={handleCreateApiKey}
            onRevokeKey={handleRevokeApiKey}
            onToggleKey={handleToggleApiKey}
          />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager
            webhooks={allWebhooks}
            events={webhookEvents}
            onCreateWebhook={handleCreateWebhook}
            onDeleteWebhook={handleDeleteWebhook}
            onToggleWebhook={handleToggleWebhook}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardContent className="text-center py-20">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Integration Logs</h3>
              <p className="text-gray-600">
                Detailed logging and monitoring coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
