import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Satellite,
  TreePine,
  Award,
  Zap,
  Camera,
  QrCode,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

interface LionLoyaltyProgramProps {
  userPurchases?: number;
  habitatProtected?: number;
  carbonOffset?: number;
}

export const LionLoyaltyProgram = ({
  userPurchases = 0,
  habitatProtected = 0,
  carbonOffset = 0,
}: LionLoyaltyProgramProps) => {
  const [realTimeUpdates, setRealTimeUpdates] = useState({
    lionTerritory: 2847,
    elephantPaths: 12,
    activeDrones: 8,
    rangersActive: 24,
  });

  const [trackingData, setTrackingData] = useState({
    lastUpdate: new Date(),
    satelliteStatus: "Active",
    gpsCoordinates: "-1.2921° S, 36.8219° E",
    habitatHealth: 94,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdates((prev) => ({
        ...prev,
        lionTerritory: prev.lionTerritory + Math.floor(Math.random() * 5),
        activeDrones: prev.activeDrones + Math.floor(Math.random() * 2 - 1),
      }));
      setTrackingData((prev) => ({
        ...prev,
        lastUpdate: new Date(),
        habitatHealth: Math.max(
          90,
          Math.min(98, prev.habitatHealth + Math.random() * 2 - 1),
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUSSDTracking = () => {
    // Simulate USSD response
    alert(
      `📱 USSD Response:\n*384*WILD#\n\n🦁 Your Conservation Impact:\n✅ ${habitatProtected + userPurchases * 10}m² protected\n🌳 ${Math.floor((habitatProtected + userPurchases * 10) / 100)} trees funded\n🛡️ Supporting ${Math.ceil(habitatProtected / 1000)} rangers\n\nReply: \n1. Real-time tracking\n2. Adopt wildlife\n3. View certificates`,
    );
  };

  const impactMetrics = [
    {
      label: "Habitat Protected",
      value: `${(habitatProtected + userPurchases * 10).toLocaleString()}m²`,
      icon: TreePine,
      color: "text-green-600",
      progress: Math.min(
        100,
        ((habitatProtected + userPurchases * 10) / 100000) * 100,
      ),
    },
    {
      label: "Lions Supported",
      value: Math.ceil(
        (habitatProtected + userPurchases * 10) / 10000,
      ).toString(),
      icon: Shield,
      color: "text-amber-600",
      progress: Math.min(
        100,
        (Math.ceil((habitatProtected + userPurchases * 10) / 10000) / 50) * 100,
      ),
    },
    {
      label: "Rangers Funded",
      value: Math.ceil(habitatProtected / 1000).toString(),
      icon: Award,
      color: "text-blue-600",
      progress: Math.min(100, (Math.ceil(habitatProtected / 1000) / 20) * 100),
    },
    {
      label: "Carbon Offset",
      value: `${carbonOffset + userPurchases * 2.5}kg CO²`,
      icon: Zap,
      color: "text-purple-600",
      progress: Math.min(
        100,
        ((carbonOffset + userPurchases * 2.5) / 1000) * 100,
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div>
                <CardTitle className="text-xl text-green-800">
                  Lion Loyalty Program
                </CardTitle>
                <p className="text-sm text-green-600">
                  Every purchase protects 10m² of lion habitat
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active Guardian
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="impact" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="impact">Impact Dashboard</TabsTrigger>
              <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
              <TabsTrigger value="certificates">
                Digital Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="impact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {impactMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <metric.icon className={`h-5 w-5 ${metric.color}`} />
                          <span className="text-sm font-medium">
                            {metric.label}
                          </span>
                        </div>
                        <span className="text-lg font-bold">
                          {metric.value}
                        </span>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center space-x-3">
                  <QrCode className="h-8 w-8 text-amber-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-800">
                      GS1 Digital Product Passports
                    </h4>
                    <p className="text-sm text-amber-600">
                      Trace your purchase impact through blockchain-verified
                      supply chain transparency
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300"
                  >
                    Scan QR
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Satellite className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">
                      Real-Time Satellite Updates
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        {trackingData.satelliteStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Update:</span>
                      <span className="text-muted-foreground">
                        {trackingData.lastUpdate.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span className="text-blue-600 font-mono text-xs">
                        {trackingData.gpsCoordinates}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitat Health:</span>
                      <span className="text-green-600 font-semibold">
                        {trackingData.habitatHealth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold">Live Conservation Data</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🦁 Lion Territory:</span>
                      <span className="font-semibold">
                        {realTimeUpdates.lionTerritory.toLocaleString()}m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>🐘 Elephant Paths:</span>
                      <span className="font-semibold">
                        {realTimeUpdates.elephantPaths}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚁 Active Drones:</span>
                      <span className="font-semibold">
                        {realTimeUpdates.activeDrones}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>👮 Rangers On Duty:</span>
                      <span className="font-semibold">
                        {realTimeUpdates.rangersActive}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleUSSDTracking}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <span className="mr-2">📱</span>
                  Get USSD Update (*384*WILD#)
                </Button>
                <Button variant="outline" className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  View Live Cameras
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-800">
                      Conservation Certificate
                    </h4>
                    <p className="text-sm text-blue-600">
                      Blockchain-verified proof of your habitat protection
                      contribution
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300"
                    >
                      Download NFT Certificate
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <TreePine className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-800">
                      Carbon Credit Token
                    </h4>
                    <p className="text-sm text-purple-600">
                      Tradeable carbon credits from verified conservation
                      projects
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300"
                    >
                      View Carbon NFTs
                    </Button>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      IoT Conservation Easements
                    </h4>
                    <p className="text-sm text-green-600">
                      Smart contracts ensuring perpetual protection of purchased
                      habitat areas
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Contract
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
