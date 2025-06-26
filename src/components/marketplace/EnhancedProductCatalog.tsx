import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts, Product } from "@/hooks/useSupabaseData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  Package,
  MapPin,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Shield,
  Truck,
  Zap,
  Clock,
  Users,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  cheetahMode?: boolean;
}

const ProductCard = ({ product, cheetahMode }: ProductCardProps) => {
  const { addToCart, getCartItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(product.minimum_order_quantity || 1);
  const [isAdding, setIsAdding] = useState(false);
  const cartItem = getCartItem(product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product, quantity);

      toast({
        title: "Added to cart! 🛒",
        description: `${quantity}x ${product.name} added to your cart`,
      });

      console.log(`✅ Added ${quantity}x ${product.name} to cart`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateCart = (newQuantity: number) => {
    if (cartItem && newQuantity > 0) {
      updateQuantity(product.id, newQuantity);
      toast({
        title: "Cart updated",
        description: `Quantity changed to ${newQuantity}`,
      });
    }
  };

  const handleQuickView = () => {
    console.log(`👁️ Quick view: ${product.name}`);
  };

  const handleWishlist = () => {
    console.log(`❤️ Added to wishlist: ${product.name}`);
    toast({
      title: "Added to wishlist ❤️",
      description: `${product.name} saved for later`,
    });
  };

  const handleShare = () => {
    const shareText = `Check out ${product.name} on Savanna Marketplace! 🦁\nPrice: KES ${product.unit_price}\n\nhttps://savanna-marketplace.com/product/${product.id}`;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareText,
        url: `https://savanna-marketplace.com/product/${product.id}`,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Link copied! 📋",
        description: "Product link copied to clipboard",
      });
    }
  };

  // Mock enhanced data
  const mockRating = 4.5 + Math.random() * 0.5;
  const mockReviews = Math.floor(Math.random() * 200) + 50;
  const isCheetahEligible = Math.random() > 0.6;
  const mockStock = Math.floor(Math.random() * 100) + 10;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md relative overflow-hidden">
      {/* Cheetah Mode Badge */}
      {cheetahMode && isCheetahEligible && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-500 text-black animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            1hr
          </Badge>
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <Package className="h-16 w-16 text-green-600" />
      </div>

      {/* Quick Action Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
        <Button size="sm" variant="secondary" onClick={handleQuickView}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleWishlist}>
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {product.supplier?.country || "Kenya"}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{mockRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({mockReviews})</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Price:</span>
            <div className="text-right">
              <span className="font-bold text-lg text-primary">
                KES {product.unit_price?.toLocaleString() || "0"}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                /{product.unit_of_measure}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min. Order:</span>
              <span>
                {product.minimum_order_quantity || 1} {product.unit_of_measure}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-medium text-green-600">
                {mockStock} left
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Supplier:</span>
            <span className="font-medium truncate">
              {product.supplier?.name || "Local Supplier"}
            </span>
          </div>
        </div>

        {/* Quality badges */}
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Award className="h-3 w-3 mr-1" />
            Premium
          </Badge>
          {isCheetahEligible && (
            <Badge
              variant="outline"
              className="text-xs text-yellow-600 border-yellow-600"
            >
              <Zap className="h-3 w-3 mr-1" />
              Fast Delivery
            </Badge>
          )}
        </div>

        {/* Cart Actions */}
        {!cartItem ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Qty:</span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        product.minimum_order_quantity || 1,
                        quantity - 1,
                      ),
                    )
                  }
                  disabled={quantity <= (product.minimum_order_quantity || 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        product.minimum_order_quantity || 1,
                        parseInt(e.target.value) || 1,
                      ),
                    )
                  }
                  className="w-16 h-8 text-center text-sm"
                  min={product.minimum_order_quantity || 1}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding
                ? "Adding..."
                : `Add to Cart - KES ${(quantity * (product.unit_price || 0)).toLocaleString()}`}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
              <span className="text-sm text-green-800">
                In Cart: {cartItem.quantity}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateCart(cartItem.quantity - 1)}
                  disabled={cartItem.quantity <= 1}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-2 text-sm font-medium">
                  {cartItem.quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateCart(cartItem.quantity + 1)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View in Cart
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EnhancedProductCatalogProps {
  searchQuery?: string;
  cheetahMode?: boolean;
}

export const EnhancedProductCatalog = ({
  searchQuery = "",
  cheetahMode = false,
}: EnhancedProductCatalogProps) => {
  const { data: products = [], loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Update search term when prop changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Mock categories
  const categories = [
    "Food & Beverages",
    "Agriculture",
    "Textiles",
    "Electronics",
    "Health & Beauty",
    "Home & Garden",
    "Industrial",
    "Services",
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesPrice =
      (product.unit_price || 0) >= priceRange[0] &&
      (product.unit_price || 0) <= priceRange[1];

    // Cheetah mode filtering
    const matchesCheetahMode = !cheetahMode || Math.random() > 0.4;

    return (
      matchesSearch && matchesCategory && matchesPrice && matchesCheetahMode
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return (a.unit_price || 0) - (b.unit_price || 0);
      case "price_high":
        return (b.unit_price || 0) - (a.unit_price || 0);
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return Math.random() - 0.5; // Mock rating sort
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🦁</div>
          <div className="text-xl font-semibold mb-2">
            Loading the Savanna...
          </div>
          <div className="text-gray-600">Finding the best products for you</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white/80 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {filteredProducts.length} results for "{searchQuery}"
                {cheetahMode && <span className="ml-2">⚡</span>}
              </h2>
              <p className="text-sm text-gray-600">
                {cheetahMode
                  ? "Showing products with 1-hour delivery available"
                  : "Showing all matching products"}
              </p>
            </div>
            {cheetahMode && (
              <Badge className="bg-yellow-500 text-black animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Cheetah Mode Active
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, suppliers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {sortedProducts.length} of {products.length} products
          </span>
          <div className="flex items-center space-x-4">
            <span>
              🦁 {Math.floor(Math.random() * 50) + 10} suppliers online
            </span>
            <span>
              ⚡ {Math.floor(sortedProducts.length * 0.6)} fast delivery
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cheetahMode={cheetahMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setPriceRange([0, 100000]);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {sortedProducts.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            <Package className="h-4 w-4 mr-2" />
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};
