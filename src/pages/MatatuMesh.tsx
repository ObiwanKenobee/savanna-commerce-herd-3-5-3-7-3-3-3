import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Bus,
  Wifi,
  MapPin,
  Activity,
  Clock,
  Signal,
  Users,
  TrendingUp,
  Battery,
  Radio,
  Globe,
  Zap,
  Route,
  RefreshCw,
  Upload,
  Download,
  Truck,
  Navigation,
} from "lucide-react";

interface MatatuUnit {
  id: string;
  sachNumber: string;
  route: string;
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  driver: string;
  status: "active" | "offline" | "maintenance" | "depot";
  meshCapacity: number;
  currentLoad: number;
  batteryLevel: number;
  dataCarried: number;
  lastSync: string;
  totalTrips: number;
  dataDelivered: number;
  meshRange: number;
  passengers: number;
}

interface DataPacket {
  id: string;
  source: string;
  destination: string;
  size: number; // in MB
  priority: "low" | "medium" | "high" | "emergency";
  type:
    | "market-data"
    | "health-records"
    | "education"
    | "payments"
    | "communication";
  timestamp: string;
  status: "queued" | "transit" | "delivered" | "failed";
  carrierMatatuId?: string;
  hops: number;
  estimatedDelivery: string;
}

interface MeshNode {
  id: string;
  location: string;
  type: "matatu-stage" | "market" | "hospital" | "school" | "government";
  connectivity: "excellent" | "good" | "poor" | "offline";
  queuedData: number;
  processedToday: number;
  averageDelay: number;
  lastMatatuVisit: string;
  criticalMessages: number;
}

interface MeshRoute {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  averageTime: number;
  matatusAssigned: number;
  dataCapacity: number;
  utilizationRate: number;
  reliability: number;
}

const MatatuMesh = () => {
  const [matatus, setMatatus] = useState<MatatuUnit[]>([]);
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([]);
  const [routes, setRoutes] = useState<MeshRoute[]>([]);
  const [selectedMatatu, setSelectedMatatu] = useState<MatatuUnit | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "matatus" | "data" | "network"
  >("overview");

  useEffect(() => {
    // Mock matatu units data
    const mockMatatus: MatatuUnit[] = [
      {
        id: "matatu-001",
        sachNumber: "KCA 789A",
        route: "Westlands - CBD - Eastlands",
        currentLocation: "Yaya Centre",
        coordinates: { lat: -1.2921, lng: 36.8219 },
        driver: "James Kimani",
        status: "active",
        meshCapacity: 50, // MB
        currentLoad: 32,
        batteryLevel: 89,
        dataCarried: 156,
        lastSync: "2 minutes ago",
        totalTrips: 1247,
        dataDelivered: 8934,
        meshRange: 2.5, // km
        passengers: 12,
      },
      {
        id: "matatu-002",
        sachNumber: "KBL 234B",
        route: "Kibera - Town - Kasarani",
        currentLocation: "Globe Cinema",
        coordinates: { lat: -1.2841, lng: 36.8155 },
        driver: "Mary Wanjiku",
        status: "active",
        meshCapacity: 50,
        currentLoad: 45,
        batteryLevel: 67,
        dataCarried: 203,
        lastSync: "1 minute ago",
        totalTrips: 892,
        dataDelivered: 6234,
        meshRange: 2.8,
        passengers: 8,
      },
      {
        id: "matatu-003",
        sachNumber: "KDB 567C",
        route: "Nakuru - Naivasha - Mai Mahiu",
        currentLocation: "Nakuru Stage",
        coordinates: { lat: -0.3031, lng: 36.08 },
        driver: "Peter Kiprotich",
        status: "offline",
        meshCapacity: 75,
        currentLoad: 12,
        batteryLevel: 23,
        dataCarried: 45,
        lastSync: "45 minutes ago",
        totalTrips: 567,
        dataDelivered: 3456,
        meshRange: 3.2,
        passengers: 0,
      },
    ];

    // Mock data packets
    const mockDataPackets: DataPacket[] = [
      {
        id: "packet-001",
        source: "Kibera Health Clinic",
        destination: "Kenyatta Hospital",
        size: 2.3,
        priority: "high",
        type: "health-records",
        timestamp: "5 minutes ago",
        status: "transit",
        carrierMatatuId: "matatu-002",
        hops: 2,
        estimatedDelivery: "15 minutes",
      },
      {
        id: "packet-002",
        source: "Nakuru Market",
        destination: "Nairobi Wakulima",
        size: 0.8,
        priority: "medium",
        type: "market-data",
        timestamp: "12 minutes ago",
        status: "queued",
        hops: 0,
        estimatedDelivery: "2 hours",
      },
      {
        id: "packet-003",
        source: "Eastlands School",
        destination: "Ministry of Education",
        size: 5.2,
        priority: "low",
        type: "education",
        timestamp: "1 hour ago",
        status: "delivered",
        carrierMatatuId: "matatu-001",
        hops: 3,
        estimatedDelivery: "Completed",
      },
    ];

    // Mock mesh nodes
    const mockMeshNodes: MeshNode[] = [
      {
        id: "node-001",
        location: "Westlands Stage",
        type: "matatu-stage",
        connectivity: "excellent",
        queuedData: 23,
        processedToday: 145,
        averageDelay: 3.2,
        lastMatatuVisit: "1 minute ago",
        criticalMessages: 0,
      },
      {
        id: "node-002",
        location: "Kibera Market",
        type: "market",
        connectivity: "good",
        queuedData: 56,
        processedToday: 89,
        averageDelay: 12.5,
        lastMatatuVisit: "8 minutes ago",
        criticalMessages: 2,
      },
      {
        id: "node-003",
        location: "Nakuru Hospital",
        type: "hospital",
        connectivity: "poor",
        queuedData: 78,
        processedToday: 34,
        averageDelay: 45.2,
        lastMatatuVisit: "2 hours ago",
        criticalMessages: 5,
      },
    ];

    // Mock mesh routes
    const mockRoutes: MeshRoute[] = [
      {
        id: "route-001",
        name: "Nairobi Central Loop",
        startPoint: "CBD",
        endPoint: "Westlands",
        distance: 15.5,
        averageTime: 45,
        matatusAssigned: 23,
        dataCapacity: 1150,
        utilizationRate: 67,
        reliability: 89,
      },
      {
        id: "route-002",
        name: "Eastlands Express",
        startPoint: "Town",
        endPoint: "Kasarani",
        distance: 22.3,
        averageTime: 65,
        matatusAssigned: 18,
        dataCapacity: 900,
        utilizationRate: 78,
        reliability: 92,
      },
    ];

    setMatatus(mockMatatus);
    setDataPackets(mockDataPackets);
    setMeshNodes(mockMeshNodes);
    setRoutes(mockRoutes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "offline":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "depot":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConnectivityColor = (connectivity: string) => {
    switch (connectivity) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "poor":
        return "bg-yellow-100 text-yellow-700";
      case "offline":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case "health-records":
        return "🏥";
      case "market-data":
        return "📊";
      case "education":
        return "🎓";
      case "payments":
        return "💰";
      case "communication":
        return "💬";
      default:
        return "📄";
    }
  };

  const totalStats = {
    activeMatatus: matatus.filter((m) => m.status === "active").length,
    totalDataCarried: matatus.reduce((sum, m) => sum + m.dataCarried, 0),
    pendingPackets: dataPackets.filter(
      (p) => p.status === "queued" || p.status === "transit",
    ).length,
    networkCoverage: Math.round(
      (meshNodes.filter((n) => n.connectivity !== "offline").length /
        meshNodes.length) *
        100,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🚌 Matatu Mesh Networks
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Buses as data mules</strong> for connectivity across Kenya.
            Transforming matatus into moving internet infrastructure that
            carries data packets between disconnected communities on their
            regular routes.
          </p>
          <div className="mt-4 text-sm text-orange-600 font-medium">
            Mobile Data Carriers • Mesh Networking • Rural Connectivity •
            Offline-First Design • Community Infrastructure
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="pt-6 text-center">
              <Bus className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-700">
                {totalStats.activeMatatus}
              </div>
              <div className="text-sm text-orange-600">Active Matatus</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.totalDataCarried}
              </div>
              <div className="text-sm text-blue-600">Data Packets Carried</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <RefreshCw className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.pendingPackets}
              </div>
              <div className="text-sm text-purple-600">Pending Transfers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Signal className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.networkCoverage}%
              </div>
              <div className="text-sm text-green-600">Network Coverage</div>
            </CardContent>
          </Card>
        </div>

        {/* Mesh Network Alert */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Radio className="h-4 w-4" />
          <AlertDescription>
            <strong>Mobile Mesh Network:</strong> Each matatu carries Wi-Fi
            hotspots and data storage, creating a decentralized internet that
            moves with public transport routes across Kenya.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "matatus", "data", "network"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === "overview" && <Activity className="h-4 w-4 mr-2" />}
              {tab === "matatus" && <Bus className="h-4 w-4 mr-2" />}
              {tab === "data" && <Upload className="h-4 w-4 mr-2" />}
              {tab === "network" && <Globe className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Matatus Tab */}
        {activeTab === "matatus" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Matatu Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🚌 Mesh-Enabled Matatus</h2>

              {matatus.map((matatu) => (
                <Card
                  key={matatu.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMatatu(matatu)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {matatu.sachNumber}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {matatu.currentLocation}
                          </span>
                          <Badge className={getStatusColor(matatu.status)}>
                            {matatu.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {matatu.dataCarried}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Data Packets
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <strong>Route:</strong> {matatu.route}
                    </div>

                    {/* Capacity and Battery */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Upload className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Data Load</span>
                        </div>
                        <Progress
                          value={
                            (matatu.currentLoad / matatu.meshCapacity) * 100
                          }
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {matatu.currentLoad}MB / {matatu.meshCapacity}MB
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Battery</span>
                        </div>
                        <Progress value={matatu.batteryLevel} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {matatu.batteryLevel}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-orange-600">
                          Driver:
                        </span>
                        <div>{matatu.driver}</div>
                      </div>
                      <div>
                        <span className="font-medium text-orange-600">
                          Passengers:
                        </span>
                        <div>{matatu.passengers}/14</div>
                      </div>
                      <div>
                        <span className="font-medium text-orange-600">
                          Mesh Range:
                        </span>
                        <div>{matatu.meshRange} km</div>
                      </div>
                      <div>
                        <span className="font-medium text-orange-600">
                          Last Sync:
                        </span>
                        <div>{matatu.lastSync}</div>
                      </div>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Wifi className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Mesh Status:</strong> Broadcasting Wi-Fi hotspot
                        • Delivered {matatu.dataDelivered} packets in{" "}
                        {matatu.totalTrips} trips
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button size="sm">
                        <Navigation className="h-3 w-3 mr-1" />
                        Track Route
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-3 w-3 mr-1" />
                        Queue Data
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="h-3 w-3 mr-1" />
                        Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedMatatu ? (
                /* Matatu Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bus className="h-5 w-5" />
                      <span>{selectedMatatu.sachNumber}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge
                            className={getStatusColor(selectedMatatu.status)}
                          >
                            {selectedMatatu.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="text-sm">
                            {selectedMatatu.currentLocation}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Route: {selectedMatatu.route}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Mesh Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Data Delivered:</span>
                          <span className="font-bold">
                            {selectedMatatu.dataDelivered}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Trips:</span>
                          <span>{selectedMatatu.totalTrips}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mesh Range:</span>
                          <span>{selectedMatatu.meshRange} km</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Current Load</h4>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Data Storage:</span>
                          <span>
                            {selectedMatatu.currentLoad}MB /{" "}
                            {selectedMatatu.meshCapacity}MB
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedMatatu.currentLoad /
                              selectedMatatu.meshCapacity) *
                            100
                          }
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How Mesh Works */
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-700">
                      How Matatu Mesh Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Data Collection:</strong> Matatus pick up data
                        packets at bus stops and markets
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>Mobile Storage:</strong> Data travels with
                        matatus along their routes
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Mesh Networking:</strong> Matatus share data
                        when they pass each other
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Data Delivery:</strong> Packets delivered at
                        destination stops
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Data Packets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Active Data Packets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dataPackets
                      .filter(
                        (p) => p.status === "transit" || p.status === "queued",
                      )
                      .slice(0, 3)
                      .map((packet) => (
                        <div
                          key={packet.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {getDataTypeIcon(packet.type)} {packet.type}
                            </span>
                            <Badge
                              className={getPriorityColor(packet.priority)}
                            >
                              {packet.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {packet.source} → {packet.destination}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span>
                              {packet.size}MB • {packet.hops} hops
                            </span>
                            <span>{packet.estimatedDelivery}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Network Nodes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Mesh Nodes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meshNodes.slice(0, 3).map((node) => (
                      <div key={node.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {node.location}
                          </span>
                          <Badge
                            className={getConnectivityColor(node.connectivity)}
                          >
                            {node.connectivity}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {node.queuedData} queued • {node.processedToday}{" "}
                          processed today
                        </div>
                        {node.criticalMessages > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            {node.criticalMessages} critical messages waiting
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "matatus" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed network topology analysis, data packet routing
                optimization, and mesh network performance monitoring.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatatuMesh;
