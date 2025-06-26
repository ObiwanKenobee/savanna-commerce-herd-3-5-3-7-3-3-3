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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Package,
  TrendingDown,
  Clock,
  MapPin,
  Star,
  Plus,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle,
  Timer,
  Truck,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface GroupBuyingPool {
  id: string;
  title: string;
  description: string;
  product: {
    name: string;
    image: string;
    unit_price: number;
    bulk_price: number;
    unit_of_measure: string;
  };
  target_quantity: number;
  current_quantity: number;
  minimum_participants: number;
  current_participants: number;
  max_participants: number;
  price_per_unit: number;
  savings_per_unit: number;
  total_savings: number;
  organizer: {
    name: string;
    avatar: string;
    rating: number;
    type: "retailer" | "supplier";
  };
  delivery: {
    location: string;
    date: string;
    cost_per_unit: number;
  };
  status: "active" | "filling" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  expires_at: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    quantity: number;
    joined_at: string;
  }>;
  requirements?: string[];
  terms?: string;
  category: string;
}

const PoolCard = ({
  pool,
  onJoinPool,
}: {
  pool: GroupBuyingPool;
  onJoinPool: (poolId: string, quantity: number) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [joinQuantity, setJoinQuantity] = useState(1);
  const { user } = useAuth();

  const progressPercentage =
    (pool.current_quantity / pool.target_quantity) * 100;
  const participantsPercentage =
    (pool.current_participants / pool.max_participants) * 100;
  const timeLeft = new Date(pool.expires_at).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const isUserParticipant = pool.participants.some((p) => p.id === user?.id);
  const userParticipation = pool.participants.find((p) => p.id === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "filling":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeLeft = () => {
    if (daysLeft > 0) return `${daysLeft} days left`;
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
    if (hoursLeft > 0) return `${hoursLeft} hours left`;
    return "Ending soon";
  };

  const handleJoin = () => {
    if (joinQuantity > 0) {
      onJoinPool(pool.id, joinQuantity);
      setShowDetails(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md relative overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className={getStatusColor(pool.status)}>
            {pool.status === "active" && <Timer className="h-3 w-3 mr-1" />}
            {pool.status === "confirmed" && (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {pool.status}
          </Badge>
        </div>

        {/* Product Image */}
        <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
          <Package className="h-12 w-12 text-green-600" />

          {/* Savings Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 text-white">
              <TrendingDown className="h-3 w-3 mr-1" />
              Save{" "}
              {(
                (pool.savings_per_unit / pool.product.unit_price) *
                100
              ).toFixed(0)}
              %
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {pool.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {pool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={pool.organizer.avatar} />
              <AvatarFallback>{pool.organizer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{pool.organizer.name}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">
                  {pool.organizer.rating}
                </span>
                <Badge variant="outline" className="text-xs">
                  {pool.organizer.type === "supplier" ? "🐘" : "🦌"}{" "}
                  {pool.organizer.type}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pricing */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Pool Price:</span>
              <div className="text-right">
                <span className="font-bold text-lg text-green-600">
                  KES {pool.price_per_unit.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  /{pool.product.unit_of_measure}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Regular Price:</span>
              <span className="text-sm text-gray-500 line-through">
                KES {pool.product.unit_price.toLocaleString()}
              </span>
            </div>
            <div className="text-center mt-2">
              <Badge className="bg-green-600 text-white">
                Save KES {pool.savings_per_unit.toLocaleString()} per{" "}
                {pool.product.unit_of_measure}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Quantity Progress</span>
                <span>
                  {pool.current_quantity}/{pool.target_quantity}{" "}
                  {pool.product.unit_of_measure}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {pool.target_quantity - pool.current_quantity} more needed
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Participants</span>
                <span>
                  {pool.current_participants}/{pool.max_participants}
                </span>
              </div>
              <Progress value={participantsPercentage} className="h-2" />
              <div className="flex -space-x-1 mt-2">
                {pool.participants.slice(0, 5).map((participant) => (
                  <Avatar
                    key={participant.id}
                    className="h-6 w-6 border-2 border-white"
                  >
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-xs">
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {pool.participants.length > 5 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                    +{pool.participants.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 rounded-lg p-3 text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">
                Delivery to {pool.delivery.location}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>
                Expected: {new Date(pool.delivery.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Time Left */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-amber-600">
              <Timer className="h-4 w-4" />
              <span>{formatTimeLeft()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {pool.current_participants} joined
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isUserParticipant ? (
              <>
                <Button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={
                    pool.status !== "active" && pool.status !== "filling"
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  Join Pool
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-green-800">
                  ✅ You're in! ({userParticipation?.quantity}{" "}
                  {pool.product.unit_of_measure})
                </div>
                <div className="text-xs text-green-600">
                  Joined{" "}
                  {new Date(
                    userParticipation?.joined_at || "",
                  ).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Join Pool Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Join Group Buying Pool</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Pool Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{pool.title}</h3>
              <p className="text-gray-600 mb-3">{pool.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Pool Price:</span>
                  <div className="font-bold text-green-600">
                    KES {pool.price_per_unit.toLocaleString()}/
                    {pool.product.unit_of_measure}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">You Save:</span>
                  <div className="font-bold text-red-500">
                    KES {pool.savings_per_unit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Delivery:</span>
                  <div>{pool.delivery.location}</div>
                </div>
                <div>
                  <span className="text-gray-500">Expected Date:</span>
                  <div>{new Date(pool.delivery.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-4">
              <Label htmlFor="quantity">How much do you want to buy?</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setJoinQuantity(Math.max(1, joinQuantity - 1))
                    }
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={joinQuantity}
                    onChange={(e) =>
                      setJoinQuantity(parseInt(e.target.value) || 1)
                    }
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJoinQuantity(joinQuantity + 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-500">
                    {pool.product.unit_of_measure}
                  </span>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Cost Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      Product Cost ({joinQuantity} × KES{" "}
                      {pool.price_per_unit.toLocaleString()}):
                    </span>
                    <span>
                      KES{" "}
                      {(joinQuantity * pool.price_per_unit).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Share:</span>
                    <span>
                      KES{" "}
                      {(
                        joinQuantity * pool.delivery.cost_per_unit
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Cost:</span>
                    <span>
                      KES{" "}
                      {(
                        joinQuantity *
                        (pool.price_per_unit + pool.delivery.cost_per_unit)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You Save:</span>
                    <span>
                      KES{" "}
                      {(joinQuantity * pool.savings_per_unit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            {pool.terms && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </h4>
                <p className="text-sm text-amber-700">{pool.terms}</p>
              </div>
            )}

            {/* Requirements */}
            {pool.requirements && pool.requirements.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {pool.requirements.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleJoin}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={joinQuantity <= 0}
              >
                <Users className="h-4 w-4 mr-2" />
                Join Pool - KES{" "}
                {(
                  joinQuantity *
                  (pool.price_per_unit + pool.delivery.cost_per_unit)
                ).toLocaleString()}
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const GroupBuyingPools = () => {
  const [pools, setPools] = useState<GroupBuyingPool[]>([]);
  const [filteredPools, setFilteredPools] = useState<GroupBuyingPool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreatePool, setShowCreatePool] = useState(false);
  const { user } = useAuth();

  // Mock data - In production, this would come from Supabase
  useEffect(() => {
    const mockPools: GroupBuyingPool[] = [
      {
        id: "1",
        title: "Premium Maize Flour Bulk Purchase",
        description:
          "High-quality maize flour from verified organic farms. Perfect for retailers and restaurants.",
        product: {
          name: "Premium Maize Flour",
          image: "",
          unit_price: 4800,
          bulk_price: 3600,
          unit_of_measure: "50kg bag",
        },
        target_quantity: 100,
        current_quantity: 67,
        minimum_participants: 5,
        current_participants: 12,
        max_participants: 25,
        price_per_unit: 3600,
        savings_per_unit: 1200,
        total_savings: 1200 * 67,
        organizer: {
          name: "Mwangi Supplies",
          avatar: "",
          rating: 4.8,
          type: "supplier",
        },
        delivery: {
          location: "Nairobi CBD",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          cost_per_unit: 100,
        },
        status: "active",
        created_at: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        expires_at: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        participants: [
          {
            id: "u1",
            name: "Jane Retailer",
            avatar: "",
            quantity: 5,
            joined_at: "",
          },
          {
            id: "u2",
            name: "Quick Shop",
            avatar: "",
            quantity: 10,
            joined_at: "",
          },
          {
            id: "u3",
            name: "Food Hub",
            avatar: "",
            quantity: 8,
            joined_at: "",
          },
        ],
        requirements: ["Valid business license", "Minimum order: 2 bags"],
        terms:
          "Payment due within 24 hours of pool completion. Delivery coordinated by organizer.",
        category: "Food & Beverages",
      },
      {
        id: "2",
        title: "Cooking Oil Community Buy",
        description:
          "Fresh cooking oil in 20L containers. Great savings for small restaurants and retailers.",
        product: {
          name: "Cooking Oil",
          image: "",
          unit_price: 8000,
          bulk_price: 6200,
          unit_of_measure: "20L container",
        },
        target_quantity: 50,
        current_quantity: 31,
        minimum_participants: 8,
        current_participants: 15,
        max_participants: 20,
        price_per_unit: 6200,
        savings_per_unit: 1800,
        total_savings: 1800 * 31,
        organizer: {
          name: "Coast Traders",
          avatar: "",
          rating: 4.6,
          type: "retailer",
        },
        delivery: {
          location: "Mombasa Port",
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          cost_per_unit: 150,
        },
        status: "filling",
        created_at: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        expires_at: new Date(
          Date.now() + 8 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        participants: [
          {
            id: "u4",
            name: "Mama Njeri's",
            avatar: "",
            quantity: 2,
            joined_at: "",
          },
          {
            id: "u5",
            name: "Hotel Paradise",
            avatar: "",
            quantity: 5,
            joined_at: "",
          },
        ],
        category: "Food & Beverages",
      },
    ];

    setPools(mockPools);
    setFilteredPools(mockPools);
  }, []);

  // Filter pools based on search and filters
  useEffect(() => {
    let filtered = pools;

    if (searchTerm) {
      filtered = filtered.filter(
        (pool) =>
          pool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((pool) => pool.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((pool) => pool.status === selectedStatus);
    }

    setFilteredPools(filtered);
  }, [pools, searchTerm, selectedCategory, selectedStatus]);

  const handleJoinPool = async (poolId: string, quantity: number) => {
    try {
      // In production, this would call Supabase
      console.log(`Joining pool ${poolId} with quantity ${quantity}`);

      toast({
        title: "Successfully joined pool! 🎉",
        description: `You've reserved ${quantity} units. You'll be notified when the pool is complete.`,
      });

      // Update local state
      setPools((prev) =>
        prev.map((pool) => {
          if (pool.id === poolId) {
            return {
              ...pool,
              current_quantity: pool.current_quantity + quantity,
              current_participants: pool.current_participants + 1,
              participants: [
                ...pool.participants,
                {
                  id: user?.id || "current_user",
                  name: user?.user_metadata?.first_name || "You",
                  avatar: "",
                  quantity,
                  joined_at: new Date().toISOString(),
                },
              ],
            };
          }
          return pool;
        }),
      );
    } catch (error) {
      toast({
        title: "Failed to join pool",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const categories = [
    "All",
    "Food & Beverages",
    "Agriculture",
    "Industrial",
    "Textiles",
  ];
  const statuses = ["All", "Active", "Filling", "Confirmed", "Completed"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Users className="h-8 w-8 text-green-600" />
            <span>Group Buying Pools</span>
          </h1>
          <p className="text-gray-600">
            Join others to buy in bulk and save money together
          </p>
        </div>
        <Button
          onClick={() => setShowCreatePool(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Pool
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search pools by product, organizer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category.toLowerCase() === "all" ? "all" : category}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem
                  key={status}
                  value={
                    status.toLowerCase() === "all"
                      ? "all"
                      : status.toLowerCase()
                  }
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {pools.filter((p) => p.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Active Pools</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {pools.reduce(
                (total, pool) => total + pool.current_participants,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              KES{" "}
              {pools
                .reduce((total, pool) => total + pool.total_savings, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Savings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {categories.length - 1}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} onJoinPool={handleJoinPool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No pools found</h3>
          <p className="text-gray-600 mb-6">
            No group buying pools match your current filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedStatus("all");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupBuyingPools;
