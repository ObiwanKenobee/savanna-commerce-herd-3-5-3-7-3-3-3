import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  MessageSquare,
  TrendingUp,
  ShoppingCart,
  Package,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Filter,
  Settings as SettingsIcon,
  Smartphone,
  Mail,
  Volume2,
  Eye,
  Archive,
  Trash2,
} from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "payment" | "system" | "marketing" | "social" | "security";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  icon: string;
  action?: {
    label: string;
    url: string;
  };
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    inApp: true,
    marketing: false,
    system: true,
    orders: true,
    payments: true,
    social: true,
  });

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "🦌 Order Delivered Successfully",
        message:
          "Your bulk order of office supplies has been delivered to Westlands Office Park. The gazelle has safely reached its destination!",
        timestamp: "2 minutes ago",
        read: false,
        priority: "medium",
        icon: "📦",
        action: { label: "View Order", url: "/orders/12345" },
      },
      {
        id: "2",
        type: "payment",
        title: "💰 Payment Processed",
        message:
          "M-Pesa payment of KSH 45,000 has been successfully processed for your group buying order.",
        timestamp: "15 minutes ago",
        read: false,
        priority: "high",
        icon: "💳",
        action: { label: "View Receipt", url: "/billing/receipt-789" },
      },
      {
        id: "3",
        type: "system",
        title: "🦁 System Maintenance Complete",
        message:
          "Scheduled maintenance has been completed. All pride systems are now running at optimal performance.",
        timestamp: "1 hour ago",
        read: true,
        priority: "low",
        icon: "⚙️",
      },
      {
        id: "4",
        type: "marketing",
        title: "🌍 New Supplier Network Expansion",
        message:
          "We've partnered with 50 new suppliers across Tanzania and Uganda. Explore new products in your dashboard!",
        timestamp: "3 hours ago",
        read: false,
        priority: "medium",
        icon: "🎯",
        action: { label: "Explore Now", url: "/marketplace/new-suppliers" },
      },
      {
        id: "5",
        type: "social",
        title: "👥 Group Buying Pool Full",
        message:
          "Your solar panel group buying pool has reached maximum capacity (50 members). Order will be processed tomorrow.",
        timestamp: "6 hours ago",
        read: true,
        priority: "medium",
        icon: "🔋",
        action: { label: "View Pool", url: "/group-buying/pool-567" },
      },
      {
        id: "6",
        type: "security",
        title: "🛡️ New Login Detected",
        message:
          "New login from Nairobi, Kenya on Chrome browser. If this wasn't you, please secure your account immediately.",
        timestamp: "1 day ago",
        read: false,
        priority: "urgent",
        icon: "🔐",
        action: { label: "Review Activity", url: "/security/activity" },
      },
      {
        id: "7",
        type: "order",
        title: "📱 Smart Recommendation",
        message:
          "Based on your buying patterns, we recommend ordering electronics now due to upcoming 25% price increases.",
        timestamp: "2 days ago",
        read: true,
        priority: "medium",
        icon: "🤖",
        action: { label: "View Recommendations", url: "/ai-insights" },
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "unread") return !notif.read;
    return notif.type === selectedTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const priorityColors = {
    low: "border-l-gray-400",
    medium: "border-l-blue-400",
    high: "border-l-orange-400",
    urgent: "border-l-red-400",
  };

  const typeIcons = {
    order: Package,
    payment: CreditCard,
    system: SettingsIcon,
    marketing: TrendingUp,
    social: Users,
    security: AlertTriangle,
  };

  const notificationStats = [
    { label: "Total Notifications", value: notifications.length, icon: Bell },
    { label: "Unread", value: unreadCount, icon: Eye },
    {
      label: "This Week",
      value: notifications.filter(
        (n) => n.timestamp.includes("hour") || n.timestamp.includes("minute"),
      ).length,
      icon: Clock,
    },
    {
      label: "High Priority",
      value: notifications.filter(
        (n) => n.priority === "high" || n.priority === "urgent",
      ).length,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🔔 Notification Center
              </h1>
              <p className="text-muted-foreground text-lg">
                Stay connected with your savanna ecosystem - never miss
                important updates from the pride.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={markAllAsRead}
                variant="outline"
                disabled={unreadCount === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {notificationStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "all"
                      ? "You're all caught up! No notifications at the moment."
                      : `No ${selectedTab} notifications to display.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const TypeIcon = typeIcons[notification.type];
                  return (
                    <Card
                      key={notification.id}
                      className={`hover:shadow-md transition-all duration-300 border-l-4 ${
                        priorityColors[notification.priority]
                      } ${!notification.read ? "bg-blue-50/50" : ""}`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`p-2 rounded-lg ${
                                notification.priority === "urgent"
                                  ? "bg-red-100"
                                  : notification.priority === "high"
                                    ? "bg-orange-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              <TypeIcon
                                className={`h-5 w-5 ${
                                  notification.priority === "urgent"
                                    ? "text-red-600"
                                    : notification.priority === "high"
                                      ? "text-orange-600"
                                      : "text-blue-600"
                                }`}
                              />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3
                                className={`font-medium ${!notification.read ? "font-semibold" : ""}`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <Badge className="bg-blue-600 text-white">
                                  New
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={
                                  notification.priority === "urgent"
                                    ? "border-red-400 text-red-600"
                                    : notification.priority === "high"
                                      ? "border-orange-400 text-orange-600"
                                      : "border-gray-400 text-gray-600"
                                }
                              >
                                {notification.priority}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{notification.timestamp}</span>
                                </span>
                                <span className="capitalize">
                                  {notification.type}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                {notification.action && (
                                  <Button size="sm" variant="outline">
                                    {notification.action.label}
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Notification Settings Panel */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Methods */}
              <div>
                <h4 className="font-medium mb-4 flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Delivery Methods</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Push Notifications</span>
                      <p className="text-sm text-muted-foreground">
                        Real-time notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          push: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-muted-foreground">
                        Important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          email: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">SMS Alerts</span>
                      <p className="text-sm text-muted-foreground">
                        Critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          sms: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">In-App Notifications</span>
                      <p className="text-sm text-muted-foreground">
                        Notifications within the platform
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.inApp}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          inApp: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h4 className="font-medium mb-4 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Notification Types</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Order Updates</span>
                      <p className="text-sm text-muted-foreground">
                        Order status, delivery updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.orders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          orders: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Payment Alerts</span>
                      <p className="text-sm text-muted-foreground">
                        Payment confirmations, billing
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.payments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          payments: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">System Updates</span>
                      <p className="text-sm text-muted-foreground">
                        Maintenance, feature updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.system}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          system: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Social Updates</span>
                      <p className="text-sm text-muted-foreground">
                        Group buying, community activity
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.social}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          social: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        Marketing & Promotions
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Deals, new features, newsletters
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketing}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          marketing: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button className="w-full">Save Notification Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
