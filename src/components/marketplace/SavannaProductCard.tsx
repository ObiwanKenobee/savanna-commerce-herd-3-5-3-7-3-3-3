/**
 * 🦁 Savanna Product Card - Cultural Kenya B2B Component
 * Animal print borders, Maasai patterns, lion paw buttons
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  Star,
  MapPin,
  Zap,
  Shield,
  Crown,
  Award,
  Heart,
  Share2,
  Eye,
  Package,
  Clock,
  Users,
} from "lucide-react";

interface SavannaProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  supplier: {
    name: string;
    rating: number;
    verified: boolean;
    prideLevel: "cub" | "lion" | "alpha";
    location: string;
    avatar?: string;
  };
  stock: number;
  urgency: "high" | "medium" | "low";
  cheetahEligible: boolean;
  imageUrl: string;
  tags: string[];
  bulkDiscount?: {
    threshold: number;
    discount: number;
    currentParticipants: number;
  };
  theme?: "zebra" | "giraffe" | "leopard";
  arPreviewUrl?: string;
}

interface Props {
  product: SavannaProduct;
  viewMode?: "grid" | "list";
  onAddToCart: (product: SavannaProduct) => void;
  onARPreview?: (product: SavannaProduct) => void;
  onShare?: (product: SavannaProduct) => void;
  soundEnabled?: boolean;
}

const SavannaProductCard: React.FC<Props> = ({
  product,
  viewMode = "grid",
  onAddToCart,
  onARPreview,
  onShare,
  soundEnabled = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPawPressed, setIsPawPressed] = useState(false);

  // Play roar sound and animation
  const handleLionPawClick = () => {
    setIsPawPressed(true);
    setTimeout(() => setIsPawPressed(false), 600);

    if (soundEnabled) {
      // In production, you'd play an actual roar sound
      toast({
        title: "🦁 ROAR!",
        description: `${product.name} added to your hunting pack!`,
        duration: 2000,
      });
    }

    onAddToCart(product);
  };

  // Get pride level styling and icon
  const getPrideLevel = () => {
    switch (product.supplier.prideLevel) {
      case "alpha":
        return {
          icon: <Crown className="h-4 w-4 text-yellow-600" />,
          badge: "Alpha Lion",
          className: "pride-alpha",
          description: "Fastest delivery master",
        };
      case "lion":
        return {
          icon: <Award className="h-4 w-4 text-orange-600" />,
          badge: "Lion",
          className: "pride-lion",
          description: "Established supplier",
        };
      case "cub":
        return {
          icon: <Heart className="h-4 w-4 text-pink-600" />,
          badge: "Cub",
          className: "pride-cub",
          description: "Growing supplier - needs support",
        };
      default:
        return {
          icon: <Users className="h-4 w-4 text-gray-600" />,
          badge: "Trader",
          className: "",
          description: "Community member",
        };
    }
  };

  // Get urgency border styling
  const getUrgencyClass = () => {
    switch (product.urgency) {
      case "high":
        return "urgency-high";
      case "medium":
        return "urgency-medium";
      case "low":
        return "urgency-low";
      default:
        return "";
    }
  };

  // Get animal theme border
  const getThemeBorder = () => {
    switch (product.theme) {
      case "zebra":
        return "zebra-border";
      case "giraffe":
        return "giraffe-border";
      case "leopard":
        return "leopard-border";
      default:
        return "";
    }
  };

  // Calculate bulk discount progress
  const getBulkProgress = () => {
    if (!product.bulkDiscount) return 0;
    return (
      (product.bulkDiscount.currentParticipants /
        product.bulkDiscount.threshold) *
      100
    );
  };

  const prideLevel = getPrideLevel();

  if (viewMode === "list") {
    return (
      <Card
        className={`group hover:shadow-xl transition-all duration-300 ${getUrgencyClass()}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <Package className="h-8 w-8 text-gray-600" />
              {product.cheetahEligible && (
                <div className="absolute top-1 right-1">
                  <Zap className="h-4 w-4 text-yellow-500 cheetah-speed" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"}`}
                  />
                </Button>
              </div>

              {/* Price and Stock */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="maasai-bead-pattern px-3 py-1 rounded-full text-white font-bold text-sm">
                    KES {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.stock < 5
                        ? "bg-red-500"
                        : product.stock < 20
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                  <span>{product.stock} left</span>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={`text-xs ${prideLevel.className}`}
                    >
                      {product.supplier.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    {prideLevel.icon}
                    <span className="text-sm font-medium">
                      {product.supplier.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{product.supplier.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{product.supplier.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  className={`lion-paw-button flex-1 ${isPawPressed ? "animate-pulse" : ""}`}
                  onClick={handleLionPawClick}
                  style={{
                    background: "linear-gradient(135deg, #E2725B, #FFD700)",
                    border: "none",
                    color: "white",
                  }}
                >
                  🦁 Add to Pack
                </Button>
                {onARPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onARPreview(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(product)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 h-full flex flex-col ${getUrgencyClass()} ${getThemeBorder()}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {/* Animal print indicator */}
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full opacity-70"></div>

            {/* Badges */}
            {product.cheetahEligible && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs cheetah-speed">
                <Zap className="h-3 w-3 mr-1" />
                Cheetah Speed
              </Badge>
            )}
            {product.supplier.verified && (
              <Badge className="bg-green-100 text-green-800 text-xs rhino-stamp">
                <Shield className="h-3 w-3 mr-1" />
                Rhino Certified
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Product Image */}
        <div className="aspect-video bg-gradient-to-br from-green-200 to-yellow-100 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden">
          📦
          {product.cheetahEligible && (
            <div className="absolute top-2 right-2">
              <Zap className="h-6 w-6 text-yellow-500 cheetah-speed" />
            </div>
          )}
          {product.urgency === "high" && (
            <div className="absolute top-2 left-2">
              <Clock className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {product.description}
          </p>

          {/* Price with Maasai bead pattern */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="maasai-bead-pattern px-3 py-1 rounded-full text-white font-bold relative overflow-hidden">
                <span className="relative z-10">
                  KES {product.price.toLocaleString()}
                </span>
              </div>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  KES {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock urgency indicator */}
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock < 5
                    ? "bg-red-500"
                    : product.stock < 20
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <span className="text-xs text-gray-600">
                {product.stock} left
              </span>
            </div>
          </div>

          {/* Supplier Pride Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded-full ${prideLevel.className}`}>
                {prideLevel.icon}
              </div>
              <div>
                <span className="text-sm font-medium">
                  {product.supplier.name}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs">{product.supplier.rating}</span>
                  <Badge variant="outline" className="text-xs ml-1">
                    {prideLevel.badge}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>{product.supplier.location}</span>
            </div>
          </div>

          {/* Bulk Discount Progress (Elephant Herd) */}
          {product.bulkDiscount && (
            <div className="mb-3 p-2 bg-gray-50 rounded elephant-march">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium flex items-center">
                  🐘 <span className="ml-1">Elephant Herd Discount</span>
                </span>
                <span className="text-xs font-bold text-green-600">
                  {product.bulkDiscount.discount}% off
                </span>
              </div>
              <Progress value={getBulkProgress()} className="h-2 mb-1" />
              <p className="text-xs text-gray-600">
                {product.bulkDiscount.threshold -
                  product.bulkDiscount.currentParticipants}{" "}
                more shops to unlock herd power!
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {/* Lion Paw Button */}
          <Button
            className={`lion-paw-button flex-1 group relative overflow-hidden ${isPawPressed ? "animate-pulse" : ""}`}
            onClick={handleLionPawClick}
            style={{
              background: "linear-gradient(135deg, #E2725B, #FFD700)",
              border: "none",
              color: "white",
            }}
          >
            <span className="relative z-10 flex items-center justify-center">
              🦁 <span className="ml-2">Add to Pack</span>
            </span>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </Button>

          {onARPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onARPreview(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare?.(product)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Swahili Wisdom Footer */}
        {product.bulkDiscount && getBulkProgress() > 80 && (
          <div className="text-center text-xs swahili-wisdom">
            "Umoja ni nguvu" - Unity is strength
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavannaProductCard;
