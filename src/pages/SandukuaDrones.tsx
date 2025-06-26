import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Recycle,
  MapPin,
  Package,
  Battery,
  Wind,
  Activity,
  Users,
  TrendingUp,
  Zap,
  Eye,
  Route,
  Clock,
  Award,
  Wrench,
  Radio,
  Camera,
} from "lucide-react";

interface SandukuaDrone {
  id: string;
  name: string;
  model:
    | "cargo"
    | "surveillance"
    | "medical"
    | "agricultural"
    | "communication";
  status: "active" | "maintenance" | "charging" | "mission" | "grounded";
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  batteryLevel: number;
  flightTime: number;
  range: number;
  payload: number;
  maxPayload: number;
  recycledContent: number;
  pilot: string;
  totalFlights: number;
  deliveriesCompleted: number;
  lastMaintenance: string;
  costToOperate: number;
}

interface DroneComponent {
  id: string;
  name: string;
  type: "frame" | "motor" | "battery" | "camera" | "sensor" | "propeller";
  sourceVehicle: string;
  recyclePercentage: number;
  cost: number;
  durability: number;
  availability: "abundant" | "moderate" | "scarce";
  localSupplier: string;
}

interface DroneMission {
  id: string;
  droneId: string;
  type: "delivery" | "survey" | "emergency" | "monitoring" | "communication";
  destination: string;
  priority: "low" | "medium" | "high" | "emergency";
  status: "planned" | "active" | "completed" | "failed";
  cargo?: string;
  weight?: number;
  estimatedTime: number;
  actualTime?: number;
  startTime: string;
  endTime?: string;
  weatherConditions: string;
}

interface RecyclingStation {
  id: string;
  name: string;
  location: string;
  specialization: string[];
  vehiclesProcessed: number;
  componentsExtracted: number;
  dronesBuilt: number;
  operatingCost: number;
  communityEmployees: number;
  sustainabilityScore: number;
}

const SandukuaDrones = () => {
  const [drones, setDrones] = useState<SandukuaDrone[]>([]);
  const [components, setComponents] = useState<DroneComponent[]>([]);
  const [missions, setMissions] = useState<DroneMission[]>([]);
  const [recyclingStations, setRecyclingStations] = useState<
    RecyclingStation[]
  >([]);
  const [selectedDrone, setSelectedDrone] = useState<SandukuaDrone | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "drones" | "missions" | "recycling"
  >("overview");

  useEffect(() => {
    // Mock drones data
    const mockDrones: SandukuaDrone[] = [
      {
        id: "drone-001",
        name: "Mfalme Harrier",
        model: "cargo",
        status: "active",
        currentLocation: "Kibera Logistics Hub",
        coordinates: { lat: -1.3133, lng: 36.7833 },
        batteryLevel: 87,
        flightTime: 45,
        range: 25,
        payload: 3.2,
        maxPayload: 5.0,
        recycledContent: 78,
        pilot: "John Kiprotich",
        totalFlights: 234,
        deliveriesCompleted: 198,
        lastMaintenance: "3 days ago",
        costToOperate: 120,
      },
      {
        id: "drone-002",
        name: "Nyota Scout",
        model: "surveillance",
        status: "mission",
        currentLocation: "Maasai Mara Airspace",
        coordinates: { lat: -1.4833, lng: 35.15 },
        batteryLevel: 62,
        flightTime: 120,
        range: 40,
        payload: 0.8,
        maxPayload: 2.0,
        recycledContent: 85,
        pilot: "Mary Wanjiku",
        totalFlights: 156,
        deliveriesCompleted: 0,
        lastMaintenance: "1 week ago",
        costToOperate: 95,
      },
      {
        id: "drone-003",
        name: "Harambee Lifeline",
        model: "medical",
        status: "charging",
        currentLocation: "Nakuru Hospital",
        coordinates: { lat: -0.3031, lng: 36.08 },
        batteryLevel: 23,
        flightTime: 35,
        range: 30,
        payload: 0.0,
        maxPayload: 3.5,
        recycledContent: 92,
        pilot: "Dr. Peter Kibet",
        totalFlights: 89,
        deliveriesCompleted: 82,
        lastMaintenance: "Yesterday",
        costToOperate: 80,
      },
    ];

    // Mock components data
    const mockComponents: DroneComponent[] = [
      {
        id: "comp-001",
        name: "Carbon Fiber Frame Section",
        type: "frame",
        sourceVehicle: "Matatu Roof Carrier",
        recyclePercentage: 85,
        cost: 450,
        durability: 92,
        availability: "abundant",
        localSupplier: "Eastlands Recyclers",
      },
      {
        id: "comp-002",
        name: "Electric Motor Assembly",
        type: "motor",
        sourceVehicle: "Matatu Fan Motor",
        recyclePercentage: 70,
        cost: 280,
        durability: 88,
        availability: "moderate",
        localSupplier: "Gikomba Parts Traders",
      },
      {
        id: "comp-003",
        name: "Lithium Battery Pack",
        type: "battery",
        sourceVehicle: "Matatu Sound System",
        recyclePercentage: 60,
        cost: 350,
        durability: 94,
        availability: "scarce",
        localSupplier: "Kirinyaga Electronics",
      },
    ];

    // Mock missions data
    const mockMissions: DroneMission[] = [
      {
        id: "mission-001",
        droneId: "drone-001",
        type: "delivery",
        destination: "Kibera Health Clinic",
        priority: "high",
        status: "active",
        cargo: "Medical Supplies",
        weight: 2.1,
        estimatedTime: 15,
        startTime: "12 minutes ago",
        weatherConditions: "Clear, 8 km/h winds",
      },
      {
        id: "mission-002",
        droneId: "drone-002",
        type: "survey",
        destination: "Maasai Mara Wildlife Count",
        priority: "medium",
        status: "active",
        estimatedTime: 180,
        startTime: "2 hours ago",
        weatherConditions: "Partly cloudy, 15 km/h winds",
      },
      {
        id: "mission-003",
        droneId: "drone-003",
        type: "emergency",
        destination: "Nakuru Accident Site",
        priority: "emergency",
        status: "completed",
        cargo: "Blood samples",
        weight: 0.5,
        estimatedTime: 12,
        actualTime: 14,
        startTime: "4 hours ago",
        endTime: "3 hours 46 minutes ago",
        weatherConditions: "Overcast, 5 km/h winds",
      },
    ];

    // Mock recycling stations
    const mockRecyclingStations: RecyclingStation[] = [
      {
        id: "station-001",
        name: "Eastlands Matatu Recycling Cooperative",
        location: "Eastlands, Nairobi",
        specialization: [
          "Carbon Fiber Extraction",
          "Motor Refurbishment",
          "Battery Recovery",
        ],
        vehiclesProcessed: 45,
        componentsExtracted: 289,
        dronesBuilt: 12,
        operatingCost: 15000,
        communityEmployees: 23,
        sustainabilityScore: 94,
      },
      {
        id: "station-002",
        name: "Nakuru Innovation Hub",
        location: "Nakuru Town",
        specialization: [
          "3D Printing",
          "Electronics Assembly",
          "Quality Testing",
        ],
        vehiclesProcessed: 28,
        componentsExtracted: 167,
        dronesBuilt: 8,
        operatingCost: 12000,
        communityEmployees: 15,
        sustainabilityScore: 87,
      },
    ];

    setDrones(mockDrones);
    setComponents(mockComponents);
    setMissions(mockMissions);
    setRecyclingStations(mockRecyclingStations);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "mission":
        return "bg-blue-100 text-blue-700";
      case "charging":
        return "bg-yellow-100 text-yellow-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      case "grounded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case "cargo":
        return "bg-blue-100 text-blue-700";
      case "surveillance":
        return "bg-purple-100 text-purple-700";
      case "medical":
        return "bg-red-100 text-red-700";
      case "agricultural":
        return "bg-green-100 text-green-700";
      case "communication":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "abundant":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "scarce":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDroneIcon = (model: string) => {
    switch (model) {
      case "cargo":
        return "📦";
      case "surveillance":
        return "👁️";
      case "medical":
        return "🏥";
      case "agricultural":
        return "🌾";
      case "communication":
        return "📡";
      default:
        return "🚁";
    }
  };

  const totalStats = {
    activeDrones: drones.filter(
      (d) => d.status === "active" || d.status === "mission",
    ).length,
    avgRecycleContent: Math.round(
      drones.reduce((sum, d) => sum + d.recycledContent, 0) / drones.length,
    ),
    totalDeliveries: drones.reduce((sum, d) => sum + d.deliveriesCompleted, 0),
    activeMissions: missions.filter(
      (m) => m.status === "active" || m.status === "planned",
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            🚁 Sandukua Drones: Indigenous Aviation
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>3D-printed indigenous drones</strong> built from recycled
            matatu parts. Community-owned aviation using local materials and
            traditional craftsmanship combined with modern technology.
          </p>
          <div className="mt-4 text-sm text-teal-600 font-medium">
            Recycled Materials • 3D Printing • Community Manufacturing •
            Sustainable Aviation • Local Innovation
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <CardContent className="pt-6 text-center">
              <Plane className="h-8 w-8 mx-auto text-teal-600 mb-2" />
              <div className="text-3xl font-bold text-teal-700">
                {totalStats.activeDrones}
              </div>
              <div className="text-sm text-teal-600">Active Drones</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Recycle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.avgRecycleContent}%
              </div>
              <div className="text-sm text-green-600">Avg Recycled Content</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.totalDeliveries}
              </div>
              <div className="text-sm text-blue-600">Total Deliveries</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.activeMissions}
              </div>
              <div className="text-sm text-purple-600">Active Missions</div>
            </CardContent>
          </Card>
        </div>

        {/* Recycling Innovation Alert */}
        <Alert className="mb-8 border-teal-200 bg-teal-50">
          <Recycle className="h-4 w-4" />
          <AlertDescription>
            <strong>Circular Economy Aviation:</strong> Every drone built from
            60-95% recycled matatu parts. Community workshops transform old
            vehicles into modern aviation technology.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "drones", "missions", "recycling"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "drones" && <Plane className="h-4 w-4 mr-2" />}
                {tab === "missions" && <Route className="h-4 w-4 mr-2" />}
                {tab === "recycling" && <Recycle className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Drones Tab */}
        {activeTab === "drones" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Drone Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🚁 Sandukua Drone Fleet</h2>

              {drones.map((drone) => (
                <Card
                  key={drone.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedDrone(drone)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span className="text-2xl">
                            {getDroneIcon(drone.model)}
                          </span>
                          <span>{drone.name}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getModelColor(drone.model)}>
                            {drone.model}
                          </Badge>
                          <Badge className={getStatusColor(drone.status)}>
                            {drone.status}
                          </Badge>
                          <Badge variant="outline">
                            {drone.recycledContent}% recycled
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">
                          {drone.deliveriesCompleted}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Deliveries
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{drone.currentLocation}</span>
                      <span>•</span>
                      <span>Pilot: {drone.pilot}</span>
                    </div>

                    {/* Battery and Payload */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Battery</span>
                        </div>
                        <Progress value={drone.batteryLevel} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {drone.batteryLevel}%
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Payload</span>
                        </div>
                        <Progress
                          value={(drone.payload / drone.maxPayload) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {drone.payload}kg / {drone.maxPayload}kg
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-teal-600">
                          Range:
                        </span>
                        <div>{drone.range} km</div>
                      </div>
                      <div>
                        <span className="font-medium text-teal-600">
                          Flight Time:
                        </span>
                        <div>{drone.flightTime} min</div>
                      </div>
                      <div>
                        <span className="font-medium text-teal-600">
                          Total Flights:
                        </span>
                        <div>{drone.totalFlights}</div>
                      </div>
                      <div>
                        <span className="font-medium text-teal-600">
                          Operating Cost:
                        </span>
                        <div>KSH {drone.costToOperate}/hr</div>
                      </div>
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <Recycle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>
                          Built with {drone.recycledContent}% recycled materials
                        </strong>{" "}
                        from local matatu parts • Last maintenance:{" "}
                        {drone.lastMaintenance}
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button size="sm">
                        <Route className="h-3 w-3 mr-1" />
                        New Mission
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="h-3 w-3 mr-1" />
                        Live Feed
                      </Button>
                      <Button size="sm" variant="outline">
                        <Wrench className="h-3 w-3 mr-1" />
                        Maintenance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedDrone ? (
                /* Drone Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-xl">
                        {getDroneIcon(selectedDrone.model)}
                      </span>
                      <span>{selectedDrone.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Flight Specifications
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Max Range:</span>
                          <span>{selectedDrone.range} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flight Time:</span>
                          <span>{selectedDrone.flightTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Payload:</span>
                          <span>{selectedDrone.maxPayload} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Payload:</span>
                          <span>{selectedDrone.payload} kg</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Sustainability Metrics
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Recycled Content:</span>
                          <span>{selectedDrone.recycledContent}%</span>
                        </div>
                        <Progress
                          value={selectedDrone.recycledContent}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          Built from matatu {selectedDrone.recycledContent}%
                          parts
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Performance History</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Flights:</span>
                          <span>{selectedDrone.totalFlights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Successful Deliveries:</span>
                          <span>{selectedDrone.deliveriesCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span>
                            {Math.round(
                              (selectedDrone.deliveriesCompleted /
                                selectedDrone.totalFlights) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How Sandukua Drones Work */
                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="text-teal-700">
                      Indigenous Aviation Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Material Recovery:</strong> Salvage carbon fiber
                        and electronics from old matatus
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>3D Manufacturing:</strong> Community workshops
                        design and print custom components
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Assembly & Testing:</strong> Local technicians
                        build and test each drone
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Community Operation:</strong> Locally-trained
                        pilots serve regional needs
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Missions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Active Missions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {missions
                      .filter(
                        (m) => m.status === "active" || m.status === "planned",
                      )
                      .map((mission) => (
                        <div
                          key={mission.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm capitalize">
                              {mission.type}
                            </span>
                            <Badge
                              className={getPriorityColor(mission.priority)}
                            >
                              {mission.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Destination: {mission.destination}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span>
                              {mission.cargo &&
                                `${mission.cargo} (${mission.weight}kg)`}
                            </span>
                            <span>{mission.estimatedTime} min ETA</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recycled Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Recycle className="h-5 w-5" />
                    <span>Recycled Components</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {components.slice(0, 3).map((component) => (
                      <div
                        key={component.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {component.name}
                          </span>
                          <Badge
                            className={getAvailabilityColor(
                              component.availability,
                            )}
                          >
                            {component.availability}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          From: {component.sourceVehicle}
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>{component.recyclePercentage}% recycled</span>
                          <span>KSH {component.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "drones" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed mission planning, recycling station management, and
                community manufacturing coordination.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SandukuaDrones;
