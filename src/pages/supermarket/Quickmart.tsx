import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Clock,
  Star,
  ShoppingCart,
  Target,
  Activity,
  Volume2,
  Mic,
  Users,
  Timer,
  Gauge,
  Award,
  MapPin,
  Eye,
  BarChart3,
  Smartphone,
  Phone,
} from "lucide-react";

interface FlashSaleCampaign {
  id: string;
  name: string;
  type: "wildebeest-stampede" | "lions-share" | "cheetah-dash";
  product: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  timeRemaining: string;
  soldCount: number;
  targetCount: number;
  status: "active" | "upcoming" | "completed";
  animalSound: string;
}

interface VoiceprintUser {
  id: string;
  name: string;
  phrase: string; // Swahili phrase for authentication
  confidence: number;
  lastUsed: string;
  totalPurchases: number;
}

interface CheetahMetric {
  metric: string;
  value: number;
  unit: string;
  icon: string;
  status: "excellent" | "good" | "average" | "needs-attention";
  comparison: string;
}

const Quickmart = () => {
  const [flashSales, setFlashSales] = useState<FlashSaleCampaign[]>([]);
  const [voiceprintUsers, setVoiceprintUsers] = useState<VoiceprintUser[]>([]);
  const [cheetahMetrics, setCheetahMetrics] = useState<CheetahMetric[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceSetupMode, setVoiceSetupMode] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");

  useEffect(() => {
    // Mock flash sale campaigns data
    const mockFlashSales: FlashSaleCampaign[] = [
      {
        id: "fs-001",
        name: "Wildebeest Stampede - Cooking Oil",
        type: "wildebeest-stampede",
        product: "Cooking Oil 2L",
        originalPrice: 450,
        flashPrice: 320,
        discount: 29,
        timeRemaining: "2h 34m",
        soldCount: 847,
        targetCount: 1000,
        status: "active",
        animalSound: "🦌 Wildebeest Roar",
      },
      {
        id: "fs-002",
        name: "Lion's Share - Maize Flour",
        type: "lions-share",
        product: "Maize Flour 5kg",
        originalPrice: 380,
        flashPrice: 290,
        discount: 24,
        timeRemaining: "45m 12s",
        soldCount: 234,
        targetCount: 500,
        status: "active",
        animalSound: "🦁 Lion Roar",
      },
      {
        id: "fs-003",
        name: "Cheetah Dash - Sugar",
        type: "cheetah-dash",
        product: "Sugar 2kg",
        originalPrice: 180,
        flashPrice: 145,
        discount: 19,
        timeRemaining: "6h 45m",
        soldCount: 67,
        targetCount: 200,
        status: "upcoming",
        animalSound: "🐆 Cheetah Purr",
      },
    ];
    setFlashSales(mockFlashSales);

    // Mock voiceprint users
    const mockVoiceUsers: VoiceprintUser[] = [
      {
        id: "vu-001",
        name: "Grace Wanjiku",
        phrase: "Habari za asubuhi, nina hitaji chakula",
        confidence: 94,
        lastUsed: "2 hours ago",
        totalPurchases: 67,
      },
      {
        id: "vu-002",
        name: "James Otieno",
        phrase: "Jambo, nataka ununue sukari",
        confidence: 89,
        lastUsed: "Yesterday",
        totalPurchases: 34,
      },
      {
        id: "vu-003",
        name: "Sarah Njeri",
        phrase: "Shikamoo, nina bei nzuri",
        confidence: 97,
        lastUsed: "5 minutes ago",
        totalPurchases: 123,
      },
    ];
    setVoiceprintUsers(mockVoiceUsers);

    // Mock cheetah speed metrics
    const mockMetrics: CheetahMetric[] = [
      {
        metric: "Checkout Speed",
        value: 23,
        unit: "seconds",
        icon: "⚡",
        status: "excellent",
        comparison: "67% faster than average",
      },
      {
        metric: "Stock Movement",
        value: 2.4,
        unit: "items/min",
        icon: "📦",
        status: "good",
        comparison: "Above target velocity",
      },
      {
        metric: "Customer Flow",
        value: 145,
        unit: "customers/hour",
        icon: "🚶",
        status: "excellent",
        comparison: "Peak performance",
      },
      {
        metric: "Voice Recognition",
        value: 92,
        unit: "% accuracy",
        icon: "🎤",
        status: "good",
        comparison: "Improving daily",
      },
      {
        metric: "Flash Sale Conversion",
        value: 78,
        unit: "% conversion",
        icon: "⚡",
        status: "excellent",
        comparison: "Lions pride level",
      },
      {
        metric: "Alert Response Time",
        value: 1.3,
        unit: "seconds",
        icon: "🔔",
        status: "excellent",
        comparison: "Cheetah reflexes",
      },
    ];
    setCheetahMetrics(mockMetrics);
  }, []);

  const playAnimalSound = (sound: string) => {
    if (audioEnabled) {
      // In a real implementation, this would play actual audio
      console.log(`Playing sound: ${sound}`);
      // Simulate audio feedback
      const audio = new Audio(); // Would load actual animal sound files
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "wildebeest-stampede":
        return "🦌";
      case "lions-share":
        return "🦁";
      case "cheetah-dash":
        return "🐆";
      default:
        return "⚡";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "average":
        return "text-yellow-600 bg-yellow-50";
      case "needs-attention":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const swahiliPhrases = [
    "Habari za asubuhi, nina hitaji chakula",
    "Jambo, nataka ununue sukari",
    "Shikamoo, nina bei nzuri",
    "Hujambo, ninahitaji mafuta",
    "Mambo, nina bidhaa za chakula",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🐆</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Quickmart Cheetah Command Center
              </h1>
              <p className="text-lg text-gray-600">
                Lightning-fast operations with animal sound alerts & voiceprint
                checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              🏪 Thika Road Branch
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              🟢 Live Operations
            </Badge>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Animal Sound Alerts</span>
              <Switch
                checked={audioEnabled}
                onCheckedChange={setAudioEnabled}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Flash Sales</TabsTrigger>
            <TabsTrigger value="voiceprint">Voiceprint Checkout</TabsTrigger>
            <TabsTrigger value="metrics">Cheetah Metrics</TabsTrigger>
            <TabsTrigger value="sounds">Sound Alerts</TabsTrigger>
          </TabsList>

          {/* Flash Sale Campaigns */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  Active Flash Sale Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flashSales.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getCampaignTypeIcon(campaign.type)}
                            </span>
                            <div>
                              <h3 className="font-semibold text-sm">
                                {campaign.name}
                              </h3>
                              <Badge
                                className={getCampaignStatusColor(
                                  campaign.status,
                                )}
                              >
                                {campaign.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-lg font-bold">
                              {campaign.product}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-green-600">
                                KSH {campaign.flashPrice}
                              </span>
                              <span className="text-sm line-through text-gray-500">
                                KSH {campaign.originalPrice}
                              </span>
                              <Badge className="bg-red-100 text-red-800">
                                -{campaign.discount}%
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                Progress: {campaign.soldCount}/
                                {campaign.targetCount}
                              </span>
                              <span>
                                {Math.round(
                                  (campaign.soldCount / campaign.targetCount) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (campaign.soldCount / campaign.targetCount) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {campaign.timeRemaining}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() =>
                                playAnimalSound(campaign.animalSound)
                              }
                              className="flex items-center gap-1"
                            >
                              <Volume2 className="h-3 w-3" />
                              {campaign.animalSound.split(" ")[1]}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Campaign Control Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">🦌</span>
                    <span>Launch Wildebeest Stampede</span>
                    <span className="text-xs text-gray-500">
                      Mass discount event
                    </span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">🦁</span>
                    <span>Start Lion's Share</span>
                    <span className="text-xs text-gray-500">
                      Premium product focus
                    </span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">🐆</span>
                    <span>Activate Cheetah Dash</span>
                    <span className="text-xs text-gray-500">
                      Quick clearance sale
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voiceprint Checkout */}
          <TabsContent value="voiceprint" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-6 w-6" />
                  Voiceprint Checkout System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Customers can checkout using their unique voice signature
                    with traditional Swahili phrases. 🎤 Secure, fast, and
                    culturally authentic authentication.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registered Users */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Registered Voiceprint Users
                    </h3>
                    <div className="space-y-3">
                      {voiceprintUsers.map((user) => (
                        <Card key={user.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{user.name}</div>
                            <Badge
                              className={
                                user.confidence >= 95
                                  ? "bg-green-100 text-green-800"
                                  : user.confidence >= 90
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {user.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            "{user.phrase}"
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Last used: {user.lastUsed}</span>
                            <span>{user.totalPurchases} purchases</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Voice Setup */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Voice Registration
                    </h3>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Select Swahili Phrase:
                          </label>
                          <select
                            className="w-full mt-1 p-2 border rounded-md"
                            value={currentPhrase}
                            onChange={(e) => setCurrentPhrase(e.target.value)}
                          >
                            <option value="">Choose a phrase...</option>
                            {swahiliPhrases.map((phrase, index) => (
                              <option key={index} value={phrase}>
                                {phrase}
                              </option>
                            ))}
                          </select>
                        </div>

                        {currentPhrase && (
                          <div className="p-3 bg-blue-50 rounded-md">
                            <div className="text-sm font-medium mb-1">
                              Translation:
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentPhrase ===
                                "Habari za asubuhi, nina hitaji chakula" &&
                                "Good morning, I need food"}
                              {currentPhrase ===
                                "Jambo, nataka ununue sukari" &&
                                "Hello, I want to buy sugar"}
                              {currentPhrase === "Shikamoo, nina bei nzuri" &&
                                "Greetings, I have a good price"}
                              {currentPhrase === "Hujambo, ninahitaji mafuta" &&
                                "How are you, I need oil"}
                              {currentPhrase ===
                                "Mambo, nina bidhaa za chakula" &&
                                "What's up, I have food products"}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button className="flex-1" disabled={!currentPhrase}>
                            <Mic className="h-4 w-4 mr-2" />
                            Record Voice Sample
                          </Button>
                          <Button variant="outline" disabled={!currentPhrase}>
                            Test Recognition
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cheetah Speed Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-6 w-6" />
                  Cheetah Speed Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cheetahMetrics.map((metric, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{metric.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-600">
                              {metric.metric}
                            </h3>
                            <div className="text-2xl font-bold">
                              {metric.value} {metric.unit}
                            </div>
                            <Badge
                              className={getMetricStatusColor(metric.status)}
                            >
                              {metric.status.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {metric.comparison}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Daily Speed Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Fastest Checkout</span>
                      <span className="font-bold">18 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Customer Flow</span>
                      <span className="font-bold">167/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best Voice Recognition</span>
                      <span className="font-bold">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Cheetah Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className="w-full justify-center py-2 bg-gold-100 text-gold-800">
                      🏆 Speed Champion - 7 days
                    </Badge>
                    <Badge className="w-full justify-center py-2 bg-silver-100 text-silver-800">
                      🥈 Voice Accuracy Leader
                    </Badge>
                    <Badge className="w-full justify-center py-2 bg-bronze-100 text-bronze-800">
                      🥉 Flash Sale Master
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Improvement Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Voice Recognition</span>
                        <span>92% → 95%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Checkout Speed</span>
                        <span>23s → 20s</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Animal Sound Alerts */}
          <TabsContent value="sounds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-6 w-6" />
                  Animal Sound Alert System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Volume2 className="h-4 w-4" />
                  <AlertDescription>
                    Each operation has a unique animal sound for audio feedback.
                    Staff and customers learn to associate sounds with different
                    events for faster response times.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sound Categories */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Alert Sound Library
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          animal: "Lion",
                          emoji: "🦁",
                          sound: "Roar",
                          event: "Flash sale started",
                          file: "lion-roar.mp3",
                        },
                        {
                          animal: "Elephant",
                          emoji: "🐘",
                          sound: "Trumpet",
                          event: "Large order received",
                          file: "elephant-trumpet.mp3",
                        },
                        {
                          animal: "Zebra",
                          emoji: "🦓",
                          sound: "Neigh",
                          event: "Stock level warning",
                          file: "zebra-neigh.mp3",
                        },
                        {
                          animal: "Cheetah",
                          emoji: "🐆",
                          sound: "Purr",
                          event: "Speed record achieved",
                          file: "cheetah-purr.mp3",
                        },
                        {
                          animal: "Hyena",
                          emoji: "🐺",
                          sound: "Laugh",
                          event: "Payment completed",
                          file: "hyena-laugh.mp3",
                        },
                        {
                          animal: "Rhino",
                          emoji: "🦏",
                          sound: "Snort",
                          event: "Security alert",
                          file: "rhino-snort.mp3",
                        },
                      ].map((item, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <div>
                                <div className="font-medium">
                                  {item.animal} {item.sound}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {item.event}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => playAnimalSound(item.sound)}
                              disabled={!audioEnabled}
                            >
                              Play
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Sound Controls */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Audio Controls
                    </h3>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Master Audio</span>
                          <Switch
                            checked={audioEnabled}
                            onCheckedChange={setAudioEnabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Volume Level
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="75"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Audio Zones
                          </label>
                          <div className="space-y-2">
                            {[
                              "Checkout Area",
                              "Store Floor",
                              "Stock Room",
                              "Customer Service",
                            ].map((zone) => (
                              <div
                                key={zone}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{zone}</span>
                                <Switch defaultChecked />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full">Test All Sounds</Button>
                      </div>
                    </Card>

                    {/* Sound Statistics */}
                    <Card className="p-4 mt-4">
                      <h4 className="font-semibold mb-3">
                        Today's Sound Activity
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>🦁 Lion roars (Flash sales)</span>
                          <span>23</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🐘 Elephant trumpets (Large orders)</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🐆 Cheetah purrs (Speed records)</span>
                          <span>67</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🦓 Zebra neighs (Stock alerts)</span>
                          <span>12</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Quickmart;
