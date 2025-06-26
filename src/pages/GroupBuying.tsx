import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Clock,
  TrendingDown,
  MapPin,
  Share2,
  Heart,
  Plus,
  CheckCircle,
  Timer,
  Package,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

interface GroupBuyingPool {
  id: string;
  title: string;
  product: string;
  targetQuantity: number;
  currentQuantity: number;
  minParticipants: number;
  currentParticipants: number;
  originalPrice: number;
  groupPrice: number;
  savings: number;
  timeLeft: string;
  location: string;
  organizer: string;
  description: string;
  status: "active" | "completed" | "expired";
  participants: string[];
  category: string;
  emoji: string;
  autoOptIn?: boolean;
}

const GroupBuyingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState("Nairobi");

  // Safe map helper to prevent runtime errors
  const safeMap = (
    array: any[],
    mapFn: (item: any, index: number) => any,
    fallback: any[] = [],
  ) => {
    try {
      if (!array || !Array.isArray(array)) {
        console.warn("safeMap: Invalid array provided, using fallback");
        return fallback;
      }
      return array.map(mapFn);
    } catch (error) {
      console.error("safeMap: Error during mapping:", error);
      return fallback;
    }
  };

  const groupPools: GroupBuyingPool[] = [
    {
      id: "1",
      title: "Maize Flour Bulk Buy - Westlands",
      product: "Pembe Maize Flour 2kg",
      targetQuantity: 100,
      currentQuantity: 78,
      minParticipants: 10,
      currentParticipants: 12,
      originalPrice: 140,
      groupPrice: 118,
      savings: 22,
      timeLeft: "2 days 5 hours",
      location: "Westlands, Nairobi",
      organizer: "Mary Wanjiku",
      description:
        "Weekly bulk purchase of quality maize flour for Westlands area shops",
      status: "active",
      participants: [
        "MW",
        "JK",
        "GN",
        "SO",
        "AM",
        "PK",
        "CN",
        "DM",
        "LW",
        "BN",
        "FK",
        "RM",
      ],
      category: "staples",
      emoji: "🌽",
      autoOptIn: true,
    },
    {
      id: "2",
      title: "Premium Cooking Oil - Karen",
      product: "Fresh Fri Cooking Oil 5L",
      targetQuantity: 50,
      currentQuantity: 35,
      minParticipants: 8,
      currentParticipants: 8,
      originalPrice: 1200,
      groupPrice: 950,
      savings: 250,
      timeLeft: "1 day 12 hours",
      location: "Karen Shopping Centre",
      organizer: "James Kiprotich",
      description:
        "High-quality cooking oil at wholesale prices for Karen retailers",
      status: "active",
      participants: ["JK", "MN", "AW", "PL", "DS", "RM", "CK", "BM"],
      category: "cooking",
      emoji: "🛢️",
    },
    {
      id: "3",
      title: "Sugar Wholesale - Eastleigh",
      product: "Kabras Sugar 50kg",
      targetQuantity: 20,
      currentQuantity: 20,
      minParticipants: 5,
      currentParticipants: 6,
      originalPrice: 4500,
      groupPrice: 4100,
      savings: 400,
      timeLeft: "Completed",
      location: "Eastleigh Market",
      organizer: "Ahmed Hassan",
      description: "Monthly sugar bulk purchase for Eastleigh market traders",
      status: "completed",
      participants: ["AH", "FK", "MO", "SA", "HN", "AM"],
      category: "staples",
      emoji: "🍯",
    },
    {
      id: "4",
      title: "Tea Leaves Premium - Kericho",
      product: "Kericho Gold Tea 1kg",
      targetQuantity: 30,
      currentQuantity: 18,
      minParticipants: 6,
      currentParticipants: 9,
      originalPrice: 850,
      groupPrice: 720,
      savings: 130,
      timeLeft: "3 days 8 hours",
      location: "Kericho Town",
      organizer: "Grace Chebet",
      description: "Direct from source - premium tea leaves for retailers",
      status: "active",
      participants: ["GC", "DK", "MR", "PK", "SL", "BT", "NK", "WM", "AK"],
      category: "beverages",
      emoji: "🍃",
    },
    {
      id: "5",
      title: "Rice Bulk Purchase - Mwea",
      product: "Mwea Pishori Rice 25kg",
      targetQuantity: 40,
      currentQuantity: 25,
      minParticipants: 8,
      currentParticipants: 10,
      originalPrice: 3200,
      groupPrice: 2800,
      savings: 400,
      timeLeft: "4 days 2 hours",
      location: "Mwea, Kirinyaga",
      organizer: "Peter Njoroge",
      description: "Premium pishori rice direct from Mwea farmers",
      status: "active",
      participants: [
        "PN",
        "MW",
        "JM",
        "AK",
        "DN",
        "CM",
        "BW",
        "FK",
        "SM",
        "LN",
      ],
      category: "staples",
      emoji: "🍚",
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All Pools",
      emoji: "��",
      count: (groupPools || []).length,
    },
    {
      id: "staples",
      name: "Staples",
      emoji: "🌾",
      count: (groupPools || []).filter((p) => p.category === "staples").length,
    },
    {
      id: "cooking",
      name: "Cooking",
      emoji: "🥘",
      count: (groupPools || []).filter((p) => p.category === "cooking").length,
    },
    {
      id: "beverages",
      name: "Beverages",
      emoji: "☕",
      count: (groupPools || []).filter((p) => p.category === "beverages")
        .length,
    },
    {
      id: "household",
      name: "Household",
      emoji: "🏠",
      count: (groupPools || []).filter((p) => p.category === "household")
        .length,
    },
  ];

  const filteredPools = (groupPools || []).filter((pool) => {
    return selectedCategory === "all" || pool.category === selectedCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (!target || target <= 0) return 0;
    if (!current || current < 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const joinPool = (poolId: string) => {
    console.log(`🤝 Joining pool: ${poolId}`);
    alert(
      "🎉 Successfully joined the group buying pool! You'll be notified when it reaches the target.",
    );
  };

  const sharePool = (pool: GroupBuyingPool) => {
    const message = `🛒 Join our group buying pool!\n\n${pool.title}\n💰 Save KES ${pool.savings} per unit\n📍 ${pool.location}\n⏰ ${pool.timeLeft} left\n\nJoin via Savanna Marketplace: https://savanna-marketplace.com/group/${pool.id}`;

    if (navigator.share) {
      navigator.share({
        title: pool.title,
        text: message,
        url: `https://savanna-marketplace.com/group/${pool.id}`,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert("📋 Pool details copied to clipboard! Share with your network.");
    }
  };

  const activePoolsCount = groupPools.filter(
    (p) => p.status === "active",
  ).length;
  const totalSavings = groupPools.reduce(
    (sum, pool) => sum + pool.savings * pool.currentQuantity,
    0,
  );
  const totalParticipants = new Set(groupPools.flatMap((p) => p.participants))
    .size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🤝 Group Buying Pools
                </h1>
                <p className="text-gray-600">
                  Join forces for better prices • Stronger together
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Pools
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {activePoolsCount}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Participants
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {totalParticipants}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Community Savings
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        KES {totalSavings.toLocaleString()}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Your Location
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {userLocation}
                      </p>
                    </div>
                    <MapPin className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Auto Opt-in */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Pool Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {safeMap(categories, (category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id ? "default" : "ghost"
                        }
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.emoji}</span>
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Auto Opt-in Settings */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    🤖 Auto Opt-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-green-700">
                      Automatically join pools for common staples when they
                      start in your area.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maize Flour</span>
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sugar</span>
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cooking Oil</span>
                        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                          <Plus className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Create Pool */}
              <Card>
                <CardHeader>
                  <CardTitle>Start a Pool</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Organize a group buying pool for your community and save
                      together.
                    </p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Pool
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>🦏 Community Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">💡</span>
                      <div>
                        <div className="font-medium">Invite Neighbors</div>
                        <div className="text-gray-600">
                          Share pools via WhatsApp groups
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">⏰</span>
                      <div>
                        <div className="font-medium">Check Timings</div>
                        <div className="text-gray-600">
                          Join early for better chances
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">📍</span>
                      <div>
                        <div className="font-medium">Location Matters</div>
                        <div className="text-gray-600">
                          Closer pools = lower transport costs
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Pool Grid */}
            <div className="lg:col-span-3">
              {/* Featured Pool */}
              <Card className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="bg-white text-orange-600 mb-2">
                        🔥 Most Popular
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">
                        Weekly Westlands Essentials Bundle
                      </h3>
                      <p className="text-orange-100 mb-4">
                        Join 50+ shops for 25% savings on weekly essentials
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>52 participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingDown className="h-4 w-4" />
                          <span>KES 2,500 saved per shop</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Timer className="h-4 w-4" />
                          <span>6 hours left</span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-white text-orange-600 hover:bg-orange-50">
                      Join Bundle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pool Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeMap(
                  (filteredPools || []).filter((pool) => pool && pool.id),
                  (pool) => (
                    <Card
                      key={pool.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{pool.emoji || "🛒"}</div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">
                                {pool.title || "Unknown Pool"}
                              </CardTitle>
                              <p className="text-sm text-gray-600">
                                Organized by {pool.organizer || "Unknown"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={getStatusColor(pool.status || "active")}
                          >
                            {pool.status || "active"}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {/* Product & Pricing */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium mb-2">
                              {pool.product}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-600">
                                  Regular Price
                                </div>
                                <div className="text-lg font-bold text-gray-400 line-through">
                                  KES {pool.originalPrice || 0}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Group Price
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                  KES {pool.groupPrice || 0}
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-800 text-center py-1 rounded mt-2 text-sm font-medium">
                              💰 Save KES {pool.savings || 0} per unit (
                              {pool.originalPrice && pool.originalPrice > 0
                                ? Math.round(
                                    ((pool.savings || 0) / pool.originalPrice) *
                                      100,
                                  )
                                : 0}
                              % off)
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Quantity Progress</span>
                              <span>
                                {pool.currentQuantity || 0}/
                                {pool.targetQuantity || 0} units
                              </span>
                            </div>
                            <Progress
                              value={getProgressPercentage(
                                pool.currentQuantity || 0,
                                pool.targetQuantity || 1,
                              )}
                              className="h-3"
                            />

                            <div className="flex justify-between text-sm mt-2">
                              <span>Participants</span>
                              <span>
                                {pool.currentParticipants}/
                                {pool.minParticipants} minimum
                              </span>
                            </div>
                            <Progress
                              value={
                                (pool.currentParticipants /
                                  pool.minParticipants) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          {/* Time & Location */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{pool.timeLeft}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{pool.location}</span>
                            </div>
                          </div>

                          {/* Participants Avatars */}
                          <div>
                            <div className="text-sm font-medium mb-2">
                              Participants
                            </div>
                            <div className="flex items-center space-x-1">
                              {safeMap(
                                (pool.participants || []).slice(0, 6),
                                (participant, index) => (
                                  <Avatar key={index} className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                      {participant}
                                    </AvatarFallback>
                                  </Avatar>
                                ),
                              )}
                              {(pool.participants || []).length > 6 && (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                  +{(pool.participants || []).length - 6}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Auto Opt-in Indicator */}
                          {pool.autoOptIn && (
                            <div className="bg-blue-50 p-2 rounded text-sm text-blue-800">
                              🤖 Auto-enrolled (staple item)
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            {pool.status === "active" ? (
                              <>
                                <Button
                                  onClick={() => joinPool(pool.id)}
                                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Join Pool
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => sharePool(pool)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : pool.status === "completed" ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                disabled
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Completed
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="flex-1"
                                disabled
                              >
                                <Timer className="h-4 w-4 mr-2" />
                                Expired
                              </Button>
                            )}
                          </div>

                          {/* Quick Actions for Organizers */}
                          {pool.organizer === "Mary Wanjiku" && (
                            <div className="bg-purple-50 p-2 rounded text-sm">
                              <div className="font-medium text-purple-800 mb-1">
                                Your Pool
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Notify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>

              {/* WhatsApp Community Groups */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-xl">💬</span>
                    <span>WhatsApp Community Groups</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {safeMap(
                      [
                        {
                          name: "Westlands Bulk Buyers",
                          members: 234,
                          category: "Location",
                        },
                        {
                          name: "Nairobi Retailers Network",
                          members: 456,
                          category: "Business",
                        },
                        {
                          name: "Kenya Grocery Pool",
                          members: 1200,
                          category: "National",
                        },
                      ],
                      (group, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800">
                              {group.name}
                            </span>
                            <Badge variant="secondary">{group.members}</Badge>
                          </div>
                          <div className="text-sm text-green-700 mb-3">
                            {group.category} • Active community
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Join Group
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default GroupBuyingPage;
