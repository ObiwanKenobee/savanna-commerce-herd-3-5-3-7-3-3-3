import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Wheat,
  Radio,
  Hammer,
  Droplets,
  BookOpen,
  Shield,
  TrendingUp,
  Activity,
  MapPin,
  Zap,
} from "lucide-react";

// Individual feature components
import { GranaryInventorySystem } from "./GranaryInventorySystem";
import { TalkingDrumsNetwork } from "./TalkingDrumsNetwork";
import { JuaKaliManufacturing } from "./JuaKaliManufacturing";
import { DataAqueducts } from "./DataAqueducts";
import { IndigenousKnowledge } from "./IndigenousKnowledge";
import { EarthenFirewall } from "./EarthenFirewall";

interface HeritageMetrics {
  granaryEfficiency: number;
  drumsNetworkHealth: number;
  manufacturingCapacity: number;
  knowledgeContributions: number;
  securityThreatsBlocked: number;
  totalPreservationScore: number;
}

export const AfricanHeritageDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<HeritageMetrics>({
    granaryEfficiency: 87.3,
    drumsNetworkHealth: 94.1,
    manufacturingCapacity: 76.8,
    knowledgeContributions: 234,
    securityThreatsBlocked: 45,
    totalPreservationScore: 91.2,
  });

  const heritageFeatures = [
    {
      id: "granary",
      name: "Benin Granary Systems",
      description:
        "AI-powered stock forecasting with termite-inspired ventilation algorithms",
      icon: <Wheat className="h-6 w-6" />,
      color: "bg-amber-500",
      metric: metrics.granaryEfficiency,
      metricLabel: "Preservation Efficiency",
      status: "Active",
      inspiration: "Benin underground grain silos (5+ year preservation)",
    },
    {
      id: "drums",
      name: "Yoruba Talking Drums",
      description:
        "Decentralized mesh communication network with rhythmic encoding",
      icon: <Radio className="h-6 w-6" />,
      color: "bg-purple-500",
      metric: metrics.drumsNetworkHealth,
      metricLabel: "Network Health",
      status: "Active",
      inspiration: "Yoruba drum languages (50km transmission)",
    },
    {
      id: "manufacturing",
      name: "Mbeya Iron Smelting",
      description: "Solar-powered 3D printing using recycled matatu parts",
      icon: <Hammer className="h-6 w-6" />,
      color: "bg-orange-500",
      metric: metrics.manufacturingCapacity,
      metricLabel: "Production Capacity",
      status: "Expanding",
      inspiration: "Tanzanian bloomery furnaces (1/10th fuel cost)",
    },
    {
      id: "aqueducts",
      name: "Kushite Aqueducts",
      description: "Offline data rivers via boda boda encrypted transmission",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-blue-500",
      metric: 85.6,
      metricLabel: "Data Flow Rate",
      status: "Active",
      inspiration: "Meroë 100km water channels",
    },
    {
      id: "knowledge",
      name: "Timbuktu Scholars",
      description: "Blockchain-based indigenous knowledge preservation as NFTs",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-green-500",
      metric: metrics.knowledgeContributions,
      metricLabel: "Knowledge NFTs",
      status: "Growing",
      inspiration: "Sankore University (25,000 scholars)",
    },
    {
      id: "security",
      name: "Benin City Walls",
      description: "Multi-layered cyber defense using pre-colonial tactics",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-red-500",
      metric: metrics.securityThreatsBlocked,
      metricLabel: "Threats Blocked",
      status: "Fortified",
      inspiration: "16,000km earthworks (world's largest pre-industrial city)",
    },
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        granaryEfficiency: prev.granaryEfficiency + (Math.random() - 0.5) * 2,
        drumsNetworkHealth: Math.max(
          85,
          Math.min(100, prev.drumsNetworkHealth + (Math.random() - 0.5)),
        ),
        manufacturingCapacity:
          prev.manufacturingCapacity + (Math.random() - 0.5) * 3,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-green-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏛️</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          African Heritage Engineering
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Resurrecting and modernizing pre-colonial African innovations to
          create a radically inclusive digital marketplace that blends ancient
          wisdom with frontier technology
        </p>

        <div className="bg-gradient-to-r from-amber-100 to-green-100 rounded-xl p-6 mx-auto max-w-4xl">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Ubuntu Philosophy
          </h3>
          <p className="text-amber-700 text-sm">
            "I am because we are" - Building technology that amplifies community
            wisdom and creates shared prosperity through collaboration with
            ancestral knowledge.
          </p>
        </div>
      </div>

      {/* Overall Preservation Score */}
      <Card className="bg-gradient-to-r from-amber-50 to-green-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <TrendingUp className="h-5 w-5" />
            Heritage Preservation Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {metrics.totalPreservationScore.toFixed(1)}%
              </div>
              <Progress
                value={metrics.totalPreservationScore}
                className="h-3"
              />
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Traditional Wisdom
              </div>
              <div className="text-sm text-muted-foreground">
                + Modern Innovation
              </div>
              <div className="text-lg font-semibold text-green-600">
                = Ubuntu Tech
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heritage Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heritageFeatures.map((feature) => (
          <Card
            key={feature.id}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveTab(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {feature.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{feature.metricLabel}</span>
                  <span className="font-medium">
                    {typeof feature.metric === "number"
                      ? feature.metric % 1 === 0
                        ? feature.metric
                        : feature.metric.toFixed(1)
                      : feature.metric}
                    {feature.metricLabel.includes("Efficiency") ||
                    feature.metricLabel.includes("Health") ||
                    feature.metricLabel.includes("Capacity")
                      ? "%"
                      : ""}
                  </span>
                </div>
                <Progress
                  value={
                    typeof feature.metric === "number"
                      ? feature.metricLabel === "Knowledge NFTs" ||
                        feature.metricLabel === "Threats Blocked"
                        ? Math.min(100, (feature.metric / 500) * 100)
                        : feature.metric
                      : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="bg-gray-50 rounded p-3 text-xs">
                <div className="font-medium text-gray-700 mb-1">
                  Ancient Inspiration:
                </div>
                <div className="text-gray-600">{feature.inspiration}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="granary" className="flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            <span className="hidden sm:inline">Granary</span>
          </TabsTrigger>
          <TabsTrigger value="drums" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">Drums</span>
          </TabsTrigger>
          <TabsTrigger
            value="manufacturing"
            className="flex items-center gap-2"
          >
            <Hammer className="h-4 w-4" />
            <span className="hidden sm:inline">Jua Kali</span>
          </TabsTrigger>
          <TabsTrigger value="aqueducts" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Aqueducts</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="granary">
          <GranaryInventorySystem />
        </TabsContent>

        <TabsContent value="drums">
          <TalkingDrumsNetwork />
        </TabsContent>

        <TabsContent value="manufacturing">
          <JuaKaliManufacturing />
        </TabsContent>

        <TabsContent value="aqueducts">
          <DataAqueducts />
        </TabsContent>

        <TabsContent value="knowledge">
          <IndigenousKnowledge />
        </TabsContent>

        <TabsContent value="security">
          <EarthenFirewall />
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-500 to-amber-500 text-white">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Join the Heritage Revolution</h3>
          <p className="text-green-100 max-w-2xl mx-auto">
            Be part of the movement that honors our ancestors while building the
            future. Contribute your knowledge, support local artisans, and help
            preserve African wisdom for generations.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Share Knowledge
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              <Hammer className="h-4 w-4 mr-2" />
              Support Artisans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
