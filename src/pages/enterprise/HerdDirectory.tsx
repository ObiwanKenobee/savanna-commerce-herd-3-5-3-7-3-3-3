import React, { useState, useEffect } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import crudService, { BusinessProfile } from "@/services/completeCrudService";
import {
  Users,
  Star,
  MapPin,
  Building,
  Phone,
  Mail,
  Globe,
  Calendar,
  Package,
  TrendingUp,
  Award,
  Shield,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  MessageSquare,
  UserPlus,
  Heart,
  Share2,
  ExternalLink,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Loader2,
} from "lucide-react";

interface BusinessProfile {
  id: string;
  business_name: string;
  owner_name: string;
  business_type: "retailer" | "supplier" | "logistics" | "service_provider";
  description: string;
  location: string;
  contact_info: {
    email: string;
    phone: string;
    website?: string;
    address?: string;
  };
  specialties: string[];
  categories: string[];
  stats: {
    years_in_business: number;
    total_transactions: number;
    rating: number;
    review_count: number;
    monthly_revenue?: number;
  };
  verification: {
    business_license: boolean;
    tax_compliance: boolean;
    quality_certification: boolean;
    financial_verification: boolean;
  };
  membership_tier: "bronze" | "silver" | "gold" | "platinum";
  joined_date: string;
  last_active: string;
  status: "active" | "inactive" | "suspended";
  featured: boolean;
  premium: boolean;
}

const HerdDirectory = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] =
    useState<BusinessProfile | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const businessTypes = [
    "all",
    "retailer",
    "supplier",
    "logistics",
    "service_provider",
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

  const membershipTiers = ["all", "bronze", "silver", "gold", "platinum"];

  // Load real business profiles
  useEffect(() => {
    loadBusinessProfiles();
  }, [selectedType, selectedLocation, selectedTier, searchQuery, sortBy]);

  const loadBusinessProfiles = async () => {
    try {
      setLoading(true);
      const businessProfiles = await crudService.getBusinessProfiles({
        business_type: selectedType,
        location: selectedLocation,
        search: searchQuery,
        membership_tier: selectedTier,
        featured: false,
      });
      setProfiles(businessProfiles);
    } catch (error) {
      console.error("Error loading business profiles:", error);
      toast({
        title: "Error Loading Profiles",
        description: "Failed to load business profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort profiles
  const filteredProfiles = profiles
    .filter((profile) => {
      const matchesSearch =
        searchQuery === "" ||
        profile.business_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.specialties.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesType =
        selectedType === "all" || profile.business_type === selectedType;
      const matchesLocation =
        selectedLocation === "all" || profile.location === selectedLocation;
      const matchesTier =
        selectedTier === "all" || profile.membership_tier === selectedTier;

      return matchesSearch && matchesType && matchesLocation && matchesTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.stats.rating - a.stats.rating;
        case "transactions":
          return b.stats.total_transactions - a.stats.total_transactions;
        case "name":
          return a.business_name.localeCompare(b.business_name);
        case "joined":
          return (
            new Date(b.joined_date).getTime() -
            new Date(a.joined_date).getTime()
          );
        default:
          return 0;
      }
    });

  const toggleFavorite = (profileId: string) => {
    setFavorites((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId],
    );

    toast({
      title: favorites.includes(profileId)
        ? "Removed from network"
        : "Added to network",
      description: "Your professional network has been updated",
    });
  };

  const handleConnect = (profile: BusinessProfile) => {
    toast({
      title: `Connection request sent to ${profile.business_name}`,
      description: "You'll be notified when they respond",
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "bronze":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVerificationScore = (
    verification: BusinessProfile["verification"],
  ) => {
    const scores = Object.values(verification).filter(Boolean).length;
    return Math.round((scores / 4) * 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatRevenue = (amount: number | undefined) => {
    if (!amount) return "N/A";
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    return `KES ${(amount / 1000).toFixed(0)}K`;
  };

  const renderProfileCard = (profile: BusinessProfile) => (
    <Card
      key={profile.id}
      className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-300"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                {profile.business_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                {profile.business_name}
              </CardTitle>
              <div className="text-sm text-gray-600">{profile.owner_name}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className={getTierColor(profile.membership_tier)}
                  variant="outline"
                >
                  {profile.membership_tier}
                </Badge>
                {profile.featured && (
                  <Badge
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    variant="outline"
                  >
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(profile.id)}
          >
            <Heart
              className={`h-4 w-4 ${favorites.includes(profile.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{profile.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Building className="h-4 w-4" />
            <span className="capitalize">{profile.business_type}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {profile.description}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {profile.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {profile.specialties.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{profile.specialties.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">
                {profile.stats.rating}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {profile.stats.review_count} reviews
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-semibold text-green-600">
              {formatNumber(profile.stats.total_transactions)}
            </div>
            <div className="text-xs text-gray-600">Transactions</div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <div className="text-sm">
              <span className="font-medium">
                {getVerificationScore(profile.verification)}%
              </span>
              <span className="text-gray-600"> verified</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {profile.stats.years_in_business} years
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={() => handleConnect(profile)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedProfile(profile);
              setIsProfileDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfileList = (profile: BusinessProfile) => (
    <Card key={profile.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarFallback className="bg-green-100 text-green-600 font-semibold text-lg">
              {profile.business_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {profile.business_name}
              </h3>
              <Badge
                className={getTierColor(profile.membership_tier)}
                variant="outline"
              >
                {profile.membership_tier}
              </Badge>
              {profile.featured && (
                <Badge
                  className="bg-yellow-100 text-yellow-800"
                  variant="outline"
                >
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>{profile.owner_name}</span>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="capitalize">{profile.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>
                  {profile.stats.rating} ({profile.stats.review_count})
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {profile.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {profile.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleConnect(profile)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(profile.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(profile.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
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

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-4xl">🦌</div>
              <h1 className="text-4xl font-bold text-green-800">
                Herd Directory
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with verified businesses across Kenya. Build your
              professional network and discover new opportunities in the Savanna
              marketplace ecosystem.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {profiles.length}
                </div>
                <div className="text-sm text-gray-600">Active Businesses</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    profiles.filter((p) => p.verification.business_license)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {profiles.filter((p) => p.premium).length}
                </div>
                <div className="text-sm text-gray-600">Premium</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">8.5M+</div>
                <div className="text-sm text-gray-600">Connections</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search businesses, owners, or specialties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Business Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "all"
                            ? "All Types"
                            : type
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="w-32">
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

                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipTiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier === "all"
                            ? "All Tiers"
                            : tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="joined">Recently Joined</SelectItem>
                    </SelectContent>
                  </Select>

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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found {filteredProfiles.length} businesses
            </div>
          </div>

          {/* Business Profiles */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">
                  No Businesses Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or explore different
                  categories.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProfiles.map((profile) =>
                viewMode === "grid"
                  ? renderProfileCard(profile)
                  : renderProfileList(profile),
              )}
            </div>
          )}
        </div>
      </main>

      {/* Profile Detail Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProfile && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold text-xl">
                      {selectedProfile.business_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedProfile.business_name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedProfile.owner_name} •{" "}
                      {selectedProfile.business_type.replace("_", " ")}
                    </DialogDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={getTierColor(
                          selectedProfile.membership_tier,
                        )}
                      >
                        {selectedProfile.membership_tier}
                      </Badge>
                      {selectedProfile.premium && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-gray-600">{selectedProfile.description}</p>
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedProfile.contact_info.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedProfile.contact_info.phone}
                        </span>
                      </div>
                      {selectedProfile.contact_info.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a
                            href={selectedProfile.contact_info.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm capitalize">
                          {selectedProfile.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Business Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {selectedProfile.stats.rating} (
                            {selectedProfile.stats.review_count} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Transactions:
                        </span>
                        <span className="text-sm font-medium">
                          {formatNumber(
                            selectedProfile.stats.total_transactions,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Years in Business:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProfile.stats.years_in_business}
                        </span>
                      </div>
                      {selectedProfile.stats.monthly_revenue && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Monthly Revenue:
                          </span>
                          <span className="text-sm font-medium">
                            {formatRevenue(
                              selectedProfile.stats.monthly_revenue,
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <h4 className="font-semibold mb-3">Verification Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedProfile.verification).map(
                      ([key, verified]) => (
                        <div key={key} className="flex items-center space-x-2">
                          {verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {key
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex space-x-2">
                <Button
                  onClick={() => handleConnect(selectedProfile)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(selectedProfile.id)}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${favorites.includes(selectedProfile.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                  {favorites.includes(selectedProfile.id)
                    ? "Favorited"
                    : "Add to Network"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <EnterpriseFooter />
    </div>
  );
};

export default HerdDirectory;
