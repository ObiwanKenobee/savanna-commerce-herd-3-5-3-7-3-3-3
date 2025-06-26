import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  TreePine,
  Satellite,
  Coins,
  TrendingUp,
  Target,
  Shield,
  Smartphone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

interface TreePlanting {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  treeSpecies: string;
  plantingDate: string;
  treesPlanted: number;
  survivalRate: number;
  carbonCreditsPotential: number;
  verificationStatus: "Planted" | "Verified" | "Matured" | "Credited";
  satelliteImageUrl?: string;
  payoutEarned: number;
}

interface CarbonCredit {
  id: string;
  farmerId: string;
  treesVerified: number;
  carbonOffset: number;
  creditTokens: number;
  marketPrice: number;
  buyer?: string;
  transactionDate?: string;
  blockchainTxHash?: string;
}

const treePlantings: TreePlanting[] = [
  {
    id: "plant-001",
    farmerId: "farmer-001",
    farmerName: "John Mwangi",
    location: "Nakuru County",
    treeSpecies: "Acacia melanoxylon",
    plantingDate: "2022-03-15",
    treesPlanted: 150,
    survivalRate: 87,
    carbonCreditsPotential: 12.5,
    verificationStatus: "Matured",
    payoutEarned: 65.25,
  },
  {
    id: "plant-002",
    farmerId: "farmer-002",
    farmerName: "Mary Wanjiku",
    location: "Nyeri County",
    treeSpecies: "Grevillea robusta",
    plantingDate: "2023-01-20",
    treesPlanted: 200,
    survivalRate: 92,
    carbonCreditsPotential: 18.4,
    verificationStatus: "Verified",
    payoutEarned: 0,
  },
  {
    id: "plant-003",
    farmerId: "farmer-003",
    farmerName: "Peter Kimutai",
    location: "Kajiado County",
    treeSpecies: "Melia volkensii",
    plantingDate: "2024-01-10",
    treesPlanted: 75,
    survivalRate: 0, // Too early to verify
    carbonCreditsPotential: 6.8,
    verificationStatus: "Planted",
    payoutEarned: 0,
  },
];

const carbonCredits: CarbonCredit[] = [
  {
    id: "credit-001",
    farmerId: "farmer-001",
    treesVerified: 130,
    carbonOffset: 10.9,
    creditTokens: 109,
    marketPrice: 0.65,
    buyer: "Microsoft Carbon Initiative",
    transactionDate: "2024-01-18",
    blockchainTxHash: "0x742d35cc4200b9f5c0e2c3a1234567890abcdef",
  },
  {
    id: "credit-002",
    farmerId: "farmer-002",
    treesVerified: 184,
    carbonOffset: 16.9,
    creditTokens: 169,
    marketPrice: 0.68,
    buyer: "Kenya Airways Offset Program",
    transactionDate: "2024-01-20",
    blockchainTxHash: "0x851e46dd5300c8a6d0f3d4b5678901234abcdef",
  },
];

export const CarbonCreditMicroExchanges = () => {
  const [selectedFarmer, setSelectedFarmer] = useState<TreePlanting>(
    treePlantings[0],
  );
  const [newPlanting, setNewPlanting] = useState({
    treeSpecies: "Acacia melanoxylon",
    treesPlanted: 100,
    location: "",
  });
  const [marketData, setMarketData] = useState({
    currentPrice: 0.67,
    volume24h: 2450,
    totalCreditsTraded: 15678,
    activeFarmers: 342,
  });

  // Simulate real-time market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() - 0.5) * 0.02,
        volume24h: prev.volume24h + Math.floor(Math.random() * 100),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const registerPlanting = () => {
    if (!newPlanting.location.trim()) return;

    alert(`🌳 Tree Planting Registered!

📋 Registration Details:
Species: ${newPlanting.treeSpecies}
Trees: ${newPlanting.treesPlanted}
Location: ${newPlanting.location}

🛰️ Satellite verification scheduled
📱 USSD updates will be sent
💰 Estimated earnings: $${(newPlanting.treesPlanted * 0.5).toFixed(2)} in 2 years

Registration ID: PLANT-${Date.now().toString().slice(-6)}

✅ Welcome to carbon farming!`);

    setNewPlanting({
      treeSpecies: "Acacia melanoxylon",
      treesPlanted: 100,
      location: "",
    });
  };

  const handleUSSDUpdate = () => {
    const survival = selectedFarmer.survivalRate;
    const daysOld = Math.floor(
      (new Date().getTime() - new Date(selectedFarmer.plantingDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    alert(`📱 USSD Carbon Credit Update:

🌳 ${selectedFarmer.farmerName}'s Trees:
Planted: ${selectedFarmer.treesPlanted} ${selectedFarmer.treeSpecies}
Age: ${Math.floor(daysOld / 30)} months
Survival Rate: ${survival > 0 ? survival + "%" : "Monitoring"}

💰 Current Value:
Market Price: $${marketData.currentPrice.toFixed(2)}/credit
Your Credits: ${selectedFarmer.carbonCreditsPotential.toFixed(1)} potential
Est. Value: $${(selectedFarmer.carbonCreditsPotential * marketData.currentPrice).toFixed(2)}

${survival > 80 ? "🎯 Excellent survival rate!" : survival > 0 ? "📈 Good progress, keep monitoring" : "🌱 Early growth phase"}

Reply 1 for market prices
Reply 2 for planting tips`);
  };

  const treeSpeciesOptions = [
    {
      name: "Acacia melanoxylon",
      creditRate: 0.083,
      description: "Fast-growing, drought resistant",
    },
    {
      name: "Grevillea robusta",
      creditRate: 0.092,
      description: "High carbon sequestration",
    },
    {
      name: "Melia volkensii",
      creditRate: 0.091,
      description: "Native species, good survival",
    },
    {
      name: "Eucalyptus saligna",
      creditRate: 0.089,
      description: "Rapid growth, commercial value",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-800">
                  Carbon Credit Micro-Exchanges
                </CardTitle>
                <p className="text-sm text-green-600">
                  Smallholder carbon farming with blockchain verification
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ${marketData.currentPrice.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                per carbon credit
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="farmers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="farmers">My Plantings</TabsTrigger>
              <TabsTrigger value="register">Register Trees</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="verification">
                Satellite Verification
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farmers" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-800">
                    Your Tree Plantings
                  </h3>
                  {treePlantings.map((planting, index) => (
                    <Card
                      key={planting.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedFarmer.id === planting.id
                          ? "ring-2 ring-green-500"
                          : ""
                      }`}
                      onClick={() => setSelectedFarmer(planting)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {planting.farmerName}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                planting.verificationStatus === "Credited"
                                  ? "bg-green-100 text-green-700"
                                  : planting.verificationStatus === "Matured"
                                    ? "bg-blue-100 text-blue-700"
                                    : planting.verificationStatus === "Verified"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {planting.verificationStatus}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {planting.location}
                          </p>
                          <div className="text-xs">
                            <div className="flex justify-between">
                              <span>Trees:</span>
                              <span className="font-medium">
                                {planting.treesPlanted}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Species:</span>
                              <span className="font-medium">
                                {planting.treeSpecies.split(" ")[0]}
                              </span>
                            </div>
                            {planting.survivalRate > 0 && (
                              <div className="flex justify-between">
                                <span>Survival:</span>
                                <span className="font-medium text-green-600">
                                  {planting.survivalRate}%
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Credits:</span>
                              <span className="font-medium">
                                {planting.carbonCreditsPotential.toFixed(1)}
                              </span>
                            </div>
                            {planting.payoutEarned > 0 && (
                              <div className="flex justify-between">
                                <span>Earned:</span>
                                <span className="font-medium text-green-600">
                                  ${planting.payoutEarned}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedFarmer.farmerName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedFarmer.location}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedFarmer.verificationStatus === "Credited"
                              ? "bg-green-100 text-green-700"
                              : selectedFarmer.verificationStatus === "Matured"
                                ? "bg-blue-100 text-blue-700"
                                : selectedFarmer.verificationStatus ===
                                    "Verified"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedFarmer.verificationStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedFarmer.treesPlanted}
                          </div>
                          <div className="text-muted-foreground">
                            Trees Planted
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedFarmer.survivalRate > 0
                              ? selectedFarmer.survivalRate + "%"
                              : "TBD"}
                          </div>
                          <div className="text-muted-foreground">
                            Survival Rate
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedFarmer.carbonCreditsPotential.toFixed(1)}
                          </div>
                          <div className="text-muted-foreground">
                            Carbon Credits
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">
                            ${selectedFarmer.payoutEarned.toFixed(2)}
                          </div>
                          <div className="text-muted-foreground">Earned</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium mb-2">
                              Planting Details
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Species:</span>
                                <span className="font-medium">
                                  {selectedFarmer.treeSpecies}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Planted:</span>
                                <span className="font-medium">
                                  {selectedFarmer.plantingDate}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Age:</span>
                                <span className="font-medium">
                                  {Math.floor(
                                    (new Date().getTime() -
                                      new Date(
                                        selectedFarmer.plantingDate,
                                      ).getTime()) /
                                      (1000 * 60 * 60 * 24 * 30),
                                  )}{" "}
                                  months
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-2">
                              Carbon Impact
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>CO² Sequestered:</span>
                                <span className="font-medium">
                                  {(
                                    selectedFarmer.carbonCreditsPotential * 1000
                                  ).toFixed(0)}
                                  kg
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Market Value:</span>
                                <span className="font-medium text-green-600">
                                  $
                                  {(
                                    selectedFarmer.carbonCreditsPotential *
                                    marketData.currentPrice
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Next Payout:</span>
                                <span className="font-medium">
                                  {selectedFarmer.verificationStatus ===
                                  "Matured"
                                    ? "Available"
                                    : selectedFarmer.verificationStatus ===
                                        "Verified"
                                      ? "12 months"
                                      : "18+ months"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedFarmer.survivalRate > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Tree Survival Progress:</span>
                              <span className="font-medium">
                                {selectedFarmer.survivalRate}% surviving
                              </span>
                            </div>
                            <Progress
                              value={selectedFarmer.survivalRate}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleUSSDUpdate}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Smartphone className="mr-2 h-4 w-4" />
                            Get USSD Update
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Satellite className="mr-2 h-4 w-4" />
                            View Satellite Images
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Register New Tree Planting
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Earn $0.50 per surviving tree at 2 years with satellite
                      verification
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tree Species
                        </label>
                        <div className="space-y-2">
                          {treeSpeciesOptions.map((species) => (
                            <Card
                              key={species.name}
                              className={`p-3 cursor-pointer transition-all duration-200 ${
                                newPlanting.treeSpecies === species.name
                                  ? "ring-2 ring-green-500 bg-green-50"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                setNewPlanting((prev) => ({
                                  ...prev,
                                  treeSpecies: species.name,
                                }))
                              }
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-sm">
                                    {species.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {species.description}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-600">
                                    {species.creditRate}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    credits/tree
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Number of Trees
                        </label>
                        <Input
                          type="number"
                          value={newPlanting.treesPlanted}
                          onChange={(e) =>
                            setNewPlanting((prev) => ({
                              ...prev,
                              treesPlanted: parseInt(e.target.value) || 0,
                            }))
                          }
                          min="1"
                          max="1000"
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 10 trees, maximum 1000 per registration
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Planting Location
                        </label>
                        <Input
                          value={newPlanting.location}
                          onChange={(e) =>
                            setNewPlanting((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="e.g., Nakuru County, Njoro Sub-county, Plot 123"
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Provide detailed location for satellite verification
                        </p>
                      </div>

                      <Button
                        onClick={registerPlanting}
                        disabled={
                          !newPlanting.location.trim() ||
                          newPlanting.treesPlanted < 10
                        }
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <TreePine className="mr-2 h-4 w-4" />
                        Register Tree Planting
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card className="p-4 bg-blue-50 border-blue-200">
                        <div className="text-center space-y-3">
                          <Target className="h-8 w-8 text-blue-600 mx-auto" />
                          <h4 className="font-semibold text-blue-800">
                            Estimated Returns
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {(newPlanting.treesPlanted * 0.5).toFixed(2)}
                              </div>
                              <div className="text-muted-foreground">
                                USD at 2 years
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {(newPlanting.treesPlanted * 0.083).toFixed(1)}
                              </div>
                              <div className="text-muted-foreground">
                                Carbon credits
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-green-50 border-green-200">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Satellite className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-800">
                              Verification Process
                            </h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Satellite monitoring every 6 months</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Blockchain registry of tree survival</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Automatic payout for verified trees</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>USSD progress notifications</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-amber-50 border-amber-200">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-amber-600" />
                            <h4 className="font-semibold text-amber-800 text-sm">
                              Requirements
                            </h4>
                          </div>
                          <div className="space-y-1 text-xs text-amber-700">
                            <div>
                              • Land ownership or usage rights documentation
                            </div>
                            <div>
                              • GPS coordinates for satellite monitoring
                            </div>
                            <div>• Mobile number for USSD updates</div>
                            <div>• Species appropriate for local climate</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${marketData.currentPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current Price
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {marketData.volume24h.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    24h Volume
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {marketData.totalCreditsTraded.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Traded
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {marketData.activeFarmers}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active Farmers
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-800">
                      Recent Transactions
                    </h3>
                    <div className="space-y-3">
                      {carbonCredits.map((credit) => (
                        <Card
                          key={credit.id}
                          className="p-3 bg-green-50 border-green-200"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Carbon Credits: {credit.creditTokens}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                $
                                {(
                                  credit.creditTokens * credit.marketPrice
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <div>Farmer: {credit.farmerId}</div>
                              <div>Buyer: {credit.buyer}</div>
                              <div>Date: {credit.transactionDate}</div>
                            </div>
                            <div className="text-xs font-mono text-blue-600">
                              Tx: {credit.blockchainTxHash?.slice(0, 20)}...
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-800">
                      Market Insights
                    </h3>
                    <div className="space-y-3">
                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-blue-800 text-sm">
                              Price Trend
                            </h4>
                            <p className="text-xs text-blue-600">
                              +12% this month due to increased corporate demand
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-purple-50 border-purple-200">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-purple-800 text-sm">
                              Top Buyers
                            </h4>
                            <p className="text-xs text-purple-600">
                              Microsoft, Kenya Airways, Safaricom leading
                              purchases
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-green-50 border-green-200">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-green-800 text-sm">
                              Regional Focus
                            </h4>
                            <p className="text-xs text-green-600">
                              Central Kenya showing highest tree survival rates
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Satellite Verification System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain-verified tree survival monitoring using satellite
                  imagery
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Satellite className="h-6 w-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">
                        Verification Process
                      </h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          1
                        </div>
                        <div>
                          <div className="font-medium">
                            Satellite Image Capture
                          </div>
                          <div className="text-muted-foreground">
                            Every 6 months using high-resolution imagery
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                          2
                        </div>
                        <div>
                          <div className="font-medium">AI Tree Detection</div>
                          <div className="text-muted-foreground">
                            Computer vision counts surviving trees
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">
                          3
                        </div>
                        <div>
                          <div className="font-medium">Blockchain Registry</div>
                          <div className="text-muted-foreground">
                            Results recorded immutably on-chain
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-medium text-amber-600">
                          4
                        </div>
                        <div>
                          <div className="font-medium">Automatic Payout</div>
                          <div className="text-muted-foreground">
                            Smart contracts release payments
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-6 w-6 text-green-600" />
                      <h4 className="font-semibold text-green-800">
                        Verification Schedule
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          month: 6,
                          status: "Completed",
                          trees: 142,
                          survival: 94,
                        },
                        {
                          month: 12,
                          status: "Completed",
                          trees: 138,
                          survival: 92,
                        },
                        {
                          month: 18,
                          status: "Completed",
                          trees: 134,
                          survival: 89,
                        },
                        {
                          month: 24,
                          status: "Pending",
                          trees: "TBD",
                          survival: "TBD",
                        },
                      ].map((check, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="text-sm">
                            <div className="font-medium">
                              Month {check.month} Check
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Trees: {check.trees} • Survival: {check.survival}%
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              check.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      Transparency & Trust
                    </h4>
                    <p className="text-sm text-blue-600">
                      All verification data is publicly available on the
                      blockchain, ensuring complete transparency and trust in
                      the carbon credit system
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300"
                  >
                    View Blockchain
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
