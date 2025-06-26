import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Truck,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Calendar,
  User,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

interface Delivery {
  id: string;
  trackingNumber: string;
  status:
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "delayed";
  currentLocation: string;
  destination: string;
  estimatedDelivery: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicle: string;
  items: string[];
  specialInstructions?: string;
  deliveryType: "standard" | "cheetah" | "same_day";
  timeline: {
    timestamp: string;
    location: string;
    status: string;
    description: string;
  }[];
}

const TrackPage = () => {
  const [trackingInput, setTrackingInput] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Sample delivery data
  const deliveries: Delivery[] = [
    {
      id: "1",
      trackingNumber: "SV2025-001-KE",
      status: "out_for_delivery",
      currentLocation: "Westlands, Nairobi",
      destination: "Karen Shopping Centre",
      estimatedDelivery: "2025-01-16 14:30",
      driverName: "John Mwangi",
      driverPhone: "+254712345678",
      driverRating: 4.8,
      vehicle: "🏍️ Boda Boda KDE 123A",
      items: ["Maize Flour 10kg", "Sugar 5kg", "Cooking Oil 2L"],
      deliveryType: "cheetah",
      specialInstructions: "Call when arrived, gate security",
      timeline: [
        {
          timestamp: "2025-01-16 09:00",
          location: "Twiga Foods Warehouse",
          status: "picked_up",
          description: "Package picked up from supplier",
        },
        {
          timestamp: "2025-01-16 10:30",
          location: "Industrial Area",
          status: "in_transit",
          description: "On route to destination",
        },
        {
          timestamp: "2025-01-16 13:45",
          location: "Westlands",
          status: "out_for_delivery",
          description: "Out for delivery - arriving soon",
        },
      ],
    },
    {
      id: "2",
      trackingNumber: "SV2025-002-KE",
      status: "delivered",
      currentLocation: "Delivered",
      destination: "Kiambu Road Shop",
      estimatedDelivery: "2025-01-15 16:00",
      driverName: "Grace Njeri",
      driverPhone: "+254723456789",
      driverRating: 4.9,
      vehicle: "🚛 Truck KCB 456B",
      items: ["Rice 50kg", "Wheat Flour 25kg", "Tea Leaves 10kg"],
      deliveryType: "standard",
      timeline: [
        {
          timestamp: "2025-01-15 08:00",
          location: "Mwea Rice Mills",
          status: "picked_up",
          description: "Package collected from supplier",
        },
        {
          timestamp: "2025-01-15 12:30",
          location: "Thika Road",
          status: "in_transit",
          description: "In transit via Thika Superhighway",
        },
        {
          timestamp: "2025-01-15 15:45",
          location: "Kiambu Road Shop",
          status: "delivered",
          description: "Successfully delivered and signed for",
        },
      ],
    },
    {
      id: "3",
      trackingNumber: "SV2025-003-KE",
      status: "delayed",
      currentLocation: "Mombasa Road (Traffic)",
      destination: "Eastleigh Market",
      estimatedDelivery: "2025-01-16 17:00",
      driverName: "Ahmed Hassan",
      driverPhone: "+254734567890",
      driverRating: 4.6,
      vehicle: "🚐 Van KAY 789C",
      items: ["Cooking Oil 20L", "Sugar 30kg", "Salt 15kg"],
      deliveryType: "same_day",
      specialInstructions: "Heavy traffic on Mombasa Road",
      timeline: [
        {
          timestamp: "2025-01-16 11:00",
          location: "Bidco Warehouse",
          status: "picked_up",
          description: "Items loaded and departed",
        },
        {
          timestamp: "2025-01-16 14:30",
          location: "Mombasa Road",
          status: "delayed",
          description: "Delayed due to heavy traffic jam",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "picked_up":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />;
      case "in_transit":
        return <Navigation className="h-4 w-4" />;
      case "picked_up":
        return <Package className="h-4 w-4" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case "cheetah":
        return "⚡";
      case "same_day":
        return "🚀";
      case "standard":
        return "🚛";
      default:
        return "📦";
    }
  };

  const handleTrackDelivery = () => {
    const delivery = deliveries.find((d) => d.trackingNumber === trackingInput);
    if (delivery) {
      setSelectedDelivery(delivery.id);
    } else {
      alert("❌ Tracking number not found. Please check and try again.");
    }
  };

  const handleCallDriver = (phone: string, name: string) => {
    window.open(`tel:${phone}`, "_self");
    console.log(`📞 Calling ${name} at ${phone}`);
  };

  const handleWhatsAppDriver = (phone: string, trackingNumber: string) => {
    const message = `Hello! I'm tracking delivery ${trackingNumber}. What's the current status?`;
    window.open(
      `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  // Simulate live updates
  useEffect(() => {
    if (liveUpdates) {
      const interval = setInterval(() => {
        console.log("🔄 Live location update simulated");
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [liveUpdates]);

  const activeDeliveries = deliveries.filter(
    (d) => !["delivered", "cancelled"].includes(d.status),
  );
  const completedDeliveries = deliveries.filter(
    (d) => d.status === "delivered",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📍 Safari Routes Tracker
                </h1>
                <p className="text-gray-600">
                  Real-time delivery tracking across Kenya
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Deliveries
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {activeDeliveries.length}
                      </p>
                    </div>
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed Today
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {completedDeliveries.length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg. Rating
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">4.8</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Live Updates
                      </p>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${liveUpdates ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                        ></div>
                        <span className="text-sm font-medium">
                          {liveUpdates ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLiveUpdates(!liveUpdates)}
                    >
                      <Zap className="h-6 w-6 text-blue-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Track Delivery Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-xl">🔍</span>
                <span>Track Your Delivery</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter tracking number (e.g., SV2025-001-KE)"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleTrackDelivery}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <strong>Try these tracking numbers:</strong> SV2025-001-KE,
                SV2025-002-KE, SV2025-003-KE
              </div>
            </CardContent>
          </Card>

          {/* Delivery Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className={`hover:shadow-lg transition-shadow ${selectedDelivery === delivery.id ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getDeliveryTypeIcon(delivery.deliveryType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {delivery.trackingNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {delivery.destination}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1 capitalize">
                        {delivery.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Current Status */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Current Location
                        </span>
                        {liveUpdates && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs">Live</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {delivery.currentLocation}
                        </span>
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Estimated Delivery:</span>
                      </div>
                      <span className="font-medium">
                        {new Date(delivery.estimatedDelivery).toLocaleString()}
                      </span>
                    </div>

                    {/* Driver Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {delivery.driverName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {delivery.vehicle}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs">
                                {delivery.driverRating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleCallDriver(
                                delivery.driverPhone,
                                delivery.driverName,
                              )
                            }
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleWhatsAppDriver(
                                delivery.driverPhone,
                                delivery.trackingNumber,
                              )
                            }
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Items ({delivery.items.length})
                      </div>
                      <div className="space-y-1">
                        {delivery.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <Package className="h-3 w-3 text-gray-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {delivery.specialInstructions && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800 mb-1">
                          Special Instructions
                        </div>
                        <div className="text-sm text-yellow-700">
                          {delivery.specialInstructions}
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <div className="text-sm font-medium mb-3">
                        Delivery Timeline
                      </div>
                      <div className="space-y-3">
                        {delivery.timeline.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className={`w-3 h-3 rounded-full mt-1 ${index === delivery.timeline.length - 1 ? "bg-blue-500" : "bg-gray-300"}`}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {event.location}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    event.timestamp,
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {event.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedDelivery(delivery.id)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        View Map
                      </Button>
                      {delivery.status === "delivered" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Star className="h-4 w-4 mr-1" />
                          Rate Driver
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Emergency Contact */}
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-800">
                      🚨 Emergency Support
                    </h3>
                    <p className="text-sm text-red-700">
                      For urgent delivery issues or emergencies
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Button className="bg-red-600 hover:bg-red-700 mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    Call 0700-SAVANNA
                  </Button>
                  <div className="text-xs text-red-600">
                    24/7 Emergency Line
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default TrackPage;
