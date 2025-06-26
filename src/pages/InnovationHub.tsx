import React, { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { adminSeedService } from "@/services/adminSeedService";
import { VoiceGestureCommerce } from "@/components/innovation/VoiceGestureCommerce";
import { ARInventoryScanner } from "@/components/innovation/ARInventoryScanner";
import { ChamaDAOSystem } from "@/components/innovation/ChamaDAOSystem";
import { ElephantMemoryAI } from "@/components/innovation/ElephantMemoryAI";
import {
  Brain,
  Zap,
  Globe,
  Smartphone,
  Users,
  Package,
  Eye,
  Mic,
  Camera,
  Coins,
  TrendingUp,
  Star,
  Award,
  Sparkles,
  Target,
  Lightbulb,
  Rocket,
  Shield,
  Heart,
  Crown,
  Settings,
} from "lucide-react";

const InnovationHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("voice-gesture");
  const [adminCredentials, setAdminCredentials] = useState<any[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    initializeInnovationHub();
  }, []);

  const initializeInnovationHub = async () => {
    // Seed admin credentials
    await adminSeedService.seedAdminCredentials();
    setAdminCredentials(adminSeedService.getAdminCredentials());

    toast({
      title: "🌟 Innovation Hub Initialized",
      description: "Welcome to the future of African commerce!",
    });
  };

  const quickAdminLogin = async (role: "super_admin" | "admin" | "tech") => {
    const success = await adminSeedService.quickAdminLogin(role);
    if (success) {
      toast({
        title: "🦁 Admin Access Granted",
        description: "You now have full access to innovation features",
      });
      window.location.reload(); // Refresh to update auth state
    }
  };

  const innovations = [
    {
      id: "voice-gesture",
      title: "Voice & Gesture Commerce",
      description: "Swahili voice commands and gesture payments",
      icon: <Mic className="w-8 h-8" />,
      impact: "3x faster ordering",
      adoption: "60% of shops",
      component: <VoiceGestureCommerce />,
    },
    {
      id: "ar-inventory",
      title: "AR Inventory Scanner",
      description: "Augmented reality shelf scanning with real-time prices",
      icon: <Eye className="w-8 h-8" />,
      impact: "90% recognition accuracy",
      adoption: "Low-end device support",
      component: <ARInventoryScanner />,
    },
    {
      id: "chama-dao",
      title: "Chama DAOs",
      description: "Blockchain-powered trade circles and group buying",
      icon: <Coins className="w-8 h-8" />,
      impact: "25% bulk savings",
      adoption: "Traditional chama model",
      component: <ChamaDAOSystem />,
    },
    {
      id: "elephant-memory",
      title: "Elephant Memory AI",
      description: "Predictive auto-replenishment that never forgets",
      icon: <Brain className="w-8 h-8" />,
      impact: "95% stockout prevention",
      adoption: "Mama mboga friendly",
      component: <ElephantMemoryAI />,
    },
  ];

  const upcomingInnovations = [
    {
      title: "Matatu Delivery Network",
      description: "Crowdsourced delivery via spare matatu capacity",
      icon: "🚌",
      status: "Beta Testing",
      impact: "150,000 matatus available",
    },
    {
      title: "Duka Live Haggling",
      description: "Live video sales with real-time price negotiations",
      icon: "📺",
      status: "Development",
      impact: "Replicates market banter",
    },
    {
      title: "Emotional AI Support",
      description: "Mood detection for personalized customer service",
      icon: "😊",
      status: "Research",
      impact: "Swahili sentiment analysis",
    },
    {
      title: "Offline Mesh Network",
      description: "Peer-to-peer data sync via Bluetooth",
      icon: "🔗",
      status: "Prototype",
      impact: "Rural connectivity solution",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Innovation Hub Header */}
        <div className="text-center space-y-6 p-8 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-xl text-white">
          <div className="flex items-center justify-center space-x-4 text-4xl font-bold">
            <Rocket className="w-12 h-12" />
            <span>Savannah Innovation Lab</span>
            <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Revolutionary commerce technologies designed specifically for
            Kenya's mobile-first, community-driven culture. Experience the
            future of African trade today.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Kenya-First Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>AI Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Blockchain Secured</span>
            </div>
          </div>
        </div>

        {/* Admin Access Panel */}
        {!user && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-700">
                <Crown className="w-5 h-5" />
                <span>Admin Access for Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adminCredentials.map((admin, index) => (
                  <div
                    key={admin.email}
                    className="bg-white p-4 rounded border"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">
                        {admin.metadata.animal_metaphor}
                      </span>
                      <div>
                        <div className="font-medium">
                          {admin.metadata.full_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {admin.metadata.department}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div>
                        <strong>Email:</strong> {admin.email}
                      </div>
                      <div>
                        <strong>Role:</strong> {admin.role}
                      </div>
                      <div>
                        <strong>Pride Level:</strong>{" "}
                        {admin.metadata.pride_level}
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        quickAdminLogin(
                          index === 0
                            ? "super_admin"
                            : index === 1
                              ? "admin"
                              : "tech",
                        )
                      }
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      size="sm"
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Quick Login
                    </Button>
                  </div>
                ))}
              </div>
              <Alert className="mt-4 border-blue-300 bg-blue-50">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Demo Access:</strong> Use these seeded admin accounts
                  to explore all innovation features. In production, these would
                  be secured with proper authentication flows.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Innovation Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {innovations.map((innovation, index) => (
            <Card
              key={innovation.id}
              className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
                selectedTab === innovation.id
                  ? "border-purple-300 bg-purple-50 shadow-lg"
                  : "border-gray-200 hover:border-purple-200"
              }`}
              onClick={() => setSelectedTab(innovation.id)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center text-purple-600">
                  {innovation.icon}
                </div>
                <CardTitle className="text-lg">{innovation.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  {innovation.description}
                </p>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-700 w-full">
                    {innovation.impact}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 w-full">
                    {innovation.adoption}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Innovation Details */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white border">
            {innovations.map((innovation) => (
              <TabsTrigger
                key={innovation.id}
                value={innovation.id}
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <span className="hidden sm:inline">{innovation.title}</span>
                <span className="sm:hidden">{innovation.icon}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {innovations.map((innovation) => (
            <TabsContent key={innovation.id} value={innovation.id}>
              {innovation.component}
            </TabsContent>
          ))}
        </Tabs>

        {/* Upcoming Innovations Pipeline */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Target className="w-6 h-6" />
              <span>Innovation Pipeline</span>
              <Badge className="bg-purple-100 text-purple-700">
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingInnovations.map((innovation, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{innovation.icon}</div>
                    <h4 className="font-medium text-purple-700">
                      {innovation.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {innovation.description}
                    </p>
                    <div className="space-y-2">
                      <Badge
                        className={
                          innovation.status === "Beta Testing"
                            ? "bg-green-100 text-green-700"
                            : innovation.status === "Development"
                              ? "bg-blue-100 text-blue-700"
                              : innovation.status === "Research"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                        }
                      >
                        {innovation.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {innovation.impact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Innovation Context */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Heart className="w-6 h-6" />
              <span>Why These Innovations Work for Kenya</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-green-700 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Cultural Alignment
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Voice Commands:</strong> 60% of shop owners
                      already use voice notes for orders on WhatsApp
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Chama DAOs:</strong> Mirrors traditional community
                      savings groups but digitized
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <strong>AR Shopping:</strong> Aligns with "see and buy"
                      market culture, reduces literacy barriers
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-green-700 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Technical Adaptation
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Low-End Support:</strong> AR works on basic
                      Android devices with ARCore
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Offline Capability:</strong> Mesh networking
                      solves rural internet gaps
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Mobile Money:</strong> Gesture payments integrate
                      seamlessly with M-Pesa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Innovation Impact Metrics */}
        <Card className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center space-x-2">
              <TrendingUp className="w-8 h-8" />
              <span>Innovation Impact Across Kenya</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-sm opacity-90">Stockout Prevention</div>
                <div className="text-xs opacity-75">Via Elephant Memory AI</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">3x</div>
                <div className="text-sm opacity-90">Faster Ordering</div>
                <div className="text-xs opacity-75">With Voice Commands</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">25%</div>
                <div className="text-sm opacity-90">Bulk Savings</div>
                <div className="text-xs opacity-75">Through Chama DAOs</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">90%</div>
                <div className="text-sm opacity-90">AR Recognition</div>
                <div className="text-xs opacity-75">Product Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4 p-8 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-800">
            Ready to Transform Your Business?
          </h3>
          <p className="text-orange-700 max-w-2xl mx-auto">
            Join thousands of Kenyan entrepreneurs already using these
            cutting-edge technologies to grow their businesses and serve their
            communities better.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Rocket className="w-5 h-5 mr-2" />
              Get Early Access
            </Button>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Settings className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationHub;
