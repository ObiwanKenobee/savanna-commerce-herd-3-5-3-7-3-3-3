import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Filter,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Zap,
  Brain,
  Target,
  Users,
  Package,
  X,
  ChevronDown,
  Sparkles,
  Heart,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface SearchFilters {
  category: string[];
  priceRange: [number, number];
  location: string[];
  supplier: string[];
  rating: number;
  availability: "all" | "in_stock" | "low_stock";
  deliveryTime: "all" | "same_day" | "next_day" | "3_days";
  certifications: string[];
  bulkDiscount: boolean;
  cheetahDelivery: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "supplier" | "trending";
  count?: number;
  trending?: boolean;
}

interface RecommendedProduct {
  id: string;
  name: string;
  supplier: string;
  price: number;
  rating: number;
  image: string;
  reason: string;
  confidence: number;
  category: string;
}

interface SearchAnalytics {
  popularSearches: string[];
  trendingProducts: string[];
  seasonalTrends: Array<{
    term: string;
    growth: number;
    season: string;
  }>;
  userBehavior: {
    avgSearchLength: number;
    commonFilters: string[];
    conversionRate: number;
  };
}

const SmartSearchBox = ({
  onSearch,
  onSuggestionSelect,
  suggestions,
}: {
  onSearch: (query: string) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  suggestions: SearchSuggestion[];
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(recent.slice(0, 5));
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);

      // Save to recent searches
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="h-4 w-4" />;
      case "category":
        return <Filter className="h-4 w-4" />;
      case "supplier":
        return <Users className="h-4 w-4" />;
      case "trending":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.text.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, suppliers, categories... (powered by AI)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-12 py-3 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI
          </Badge>
          <Button
            size="sm"
            onClick={() => handleSearch(query)}
            className="bg-green-600 hover:bg-green-700"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="block w-full text-left text-sm p-2 hover:bg-gray-50 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {query && filteredSuggestions.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Smart Suggestions
                </h4>
                <div className="space-y-1">
                  {filteredSuggestions.slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => {
                        onSuggestionSelect(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center justify-between w-full text-left text-sm p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {getSuggestionIcon(suggestion.type)}
                        <span>{suggestion.text}</span>
                        {suggestion.trending && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Trending
                          </Badge>
                        )}
                      </div>
                      {suggestion.count && (
                        <span className="text-xs text-gray-500">
                          {suggestion.count} results
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("trending products")}
                  className="justify-start"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("bulk discounts")}
                  className="justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Deals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("cheetah delivery")}
                  className="justify-start"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Fast Delivery
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("local suppliers")}
                  className="justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Local
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Food & Beverages",
    "Agriculture",
    "Textiles",
    "Electronics",
    "Industrial",
    "Health & Beauty",
    "Home & Garden",
    "Services",
  ];

  const locations = [
    "Nairobi",
    "Kiambu",
    "Mombasa",
    "Nakuru",
    "Uasin Gishu",
    "Machakos",
    "Kisumu",
    "Nyeri",
    "Meru",
    "Kajiado",
  ];

  const certifications = [
    "KEBS Certified",
    "Organic",
    "Fair Trade",
    "ISO 9001",
    "HACCP",
    "Halal",
    "Kenya Organic",
    "Export Quality",
  ];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const activeFiltersCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (key === "priceRange" && (value[0] > 0 || value[1] < 1000000))
        return count + 1;
      if (Array.isArray(value) && value.length > 0) return count + 1;
      if (typeof value === "string" && value !== "all") return count + 1;
      if (typeof value === "number" && value > 0) return count + 1;
      if (typeof value === "boolean" && value) return count + 1;
      return count;
    },
    0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center p-0">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </span>
            <Button variant="outline" onClick={onClearFilters}>
              Clear All
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <Label className="text-base font-medium">Categories</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category.includes(category)}
                    onCheckedChange={() =>
                      toggleArrayFilter("category", category)
                    }
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base font-medium">
              Price Range: KES {filters.priceRange[0].toLocaleString()} -{" "}
              {filters.priceRange[1].toLocaleString()}
            </Label>
            <div className="mt-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={1000000}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>KES 0</span>
                <span>KES 1M+</span>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div>
            <Label className="text-base font-medium">Locations</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.location.includes(location)}
                    onCheckedChange={() =>
                      toggleArrayFilter("location", location)
                    }
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Minimum Rating</Label>
            <div className="mt-2">
              <Select
                value={filters.rating.toString()}
                onValueChange={(value) =>
                  updateFilter("rating", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label className="text-base font-medium">Availability</Label>
            <div className="mt-2">
              <Select
                value={filters.availability}
                onValueChange={(value) => updateFilter("availability", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock (Hurry!)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <Label className="text-base font-medium">Delivery Time</Label>
            <div className="mt-2">
              <Select
                value={filters.deliveryTime}
                onValueChange={(value) => updateFilter("deliveryTime", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Delivery Time</SelectItem>
                  <SelectItem value="same_day">Same Day</SelectItem>
                  <SelectItem value="next_day">Next Day</SelectItem>
                  <SelectItem value="3_days">Within 3 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certifications */}
          <div className="md:col-span-2">
            <Label className="text-base font-medium">Certifications</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cert-${cert}`}
                    checked={filters.certifications.includes(cert)}
                    onCheckedChange={() =>
                      toggleArrayFilter("certifications", cert)
                    }
                  />
                  <Label htmlFor={`cert-${cert}`} className="text-sm">
                    {cert}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Special Features */}
          <div className="md:col-span-2">
            <Label className="text-base font-medium">Special Features</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bulk-discount"
                  checked={filters.bulkDiscount}
                  onCheckedChange={(checked) =>
                    updateFilter("bulkDiscount", checked)
                  }
                />
                <Label htmlFor="bulk-discount" className="text-sm">
                  Bulk Discounts Available
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cheetah-delivery"
                  checked={filters.cheetahDelivery}
                  onCheckedChange={(checked) =>
                    updateFilter("cheetahDelivery", checked)
                  }
                />
                <Label
                  htmlFor="cheetah-delivery"
                  className="text-sm flex items-center"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Cheetah Fast Delivery
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-green-600 hover:bg-green-700"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RecommendationEngine = ({
  recommendations,
  onProductView,
  onProductAdd,
}: {
  recommendations: RecommendedProduct[];
  onProductView: (productId: string) => void;
  onProductAdd: (productId: string) => void;
}) => {
  if (recommendations.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Recommendations for You</span>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600">{product.supplier}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    KES {product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded p-2 mb-3">
                <p className="text-xs text-blue-800 flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  {product.reason}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-blue-600">Confidence:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-16 bg-blue-200 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${product.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-600">
                      {product.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onProductView(product.id)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => onProductAdd(product.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SearchAnalyticsSidebar = ({
  analytics,
}: {
  analytics: SearchAnalytics;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Popular Searches */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular Right Now
          </h4>
          <div className="space-y-2">
            {analytics.popularSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span>{search}</span>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div>
          <h4 className="font-medium mb-3">Seasonal Trends</h4>
          <div className="space-y-3">
            {analytics.seasonalTrends.map((trend, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{trend.term}</span>
                  <Badge
                    className={
                      trend.growth > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {trend.growth > 0 ? "+" : ""}
                    {trend.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{trend.season}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Behavior */}
        <div>
          <h4 className="font-medium mb-3">Your Search Stats</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Search Length:</span>
              <span>{analytics.userBehavior.avgSearchLength} words</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversion Rate:</span>
              <span>{analytics.userBehavior.conversionRate}%</span>
            </div>
            <div>
              <span className="text-gray-600">Common Filters:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analytics.userBehavior.commonFilters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 1000000],
    location: [],
    supplier: [],
    rating: 0,
    availability: "all",
    deliveryTime: "all",
    certifications: [],
    bulkDiscount: false,
    cheetahDelivery: false,
  });

  const [suggestions] = useState<SearchSuggestion[]>([
    {
      id: "1",
      text: "Maize flour bulk order",
      type: "product",
      count: 156,
      trending: true,
    },
    { id: "2", text: "Cooking oil 20L", type: "product", count: 89 },
    { id: "3", text: "Food & Beverages", type: "category", count: 1200 },
    { id: "4", text: "Mwangi Supplies", type: "supplier", count: 45 },
    {
      id: "5",
      text: "Premium organic products",
      type: "trending",
      trending: true,
    },
    {
      id: "6",
      text: "Cheetah delivery today",
      type: "trending",
      trending: true,
    },
  ]);

  const [recommendations] = useState<RecommendedProduct[]>([
    {
      id: "rec1",
      name: "Premium Maize Flour 50kg",
      supplier: "Unga Limited",
      price: 4200,
      rating: 4.8,
      image: "",
      reason: "Based on your recent bulk orders",
      confidence: 92,
      category: "Food & Beverages",
    },
    {
      id: "rec2",
      name: "Cooking Oil 20L Premium",
      supplier: "Bidco Africa",
      price: 6500,
      rating: 4.6,
      image: "",
      reason: "Frequently bought with maize flour",
      confidence: 87,
      category: "Food & Beverages",
    },
    {
      id: "rec3",
      name: "Sugar 50kg Industrial Grade",
      supplier: "Mumias Sugar",
      price: 4800,
      rating: 4.4,
      image: "",
      reason: "Popular in your area",
      confidence: 78,
      category: "Food & Beverages",
    },
  ]);

  const [analytics] = useState<SearchAnalytics>({
    popularSearches: [
      "Maize flour bulk",
      "Cooking oil wholesale",
      "Rice 25kg bags",
      "Sugar industrial",
      "Cheetah delivery",
    ],
    trendingProducts: [
      "Organic products",
      "Bulk discounts",
      "Local suppliers",
      "Fast delivery",
      "Premium quality",
    ],
    seasonalTrends: [
      { term: "School supplies", growth: 45, season: "January-March" },
      { term: "Farming equipment", growth: 32, season: "March-May" },
      { term: "Festival foods", growth: -12, season: "Holiday season" },
    ],
    userBehavior: {
      avgSearchLength: 3.2,
      commonFilters: ["Location: Nairobi", "Bulk discount", "In stock"],
      conversionRate: 24.5,
    },
  });

  const { user } = useAuth();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`🔍 Searching for: ${query}`, filters);

    // Track search analytics
    toast({
      title: "AI Search activated! 🧠",
      description: `Found intelligent results for "${query}"`,
    });
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000000],
      location: [],
      supplier: [],
      rating: 0,
      availability: "all",
      deliveryTime: "all",
      certifications: [],
      bulkDiscount: false,
      cheetahDelivery: false,
    });
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset",
    });
  };

  const handleProductView = (productId: string) => {
    console.log(`👁️ Viewing product: ${productId}`);
    toast({
      title: "Product viewed",
      description: "Opening product details...",
    });
  };

  const handleProductAdd = (productId: string) => {
    console.log(`🛒 Adding product to cart: ${productId}`);
    toast({
      title: "Added to cart! 🛒",
      description: "Product added successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧠 AI-Powered Search</h1>
        <p className="text-gray-600">
          Discover products intelligently with machine learning recommendations
        </p>
      </div>

      {/* Search Interface */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Search Box and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SmartSearchBox
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              suggestions={suggestions}
            />
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* AI Recommendations */}
          <RecommendationEngine
            recommendations={recommendations}
            onProductView={handleProductView}
            onProductAdd={handleProductAdd}
          />

          {/* Search Results */}
          {searchQuery && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search Results for "{searchQuery}"</span>
                  </span>
                  <Badge variant="outline">1,247 products found</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Search results would be displayed here</p>
                  <p className="text-sm">
                    Integrated with EnhancedProductCatalog component
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:w-80">
          <SearchAnalyticsSidebar analytics={analytics} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
