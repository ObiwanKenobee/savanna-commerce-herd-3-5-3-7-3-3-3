import React, { useState, useEffect } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import crudService, { TradingHub } from "@/services/completeCrudService";
import {
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Zap,
  Globe,
  Calendar,
  Package,
  DollarSign,
  Activity,
  CheckCircle,
  Plus,
  BarChart3,
  RefreshCw,
  Edit,
  Loader2,
  Phone,
  Mail,
  ExternalLink,
  ShoppingCart,
  Building,
  Award,
  Truck,
  Shield,
} from "lucide-react";

// Use TradingHub interface from CRUD service

const WateringHoles = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tradingHubs, setTradingHubs] = useState<TradingHub[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const categories = [
    "all",
    "agriculture",
    "electronics",
    "fashion",
    "construction",
    "healthcare",
    "automotive",
    "technology",
    "services",
  ];

  const locations = [
    "all",
    "nairobi",
    "mombasa",
    "kisumu",
    "nakuru",
    "eldoret",
    "thika",
    "machakos",
    "nyeri",
  ];

  // Load real trading hubs data
  useEffect(() => {
    loadTradingHubs();
  }, [selectedCategory, selectedLocation, searchQuery]);

  const loadTradingHubs = async () => {
    try {
      setLoading(true);
      const hubs = await crudService.getTradingHubs({
        category: selectedCategory,
        location: selectedLocation,
        search: searchQuery,
        page: 1,
        limit: 50,
      });
      setTradingHubs(hubs);
    } catch (error) {
      console.error("Error loading trading hubs:", error);
      toast({
        title: "Error Loading Hubs",
        description: "Failed to load trading hubs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter hubs based on search and selections
  const filteredHubs = tradingHubs.filter((hub) => {
    const matchesSearch =
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || hub.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || hub.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const toggleFavorite = (hubId: string) => {
    setFavorites((prev) =>
      prev.includes(hubId)
        ? prev.filter((id) => id !== hubId)
        : [...prev, hubId],
    );

    toast({
      title: favorites.includes(hubId)
        ? "Removed from favorites"
        : "Added to favorites",
      description: "Your preferences have been updated",
    });
  };

  const handleJoinHub = async (hub: TradingHub) => {
    try {
      // Call API to join hub
      await fetch("/api/hub-memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hub_id: hub.id,
          organization_id: user?.id,
          member_type: "supplier",
        }),
      });

      toast({
        title: `Joining ${hub.name}`,
        description: "Your membership request has been submitted for review",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit membership request",
        variant: "destructive",
      });
    }
  };

  const handleCreateHub = async (formData: any) => {
    try {
      const newHub = await crudService.createTradingHub({
        name: formData.name,
        slug: "",
        description: formData.description,
        location: formData.location,
        category: formData.category,
        specialties: [],
        stats: {
          active_suppliers: 0,
          monthly_volume: 0,
          rating: 0,
          total_trades: 0,
        },
        status: "pending",
        featured: false,
        verified: false,
        owner_id: user?.id || "",
        created_at: "",
        updated_at: "",
      });

      setTradingHubs((prev) => [newHub, ...prev]);
      setIsCreateDialogOpen(false);

      toast({
        title: "Hub Created!",
        description: "Your trading hub has been submitted for review",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trading hub",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    return `KES ${(amount / 1000).toFixed(0)}K`;
  };

  const renderHubCard = (hub: TradingHub) => (
    <Card
      key={hub.id}
      className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-300 h-full flex flex-col"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-2xl">💧</div>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base md:text-lg group-hover:text-green-600 transition-colors line-clamp-2">
                {hub.name}
              </CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(hub.id)}
            className="flex-shrink-0"
          >
            <Heart
              className={`h-4 w-4 ${favorites.includes(hub.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {hub.verified && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs"
            >
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {hub.featured && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {hub.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {hub.description}
        </p>

        {/* Stats grid - responsive */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="font-medium">{hub.stats.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 text-blue-500" />
            <span>{formatNumber(hub.stats.active_suppliers)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span>{formatVolume(hub.stats.monthly_volume)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="h-3 w-3 text-purple-500" />
            <span>{formatNumber(hub.stats.total_trades)}</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {hub.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {hub.specialties.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{hub.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Location and contact */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{hub.location}</span>
          </div>
          {!isMobile && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>{hub.contact_info.phone}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 mt-auto">
          <Button
            onClick={() => handleJoinHub(hub)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
            size="sm"
          >
            <Users className="h-3 w-3 mr-1" />
            Join
          </Button>
          <Button variant="outline" size="sm" className="px-2">
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="px-2">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderHubList = (hub: TradingHub) => (
    <Card key={hub.id} className="hover:shadow-md transition-shadow mb-3">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-xl md:text-2xl">💧</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm md:text-lg truncate">
                  {hub.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {hub.verified && (
                    <Shield className="h-3 w-3 text-green-500" />
                  )}
                  {hub.featured && <Star className="h-3 w-3 text-yellow-500" />}
                  <Badge variant="outline" className="text-xs capitalize">
                    {hub.category}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(hub.id)}
                className="flex-shrink-0"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.includes(hub.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:flex md:items-center md:space-x-4 gap-2 md:gap-0 text-xs text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="capitalize">{hub.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{hub.stats.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>
                  {formatNumber(hub.stats.active_suppliers)} suppliers
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{formatVolume(hub.stats.monthly_volume)}</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">
              {hub.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {hub.specialties
                  .slice(0, isMobile ? 2 : 3)
                  .map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                {hub.specialties.length > (isMobile ? 2 : 3) && (
                  <Badge variant="secondary" className="text-xs">
                    +{hub.specialties.length - (isMobile ? 2 : 3)}
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleJoinHub(hub)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs"
                >
                  Join Hub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <EnterpriseNavigation />

      <main className="pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Mobile optimized */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
              <div className="text-3xl md:text-4xl">💧</div>
              <h1 className="text-2xl md:text-4xl font-bold text-green-800">
                Watering Holes
              </h1>
            </div>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover and connect with thriving B2B marketplaces across Kenya.
              Join trading hubs where suppliers and retailers come together to
              grow their businesses.
            </p>
          </div>

          {/* Stats Overview - Mobile responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="text-center">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-green-600">
                  {tradingHubs.length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Active Hubs
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-blue-600">
                  {formatNumber(
                    tradingHubs.reduce(
                      (sum, hub) => sum + hub.stats.active_suppliers,
                      0,
                    ),
                  )}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Suppliers
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-purple-600">
                  {formatVolume(
                    tradingHubs.reduce(
                      (sum, hub) => sum + hub.stats.monthly_volume,
                      0,
                    ),
                  )}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Volume</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-2xl font-bold text-orange-600">
                  {formatNumber(
                    tradingHubs.reduce(
                      (sum, hub) => sum + hub.stats.total_trades,
                      0,
                    ),
                  )}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Trades</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters - Mobile-first design */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search trading hubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all"
                            ? "All Categories"
                            : category.charAt(0).toUpperCase() +
                              category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all"
                            ? "All Locations"
                            : location.charAt(0).toUpperCase() +
                              location.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View toggle and create button */}
                  <div className="flex space-x-2 sm:ml-auto">
                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {isMobile ? "Create" : "Create Hub"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredHubs.length} of {tradingHubs.length} trading hubs
            </p>
          </div>

          {/* Trading Hubs Display - Responsive grid/list */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredHubs.map(renderHubCard)}
            </div>
          ) : (
            <div className="space-y-3">{filteredHubs.map(renderHubList)}</div>
          )}

          {filteredHubs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No trading hubs found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or creating a new hub.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Trading Hub
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Hub Dialog - Mobile optimized */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Trading Hub</DialogTitle>
            <DialogDescription>
              Start your own B2B marketplace and connect with suppliers and
              retailers.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateHub({
                name: formData.get("hub-name"),
                description: formData.get("hub-description"),
                category: formData.get("hub-category"),
                location: formData.get("hub-location"),
              });
            }}
          >
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="hub-name">Hub Name</Label>
                <Input
                  name="hub-name"
                  id="hub-name"
                  placeholder="Enter hub name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="hub-description">Description</Label>
                <Textarea
                  name="hub-description"
                  id="hub-description"
                  placeholder="Describe your trading hub..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hub-category">Category</Label>
                  <Select name="hub-category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c !== "all")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hub-location">Location</Label>
                  <Select name="hub-location" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((l) => l !== "all")
                        .map((location) => (
                          <SelectItem key={location} value={location}>
                            {location.charAt(0).toUpperCase() +
                              location.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                Create Hub
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EnterpriseFooter />
    </div>
  );
};

export default WateringHoles;
