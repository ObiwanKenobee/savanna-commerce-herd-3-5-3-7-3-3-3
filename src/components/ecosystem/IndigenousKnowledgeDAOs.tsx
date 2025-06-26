import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown,
  Star,
  TrendingUp,
  Brain,
  Coins,
  Users,
  BookOpen,
  Award,
  Globe,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";

interface Elder {
  id: string;
  name: string;
  tribe: string;
  specialization: string;
  wisdomScore: number;
  totalEarned: number;
  contributedInsights: number;
  verificationLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  avatar: string;
}

interface WisdomInsight {
  id: string;
  elder: string;
  tribe: string;
  insight: string;
  category:
    | "Migration"
    | "Weather"
    | "Medicinal Plants"
    | "Water Sources"
    | "Seasonal Patterns";
  aiAccuracy: number;
  royaltiesEarned: number;
  usageCount: number;
  verified: boolean;
  dateSubmitted: string;
}

const elders: Elder[] = [
  {
    id: "elder-001",
    name: "Mzee Ole Sankale",
    tribe: "Maasai",
    specialization: "Migration Patterns",
    wisdomScore: 98,
    totalEarned: 2450,
    contributedInsights: 47,
    verificationLevel: "Platinum",
    avatar: "👴🏿",
  },
  {
    id: "elder-002",
    name: "Mama Wanjiru",
    tribe: "Kikuyu",
    specialization: "Medicinal Plants",
    wisdomScore: 95,
    totalEarned: 1875,
    contributedInsights: 32,
    verificationLevel: "Gold",
    avatar: "👵🏿",
  },
  {
    id: "elder-003",
    name: "Chief Odhiambo",
    tribe: "Luo",
    specialization: "Weather Prediction",
    wisdomScore: 92,
    totalEarned: 1654,
    contributedInsights: 28,
    verificationLevel: "Gold",
    avatar: "👨🏿‍🦳",
  },
];

const insights: WisdomInsight[] = [
  {
    id: "insight-001",
    elder: "Mzee Ole Sankale",
    tribe: "Maasai",
    insight:
      "When the acacia trees flower early and the dung beetles move in circles, the wildebeest will change their migration route to avoid the eastern corridor.",
    category: "Migration",
    aiAccuracy: 94,
    royaltiesEarned: 385,
    usageCount: 127,
    verified: true,
    dateSubmitted: "2024-01-15",
  },
  {
    id: "insight-002",
    elder: "Mama Wanjiru",
    tribe: "Kikuyu",
    insight:
      "The medicinal properties of Prunus africana increase by 40% when harvested during the full moon in the dry season, but only from trees growing above 2000m elevation.",
    category: "Medicinal Plants",
    aiAccuracy: 89,
    royaltiesEarned: 245,
    usageCount: 83,
    verified: true,
    dateSubmitted: "2024-02-08",
  },
  {
    id: "insight-003",
    elder: "Chief Odhiambo",
    tribe: "Luo",
    insight:
      "When the lake birds fly in specific V-formations toward the western hills, heavy rains will come within 72 hours, affecting 15km radius farmland.",
    category: "Weather",
    aiAccuracy: 91,
    royaltiesEarned: 312,
    usageCount: 96,
    verified: true,
    dateSubmitted: "2024-02-20",
  },
];

export const IndigenousKnowledgeDAOs = () => {
  const [selectedElder, setSelectedElder] = useState<Elder>(elders[0]);
  const [newInsight, setNewInsight] = useState("");
  const [insightCategory, setInsightCategory] =
    useState<WisdomInsight["category"]>("Migration");
  const [wisdomStats, setWisdomStats] = useState({
    totalInsights: 247,
    verifiedElders: 23,
    aiModelAccuracy: 87,
    totalRoyaltiesPaid: 15670,
  });

  const submitInsight = () => {
    if (!newInsight.trim()) return;

    alert(
      `🏛️ Wisdom Submitted to DAO!\n\n📝 Insight: "${newInsight.substring(0, 50)}..."\n🏷️ Category: ${insightCategory}\n\n⏳ Your wisdom is being verified by the community\n💰 Potential earnings: 50-500 tokens\n🤖 AI model training scheduled\n\n✅ You will receive royalties when your wisdom improves AI predictions!`,
    );

    setNewInsight("");
    setWisdomStats((prev) => ({
      ...prev,
      totalInsights: prev.totalInsights + 1,
    }));
  };

  const contractCode = `// Maasai Tracking Wisdom Smart Contract
pragma solidity ^0.8.0;

contract WisdomRoyalties {
    struct Elder {
        address wallet;
        string name;
        string tribe;
        uint256 wisdomScore;
        bool verified;
    }
    
    mapping(address => Elder) public elders;
    mapping(string => uint256) public insightRoyalties;
    
    function recordWisdom(string memory insight) public {
        require(elders[msg.sender].verified, "Elder not verified");
        
        // Mint insight NFT
        uint256 insightId = mint(insightNFT, 100);
        insightRoyalties[insight] = insightId;
        
        // Award initial tokens
        _mint(msg.sender, 100);
        
        emit WisdomRecorded(msg.sender, insight, insightId);
    }
    
    function payRoyalties(string memory insight, uint256 aiAccuracy) public {
        address elder = getInsightOwner(insight);
        uint256 royalty = calculateRoyalty(aiAccuracy);
        
        _mint(elder, royalty);
        
        emit RoyaltyPaid(elder, insight, royalty);
    }
}`;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-amber-800">
                  Indigenous Knowledge DAOs
                </CardTitle>
                <p className="text-sm text-amber-600">
                  Tokenizing traditional wisdom for AI model enhancement
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {wisdomStats.verifiedElders} Verified Elders
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elders" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elders">Elder Council</TabsTrigger>
              <TabsTrigger value="wisdom">Wisdom Bank</TabsTrigger>
              <TabsTrigger value="submit">Submit Wisdom</TabsTrigger>
              <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="elders" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-amber-800">
                    Elder Council
                  </h3>
                  {elders.map((elder, index) => (
                    <Card
                      key={elder.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedElder.id === elder.id
                          ? "ring-2 ring-amber-500"
                          : ""
                      }`}
                      onClick={() => setSelectedElder(elder)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{elder.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {elder.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  elder.verificationLevel === "Platinum"
                                    ? "border-purple-300 text-purple-700"
                                    : elder.verificationLevel === "Gold"
                                      ? "border-yellow-300 text-yellow-700"
                                      : elder.verificationLevel === "Silver"
                                        ? "border-gray-300 text-gray-700"
                                        : "border-orange-300 text-orange-700"
                                }`}
                              >
                                {elder.verificationLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {elder.tribe} • {elder.specialization}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Star className="h-3 w-3 text-amber-500" />
                              <span className="text-xs font-medium">
                                {elder.wisdomScore}/100
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
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{selectedElder.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedElder.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedElder.tribe} Elder •{" "}
                            {selectedElder.specialization}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedElder.verificationLevel === "Platinum"
                              ? "bg-purple-100 text-purple-700"
                              : selectedElder.verificationLevel === "Gold"
                                ? "bg-yellow-100 text-yellow-700"
                                : selectedElder.verificationLevel === "Silver"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {selectedElder.verificationLevel} Elder
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">
                            {selectedElder.wisdomScore}
                          </div>
                          <div className="text-muted-foreground">
                            Wisdom Score
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${selectedElder.totalEarned}
                          </div>
                          <div className="text-muted-foreground">
                            Total Earned
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedElder.contributedInsights}
                          </div>
                          <div className="text-muted-foreground">
                            Insights Shared
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {insights
                              .filter((i) => i.elder === selectedElder.name)
                              .reduce((sum, i) => sum + i.usageCount, 0)}
                          </div>
                          <div className="text-muted-foreground">
                            AI Model Uses
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">
                          Recent Wisdom Contributions:
                        </h4>
                        {insights
                          .filter((i) => i.elder === selectedElder.name)
                          .map((insight) => (
                            <Card
                              key={insight.id}
                              className="p-3 bg-amber-50 border-amber-200"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {insight.category}
                                  </Badge>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>
                                      {insight.aiAccuracy}% AI accuracy
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm">{insight.insight}</p>
                                <div className="flex justify-between text-xs">
                                  <span>Used {insight.usageCount} times</span>
                                  <span className="font-medium text-green-600">
                                    ${insight.royaltiesEarned} earned
                                  </span>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wisdom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                          {insight.verified && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 text-xs"
                            >
                              ✓ Verified
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm line-clamp-3">
                          {insight.insight}
                        </p>

                        <div className="flex items-center space-x-2 text-xs">
                          <span>{insight.elder}</span>
                          <span>•</span>
                          <span>{insight.tribe}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>AI Accuracy:</span>
                            <span className="font-semibold text-blue-600">
                              {insight.aiAccuracy}%
                            </span>
                          </div>
                          <Progress
                            value={insight.aiAccuracy}
                            className="h-1"
                          />

                          <div className="flex justify-between text-xs">
                            <span>Used in AI models:</span>
                            <span className="font-semibold">
                              {insight.usageCount} times
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span>Royalties earned:</span>
                            <span className="font-semibold text-green-600">
                              ${insight.royaltiesEarned}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <div className="text-center space-y-3">
                  <h4 className="font-semibold text-blue-800">
                    Wisdom Impact Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {wisdomStats.totalInsights}
                      </div>
                      <div className="text-muted-foreground">
                        Total Insights
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {wisdomStats.aiModelAccuracy}%
                      </div>
                      <div className="text-muted-foreground">
                        AI Model Accuracy
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {wisdomStats.verifiedElders}
                      </div>
                      <div className="text-muted-foreground">
                        Verified Elders
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        ${wisdomStats.totalRoyaltiesPaid}
                      </div>
                      <div className="text-muted-foreground">
                        Royalties Paid
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="submit" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Share Your Traditional Wisdom
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Contribute to the on-chain knowledge preservation and earn
                      royalties when your wisdom improves AI models
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Wisdom Category
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {[
                          "Migration",
                          "Weather",
                          "Medicinal Plants",
                          "Water Sources",
                          "Seasonal Patterns",
                        ].map((category) => (
                          <Button
                            key={category}
                            variant={
                              insightCategory === category
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setInsightCategory(
                                category as WisdomInsight["category"],
                              )
                            }
                            className="text-xs"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Traditional Wisdom
                      </label>
                      <Textarea
                        value={newInsight}
                        onChange={(e) => setNewInsight(e.target.value)}
                        placeholder="Share your traditional knowledge... For example: 'When the baobab trees start flowering and the weaver birds build their nests facing east, the long rains will arrive within 10 days...'"
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Detailed observations with specific conditions and
                        outcomes improve AI model accuracy and increase your
                        royalties
                      </p>
                    </div>

                    <Button
                      onClick={submitInsight}
                      disabled={!newInsight.trim()}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Submit Wisdom to DAO
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">
                        Earning Potential
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Initial submission:</span>
                        <span className="font-semibold">50-100 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification bonus:</span>
                        <span className="font-semibold">100-300 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI model improvement:</span>
                        <span className="font-semibold">5-50 tokens/use</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ongoing royalties:</span>
                        <span className="font-semibold">∞ potential</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">
                        Verification Process
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Community elder review</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>AI model testing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Field validation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>NFT minting & royalties</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="smart-contracts" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Wisdom Tokenization Smart Contract
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Blockchain implementation ensuring fair royalty
                      distribution to traditional knowledge holders
                    </p>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                    <pre>{contractCode}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-3 bg-purple-50 border-purple-200">
                      <div className="text-center space-y-2">
                        <Globe className="h-6 w-6 text-purple-600 mx-auto" />
                        <h4 className="font-semibold text-purple-800 text-sm">
                          Deployed Networks
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div>✅ Ethereum Mainnet</div>
                          <div>✅ Polygon</div>
                          <div>✅ Celo (Africa)</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="text-center space-y-2">
                        <Award className="h-6 w-6 text-green-600 mx-auto" />
                        <h4 className="font-semibold text-green-800 text-sm">
                          NFT Standards
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div>🎨 ERC-721 Insights</div>
                          <div>💎 ERC-1155 Royalties</div>
                          <div>🔐 IPFS Storage</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="text-center space-y-2">
                        <Users className="h-6 w-6 text-blue-600 mx-auto" />
                        <h4 className="font-semibold text-blue-800 text-sm">
                          DAO Governance
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div>🗳️ Elder voting rights</div>
                          <div>📊 Community validation</div>
                          <div>⚖️ Dispute resolution</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-800">
                          Cultural Preservation Impact
                        </h4>
                        <p className="text-sm text-amber-600">
                          Ensuring traditional knowledge is preserved, valued,
                          and fairly compensated in the digital age
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300"
                      >
                        Learn More
                      </Button>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
