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
  Network,
  Droplets,
  Zap,
  Shield,
  RefreshCw,
  Activity,
  Wifi,
  Eye,
  TrendingUp,
  AlertTriangle,
  Globe,
  Settings,
  CheckCircle,
} from "lucide-react";

interface MyceliumNetwork {
  id: string;
  forestLocation: string;
  nodeCount: number;
  dataSpeed: number; // mbps
  organicFiberLength: number; // km
  healingEvents: number;
  networkHealth: number;
  moistureLevel: number;
  status: "healthy" | "healing" | "dormant" | "stressed";
}

interface HIVENode {
  id: string;
  location: string;
  nodeType: "human" | "infrastructure" | "viral" | "evolution";
  adaptationScore: number;
  mutationEvents: number;
  healingCapacity: number;
  connectedNodes: number;
  lastMutation: string;
  status: "active" | "mutating" | "healing" | "offline";
}

interface InfrastructureMutation {
  id: string;
  trigger: "drought" | "flood" | "poaching" | "network_failure";
  location: string;
  adaptationDeployed: string;
  successRate: number;
  timeToHeal: number; // minutes
  impactRadius: number; // km
  evolutionLevel: number;
}

interface BiologicalData {
  id: string;
  organism: string;
  networkContribution: string;
  dataRate: number;
  reliability: number;
  energyGenerated: number; // watts
  symbioticEfficiency: number;
}

export const SelfHealingArchitecture = () => {
  const [activeTab, setActiveTab] = useState("mycelium");
  const [networkUptime, setNetworkUptime] = useState(97.3);
  const [healingEvents, setHealingEvents] = useState(1247);

  // Mock data
  const myceliumNetworks: MyceliumNetwork[] = [
    {
      id: "MYCEL_KAKAMEGA_001",
      forestLocation: "Kakamega Forest",
      nodeCount: 156,
      dataSpeed: 0.47,
      organicFiberLength: 23.8,
      healingEvents: 34,
      networkHealth: 94.2,
      moistureLevel: 78,
      status: "healthy",
    },
    {
      id: "MYCEL_ABERDARE_002",
      forestLocation: "Aberdare National Park",
      nodeCount: 89,
      dataSpeed: 0.52,
      organicFiberLength: 15.4,
      healingEvents: 67,
      networkHealth: 87.6,
      moistureLevel: 45,
      status: "healing",
    },
    {
      id: "MYCEL_MOUNT_KENYA_003",
      forestLocation: "Mount Kenya Forest",
      nodeCount: 203,
      dataSpeed: 0.39,
      organicFiberLength: 31.2,
      healingEvents: 12,
      networkHealth: 91.8,
      moistureLevel: 82,
      status: "healthy",
    },
  ];

  const hiveNodes: HIVENode[] = [
    {
      id: "HIVE_NAIROBI_CENTRAL",
      location: "Nairobi Central Business District",
      nodeType: "infrastructure",
      adaptationScore: 92.4,
      mutationEvents: 23,
      healingCapacity: 87,
      connectedNodes: 456,
      lastMutation: "2024-01-16T08:30:00Z",
      status: "active",
    },
    {
      id: "HIVE_MOMBASA_PORT",
      location: "Mombasa Port Authority",
      nodeType: "evolution",
      adaptationScore: 78.9,
      mutationEvents: 45,
      healingCapacity: 94,
      connectedNodes: 234,
      lastMutation: "2024-01-16T12:15:00Z",
      status: "mutating",
    },
    {
      id: "HIVE_MAASAI_COMMUNITY",
      location: "Maasai Mara Community",
      nodeType: "human",
      adaptationScore: 89.7,
      mutationEvents: 12,
      healingCapacity: 76,
      connectedNodes: 89,
      lastMutation: "2024-01-15T16:45:00Z",
      status: "healing",
    },
  ];

  const mutations: InfrastructureMutation[] = [
    {
      id: "MUT_001_DROUGHT",
      trigger: "drought",
      location: "Northern Kenya",
      adaptationDeployed: "Water barter mode activated",
      successRate: 94.7,
      timeToHeal: 45,
      impactRadius: 50,
      evolutionLevel: 3,
    },
    {
      id: "MUT_002_POACHING",
      trigger: "poaching",
      location: "Tsavo Conservation Area",
      adaptationDeployed: "Stealth routing protocol",
      successRate: 87.3,
      timeToHeal: 23,
      impactRadius: 25,
      evolutionLevel: 4,
    },
    {
      id: "MUT_003_FLOOD",
      trigger: "flood",
      location: "Coastal Region",
      adaptationDeployed: "Elevated mesh networks",
      successRate: 91.8,
      timeToHeal: 67,
      impactRadius: 35,
      evolutionLevel: 2,
    },
  ];

  const biologicalData: BiologicalData[] = [
    {
      id: "BIO_MYCELIUM_FIBER",
      organism: "Fungal Mycelium",
      networkContribution: "Organic fiber optics",
      dataRate: 0.5,
      reliability: 87.4,
      energyGenerated: 0,
      symbioticEfficiency: 94.2,
    },
    {
      id: "BIO_BIOLUMINESCENT_ALGAE",
      organism: "Bioluminescent Algae",
      networkContribution: "Signal amplification",
      dataRate: 0.3,
      reliability: 76.8,
      energyGenerated: 15.7,
      symbioticEfficiency: 89.1,
    },
    {
      id: "BIO_BACTERIAL_CONDUCTORS",
      organism: "Conductive Bacteria",
      networkContribution: "Signal transmission",
      dataRate: 0.8,
      reliability: 91.2,
      energyGenerated: 8.3,
      symbioticEfficiency: 96.7,
    },
  ];

  useEffect(() => {
    // Simulate real-time healing and adaptation
    const interval = setInterval(() => {
      setNetworkUptime((prev) => {
        const healing = Math.random() * 0.2;
        return Math.min(99.9, prev + healing);
      });
      setHealingEvents((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return "bg-green-500";
      case "healing":
      case "mutating":
        return "bg-blue-500";
      case "dormant":
        return "bg-yellow-500";
      case "stressed":
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "drought":
        return "☀️";
      case "flood":
        return "🌊";
      case "poaching":
        return "🚨";
      case "network_failure":
        return "📡";
      default:
        return "⚡";
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "human":
        return "👥";
      case "infrastructure":
        return "🏗️";
      case "viral":
        return "🦠";
      case "evolution":
        return "🧬";
      default:
        return "🔗";
    }
  };

  const getOrganismIcon = (organism: string) => {
    if (organism.includes("Mycelium")) return "🍄";
    if (organism.includes("Algae")) return "🌊";
    if (organism.includes("Bacteria")) return "🦠";
    return "🧬";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Self-Healing Architecture
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Mycological networks as organic fiber optics and HIVE protocol for
          adaptive infrastructure that evolves like a living organism
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-green-500" />
              Network Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkUptime.toFixed(1)}%
            </div>
            <Progress value={networkUptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Self-healing efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Healing Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Autonomous repairs completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Evolution Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...mutations.map((m) => m.evolutionLevel))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Infrastructure adaptation stage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mycelium" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Mycelium Networks
          </TabsTrigger>
          <TabsTrigger value="hive" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            HIVE Protocol
          </TabsTrigger>
          <TabsTrigger value="mutations" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Mutations
          </TabsTrigger>
          <TabsTrigger value="biological" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Bio-Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mycelium" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-500" />
                Fungal-Based Internet
              </CardTitle>
              <CardDescription>
                Mycelium as organic fiber optics between microhubs with 0.5mbps
                data transmission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myceliumNetworks.map((network) => (
                <div
                  key={network.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(network.status)}`}
                      />
                      <div>
                        <h4 className="font-medium">
                          {network.forestLocation}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {network.nodeCount} nodes •{" "}
                          {network.organicFiberLength}km fiber
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        network.status === "healthy" ? "default" : "secondary"
                      }
                    >
                      {network.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600">
                        {network.dataSpeed} mbps
                      </div>
                      <div className="text-muted-foreground">Data Speed</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {network.networkHealth}%
                      </div>
                      <div className="text-muted-foreground">
                        Network Health
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">
                        {network.healingEvents}
                      </div>
                      <div className="text-muted-foreground">
                        Healing Events
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-cyan-600">
                        {network.moistureLevel}%
                      </div>
                      <div className="text-muted-foreground">
                        Moisture Level
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded p-3">
                    <div className="text-sm font-medium text-green-700 mb-1">
                      Organic Fiber Network
                    </div>
                    <Progress
                      value={network.networkHealth}
                      className="h-2 mb-2"
                    />
                    <div className="text-xs text-green-600">
                      Fungal hyphae form living fiber optic cables,
                      automatically rerouting through forest when damaged by
                      environmental changes
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor Growth
                    </Button>
                    <Button size="sm" variant="outline">
                      <Droplets className="h-3 w-3 mr-1" />
                      Moisture Control
                    </Button>
                    {network.status === "healing" && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Healing Progress
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                HIVE Protocol Network
              </CardTitle>
              <CardDescription>
                Human-Infrastructure-Viral-Evolution adaptive mutation engine
                for resilient ecosystems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Adaptive Mutation Engine
                </h4>
                <div className="space-y-2 text-sm text-blue-600">
                  <div>
                    🌍 <strong>Human:</strong> Community wisdom and local
                    knowledge
                  </div>
                  <div>
                    🏗️ <strong>Infrastructure:</strong> Physical network
                    components
                  </div>
                  <div>
                    🦠 <strong>Viral:</strong> Information propagation patterns
                  </div>
                  <div>
                    🧬 <strong>Evolution:</strong> Autonomous adaptation
                    algorithms
                  </div>
                </div>
              </div>

              {hiveNodes.map((node) => (
                <div key={node.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {getNodeTypeIcon(node.nodeType)}
                      </span>
                      <div>
                        <h4 className="font-medium">{node.location}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {node.nodeType} Node
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        node.status === "active" ? "default" : "secondary"
                      }
                    >
                      {node.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-purple-600">
                        {node.adaptationScore}%
                      </div>
                      <div className="text-muted-foreground">
                        Adaptation Score
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {node.healingCapacity}%
                      </div>
                      <div className="text-muted-foreground">
                        Healing Capacity
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {node.mutationEvents}
                      </div>
                      <div className="text-muted-foreground">Mutations</div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">
                        {node.connectedNodes}
                      </div>
                      <div className="text-muted-foreground">
                        Connected Nodes
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 space-y-1">
                    <div className="text-sm font-medium text-gray-700">
                      Last Mutation Event
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {new Date(node.lastMutation).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      Node Activity
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    {node.status === "mutating" && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Monitor Mutation
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mutations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-500" />
                Infrastructure Mutations
              </CardTitle>
              <CardDescription>
                Automatic adaptation responses to environmental challenges and
                system failures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mutations.map((mutation) => (
                <div
                  key={mutation.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getTriggerIcon(mutation.trigger)}
                      </span>
                      <div>
                        <h4 className="font-medium">{mutation.location}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {mutation.trigger.replace("_", " ")} response
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      Level {mutation.evolutionLevel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {mutation.successRate}%
                      </div>
                      <div className="text-muted-foreground">Success Rate</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">
                        {mutation.timeToHeal}min
                      </div>
                      <div className="text-muted-foreground">Healing Time</div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">
                        {mutation.impactRadius}km
                      </div>
                      <div className="text-muted-foreground">Impact Radius</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-sm font-medium text-purple-700 mb-1">
                      Adaptation Deployed
                    </div>
                    <div className="text-purple-600 text-sm">
                      {mutation.adaptationDeployed}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="font-mono text-xs text-gray-600">
                      def infrastructure_mutation():
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;if {mutation.trigger}_detected():
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;activate_
                      {mutation.adaptationDeployed
                        .toLowerCase()
                        .replace(/\s+/g, "_")}
                      _mode()
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Performance
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor Impact
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verify Success
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biological" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Biological Network Integration
              </CardTitle>
              <CardDescription>
                Living organisms contributing to network infrastructure with
                symbiotic efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {biologicalData.map((bio) => (
                <div key={bio.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getOrganismIcon(bio.organism)}
                      </span>
                      <div>
                        <h4 className="font-medium">{bio.organism}</h4>
                        <p className="text-sm text-muted-foreground">
                          {bio.networkContribution}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {bio.symbioticEfficiency}% efficiency
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600">
                        {bio.dataRate} mbps
                      </div>
                      <div className="text-muted-foreground">Data Rate</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {bio.reliability}%
                      </div>
                      <div className="text-muted-foreground">Reliability</div>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-600">
                        {bio.energyGenerated}W
                      </div>
                      <div className="text-muted-foreground">
                        Energy Generated
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">
                        {bio.symbioticEfficiency}%
                      </div>
                      <div className="text-muted-foreground">
                        Symbiotic Efficiency
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded p-3">
                    <div className="text-sm font-medium text-orange-700 mb-1">
                      Biological Network Contribution
                    </div>
                    <Progress
                      value={bio.symbioticEfficiency}
                      className="h-2 mb-2"
                    />
                    <div className="text-xs text-orange-600">
                      Living organism integrates seamlessly with technological
                      infrastructure, contributing{" "}
                      {bio.networkContribution.toLowerCase()} capabilities
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      Bio-Metrics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Health Status
                    </Button>
                    {bio.energyGenerated > 0 && (
                      <Button size="sm" variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        Energy Output
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
