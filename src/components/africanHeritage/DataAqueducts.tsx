import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Zap,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Users,
  Activity,
} from "lucide-react";

interface AqueductRoute {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  status: "active" | "maintenance" | "blocked";
  capacity: number;
  currentLoad: number;
  dataPackets: number;
  avgTransmissionTime: number;
  reliability: number;
  carriers: number;
}

interface DataPacket {
  id: string;
  route: string;
  size: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "queued" | "transmitting" | "delivered" | "failed";
  origin: string;
  destination: string;
  carrierType: "motorbike" | "bicycle" | "walking" | "vehicle";
  estimatedDelivery: string;
  actualDelivery?: string;
}

interface DataCarrier {
  id: string;
  name: string;
  type: "motorbike" | "bicycle" | "walking" | "vehicle";
  currentRoute: string;
  packetsCarried: number;
  reliability: number;
  location: string;
  status: "available" | "in-transit" | "resting" | "maintenance";
}

export const DataAqueducts = () => {
  const [routes, setRoutes] = useState<AqueductRoute[]>([
    {
      id: "route-001",
      name: "Nairobi-Mombasa Corridor",
      startPoint: "Nairobi CBD",
      endPoint: "Mombasa Port",
      status: "active",
      capacity: 500,
      currentLoad: 420,
      dataPackets: 156,
      avgTransmissionTime: 8.5,
      reliability: 94,
      carriers: 12,
    },
    {
      id: "route-002",
      name: "Central Kenya Circuit",
      startPoint: "Nyeri",
      endPoint: "Nakuru",
      status: "active",
      capacity: 300,
      currentLoad: 180,
      dataPackets: 89,
      avgTransmissionTime: 4.2,
      reliability: 96,
      carriers: 8,
    },
    {
      id: "route-003",
      name: "Western Kenya Link",
      startPoint: "Kisumu",
      endPoint: "Eldoret",
      status: "maintenance",
      capacity: 250,
      currentLoad: 0,
      dataPackets: 0,
      avgTransmissionTime: 0,
      reliability: 0,
      carriers: 5,
    },
    {
      id: "route-004",
      name: "Northern Frontier Route",
      startPoint: "Garissa",
      endPoint: "Mandera",
      status: "active",
      capacity: 150,
      currentLoad: 120,
      dataPackets: 45,
      avgTransmissionTime: 12.3,
      reliability: 87,
      carriers: 6,
    },
  ]);

  const [dataPackets, setDataPackets] = useState<DataPacket[]>([
    {
      id: "packet-001",
      route: "Nairobi-Mombasa Corridor",
      size: 2.5,
      priority: "high",
      status: "transmitting",
      origin: "Nairobi CBD",
      destination: "Mombasa Port",
      carrierType: "motorbike",
      estimatedDelivery: "6 hours",
    },
    {
      id: "packet-002",
      route: "Central Kenya Circuit",
      size: 1.8,
      priority: "medium",
      status: "delivered",
      origin: "Nyeri",
      destination: "Nakuru",
      carrierType: "bicycle",
      estimatedDelivery: "3 hours",
      actualDelivery: "2.8 hours",
    },
    {
      id: "packet-003",
      route: "Northern Frontier Route",
      size: 3.2,
      priority: "critical",
      status: "queued",
      origin: "Garissa",
      destination: "Mandera",
      carrierType: "vehicle",
      estimatedDelivery: "10 hours",
    },
    {
      id: "packet-004",
      route: "Nairobi-Mombasa Corridor",
      size: 0.9,
      priority: "low",
      status: "failed",
      origin: "Nairobi CBD",
      destination: "Mombasa Port",
      carrierType: "walking",
      estimatedDelivery: "Failed",
    },
  ]);

  const [carriers, setCarriers] = useState<DataCarrier[]>([
    {
      id: "carrier-001",
      name: "James Mwangi",
      type: "motorbike",
      currentRoute: "Nairobi-Mombasa Corridor",
      packetsCarried: 3,
      reliability: 95,
      location: "Machakos",
      status: "in-transit",
    },
    {
      id: "carrier-002",
      name: "Mary Wanjiku",
      type: "bicycle",
      currentRoute: "Central Kenya Circuit",
      packetsCarried: 2,
      reliability: 92,
      location: "Nakuru",
      status: "available",
    },
    {
      id: "carrier-003",
      name: "Peter Kimani",
      type: "vehicle",
      currentRoute: "Northern Frontier Route",
      packetsCarried: 5,
      reliability: 89,
      location: "Garissa",
      status: "resting",
    },
  ]);

  const [totalPackets, setTotalPackets] = useState(290);
  const [deliveryRate, setDeliveryRate] = useState(91.2);
  const [activeRoutes, setActiveRoutes] = useState(3);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTotalPackets((prev) => prev + Math.floor(Math.random() * 3));

      // Update route loads randomly
      setRoutes((prev) =>
        prev.map((route) => ({
          ...route,
          currentLoad:
            route.status === "active"
              ? Math.min(
                  route.capacity,
                  route.currentLoad + Math.floor(Math.random() * 10) - 5,
                )
              : route.currentLoad,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "delivered":
      case "available":
        return "text-green-600 bg-green-100";
      case "maintenance":
      case "queued":
      case "resting":
        return "text-yellow-600 bg-yellow-100";
      case "blocked":
      case "failed":
        return "text-red-600 bg-red-100";
      case "transmitting":
      case "in-transit":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
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

  const getCarrierIcon = (type: string) => {
    switch (type) {
      case "motorbike":
        return "🏍️";
      case "bicycle":
        return "🚲";
      case "vehicle":
        return "🚛";
      case "walking":
        return "🚶";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-6">
      {/* Aqueduct Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Routes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeRoutes}/4
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Packets</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalPackets}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {deliveryRate}%
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
                <p className="text-sm text-muted-foreground">Active Carriers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {carriers.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aqueduct Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Data Aqueduct Routes (Offline Data Transmission)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => (
              <Card key={route.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {route.startPoint} → {route.endPoint}
                      </p>
                    </div>
                    <Badge className={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Data Load</span>
                      <span className="font-medium">
                        {route.currentLoad}/{route.capacity} GB
                      </span>
                    </div>
                    <Progress
                      value={(route.currentLoad / route.capacity) * 100}
                      className="h-2"
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Packets</p>
                        <p className="font-medium">{route.dataPackets}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Time</p>
                        <p className="font-medium">
                          {route.avgTransmissionTime}h
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reliability</p>
                        <p className="font-medium">{route.reliability}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Carriers</p>
                        <p className="font-medium">{route.carriers}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Packets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Data Packets in Transit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataPackets.map((packet) => (
              <div key={packet.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getCarrierIcon(packet.carrierType)}
                      </span>
                      <span className="font-medium">
                        {packet.origin} → {packet.destination}
                      </span>
                      <Badge className={getPriorityColor(packet.priority)}>
                        {packet.priority}
                      </Badge>
                      <Badge className={getStatusColor(packet.status)}>
                        {packet.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Route: {packet.route}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{packet.size} GB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Carrier</p>
                        <p className="font-medium capitalize">
                          {packet.carrierType}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery Time</p>
                        <p className="font-medium">
                          {packet.actualDelivery || packet.estimatedDelivery}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">
                          {packet.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {packet.status === "delivered" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {packet.status === "failed" && (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    {packet.status === "transmitting" && (
                      <Activity className="h-5 w-5 text-blue-600" />
                    )}
                    {packet.status === "queued" && (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Carriers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Data Carriers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {carriers.map((carrier) => (
              <Card key={carrier.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <span className="mr-2">
                          {getCarrierIcon(carrier.type)}
                        </span>
                        {carrier.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {carrier.currentRoute}
                      </p>
                    </div>
                    <Badge className={getStatusColor(carrier.status)}>
                      {carrier.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reliability</span>
                      <span className="font-medium">
                        {carrier.reliability}%
                      </span>
                    </div>
                    <Progress value={carrier.reliability} className="h-2" />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Packets</p>
                        <p className="font-medium">{carrier.packetsCarried}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{carrier.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aqueduct Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Aqueduct Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              Create Data Packet
            </Button>
            <Button variant="outline" size="sm">
              <Truck className="mr-2 h-4 w-4" />
              Assign Carrier
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Route Optimization
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              System Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
