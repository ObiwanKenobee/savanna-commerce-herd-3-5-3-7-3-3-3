import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Volume2,
  Phone,
  MessageSquare,
  Users,
  TrendingUp,
  Star,
  Globe,
  Zap,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShoppingCart,
  Heart,
  Award,
  Headphones,
  Radio,
} from "lucide-react";

interface VoiceCommand {
  id: string;
  phrase: string;
  language: "sheng" | "kiswahili" | "english" | "mixed";
  translation: string;
  action: string;
  confidence: number;
  timestamp: string;
  userId: string;
  successful: boolean;
}

interface VoiceProduct {
  id: string;
  name: string;
  shengName: string;
  price: number;
  category: string;
  description: string;
  voiceSearchTerms: string[];
  purchaseCount: number;
  rating: number;
  audioDescription?: string;
}

interface VoiceUser {
  id: string;
  name: string;
  preferredLanguage: "sheng" | "kiswahili" | "english" | "mixed";
  voiceTrainingLevel: number;
  totalOrders: number;
  voiceAccuracy: number;
  location: string;
  phoneType: "smartphone" | "feature-phone" | "basic";
  internetSpeed: "fast" | "moderate" | "slow" | "offline";
}

interface ConversationSession {
  id: string;
  userId: string;
  startTime: string;
  duration: number;
  commands: number;
  successful: number;
  totalSpent: number;
  language: string;
  mood: "friendly" | "business" | "urgent" | "casual";
}

const ShengVoice = () => {
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [products, setProducts] = useState<VoiceProduct[]>([]);
  const [users, setUsers] = useState<VoiceUser[]>([]);
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "commands" | "products" | "training"
  >("overview");

  useEffect(() => {
    // Mock voice commands data
    const mockCommands: VoiceCommand[] = [
      {
        id: "cmd-001",
        phrase: "Nataka unga wa mahindi, bei ngapi?",
        language: "mixed",
        translation: "I want maize flour, what's the price?",
        action: "price_inquiry_maize_flour",
        confidence: 94,
        timestamp: "2 minutes ago",
        userId: "user-001",
        successful: true,
      },
      {
        id: "cmd-002",
        phrase: "Unaweza nipatie hiyo jacket ya blue?",
        language: "sheng",
        translation: "Can you give me that blue jacket?",
        action: "add_to_cart_blue_jacket",
        confidence: 87,
        timestamp: "5 minutes ago",
        userId: "user-002",
        successful: true,
      },
      {
        id: "cmd-003",
        phrase: "Nipe ile sukari ya kilo moja",
        language: "kiswahili",
        translation: "Give me that one kilogram of sugar",
        action: "add_to_cart_sugar_1kg",
        confidence: 96,
        timestamp: "8 minutes ago",
        userId: "user-003",
        successful: true,
      },
      {
        id: "cmd-004",
        phrase: "Sema vile bei ya soap imepanda",
        language: "sheng",
        translation: "Tell me how the soap price has increased",
        action: "price_trend_inquiry_soap",
        confidence: 78,
        timestamp: "12 minutes ago",
        userId: "user-001",
        successful: false,
      },
    ];

    // Mock products optimized for voice
    const mockProducts: VoiceProduct[] = [
      {
        id: "prod-001",
        name: "Unga wa Mahindi - 2kg",
        shengName: "Maizi flour ya kilo mbili",
        price: 140,
        category: "Food Staples",
        description: "High quality maize flour for ugali",
        voiceSearchTerms: [
          "unga",
          "mahindi",
          "maizi",
          "flour",
          "ugali",
          "chakula",
        ],
        purchaseCount: 2456,
        rating: 4.8,
        audioDescription:
          "Premium white maize flour, perfect for ugali and porridge",
      },
      {
        id: "prod-002",
        name: "Sabuni ya Nguo - 1kg",
        shengName: "Washing powder ya kilo moja",
        price: 180,
        category: "Household",
        description: "Washing powder for clothes",
        voiceSearchTerms: [
          "sabuni",
          "nguo",
          "washing",
          "powder",
          "detergent",
          "clean",
        ],
        purchaseCount: 1834,
        rating: 4.6,
        audioDescription: "Strong cleaning powder for all types of clothes",
      },
      {
        id: "prod-003",
        name: "Sukari ya Kilo Moja",
        shengName: "White sugar ya kilo moja",
        price: 120,
        category: "Food Staples",
        description: "White sugar for cooking and tea",
        voiceSearchTerms: [
          "sukari",
          "sugar",
          "white",
          "sweet",
          "tea",
          "cooking",
        ],
        purchaseCount: 3245,
        rating: 4.9,
        audioDescription: "Pure white sugar, ideal for tea and cooking",
      },
    ];

    // Mock voice users
    const mockUsers: VoiceUser[] = [
      {
        id: "user-001",
        name: "Mama Grace",
        preferredLanguage: "mixed",
        voiceTrainingLevel: 87,
        totalOrders: 34,
        voiceAccuracy: 92,
        location: "Kibera, Nairobi",
        phoneType: "feature-phone",
        internetSpeed: "slow",
      },
      {
        id: "user-002",
        name: "Brian Kimani",
        preferredLanguage: "sheng",
        voiceTrainingLevel: 73,
        totalOrders: 12,
        voiceAccuracy: 78,
        location: "Eastlands, Nairobi",
        phoneType: "smartphone",
        internetSpeed: "moderate",
      },
      {
        id: "user-003",
        name: "Mary Wanjiku",
        preferredLanguage: "kiswahili",
        voiceTrainingLevel: 95,
        totalOrders: 67,
        voiceAccuracy: 96,
        location: "Central Kenya",
        phoneType: "basic",
        internetSpeed: "offline",
      },
    ];

    // Mock conversation sessions
    const mockSessions: ConversationSession[] = [
      {
        id: "session-001",
        userId: "user-001",
        startTime: "10 minutes ago",
        duration: 3.5,
        commands: 8,
        successful: 7,
        totalSpent: 560,
        language: "mixed",
        mood: "friendly",
      },
      {
        id: "session-002",
        userId: "user-002",
        startTime: "25 minutes ago",
        duration: 2.1,
        commands: 4,
        successful: 3,
        totalSpent: 340,
        language: "sheng",
        mood: "casual",
      },
    ];

    setVoiceCommands(mockCommands);
    setProducts(mockProducts);
    setUsers(mockUsers);
    setSessions(mockSessions);
  }, []);

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "sheng":
        return "bg-purple-100 text-purple-700";
      case "kiswahili":
        return "bg-green-100 text-green-700";
      case "english":
        return "bg-blue-100 text-blue-700";
      case "mixed":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPhoneTypeColor = (phoneType: string) => {
    switch (phoneType) {
      case "smartphone":
        return "bg-green-100 text-green-700";
      case "feature-phone":
        return "bg-yellow-100 text-yellow-700";
      case "basic":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const playDemoCommand = (command: VoiceCommand) => {
    setCurrentDemo(command.id);
    // Simulate audio playback
    setTimeout(() => setCurrentDemo(null), 3000);
    alert(
      `🎵 Playing voice command:\n"${command.phrase}"\n\nTranslation: ${command.translation}\nAction: ${command.action}\nConfidence: ${command.confidence}%`,
    );
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      alert(
        '🎤 Voice recognized!\n\n"Nataka kitu cha kununua leo"\n(I want something to buy today)\n\n✅ Understood: Product inquiry\n🛍️ Opening product catalog...',
      );
    }, 3000);
  };

  const totalStats = {
    totalCommands: voiceCommands.length,
    successRate: Math.round(
      (voiceCommands.filter((cmd) => cmd.successful).length /
        voiceCommands.length) *
        100,
    ),
    averageConfidence: Math.round(
      voiceCommands.reduce((sum, cmd) => sum + cmd.confidence, 0) /
        voiceCommands.length,
    ),
    activeUsers: users.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎤 Sheng Voice Commerce
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Low-bandwidth voice AI</strong> for illiterate users. Shop
            using natural Sheng, Kiswahili, and mixed language voice commands -
            perfect for feature phones and low-connectivity areas.
          </p>
          <div className="mt-4 text-sm text-purple-600 font-medium">
            Natural Language • Low Bandwidth • Offline Capable • Multi-Language
            • Illiterate-Friendly Design
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Mic className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.totalCommands}
              </div>
              <div className="text-sm text-purple-600">Voice Commands</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.successRate}%
              </div>
              <div className="text-sm text-green-600">Success Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.averageConfidence}%
              </div>
              <div className="text-sm text-blue-600">Avg Confidence</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.activeUsers}
              </div>
              <div className="text-sm text-amber-600">Active Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Input Demo */}
        <Alert className="mb-8 border-purple-200 bg-purple-50">
          <Headphones className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Try Voice Shopping:</strong> Speak naturally in Sheng,
              Kiswahili, or English. Works on any phone, even without internet
              connection.
            </div>
            <Button
              onClick={simulateVoiceInput}
              disabled={isListening}
              size="sm"
              className="ml-4"
            >
              {isListening ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Try Voice
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "commands", "products", "training"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Activity className="h-4 w-4 mr-2" />}
                {tab === "commands" && (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                {tab === "products" && (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {tab === "training" && <Award className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Commands Tab */}
        {activeTab === "commands" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Command Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🗣️ Recent Voice Commands</h2>

              {voiceCommands.map((command) => (
                <Card
                  key={command.id}
                  className="hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getLanguageColor(command.language)}>
                            {command.language}
                          </Badge>
                          <Badge
                            variant={
                              command.successful ? "default" : "destructive"
                            }
                          >
                            {command.successful ? "Success" : "Failed"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {command.timestamp}
                          </span>
                        </div>
                        <div className="text-lg font-medium text-purple-800 mb-1">
                          "{command.phrase}"
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Translation: {command.translation}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {command.confidence}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-600">
                          Action Triggered:
                        </span>
                        <div className="capitalize">
                          {command.action.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">
                          User ID:
                        </span>
                        <div>{command.userId}</div>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Voice Recognition Confidence</span>
                        <span>{command.confidence}%</span>
                      </div>
                      <Progress
                        value={command.confidence}
                        className={`h-2 ${command.confidence >= 90 ? "bg-green-200" : command.confidence >= 70 ? "bg-yellow-200" : "bg-red-200"}`}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        onClick={() => playDemoCommand(command)}
                        disabled={currentDemo === command.id}
                      >
                        {currentDemo === command.id ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Play Audio
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                      {!command.successful && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Train AI
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Language Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Language Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["sheng", "kiswahili", "english", "mixed"].map((lang) => {
                      const count = voiceCommands.filter(
                        (cmd) => cmd.language === lang,
                      ).length;
                      const percentage = Math.round(
                        (count / voiceCommands.length) * 100,
                      );
                      return (
                        <div key={lang} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{lang}</span>
                            <span>{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* How Voice AI Works */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700">
                    Voice AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <strong>Natural Language:</strong> Understands street
                      language, slang, and mixed speech
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <strong>Low Bandwidth:</strong> Works on 2G networks and
                      basic phones
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <strong>Offline Mode:</strong> Basic shopping when
                      internet is unavailable
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <strong>User Learning:</strong> AI adapts to individual
                      speech patterns
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Phrases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Radio className="h-5 w-5" />
                    <span>Popular Phrases</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-purple-50 rounded text-sm">
                      <div className="font-medium">"Bei ya unga ni ngapi?"</div>
                      <div className="text-xs text-muted-foreground">
                        Price inquiry - 89% accuracy
                      </div>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <div className="font-medium">
                        "Nipe sukari ya kilo moja"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Add to cart - 94% accuracy
                      </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <div className="font-medium">"Nimemaliza shopping"</div>
                      <div className="text-xs text-muted-foreground">
                        Checkout - 96% accuracy
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>User Devices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {user.name}
                          </span>
                          <Badge className={getPhoneTypeColor(user.phoneType)}>
                            {user.phoneType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.location} • {user.voiceAccuracy}% accuracy
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {user.totalOrders} orders via voice
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
        {activeTab !== "commands" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                voice product training, pronunciation optimization, and natural
                language conversation flows.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShengVoice;
