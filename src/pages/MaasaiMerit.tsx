import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Star,
  Shield,
  Users,
  TrendingUp,
  Eye,
  Heart,
  Zap,
  Activity,
  Crown,
  Target,
  Globe,
  Clock,
  Gift,
  Gem,
  Palette,
  Lock,
} from "lucide-react";

interface MeritBead {
  id: string;
  name: string;
  category:
    | "trust"
    | "quality"
    | "innovation"
    | "community"
    | "sustainability"
    | "leadership";
  color: string;
  pattern: string;
  description: string;
  criteria: string[];
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical";
  earnedBy: number;
  totalIssued: number;
  culturalSignificance: string;
  tradingValue: number;
  spiritualPower: number;
  soulbound: boolean;
}

interface SupplierProfile {
  id: string;
  name: string;
  business: string;
  location: string;
  beadsEarned: string[];
  totalBeads: number;
  reputationScore: number;
  trustLevel: "emerging" | "established" | "respected" | "elder" | "legend";
  completedOrders: number;
  customerRating: number;
  yearsActive: number;
  specializations: string[];
  testimonials: number;
  cultureRespect: number;
}

interface BeadTransaction {
  id: string;
  type: "earned" | "transferred" | "revoked" | "ceremonial";
  beadId: string;
  fromUser?: string;
  toUser: string;
  reason: string;
  witness: string;
  timestamp: string;
  ceremonialNotes?: string;
  communityApproval: number;
  blockchainHash: string;
}

interface CulturalCeremony {
  id: string;
  name: string;
  type: "initiation" | "achievement" | "community" | "seasonal" | "crisis";
  description: string;
  beadsAwarded: string[];
  participants: number;
  elder: string;
  location: string;
  date: string;
  culturalElements: string[];
  significance: string;
}

const MaasaiMerit = () => {
  const [meritBeads, setMeritBeads] = useState<MeritBead[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [transactions, setTransactions] = useState<BeadTransaction[]>([]);
  const [ceremonies, setCeremonies] = useState<CulturalCeremony[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "beads" | "suppliers" | "ceremonies"
  >("overview");

  useEffect(() => {
    // Mock merit beads data
    const mockBeads: MeritBead[] = [
      {
        id: "bead-001",
        name: "Olong'o wa Ukweli",
        category: "trust",
        color: "Deep Blue",
        pattern: "Seven Sacred Circles",
        description:
          "The Truth Keeper's bead - awarded for consistent honesty in all dealings",
        criteria: [
          "100+ verified transactions",
          "Zero fraudulent activities",
          "Community testimony",
          "Elder approval",
        ],
        rarity: "rare",
        earnedBy: 23,
        totalIssued: 50,
        culturalSignificance:
          "Represents the Maasai value of integrity and truth in all relationships",
        tradingValue: 850,
        spiritualPower: 95,
        soulbound: true,
      },
      {
        id: "bead-002",
        name: "Entito e-Sidai",
        category: "quality",
        color: "Golden Yellow",
        pattern: "Honeycomb Weave",
        description:
          "The Excellence bead - for suppliers who consistently deliver exceptional quality",
        criteria: [
          "98%+ quality rating",
          "50+ customer reviews",
          "Zero defective products",
          "Innovation in craft",
        ],
        rarity: "uncommon",
        earnedBy: 67,
        totalIssued: 150,
        culturalSignificance:
          "Honors the Maasai tradition of excellence in cattle and craftsmanship",
        tradingValue: 450,
        spiritualPower: 78,
        soulbound: false,
      },
      {
        id: "bead-003",
        name: "Ilkiama e-Nkutoto",
        category: "community",
        color: "Earth Red",
        pattern: "Unity Spiral",
        description:
          "The Community Builder bead - for those who strengthen the marketplace community",
        criteria: [
          "Mentored 10+ new suppliers",
          "Organized community events",
          "Conflict resolution",
          "Cultural preservation",
        ],
        rarity: "legendary",
        earnedBy: 8,
        totalIssued: 25,
        culturalSignificance:
          "Embodies the Maasai spirit of communal responsibility and ubuntu",
        tradingValue: 1200,
        spiritualPower: 98,
        soulbound: true,
      },
      {
        id: "bead-004",
        name: "Entasimi e-Nkera",
        category: "sustainability",
        color: "Forest Green",
        pattern: "Tree of Life",
        description:
          "The Earth Guardian bead - for environmental stewardship and sustainable practices",
        criteria: [
          "100% eco-friendly products",
          "Carbon neutral operations",
          "Community forest protection",
          "Traditional knowledge preservation",
        ],
        rarity: "rare",
        earnedBy: 15,
        totalIssued: 40,
        culturalSignificance:
          "Represents the Maasai role as guardians of the natural world",
        tradingValue: 720,
        spiritualPower: 89,
        soulbound: false,
      },
    ];

    // Mock supplier profiles
    const mockSuppliers: SupplierProfile[] = [
      {
        id: "supplier-001",
        name: "Mama Nasirian Ole Sankale",
        business: "Maasai Authentic Crafts",
        location: "Kajiado, Kenya",
        beadsEarned: ["bead-001", "bead-002", "bead-003"],
        totalBeads: 12,
        reputationScore: 950,
        trustLevel: "elder",
        completedOrders: 456,
        customerRating: 4.9,
        yearsActive: 8,
        specializations: [
          "Traditional Beadwork",
          "Leather Crafts",
          "Cultural Ceremonies",
        ],
        testimonials: 89,
        cultureRespect: 98,
      },
      {
        id: "supplier-002",
        name: "Kipkoech Ole Maasai",
        business: "Savanna Solar Solutions",
        location: "Narok County",
        beadsEarned: ["bead-002", "bead-004"],
        totalBeads: 7,
        reputationScore: 780,
        trustLevel: "respected",
        completedOrders: 234,
        customerRating: 4.7,
        yearsActive: 4,
        specializations: [
          "Solar Energy",
          "Sustainable Technology",
          "Rural Electrification",
        ],
        testimonials: 45,
        cultureRespect: 85,
      },
      {
        id: "supplier-003",
        name: "Grace Wanjiku Trader",
        business: "Nairobi-Maasai Bridge Co.",
        location: "Nairobi-Kajiado Border",
        beadsEarned: ["bead-002"],
        totalBeads: 3,
        reputationScore: 620,
        trustLevel: "established",
        completedOrders: 123,
        customerRating: 4.4,
        yearsActive: 2,
        specializations: [
          "Cross-cultural Trade",
          "Urban-Rural Logistics",
          "Language Services",
        ],
        testimonials: 28,
        cultureRespect: 72,
      },
    ];

    // Mock bead transactions
    const mockTransactions: BeadTransaction[] = [
      {
        id: "tx-001",
        type: "earned",
        beadId: "bead-001",
        toUser: "supplier-001",
        reason:
          "Completed 100 verified transactions with perfect honesty record",
        witness: "Elder Sankale Ole Parsapit",
        timestamp: "2 days ago",
        communityApproval: 98,
        blockchainHash:
          "0x7f9a3b2c8d1e4f6a9b8c7d2e5f1a4b6c9d8e7f2a5b1c4d6e9f8a7b2c5d1e4f6a",
      },
      {
        id: "tx-002",
        type: "ceremonial",
        beadId: "bead-003",
        toUser: "supplier-001",
        reason: "Community building during drought crisis response",
        witness: "Maasai Council of Elders",
        timestamp: "1 week ago",
        ceremonialNotes: "Awarded during the Season of Unity ceremony",
        communityApproval: 100,
        blockchainHash:
          "0x8a4b3c2d1e9f6a7b5c4d2e8f1a6b9c3d7e2f5a8b1c6d4e9f7a3b8c2d5e1f4a6b",
      },
    ];

    // Mock cultural ceremonies
    const mockCeremonies: CulturalCeremony[] = [
      {
        id: "ceremony-001",
        name: "Ilkiama e-Nkutoto Celebration",
        type: "community",
        description:
          "Seasonal ceremony honoring community builders and marketplace guardians",
        beadsAwarded: ["bead-003", "bead-004"],
        participants: 147,
        elder: "Sankale Ole Parsapit",
        location: "Sacred Enkutoto Tree, Kajiado",
        date: "Last Sunday",
        culturalElements: [
          "Traditional chants",
          "Bead blessing ritual",
          "Community feast",
          "Elder wisdom sharing",
        ],
        significance:
          "Strengthens community bonds and honors those who serve the collective good",
      },
      {
        id: "ceremony-002",
        name: "Initiation of New Traders",
        type: "initiation",
        description:
          "Welcoming ceremony for new suppliers entering the sacred marketplace",
        beadsAwarded: ["bead-002"],
        participants: 23,
        elder: "Mama Nasirian Ole Sankale",
        location: "Maasai Cultural Center",
        date: "Next Friday",
        culturalElements: [
          "Blessing by fire",
          "Oath of integrity",
          "Community welcome",
          "Gift exchange",
        ],
        significance:
          "Formal introduction to marketplace values and cultural expectations",
      },
    ];

    setMeritBeads(mockBeads);
    setSuppliers(mockSuppliers);
    setTransactions(mockTransactions);
    setCeremonies(mockCeremonies);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trust":
        return "bg-blue-100 text-blue-700";
      case "quality":
        return "bg-yellow-100 text-yellow-700";
      case "innovation":
        return "bg-purple-100 text-purple-700";
      case "community":
        return "bg-red-100 text-red-700";
      case "sustainability":
        return "bg-green-100 text-green-700";
      case "leadership":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700";
      case "uncommon":
        return "bg-green-100 text-green-700";
      case "rare":
        return "bg-blue-100 text-blue-700";
      case "legendary":
        return "bg-purple-100 text-purple-700";
      case "mythical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "emerging":
        return "bg-gray-100 text-gray-700";
      case "established":
        return "bg-green-100 text-green-700";
      case "respected":
        return "bg-blue-100 text-blue-700";
      case "elder":
        return "bg-purple-100 text-purple-700";
      case "legend":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBeadEmoji = (category: string) => {
    switch (category) {
      case "trust":
        return "🔵";
      case "quality":
        return "🟡";
      case "innovation":
        return "🟣";
      case "community":
        return "🔴";
      case "sustainability":
        return "🟢";
      case "leadership":
        return "🟠";
      default:
        return "⚪";
    }
  };

  const totalStats = {
    totalBeads: meritBeads.length,
    totalSuppliers: suppliers.length,
    legendaryBeads: meritBeads.filter(
      (b) => b.rarity === "legendary" || b.rarity === "mythical",
    ).length,
    averageReputation: Math.round(
      suppliers.reduce((sum, s) => sum + s.reputationScore, 0) /
        suppliers.length,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            🔴 Maasai Merit Badges
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Supplier reputation as digital beads</strong> (Soulbound
            Tokens). Traditional Maasai beadwork meets blockchain technology to
            create permanent, culturally-authentic reputation systems for the
            marketplace.
          </p>
          <div className="mt-4 text-sm text-red-600 font-medium">
            Soulbound Tokens • Cultural Authenticity • Blockchain Reputation •
            Traditional Wisdom • Community Honor
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardContent className="pt-6 text-center">
              <Gem className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <div className="text-3xl font-bold text-red-700">
                {totalStats.totalBeads}
              </div>
              <div className="text-sm text-red-600">Merit Beads</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.totalSuppliers}
              </div>
              <div className="text-sm text-blue-600">Suppliers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Crown className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.legendaryBeads}
              </div>
              <div className="text-sm text-purple-600">Legendary Beads</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.averageReputation}
              </div>
              <div className="text-sm text-green-600">Avg Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Significance Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <Heart className="h-4 w-4" />
          <AlertDescription>
            <strong>Culturally Authentic System:</strong> Each bead design is
            blessed by Maasai elders and follows traditional patterns with deep
            spiritual and cultural significance in the community.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "beads", "suppliers", "ceremonies"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "beads" && <Gem className="h-4 w-4 mr-2" />}
                {tab === "suppliers" && <Users className="h-4 w-4 mr-2" />}
                {tab === "ceremonies" && <Award className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Beads Tab */}
        {activeTab === "beads" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bead Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🔴 Sacred Merit Beads</h2>

              {meritBeads.map((bead) => (
                <Card
                  key={bead.id}
                  className="hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span className="text-2xl">
                            {getBeadEmoji(bead.category)}
                          </span>
                          <span>{bead.name}</span>
                          {bead.soulbound && (
                            <Lock className="h-4 w-4 text-amber-600" />
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(bead.category)}>
                            {bead.category}
                          </Badge>
                          <Badge className={getRarityColor(bead.rarity)}>
                            {bead.rarity}
                          </Badge>
                          <Badge variant="outline">{bead.color}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {bead.earnedBy}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Earned
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {bead.description}
                    </p>

                    <div>
                      <h4 className="font-medium mb-2 text-red-600">
                        Cultural Pattern
                      </h4>
                      <div className="text-sm bg-red-50 p-3 rounded-lg">
                        <strong>{bead.pattern}</strong> •{" "}
                        {bead.culturalSignificance}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">
                        Earning Criteria
                      </h4>
                      <div className="space-y-1">
                        {bead.criteria.map((criterion, index) => (
                          <div
                            key={index}
                            className="text-sm bg-blue-50 p-2 rounded flex items-center"
                          >
                            <Target className="h-3 w-3 text-blue-600 mr-2" />
                            {criterion}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spiritual Power and Trading Value */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Spiritual Power</span>
                          <span>{bead.spiritualPower}%</span>
                        </div>
                        <Progress value={bead.spiritualPower} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Scarcity</span>
                          <span>
                            {Math.round(
                              (1 - bead.earnedBy / bead.totalIssued) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(1 - bead.earnedBy / bead.totalIssued) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-red-600">
                          Trading Value:
                        </span>
                        <div>KSH {bead.tradingValue}</div>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">
                          Total Issued:
                        </span>
                        <div>{bead.totalIssued}</div>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">
                          Soulbound:
                        </span>
                        <div>{bead.soulbound ? "Yes" : "No"}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        disabled={bead.earnedBy >= bead.totalIssued}
                      >
                        <Award className="h-3 w-3 mr-1" />
                        View Requirements
                      </Button>
                      {!bead.soulbound && (
                        <Button size="sm" variant="outline">
                          <Gift className="h-3 w-3 mr-1" />
                          Trade Bead
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Palette className="h-3 w-3 mr-1" />
                        View Pattern
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bead Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Bead Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "trust",
                      "quality",
                      "innovation",
                      "community",
                      "sustainability",
                      "leadership",
                    ].map((category) => {
                      const count = meritBeads.filter(
                        (b) => b.category === category,
                      ).length;
                      const totalEarned = meritBeads
                        .filter((b) => b.category === category)
                        .reduce((sum, b) => sum + b.earnedBy, 0);
                      return (
                        <div
                          key={category}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm capitalize flex items-center">
                              <span className="mr-2">
                                {getBeadEmoji(category)}
                              </span>
                              {category}
                            </span>
                            <Badge className={getCategoryColor(category)}>
                              {count} types
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {totalEarned} beads earned community-wide
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Significance */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">
                    Maasai Bead Tradition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <strong>Sacred Colors:</strong> Each color carries
                      spiritual meaning in Maasai culture
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <strong>Pattern Stories:</strong> Traditional patterns
                      tell stories of achievement
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <strong>Elder Blessing:</strong> All beads blessed by
                      community elders
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <strong>Permanent Honor:</strong> Soulbound tokens
                      preserve achievement forever
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bead Awards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Recent Awards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions
                      .filter((t) => t.type === "earned")
                      .slice(0, 3)
                      .map((transaction) => {
                        const bead = meritBeads.find(
                          (b) => b.id === transaction.beadId,
                        );
                        return (
                          <div
                            key={transaction.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">
                                {getBeadEmoji(bead?.category || "trust")}{" "}
                                {bead?.name}
                              </span>
                              <Badge
                                className={getRarityColor(
                                  bead?.rarity || "common",
                                )}
                              >
                                {bead?.rarity}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              To: {transaction.toUser}
                            </div>
                            <div className="text-xs text-blue-600">
                              Witnessed by: {transaction.witness}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "beads" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed supplier profiles, cultural ceremony management, and
                blockchain verification systems.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MaasaiMerit;
