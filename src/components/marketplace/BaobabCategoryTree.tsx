/**
 * 🌳 Baobab Category Tree - Gamified Product Discovery
 * Interactive tree with shake animation to reveal hidden deals
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Leaf,
  Package,
  Star,
  Gift,
  Zap,
  TreePine,
  Apple,
  Cherry,
} from "lucide-react";

interface CategoryBranch {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  hasDeals: boolean;
  children?: CategoryBranch[];
  position: {
    x: number;
    y: number;
  };
}

interface HiddenDeal {
  id: string;
  productName: string;
  discount: number;
  originalPrice: number;
  newPrice: number;
  category: string;
  timeLeft: string;
}

interface Props {
  branches: CategoryBranch[];
  onShake: (deals: HiddenDeal[]) => void;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

const BaobabCategoryTree: React.FC<Props> = ({
  branches,
  onShake,
  onCategorySelect,
  className = "",
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [revealedDeals, setRevealedDeals] = useState<HiddenDeal[]>([]);
  const [treeGrowth, setTreeGrowth] = useState(100);

  // Mock hidden deals data
  const hiddenDeals: HiddenDeal[] = [
    {
      id: "1",
      productName: "Premium Maize Flour - Elephant Grade",
      discount: 25,
      originalPrice: 5600,
      newPrice: 4200,
      category: "agriculture",
      timeLeft: "6 hours",
    },
    {
      id: "2",
      productName: "Acacia Honey - Pure Savanna",
      discount: 20,
      originalPrice: 2250,
      newPrice: 1800,
      category: "gourmet",
      timeLeft: "12 hours",
    },
    {
      id: "3",
      productName: "Safari Spice Blend Collection",
      discount: 30,
      originalPrice: 1200,
      newPrice: 840,
      category: "spices",
      timeLeft: "3 hours",
    },
  ];

  // Shake the baobab tree
  const handleTreeShake = () => {
    if (isShaking) return;

    setIsShaking(true);
    setShakeCount((prev) => prev + 1);

    // Reveal deals based on shake intensity
    const dealsToReveal = hiddenDeals.slice(
      0,
      Math.min(shakeCount + 1, hiddenDeals.length),
    );
    setRevealedDeals(dealsToReveal);

    // Tree growth increases with successful shakes
    setTreeGrowth((prev) => Math.min(prev + 10, 150));

    // Play shake animation and sounds
    toast({
      title: "🌳 Baobab Shaken!",
      description: `${dealsToReveal.length} hidden deals revealed!`,
      duration: 3000,
    });

    // Call parent callback
    onShake(dealsToReveal);

    // Reset shake state
    setTimeout(() => {
      setIsShaking(false);
    }, 1500);
  };

  // Get fruit icon based on category
  const getCategoryFruit = (category: string) => {
    const fruitMap: Record<string, string> = {
      agriculture: "🌾",
      electronics: "🔌",
      fashion: "👗",
      construction: "🏗️",
      healthcare: "💊",
      automotive: "🚗",
      technology: "💻",
      services: "🛠️",
      gourmet: "🍯",
      spices: "🌶️",
    };
    return fruitMap[category] || "🍎";
  };

  // Get branch animation delay
  const getBranchAnimation = (index: number) => ({
    animationDelay: `${index * 0.1}s`,
  });

  return (
    <div className={`relative ${className}`}>
      {/* Main Baobab Tree */}
      <div className="text-center relative">
        <Button
          variant="ghost"
          className={`text-8xl md:text-9xl hover:scale-110 transition-transform duration-300 ${
            isShaking ? "baobab-shake" : ""
          }`}
          onClick={handleTreeShake}
          style={{
            transform: `scale(${treeGrowth / 100})`,
            filter: `hue-rotate(${shakeCount * 10}deg)`,
          }}
        >
          🌳
        </Button>

        {/* Tree base with roots */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-4xl opacity-60">
          🌿🌿🌿
        </div>

        {/* Shake instruction */}
        <p className="text-sm text-gray-600 mt-2 swahili-wisdom">
          "Mti unaojengeka hujengeka kwa haba" - Click the ancient Baobab to
          reveal its secrets
        </p>

        {/* Shake counter */}
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            Shakes: {shakeCount} | Tree Power: {treeGrowth}%
          </Badge>
        </div>
      </div>

      {/* Category Branches */}
      <div className="absolute inset-0 pointer-events-none">
        {branches.map((branch, index) => (
          <div
            key={branch.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${branch.position.x}%`,
              top: `${branch.position.y}%`,
              transform: "translate(-50%, -50%)",
              ...getBranchAnimation(index),
            }}
          >
            <Button
              variant="ghost"
              className="relative group hover:scale-110 transition-all duration-300"
              onClick={() => onCategorySelect(branch.id)}
            >
              {/* Branch with fruit */}
              <div className="relative">
                <span className="text-2xl">{getCategoryFruit(branch.id)}</span>
                {branch.hasDeals && (
                  <div className="absolute -top-1 -right-1 text-xs animate-bounce">
                    ✨
                  </div>
                )}

                {/* Product count indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {branch.productCount}
                  </Badge>
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {branch.name} ({branch.productCount} items)
                  {branch.hasDeals && (
                    <span className="text-yellow-300"> ✨ Has deals!</span>
                  )}
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>

      {/* Flying fruits animation when shaken */}
      {isShaking && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            >
              {getCategoryFruit(
                branches[i % branches.length]?.id || "agriculture",
              )}
            </div>
          ))}
        </div>
      )}

      {/* Revealed Deals Display */}
      {revealedDeals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-center">
            🍯 Baobab's Secret Treasures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revealedDeals.map((deal, index) => (
              <Card
                key={deal.id}
                className="border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-red-500 text-white">
                      -{deal.discount}% OFF
                    </Badge>
                    <div className="text-xs text-gray-600 flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      {deal.timeLeft} left
                    </div>
                  </div>

                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {deal.productName}
                  </h4>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        KES {deal.newPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        KES {deal.originalPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">
                        {getCategoryFruit(deal.category)} {deal.category}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    🦁 Claim Secret Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tree Growth Progress */}
      <div className="mt-6 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">Tree Wisdom Growth</p>
          <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(treeGrowth, 100)}%` }}
            ></div>
            {treeGrowth > 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-50 animate-pulse rounded-full"></div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {treeGrowth < 100
              ? `${100 - treeGrowth}% to next wisdom level`
              : "🌟 Ancient Wisdom Unlocked!"}
          </p>
        </div>
      </div>

      {/* Ecological Footer */}
      <div className="mt-6 text-center text-xs text-gray-500 swahili-wisdom">
        "Mti hauendi ikiwa huna mizizi" - A tree cannot grow without roots
      </div>
    </div>
  );
};

export default BaobabCategoryTree;
