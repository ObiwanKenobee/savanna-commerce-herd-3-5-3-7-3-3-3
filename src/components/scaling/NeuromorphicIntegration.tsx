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
  Brain,
  Cpu,
  Mic,
  Shield,
  MapPin,
  Zap,
  Volume2,
  Activity,
  Eye,
  Radio,
  Globe,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface ElephantProcessor {
  id: string;
  matriarch: string;
  memoryYears: number;
  routeOptimizations: number;
  droughtPredictions: number;
  accuracyRate: number;
  connectionStrength: number;
  status: "active" | "learning" | "offline";
}

interface RangerChip {
  id: string;
  rangerName: string;
  location: string;
  chipGeneration: string;
  translationsToday: number;
  alertsProcessed: number;
  batteryLevel: number;
  swahiliAccuracy: number;
  status: "embedded" | "charging" | "maintenance";
}

interface AnimalDistressAlert {
  id: string;
  species: string;
  location: [number, number];
  distressType: "injury" | "poaching" | "habitat_loss" | "human_conflict";
  confidenceLevel: number;
  timestamp: string;
  rangerNotified: boolean;
  responseTime: number;
}

interface PoachingPrediction {
  id: string;
  area: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  slangDecoded: string;
  predictiveAccuracy: number;
  timeWindow: string;
  preventionDeployed: boolean;
}

export const NeuromorphicIntegration = () => {
  const [activeTab, setActiveTab] = useState("elephant");
  const [totalOptimizations, setTotalOptimizations] = useState(3247);
  const [activeChips, setActiveChips] = useState(89);

  // Mock data
  const elephantProcessors: ElephantProcessor[] = [
    {
      id: "NEURAL_AMBOSELI_MAMA",
      matriarch: "Mama Tembo",
      memoryYears: 47,
      routeOptimizations: 234,
      droughtPredictions: 12,
      accuracyRate: 94.7,
      connectionStrength: 89,
      status: "active",
    },
    {
      id: "NEURAL_TSAVO_NYOTA",
      matriarch: "Nyota",
      memoryYears: 32,
      routeOptimizations: 156,
      droughtPredictions: 8,
      accuracyRate: 91.2,
      connectionStrength: 76,
      status: "learning",
    },
    {
      id: "NEURAL_SAMBURU_KESI",
      matriarch: "Kesi",
      memoryYears: 38,
      routeOptimizations: 198,
      droughtPredictions: 15,
      accuracyRate: 87.9,
      connectionStrength: 45,
      status: "offline",
    },
  ];

  const rangerChips: RangerChip[] = [
    {
      id: "CHIP_KWS_001",
      rangerName: "Samuel Kiptoo",
      location: "Maasai Mara",
      chipGeneration: "NeuralLink v3.2",
      translationsToday: 47,
      alertsProcessed: 8,
      batteryLevel: 87,
      swahiliAccuracy: 96.4,
      status: "embedded",
    },
    {
      id: "CHIP_KWS_002",
      rangerName: "Grace Wanjiru",
      location: "Amboseli National Park",
      chipGeneration: "NeuralLink v3.1",
      translationsToday: 31,
      alertsProcessed: 12,
      batteryLevel: 23,
      swahiliAccuracy: 94.8,
      status: "charging",
    },
    {
      id: "CHIP_KWS_003",
      rangerName: "Joseph Kimani",
      location: "Tsavo East",
      chipGeneration: "NeuralLink v2.9",
      translationsToday: 0,
      alertsProcessed: 0,
      batteryLevel: 0,
      swahiliAccuracy: 89.1,
      status: "maintenance",
    },
  ];

  const distressAlerts: AnimalDistressAlert[] = [
    {
      id: "ALERT_001",
      species: "Elephant",
      location: [-1.4061, 35.0058],
      distressType: "injury",
      confidenceLevel: 94.7,
      timestamp: "2024-01-16T14:23:00Z",
      rangerNotified: true,
      responseTime: 12,
    },
    {
      id: "ALERT_002",
      species: "Rhino",
      location: [-2.6424, 37.2606],
      distressType: "poaching",
      confidenceLevel: 98.2,
      timestamp: "2024-01-16T13:45:00Z",
      rangerNotified: true,
      responseTime: 8,
    },
  ];

  const poachingPredictions: PoachingPrediction[] = [
    {
      id: "PRED_001",
      area: "Northern Mara",
      riskLevel: "high",
      slangDecoded: "'Tembo kubwa' spotted near border",
      predictiveAccuracy: 87.3,
      timeWindow: "Next 6 hours",
      preventionDeployed: true,
    },
    {
      id: "PRED_002",
      area: "Tsavo Triangle",
      riskLevel: "critical",
      slangDecoded: "'Pembe za dhahabu' movement detected",
      predictiveAccuracy: 92.7,
      timeWindow: "Next 2 hours",
      preventionDeployed: false,
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTotalOptimizations((prev) => prev + Math.floor(Math.random() * 5));
      setActiveChips((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(80, Math.min(100, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "embedded":
        return "bg-green-500";
      case "learning":
      case "charging":
        return "bg-blue-500";
      case "offline":
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getDistressIcon = (type: string) => {
    switch (type) {
      case "injury":
        return "🩹";
      case "poaching":
        return "🚨";
      case "habitat_loss":
        return "🌳";
      case "human_conflict":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case "Elephant":
        return "🐘";
      case "Rhino":
        return "🦏";
      case "Lion":
        return "🦁";
      default:
        return "🦓";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Neuromorphic Integration
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Animal-computer interfaces training AI on elephant matriarch memories,
          and brain-embeddable chips for real-time Swahili translation and
          poaching prediction
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Route Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOptimizations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Elephant memory-guided routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              Active Neural Chips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChips}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rangers with embedded interfaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {distressAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Animal distress detected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="elephant" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Elephant AI
          </TabsTrigger>
          <TabsTrigger value="rangers" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Ranger Chips
          </TabsTrigger>
          <TabsTrigger value="distress" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Distress Alerts
          </TabsTrigger>
          <TabsTrigger value="poaching" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Poaching Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elephant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Elephant Tensor Processors
              </CardTitle>
              <CardDescription>
                Training AI on matriarchs' 50-year migration memory to optimize
                supply routes for drought resilience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {elephantProcessors.map((processor) => (
                <div
                  key={processor.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(processor.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">{processor.matriarch}</h4>
                        <p className="text-sm text-muted-foreground">
                          {processor.memoryYears} years of migration memory
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        processor.status === "active" ? "default" : "secondary"
                      }
                    >
                      {processor.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600">
                        {processor.routeOptimizations}
                      </div>
                      <div className="text-muted-foreground">
                        Route Optimizations
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">
                        {processor.droughtPredictions}
                      </div>
                      <div className="text-muted-foreground">
                        Drought Predictions
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {processor.accuracyRate}%
                      </div>
                      <div className="text-muted-foreground">Accuracy Rate</div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">
                        {processor.connectionStrength}%
                      </div>
                      <div className="text-muted-foreground">
                        Neural Connection
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-sm font-medium text-purple-700 mb-1">
                      Memory Integration Status
                    </div>
                    <Progress
                      value={processor.connectionStrength}
                      className="h-2 mb-2"
                    />
                    <div className="text-xs text-purple-600">
                      Processing {processor.memoryYears} years of matriarchal
                      decision trees for drought-resilient logistics
                      optimization
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      Neural Activity
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      Route History
                    </Button>
                    {processor.status === "active" && (
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Optimize Routes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rangers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                Brain-Embeddable Ranger Chips
              </CardTitle>
              <CardDescription>
                Real-time translation of animal distress calls to GPS alerts and
                poacher slang to predictive policing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rangerChips.map((chip) => (
                <div key={chip.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(chip.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">{chip.rangerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {chip.location}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        chip.status === "embedded" ? "default" : "secondary"
                      }
                    >
                      {chip.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {chip.translationsToday}
                      </div>
                      <div className="text-muted-foreground">
                        Translations Today
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-red-600">
                        {chip.alertsProcessed}
                      </div>
                      <div className="text-muted-foreground">
                        Alerts Processed
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {chip.swahiliAccuracy}%
                      </div>
                      <div className="text-muted-foreground">
                        Swahili Accuracy
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-600">
                        {chip.batteryLevel}%
                      </div>
                      <div className="text-muted-foreground">Battery Level</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-3 space-y-2">
                    <div className="text-sm font-medium text-blue-700">
                      {chip.chipGeneration} - Neural Interface
                    </div>
                    <div className="text-xs text-blue-600">
                      Real-time Swahili ↔ English translation with animal
                      distress call recognition
                    </div>
                    <Progress value={chip.batteryLevel} className="h-1" />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Brain className="h-3 w-3 mr-1" />
                      Neural Status
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mic className="h-3 w-3 mr-1" />
                      Audio Feed
                    </Button>
                    {chip.batteryLevel < 30 && (
                      <Button size="sm" variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        Charge Chip
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-orange-500" />
                Animal Distress Call Analysis
              </CardTitle>
              <CardDescription>
                AI-powered analysis of animal vocalizations converted to GPS
                alerts for rapid ranger response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {distressAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getSpeciesIcon(alert.species)}
                      </span>
                      <div>
                        <h4 className="font-medium">
                          {alert.species} Distress
                        </h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {alert.location[0].toFixed(4)},{" "}
                          {alert.location[1].toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getDistressIcon(alert.distressType)}
                      </span>
                      <Badge
                        variant={
                          alert.rangerNotified ? "default" : "destructive"
                        }
                      >
                        {alert.distressType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {alert.confidenceLevel}%
                      </div>
                      <div className="text-muted-foreground">Confidence</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {alert.responseTime}min
                      </div>
                      <div className="text-muted-foreground">Response Time</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {alert.rangerNotified ? "✅ Notified" : "⏳ Pending"}
                      </div>
                      <div className="text-muted-foreground">Ranger Status</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="text-orange-700 font-medium mb-1">
                      Distress Pattern Analysis
                    </div>
                    <div className="text-orange-600 text-sm">
                      Neural network detected{" "}
                      {alert.distressType.replace("_", " ")} pattern in{" "}
                      {alert.species.toLowerCase()} vocalization at{" "}
                      {alert.confidenceLevel}% confidence
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      Locate Animal
                    </Button>
                    <Button size="sm" variant="outline">
                      <Radio className="h-3 w-3 mr-1" />
                      Contact Ranger
                    </Button>
                    <Button size="sm" variant="outline">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Audio Analysis
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="poaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Poacher Slang Intelligence
              </CardTitle>
              <CardDescription>
                Real-time decoding of poacher communications for predictive
                policing and prevention deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {poachingPredictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{prediction.area}</h4>
                      <p className="text-sm text-muted-foreground">
                        {prediction.timeWindow}
                      </p>
                    </div>
                    <Badge className={getRiskColor(prediction.riskLevel)}>
                      {prediction.riskLevel} risk
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-purple-600">
                        {prediction.predictiveAccuracy}%
                      </div>
                      <div className="text-muted-foreground">
                        Prediction Accuracy
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {prediction.preventionDeployed
                          ? "✅ Deployed"
                          : "⏳ Pending"}
                      </div>
                      <div className="text-muted-foreground">
                        Prevention Status
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Intercepted Communication
                    </div>
                    <div className="font-mono text-sm text-gray-600 italic">
                      "{prediction.slangDecoded}"
                    </div>
                  </div>

                  {prediction.riskLevel === "critical" && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="text-red-700 font-medium mb-1">
                        🚨 CRITICAL THREAT DETECTED
                      </div>
                      <div className="text-red-600 text-sm">
                        High confidence poaching activity predicted. Immediate
                        intervention recommended.
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor Area
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Deploy Rangers
                    </Button>
                    {!prediction.preventionDeployed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Emergency Response
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
