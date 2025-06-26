import { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Target,
  TrendingUp,
  MessageCircle,
  Star,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "video" | "interactive" | "quiz" | "checklist";
  completed: boolean;
  prerequisites?: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  steps: OnboardingStep[];
  progress: number;
  category: string;
  icon: string;
}

const Onboarding = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const learningPaths: LearningPath[] = [
    {
      id: "getting-started",
      title: "🦁 Join the Pride - Getting Started",
      description:
        "Essential steps to become a successful member of the digital savanna ecosystem",
      level: "beginner",
      duration: "45 minutes",
      category: "basics",
      icon: "🦁",
      progress: 75,
      steps: [
        {
          id: "welcome",
          title: "Welcome to the Digital Savanna",
          description:
            "Introduction to our wildlife-themed marketplace and your role in the ecosystem",
          duration: "5 min",
          type: "video",
          completed: true,
        },
        {
          id: "profile-setup",
          title: "Create Your Animal Profile",
          description:
            "Set up your trader profile and choose your animal avatar",
          duration: "10 min",
          type: "interactive",
          completed: true,
        },
        {
          id: "navigation",
          title: "Navigate the Savanna",
          description:
            "Learn to use the platform's main features and navigation",
          duration: "15 min",
          type: "interactive",
          completed: true,
        },
        {
          id: "first-order",
          title: "Place Your First Order",
          description: "Complete your first transaction in the marketplace",
          duration: "10 min",
          type: "interactive",
          completed: false,
        },
        {
          id: "community",
          title: "Join the Pride Community",
          description: "Connect with other traders and join group buying pools",
          duration: "5 min",
          type: "checklist",
          completed: false,
        },
      ],
    },
    {
      id: "retailer-mastery",
      title: "🦌 Gazelle Retailer Mastery",
      description:
        "Advanced strategies for retail success with speed and agility",
      level: "intermediate",
      duration: "2 hours",
      category: "retailer",
      icon: "🦌",
      progress: 30,
      steps: [
        {
          id: "inventory-mgmt",
          title: "Smart Inventory Management",
          description: "Learn to optimize your inventory using AI predictions",
          duration: "30 min",
          type: "video",
          completed: true,
        },
        {
          id: "group-buying",
          title: "Master Group Buying",
          description: "Maximize savings through strategic group purchases",
          duration: "20 min",
          type: "interactive",
          completed: false,
        },
        {
          id: "customer-service",
          title: "Exceptional Customer Service",
          description:
            "Build customer loyalty and handle complaints effectively",
          duration: "25 min",
          type: "video",
          completed: false,
        },
        {
          id: "financial-mgmt",
          title: "Financial Management & BNPL",
          description: "Manage cash flow and use Buy Now Pay Later effectively",
          duration: "35 min",
          type: "interactive",
          completed: false,
        },
        {
          id: "scaling",
          title: "Scale Your Retail Business",
          description: "Growth strategies for expanding your retail operation",
          duration: "30 min",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: "supplier-excellence",
      title: "🐘 Elephant Supplier Excellence",
      description:
        "Leverage your strength and memory to dominate supply chains",
      level: "advanced",
      duration: "3 hours",
      category: "supplier",
      icon: "🐘",
      progress: 60,
      steps: [
        {
          id: "product-catalog",
          title: "Build a Winning Product Catalog",
          description: "Create compelling product listings that convert",
          duration: "45 min",
          type: "interactive",
          completed: true,
        },
        {
          id: "pricing-strategy",
          title: "Dynamic Pricing Strategies",
          description: "Use market data to optimize your pricing",
          duration: "40 min",
          type: "video",
          completed: true,
        },
        {
          id: "logistics-optimization",
          title: "Logistics & Fulfillment",
          description: "Optimize your supply chain and delivery network",
          duration: "50 min",
          type: "interactive",
          completed: false,
        },
        {
          id: "b2b-relationships",
          title: "Build Strong B2B Relationships",
          description: "Nurture long-term partnerships with retailers",
          duration: "35 min",
          type: "video",
          completed: false,
        },
        {
          id: "analytics-insights",
          title: "Data-Driven Decision Making",
          description: "Use analytics to grow your supplier business",
          duration: "30 min",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: "platform-mastery",
      title: "🦁 Platform Administration",
      description: "Advanced platform management and ecosystem leadership",
      level: "advanced",
      duration: "4 hours",
      category: "admin",
      icon: "🦁",
      progress: 90,
      steps: [
        {
          id: "user-management",
          title: "User Management & Permissions",
          description: "Manage users, roles, and access controls",
          duration: "60 min",
          type: "interactive",
          completed: true,
        },
        {
          id: "system-monitoring",
          title: "System Health & Monitoring",
          description: "Monitor platform performance and health metrics",
          duration: "45 min",
          type: "video",
          completed: true,
        },
        {
          id: "fraud-prevention",
          title: "Fraud Prevention & Security",
          description:
            "Implement security measures and detect fraudulent activity",
          duration: "50 min",
          type: "interactive",
          completed: true,
        },
        {
          id: "content-moderation",
          title: "Content Moderation",
          description: "Manage listings, reviews, and user-generated content",
          duration: "30 min",
          type: "checklist",
          completed: true,
        },
        {
          id: "growth-strategies",
          title: "Ecosystem Growth Strategies",
          description: "Scale the platform and expand to new markets",
          duration: "75 min",
          type: "quiz",
          completed: false,
        },
      ],
    },
  ];

  const quickStartGuides = [
    {
      title: "5-Minute Quick Start",
      description: "Get up and running immediately",
      icon: "⚡",
      duration: "5 min",
      type: "Interactive",
    },
    {
      title: "USSD Trading Guide",
      description: "Trade without internet using USSD",
      icon: "📱",
      duration: "10 min",
      type: "Video",
    },
    {
      title: "M-Pesa Integration",
      description: "Set up mobile payments",
      icon: "💰",
      duration: "8 min",
      type: "Step-by-step",
    },
    {
      title: "Group Buying Basics",
      description: "Save money with group purchases",
      icon: "👥",
      duration: "12 min",
      type: "Interactive",
    },
  ];

  const achievements = [
    {
      name: "First Steps",
      description: "Completed initial setup",
      icon: "🎯",
      unlocked: true,
    },
    {
      name: "Pride Member",
      description: "Joined the community",
      icon: "🦁",
      unlocked: true,
    },
    {
      name: "Quick Learner",
      description: "Finished 3 tutorials",
      icon: "⚡",
      unlocked: true,
    },
    {
      name: "Trading Pro",
      description: "Completed 10 orders",
      icon: "📈",
      unlocked: false,
    },
    {
      name: "Community Leader",
      description: "Helped 5 new users",
      icon: "👑",
      unlocked: false,
    },
    {
      name: "Savanna Expert",
      description: "Mastered all features",
      icon: "🏆",
      unlocked: false,
    },
  ];

  const selectedLearningPath = learningPaths.find(
    (path) => path.id === selectedPath,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            🎓 Savanna Academy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the art of digital trading in our wildlife-themed
            marketplace. From young cub to pride leader - your journey starts
            here.
          </p>
        </div>

        {!selectedPath ? (
          <Tabs defaultValue="paths" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="paths" className="space-y-8">
              {/* Learning Paths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {learningPaths.map((path) => (
                  <Card
                    key={path.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedPath(path.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{path.icon}</span>
                          <div>
                            <CardTitle className="text-xl">
                              {path.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                className={
                                  path.level === "beginner"
                                    ? "bg-green-100 text-green-700"
                                    : path.level === "intermediate"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }
                              >
                                {path.level}
                              </Badge>
                              <Badge variant="outline">{path.duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {path.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {path.steps.length} lessons
                          </span>
                          <Button>
                            Start Learning
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quick-start" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickStartGuides.map((guide, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{guide.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {guide.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {guide.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{guide.type}</Badge>
                            <Badge variant="outline">{guide.duration}</Badge>
                          </div>
                        </div>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className={`${achievement.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <CardContent className="pt-6 text-center">
                      <div
                        className={`text-4xl mb-3 ${!achievement.unlocked && "grayscale opacity-50"}`}
                      >
                        {achievement.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <Badge className="bg-green-600">Unlocked!</Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Documentation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Comprehensive guides, API docs, and best practices
                    </p>
                    <Button className="w-full">Browse Docs</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="h-5 w-5" />
                      <span>Video Library</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Step-by-step video tutorials for all platform features
                    </p>
                    <Button className="w-full">Watch Videos</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>Community Forum</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Connect with other traders and get help from experts
                    </p>
                    <Button className="w-full">Join Community</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          /* Learning Path Detail View */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedPath(null)}>
                ← Back to Paths
              </Button>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Materials
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Progress
                </Button>
              </div>
            </div>

            {selectedLearningPath && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">
                      {selectedLearningPath.icon}
                    </span>
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedLearningPath.title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {selectedLearningPath.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge>{selectedLearningPath.level}</Badge>
                        <Badge variant="outline">
                          {selectedLearningPath.duration}
                        </Badge>
                        <Badge variant="outline">
                          {selectedLearningPath.steps.length} lessons
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{selectedLearningPath.progress}%</span>
                      </div>
                      <Progress
                        value={selectedLearningPath.progress}
                        className="h-3"
                      />
                    </div>

                    <div className="space-y-3">
                      {selectedLearningPath.steps.map((step, index) => (
                        <Card
                          key={step.id}
                          className={`${step.completed ? "bg-green-50 border-green-200" : "hover:shadow-md"} transition-all duration-300`}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-2 rounded-full ${step.completed ? "bg-green-600" : "bg-gray-200"}`}
                              >
                                {step.completed ? (
                                  <CheckCircle className="h-5 w-5 text-white" />
                                ) : (
                                  <Clock className="h-5 w-5 text-gray-500" />
                                )}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-medium">{step.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">{step.type}</Badge>
                                  <Badge variant="outline">
                                    {step.duration}
                                  </Badge>
                                </div>
                              </div>

                              <Button
                                disabled={step.completed}
                                onClick={() => setCurrentStep(index)}
                              >
                                {step.completed ? "Completed" : "Start"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Progress Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Your Learning Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">75%</div>
                <div className="text-sm text-muted-foreground">
                  Course Completion
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">12h</div>
                <div className="text-sm text-muted-foreground">
                  Learning Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">8</div>
                <div className="text-sm text-muted-foreground">
                  Certificates Earned
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">94%</div>
                <div className="text-sm text-muted-foreground">
                  Quiz Average
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
