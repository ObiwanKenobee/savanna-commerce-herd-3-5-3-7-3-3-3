import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Crown, Star, Trophy, TrendingUp, MapPin } from "lucide-react";
import {
  savannaCommandCenter,
  type SupplierLeaderboard,
} from "../../services/savannaCommandCenterService";

interface LionPrideLeaderboardProps {
  isSwahili?: boolean;
}

export const LionPrideLeaderboard: React.FC<LionPrideLeaderboardProps> = ({
  isSwahili = false,
}) => {
  const [leaderboard, setLeaderboard] = useState<SupplierLeaderboard[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierLeaderboard | null>(null);
  const [sortBy, setSortBy] = useState<"volume" | "reliability">("volume");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await savannaCommandCenter.getSupplierLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load supplier leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getManeEmoji = (maneSize: string): string => {
    const manes = {
      alpha: "🦁", // Alpha lion
      large: "🦁", // Male lion
      medium: "🦁", // Young male
      small: "🐅", // Lioness/cub
    };
    return manes[maneSize as keyof typeof manes] || "🐅";
  };

  const getManeDescription = (maneSize: string): string => {
    const descriptions = {
      alpha: isSwahili ? "Simba Mkuu" : "Alpha Lion",
      large: isSwahili ? "Simba Mkuu" : "Pride Leader",
      medium: isSwahili ? "Simba Mdogo" : "Pride Member",
      small: isSwahili ? "Mjinga" : "Young Pride",
    };
    return (
      descriptions[maneSize as keyof typeof descriptions] || "Pride Member"
    );
  };

  const getPawRating = (rating: number): string => {
    return "🐾".repeat(rating) + "⚪".repeat(5 - rating);
  };

  const getVolumeColor = (volume: number, maxVolume: number): string => {
    const percentage = (volume / maxVolume) * 100;
    if (percentage >= 80) return "text-yellow-600"; // Gold
    if (percentage >= 60) return "text-orange-600"; // Orange
    if (percentage >= 40) return "text-amber-600"; // Amber
    return "text-gray-600"; // Gray
  };

  const getBusinessTypeIcon = (businessType: string): string => {
    const icons: Record<string, string> = {
      cooperative: "🤝",
      distributor: "🚛",
      farmer: "🌾",
      retailer: "🏪",
      wholesaler: "📦",
      manufacturer: "🏭",
    };
    return icons[businessType] || "🏢";
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === "volume") {
      return b.volume - a.volume;
    }
    return b.reliability - a.reliability;
  });

  const maxVolume = Math.max(...leaderboard.map((s) => s.volume));

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="text-4xl animate-bounce">🦁</div>
              <p>
                {isSwahili
                  ? "Inapakia Orodha ya Makundi..."
                  : "Loading Pride Leaderboard..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <span>
              {isSwahili
                ? "Orodha ya Makundi ya Simba"
                : "Lion Pride Leaderboard"}
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSwahili
              ? "Wauzaji bora 10 kwa ukubwa wa kiasi (ukubwa wa mane) na kuaminika (alama za kidole)"
              : "Top 10 suppliers by volume (mane size) and reliability (paw rating)"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={sortBy === "volume" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("volume")}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                {isSwahili ? "Ukubwa" : "Volume"}
              </Button>
              <Button
                variant={sortBy === "reliability" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("reliability")}
              >
                <Star className="h-4 w-4 mr-1" />
                {isSwahili ? "Kuaminika" : "Reliability"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {isSwahili ? "Imeongozwa na" : "Sorted by"}:{" "}
              {sortBy === "volume"
                ? isSwahili
                  ? "Ukubwa"
                  : "Volume"
                : isSwahili
                  ? "Kuaminika"
                  : "Reliability"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>{isSwahili ? "Nafasi za Juu" : "Top Rankings"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedLeaderboard.map((supplier, index) => (
                <div
                  key={supplier.supplierId}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedSupplier?.supplierId === supplier.supplierId
                      ? "bg-yellow-50 border-2 border-yellow-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : "bg-orange-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Supplier Avatar & Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {getManeEmoji(supplier.maneSize)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {supplier.supplierName}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span className="text-lg">
                              {getBusinessTypeIcon(supplier.businessType)}
                            </span>
                            <span>{supplier.businessType}</span>
                            <MapPin className="h-3 w-3" />
                            <span>{supplier.county}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {sortBy === "volume"
                          ? formatVolume(supplier.volume)
                          : `${Math.round(supplier.reliability * 100)}%`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sortBy === "volume"
                          ? isSwahili
                            ? "kiasi"
                            : "volume"
                          : isSwahili
                            ? "kuaminika"
                            : "reliability"}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <Progress
                      value={
                        sortBy === "volume"
                          ? (supplier.volume / maxVolume) * 100
                          : supplier.reliability * 100
                      }
                      className="h-2"
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {getManeDescription(supplier.maneSize)}
                      </Badge>
                      {index < 3 && (
                        <Badge
                          variant="default"
                          className="text-xs bg-yellow-500"
                        >
                          {isSwahili ? "Daraja la Juu" : "Top Tier"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm">
                      {getPawRating(supplier.pawRating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supplier Details */}
        <div className="space-y-4">
          {selectedSupplier ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-3xl">
                    {getManeEmoji(selectedSupplier.maneSize)}
                  </span>
                  <div>
                    <span>{selectedSupplier.supplierName}</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      {getManeDescription(selectedSupplier.maneSize)}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatVolume(selectedSupplier.volume)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isSwahili ? "Kiasi cha Mauzo" : "Sales Volume"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(selectedSupplier.reliability * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isSwahili ? "Kuaminika" : "Reliability"}
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isSwahili ? "Aina ya Biashara" : "Business Type"}:
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>
                        {getBusinessTypeIcon(selectedSupplier.businessType)}
                      </span>
                      <span className="font-medium">
                        {selectedSupplier.businessType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isSwahili ? "Eneo" : "Location"}:
                    </span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedSupplier.county}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isSwahili ? "Kiwango cha Kidole" : "Paw Rating"}:
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>{getPawRating(selectedSupplier.pawRating)}</span>
                      <span className="font-medium">
                        ({selectedSupplier.pawRating}/5)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {isSwahili
                      ? "Uchambuzi wa Utendaji"
                      : "Performance Analysis"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {selectedSupplier.reliability > 0.9 && (
                      <div className="flex items-center space-x-2 text-green-700">
                        <Star className="h-4 w-4" />
                        <span>
                          {isSwahili
                            ? "Muuzaji wa kuaminika sana"
                            : "Highly reliable supplier"}
                        </span>
                      </div>
                    )}

                    {selectedSupplier.volume > maxVolume * 0.8 && (
                      <div className="flex items-center space-x-2 text-blue-700">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {isSwahili
                            ? "Kiasi kikubwa cha mauzo"
                            : "High volume performer"}
                        </span>
                      </div>
                    )}

                    {selectedSupplier.maneSize === "alpha" && (
                      <div className="flex items-center space-x-2 text-yellow-700">
                        <Crown className="h-4 w-4" />
                        <span>
                          {isSwahili ? "Kiongozi wa kundi" : "Pride leader"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    {isSwahili ? "Ona Ripoti" : "View Report"}
                  </Button>
                  <Button variant="outline" size="sm">
                    {isSwahili ? "Wasiliana" : "Contact"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🦁</div>
                  <p className="text-muted-foreground">
                    {isSwahili
                      ? "Chagua muuzaji kuona maelezo zaidi"
                      : "Select a supplier to view detailed information"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pride Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-xl">📊</span>
                <span>
                  {isSwahili ? "Takwimu za Kundi" : "Pride Statistics"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {leaderboard.filter((s) => s.maneSize === "alpha").length}
                  </div>
                  <div className="text-muted-foreground">
                    {isSwahili ? "Viongozi wa Alpha" : "Alpha Leaders"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {leaderboard.filter((s) => s.pawRating >= 4).length}
                  </div>
                  <div className="text-muted-foreground">
                    {isSwahili ? "Alama 4+ za Kidole" : "4+ Paw Rating"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(
                      (leaderboard.reduce((sum, s) => sum + s.reliability, 0) /
                        leaderboard.length) *
                        100,
                    )}
                    %
                  </div>
                  <div className="text-muted-foreground">
                    {isSwahili ? "Wastani wa Kuaminika" : "Avg Reliability"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatVolume(
                      leaderboard.reduce((sum, s) => sum + s.volume, 0),
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {isSwahili ? "Jumla ya Kiasi" : "Total Volume"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LionPrideLeaderboard;
