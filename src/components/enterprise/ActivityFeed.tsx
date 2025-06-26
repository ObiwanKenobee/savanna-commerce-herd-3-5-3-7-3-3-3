import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSavannahAudio } from "@/hooks/useSavannahAudio";
import {
  Activity,
  Users,
  Package,
  TrendingUp,
  MessageSquare,
  Star,
  Clock,
  MapPin,
  DollarSign,
  Truck,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Heart,
  Share2,
  Eye,
  Zap,
  Crown,
  Award,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "order"
    | "review"
    | "signup"
    | "delivery"
    | "payment"
    | "achievement"
    | "alert";
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    avatar: string;
    role: "supplier" | "retailer" | "driver";
  };
  metadata?: {
    amount?: number;
    location?: string;
    rating?: number;
    badge?: string;
  };
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
}

interface ActivityFeedProps {
  userRole?: "supplier" | "retailer" | "driver" | "admin";
  maxItems?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

export const ActivityFeed = ({
  userRole = "supplier",
  maxItems = 10,
  showFilters = true,
  autoRefresh = true,
  className = "",
}: ActivityFeedProps) => {
  const isMobile = useIsMobile();
  const { playNotification } = useSavannahAudio();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Generate realistic activity data
  const generateActivities = (): ActivityItem[] => {
    const baseActivities: Omit<ActivityItem, "id" | "timestamp" | "read">[] = [
      {
        type: "order",
        title: "New Order Received",
        description: "Grace Wanjiku placed an order for fresh vegetables",
        user: { name: "Grace Wanjiku", avatar: "🦌", role: "retailer" },
        metadata: { amount: 12500, location: "Kibera" },
        priority: "medium",
      },
      {
        type: "delivery",
        title: "Delivery Completed",
        description: "Electronics delivered to Swift Electronics Hub",
        user: { name: "Peter Kimani", avatar: "🐆", role: "driver" },
        metadata: { location: "Nairobi CBD" },
        priority: "low",
      },
      {
        type: "review",
        title: "New Review",
        description:
          "Sarah Achieng left a 5-star review for your fashion items",
        user: { name: "Sarah Achieng", avatar: "🦌", role: "retailer" },
        metadata: { rating: 5 },
        priority: "medium",
      },
      {
        type: "payment",
        title: "Payment Received",
        description: "M-Pesa payment confirmed for Order #ORD-2024-456",
        user: { name: "David Kamau", avatar: "🦌", role: "retailer" },
        metadata: { amount: 85000 },
        priority: "high",
      },
      {
        type: "signup",
        title: "New Retailer Joined",
        description: "Coastal Auto Parts joined your supplier network",
        user: { name: "Ahmed Hassan", avatar: "🦌", role: "retailer" },
        metadata: { location: "Mombasa" },
        priority: "medium",
      },
      {
        type: "achievement",
        title: "Badge Earned",
        description:
          'You earned the "Mighty Elephant" badge for consistent quality',
        user: { name: "You", avatar: "🐘", role: "supplier" },
        metadata: { badge: "Mighty Elephant" },
        priority: "high",
      },
      {
        type: "alert",
        title: "Stock Low Alert",
        description: "Tomatoes are running low - only 5 crates remaining",
        user: { name: "System", avatar: "⚠️", role: "supplier" },
        priority: "urgent",
      },
      {
        type: "order",
        title: "Bulk Order Inquiry",
        description: "Health Plus Pharmacy interested in medical supplies",
        user: { name: "Dr. Mary Koech", avatar: "🦌", role: "retailer" },
        metadata: { amount: 45000, location: "Eldoret" },
        priority: "high",
      },
    ];

    return baseActivities.map((activity, index) => ({
      ...activity,
      id: `activity-${index}`,
      timestamp: new Date(Date.now() - index * 300000), // 5 minutes apart
      read: Math.random() > 0.3, // 70% read
    }));
  };

  useEffect(() => {
    setActivities(generateActivities());
  }, []);

  // Auto-refresh activities
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newActivity = generateActivities()[0];
      setActivities((prev) => [
        {
          ...newActivity,
          id: `new-${Date.now()}`,
          timestamp: new Date(),
          read: false,
        },
        ...prev.slice(0, maxItems - 1),
      ]);
      playNotification();
    }, 30000); // New activity every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, maxItems, playNotification]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case "delivery":
        return <Truck className="w-4 h-4 text-green-600" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-600" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "signup":
        return <Users className="w-4 h-4 text-purple-600" />;
      case "achievement":
        return <Award className="w-4 h-4 text-orange-600" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-blue-500";
      default:
        return "border-l-gray-300";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities = activities.filter(
    (activity) => filter === "all" || activity.type === filter,
  );

  const ActivityItem = ({ activity }: { activity: ActivityItem }) => (
    <div
      className={`border-l-4 ${getPriorityColor(activity.priority)} bg-white p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!activity.read ? "bg-blue-50" : ""}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4
              className={`text-sm font-medium ${!activity.read ? "font-semibold" : ""}`}
            >
              {activity.title}
            </h4>
            {!activity.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span>{activity.user.avatar}</span>
                <span>{activity.user.name}</span>
              </div>

              {activity.metadata?.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activity.metadata.location}</span>
                </div>
              )}

              {activity.metadata?.amount && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>KSH {activity.metadata.amount.toLocaleString()}</span>
                </div>
              )}

              {activity.metadata?.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  <span>{activity.metadata.rating}/5</span>
                </div>
              )}
            </div>

            <span className="text-xs text-gray-400">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile layout
  if (isMobile) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Live Activity
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {filteredActivities.filter((a) => !a.read).length} new
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {filteredActivities.slice(0, maxItems).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop layout
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Live Activity Feed
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {filteredActivities.filter((a) => !a.read).length} unread
            </Badge>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "order" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("order")}
            >
              Orders
            </Button>
            <Button
              variant={filter === "payment" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("payment")}
            >
              Payments
            </Button>
            <Button
              variant={filter === "alert" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("alert")}
            >
              Alerts
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="divide-y">
            {filteredActivities.slice(0, maxItems).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
            <Button variant="outline" size="sm">
              View Full History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
