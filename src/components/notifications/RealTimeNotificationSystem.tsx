/**
 * 🦁 Real-Time Notification System - Production Ready
 * Complete notification infrastructure for the platform
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Package,
  Users,
  Shield,
  TrendingUp,
  MessageSquare,
  Clock,
  Settings,
  Trash2,
  MarkAsUnread,
  Filter,
  Download,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "order" | "payment" | "system" | "marketing" | "security";
  data: Record<string, any>;
  read_at: string | null;
  action_url?: string;
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
}

interface Props {
  className?: string;
  showInline?: boolean;
  maxItems?: number;
}

const RealTimeNotificationSystem: React.FC<Props> = ({
  className = "",
  showInline = false,
  maxItems = 50,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "unread" | "order" | "payment" | "system"
  >("all");
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(maxItems);

      if (filter !== "all") {
        if (filter === "unread") {
          query = query.is("read_at", null);
        } else {
          query = query.eq("type", filter);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading notifications:", error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.read_at).length || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user, maxItems, filter]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    loadNotifications();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          // Add to notifications list
          setNotifications((prev) => [
            newNotification,
            ...prev.slice(0, maxItems - 1),
          ]);
          setUnreadCount((prev) => prev + 1);

          // Show toast for high priority notifications
          if (
            newNotification.priority === "high" ||
            newNotification.priority === "urgent"
          ) {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: newNotification.priority === "urgent" ? 10000 : 5000,
            });
          }

          // Play notification sound
          if (soundEnabled && newNotification.priority !== "low") {
            playNotificationSound(newNotification.priority);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updatedNotification.id ? updatedNotification : n,
            ),
          );

          // Update unread count
          if (updatedNotification.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadNotifications, maxItems, soundEnabled]);

  // Play notification sound
  const playNotificationSound = (priority: string) => {
    if (!soundEnabled) return;

    try {
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = priority === "urgent" ? 0.8 : 0.5;
      audio.play().catch(() => {
        // Ignore errors (user might not have interacted with page yet)
      });
    } catch (error) {
      // Audio not available
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        })),
      );
      setUnreadCount(0);

      toast({
        title: "All notifications marked as read",
        description: "Your notification list has been cleared.",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        console.error("Error deleting notification:", error);
        return;
      }

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Update unread count if it was unread
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.read_at) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read_at) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if provided
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string, priority: string) => {
    const baseClasses = "h-4 w-4";
    const urgentClasses =
      priority === "urgent"
        ? "text-red-500"
        : priority === "high"
          ? "text-orange-500"
          : priority === "medium"
            ? "text-blue-500"
            : "text-gray-500";

    switch (type) {
      case "order":
        return <Package className={`${baseClasses} ${urgentClasses}`} />;
      case "payment":
        return <DollarSign className={`${baseClasses} ${urgentClasses}`} />;
      case "system":
        return <Settings className={`${baseClasses} ${urgentClasses}`} />;
      case "marketing":
        return <TrendingUp className={`${baseClasses} ${urgentClasses}`} />;
      case "security":
        return <Shield className={`${baseClasses} ${urgentClasses}`} />;
      default:
        return <Bell className={`${baseClasses} ${urgentClasses}`} />;
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read_at;
    return notification.type === filter;
  });

  // Notification content
  const NotificationContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 text-xs">
        {["all", "unread", "order", "payment", "system"].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(filterType as any)}
            className="text-xs"
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Button>
        ))}
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{unreadCount} unread</span>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        </div>
      )}

      {/* Notifications list */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read_at ? "border-blue-200 bg-blue-50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-0.5">
                        {getNotificationIcon(
                          notification.type,
                          notification.priority,
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4
                            className={`text-sm font-medium ${!notification.read_at ? "font-semibold" : ""}`}
                          >
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {notification.type}
                            </Badge>
                            <span>
                              {formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.read_at && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (showInline) {
    return (
      <div className={className}>
        <NotificationContent />
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <NotificationContent />
      </PopoverContent>
    </Popover>
  );
};

export default RealTimeNotificationSystem;
