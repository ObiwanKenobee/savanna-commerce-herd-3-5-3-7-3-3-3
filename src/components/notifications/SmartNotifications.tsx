import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Bell,
  Smartphone,
  Mail,
  MessageCircle,
  Send,
  Settings,
  Brain,
  Clock,
  Users,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  Filter,
  Eye,
  Archive,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Zap,
  Globe,
  Target,
  Calendar,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "order" | "payment" | "inventory" | "delivery" | "marketing" | "system";
  channel: "email" | "sms" | "push" | "whatsapp" | "ussd";
  subject: string;
  content: string;
  variables: string[];
  active: boolean;
  language: "en" | "sw";
  priority: "low" | "medium" | "high" | "urgent";
  schedule?: {
    immediate: boolean;
    delay?: number;
    specificTime?: string;
    recurring?: boolean;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  actions: Array<{
    type: "send_notification" | "update_status" | "create_task";
    templateId?: string;
    channel?: string;
    recipient?: string;
  }>;
  active: boolean;
  priority: number;
}

interface SmartNotification {
  id: string;
  type: "order" | "payment" | "inventory" | "delivery" | "marketing" | "system";
  title: string;
  message: string;
  channel: "email" | "sms" | "push" | "whatsapp" | "ussd";
  recipient: string;
  status: "pending" | "sent" | "delivered" | "failed" | "read";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  metadata?: any;
  aiGenerated: boolean;
  language: "en" | "sw";
  cost?: number;
}

interface NotificationPreferences {
  email: {
    enabled: boolean;
    address: string;
    frequency: "immediate" | "hourly" | "daily";
  };
  sms: {
    enabled: boolean;
    number: string;
    frequency: "immediate" | "hourly" | "daily";
  };
  push: {
    enabled: boolean;
    frequency: "immediate" | "hourly" | "daily";
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    frequency: "immediate" | "hourly" | "daily";
  };
  ussd: {
    enabled: boolean;
    number: string;
  };
  language: "en" | "sw";
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    orders: boolean;
    payments: boolean;
    inventory: boolean;
    delivery: boolean;
    marketing: boolean;
    system: boolean;
  };
}

const NotificationCard = ({
  notification,
  onMarkRead,
  onResend,
  onViewDetails,
}: {
  notification: SmartNotification;
  onMarkRead: (id: string) => void;
  onResend: (id: string) => void;
  onViewDetails: (id: string) => void;
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "ussd":
        return <Globe className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "inventory":
        return <Archive className="h-4 w-4" />;
      case "delivery":
        return <Truck className="h-4 w-4" />;
      case "marketing":
        return <TrendingUp className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              {getTypeIcon(notification.type)}
              {getChannelIcon(notification.channel)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-sm truncate">
                  {notification.title}
                </h4>
                {notification.aiGenerated && (
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
                <Badge className="text-xs">
                  {notification.language.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {notification.message}
              </p>

              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>To: {notification.recipient}</span>
                <span>•</span>
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
                {notification.cost && (
                  <>
                    <span>•</span>
                    <span>KES {notification.cost.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(notification.status)}>
              {notification.status}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(notification.id)}
            >
              <Eye className="h-3 w-3" />
            </Button>

            {notification.status === "failed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResend(notification.id)}
              >
                <Send className="h-3 w-3" />
              </Button>
            )}

            {notification.status !== "read" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(notification.id)}
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {notification.readAt && (
          <div className="mt-2 text-xs text-green-600">
            ✓ Read on {new Date(notification.readAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const NotificationTemplateEditor = ({
  template,
  onSave,
  onCancel,
}: {
  template?: NotificationTemplate;
  onSave: (template: NotificationTemplate) => void;
  onCancel: () => void;
}) => {
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate>(
    template || {
      id: "",
      name: "",
      type: "order",
      channel: "email",
      subject: "",
      content: "",
      variables: [],
      active: true,
      language: "en",
      priority: "medium",
    },
  );

  const availableVariables = [
    "{{customer_name}}",
    "{{order_number}}",
    "{{amount}}",
    "{{date}}",
    "{{product_name}}",
    "{{quantity}}",
    "{{delivery_date}}",
    "{{tracking_number}}",
    "{{supplier_name}}",
    "{{payment_method}}",
    "{{phone_number}}",
    "{{address}}",
  ];

  const handleSave = () => {
    if (
      editingTemplate.name &&
      editingTemplate.subject &&
      editingTemplate.content
    ) {
      onSave({
        ...editingTemplate,
        id: editingTemplate.id || `tpl_${Date.now()}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={editingTemplate.name}
            onChange={(e) =>
              setEditingTemplate((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Order Confirmation"
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={editingTemplate.type}
            onValueChange={(value) =>
              setEditingTemplate((prev) => ({ ...prev, type: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="channel">Channel</Label>
          <Select
            value={editingTemplate.channel}
            onValueChange={(value) =>
              setEditingTemplate((prev) => ({ ...prev, channel: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="ussd">USSD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            value={editingTemplate.language}
            onValueChange={(value) =>
              setEditingTemplate((prev) => ({
                ...prev,
                language: value as any,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Kiswahili</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject / Title</Label>
        <Input
          id="subject"
          value={editingTemplate.subject}
          onChange={(e) =>
            setEditingTemplate((prev) => ({ ...prev, subject: e.target.value }))
          }
          placeholder="Your order has been confirmed"
        />
      </div>

      <div>
        <Label htmlFor="content">Message Content</Label>
        <Textarea
          id="content"
          value={editingTemplate.content}
          onChange={(e) =>
            setEditingTemplate((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Hello {{customer_name}}, your order {{order_number}} has been confirmed..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <Label>Available Variables</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {availableVariables.map((variable) => (
            <Button
              key={variable}
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingTemplate((prev) => ({
                  ...prev,
                  content: prev.content + " " + variable,
                }));
              }}
            >
              {variable}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={editingTemplate.active}
          onCheckedChange={(checked) =>
            setEditingTemplate((prev) => ({ ...prev, active: checked }))
          }
        />
        <Label htmlFor="active">Template Active</Label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Template
        </Button>
      </div>
    </div>
  );
};

const NotificationPreferencesSettings = ({
  preferences,
  onSave,
}: {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}) => {
  const [editingPrefs, setEditingPrefs] = useState(preferences);

  const updatePreference = (path: string, value: any) => {
    const keys = path.split(".");
    setEditingPrefs((prev) => {
      const updated = { ...prev };
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Channel Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Channels</h3>

        {/* Email */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Email Notifications</span>
              </div>
              <Switch
                checked={editingPrefs.email.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("email.enabled", checked)
                }
              />
            </div>

            {editingPrefs.email.enabled && (
              <div className="space-y-3">
                <div>
                  <Label>Email Address</Label>
                  <Input
                    value={editingPrefs.email.address}
                    onChange={(e) =>
                      updatePreference("email.address", e.target.value)
                    }
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={editingPrefs.email.frequency}
                    onValueChange={(value) =>
                      updatePreference("email.frequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SMS */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">SMS Notifications</span>
              </div>
              <Switch
                checked={editingPrefs.sms.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("sms.enabled", checked)
                }
              />
            </div>

            {editingPrefs.sms.enabled && (
              <div className="space-y-3">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={editingPrefs.sms.number}
                    onChange={(e) =>
                      updatePreference("sms.number", e.target.value)
                    }
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={editingPrefs.sms.frequency}
                    onValueChange={(value) =>
                      updatePreference("sms.frequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">WhatsApp Notifications</span>
                <Badge className="bg-green-100 text-green-800">Popular</Badge>
              </div>
              <Switch
                checked={editingPrefs.whatsapp.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("whatsapp.enabled", checked)
                }
              />
            </div>

            {editingPrefs.whatsapp.enabled && (
              <div className="space-y-3">
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={editingPrefs.whatsapp.number}
                    onChange={(e) =>
                      updatePreference("whatsapp.number", e.target.value)
                    }
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={editingPrefs.whatsapp.frequency}
                    onValueChange={(value) =>
                      updatePreference("whatsapp.frequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notification Categories */}
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(editingPrefs.categories).map(
            ([category, enabled]) => (
              <div key={category} className="flex items-center space-x-2">
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    updatePreference(`categories.${category}`, checked)
                  }
                />
                <Label className="capitalize">{category}</Label>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Quiet Hours */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <VolumeX className="h-5 w-5" />
              <span className="font-medium">Quiet Hours</span>
            </div>
            <Switch
              checked={editingPrefs.quietHours.enabled}
              onCheckedChange={(checked) =>
                updatePreference("quietHours.enabled", checked)
              }
            />
          </div>

          {editingPrefs.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={editingPrefs.quietHours.start}
                  onChange={(e) =>
                    updatePreference("quietHours.start", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={editingPrefs.quietHours.end}
                  onChange={(e) =>
                    updatePreference("quietHours.end", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => onSave(editingPrefs)}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export const SmartNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: { enabled: true, address: "", frequency: "immediate" },
    sms: { enabled: true, number: "", frequency: "immediate" },
    push: { enabled: true, frequency: "immediate" },
    whatsapp: { enabled: true, number: "", frequency: "immediate" },
    ussd: { enabled: false, number: "" },
    language: "en",
    quietHours: { enabled: false, start: "22:00", end: "07:00" },
    categories: {
      orders: true,
      payments: true,
      inventory: true,
      delivery: true,
      marketing: false,
      system: true,
    },
  });

  const [activeTab, setActiveTab] = useState("notifications");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    NotificationTemplate | undefined
  >();

  const { user } = useAuth();

  // Mock data initialization
  useEffect(() => {
    const mockNotifications: SmartNotification[] = [
      {
        id: "notif_001",
        type: "order",
        title: "Order Confirmed",
        message: "Your order #12345 has been confirmed and is being processed.",
        channel: "whatsapp",
        recipient: "+254 712 345 678",
        status: "delivered",
        priority: "medium",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        aiGenerated: true,
        language: "en",
        cost: 0.5,
      },
      {
        id: "notif_002",
        type: "delivery",
        title: "Package Out for Delivery",
        message: "Your package is out for delivery and will arrive today.",
        channel: "sms",
        recipient: "+254 712 345 678",
        status: "delivered",
        priority: "high",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        sentAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
        aiGenerated: false,
        language: "en",
        cost: 1.2,
      },
      {
        id: "notif_003",
        type: "payment",
        title: "Payment Failed",
        message:
          "Your payment for order #12346 could not be processed. Please try again.",
        channel: "email",
        recipient: "user@example.com",
        status: "failed",
        priority: "urgent",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        aiGenerated: true,
        language: "en",
        cost: 0.05,
      },
    ];

    const mockTemplates: NotificationTemplate[] = [
      {
        id: "tpl_001",
        name: "Order Confirmation",
        type: "order",
        channel: "whatsapp",
        subject: "Order Confirmed - {{order_number}}",
        content:
          "Hello {{customer_name}}, your order {{order_number}} for {{amount}} has been confirmed. Delivery expected on {{delivery_date}}.",
        variables: ["customer_name", "order_number", "amount", "delivery_date"],
        active: true,
        language: "en",
        priority: "medium",
      },
      {
        id: "tpl_002",
        name: "Payment Reminder",
        type: "payment",
        channel: "sms",
        subject: "Payment Reminder",
        content:
          "Hi {{customer_name}}, your payment of {{amount}} for order {{order_number}} is due. Pay now to avoid delays.",
        variables: ["customer_name", "amount", "order_number"],
        active: true,
        language: "en",
        priority: "high",
      },
    ];

    setNotifications(mockNotifications);
    setTemplates(mockTemplates);
  }, []);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              status: "read" as const,
              readAt: new Date().toISOString(),
            }
          : notif,
      ),
    );

    toast({
      title: "Notification marked as read",
      description: "Notification status updated",
    });
  };

  const handleResend = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: "pending" as const } : notif,
      ),
    );

    toast({
      title: "Notification queued for resend",
      description: "The notification will be sent again shortly",
    });
  };

  const handleViewDetails = (id: string) => {
    console.log("Viewing notification details:", id);
    toast({
      title: "Notification Details",
      description: "Opening detailed view...",
    });
  };

  const handleSaveTemplate = (template: NotificationTemplate) => {
    if (template.id && templates.find((t) => t.id === template.id)) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? template : t)),
      );
    } else {
      setTemplates((prev) => [
        ...prev,
        { ...template, id: `tpl_${Date.now()}` },
      ]);
    }

    setShowTemplateEditor(false);
    setEditingTemplate(undefined);

    toast({
      title: "Template saved! 📧",
      description: "Notification template has been saved successfully",
    });
  };

  const handleSavePreferences = (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    toast({
      title: "Preferences saved! ⚙️",
      description: "Your notification preferences have been updated",
    });
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesStatus =
      filterStatus === "all" || notif.status === filterStatus;
    const matchesChannel =
      filterChannel === "all" || notif.channel === filterChannel;
    return matchesStatus && matchesChannel;
  });

  const notificationStats = {
    total: notifications.length,
    sent: notifications.filter(
      (n) => n.status === "sent" || n.status === "delivered",
    ).length,
    pending: notifications.filter((n) => n.status === "pending").length,
    failed: notifications.filter((n) => n.status === "failed").length,
    totalCost: notifications.reduce((sum, n) => sum + (n.cost || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Bell className="h-8 w-8 text-green-600" />
            <span>Smart Notifications</span>
          </h1>
          <p className="text-gray-600">
            AI-powered multi-channel notification system
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button
            onClick={() => setShowTemplateEditor(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{notificationStats.total}</div>
            <div className="text-sm text-gray-600">Total Sent</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {notificationStats.sent}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">
              {notificationStats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">
              {notificationStats.failed}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">
              KES {notificationStats.totalCost.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="ussd">USSD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onResend={handleResend}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-20">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600">
                    No notifications match your current filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge
                      className={
                        template.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {template.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Badge variant="outline">{template.type}</Badge>
                    <Badge variant="outline">{template.channel}</Badge>
                    <Badge variant="outline">
                      {template.language.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {template.variables.length} variables
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowTemplateEditor(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferencesSettings
            preferences={preferences}
            onSave={handleSavePreferences}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardContent className="text-center py-20">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Detailed analytics and insights coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Editor Dialog */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <NotificationTemplateEditor
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => {
              setShowTemplateEditor(false);
              setEditingTemplate(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartNotifications;
