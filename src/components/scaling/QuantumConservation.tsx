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
  Dna,
  Cloud,
  Coins,
  Shield,
  Eye,
  Satellite,
  Zap,
  Globe,
  Camera,
  TrendingUp,
  Lock,
  Radio,
} from "lucide-react";

interface DNAToken {
  id: string;
  species: string;
  haplotype: string;
  conservationStatus: "minted" | "protected" | "extinct";
  geoHash: string;
  marketValue: number;
  totalSupply: number;
  protectionFunding: number;
  rarityScore: number;
}

interface SkyBaobab {
  id: string;
  altitude: number;
  location: string;
  solarCharge: number;
  laserCommsActive: boolean;
  transactionsProcessed: number;
  deforestationAlerts: number;
  geothermalConnection: boolean;
  status: "active" | "ascending" | "maintenance";
}

interface HyperspectralData {
  id: string;
  coordinates: [number, number];
  forestCoverage: number;
  changeDetected: boolean;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  verificationScore: number;
}

export const QuantumConservation = () => {
  const [activeTab, setActiveTab] = useState("dna");
  const [totalDNAValue, setTotalDNAValue] = useState(2847392);
  const [balloonsActive, setBalloonsActive] = useState(47);

  // Mock data
  const dnaTokens: DNAToken[] = [
    {
      id: "DNA_RHINO_001",
      species: "Black Rhino",
      haplotype: "AGTCGGAA...TTCGA",
      conservationStatus: "minted",
      geoHash: "6vx8mq3p",
      marketValue: 45000,
      totalSupply: 2000,
      protectionFunding: 890000,
      rarityScore: 95.7,
    },
    {
      id: "DNA_ELEPHANT_002",
      species: "African Elephant",
      haplotype: "CGTATGCC...AAGGT",
      conservationStatus: "protected",
      geoHash: "6vx9nn2k",
      marketValue: 32000,
      totalSupply: 5000,
      protectionFunding: 1600000,
      rarityScore: 87.3,
    },
    {
      id: "DNA_CHEETAH_003",
      species: "East African Cheetah",
      haplotype: "TTGACGTA...CCGAA",
      conservationStatus: "minted",
      geoHash: "6vxa8r5m",
      marketValue: 28000,
      totalSupply: 1500,
      protectionFunding: 420000,
      rarityScore: 92.1,
    },
  ];

  const skyBaobabs: SkyBaobab[] = [
    {
      id: "BAOBAB_001_NAKURU",
      altitude: 20000,
      location: "Nakuru Stratosphere",
      solarCharge: 94,
      laserCommsActive: true,
      transactionsProcessed: 1247,
      deforestationAlerts: 3,
      geothermalConnection: true,
      status: "active",
    },
    {
      id: "BAOBAB_002_MOMBASA",
      altitude: 18500,
      location: "Coastal Stratosphere",
      solarCharge: 87,
      laserCommsActive: true,
      transactionsProcessed: 892,
      deforestationAlerts: 0,
      geothermalConnection: false,
      status: "active",
    },
    {
      id: "BAOBAB_003_ELDORET",
      altitude: 15000,
      location: "Western Highlands",
      solarCharge: 76,
      laserCommsActive: false,
      transactionsProcessed: 0,
      deforestationAlerts: 0,
      geothermalConnection: true,
      status: "ascending",
    },
  ];

  const hyperspectralData: HyperspectralData[] = [
    {
      id: "SCAN_MARA_001",
      coordinates: [-1.4061, 35.0058],
      forestCoverage: 89.3,
      changeDetected: false,
      severity: "low",
      timestamp: "2024-01-16T10:30:00Z",
      verificationScore: 97.8,
    },
    {
      id: "SCAN_TSAVO_002",
      coordinates: [-2.9833, 38.4167],
      forestCoverage: 72.1,
      changeDetected: true,
      severity: "medium",
      timestamp: "2024-01-16T11:15:00Z",
      verificationScore: 94.2,
    },
    {
      id: "SCAN_KAKAMEGA_003",
      coordinates: [0.2833, 34.75],
      forestCoverage: 45.8,
      changeDetected: true,
      severity: "critical",
      timestamp: "2024-01-16T09:45:00Z",
      verificationScore: 98.9,
    },
  ];

  useEffect(() => {
    // Simulate real-time market updates
    const interval = setInterval(() => {
      setTotalDNAValue((prev) => prev + Math.floor(Math.random() * 1000));
      setBalloonsActive((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(40, Math.min(60, prev + change));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "ascending":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
      case "minted":
        return "bg-purple-500";
      case "protected":
        return "bg-green-500";
      case "extinct":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSpeciesIcon = (species: string) => {
    if (species.includes("Rhino")) return "🦏";
    if (species.includes("Elephant")) return "🐘";
    if (species.includes("Cheetah")) return "🐆";
    return "🦓";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quantum-Scale Conservation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          DNA marketplace tokenizing endangered species genetics and atmospheric
          blockchain processing conservation transactions via high-altitude Sky
          Baobab network
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Dna className="h-4 w-4 text-purple-500" />
              DNA Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalDNAValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total ecosystem genetics value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud className="h-4 w-4 text-blue-500" />
              Sky Baobabs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balloonsActive}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-altitude processors active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              Forest Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hyperspectralData.filter((d) => d.changeDetected).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Deforestation alerts today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dna" className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            DNA Marketplace
          </TabsTrigger>
          <TabsTrigger value="sky" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Sky Baobab Network
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Hyperspectral Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dna" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-purple-500" />
                Wildlife Genetic Tokens
              </CardTitle>
              <CardDescription>
                Biotech partners tokenize endangered species DNA sequences,
                traded as NFTs to fund protection programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dnaTokens.map((token) => (
                <div key={token.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getSpeciesIcon(token.species)}
                      </span>
                      <div>
                        <h4 className="font-medium">{token.species}</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {token.haplotype.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(token.conservationStatus)}>
                      {token.conservationStatus}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        ${token.marketValue.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Market Value</div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">
                        {token.rarityScore}%
                      </div>
                      <div className="text-muted-foreground">Rarity Score</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {token.totalSupply}
                      </div>
                      <div className="text-muted-foreground">Total Supply</div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">
                        ${token.protectionFunding.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        Protection Funded
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-sm font-medium text-purple-700 mb-1">
                      NFT Metadata
                    </div>
                    <div className="font-mono text-xs text-purple-600 space-y-1">
                      <div>"species": "{token.species}"</div>
                      <div>"haplotype": "{token.haplotype}"</div>
                      <div>
                        "conservationStatus": "{token.conservationStatus}"
                      </div>
                      <div>"geoHash": "{token.geoHash}"</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Coins className="h-3 w-3 mr-1" />
                      Trade Token
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Fund Protection
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Verify DNA
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sky" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                Atmospheric Blockchain Network
              </CardTitle>
              <CardDescription>
                High-altitude balloons processing Savannah transactions via
                laser communications, powered by stratospheric solar and Kenya's
                geothermal energy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skyBaobabs.map((baobab) => (
                <div
                  key={baobab.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(baobab.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">{baobab.location}</h4>
                        <p className="text-sm text-muted-foreground">
                          Altitude: {baobab.altitude.toLocaleString()}m
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        baobab.status === "active" ? "default" : "secondary"
                      }
                    >
                      {baobab.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{baobab.solarCharge}%</div>
                        <div className="text-muted-foreground">
                          Solar Charge
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">
                          {baobab.laserCommsActive ? "Active" : "Offline"}
                        </div>
                        <div className="text-muted-foreground">Laser Comms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">
                          {baobab.transactionsProcessed}
                        </div>
                        <div className="text-muted-foreground">
                          Transactions/Day
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">
                          {baobab.deforestationAlerts}
                        </div>
                        <div className="text-muted-foreground">
                          Deforestation Alerts
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Geothermal Connection:{" "}
                        {baobab.geothermalConnection ? "Active" : "Solar Only"}
                      </span>
                    </div>
                    <div className="text-xs text-blue-600">
                      Processing conservation transactions in stratosphere with
                      laser mesh networking
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Satellite className="h-3 w-3 mr-1" />
                      Track Balloon
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Transaction Log
                    </Button>
                    {baobab.status === "active" && (
                      <Button size="sm" variant="outline">
                        <Radio className="h-3 w-3 mr-1" />
                        Laser Status
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-500" />
                Hyperspectral Forest Monitoring
              </CardTitle>
              <CardDescription>
                Real-time deforestation detection via satellite hyperspectral
                imaging with blockchain verification and automatic alert systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hyperspectralData.map((data) => (
                <div key={data.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {data.id.replace(/_/g, " ")}
                      </h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        {data.coordinates[0].toFixed(4)},{" "}
                        {data.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                    <Badge className={getSeverityColor(data.severity)}>
                      {data.severity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {data.forestCoverage}%
                      </div>
                      <div className="text-muted-foreground">
                        Forest Coverage
                      </div>
                      <Progress
                        value={data.forestCoverage}
                        className="h-1 mt-1"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {data.verificationScore}%
                      </div>
                      <div className="text-muted-foreground">
                        Verification Score
                      </div>
                      <Progress
                        value={data.verificationScore}
                        className="h-1 mt-1"
                      />
                    </div>
                    <div>
                      <div className="font-medium">
                        {data.changeDetected ? "⚠️ Change" : "✅ Stable"}
                      </div>
                      <div className="text-muted-foreground">Status</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="text-muted-foreground mb-1">Last Scan:</div>
                    <div className="font-mono">
                      {new Date(data.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {data.changeDetected && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="text-red-700 font-medium mb-1">
                        Deforestation Alert - {data.severity.toUpperCase()}
                      </div>
                      <div className="text-red-600 text-sm">
                        Hyperspectral analysis detected significant forest loss
                        in this region. Automatic verification score:{" "}
                        {data.verificationScore}%
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Camera className="h-3 w-3 mr-1" />
                      View Imagery
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Analysis Report
                    </Button>
                    {data.changeDetected && (
                      <Button size="sm" variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Trigger Response
                      </Button>
                    )}
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
