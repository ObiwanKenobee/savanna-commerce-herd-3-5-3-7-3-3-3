import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Smartphone,
  Activity,
  MapPin,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Camera,
  Wifi,
  QrCode,
  Banknote,
  Trophy,
  Users,
  AlertTriangle,
} from "lucide-react";

interface LivestockAsset {
  id: string;
  type: "goat" | "cow" | "sheep" | "chicken";
  name: string;
  age: number;
  weight: number;
  health: "excellent" | "good" | "fair" | "needs-attention";
  location: string;
  owner: string;
  currentValue: number;
  collateralStatus: "available" | "collateralized" | "sold";
  iotTagId: string;
  lastHealthCheck: string;
  breeding: boolean;
  vaccinations: string[];
  marketDemand: "high" | "medium" | "low";
}

interface Transaction {
  id: string;
  type: "purchase" | "collateral" | "insurance" | "breeding";
  assetId: string;
  amount: number;
  buyer: string;
  seller: string;
  status: "pending" | "completed" | "failed";
  mpesaCode: string;
  timestamp: string;
  terms: string;
}

const MpesaGoats = () => {
  const [livestock, setLivestock] = useState<LivestockAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<LivestockAsset | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "portfolio" | "collateral" | "analytics"
  >("marketplace");

  useEffect(() => {
    // Mock livestock data
    const mockLivestock: LivestockAsset[] = [
      {
        id: "goat-001",
        type: "goat",
        name: "Mbuzi wa Kahiga",
        age: 18,
        weight: 45,
        health: "excellent",
        location: "Kiambu, Central Kenya",
        owner: "John Kiprotich",
        currentValue: 15000,
        collateralStatus: "available",
        iotTagId: "IOT-KE-001",
        lastHealthCheck: "2 days ago",
        breeding: true,
        vaccinations: ["PPR", "Foot & Mouth", "Anthrax"],
        marketDemand: "high",
      },
      {
        id: "cow-001",
        type: "cow",
        name: "Ng'ombe Mzuri",
        age: 36,
        weight: 320,
        health: "good",
        location: "Nakuru, Rift Valley",
        owner: "Mary Wanjiku",
        currentValue: 85000,
        collateralStatus: "collateralized",
        iotTagId: "IOT-KE-002",
        lastHealthCheck: "1 week ago",
        breeding: true,
        vaccinations: ["FMD", "Lumpy Skin", "Brucellosis"],
        marketDemand: "medium",
      },
      {
        id: "sheep-001",
        type: "sheep",
        name: "Kondoo Mkubwa",
        age: 24,
        weight: 55,
        health: "excellent",
        location: "Laikipia, Central Kenya",
        owner: "David Mwangi",
        currentValue: 18000,
        collateralStatus: "available",
        iotTagId: "IOT-KE-003",
        lastHealthCheck: "3 days ago",
        breeding: false,
        vaccinations: ["Orf", "Clostridial", "PPR"],
        marketDemand: "high",
      },
      {
        id: "chicken-001",
        type: "chicken",
        name: "Kuku wa Kupiga Bei",
        age: 8,
        weight: 2.5,
        health: "good",
        location: "Machakos, Eastern Kenya",
        owner: "Grace Mutua",
        currentValue: 800,
        collateralStatus: "available",
        iotTagId: "IOT-KE-004",
        lastHealthCheck: "Yesterday",
        breeding: true,
        vaccinations: ["Newcastle", "Gumboro", "Fowl Pox"],
        marketDemand: "high",
      },
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx-001",
        type: "collateral",
        assetId: "cow-001",
        amount: 60000,
        buyer: "Equity Bank Kenya",
        seller: "Mary Wanjiku",
        status: "completed",
        mpesaCode: "QFX4H2N9K1",
        timestamp: "2 hours ago",
        terms: "90-day collateral loan at 8% interest",
      },
      {
        id: "tx-002",
        type: "purchase",
        assetId: "goat-001",
        amount: 15000,
        buyer: "Margaret Njeri",
        seller: "John Kiprotich",
        status: "pending",
        mpesaCode: "QFX4H2N9K2",
        timestamp: "30 minutes ago",
        terms: "Direct purchase with health guarantee",
      },
    ];

    setLivestock(mockLivestock);
    setTransactions(mockTransactions);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "fair":
        return "bg-yellow-100 text-yellow-700";
      case "needs-attention":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAnimalEmoji = (type: string) => {
    switch (type) {
      case "goat":
        return "🐐";
      case "cow":
        return "🐄";
      case "sheep":
        return "🐑";
      case "chicken":
        return "🐔";
      default:
        return "🐾";
    }
  };

  const initiateTransaction = (
    asset: LivestockAsset,
    type: "purchase" | "collateral",
  ) => {
    const amount =
      type === "collateral"
        ? Math.round(asset.currentValue * 0.7)
        : asset.currentValue;
    alert(
      `M-Pesa transaction initiated for ${asset.name}\nAmount: KSH ${amount.toLocaleString()}\nSend *334# to complete payment\nYou'll receive SMS confirmation and IoT tag transfer notification.`,
    );
  };

  const totalStats = {
    totalAssets: livestock.length,
    totalValue: livestock.reduce((sum, asset) => sum + asset.currentValue, 0),
    availableCollateral: livestock.filter(
      (asset) => asset.collateralStatus === "available",
    ).length,
    healthyAssets: livestock.filter((asset) => asset.health === "excellent")
      .length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🐐 M-Pesa Goats: Livestock Commerce
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Livestock-backed commerce</strong> with IoT ear tags for
            collateral. Buy, sell, and use animals as financial assets with
            real-time health monitoring and M-Pesa integration.
          </p>
          <div className="mt-4 text-sm text-green-600 font-medium">
            IoT Health Monitoring • Real-time Asset Tracking • M-Pesa
            Integration • Blockchain Verification
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.totalAssets}
              </div>
              <div className="text-sm text-green-600">Total Assets</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                KSH {totalStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Total Value</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.availableCollateral}
              </div>
              <div className="text-sm text-purple-600">
                Available Collateral
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.healthyAssets}
              </div>
              <div className="text-sm text-amber-600">Excellent Health</div>
            </CardContent>
          </Card>
        </div>

        {/* IoT Monitoring Alert */}
        <Alert className="mb-8 border-emerald-200 bg-emerald-50">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <strong>Live IoT Monitoring:</strong> All livestock assets are
            equipped with solar-powered IoT ear tags providing real-time
            location, health vitals, and movement tracking via LoRaWAN network.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(
            ["marketplace", "portfolio", "collateral", "analytics"] as const
          ).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === "marketplace" && (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              {tab === "portfolio" && <Trophy className="h-4 w-4 mr-2" />}
              {tab === "collateral" && <Shield className="h-4 w-4 mr-2" />}
              {tab === "analytics" && <TrendingUp className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Marketplace Tab */}
        {activeTab === "marketplace" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Livestock Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🛍️ Livestock Marketplace</h2>

              {livestock.map((asset) => (
                <Card
                  key={asset.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">
                          {getAnimalEmoji(asset.type)}
                        </span>
                        <div>
                          <CardTitle className="text-lg">
                            {asset.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="capitalize">
                              {asset.type}
                            </Badge>
                            <Badge className={getHealthColor(asset.health)}>
                              {asset.health}
                            </Badge>
                            <Badge
                              className={getDemandColor(asset.marketDemand)}
                            >
                              {asset.marketDemand} demand
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          KSH {asset.currentValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current Value
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-600">Age:</span>
                        <div>{asset.age} months</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">
                          Weight:
                        </span>
                        <div>{asset.weight} kg</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">
                          Location:
                        </span>
                        <div>{asset.location}</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">
                          Owner:
                        </span>
                        <div>{asset.owner}</div>
                      </div>
                    </div>

                    {/* IoT Status */}
                    <Alert className="border-blue-200 bg-blue-50">
                      <Wifi className="h-4 w-4" />
                      <AlertDescription>
                        <strong>IoT Tag {asset.iotTagId}:</strong> Last health
                        check {asset.lastHealthCheck} • GPS tracking active •
                        Vitals normal
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          initiateTransaction(asset, "purchase");
                        }}
                        disabled={asset.collateralStatus === "collateralized"}
                      >
                        <Smartphone className="h-3 w-3 mr-1" />
                        Buy with M-Pesa
                      </Button>

                      {asset.collateralStatus === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateTransaction(asset, "collateral");
                          }}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Use as Collateral
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <Camera className="h-3 w-3 mr-1" />
                        Live Feed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedAsset ? (
                /* Asset Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getAnimalEmoji(selectedAsset.type)}
                      </span>
                      <span>{selectedAsset.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Health Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Overall Health:</span>
                          <Badge
                            className={getHealthColor(selectedAsset.health)}
                          >
                            {selectedAsset.health}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last check: {selectedAsset.lastHealthCheck}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Vaccinations</h4>
                      <div className="space-y-1">
                        {selectedAsset.vaccinations.map(
                          (vaccination, index) => (
                            <div
                              key={index}
                              className="text-sm bg-green-50 p-2 rounded flex items-center"
                            >
                              <Zap className="h-3 w-3 text-green-600 mr-2" />
                              {vaccination}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Financial Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Value:</span>
                          <span className="font-bold">
                            KSH {selectedAsset.currentValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collateral Value (70%):</span>
                          <span>
                            KSH{" "}
                            {Math.round(
                              selectedAsset.currentValue * 0.7,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge
                            variant={
                              selectedAsset.collateralStatus === "available"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedAsset.collateralStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How It Works */
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">
                      How M-Pesa Goats Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>IoT Registration:</strong> Each animal gets
                        solar-powered ear tag with GPS & health sensors
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>Real-time Monitoring:</strong> Health, location,
                        and vital signs tracked 24/7
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>M-Pesa Integration:</strong> Buy, sell, or use
                        as collateral via mobile money
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Smart Contracts:</strong> Automated insurance
                        payouts and loan settlements
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Banknote className="h-5 w-5" />
                    <span>Recent Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">
                            {transaction.type}
                          </span>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          KSH {transaction.amount.toLocaleString()} •{" "}
                          {transaction.timestamp}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          M-Pesa: {transaction.mpesaCode}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "marketplace" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed analytics, portfolio management, and collateral
                tracking.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MpesaGoats;
