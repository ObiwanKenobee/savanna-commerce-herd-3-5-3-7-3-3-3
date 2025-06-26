import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Navigation,
  Zap,
  MapPin,
  TrendingUp,
  Shield,
  Workflow,
  AlertTriangle,
  Battery,
  Radio,
  Wifi,
} from "lucide-react";
import { motion } from "framer-motion";

interface ElephantHerd {
  id: string;
  herdName: string;
  location: string;
  size: number;
  matriarchName: string;
  lastMovement: string;
  currentActivity: "Migrating" | "Foraging" | "Resting" | "Alert";
  routeImpact: {
    deliveriesAffected: number;
    alternativeRoutesGenerated: number;
    timeDelayPrevented: number;
    fragmentationReduced: number;
  };
}

interface DeliveryRoute {
  id: string;
  origin: string;
  destination: string;
  status: "Active" | "Rerouted" | "Delayed" | "Elephant-Optimized";
  elephantCollaborationActive: boolean;
  originalDistance: number;
  optimizedDistance: number;
  timeSaved: number;
  carbonReduced: number;
  fragmentationScore: number;
}

interface BiohubNetwork {
  id: string;
  name: string;
  location: string;
  hiveCount: number;
  pollinationActivity: number;
  networkUptime: number;
  energyGenerated: number;
  environmentalAlerts: number;
  cleanEnergyCredits: number;
}

const elephantHerds: ElephantHerd[] = [
  {
    id: "herd-001",
    herdName: "Amboseli Matriarchs",
    location: "Amboseli National Park",
    size: 23,
    matriarchName: "Qumquat",
    lastMovement: "2024-01-20 14:30",
    currentActivity: "Migrating",
    routeImpact: {
      deliveriesAffected: 12,
      alternativeRoutesGenerated: 8,
      timeDelayPrevented: 45,
      fragmentationReduced: 78,
    },
  },
  {
    id: "herd-002",
    herdName: "Tsavo Giants",
    location: "Tsavo East",
    size: 18,
    matriarchName: "Temba",
    lastMovement: "2024-01-20 16:15",
    currentActivity: "Foraging",
    routeImpact: {
      deliveriesAffected: 3,
      alternativeRoutesGenerated: 2,
      timeDelayPrevented: 15,
      fragmentationReduced: 34,
    },
  },
  {
    id: "herd-003",
    herdName: "Maasai Mara Wanderers",
    location: "Maasai Mara",
    size: 31,
    matriarchName: "Naserian",
    lastMovement: "2024-01-20 12:45",
    currentActivity: "Alert",
    routeImpact: {
      deliveriesAffected: 7,
      alternativeRoutesGenerated: 5,
      timeDelayPrevented: 32,
      fragmentationReduced: 56,
    },
  },
];

const deliveryRoutes: DeliveryRoute[] = [
  {
    id: "route-001",
    origin: "Nairobi Distribution Center",
    destination: "Kajiado Market",
    status: "Elephant-Optimized",
    elephantCollaborationActive: true,
    originalDistance: 85,
    optimizedDistance: 78,
    timeSaved: 23,
    carbonReduced: 12.5,
    fragmentationScore: 95,
  },
  {
    id: "route-002",
    origin: "Mombasa Port",
    destination: "Voi Trading Post",
    status: "Rerouted",
    elephantCollaborationActive: true,
    originalDistance: 156,
    optimizedDistance: 162,
    timeSaved: -8,
    carbonReduced: 8.3,
    fragmentationScore: 89,
  },
  {
    id: "route-003",
    origin: "Nakuru Warehouse",
    destination: "Maasai Mara Camps",
    status: "Active",
    elephantCollaborationActive: false,
    originalDistance: 142,
    optimizedDistance: 142,
    timeSaved: 0,
    carbonReduced: 0,
    fragmentationScore: 45,
  },
];

const biohubNetworks: BiohubNetwork[] = [
  {
    id: "biohub-001",
    name: "Nakuru Pollination Hub",
    location: "Nakuru Data Center",
    hiveCount: 24,
    pollinationActivity: 87,
    networkUptime: 99.2,
    energyGenerated: 1250,
    environmentalAlerts: 2,
    cleanEnergyCredits: 156,
  },
  {
    id: "biohub-002",
    name: "Thika Industrial Hives",
    location: "Thika Server Farm",
    hiveCount: 18,
    pollinationActivity: 92,
    networkUptime: 98.7,
    energyGenerated: 980,
    environmentalAlerts: 0,
    cleanEnergyCredits: 122,
  },
];

export const WildlifeToWallet = () => {
  const [selectedHerd, setSelectedHerd] = useState<ElephantHerd>(
    elephantHerds[0],
  );
  const [selectedBiohub, setSelectedBiohub] = useState<BiohubNetwork>(
    biohubNetworks[0],
  );
  const [liveData, setLiveData] = useState({
    totalRoutesOptimized: 47,
    carbonSaved: 245.8,
    fragmentationReduced: 72,
    cleanEnergyGenerated: 2230,
    pollinationEvents: 15420,
    environmentalAlertsActive: 3,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        totalRoutesOptimized:
          prev.totalRoutesOptimized + Math.floor(Math.random() * 2),
        carbonSaved: prev.carbonSaved + Math.random() * 5,
        pollinationEvents:
          prev.pollinationEvents + Math.floor(Math.random() * 50),
        cleanEnergyGenerated: prev.cleanEnergyGenerated + Math.random() * 20,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const callElephantAPI = () => {
    alert(`🐘 Elephant Migration API Called!

📍 Current Herd Locations:
• Amboseli Matriarchs: GPS trails active
• Tsavo Giants: Foraging near water
• Mara Wanderers: Alert status - possible threat

🚛 Route Optimization Response:
✅ 3 delivery routes automatically adjusted
🌿 Fragmentation risk reduced by 67%
⏱️ Average delay prevented: 28 minutes
🌍 Carbon footprint reduced by 15kg CO²

API Endpoint: GET /api/migration-corridors
Response: JSON with current elephant GPS trails to avoid`);
  };

  const activateEnvironmentalAlert = () => {
    const biohub = selectedBiohub;
    alert(`🚨 Environmental Alert Activated!

🐝 ${biohub.name} Hive Network:
• Sudden silence detected in 3 hives
• Possible environmental threat
• Air quality monitoring initiated

🔔 Automated Response:
✅ Nearby communities notified
📊 Sensor network activated
🚁 Drone surveillance deployed
📱 Conservation teams alerted

⚡ Network Status: Maintaining ${biohub.networkUptime}% uptime
🌿 Clean energy production: ${biohub.energyGenerated}kWh/day`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-orange-800">
                  Wildlife-to-Wallet (W2W) Economy
                </CardTitle>
                <p className="text-sm text-orange-600">
                  Animal-AI collaboration & bio-transactional systems
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700"
            >
              Live Ecosystem
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elephant-ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elephant-ai">Elephant-AI Routing</TabsTrigger>
              <TabsTrigger value="bio-network">
                Bio-Transactional Network
              </TabsTrigger>
              <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="elephant-ai" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-orange-800">
                    Active Elephant Herds
                  </h3>
                  {elephantHerds.map((herd, index) => (
                    <Card
                      key={herd.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedHerd.id === herd.id
                          ? "ring-2 ring-orange-500"
                          : ""
                      }`}
                      onClick={() => setSelectedHerd(herd)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm flex items-center">
                              🐘 {herd.herdName}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                herd.currentActivity === "Alert"
                                  ? "bg-red-100 text-red-700"
                                  : herd.currentActivity === "Migrating"
                                    ? "bg-blue-100 text-blue-700"
                                    : herd.currentActivity === "Foraging"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {herd.currentActivity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {herd.location}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Herd Size:</span>
                              <span className="font-medium">
                                {herd.size} elephants
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Matriarch:</span>
                              <span className="font-medium">
                                {herd.matriarchName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Routes Affected:</span>
                              <span className="font-medium text-orange-600">
                                {herd.routeImpact.deliveriesAffected}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            🐘 {selectedHerd.herdName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedHerd.location}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedHerd.currentActivity === "Alert"
                              ? "bg-red-100 text-red-700"
                              : selectedHerd.currentActivity === "Migrating"
                                ? "bg-blue-100 text-blue-700"
                                : selectedHerd.currentActivity === "Foraging"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedHerd.currentActivity}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedHerd.size}
                          </div>
                          <div className="text-muted-foreground">Herd Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedHerd.routeImpact.deliveriesAffected}
                          </div>
                          <div className="text-muted-foreground">
                            Routes Affected
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedHerd.routeImpact.timeDelayPrevented}
                          </div>
                          <div className="text-muted-foreground">
                            Minutes Saved
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedHerd.routeImpact.fragmentationReduced}%
                          </div>
                          <div className="text-muted-foreground">
                            Fragmentation ↓
                          </div>
                        </div>
                      </div>

                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800 flex items-center">
                            <Navigation className="mr-2 h-4 w-4" />
                            Real-time Route Optimization
                          </h4>
                          <div className="text-sm text-blue-600">
                            <div>📍 Current GPS: -2.6527°S, 37.2606°E</div>
                            <div>
                              🧭 Movement Direction: Northeast, 2.3 km/h
                            </div>
                            <div>
                              ⏰ Last Update: {selectedHerd.lastMovement}
                            </div>
                            <div>
                              🚛 Alternative routes generated:{" "}
                              {
                                selectedHerd.routeImpact
                                  .alternativeRoutesGenerated
                              }
                            </div>
                          </div>
                        </div>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="p-3 text-center">
                          <div className="text-lg font-bold text-green-600">
                            {selectedHerd.routeImpact.fragmentationReduced}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Habitat Fragmentation Reduced
                          </div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedHerd.routeImpact.timeDelayPrevented}min
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Delivery Delays Prevented
                          </div>
                        </Card>
                        <Card className="p-3 text-center">
                          <div className="text-lg font-bold text-purple-600">
                            87%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Human-Wildlife Conflict ↓
                          </div>
                        </Card>
                      </div>

                      <Button
                        onClick={callElephantAPI}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Call Elephant Migration API
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-800">
                    Active Delivery Routes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {deliveryRoutes.map((route) => (
                      <Card key={route.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                route.status === "Elephant-Optimized"
                                  ? "bg-green-100 text-green-700"
                                  : route.status === "Rerouted"
                                    ? "bg-blue-100 text-blue-700"
                                    : route.status === "Delayed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {route.status}
                            </Badge>
                            {route.elephantCollaborationActive && (
                              <span className="text-lg">🐘</span>
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{route.origin}</div>
                            <div className="text-muted-foreground">↓</div>
                            <div className="font-medium">
                              {route.destination}
                            </div>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Distance:</span>
                              <span
                                className={
                                  route.optimizedDistance <
                                  route.originalDistance
                                    ? "text-green-600 font-medium"
                                    : ""
                                }
                              >
                                {route.optimizedDistance}km
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time Impact:</span>
                              <span
                                className={
                                  route.timeSaved > 0
                                    ? "text-green-600 font-medium"
                                    : route.timeSaved < 0
                                      ? "text-red-600 font-medium"
                                      : ""
                                }
                              >
                                {route.timeSaved > 0 ? "+" : ""}
                                {route.timeSaved}min
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fragmentation Score:</span>
                              <span
                                className={
                                  route.fragmentationScore > 80
                                    ? "text-green-600 font-medium"
                                    : route.fragmentationScore > 60
                                      ? "text-yellow-600 font-medium"
                                      : "text-red-600 font-medium"
                                }
                              >
                                {route.fragmentationScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="bio-network" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-orange-800">
                    Biohub Network Status
                  </h3>
                  {biohubNetworks.map((biohub, index) => (
                    <Card
                      key={biohub.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedBiohub.id === biohub.id
                          ? "ring-2 ring-orange-500"
                          : ""
                      }`}
                      onClick={() => setSelectedBiohub(biohub)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm flex items-center">
                              🐝 {biohub.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                biohub.networkUptime > 99
                                  ? "bg-green-100 text-green-700"
                                  : biohub.networkUptime > 95
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {biohub.networkUptime}% Uptime
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {biohub.location}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Active Hives:</span>
                              <span className="font-medium">
                                {biohub.hiveCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pollination Activity:</span>
                              <span className="font-medium text-green-600">
                                {biohub.pollinationActivity}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Energy Generated:</span>
                              <span className="font-medium text-blue-600">
                                {biohub.energyGenerated}kWh
                              </span>
                            </div>
                            {biohub.environmentalAlerts > 0 && (
                              <div className="flex justify-between">
                                <span>Alerts:</span>
                                <span className="font-medium text-red-600">
                                  {biohub.environmentalAlerts}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            🐝 {selectedBiohub.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedBiohub.location}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedBiohub.networkUptime > 99
                              ? "bg-green-100 text-green-700"
                              : selectedBiohub.networkUptime > 95
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedBiohub.networkUptime}% Uptime
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">
                            {selectedBiohub.hiveCount}
                          </div>
                          <div className="text-muted-foreground">
                            Active Hives
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedBiohub.pollinationActivity}%
                          </div>
                          <div className="text-muted-foreground">
                            Pollination Activity
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedBiohub.energyGenerated}
                          </div>
                          <div className="text-muted-foreground">
                            kWh Generated
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedBiohub.cleanEnergyCredits}
                          </div>
                          <div className="text-muted-foreground">
                            Energy Credits
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pollination Activity:</span>
                          <span className="font-medium">
                            {selectedBiohub.pollinationActivity}%
                          </span>
                        </div>
                        <Progress
                          value={selectedBiohub.pollinationActivity}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="p-3 bg-green-50 border-green-200">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-medium text-green-800 text-sm">
                                Clean Energy
                              </h4>
                              <p className="text-xs text-green-600">
                                {selectedBiohub.energyGenerated}kWh/day
                                generated
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-3 bg-blue-50 border-blue-200">
                          <div className="flex items-center space-x-2">
                            <Radio className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-blue-800 text-sm">
                                Network Status
                              </h4>
                              <p className="text-xs text-blue-600">
                                {selectedBiohub.networkUptime}% uptime
                                maintained
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {selectedBiohub.environmentalAlerts > 0 && (
                        <Card className="p-3 bg-red-50 border-red-200">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <h4 className="font-medium text-red-800 text-sm">
                                Environmental Alert
                              </h4>
                              <p className="text-xs text-red-600">
                                {selectedBiohub.environmentalAlerts} active
                                alerts detected
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}

                      <Button
                        onClick={activateEnvironmentalAlert}
                        variant={
                          selectedBiohub.environmentalAlerts > 0
                            ? "destructive"
                            : "outline"
                        }
                        className="w-full"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {selectedBiohub.environmentalAlerts > 0
                          ? "View Active Alerts"
                          : "Test Alert System"}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">
                    Bio-Transactional System Overview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {liveData.cleanEnergyGenerated.toFixed(0)}
                      </div>
                      <div className="text-muted-foreground">
                        kWh Clean Energy
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {liveData.pollinationEvents.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        Pollination Events
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {biohubNetworks.reduce(
                          (sum, hub) => sum + hub.cleanEnergyCredits,
                          0,
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Energy Credits
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-600">
                        {liveData.environmentalAlertsActive}
                      </div>
                      <div className="text-muted-foreground">Active Alerts</div>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 text-center">
                    🐝 Beehive activity directly powers network infrastructure
                    while monitoring environmental health
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Wildlife-Economy Integration Impact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time metrics showing how animal behavior optimizes human
                  economic activity
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Card className="p-4 text-center bg-blue-50 border-blue-200">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {liveData.totalRoutesOptimized}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Routes Optimized
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      +12 this week
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-4 text-center bg-green-50 border-green-200">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {liveData.carbonSaved.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      kg CO² Saved
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Through route optimization
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-4 text-center bg-purple-50 border-purple-200">
                    <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {liveData.fragmentationReduced}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fragmentation ↓
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Habitat protection
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-4 text-center bg-amber-50 border-amber-200">
                    <Zap className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-600">
                      {liveData.cleanEnergyGenerated.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      kWh Generated
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      Bio-transactional energy
                    </div>
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-800">
                      Animal-AI Collaboration Benefits
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Delivery efficiency</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          +23%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">
                            Human-wildlife conflict
                          </span>
                        </div>
                        <span className="font-semibold text-blue-600">
                          -30%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Habitat fragmentation</span>
                        </div>
                        <span className="font-semibold text-purple-600">
                          -{liveData.fragmentationReduced}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-sm">Carbon footprint</span>
                        </div>
                        <span className="font-semibold text-amber-600">
                          -15%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-800">
                      Bio-Network Performance
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Network Uptime:</span>
                          <span className="font-medium">98.95%</span>
                        </div>
                        <Progress value={98.95} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pollination Activity:</span>
                          <span className="font-medium">89.5%</span>
                        </div>
                        <Progress value={89.5} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Energy Generation:</span>
                          <span className="font-medium">92.3%</span>
                        </div>
                        <Progress value={92.3} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Environmental Monitoring:</span>
                          <span className="font-medium">96.8%</span>
                        </div>
                        <Progress value={96.8} className="h-2" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Workflow className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">
                      Ecosystem Symbiosis
                    </h4>
                    <p className="text-sm text-orange-600">
                      Wildlife behavior directly optimizes economic efficiency
                      while protecting natural habitats - a true win-win
                      ecosystem
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-300"
                  >
                    View Full Report
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
