import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Shield,
  Users,
  Globe,
  Coins,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Award,
  Zap,
  Activity,
  Eye,
  Lock,
  Smartphone,
  RefreshCw,
  Target,
} from "lucide-react";

interface RefugeeCamp {
  id: string;
  name: string;
  location: string;
  population: number;
  activeTraders: number;
  dailyVolume: number;
  currencies: string[];
  internetAccess: "limited" | "moderate" | "good";
  primaryNeeds: string[];
  specializations: string[];
  trustNetwork: number;
  lastActivity: string;
  coordinator: string;
  sustainabilityScore: number;
}

interface Marketplace {
  id: string;
  campId: string;
  type: "goods" | "services" | "skills" | "education" | "remittances";
  name: string;
  description: string;
  activeListings: number;
  totalTransactions: number;
  averageRating: number;
  privacyLevel: "public" | "camp-only" | "verified-only" | "anonymous";
  paymentMethods: string[];
  languages: string[];
  moderators: number;
}

interface Transaction {
  id: string;
  marketplaceId: string;
  type: "trade" | "service" | "donation" | "remittance" | "education";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "disputed" | "failed";
  privacy: "encrypted" | "anonymous" | "semi-private";
  timestamp: string;
  participants: number;
  zkProofVerified: boolean;
}

const RefugeeMarkets = () => {
  const [camps, setCamps] = useState<RefugeeCamp[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<RefugeeCamp | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "camps" | "marketplaces" | "privacy"
  >("overview");

  useEffect(() => {
    // Mock refugee camps data
    const mockCamps: RefugeeCamp[] = [
      {
        id: "camp-001",
        name: "Kakuma Refugee Camp",
        location: "Turkana County, Kenya",
        population: 185000,
        activeTraders: 2400,
        dailyVolume: 45000,
        currencies: ["KES", "USD", "SSP", "ETB", "UGX"],
        internetAccess: "limited",
        primaryNeeds: [
          "Food",
          "Medicine",
          "Education",
          "Clothing",
          "Communication",
        ],
        specializations: [
          "Tailoring",
          "Electronics Repair",
          "Language Teaching",
          "Crafts",
          "Food Preparation",
        ],
        trustNetwork: 87,
        lastActivity: "3 minutes ago",
        coordinator: "UNHCR East Africa",
        sustainabilityScore: 79,
      },
      {
        id: "camp-002",
        name: "Dadaab Refugee Complex",
        location: "Garissa County, Kenya",
        population: 235000,
        activeTraders: 3100,
        dailyVolume: 67000,
        currencies: ["KES", "USD", "SOS", "ETB"],
        internetAccess: "moderate",
        primaryNeeds: [
          "Water",
          "Food",
          "Healthcare",
          "Shelter Materials",
          "Energy",
        ],
        specializations: [
          "Water Treatment",
          "Solar Installation",
          "Medical Assistance",
          "Construction",
          "Teaching",
        ],
        trustNetwork: 91,
        lastActivity: "1 minute ago",
        coordinator: "UNHCR Horn of Africa",
        sustainabilityScore: 83,
      },
      {
        id: "camp-003",
        name: "Kalobeyei Settlement",
        location: "Turkana County, Kenya",
        population: 41000,
        activeTraders: 580,
        dailyVolume: 12000,
        currencies: ["KES", "USD", "SSP"],
        internetAccess: "good",
        primaryNeeds: [
          "Education",
          "Skills Training",
          "Market Access",
          "Technology",
          "Finance",
        ],
        specializations: [
          "Digital Skills",
          "Agribusiness",
          "Youth Programs",
          "Women Empowerment",
          "Innovation",
        ],
        trustNetwork: 94,
        lastActivity: "Just now",
        coordinator: "UNHCR Innovation",
        sustainabilityScore: 88,
      },
    ];

    // Mock marketplaces data
    const mockMarketplaces: Marketplace[] = [
      {
        id: "market-001",
        campId: "camp-001",
        type: "goods",
        name: "Kakuma Essential Goods Exchange",
        description:
          "Secure marketplace for trading essential goods with zero-knowledge privacy protection",
        activeListings: 347,
        totalTransactions: 12400,
        averageRating: 4.7,
        privacyLevel: "verified-only",
        paymentMethods: ["M-Pesa", "Mobile Money", "Barter", "Work Exchange"],
        languages: ["English", "Swahili", "Arabic", "Nuer", "Dinka"],
        moderators: 12,
      },
      {
        id: "market-002",
        campId: "camp-002",
        type: "services",
        name: "Dadaab Skills & Services Hub",
        description:
          "Professional services marketplace connecting refugees with income opportunities",
        activeListings: 189,
        totalTransactions: 5600,
        averageRating: 4.9,
        privacyLevel: "camp-only",
        paymentMethods: ["Mobile Money", "Time Banking", "Skill Exchange"],
        languages: ["Somali", "English", "Arabic", "Oromo"],
        moderators: 8,
      },
      {
        id: "market-003",
        campId: "camp-003",
        type: "education",
        name: "Kalobeyei Digital Learning Platform",
        description:
          "Educational content and skills training with blockchain certificates",
        activeListings: 67,
        totalTransactions: 2300,
        averageRating: 4.8,
        privacyLevel: "public",
        paymentMethods: [
          "Learning Credits",
          "Achievement Tokens",
          "Scholarship Funds",
        ],
        languages: ["English", "Swahili", "Nuer", "Arabic"],
        moderators: 5,
      },
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx-001",
        marketplaceId: "market-001",
        type: "trade",
        amount: 2500,
        currency: "KES",
        status: "completed",
        privacy: "encrypted",
        timestamp: "2 minutes ago",
        participants: 2,
        zkProofVerified: true,
      },
      {
        id: "tx-002",
        marketplaceId: "market-002",
        type: "service",
        amount: 1800,
        currency: "USD",
        status: "pending",
        privacy: "anonymous",
        timestamp: "15 minutes ago",
        participants: 3,
        zkProofVerified: true,
      },
      {
        id: "tx-003",
        marketplaceId: "market-003",
        type: "education",
        amount: 150,
        currency: "Learning Credits",
        status: "completed",
        privacy: "semi-private",
        timestamp: "1 hour ago",
        participants: 1,
        zkProofVerified: true,
      },
    ];

    setCamps(mockCamps);
    setMarketplaces(mockMarketplaces);
    setTransactions(mockTransactions);
  }, []);

  const getInternetColor = (access: string) => {
    switch (access) {
      case "good":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "limited":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case "public":
        return "bg-blue-100 text-blue-700";
      case "camp-only":
        return "bg-green-100 text-green-700";
      case "verified-only":
        return "bg-purple-100 text-purple-700";
      case "anonymous":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMarketTypeColor = (type: string) => {
    switch (type) {
      case "goods":
        return "bg-blue-100 text-blue-700";
      case "services":
        return "bg-green-100 text-green-700";
      case "skills":
        return "bg-purple-100 text-purple-700";
      case "education":
        return "bg-orange-100 text-orange-700";
      case "remittances":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalStats = {
    totalPopulation: camps.reduce((sum, camp) => sum + camp.population, 0),
    activeTraders: camps.reduce((sum, camp) => sum + camp.activeTraders, 0),
    dailyVolume: camps.reduce((sum, camp) => sum + camp.dailyVolume, 0),
    averageTrust: Math.round(
      camps.reduce((sum, camp) => sum + camp.trustNetwork, 0) / camps.length,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🏕️ Refugee Resilience Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Kakuma Camp micro-exchanges</strong> with zero-knowledge
            proofs for privacy protection. Secure, anonymous marketplaces
            enabling economic activity while protecting vulnerable populations.
          </p>
          <div className="mt-4 text-sm text-purple-600 font-medium">
            Zero-Knowledge Privacy • Anonymous Transactions • Trust Networks •
            Humanitarian Economics • Digital Dignity
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.totalPopulation.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">Total Population</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.activeTraders.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Active Traders</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Coins className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                KES {totalStats.dailyVolume.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Daily Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.averageTrust}%
              </div>
              <div className="text-sm text-amber-600">Trust Network</div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Protection Alert */}
        <Alert className="mb-8 border-purple-200 bg-purple-50">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Zero-Knowledge Privacy:</strong> All transactions use
            advanced cryptographic proofs to protect refugee identities while
            enabling economic participation. Personal data never leaves the
            device.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "camps", "marketplaces", "privacy"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "camps" && <MapPin className="h-4 w-4 mr-2" />}
                {tab === "marketplaces" && <Globe className="h-4 w-4 mr-2" />}
                {tab === "privacy" && <Lock className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Camps Tab */}
        {activeTab === "camps" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camp Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🏕️ Refugee Camps Network</h2>

              {camps.map((camp) => (
                <Card
                  key={camp.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCamp(camp)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{camp.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {camp.location}
                          </span>
                          <Badge
                            className={getInternetColor(camp.internetAccess)}
                          >
                            {camp.internetAccess} internet
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {camp.population.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Population
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-600">
                          Active Traders:
                        </span>
                        <div>{camp.activeTraders.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">
                          Daily Volume:
                        </span>
                        <div>KES {camp.dailyVolume.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">
                          Trust Network:
                        </span>
                        <div>{camp.trustNetwork}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">
                          Coordinator:
                        </span>
                        <div>{camp.coordinator}</div>
                      </div>
                    </div>

                    {/* Trust Network Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community Trust Level</span>
                        <span>{camp.trustNetwork}%</span>
                      </div>
                      <Progress value={camp.trustNetwork} className="h-2" />
                    </div>

                    {/* Currencies */}
                    <div>
                      <span className="text-sm font-medium text-purple-600 mb-2 block">
                        Supported Currencies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.currencies.map((currency, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <span className="text-sm font-medium text-purple-600 mb-2 block">
                        Community Specializations:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.specializations
                          .slice(0, 3)
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-green-100 text-green-700 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {camp.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{camp.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Activity className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Live Activity:</strong> Last transaction{" "}
                        {camp.lastActivity} • Sustainability score:{" "}
                        {camp.sustainabilityScore}%
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button size="sm">
                        <Globe className="h-3 w-3 mr-1" />
                        View Markets
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-3 w-3 mr-1" />
                        Support Camp
                      </Button>
                      <Button size="sm" variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        Impact Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedCamp ? (
                /* Camp Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{selectedCamp.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Priority Needs</h4>
                      <div className="space-y-1">
                        {selectedCamp.primaryNeeds.map((need, index) => (
                          <div
                            key={index}
                            className="text-sm bg-red-50 p-2 rounded flex items-center"
                          >
                            <Target className="h-3 w-3 text-red-600 mr-2" />
                            {need}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Community Strengths</h4>
                      <div className="space-y-1">
                        {selectedCamp.specializations.map((skill, index) => (
                          <div
                            key={index}
                            className="text-sm bg-green-50 p-2 rounded flex items-center"
                          >
                            <Star className="h-3 w-3 text-green-600 mr-2" />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Economic Activity</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Trader Participation:</span>
                          <span>
                            {Math.round(
                              (selectedCamp.activeTraders /
                                selectedCamp.population) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Capita Volume:</span>
                          <span>
                            KES{" "}
                            {Math.round(
                              selectedCamp.dailyVolume /
                                selectedCamp.population,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sustainability:</span>
                          <span>{selectedCamp.sustainabilityScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How It Works */
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-700">
                      Refugee Market Economics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Privacy First:</strong> Zero-knowledge proofs
                        protect refugee identities
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>Community Trust:</strong> Reputation systems
                        built on mutual aid
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Resilient Networks:</strong> Offline-first
                        design for unreliable connectivity
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Economic Dignity:</strong> Enabling
                        self-reliance through secure trade
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Marketplaces */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Active Marketplaces</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketplaces.slice(0, 3).map((marketplace) => (
                      <div
                        key={marketplace.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {marketplace.name}
                          </span>
                          <Badge
                            className={getMarketTypeColor(marketplace.type)}
                          >
                            {marketplace.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {marketplace.activeListings} listings • ⭐{" "}
                          {marketplace.averageRating}
                        </div>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs mr-1">
                            <Lock className="h-2 w-2 mr-1" />
                            {marketplace.privacyLevel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {marketplace.languages.length} languages
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm capitalize">
                            {transaction.type}
                          </span>
                          <div className="flex items-center">
                            {transaction.zkProofVerified && (
                              <Shield className="h-3 w-3 text-green-600 mr-1" />
                            )}
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.amount} {transaction.currency} •{" "}
                          {transaction.timestamp}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Privacy: {transaction.privacy} • ZK verified
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
        {activeTab !== "camps" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed marketplace management, privacy controls, and impact
                measurement tools for humanitarian economic programs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RefugeeMarkets;
