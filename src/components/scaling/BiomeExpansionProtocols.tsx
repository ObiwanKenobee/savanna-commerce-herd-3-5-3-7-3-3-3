import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Radio,
  Truck,
  MapPin,
  Zap,
  Coins,
  Shield,
  Eye,
  TrendingUp,
  Waves,
  Activity,
} from "lucide-react";

interface MatatuData {
  id: string;
  driver: string;
  route: string;
  savannahMiles: number;
  alertsToday: number;
  coverageRadius: number;
  status: "active" | "offline" | "maintenance";
}

interface ElephantHerd {
  id: string;
  matriarch: string;
  members: number;
  conservationTokens: number;
  lastMigration: string;
  gpsAccuracy: number;
  blockchainHash: string;
}

interface MaasaiInsight {
  id: string;
  elder: string;
  knowledge: string;
  accuracy: number;
  implementations: number;
  earnings: number;
  category: "poaching" | "weather" | "wildlife" | "grazing";
}

export const BiomeExpansionProtocols = () => {
  const [activeTab, setActiveTab] = useState("matatu");
  const [networkCoverage, setNetworkCoverage] = useState(73);
  const [totalSavannahMiles, setTotalSavannahMiles] = useState(247865);

  // Mock data
  const matatuFleet: MatatuData[] = [
    {
      id: "MAT001",
      driver: "Joseph Kimani",
      route: "Nairobi-Nakuru",
      savannahMiles: 1250,
      alertsToday: 3,
      coverageRadius: 15.2,
      status: "active",
    },
    {
      id: "MAT002",
      driver: "Grace Wanjiku",
      route: "Mombasa-Malindi",
      savannahMiles: 890,
      alertsToday: 1,
      coverageRadius: 12.8,
      status: "active",
    },
    {
      id: "MAT003",
      driver: "Samuel Kiptoo",
      route: "Eldoret-Kitale",
      savannahMiles: 675,
      alertsToday: 0,
      coverageRadius: 8.5,
      status: "maintenance",
    },
  ];

  const elephantHerds: ElephantHerd[] = [
    {
      id: "HERD_AMBOSELI_001",
      matriarch: "Mama Tembo",
      members: 18,
      conservationTokens: 2340,
      lastMigration: "2024-01-15T14:30:00Z",
      gpsAccuracy: 99.7,
      blockchainHash: "0x4a7b...89f3",
    },
    {
      id: "HERD_TSAVO_002",
      matriarch: "Nyota Tembo",
      members: 12,
      conservationTokens: 1890,
      lastMigration: "2024-01-16T09:15:00Z",
      gpsAccuracy: 98.4,
      blockchainHash: "0x2c9d...47e1",
    },
  ];

  const maasaiInsights: MaasaiInsight[] = [
    {
      id: "WISDOM_001",
      elder: "Sankale ole Karia",
      knowledge: "Moon phase prediction for poaching activity",
      accuracy: 94.2,
      implementations: 47,
      earnings: 1250.75,
      category: "poaching",
    },
    {
      id: "WISDOM_002",
      elder: "Nasirian ene Sankale",
      knowledge: "Livestock movement patterns for drought forecasting",
      accuracy: 89.8,
      implementations: 32,
      earnings: 890.4,
      category: "weather",
    },
  ];

  useEffect(() => {
    // Simulate real-time network coverage updates
    const interval = setInterval(() => {
      setNetworkCoverage((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(60, Math.min(95, prev + change));
      });
      setTotalSavannahMiles((prev) => prev + Math.floor(Math.random() * 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "poaching":
        return <Shield className="h-4 w-4" />;
      case "weather":
        return <Waves className="h-4 w-4" />;
      case "wildlife":
        return <Eye className="h-4 w-4" />;
      case "grazing":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Biome-Specific Expansion Protocols
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Human Network Amplification through Matatu Mesh crowdsourcing, Maasai
          Warrior API wisdom integration, and Wildlife-as-Nodes blockchain
          infrastructure
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-500" />
              Network Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkCoverage.toFixed(1)}%
            </div>
            <Progress value={networkCoverage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              LoRaWAN mesh expansion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              Savannah Miles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSavannahMiles.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total earned by drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {matatuFleet.reduce((sum, m) => sum + m.alertsToday, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Poaching/roadkill alerts today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matatu" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Matatu Mesh
          </TabsTrigger>
          <TabsTrigger value="maasai" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Maasai Warrior API
          </TabsTrigger>
          <TabsTrigger value="elephant" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Elephant Blockchain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matatu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-500" />
                Matatu Mesh Network
              </CardTitle>
              <CardDescription>
                10,000 Kenyan buses equipped with LoRaWAN repeaters, dashcam AI,
                and conservation alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {matatuFleet.map((matatu) => (
                <div
                  key={matatu.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(matatu.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">{matatu.driver}</h4>
                        <p className="text-sm text-muted-foreground">
                          {matatu.route}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        matatu.status === "active" ? "default" : "secondary"
                      }
                    >
                      {matatu.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-yellow-600">
                        {matatu.savannahMiles}
                      </div>
                      <div className="text-muted-foreground">
                        Savannah Miles
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-red-600">
                        {matatu.alertsToday}
                      </div>
                      <div className="text-muted-foreground">Alerts Today</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {matatu.coverageRadius}km
                      </div>
                      <div className="text-muted-foreground">
                        Coverage Radius
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      Track Route
                    </Button>
                    <Button size="sm" variant="outline">
                      <Zap className="h-3 w-3 mr-1" />
                      Fuel Discount
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maasai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Maasai Warrior API
              </CardTitle>
              <CardDescription>
                Converting indigenous tracking knowledge into ML features for
                conservation technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {maasaiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getCategoryIcon(insight.category)}
                      <div>
                        <h4 className="font-medium">{insight.elder}</h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.knowledge}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getCategoryIcon(insight.category)}
                      {insight.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {insight.accuracy}%
                      </div>
                      <div className="text-muted-foreground">Accuracy</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {insight.implementations}
                      </div>
                      <div className="text-muted-foreground">
                        Implementations
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-600">
                        KSh {insight.earnings}
                      </div>
                      <div className="text-muted-foreground">
                        Royalties Earned
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                    <div className="text-muted-foreground mb-1">
                      Python Algorithm:
                    </div>
                    <code>
                      def predict_poaching_risk():
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;return (moon_phase * 0.3) +
                      (livestock_movement * 0.7)
                    </code>
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    <Coins className="h-3 w-3 mr-1" />
                    License Knowledge API
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elephant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Elephant Blockchain
              </CardTitle>
              <CardDescription>
                IoT collars mining conservation tokens via proof-of-migration,
                with real-time herd tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {elephantHerds.map((herd) => (
                <div key={herd.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{herd.matriarch}</h4>
                      <p className="text-sm text-muted-foreground">{herd.id}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      {herd.members} members
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-purple-600">
                        {herd.conservationTokens}
                      </div>
                      <div className="text-muted-foreground">
                        Conservation Tokens
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {herd.gpsAccuracy}%
                      </div>
                      <div className="text-muted-foreground">GPS Accuracy</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Last Migration:
                      </span>
                      <span className="ml-2 font-mono">
                        {new Date(herd.lastMigration).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Blockchain Hash:
                      </span>
                      <span className="ml-2 font-mono text-xs">
                        {herd.blockchainHash}
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-sm font-medium text-purple-700 mb-1">
                      Smart Contract
                    </div>
                    <code className="text-xs text-purple-600">
                      function validateMigration(bytes32 herdID) public &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;require(GPS.verify(herdID));
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;mint(conservationToken, 100);
                      <br />
                      &#125;
                    </code>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      Track Herd
                    </Button>
                    <Button size="sm" variant="outline">
                      <Coins className="h-3 w-3 mr-1" />
                      Mine Tokens
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
