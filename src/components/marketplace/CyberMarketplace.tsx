import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Star,
  Zap,
  Shield,
  Eye,
  ShoppingCart,
  Coins,
  Globe,
  QrCode,
  Crown,
  TrendingUp,
} from "lucide-react";
import { NEO_SAVANNAH_THEME } from "@/theme/neo-savannah-theme";

interface Product {
  id: string;
  name: string;
  vendor: string;
  price: number;
  mbogaPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
  isNFT: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  location: string;
  tags: string[];
  hologramPreview?: string;
}

interface CyberMarketplaceProps {
  onProductClick?: (product: Product) => void;
  onARScan?: (product: Product) => void;
  className?: string;
}

const CyberMarketplace: React.FC<CyberMarketplaceProps> = ({
  onProductClick,
  onARScan,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);

  // Mock products data with cyberpunk theme
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Quantum Honey",
        vendor: "Cyber Bee Collective",
        price: 1200,
        mbogaPrice: 120,
        image: "/api/placeholder/300/300",
        category: "organic",
        rating: 4.9,
        reviews: 847,
        isVerified: true,
        isNFT: true,
        rarity: "legendary",
        location: "Digital Hives, Kenya",
        tags: ["organic", "blockchain-verified", "ar-ready"],
        hologramPreview: "🍯✨",
      },
      {
        id: "2",
        name: "Holographic Maize",
        vendor: "Neo Farmers Guild",
        price: 800,
        mbogaPrice: 80,
        image: "/api/placeholder/300/300",
        category: "grains",
        rating: 4.7,
        reviews: 523,
        isVerified: true,
        isNFT: false,
        rarity: "epic",
        location: "Cyber Plains, Tanzania",
        tags: ["fresh", "local", "sustainable"],
        hologramPreview: "🌽🔮",
      },
      {
        id: "3",
        name: "Digital Spice Blend",
        vendor: "Spice Matrix Inc",
        price: 2500,
        mbogaPrice: 250,
        image: "/api/placeholder/300/300",
        category: "spices",
        rating: 5.0,
        reviews: 1205,
        isVerified: true,
        isNFT: true,
        rarity: "legendary",
        location: "Virtual Zanzibar",
        tags: ["premium", "limited-edition", "nft-certified"],
        hologramPreview: "🌶️💫",
      },
      {
        id: "4",
        name: "Synthetic Avocados",
        vendor: "BioTech Farms",
        price: 600,
        mbogaPrice: 60,
        image: "/api/placeholder/300/300",
        category: "fruits",
        rating: 4.5,
        reviews: 342,
        isVerified: false,
        isNFT: false,
        rarity: "rare",
        location: "Lab-Grown Groves",
        tags: ["lab-grown", "consistent-quality"],
        hologramPreview: "��⚗️",
      },
      {
        id: "5",
        name: "Quantum Coffee Beans",
        vendor: "Coffee Dimension",
        price: 1800,
        mbogaPrice: 180,
        image: "/api/placeholder/300/300",
        category: "beverages",
        rating: 4.8,
        reviews: 967,
        isVerified: true,
        isNFT: true,
        rarity: "epic",
        location: "Highland Servers, Ethiopia",
        tags: ["premium", "fair-trade", "ar-experience"],
        hologramPreview: "☕🌌",
      },
      {
        id: "6",
        name: "Cyber Spinach",
        vendor: "Green Matrix Co",
        price: 400,
        mbogaPrice: 40,
        image: "/api/placeholder/300/300",
        category: "vegetables",
        rating: 4.3,
        reviews: 189,
        isVerified: true,
        isNFT: false,
        rarity: "common",
        location: "Hydroponic Towers",
        tags: ["nutritious", "fast-delivery"],
        hologramPreview: "🥬💚",
      },
    ];
    setProducts(mockProducts);
  }, []);

  const categories = [
    { id: "all", name: "All Products", icon: "🌍", count: products.length },
    { id: "organic", name: "Quantum Organic", icon: "🌿", count: 234 },
    { id: "grains", name: "Digital Grains", icon: "🌾", count: 156 },
    { id: "fruits", name: "Holo Fruits", icon: "🍎", count: 189 },
    { id: "vegetables", name: "Cyber Veggies", icon: "🥬", count: 267 },
    { id: "spices", name: "Spice Matrix", icon: "🌶️", count: 78 },
    { id: "beverages", name: "Liquid Code", icon: "☕", count: 145 },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-digital-purple border-digital-purple bg-digital-purple/10";
      case "epic":
        return "text-electric-amber border-electric-amber bg-electric-amber/10";
      case "rare":
        return "text-glowing-blue border-glowing-blue bg-glowing-blue/10";
      default:
        return "text-holographic-green border-holographic-green bg-holographic-green/10";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`neo-savannah-app min-h-screen ${className}`}>
      {/* Background Effects */}
      <div className="cyber-grid-bg absolute inset-0" />
      <div className="scanlines absolute inset-0" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-cyber cyber-heading mb-4 glitch-text"
            data-text="CYBER BAZAAR"
          >
            CYBER BAZAAR
          </h1>
          <p className="text-lg digital-text max-w-2xl mx-auto">
            Explore the digital marketplace where tradition meets technology.
            Every product is verified by AI and secured by blockchain.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-holographic-green" />
              <Input
                type="text"
                placeholder="Search the digital savannah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  pl-10 bg-cyber-black/50 border-holographic-green/30 text-holographic-green 
                  placeholder:text-holographic-green/50 focus:border-holographic-green
                  focus:ring-holographic-green digital-text
                "
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-electric-amber text-electric-amber hover:bg-electric-amber/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Button
                variant="outline"
                className="border-glowing-blue text-glowing-blue hover:bg-glowing-blue/10"
                onClick={() => onARScan && onARScan(products[0])}
              >
                <QrCode className="h-4 w-4 mr-2" />
                AR Scan
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className={`
                  ${
                    selectedCategory === category.id
                      ? "neon-btn"
                      : "border-holographic-green/30 text-holographic-green hover:bg-holographic-green/10"
                  }
                `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge className="ml-2 bg-cyber-black text-holographic-green">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cyber-card group cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => onProductClick && onProductClick(product)}
            >
              <CardHeader className="p-0 relative overflow-hidden">
                {/* Product Image with Hologram Effect */}
                <div className="relative h-48 bg-cyber-black/30 flex items-center justify-center hologram">
                  <div className="text-6xl animate-hologram">
                    {product.hologramPreview}
                  </div>

                  {/* Rarity Badge */}
                  <Badge
                    className={`absolute top-2 left-2 ${getRarityColor(product.rarity)}`}
                  >
                    {product.rarity}
                  </Badge>

                  {/* NFT Badge */}
                  {product.isNFT && (
                    <Badge className="absolute top-2 right-2 bg-digital-purple/20 text-digital-purple border-digital-purple">
                      NFT
                    </Badge>
                  )}

                  {/* AR Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 neon-btn opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onARScan && onARScan(product);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Name and Vendor */}
                  <div>
                    <h3 className="cyber-heading text-lg font-bold truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="digital-text">{product.vendor}</span>
                      {product.isVerified && (
                        <Shield
                          className="h-4 w-4 text-holographic-green"
                          title="Verified Vendor"
                        />
                      )}
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-electric-amber text-electric-amber" />
                      <span className="digital-text text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="digital-text text-xs opacity-70">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="cyber-heading text-xl">
                        KES {product.price.toLocaleString()}
                      </span>
                      <Button size="sm" className="neon-btn">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="h-4 w-4 text-electric-amber" />
                      <span className="digital-text">
                        {product.mbogaPrice}{" "}
                        {NEO_SAVANNAH_THEME.currency.mbogaCoin.name}
                      </span>
                    </div>
                  </div>

                  {/* Location and Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs digital-text">
                      <Globe className="h-3 w-3" />
                      <span>{product.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-holographic-green/30 text-holographic-green/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-holographic-green/30 text-holographic-green/70"
                        >
                          +{product.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button size="lg" className="neon-btn">
            <TrendingUp className="h-5 w-5 mr-2" />
            Load More Digital Treasures
          </Button>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 text-center">
            <div className="text-3xl mb-2">
              {NEO_SAVANNAH_THEME.currency.mbogaCoin.symbol}
            </div>
            <div className="cyber-heading text-xl">Digital Currency</div>
            <div className="digital-text text-sm opacity-70">
              Pay with Mboga Coins for instant, secure transactions
            </div>
          </div>

          <div className="cyber-card p-6 text-center">
            <div className="text-3xl mb-2">🔮</div>
            <div className="cyber-heading text-xl">AR Preview</div>
            <div className="digital-text text-sm opacity-70">
              See products in 3D before you buy
            </div>
          </div>

          <div className="cyber-card p-6 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="cyber-heading text-xl">Blockchain Verified</div>
            <div className="digital-text text-sm opacity-70">
              Every transaction secured by smart contracts
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="particles absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor:
                i % 3 === 0 ? "#00FF9F" : i % 3 === 1 ? "#00D4FF" : "#FFB000",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CyberMarketplace;
