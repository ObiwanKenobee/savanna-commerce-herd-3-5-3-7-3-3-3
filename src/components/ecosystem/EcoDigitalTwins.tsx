import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Heart,
  Camera,
  Smartphone,
  Star,
  Zap,
  Globe,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

interface AdoptedAnimal {
  id: string;
  name: string;
  species: string;
  emoji: string;
  lastLocation: string;
  healthStatus: string;
  adoptionDate: string;
  nftCollarId: string;
  rangerSupported: string;
  conservationImpact: number;
}

interface EcoDigitalTwinsProps {
  adoptedAnimals?: AdoptedAnimal[];
}

const defaultAnimals: AdoptedAnimal[] = [
  {
    id: "elephant-001",
    name: "Tembo",
    species: "African Elephant",
    emoji: "🐘",
    lastLocation: "Maasai Mara",
    healthStatus: "Excellent",
    adoptionDate: "2024-01-15",
    nftCollarId: "NFT-COLLAR-001",
    rangerSupported: "Joseph Kimani",
    conservationImpact: 85,
  },
  {
    id: "lion-003",
    name: "Simba",
    species: "African Lion",
    emoji: "🦁",
    lastLocation: "Amboseli",
    healthStatus: "Good",
    adoptionDate: "2024-02-20",
    nftCollarId: "NFT-COLLAR-003",
    rangerSupported: "Mary Wanjiku",
    conservationImpact: 92,
  },
];

export const EcoDigitalTwins = ({
  adoptedAnimals = defaultAnimals,
}: EcoDigitalTwinsProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState<AdoptedAnimal | null>(
    adoptedAnimals[0] || null,
  );
  const [liveTracking, setLiveTracking] = useState({
    lastMovement: new Date(),
    speed: 2.3,
    direction: "Northeast",
    nearbyAnimals: 5,
    temperature: 28,
    weather: "Sunny",
  });

  const [arSafariMode, setArSafariMode] = useState(false);

  // Simulate real-time animal tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTracking((prev) => ({
        ...prev,
        lastMovement: new Date(),
        speed: Math.random() * 5,
        direction: [
          "North",
          "Northeast",
          "East",
          "Southeast",
          "South",
          "Southwest",
          "West",
          "Northwest",
        ][Math.floor(Math.random() * 8)],
        nearbyAnimals: Math.floor(Math.random() * 10) + 1,
        temperature: 20 + Math.random() * 15,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleARSafari = () => {
    setArSafariMode(!arSafariMode);
    if (!arSafariMode) {
      alert(
        "🦁 AR Safari Mode Activated!\n\n📱 Point your camera at the sky to begin your virtual safari visit.\n\n• View your adopted animal in its natural habitat\n• Interact with the environment\n• Learn about conservation efforts\n• Take photos with your animal\n\nNote: This feature requires AR-enabled device and camera permissions.",
      );
    }
  };

  const availableForAdoption = [
    {
      name: "Kiboko",
      species: "Hippo",
      emoji: "🦛",
      location: "Mara River",
      price: "$45/month",
    },
    {
      name: "Twiga",
      species: "Giraffe",
      emoji: "🦒",
      location: "Serengeti",
      price: "$35/month",
    },
    {
      name: "Nyumbu",
      species: "Wildebeest",
      emoji: "🐃",
      location: "Maasai Mara",
      price: "$25/month",
    },
    {
      name: "Chui",
      species: "Leopard",
      emoji: "🐆",
      location: "Tsavo",
      price: "$65/month",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <CardTitle className="text-xl text-blue-800">
                  Eco-Digital Twins
                </CardTitle>
                <p className="text-sm text-blue-600">
                  Virtual Wildlife Adoption & AR Safari Experiences
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {adoptedAnimals.length} Adopted
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="adopted" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="adopted">My Adopted Animals</TabsTrigger>
              <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
              <TabsTrigger value="adopt">Adopt New Animal</TabsTrigger>
            </TabsList>

            <TabsContent value="adopted" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adoptedAnimals.map((animal, index) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedAnimal?.id === animal.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedAnimal(animal)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <div className="text-6xl">{animal.emoji}</div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {animal.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {animal.species}
                            </p>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span>Location:</span>
                              <span className="font-medium">
                                {animal.lastLocation}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Health:</span>
                              <Badge
                                variant="secondary"
                                className={
                                  animal.healthStatus === "Excellent"
                                    ? "bg-green-100 text-green-700"
                                    : animal.healthStatus === "Good"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }
                              >
                                {animal.healthStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Impact Score:</span>
                              <span className="font-semibold text-green-600">
                                {animal.conservationImpact}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {selectedAnimal && (
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{selectedAnimal.emoji}</div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedAnimal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          NFT Collar ID: {selectedAnimal.nftCollarId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Adoption Date:</span>
                          <span className="font-medium">
                            {selectedAnimal.adoptionDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ranger Supported:</span>
                          <span className="font-medium">
                            {selectedAnimal.rangerSupported}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ranger Salary Contribution:</span>
                          <span className="font-medium text-green-600">
                            50% of fees
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Conservation Impact:</span>
                          <span className="font-semibold text-green-600">
                            {selectedAnimal.conservationImpact}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Contributed:</span>
                          <span className="font-medium">$245</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Payment:</span>
                          <span className="font-medium">Jan 15, 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleARSafari}
                        className={`flex-1 ${arSafariMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {arSafariMode
                          ? "Exit AR Safari"
                          : "Start AR Safari Visit"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Heart className="mr-2 h-4 w-4" />
                        View Photos & Videos
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              {selectedAnimal ? (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-2xl">{selectedAnimal.emoji}</div>
                      <div>
                        <h3 className="font-semibold">
                          {selectedAnimal.name} Live Tracking
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Real-time location and activity data
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Last Movement:</span>
                          <span className="font-medium">
                            {liveTracking.lastMovement.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Speed:</span>
                          <span className="font-medium">
                            {liveTracking.speed.toFixed(1)} km/h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Direction:</span>
                          <span className="font-medium">
                            {liveTracking.direction}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Nearby Animals:</span>
                          <span className="font-medium">
                            {liveTracking.nearbyAnimals}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="font-medium">
                            {liveTracking.temperature.toFixed(1)}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weather:</span>
                          <span className="font-medium">
                            {liveTracking.weather}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Collar Battery:</span>
                          <span className="font-medium text-green-600">
                            87%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signal Strength:</span>
                          <span className="font-medium text-green-600">
                            Strong
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Vet Check:</span>
                          <span className="font-medium">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">
                          GPS Location
                        </h4>
                      </div>
                      <p className="text-sm text-green-600 font-mono">
                        -1.4024° S, 35.2699° E
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Amboseli National Park, Sector 7
                      </p>
                    </Card>

                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-800">
                          Herd Status
                        </h4>
                      </div>
                      <p className="text-sm text-blue-600">
                        With family group of {liveTracking.nearbyAnimals}{" "}
                        animals
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Behavior: Foraging peacefully
                      </p>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Select an adopted animal to view live tracking data
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="adopt" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Available for Virtual Adoption
                </h3>
                <p className="text-sm text-muted-foreground">
                  50% of adoption fees directly fund ranger salaries
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableForAdoption.map((animal, index) => (
                  <motion.div
                    key={animal.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-200">
                      <div className="text-center space-y-3">
                        <div className="text-5xl">{animal.emoji}</div>
                        <div>
                          <h4 className="font-semibold">{animal.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {animal.species}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {animal.location}
                          </p>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {animal.price}
                        </div>
                        <Button className="w-full">
                          <Heart className="mr-2 h-4 w-4" />
                          Adopt {animal.name}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">
                      Adoption Benefits
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">
                        🎯 Real-time GPS tracking
                      </div>
                      <div className="text-muted-foreground">
                        24/7 location updates
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">📸 AR safari visits</div>
                      <div className="text-muted-foreground">
                        Virtual reality interactions
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">
                        🛡️ Direct ranger support
                      </div>
                      <div className="text-muted-foreground">
                        50% funds ranger salaries
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
