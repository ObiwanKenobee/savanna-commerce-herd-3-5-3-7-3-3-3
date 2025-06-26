import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Radio,
  Wifi,
  Signal,
  Volume2,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";

interface DrumNode {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "maintenance";
  signalStrength: number;
  messagesTransmitted: number;
  lastHeartbeat: string;
  networkRole: "primary" | "relay" | "edge";
}

interface NetworkMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  route: string[];
  status: "transmitted" | "pending" | "failed";
  priority: "low" | "medium" | "high" | "emergency";
}

export const TalkingDrumsNetwork = () => {
  const [drumNodes, setDrumNodes] = useState<DrumNode[]>([
    {
      id: "drum-001",
      name: "Kilimanjaro Central",
      location: "Mount Kilimanjaro",
      status: "active",
      signalStrength: 95,
      messagesTransmitted: 1247,
      lastHeartbeat: "2 minutes ago",
      networkRole: "primary",
    },
    {
      id: "drum-002",
      name: "Maasai Relay",
      location: "Maasai Mara",
      status: "active",
      signalStrength: 87,
      messagesTransmitted: 892,
      lastHeartbeat: "1 minute ago",
      networkRole: "relay",
    },
    {
      id: "drum-003",
      name: "Serengeti Edge",
      location: "Serengeti Plains",
      status: "maintenance",
      signalStrength: 0,
      messagesTransmitted: 634,
      lastHeartbeat: "15 minutes ago",
      networkRole: "edge",
    },
    {
      id: "drum-004",
      name: "Victoria Relay",
      location: "Lake Victoria",
      status: "active",
      signalStrength: 78,
      messagesTransmitted: 945,
      lastHeartbeat: "30 seconds ago",
      networkRole: "relay",
    },
  ]);

  const [networkMessages, setNetworkMessages] = useState<NetworkMessage[]>([
    {
      id: "msg-001",
      sender: "Kilimanjaro Central",
      recipient: "All Nodes",
      content: "Market prices updated for maize and coffee",
      timestamp: "2 minutes ago",
      route: ["drum-001", "drum-002", "drum-004"],
      status: "transmitted",
      priority: "medium",
    },
    {
      id: "msg-002",
      sender: "Maasai Relay",
      recipient: "Victoria Relay",
      content: "Weather alert: Heavy rains expected",
      timestamp: "5 minutes ago",
      route: ["drum-002", "drum-001", "drum-004"],
      status: "transmitted",
      priority: "high",
    },
    {
      id: "msg-003",
      sender: "Victoria Relay",
      recipient: "Serengeti Edge",
      content: "Supply chain status update",
      timestamp: "10 minutes ago",
      route: ["drum-004", "drum-001", "drum-003"],
      status: "failed",
      priority: "low",
    },
  ]);

  const [networkHealth, setNetworkHealth] = useState(85);
  const [activeNodes, setActiveNodes] = useState(3);
  const [totalMessages, setTotalMessages] = useState(3718);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDrumNodes((prev) =>
        prev.map((node) => ({
          ...node,
          messagesTransmitted:
            node.status === "active"
              ? node.messagesTransmitted + Math.floor(Math.random() * 3)
              : node.messagesTransmitted,
        })),
      );

      setTotalMessages((prev) => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-blue-600 bg-blue-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Health</p>
                <p className="text-2xl font-bold text-green-600">
                  {networkHealth}%
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Nodes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeNodes}/4
                </p>
              </div>
              <Radio className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages Today</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalMessages.toLocaleString()}
                </p>
              </div>
              <Volume2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-orange-600">2.3s</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drum Nodes Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Radio className="mr-2 h-5 w-5" />
            Talking Drums Network Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drumNodes.map((node) => (
              <Card key={node.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{node.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {node.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(node.status)}>
                      {node.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Signal Strength</span>
                      <span className="font-medium">
                        {node.signalStrength}%
                      </span>
                    </div>
                    <Progress value={node.signalStrength} className="h-2" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Messages</p>
                        <p className="font-medium">
                          {node.messagesTransmitted}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium capitalize">
                          {node.networkRole}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Last heartbeat: {node.lastHeartbeat}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="mr-2 h-5 w-5" />
            Recent Network Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="font-medium">{message.recipient}</span>
                      <Badge className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {message.timestamp}
                      </span>
                      <span>Route: {message.route.join(" → ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {message.status === "transmitted" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {message.status === "failed" && (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    {message.status === "pending" && (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Network Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Signal className="mr-2 h-4 w-4" />
              Test All Nodes
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Broadcast Message
            </Button>
            <Button variant="outline" size="sm">
              <Wifi className="mr-2 h-4 w-4" />
              Network Diagnostics
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency Protocol
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
