import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Play,
  BookOpen,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Download,
  Smartphone,
  Globe,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  progress: number;
  rating: number;
  students: number;
  language: "en" | "sw" | "both";
  certificateAvailable: boolean;
  thumbnail: string;
  instructor: string;
}

const TrainingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState<
    "en" | "sw" | "both"
  >("both");

  const courses: Course[] = [
    {
      id: "1",
      title: "Digital Trading Basics for Kenyan Retailers",
      description:
        "Learn the fundamentals of online business and M-Pesa integration",
      duration: "2 hours",
      level: "beginner",
      category: "business",
      progress: 75,
      rating: 4.8,
      students: 1250,
      language: "both",
      certificateAvailable: true,
      thumbnail: "🛒",
      instructor: "Mary Wanjiku",
    },
    {
      id: "2",
      title: "Inventory Management with Baobab Stock",
      description:
        "Master stock control using traditional wisdom and modern tools",
      duration: "1.5 hours",
      level: "intermediate",
      category: "inventory",
      progress: 30,
      rating: 4.7,
      students: 890,
      language: "en",
      certificateAvailable: true,
      thumbnail: "📦",
      instructor: "James Kipkoech",
    },
    {
      id: "3",
      title: "M-Pesa for Business (Biashara)",
      description: "Utafunzi kamili wa kutumia M-Pesa katika biashara yako",
      duration: "45 minutes",
      level: "beginner",
      category: "payments",
      progress: 100,
      rating: 4.9,
      students: 2100,
      language: "sw",
      certificateAvailable: true,
      thumbnail: "💳",
      instructor: "Grace Mutindi",
    },
    {
      id: "4",
      title: "Group Buying Pool Strategies",
      description:
        "How to organize and benefit from bulk purchasing with neighbors",
      duration: "1 hour",
      level: "intermediate",
      category: "collaboration",
      progress: 0,
      rating: 4.6,
      students: 650,
      language: "both",
      certificateAvailable: false,
      thumbnail: "🤝",
      instructor: "Samuel Otieno",
    },
    {
      id: "5",
      title: "USSD Trading Mastery",
      description: "Trade efficiently using *384# without internet",
      duration: "30 minutes",
      level: "beginner",
      category: "ussd",
      progress: 60,
      rating: 4.5,
      students: 1800,
      language: "both",
      certificateAvailable: true,
      thumbnail: "📱",
      instructor: "Peter Kiprotich",
    },
    {
      id: "6",
      title: "Supplier Analytics & Rhino Score",
      description: "Advanced business intelligence for suppliers",
      duration: "3 hours",
      level: "advanced",
      category: "analytics",
      progress: 15,
      rating: 4.8,
      students: 420,
      language: "en",
      certificateAvailable: true,
      thumbnail: "📊",
      instructor: "Dr. Christine Wambui",
    },
  ];

  const categories = [
    { id: "all", name: "All Courses", emoji: "🎓", count: courses.length },
    {
      id: "business",
      name: "Business Basics",
      emoji: "💼",
      count: courses.filter((c) => c.category === "business").length,
    },
    {
      id: "payments",
      name: "M-Pesa & Payments",
      emoji: "💳",
      count: courses.filter((c) => c.category === "payments").length,
    },
    {
      id: "inventory",
      name: "Stock Management",
      emoji: "📦",
      count: courses.filter((c) => c.category === "inventory").length,
    },
    {
      id: "ussd",
      name: "USSD Trading",
      emoji: "📱",
      count: courses.filter((c) => c.category === "ussd").length,
    },
    {
      id: "analytics",
      name: "Business Intelligence",
      emoji: "📊",
      count: courses.filter((c) => c.category === "analytics").length,
    },
  ];

  const achievements = [
    {
      name: "Digital Trader",
      description: "Completed first course",
      icon: "🎯",
      earned: true,
    },
    {
      name: "M-Pesa Master",
      description: "Payment course completed",
      icon: "💚",
      earned: true,
    },
    {
      name: "Stock Guru",
      description: "Inventory management certified",
      icon: "📦",
      earned: false,
    },
    {
      name: "USSD Champion",
      description: "Offline trading expert",
      icon: "📱",
      earned: true,
    },
    {
      name: "Analytics Expert",
      description: "Business intelligence certified",
      icon: "🧠",
      earned: false,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesLanguage =
      selectedLanguage === "both" ||
      course.language === selectedLanguage ||
      course.language === "both";
    return matchesCategory && matchesLanguage;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "en":
        return "🇬🇧";
      case "sw":
        return "🇰🇪";
      case "both":
        return "🌍";
      default:
        return "🌍";
    }
  };

  const totalProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length,
  );
  const completedCourses = courses.filter(
    (course) => course.progress === 100,
  ).length;
  const certificatesEarned = courses.filter(
    (course) => course.progress === 100 && course.certificateAvailable,
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🎓 Training Hub
                </h1>
                <p className="text-gray-600">
                  Learn & grow your business skills
                </p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Overall Progress
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {totalProgress}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <Progress value={totalProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {completedCourses}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Certificates
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {certificatesEarned}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Learning Hours
                      </p>
                      <p className="text-2xl font-bold text-blue-600">24.5</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Achievements */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id ? "default" : "ghost"
                        }
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.emoji}</span>
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Preference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { id: "both", name: "All Languages", flag: "🌍" },
                      { id: "en", name: "English Only", flag: "🇬🇧" },
                      { id: "sw", name: "Kiswahili Only", flag: "🇰🇪" },
                    ].map((lang) => (
                      <Button
                        key={lang.id}
                        variant={
                          selectedLanguage === lang.id ? "default" : "ghost"
                        }
                        onClick={() => setSelectedLanguage(lang.id as any)}
                        className="w-full justify-start"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>🏆 Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${achievement.earned ? "bg-yellow-50" : "bg-gray-50"}`}
                      >
                        <span
                          className={`text-2xl ${achievement.earned ? "" : "grayscale"}`}
                        >
                          {achievement.icon}
                        </span>
                        <div className="flex-1">
                          <div
                            className={`font-medium text-sm ${achievement.earned ? "text-yellow-800" : "text-gray-600"}`}
                          >
                            {achievement.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Course Grid */}
            <div className="lg:col-span-3">
              {/* Featured Learning Path */}
              <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        🦁 Kenya Retail Mastery Path
                      </h3>
                      <p className="text-purple-100 mb-4">
                        Complete journey from basics to advanced trading
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>8 hours total</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>Certificate included</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>1,200+ students</span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      Start Path
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {course.thumbnail}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                              {course.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              By {course.instructor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">
                            {getLanguageFlag(course.language)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Course Meta */}
                        <div className="flex items-center justify-between text-sm">
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                          <div className="flex items-center space-x-4 text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= course.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {course.rating}
                            </span>
                          </div>
                          {course.certificateAvailable && (
                            <Badge
                              variant="outline"
                              className="text-yellow-600 border-yellow-600"
                            >
                              <Award className="h-3 w-3 mr-1" />
                              Certificate
                            </Badge>
                          )}
                        </div>

                        {/* Progress */}
                        {course.progress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {course.progress > 0 ? (
                            <Button className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                          ) : (
                            <Button className="flex-1" variant="outline">
                              <Play className="h-4 w-4 mr-2" />
                              Start Course
                            </Button>
                          )}

                          {course.progress === 100 &&
                            course.certificateAvailable && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                        </div>

                        {/* Offline Support */}
                        {course.category === "ussd" && (
                          <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                            📱 Works offline via USSD (*384#)
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* USSD Learning Option */}
              <Card className="mt-8 bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-800">
                          📱 Learn via USSD
                        </h3>
                        <p className="text-sm text-green-700">
                          Access training content without internet
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        *384*7*9#
                      </div>
                      <div className="text-xs text-green-600">
                        Training Menu
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Learning */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>🦏 Community Learning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Join fellow traders in WhatsApp learning groups organized
                      by county and business type.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <span className="mr-2">💬</span>
                        Nairobi Retailers
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <span className="mr-2">🏪</span>
                        Mombasa Suppliers
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <span className="mr-2">🚛</span>
                        Logistics Network
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <span className="mr-2">👥</span>
                        Women in Business
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default TrainingPage;
