import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  MarkAsRead,
} from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "payment" | "system" | "alert" | "success" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "New Order Received",
      message: "Order #12345 has been placed by Acme Corp for 500kg maize",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: "/orders/12345",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Confirmed",
      message: "Payment of KSH 75,000 for order #12344 has been confirmed",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionUrl: "/orders/12344",
    },
    {
      id: "3",
      type: "alert",
      title: "Low Stock Alert",
      message: "Your maize inventory is running low (only 50kg remaining)",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      actionUrl: "/products",
    },
    {
      id: "4",
      type: "success",
      title: "Product Listed Successfully",
      message:
        'Your new product "Premium Coffee Beans" has been approved and listed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/products",
    },
    {
      id: "5",
      type: "system",
      title: "System Maintenance",
      message:
        "Scheduled maintenance will occur on Sunday 3:00 AM - 5:00 AM EAT",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "system":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "alert":
        return "bg-amber-100 text-amber-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`group relative p-3 rounded-lg transition-colors cursor-pointer ${
                      !notification.read
                        ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}

                    <div className="flex items-start gap-3 ml-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                              >
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
