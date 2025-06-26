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
  MapPin,
  Waves,
  Globe,
  Zap,
  Radio,
  Satellite,
  TreePine,
  Anchor,
  Target,
  Timer,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
} from "lucide-react";

interface Phase {
  id: string;
  name: string;
  terrain: string;
  techStack: string[];
  bioIntegration: string;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  status: "planning" | "active" | "testing" | "completed" | "paused";
  keyMetrics: {
    coverage: number;
    efficiency: number;
    adaptation: number;
    sustainability: number;
  };
}

interface TechStackItem {
  technology: string;
  description: string;
  status: "researching" | "developing" | "testing" | "deployed";
  readinessLevel: number;
}

interface BioIntegrationData {
  species: string;
  role: string;
  integrationLevel: number;
  contribution: string;
  symbioticBenefit: string;
}

interface TerrainFeature {
  id: string;
  name: string;
  characteristics: string[];
  challenges: string[];
  opportunities: string[];
  currentPhase: string;
}

export const ImplementationPhases = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPhase, setSelectedPhase] = useState("alpha");

  // Mock data
  const phases: Phase[] = [
    {
      id: "alpha",
      name: "Alpha",
      terrain: "Maasai Mara",
      techStack: ["LoRaWAN", "Elephant IoT", "Solar Microhubs"],
      bioIntegration: "Cattle as node carriers",
      progress: 78,
      startDate: "2024-01-01",
      estimatedCompletion: "2024-06-30",
      status: "active",
      keyMetrics: {
        coverage: 78,
        efficiency: 85,
        adaptation: 72,
        sustainability: 91,
      },
    },
    {
      id: "beta",
      name: "Beta",
      terrain: "Congo Basin",
      techStack: ["Mycelium Mesh", "DNA Tokens", "Atmospheric Blockchain"],
      bioIntegration: "Gorilla troop movement patterns",
      progress: 34,
      startDate: "2024-04-01",
      estimatedCompletion: "2024-12-31",
      status: "testing",
      keyMetrics: {
        coverage: 34,
        efficiency: 67,
        adaptation: 89,
        sustainability: 94,
      },
    },
    {
      id: "gamma",
      name: "Gamma",
      terrain: "Global Oceans",
      techStack: ["Atmospheric Blockchain", "Drone Fleets", "Marine IoT"],
      bioIntegration: "Whale song data storage",
      progress: 12,
      startDate: "2024-07-01",
      estimatedCompletion: "2025-12-31",
      status: "planning",
      keyMetrics: {
        coverage: 12,
        efficiency: 45,
        adaptation: 78,
        sustainability: 87,
      },
    },
  ];

  const techStacks: Record<string, TechStackItem[]> = {
    alpha: [
      {
        technology: "LoRaWAN Mesh Network",
        description: "Low-power wide-area network for Matatu fleet integration",
        status: "deployed",
        readinessLevel: 94,
      },
      {
        technology: "Elephant IoT Collars",
        description:
          "GPS tracking and conservation token mining via proof-of-migration",
        status: "testing",
        readinessLevel: 87,
      },
      {
        technology: "Solar Termite Mounds",
        description: "Self-replicating microhubs with 3D printing capabilities",
        status: "deployed",
        readinessLevel: 91,
      },
    ],
    beta: [
      {
        technology: "Mycelium Fiber Networks",
        description:
          "Organic fiber optics using fungal hyphae in forest ecosystems",
        status: "developing",
        readinessLevel: 67,
      },
      {
        technology: "DNA Marketplace",
        description:
          "Tokenized endangered species genetics for conservation funding",
        status: "testing",
        readinessLevel: 74,
      },
      {
        technology: "Sky Baobab Balloons",
        description: "High-altitude atmospheric blockchain processors",
        status: "researching",
        readinessLevel: 45,
      },
    ],
    gamma: [
      {
        technology: "Marine Atmospheric Network",
        description: "Ocean-spanning blockchain via stratospheric laser mesh",
        status: "researching",
        readinessLevel: 23,
      },
      {
        technology: "Whale Song Storage",
        description:
          "Biological data encoding in cetacean communication patterns",
        status: "researching",
        readinessLevel: 18,
      },
      {
        technology: "Autonomous Drone Fleets",
        description:
          "Self-coordinating marine conservation and logistics network",
        status: "developing",
        readinessLevel: 56,
      },
    ],
  };

  const bioIntegrations: Record<string, BioIntegrationData[]> = {
    alpha: [
      {
        species: "Maasai Cattle",
        role: "Mobile Network Nodes",
        integrationLevel: 89,
        contribution: "Carry LoRaWAN repeaters across grazing areas",
        symbioticBenefit: "Health monitoring and theft prevention",
      },
      {
        species: "African Elephants",
        role: "Migration Data Providers",
        integrationLevel: 76,
        contribution: "GPS tracking for route optimization",
        symbioticBenefit: "Conservation funding via blockchain tokens",
      },
    ],
    beta: [
      {
        species: "Forest Fungi",
        role: "Organic Network Infrastructure",
        integrationLevel: 67,
        contribution: "Mycelium as living fiber optic cables",
        symbioticBenefit: "Forest health monitoring and protection",
      },
      {
        species: "Mountain Gorillas",
        role: "Movement Pattern Analysis",
        integrationLevel: 54,
        contribution: "Behavioral data for network optimization",
        symbioticBenefit: "Habitat preservation and anti-poaching",
      },
    ],
    gamma: [
      {
        species: "Humpback Whales",
        role: "Data Storage Medium",
        integrationLevel: 23,
        contribution: "Song patterns encode blockchain data",
        symbioticBenefit: "Population tracking and ocean health",
      },
      {
        species: "Migratory Seabirds",
        role: "Network Connectivity",
        integrationLevel: 34,
        contribution: "Cross-ocean data relay systems",
        symbioticBenefit: "Migration route protection",
      },
    ],
  };

  const terrainFeatures: TerrainFeature[] = [
    {
      id: "maasai_mara",
      name: "Maasai Mara Savanna",
      characteristics: [
        "Open grasslands",
        "Seasonal migrations",
        "Traditional pastoral communities",
      ],
      challenges: [
        "Variable connectivity",
        "Weather extremes",
        "Wildlife interference",
      ],
      opportunities: [
        "Abundant solar energy",
        "Predictable animal movements",
        "Community partnership",
      ],
      currentPhase: "alpha",
    },
    {
      id: "congo_basin",
      name: "Congo Basin Rainforest",
      characteristics: [
        "Dense canopy coverage",
        "High biodiversity",
        "Complex ecosystems",
      ],
      challenges: ["Limited solar access", "High humidity", "Remote access"],
      opportunities: [
        "Rich fungal networks",
        "Stable microclimates",
        "Carbon sequestration",
      ],
      currentPhase: "beta",
    },
    {
      id: "global_oceans",
      name: "Global Ocean Systems",
      characteristics: [
        "Vast coverage",
        "Dynamic currents",
        "Marine ecosystems",
      ],
      challenges: [
        "Saltwater corrosion",
        "Extreme depths",
        "International regulations",
      ],
      opportunities: [
        "Unlimited space",
        "Renewable energy",
        "Global connectivity",
      ],
      currentPhase: "gamma",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "testing":
        return "bg-yellow-500";
      case "planning":
        return "bg-purple-500";
      case "paused":
        return "bg-red-500";
      case "deployed":
        return "bg-green-500";
      case "developing":
        return "bg-blue-500";
      case "researching":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case "alpha":
        return "🌍";
      case "beta":
        return "🌳";
      case "gamma":
        return "🌊";
      default:
        return "🚀";
    }
  };

  const getTerrainIcon = (terrain: string) => {
    if (terrain.includes("Mara")) return "🦁";
    if (terrain.includes("Congo")) return "🦍";
    if (terrain.includes("Ocean")) return "🐋";
    return "🌍";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Implementation Phases
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Terrain-specific rollout strategy from Maasai Mara grasslands to Congo
          rainforests to global ocean networks, with bio-technological
          evolutionary testbeds
        </p>
      </div>

      {/* Phase Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((phase) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all ${selectedPhase === phase.id ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setSelectedPhase(phase.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-lg">{getPhaseIcon(phase.id)}</span>
                Phase {phase.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {getTerrainIcon(phase.terrain)}
                  </span>
                  <span className="text-sm font-medium">{phase.terrain}</span>
                </div>
                <Progress value={phase.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{phase.progress}% complete</span>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="technology" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Tech Stack
          </TabsTrigger>
          <TabsTrigger value="biology" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Bio-Integration
          </TabsTrigger>
          <TabsTrigger value="terrain" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Terrain Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPhaseIcon(selectedPhase)}
                Phase {phases.find((p) => p.id === selectedPhase)?.name} -{" "}
                {phases.find((p) => p.id === selectedPhase)?.terrain}
              </CardTitle>
              <CardDescription>
                Evolutionary testbed for bio-technological infrastructure
                integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases
                .filter((p) => p.id === selectedPhase)
                .map((phase) => (
                  <div key={phase.id} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Timeline</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            Start:{" "}
                            {new Date(phase.startDate).toLocaleDateString()}
                          </div>
                          <div>
                            Target:{" "}
                            {new Date(
                              phase.estimatedCompletion,
                            ).toLocaleDateString()}
                          </div>
                          <div>Progress: {phase.progress}%</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Bio-Integration</h4>
                        <div className="text-sm text-muted-foreground">
                          {phase.bioIntegration}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Key Performance Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Coverage</span>
                            <span>{phase.keyMetrics.coverage}%</span>
                          </div>
                          <Progress
                            value={phase.keyMetrics.coverage}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficiency</span>
                            <span>{phase.keyMetrics.efficiency}%</span>
                          </div>
                          <Progress
                            value={phase.keyMetrics.efficiency}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Adaptation</span>
                            <span>{phase.keyMetrics.adaptation}%</span>
                          </div>
                          <Progress
                            value={phase.keyMetrics.adaptation}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sustainability</span>
                            <span>{phase.keyMetrics.sustainability}%</span>
                          </div>
                          <Progress
                            value={phase.keyMetrics.sustainability}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Technology Readiness - Phase{" "}
                {phases.find((p) => p.id === selectedPhase)?.name}
              </CardTitle>
              <CardDescription>
                Development status and readiness levels for terrain-specific
                technologies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {techStacks[selectedPhase]?.map((tech) => (
                <div
                  key={tech.technology}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{tech.technology}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(tech.status)}>
                      {tech.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Technology Readiness Level</span>
                      <span>{tech.readinessLevel}%</span>
                    </div>
                    <Progress value={tech.readinessLevel} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Technical Specs
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Performance Data
                    </Button>
                    {tech.status === "testing" && (
                      <Button size="sm" variant="outline">
                        <Timer className="h-3 w-3 mr-1" />
                        Test Results
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-green-500" />
                Biological Integration - Phase{" "}
                {phases.find((p) => p.id === selectedPhase)?.name}
              </CardTitle>
              <CardDescription>
                Species partnerships and symbiotic network contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bioIntegrations[selectedPhase]?.map((bio) => (
                <div
                  key={bio.species}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{bio.species}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bio.role}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {bio.integrationLevel}% integrated
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Integration Level</span>
                      <span>{bio.integrationLevel}%</span>
                    </div>
                    <Progress value={bio.integrationLevel} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600 mb-1">
                        Network Contribution
                      </div>
                      <div className="text-muted-foreground">
                        {bio.contribution}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600 mb-1">
                        Symbiotic Benefit
                      </div>
                      <div className="text-muted-foreground">
                        {bio.symbioticBenefit}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor Health
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Integration Metrics
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terrain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Terrain Analysis & Environmental Factors
              </CardTitle>
              <CardDescription>
                Geographic characteristics, challenges, and opportunities for
                each deployment zone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {terrainFeatures.map((terrain) => (
                <div
                  key={terrain.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getTerrainIcon(terrain.name)}
                    </span>
                    <div>
                      <h4 className="font-medium">{terrain.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Phase{" "}
                        {terrain.currentPhase.charAt(0).toUpperCase() +
                          terrain.currentPhase.slice(1)}{" "}
                        Deployment Zone
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600 mb-2">
                        Characteristics
                      </div>
                      <ul className="space-y-1">
                        {terrain.characteristics.map((char, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-red-600 mb-2">
                        Challenges
                      </div>
                      <ul className="space-y-1">
                        {terrain.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-green-600 mb-2">
                        Opportunities
                      </div>
                      <ul className="space-y-1">
                        {terrain.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      Geographic Data
                    </Button>
                    <Button size="sm" variant="outline">
                      <Satellite className="h-3 w-3 mr-1" />
                      Satellite Analysis
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Environmental Impact
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
