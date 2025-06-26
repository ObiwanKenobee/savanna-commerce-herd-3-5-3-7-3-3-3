import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  CloudRain,
  TrendingDown,
  Shield,
  Users,
  Globe,
  Zap,
  Heart,
  Award,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

interface DroughtPolicy {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  cropType: string;
  seedCost: number;
  premiumPaid: number;
  coverageAmount: number;
  rainfallThreshold: number;
  status: "Active" | "Claim Pending" | "Paid Out" | "Expired";
  actualRainfall?: number;
  payoutAmount?: number;
  contractAddress: string;
}

interface RefugeeSkill {
  id: string;
  refugeeName: string;
  camp: string;
  skillCategory:
    | "Traditional Crafts"
    | "Technology"
    | "Agriculture"
    | "Education"
    | "Healthcare";
  specificSkill: string;
  experienceYears: number;
  certificationLevel: "Basic" | "Intermediate" | "Expert" | "Master";
  productsAvailable: number;
  monthlyEarnings: number;
  globalBuyers: number;
  ethicalScore: number;
}

const droughtPolicies: DroughtPolicy[] = [
  {
    id: "policy-001",
    farmerId: "farmer-001",
    farmerName: "Joseph Mwangi",
    location: "Machakos County",
    cropType: "Maize",
    seedCost: 150,
    premiumPaid: 7.5,
    coverageAmount: 150,
    rainfallThreshold: 50,
    status: "Paid Out",
    actualRainfall: 35,
    payoutAmount: 150,
    contractAddress: "0x742d35cc4200b9f5c0e2c3a1234567890abcdef",
  },
  {
    id: "policy-002",
    farmerId: "farmer-002",
    farmerName: "Grace Nyaboke",
    location: "Turkana County",
    cropType: "Sorghum",
    seedCost: 200,
    premiumPaid: 10,
    coverageAmount: 200,
    rainfallThreshold: 50,
    status: "Active",
    contractAddress: "0x851e46dd5300c8a6d0f3d4b5678901234abcdef",
  },
  {
    id: "policy-003",
    farmerId: "farmer-003",
    farmerName: "Peter Kiptoo",
    location: "Samburu County",
    cropType: "Beans",
    seedCost: 120,
    premiumPaid: 6,
    coverageAmount: 120,
    rainfallThreshold: 50,
    status: "Claim Pending",
    actualRainfall: 42,
    contractAddress: "0x963f57ee6400d9a7e0g4e5f6789012345bcdefgh",
  },
];

const refugeeSkills: RefugeeSkill[] = [
  {
    id: "refugee-001",
    refugeeName: "Amina Hassan",
    camp: "Kakuma Refugee Camp",
    skillCategory: "Traditional Crafts",
    specificSkill: "Somali Textile Weaving",
    experienceYears: 15,
    certificationLevel: "Master",
    productsAvailable: 23,
    monthlyEarnings: 180,
    globalBuyers: 12,
    ethicalScore: 98,
  },
  {
    id: "refugee-002",
    refugeeName: "Jean Baptiste",
    camp: "Kakuma Refugee Camp",
    skillCategory: "Technology",
    specificSkill: "Solar Panel Assembly",
    experienceYears: 8,
    certificationLevel: "Expert",
    productsAvailable: 15,
    monthlyEarnings: 245,
    globalBuyers: 8,
    ethicalScore: 95,
  },
  {
    id: "refugee-003",
    refugeeName: "Nyankol Deng",
    camp: "Dadaab Refugee Complex",
    skillCategory: "Traditional Crafts",
    specificSkill: "Dinka Beadwork",
    experienceYears: 12,
    certificationLevel: "Expert",
    productsAvailable: 31,
    monthlyEarnings: 160,
    globalBuyers: 15,
    ethicalScore: 96,
  },
];

export const CrisisToOpportunity = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<DroughtPolicy>(
    droughtPolicies[0],
  );
  const [selectedRefugee, setSelectedRefugee] = useState<RefugeeSkill>(
    refugeeSkills[0],
  );
  const [newPolicy, setNewPolicy] = useState({
    cropType: "Maize",
    seedCost: 150,
    premiumRate: 5,
    location: "",
  });
  const [liveWeatherData, setLiveWeatherData] = useState({
    currentRainfall: 45,
    forecastReliability: 89,
    riskLevel: "Medium",
    affectedFarms: 1240,
  });

  // Simulate weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWeatherData((prev) => ({
        ...prev,
        currentRainfall: Math.max(
          0,
          prev.currentRainfall + (Math.random() - 0.5) * 10,
        ),
        forecastReliability: Math.max(
          80,
          Math.min(95, prev.forecastReliability + (Math.random() - 0.5) * 5),
        ),
        affectedFarms:
          prev.affectedFarms + Math.floor((Math.random() - 0.5) * 100),
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const purchasePolicy = () => {
    if (!newPolicy.location.trim()) return;

    const premiumAmount = (
      (newPolicy.seedCost * newPolicy.premiumRate) /
      100
    ).toFixed(2);

    alert(`🌧️ Drought Prediction Policy Purchased!

📋 Policy Details:
Crop: ${newPolicy.cropType}
Seed Investment: $${newPolicy.seedCost}
Premium: $${premiumAmount} (${newPolicy.premiumRate}%)
Location: ${newPolicy.location}

🛰️ NASA FIRMS verification enabled
📊 Payout if rainfall < 50mm
⚡ Smart contract deployed
🔗 Blockchain: Stellar Network

Policy ID: DROUGHT-${Date.now().toString().slice(-6)}

✅ Your farm is now protected against drought!`);

    setNewPolicy({
      cropType: "Maize",
      seedCost: 150,
      premiumRate: 5,
      location: "",
    });
  };

  const connectRefugeeSkills = () => {
    alert(`🌍 Connected to Global Ethical Marketplace!

👥 Kakuma Camp Talent Hub Access:
• 2,847 skilled artisans verified
• 15 traditional craft categories
• 8 modern skill categories
• Direct payment via Stellar blockchain

🎯 Featured Skills Available:
• Textile weaving & traditional garments
• Solar technology & assembly
• Beadwork & jewelry
• Mobile repair & programming
• Organic farming techniques

💫 Impact:
✅ Cross-border payments processed
🌟 Ethical buyer verification active
📈 Skills development programs running
🤝 Direct artisan-to-buyer connection

Browse artisans at savannah.org/refugee-marketplace`);
  };

  const contractCode = `// Drought Risk Smart Contract
pragma solidity ^0.8.0;

contract DroughtInsurance {
    struct Policy {
        address farmer;
        uint256 coverageAmount;
        uint256 rainfallThreshold; // in mm
        uint256 premiumPaid;
        bool active;
    }

    mapping(address => Policy) public policies;

    function releasePayout(
        address farmer,
        uint rainfallMM
    ) public onlyNASAOracle {
        Policy storage policy = policies[farmer];
        require(policy.active, "Policy not active");

        if (rainfallMM < policy.rainfallThreshold) {
            // Transfer coverage amount via M-Pesa API
            mpesa.send(farmer, policy.coverageAmount);
            policy.active = false;

            emit PayoutReleased(
                farmer,
                policy.coverageAmount,
                rainfallMM
            );
        }
    }
}`;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-red-800">
                  Crisis-to-Opportunity (C2O) Protocols
                </CardTitle>
                <p className="text-sm text-red-600">
                  Transforming crises into economic opportunities
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              Active Protection
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="drought-insurance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="drought-insurance">
                Drought Prediction Markets
              </TabsTrigger>
              <TabsTrigger value="refugee-skills">
                Refugee Skills Matching
              </TabsTrigger>
              <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="drought-insurance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {liveWeatherData.currentRainfall.toFixed(0)}mm
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current Rainfall
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {liveWeatherData.forecastReliability.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Forecast Accuracy
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div
                    className={`text-2xl font-bold ${
                      liveWeatherData.riskLevel === "High"
                        ? "text-red-600"
                        : liveWeatherData.riskLevel === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {liveWeatherData.riskLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Risk Level
                  </div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {liveWeatherData.affectedFarms.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Farms Monitored
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-800">
                      Purchase Drought Insurance
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Crop Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Maize", "Beans", "Sorghum", "Millet"].map(
                            (crop) => (
                              <Button
                                key={crop}
                                variant={
                                  newPolicy.cropType === crop
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setNewPolicy((prev) => ({
                                    ...prev,
                                    cropType: crop,
                                  }))
                                }
                                className="text-xs"
                              >
                                {crop}
                              </Button>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Seed Investment ($)
                        </label>
                        <Input
                          type="number"
                          value={newPolicy.seedCost}
                          onChange={(e) =>
                            setNewPolicy((prev) => ({
                              ...prev,
                              seedCost: parseInt(e.target.value) || 0,
                            }))
                          }
                          min="50"
                          max="1000"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Premium Rate (%)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[3, 5, 7].map((rate) => (
                            <Button
                              key={rate}
                              variant={
                                newPolicy.premiumRate === rate
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setNewPolicy((prev) => ({
                                  ...prev,
                                  premiumRate: rate,
                                }))
                              }
                              className="text-xs"
                            >
                              {rate}%
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Premium: $
                          {(
                            (newPolicy.seedCost * newPolicy.premiumRate) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Farm Location
                        </label>
                        <Input
                          value={newPolicy.location}
                          onChange={(e) =>
                            setNewPolicy((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="e.g., Machakos County, Kangundo"
                        />
                      </div>

                      <Button
                        onClick={purchasePolicy}
                        disabled={!newPolicy.location.trim()}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Purchase Drought Protection
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-800">
                      Active Policies
                    </h3>

                    <div className="space-y-3">
                      {droughtPolicies.map((policy, index) => (
                        <Card
                          key={policy.id}
                          className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedPolicy.id === policy.id
                              ? "ring-2 ring-red-500"
                              : ""
                          }`}
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {policy.farmerName}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  policy.status === "Paid Out"
                                    ? "bg-green-100 text-green-700"
                                    : policy.status === "Claim Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : policy.status === "Active"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {policy.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {policy.location} • {policy.cropType}
                            </p>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Coverage:</span>
                                <span className="font-medium">
                                  ${policy.coverageAmount}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Premium:</span>
                                <span className="font-medium">
                                  ${policy.premiumPaid}
                                </span>
                              </div>
                              {policy.actualRainfall !== undefined && (
                                <div className="flex justify-between">
                                  <span>Rainfall:</span>
                                  <span
                                    className={`font-medium ${policy.actualRainfall < policy.rainfallThreshold ? "text-red-600" : "text-green-600"}`}
                                  >
                                    {policy.actualRainfall}mm
                                  </span>
                                </div>
                              )}
                              {policy.payoutAmount && (
                                <div className="flex justify-between">
                                  <span>Payout:</span>
                                  <span className="font-medium text-green-600">
                                    ${policy.payoutAmount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="h-6 w-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">
                      NASA FIRMS Verification
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="font-medium">Satellite Monitoring</div>
                      <div className="text-muted-foreground">
                        Real-time rainfall measurement via NASA Fire Information
                        for Resource Management System
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Automated Payouts</div>
                      <div className="text-muted-foreground">
                        Smart contracts automatically release payments when
                        rainfall falls below threshold
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">M-Pesa Integration</div>
                      <div className="text-muted-foreground">
                        Direct mobile money payouts to farmer accounts within 24
                        hours
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="refugee-skills" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-800">
                    Kakuma Talent Hub
                  </h3>
                  {refugeeSkills.map((refugee, index) => (
                    <Card
                      key={refugee.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedRefugee.id === refugee.id
                          ? "ring-2 ring-red-500"
                          : ""
                      }`}
                      onClick={() => setSelectedRefugee(refugee)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {refugee.refugeeName}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                refugee.certificationLevel === "Master"
                                  ? "bg-purple-100 text-purple-700"
                                  : refugee.certificationLevel === "Expert"
                                    ? "bg-blue-100 text-blue-700"
                                    : refugee.certificationLevel ===
                                        "Intermediate"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {refugee.certificationLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {refugee.camp}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="font-medium">
                              {refugee.specificSkill}
                            </div>
                            <div className="flex justify-between">
                              <span>Experience:</span>
                              <span className="font-medium">
                                {refugee.experienceYears} years
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Products:</span>
                              <span className="font-medium">
                                {refugee.productsAvailable}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly:</span>
                              <span className="font-medium text-green-600">
                                ${refugee.monthlyEarnings}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ethical Score:</span>
                              <span className="font-medium text-blue-600">
                                {refugee.ethicalScore}%
                              </span>
                            </div>
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
                            {selectedRefugee.refugeeName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedRefugee.camp} •{" "}
                            {selectedRefugee.skillCategory}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedRefugee.certificationLevel === "Master"
                              ? "bg-purple-100 text-purple-700"
                              : selectedRefugee.certificationLevel === "Expert"
                                ? "bg-blue-100 text-blue-700"
                                : selectedRefugee.certificationLevel ===
                                    "Intermediate"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedRefugee.certificationLevel} Level
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedRefugee.experienceYears}
                          </div>
                          <div className="text-muted-foreground">
                            Years Experience
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${selectedRefugee.monthlyEarnings}
                          </div>
                          <div className="text-muted-foreground">
                            Monthly Earnings
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedRefugee.globalBuyers}
                          </div>
                          <div className="text-muted-foreground">
                            Global Buyers
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedRefugee.ethicalScore}%
                          </div>
                          <div className="text-muted-foreground">
                            Ethical Score
                          </div>
                        </div>
                      </div>

                      <Card className="p-3 bg-green-50 border-green-200">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-800 flex items-center">
                            <Award className="mr-2 h-4 w-4" />
                            Skill Specialty: {selectedRefugee.specificSkill}
                          </h4>
                          <div className="text-sm text-green-600">
                            <div>
                              🎯 {selectedRefugee.productsAvailable} products
                              currently available
                            </div>
                            <div>
                              🌍 Selling to {selectedRefugee.globalBuyers}{" "}
                              international buyers
                            </div>
                            <div>
                              ⭐ {selectedRefugee.ethicalScore}% ethical
                              sourcing score
                            </div>
                            <div>
                              💫 Cross-border payments via Stellar blockchain
                            </div>
                          </div>
                        </div>
                      </Card>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Skill Development Progress:</span>
                          <span className="font-medium">
                            {selectedRefugee.certificationLevel}
                          </span>
                        </div>
                        <Progress
                          value={
                            selectedRefugee.certificationLevel === "Master"
                              ? 100
                              : selectedRefugee.certificationLevel === "Expert"
                                ? 80
                                : selectedRefugee.certificationLevel ===
                                    "Intermediate"
                                  ? 60
                                  : 40
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="p-3 bg-blue-50 border-blue-200">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-blue-800 text-sm">
                                Global Market Access
                              </h4>
                              <p className="text-xs text-blue-600">
                                Direct sales to ethical buyers worldwide
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-3 bg-purple-50 border-purple-200">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <div>
                              <h4 className="font-medium text-purple-800 text-sm">
                                Blockchain Payments
                              </h4>
                              <p className="text-xs text-purple-600">
                                Instant cross-border transactions
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <Button
                        onClick={connectRefugeeSkills}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Connect to Refugee Marketplace
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Card className="p-4 text-center bg-green-50 border-green-200">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      2,847
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Skilled Artisans
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Across 3 camps
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-4 text-center bg-blue-50 border-blue-200">
                    <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">47</div>
                    <div className="text-sm text-muted-foreground">
                      Countries
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Ethical buyers
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-4 text-center bg-purple-50 border-purple-200">
                    <ArrowUpRight className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      $127K
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Direct to artisans
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="smart-contracts" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Crisis Response Smart Contracts
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Automated crisis detection and opportunity activation via
                      blockchain
                    </p>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                    <pre>{contractCode}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CloudRain className="h-6 w-6 text-blue-600" />
                          <h4 className="font-semibold text-blue-800">
                            Drought Insurance Contract
                          </h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Network:</span>
                            <span className="font-medium">Stellar</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Oracle:</span>
                            <span className="font-medium">NASA FIRMS</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payout Method:</span>
                            <span className="font-medium">M-Pesa</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Policies:</span>
                            <span className="font-medium">
                              {droughtPolicies.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-6 w-6 text-purple-600" />
                          <h4 className="font-semibold text-purple-800">
                            Refugee Skills Marketplace
                          </h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Payment Network:</span>
                            <span className="font-medium">Stellar</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Verification:</span>
                            <span className="font-medium">UNHCR</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Escrow:</span>
                            <span className="font-medium">Smart Contract</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Artisans:</span>
                            <span className="font-medium">
                              {refugeeSkills.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                        <h4 className="font-semibold text-amber-800">
                          Crisis Detection Triggers
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="font-medium">Automated Triggers:</div>
                          <div className="space-y-1 text-amber-700">
                            <div>• Rainfall &lt; 50mm (drought insurance)</div>
                            <div>
                              • Market volatility &gt; 30% (price stabilization)
                            </div>
                            <div>• Displacement events (skills activation)</div>
                            <div>
                              • Supply chain disruption (alternative routing)
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Response Actions:</div>
                          <div className="space-y-1 text-amber-700">
                            <div>• Immediate payout release</div>
                            <div>• Skills marketplace activation</div>
                            <div>• Alternative supply route generation</div>
                            <div>• Community notification system</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800">
                      Anti-Fragile Design
                    </h4>
                    <p className="text-sm text-red-600">
                      Crisis events automatically trigger opportunity
                      activation, creating a system that thrives on shocks
                      rather than breaking
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300"
                  >
                    View Architecture
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
