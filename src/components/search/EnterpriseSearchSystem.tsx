/**
 * 🦁 Enterprise Search System - Production Ready
 * Advanced search and filtering for the entire platform
 */

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Star,
  DollarSign,
  Calendar as CalendarComponent,
  Building,
  Package,
  Users,
  Zap,
  Award,
  TrendingUp,
  RefreshCw,
  Download,
  Eye,
  Grid3X3,
  List,
  BarChart3,
} from "lucide-react";

export interface SearchFilters {
  query: string;
  categories: string[];
  locations: string[];
  priceRange: [number, number];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  ratings: number[];
  verificationStatus: string[];
  businessTypes: string[];
  membershipTiers: string[];
  featured: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface SearchResult {
  id: string;
  type: "hub" | "profile" | "story" | "product" | "organization";
  title: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  price?: number;
  verified: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface Props {
  searchType:
    | "all"
    | "hubs"
    | "profiles"
    | "stories"
    | "products"
    | "organizations";
  onSearch: (filters: SearchFilters) => void;
  onResultSelect: (result: SearchResult) => void;
  results: SearchResult[];
  loading: boolean;
  totalResults: number;
  className?: string;
}

const EnterpriseSearchSystem: React.FC<Props> = ({
  searchType,
  onSearch,
  onResultSelect,
  results,
  loading,
  totalResults,
  className = "",
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    locations: [],
    priceRange: [0, 1000000],
    dateRange: { from: undefined, to: undefined },
    ratings: [],
    verificationStatus: [],
    businessTypes: [],
    membershipTiers: [],
    featured: false,
    sortBy: "relevance",
    sortOrder: "desc",
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SearchFilters[]>([]);

  // Predefined options
  const categories = [
    "Agriculture",
    "Electronics",
    "Fashion",
    "Construction",
    "Healthcare",
    "Automotive",
    "Technology",
    "Services",
    "Manufacturing",
    "Food & Beverage",
  ];

  const locations = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Thika",
    "Machakos",
    "Nyeri",
    "Meru",
    "Kisii",
    "Kericho",
    "Malindi",
  ];

  const businessTypes = [
    "Supplier",
    "Retailer",
    "Logistics",
    "Service Provider",
    "Manufacturer",
  ];

  const membershipTiers = ["Bronze", "Silver", "Gold", "Platinum"];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "date", label: "Date Created" },
    { value: "name", label: "Name" },
    { value: "location", label: "Location" },
    { value: "popularity", label: "Popularity" },
  ];

  // Update search when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, onSearch]);

  // Handle search query change
  const handleQueryChange = useCallback(
    (query: string) => {
      setFilters((prev) => ({ ...prev, query }));

      // Add to recent searches if not empty and not already there
      if (query.trim() && !recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
      }
    },
    [recentSearches],
  );

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: "",
      categories: [],
      locations: [],
      priceRange: [0, 1000000],
      dateRange: { from: undefined, to: undefined },
      ratings: [],
      verificationStatus: [],
      businessTypes: [],
      membershipTiers: [],
      featured: false,
      sortBy: "relevance",
      sortOrder: "desc",
    });
  };

  // Save current filter set
  const saveFilters = () => {
    const filterName = `Search ${new Date().toLocaleDateString()}`;
    setSavedFilters((prev) => [...prev, { ...filters }]);
  };

  // Export results
  const exportResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Type,Title,Category,Location,Rating,Verified,Featured"].join(",") +
      "\n" +
      results
        .map((result) =>
          [
            result.id,
            result.type,
            result.title,
            result.category,
            result.location,
            result.rating,
            result.verified,
            result.featured,
          ].join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `search_results_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "hub":
        return <MapPin className="h-4 w-4" />;
      case "profile":
        return <Users className="h-4 w-4" />;
      case "story":
        return <BarChart3 className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "organization":
        return <Building className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const renderResult = (result: SearchResult, index: number) => {
    if (viewMode === "grid") {
      return (
        <Card
          key={result.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onResultSelect(result)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getResultIcon(result.type)}
                <Badge variant="outline" className="text-xs">
                  {result.type}
                </Badge>
                {result.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    Featured
                  </Badge>
                )}
                {result.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs">{result.rating}</span>
              </div>
            </div>

            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {result.title}
            </h3>
            <p className="text-xs text-gray-600 mb-3 line-clamp-3">
              {result.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{result.location}</span>
              </div>
              {result.price && (
                <span className="font-medium">
                  KES {result.price.toLocaleString()}
                </span>
              )}
            </div>

            {result.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {result.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{result.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card
          key={result.id}
          className="cursor-pointer hover:shadow-md transition-shadow mb-3"
          onClick={() => onResultSelect(result)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {getResultIcon(result.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm">{result.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                    {result.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Featured
                      </Badge>
                    )}
                    {result.verified && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{result.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {result.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{result.location}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.category}
                    </Badge>
                  </div>
                  {result.price && (
                    <span className="font-medium">
                      KES {result.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${searchType === "all" ? "everything" : searchType}...`}
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleQueryChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

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

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium">Categories</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Locations */}
              <div>
                <label className="text-sm font-medium">Locations</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium">Price Range (KES)</label>
              <div className="px-3 py-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: value as [number, number],
                    }))
                  }
                  max={1000000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{filters.priceRange[0].toLocaleString()}</span>
                  <span>{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={filters.featured}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({ ...prev, featured: !!checked }))
                  }
                />
                <label htmlFor="featured" className="text-sm">
                  Featured only
                </label>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button variant="outline" size="sm" onClick={saveFilters}>
                  Save Filters
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {(filters.categories.length > 0 ||
        filters.locations.length > 0 ||
        filters.featured) && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categories: prev.categories.filter((c) => c !== category),
                  }))
                }
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, featured: false }))
                }
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {loading
            ? "Searching..."
            : `${totalResults.toLocaleString()} results found`}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSearch(filters)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Results */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
        }
      >
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
        ) : results.length > 0 ? (
          results.map(renderResult)
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseSearchSystem;
