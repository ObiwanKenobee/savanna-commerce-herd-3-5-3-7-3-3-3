import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Star,
  Users,
  Shield,
  Award,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  Archive,
} from "lucide-react";

interface KnowledgeNFT {
  id: string;
  title: string;
  contributor: string;
  tribe: string;
  category: "medicinal" | "agricultural" | "craft" | "spiritual" | "ecological";
  description: string;
  verificationStatus: "pending" | "verified" | "disputed";
  usageCount: number;
  royalties: number;
  mintDate: string;
  valueScore: number;
  culturalImportance: number;
}

interface VerificationLog {
  id: string;
  nftId: string;
  verifier: string;
  verifierRole: "elder" | "scholar" | "community-leader" | "expert";
  status: "approved" | "rejected" | "needs-revision";
  comments: string;
  timestamp: string;
  trustScore: number;
}

interface UsageLog {
  id: string;
  nftId: string;
  user: string;
  purpose: string;
  commercialUse: boolean;
  royaltyPaid: number;
  timestamp: string;
  outcome: "successful" | "pending" | "failed";
}

export const IndigenousKnowledge = () => {
  const [knowledgeNFTs, setKnowledgeNFTs] = useState<KnowledgeNFT[]>([
    {
      id: "nft-001",
      title: "Traditional Maize Storage Techniques",
      contributor: "Mama Grace Wanjiku",
      tribe: "Kikuyu",
      category: "agricultural",
      description:
        "Ancient methods for preserving maize using natural termite-resistant materials",
      verificationStatus: "verified",
      usageCount: 245,
      royalties: 1850,
      mintDate: "2024-01-15",
      valueScore: 95,
      culturalImportance: 90,
    },
    {
      id: "nft-002",
      title: "Baobab Tree Medicine Preparation",
      contributor: "Mzee Hassan Juma",
      tribe: "Maasai",
      category: "medicinal",
      description:
        "Traditional preparation of baobab bark and fruit for digestive health",
      verificationStatus: "verified",
      usageCount: 189,
      royalties: 2240,
      mintDate: "2024-01-20",
      valueScore: 98,
      culturalImportance: 95,
    },
    {
      id: "nft-003",
      title: "Water Harvesting in Arid Lands",
      contributor: "Elder John Kiprotich",
      tribe: "Turkana",
      category: "ecological",
      description:
        "Indigenous techniques for collecting and storing rainwater in dry regions",
      verificationStatus: "pending",
      usageCount: 67,
      royalties: 890,
      mintDate: "2024-02-01",
      valueScore: 87,
      culturalImportance: 88,
    },
    {
      id: "nft-004",
      title: "Goat Hide Tanning Process",
      contributor: "Mama Sarah Ng'ang'a",
      tribe: "Kamba",
      category: "craft",
      description:
        "Traditional leather processing using indigenous plants and minerals",
      verificationStatus: "verified",
      usageCount: 156,
      royalties: 1560,
      mintDate: "2024-01-10",
      valueScore: 92,
      culturalImportance: 85,
    },
    {
      id: "nft-005",
      title: "Sacred Grove Conservation",
      contributor: "Elder Mary Adhiambo",
      tribe: "Luo",
      category: "spiritual",
      description:
        "Traditional practices for protecting sacred forests and their biodiversity",
      verificationStatus: "disputed",
      usageCount: 34,
      royalties: 340,
      mintDate: "2024-02-05",
      valueScore: 89,
      culturalImportance: 97,
    },
  ]);

  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([
    {
      id: "verify-001",
      nftId: "nft-001",
      verifier: "Dr. Jane Muthoni",
      verifierRole: "scholar",
      status: "approved",
      comments:
        "Excellent documentation of traditional storage methods. Verified through field research.",
      timestamp: "2024-01-16",
      trustScore: 95,
    },
    {
      id: "verify-002",
      nftId: "nft-005",
      verifier: "Elder Peter Ochieng",
      verifierRole: "elder",
      status: "needs-revision",
      comments:
        "Some spiritual aspects need consultation with additional community elders.",
      timestamp: "2024-02-06",
      trustScore: 78,
    },
  ]);

  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([
    {
      id: "usage-001",
      nftId: "nft-001",
      user: "AgriTech Solutions Ltd",
      purpose: "Modern storage facility design",
      commercialUse: true,
      royaltyPaid: 250,
      timestamp: "2024-02-10",
      outcome: "successful",
    },
    {
      id: "usage-002",
      nftId: "nft-002",
      user: "Community Health Center",
      purpose: "Traditional medicine research",
      commercialUse: false,
      royaltyPaid: 0,
      timestamp: "2024-02-08",
      outcome: "successful",
    },
  ]);

  const [totalNFTs, setTotalNFTs] = useState(5);
  const [verifiedNFTs, setVerifiedNFTs] = useState(3);
  const [totalRoyalties, setTotalRoyalties] = useState(6880);
  const [averageValue, setAverageValue] = useState(92.2);

  useEffect(() => {
    // Calculate metrics
    const verified = knowledgeNFTs.filter(
      (nft) => nft.verificationStatus === "verified",
    ).length;
    const totalRoyalty = knowledgeNFTs.reduce(
      (sum, nft) => sum + nft.royalties,
      0,
    );
    const avgValue =
      knowledgeNFTs.reduce((sum, nft) => sum + nft.valueScore, 0) /
      knowledgeNFTs.length;

    setVerifiedNFTs(verified);
    setTotalRoyalties(totalRoyalty);
    setAverageValue(Math.round(avgValue * 10) / 10);
  }, [knowledgeNFTs]);

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "disputed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medicinal":
        return "text-red-600 bg-red-100";
      case "agricultural":
        return "text-green-600 bg-green-100";
      case "craft":
        return "text-orange-600 bg-orange-100";
      case "spiritual":
        return "text-purple-600 bg-purple-100";
      case "ecological":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "successful":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "medicinal":
        return "🌿";
      case "agricultural":
        return "🌾";
      case "craft":
        return "🏺";
      case "spiritual":
        return "🕯️";
      case "ecological":
        return "🌳";
      default:
        return "📚";
    }
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total NFTs</p>
                <p className="text-2xl font-bold text-blue-600">{totalNFTs}</p>
              </div>
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {verifiedNFTs}/{totalNFTs}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Royalties</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${totalRoyalties}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Value</p>
                <p className="text-2xl font-bold text-orange-600">
                  {averageValue}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge NFTs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Indigenous Knowledge NFTs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {knowledgeNFTs.map((nft) => (
              <Card key={nft.id} className="border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getCategoryIcon(nft.category)}
                        </span>
                        <h3 className="font-semibold">{nft.title}</h3>
                        <Badge className={getCategoryColor(nft.category)}>
                          {nft.category}
                        </Badge>
                        <Badge
                          className={getVerificationColor(
                            nft.verificationStatus,
                          )}
                        >
                          {nft.verificationStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        by {nft.contributor} - {nft.tribe} Tribe
                      </p>
                      <p className="text-sm mb-3">{nft.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Usage Count</p>
                          <p className="font-medium">{nft.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Royalties</p>
                          <p className="font-medium">${nft.royalties}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value Score</p>
                          <p className="font-medium">{nft.valueScore}/100</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Cultural Score
                          </p>
                          <p className="font-medium">
                            {nft.culturalImportance}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mint Date</p>
                          <p className="font-medium">{nft.mintDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {nft.valueScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-y-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Cultural Importance</span>
                        <span>{nft.culturalImportance}%</span>
                      </div>
                      <Progress
                        value={nft.culturalImportance}
                        className="h-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Verification Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.verifier}</span>
                      <Badge variant="secondary">{log.verifierRole}</Badge>
                      <Badge className={getVerificationColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {log.comments}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">NFT ID</p>
                        <p className="font-medium">{log.nftId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trust Score</p>
                        <p className="font-medium">{log.trustScore}/100</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Usage & Royalty Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.user}</span>
                      <Badge className={getOutcomeColor(log.outcome)}>
                        {log.outcome}
                      </Badge>
                      {log.commercialUse && (
                        <Badge variant="secondary">Commercial</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {log.purpose}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">NFT ID</p>
                        <p className="font-medium">{log.nftId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Royalty Paid</p>
                        <p className="font-medium">${log.royaltyPaid}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{log.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {log.outcome === "successful" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {log.outcome === "pending" && (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    {log.outcome === "failed" && (
                      <Eye className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Management */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Submit Knowledge
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Verify NFT
            </Button>
            <Button variant="outline" size="sm">
              <Award className="mr-2 h-4 w-4" />
              Royalty Report
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Community Forum
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
