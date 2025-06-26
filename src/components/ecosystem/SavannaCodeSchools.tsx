import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Code,
  GraduationCap,
  Trophy,
  PlayCircle,
  BookOpen,
  Shield,
  Zap,
  Users,
  Target,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

interface CodeLesson {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  language: "Swahili" | "English";
  conservationTopic: string;
  codeExample: string;
  expectedOutput: string;
  completed: boolean;
}

interface Student {
  name: string;
  location: string;
  progress: number;
  antiPoachingToolsBuilt: number;
  deploymentsOnSavannah: number;
}

const defaultLessons: CodeLesson[] = [
  {
    id: "lesson-001",
    title: "Elephant Poaching Alert System",
    description: "Unda mfumo wa tahadhari wa ujangili wa tembo",
    difficulty: "Beginner",
    language: "Swahili",
    conservationTopic: "Anti-Poaching",
    codeExample: `# Mfumo wa Tahadhari wa Ujangili wa Tembo
def elephant_poaching_alert():
    if detect_gunshot_sound():
        location = get_gps_coordinates()
        send_alert_to_rangers(location)
        activate_drone_response(location)
        print(f"🚨 Tahadhari! Ujangili umegunduliwa: {location}")
        return True
    return False

# Tumia mfumo
if elephant_poaching_alert():
    print("✅ Askari wamearifu!")`,
    expectedOutput:
      "🚨 Tahadhari! Ujangili umegunduliwa: -2.1234°S, 35.5678°E\n✅ Askari wamearifu!",
    completed: false,
  },
  {
    id: "lesson-002",
    title: "Wildlife Migration Predictor",
    description: "Predict animal migration patterns using AI",
    difficulty: "Intermediate",
    language: "English",
    conservationTopic: "Migration Tracking",
    codeExample: `# Wildlife Migration Prediction API
import savannah_conservation_api as sca

def predict_migration_route(species, season):
    historical_data = sca.get_migration_data(species, years=5)
    weather_forecast = sca.get_weather_forecast(30)
    
    # AI model prediction
    prediction = sca.ai_predict({
        'species': species,
        'season': season,
        'weather': weather_forecast,
        'historical': historical_data
    })
    
    return {
        'route': prediction.route,
        'timing': prediction.timing,
        'confidence': prediction.confidence
    }

# Deploy on Savannah infrastructure
migration_data = predict_migration_route('wildebeest', 'dry_season')
sca.deploy_to_savannah(migration_data)`,
    expectedOutput:
      "✅ Migration route predicted with 89% confidence\n🚀 Deployed to Savannah infrastructure",
    completed: true,
  },
  {
    id: "lesson-003",
    title: "Community Water Source Monitor",
    description: "Fuatilia vyanzo vya maji vya jamii",
    difficulty: "Advanced",
    language: "Swahili",
    conservationTopic: "Water Conservation",
    codeExample: `# Mfumo wa Ufuatiliaji wa Maji
class WaterSourceMonitor:
    def __init__(self, borehole_id):
        self.borehole_id = borehole_id
        self.iot_sensors = self.connect_sensors()
    
    def check_water_levels(self):
        level = self.iot_sensors.get_water_level()
        quality = self.iot_sensors.get_water_quality()
        
        if level < 20:  # chini ya 20%
            self.alert_community("💧 Maji yamepungua!")
            self.suggest_alternatives()
        
        return {
            'level': level,
            'quality': quality,
            'status': 'OK' if level > 50 else 'LOW'
        }

# Tumia katika jamii
monitor = WaterSourceMonitor("BORE_001")
status = monitor.check_water_levels()`,
    expectedOutput: "💧 Water level: 75%\n✅ Quality: Excellent\n📊 Status: OK",
    completed: false,
  },
];

const topStudents: Student[] = [
  {
    name: "Amina Mwangi",
    location: "Nairobi",
    progress: 95,
    antiPoachingToolsBuilt: 3,
    deploymentsOnSavannah: 5,
  },
  {
    name: "Joseph Kimani",
    location: "Mombasa",
    progress: 87,
    antiPoachingToolsBuilt: 2,
    deploymentsOnSavannah: 3,
  },
  {
    name: "Grace Wanjiku",
    location: "Kisumu",
    progress: 82,
    antiPoachingToolsBuilt: 4,
    deploymentsOnSavannah: 2,
  },
];

export const SavannaCodeSchools = () => {
  const [lessons, setLessons] = useState<CodeLesson[]>(defaultLessons);
  const [currentLesson, setCurrentLesson] = useState<CodeLesson>(lessons[0]);
  const [userCode, setUserCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [studentStats, setStudentStats] = useState({
    lessonsCompleted: 15,
    toolsDeployed: 3,
    conservationImpact: 67,
    certificatesEarned: 2,
  });

  const runCode = async () => {
    setIsRunning(true);
    setCodeOutput("🔄 Executing code...");

    // Simulate code execution
    setTimeout(() => {
      if (
        userCode.includes("elephant_poaching_alert") ||
        userCode.includes("activate_drone_response")
      ) {
        setCodeOutput(currentLesson.expectedOutput);
        // Mark lesson as completed
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === currentLesson.id
              ? { ...lesson, completed: true }
              : lesson,
          ),
        );
        setStudentStats((prev) => ({
          ...prev,
          lessonsCompleted: prev.lessonsCompleted + 1,
        }));
      } else {
        setCodeOutput(
          "❌ Code execution failed. Please check your implementation.",
        );
      }
      setIsRunning(false);
    }, 2000);
  };

  const deployToSavannah = () => {
    if (currentLesson.completed) {
      alert(
        `🚀 Deploying ${currentLesson.title} to Savannah Infrastructure!\n\n✅ Your anti-poaching tool is now live\n🌍 Protecting wildlife across Kenya\n🏆 +50 Conservation Points earned\n\nCongratulations! Your code is making a real difference.`,
      );
      setStudentStats((prev) => ({
        ...prev,
        toolsDeployed: prev.toolsDeployed + 1,
        conservationImpact: prev.conservationImpact + 5,
      }));
    } else {
      alert(
        "⚠️ Please complete the lesson first before deploying to Savannah infrastructure.",
      );
    }
  };

  useEffect(() => {
    setUserCode(currentLesson.codeExample);
    setCodeOutput("");
  }, [currentLesson]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-800">
                  Savanna Code Schools
                </CardTitle>
                <p className="text-sm text-purple-600">
                  Swahili-first programming for wildlife conservation
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {studentStats.lessonsCompleted} Lessons Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lessons">Interactive Lessons</TabsTrigger>
              <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="deployment">Deploy Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-800">
                    Available Lessons
                  </h3>
                  {lessons.map((lesson, index) => (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        currentLesson.id === lesson.id
                          ? "ring-2 ring-purple-500"
                          : ""
                      } ${lesson.completed ? "bg-green-50 border-green-200" : ""}`}
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {lesson.title}
                              </h4>
                              {lesson.completed && (
                                <Trophy className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {lesson.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {lesson.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {lesson.language}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {lesson.conservationTopic}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          {currentLesson.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {currentLesson.language}
                          </Badge>
                          <Badge variant="secondary">
                            {currentLesson.conservationTopic}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground">
                        {currentLesson.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="font-medium">Learning Objectives:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Build real-world conservation tools</li>
                          <li>• Deploy to Savannah's infrastructure</li>
                          <li>
                            • Learn{" "}
                            {currentLesson.language === "Swahili"
                              ? "Swahili"
                              : "English"}{" "}
                            programming concepts
                          </li>
                          <li>• Contribute to wildlife protection efforts</li>
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Lesson
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Resources
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code-editor" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Code Editor</h3>
                      <Badge variant="secondary">
                        {currentLesson.language}
                      </Badge>
                    </div>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Write your conservation code here..."
                      className="font-mono text-sm min-h-[300px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Help
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Output</h3>
                    <div className="bg-black text-green-400 p-3 rounded font-mono text-sm min-h-[300px] whitespace-pre-wrap">
                      {codeOutput ||
                        "🖥️ Output will appear here when you run your code..."}
                    </div>
                    {currentLesson.completed && (
                      <div className="flex gap-2">
                        <Button
                          onClick={deployToSavannah}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Deploy to Savannah
                        </Button>
                        <Button variant="outline">
                          <Shield className="mr-2 h-4 w-4" />
                          Test in Sandbox
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-amber-800">
                      Expected Output
                    </h4>
                    <p className="text-sm text-amber-600 font-mono">
                      {currentLesson.expectedOutput}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Top Conservation Coders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Students building the future of wildlife protection
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topStudents.map((student, index) => (
                    <motion.div
                      key={student.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-4 ${index === 0 ? "bg-yellow-50 border-yellow-200" : index === 1 ? "bg-gray-50 border-gray-200" : "bg-orange-50 border-orange-200"}`}
                      >
                        <div className="text-center space-y-3">
                          <div
                            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl ${
                              index === 0
                                ? "bg-yellow-100"
                                : index === 1
                                  ? "bg-gray-100"
                                  : "bg-orange-100"
                            }`}
                          >
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </div>
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.location}
                            </p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Progress:</span>
                              <span className="font-semibold">
                                {student.progress}%
                              </span>
                            </div>
                            <Progress
                              value={student.progress}
                              className="h-2"
                            />
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Tools Built:</span>
                                <span className="font-semibold">
                                  {student.antiPoachingToolsBuilt}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Deployments:</span>
                                <span className="font-semibold">
                                  {student.deploymentsOnSavannah}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center space-y-3">
                    <h4 className="font-semibold text-blue-800">
                      Your Progress
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {studentStats.lessonsCompleted}
                        </div>
                        <div className="text-muted-foreground">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {studentStats.toolsDeployed}
                        </div>
                        <div className="text-muted-foreground">
                          Tools Deployed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {studentStats.conservationImpact}%
                        </div>
                        <div className="text-muted-foreground">
                          Impact Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {studentStats.certificatesEarned}
                        </div>
                        <div className="text-muted-foreground">
                          Certificates
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Deploy Your Conservation Tools
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Launch your anti-poaching tools on Savannah's infrastructure
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Ready to Deploy</h4>
                      </div>
                      {lessons
                        .filter((l) => l.completed)
                        .map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-2 bg-green-50 rounded"
                          >
                            <span className="text-sm">{lesson.title}</span>
                            <Button size="sm" onClick={deployToSavannah}>
                              Deploy
                            </Button>
                          </div>
                        ))}
                      {lessons.filter((l) => l.completed).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Complete lessons to unlock deployment
                        </p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Live Deployments</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>🚨 Poaching Alert System:</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            Live
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>🐘 Migration Predictor:</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            Live
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>💧 Water Monitor:</span>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700"
                          >
                            Testing
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">
                        Real Impact
                      </h4>
                      <p className="text-sm text-green-600">
                        Your deployed tools have prevented 23 poaching incidents
                        and protected 50,000m² of habitat
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
