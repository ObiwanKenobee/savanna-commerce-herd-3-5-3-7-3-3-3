import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  Route,
  Fuel,
  Timer,
  Eye,
  Share2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface DeliveryTracking {
  id: string;
  order_id: string;
  tracking_number: string;
  status:
    | "assigned"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed";
  driver: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    rating: number;
    vehicle: {
      type: "motorcycle" | "van" | "truck";
      plate_number: string;
      capacity: string;
    };
    location?: {
      lat: number;
      lng: number;
      address: string;
      timestamp: string;
    };
  };
  route: {
    origin: {
      address: string;
      lat: number;
      lng: number;
    };
    destination: {
      address: string;
      lat: number;
      lng: number;
    };
    waypoints?: Array<{
      address: string;
      lat: number;
      lng: number;
      status: "pending" | "visited" | "skipped";
    }>;
    distance_km: number;
    estimated_duration_minutes: number;
    actual_duration_minutes?: number;
  };
  timeline: Array<{
    id: string;
    status: string;
    description: string;
    timestamp: string;
    location?: string;
    photo?: string;
    signature?: string;
  }>;
  estimated_delivery: string;
  actual_delivery?: string;
  special_instructions?: string;
  delivery_proof?: {
    photo: string;
    signature: string;
    recipient_name: string;
  };
  created_at: string;
  updated_at: string;
}

const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "assigned":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: "📋",
          label: "Assigned",
        };
      case "picked_up":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: "📦",
          label: "Picked Up",
        };
      case "in_transit":
        return {
          color: "bg-amber-100 text-amber-800",
          icon: "🚛",
          label: "In Transit",
        };
      case "out_for_delivery":
        return {
          color: "bg-green-100 text-green-800",
          icon: "🏃",
          label: "Out for Delivery",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: "✅",
          label: "Delivered",
        };
      case "failed":
        return {
          color: "bg-red-100 text-red-800",
          icon: "❌",
          label: "Failed",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.color}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

const DeliveryTimeline = ({
  timeline,
}: {
  timeline: DeliveryTracking["timeline"];
}) => {
  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={event.id} className="flex items-start space-x-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0 ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            {index === 0 ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {event.description}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {event.location && (
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {event.location}
              </p>
            )}
            {event.photo && (
              <div className="mt-2">
                <img
                  src={event.photo}
                  alt="Delivery proof"
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const LiveMap = ({ delivery }: { delivery: DeliveryTracking }) => {
  // Mock map component - In production, integrate with Google Maps or Mapbox
  const progress =
    delivery.status === "delivered"
      ? 100
      : delivery.status === "out_for_delivery"
        ? 80
        : delivery.status === "in_transit"
          ? 50
          : delivery.status === "picked_up"
            ? 25
            : 10;

  return (
    <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center relative overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-green-200 opacity-30"></div>

      {/* Route visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs text-gray-600">Origin</span>
              <p className="text-xs font-medium">
                {delivery.route.origin.address}
              </p>
            </div>

            <div className="flex-1 relative">
              <div className="h-1 bg-gray-300 rounded-full">
                <div
                  className="h-1 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {delivery.driver.location && (
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${progress}%` }}
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Truck className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs text-gray-600">Destination</span>
              <p className="text-xs font-medium">
                {delivery.route.destination.address}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Distance:</span>
                <div className="font-medium">
                  {delivery.route.distance_km} km
                </div>
              </div>
              <div>
                <span className="text-gray-500">ETA:</span>
                <div className="font-medium">
                  {new Date(delivery.estimated_delivery).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryCard = ({
  delivery,
  onViewDetails,
}: {
  delivery: DeliveryTracking;
  onViewDetails: (id: string) => void;
}) => {
  const getProgressPercentage = () => {
    switch (delivery.status) {
      case "assigned":
        return 10;
      case "picked_up":
        return 25;
      case "in_transit":
        return 50;
      case "out_for_delivery":
        return 80;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "motorcycle":
        return "🏍️";
      case "van":
        return "🚐";
      case "truck":
        return "🚛";
      default:
        return "🚛";
    }
  };

  const isActive =
    delivery.status !== "delivered" && delivery.status !== "failed";

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${isActive ? "border-green-200" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Order #{delivery.order_id.slice(-6)}
          </CardTitle>
          <DeliveryStatusBadge status={delivery.status} />
        </div>
        <div className="text-sm text-gray-600">
          Tracking: {delivery.tracking_number}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Delivery Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Driver Info */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={delivery.driver.avatar} />
              <AvatarFallback>{delivery.driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">{delivery.driver.name}</p>
                <Badge variant="outline" className="text-xs">
                  {getVehicleIcon(delivery.driver.vehicle.type)}{" "}
                  {delivery.driver.vehicle.plate_number}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">
                  {delivery.driver.rating}
                </span>
                <span className="text-xs text-gray-500">
                  • {delivery.driver.vehicle.capacity}
                </span>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm">
                <Phone className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Location & ETA */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Current Location:
            </span>
            <div className="font-medium truncate">
              {delivery.driver.location?.address || "Location updating..."}
            </div>
          </div>
          <div>
            <span className="text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              ETA:
            </span>
            <div className="font-medium">
              {new Date(delivery.estimated_delivery).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Route:</span>
            <span className="text-gray-600">
              {delivery.route.distance_km} km
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="truncate">{delivery.route.origin.address}</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="truncate">
                {delivery.route.destination.address}
              </span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {delivery.special_instructions && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-800">
                  Special Instructions:
                </p>
                <p className="text-xs text-amber-700">
                  {delivery.special_instructions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(delivery.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Track Live
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(delivery.updated_at).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export const DeliveryTracker = () => {
  const [deliveries, setDeliveries] = useState<DeliveryTracking[]>([]);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryTracking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "delivered">(
    "active",
  );
  const { user } = useAuth();

  // Mock data - In production, this would come from Supabase with real-time updates
  useEffect(() => {
    const mockDeliveries: DeliveryTracking[] = [
      {
        id: "del_001",
        order_id: "ORD-12345",
        tracking_number: "SAV-TRK-001",
        status: "in_transit",
        driver: {
          id: "driver_001",
          name: "James Kamau",
          avatar: "",
          phone: "+254 712 345 678",
          rating: 4.8,
          vehicle: {
            type: "van",
            plate_number: "KCA 123X",
            capacity: "1 ton",
          },
          location: {
            lat: -1.2921,
            lng: 36.8219,
            address: "Uhuru Highway, Nairobi",
            timestamp: new Date().toISOString(),
          },
        },
        route: {
          origin: {
            address: "Mwangi Supplies, Industrial Area",
            lat: -1.3229,
            lng: 36.8397,
          },
          destination: {
            address: "Quick Mart, Westlands",
            lat: -1.2676,
            lng: 36.8108,
          },
          distance_km: 15.2,
          estimated_duration_minutes: 45,
        },
        timeline: [
          {
            id: "tl_004",
            status: "in_transit",
            description: "Package is on the way to destination",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            location: "Uhuru Highway, Nairobi",
          },
          {
            id: "tl_003",
            status: "picked_up",
            description: "Package picked up from Mwangi Supplies",
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            location: "Industrial Area, Nairobi",
            photo: "/mock-pickup-photo.jpg",
          },
          {
            id: "tl_002",
            status: "assigned",
            description: "Driver assigned to delivery",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
        ],
        estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        special_instructions:
          "Call recipient before delivery. Building has security gate.",
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "del_002",
        order_id: "ORD-12346",
        tracking_number: "SAV-TRK-002",
        status: "delivered",
        driver: {
          id: "driver_002",
          name: "Mary Njeri",
          avatar: "",
          phone: "+254 722 456 789",
          rating: 4.9,
          vehicle: {
            type: "motorcycle",
            plate_number: "KDB 456Y",
            capacity: "50 kg",
          },
        },
        route: {
          origin: {
            address: "Coast Traders, Tom Mboya Street",
            lat: -1.2841,
            lng: 36.8234,
          },
          destination: {
            address: "Mama Njeri's Shop, Eastleigh",
            lat: -1.2833,
            lng: 36.85,
          },
          distance_km: 8.5,
          estimated_duration_minutes: 25,
          actual_duration_minutes: 22,
        },
        timeline: [
          {
            id: "tl_008",
            status: "delivered",
            description: "Package delivered successfully",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            location: "Eastleigh, Nairobi",
            photo: "/mock-delivery-photo.jpg",
            signature: "delivered_signature.png",
          },
          {
            id: "tl_007",
            status: "out_for_delivery",
            description: "Out for delivery",
            timestamp: new Date(
              Date.now() - 2.5 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "tl_006",
            status: "picked_up",
            description: "Package picked up",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            location: "Tom Mboya Street, Nairobi",
          },
        ],
        estimated_delivery: new Date(
          Date.now() - 2 * 60 * 60 * 1000,
        ).toISOString(),
        actual_delivery: new Date(
          Date.now() - 2 * 60 * 60 * 1000,
        ).toISOString(),
        delivery_proof: {
          photo: "/mock-delivery-photo.jpg",
          signature: "delivered_signature.png",
          recipient_name: "Mama Njeri",
        },
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setDeliveries(mockDeliveries);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setDeliveries((prev) =>
        prev.map((delivery) => {
          if (
            delivery.status === "in_transit" ||
            delivery.status === "out_for_delivery"
          ) {
            return {
              ...delivery,
              updated_at: new Date().toISOString(),
              driver: {
                ...delivery.driver,
                location: delivery.driver.location
                  ? {
                      ...delivery.driver.location,
                      timestamp: new Date().toISOString(),
                    }
                  : delivery.driver.location,
              },
            };
          }
          return delivery;
        }),
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (deliveryId: string) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      setShowDetails(true);
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    switch (filter) {
      case "active":
        return delivery.status !== "delivered" && delivery.status !== "failed";
      case "delivered":
        return delivery.status === "delivered";
      default:
        return true;
    }
  });

  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "delivered" && d.status !== "failed",
  ).length;
  const deliveredToday = deliveries.filter(
    (d) => d.status === "delivered",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Truck className="h-8 w-8 text-green-600" />
            <span>🐆 Cheetah Logistics</span>
          </h1>
          <p className="text-gray-600">
            Real-time delivery tracking across the savanna
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Deliveries
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active ({activeDeliveries})
          </Button>
          <Button
            variant={filter === "delivered" ? "default" : "outline"}
            onClick={() => setFilter("delivered")}
          >
            Delivered ({deliveredToday})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {activeDeliveries}
            </div>
            <div className="text-sm text-gray-600">Active Deliveries</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {deliveredToday}
            </div>
            <div className="text-sm text-gray-600">Delivered Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Timer className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-600">23</div>
            <div className="text-sm text-gray-600">Avg Delivery (min)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries Grid */}
      {filteredDeliveries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Truck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No deliveries found</h3>
          <p className="text-gray-600">
            No deliveries match your current filter
          </p>
        </div>
      )}

      {/* Delivery Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>
                Delivery Details - {selectedDelivery?.tracking_number}
              </span>
              {selectedDelivery && (
                <DeliveryStatusBadge status={selectedDelivery.status} />
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedDelivery && (
            <div className="space-y-6">
              {/* Live Map */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Navigation className="h-4 w-4 mr-2" />
                  Live Tracking
                </h3>
                <LiveMap delivery={selectedDelivery} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Driver Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedDelivery.driver.avatar} />
                        <AvatarFallback>
                          {selectedDelivery.driver.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedDelivery.driver.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">
                            {selectedDelivery.driver.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedDelivery.driver.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span>
                          {selectedDelivery.driver.vehicle.plate_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span>{selectedDelivery.driver.vehicle.capacity}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeliveryTimeline timeline={selectedDelivery.timeline} />
                  </CardContent>
                </Card>
              </div>

              {/* Route Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Route className="h-4 w-4 mr-2" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Origin:</span>
                      <p className="font-medium">
                        {selectedDelivery.route.origin.address}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Destination:</span>
                      <p className="font-medium">
                        {selectedDelivery.route.destination.address}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <p className="font-medium">
                        {selectedDelivery.route.distance_km} km
                      </p>
                    </div>
                  </div>

                  {selectedDelivery.special_instructions && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <h4 className="font-medium text-amber-800 mb-1">
                        Special Instructions:
                      </h4>
                      <p className="text-sm text-amber-700">
                        {selectedDelivery.special_instructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Proof (if delivered) */}
              {selectedDelivery.delivery_proof && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Delivery Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Delivery Photo:</h4>
                        <img
                          src={selectedDelivery.delivery_proof.photo}
                          alt="Delivery proof"
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Recipient Details:</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Received by:</span>
                            <span>
                              {selectedDelivery.delivery_proof.recipient_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivered at:</span>
                            <span>
                              {new Date(
                                selectedDelivery.actual_delivery!,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryTracker;
