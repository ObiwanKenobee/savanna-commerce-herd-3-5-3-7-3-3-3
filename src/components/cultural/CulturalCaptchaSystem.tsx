import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  Shield,
  Star,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  Users,
  Mountain,
  Heart,
} from "lucide-react";

export interface CulturalCaptcha {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: "wildlife" | "culture" | "geography" | "language" | "history";
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  audioSupport?: boolean;
}

interface CulturalCaptchaSystemProps {
  onSuccess: () => void;
  onFailure: (reason: string) => void;
  maxAttempts?: number;
  requiredScore?: number;
  showExplanations?: boolean;
}

const CULTURAL_CAPTCHAS: CulturalCaptcha[] = [
  // Wildlife Questions
  {
    id: "wildlife_001",
    question: "Miguu mingapi ina dik-dik?",
    options: ["Minne (4)", "Mitatu (3)", "Miwili (2)", "Moja (1)"],
    correctAnswer: 0,
    category: "wildlife",
    difficulty: "easy",
    explanation:
      "Dik-dik ni antelope mdogo ambaye ana miguu minne kama wanyamapori wengine wengi.",
    audioSupport: true,
  },
  {
    id: "wildlife_002",
    question: 'Wanyamapori gani ni "Big Five" wa Kenya?',
    options: [
      "Simba, Nyati, Tembo, Faru, Chui",
      "Simba, Kiboko, Tembo, Faru, Chui",
      "Simba, Nyati, Twiga, Faru, Chui",
      "Simba, Nyati, Tembo, Faru, Swala",
    ],
    correctAnswer: 0,
    category: "wildlife",
    difficulty: "medium",
    explanation:
      "Big Five ni: Simba (Lion), Nyati (Buffalo), Tembo (Elephant), Faru (Rhino), na Chui (Leopard).",
  },
  {
    id: "wildlife_003",
    question: "Hifadhi gani kubwa zaidi ya wanyamapori Kenya?",
    options: ["Maasai Mara", "Tsavo", "Amboseli", "Samburu"],
    correctAnswer: 1,
    category: "wildlife",
    difficulty: "hard",
    explanation:
      "Tsavo (pamoja Tsavo East na West) ni hifadhi kubwa zaidi ya wanyamapori nchini Kenya.",
  },

  // Cultural Questions
  {
    id: "culture_001",
    question: "Mti gani ni muhimu sana kwa Wamaasai?",
    options: ["Mti wa Nazi", "Mti wa Baobab", "Mti wa Acacia", "Mti wa Mango"],
    correctAnswer: 2,
    category: "culture",
    difficulty: "easy",
    explanation:
      "Mti wa Acacia ni muhimu kwa Wamaasai kwa chakula cha mifugo na dawa za asili.",
    audioSupport: true,
  },
  {
    id: "culture_002",
    question: "Rangi gani za msingi za mikeka ya Kikuyu?",
    options: [
      "Nyekundu, Manjano, Kijani",
      "Buluu, Nyeupe, Nyekundu",
      "Nyeusi, Kahawia, Njano",
      "Rangi zote",
    ],
    correctAnswer: 0,
    category: "culture",
    difficulty: "medium",
    explanation:
      "Mikeka ya Kikuyu mara nyingi hutumia rangi za nyekundu, manjano, na kijani.",
  },
  {
    id: "culture_003",
    question: "Sherehe gani kubwa ya Kalenjin inafanyika mwaka mmoja?",
    options: [
      "Circumcision",
      "Harvest Festival",
      "Age-set ceremony",
      "Rain ceremony",
    ],
    correctAnswer: 2,
    category: "culture",
    difficulty: "hard",
    explanation:
      "Age-set ceremony (sherehe ya vikundi vya umri) ni sherehe muhimu kabisa kwa Wakalenjin.",
  },

  // Geography Questions
  {
    id: "geography_001",
    question: "Mlima mrefu zaidi Kenya ni upi?",
    options: ["Mt. Elgon", "Mt. Kenya", "Aberdare Range", "Mt. Kilimanjaro"],
    correctAnswer: 1,
    category: "geography",
    difficulty: "easy",
    explanation:
      "Mt. Kenya ni mlima mrefu zaidi nchini Kenya (5,199m), ingawa Kilimanjaro ni karibu lakini ni Tanzania.",
    audioSupport: true,
  },
  {
    id: "geography_002",
    question: "Ziwa gani kubwa zaidi katika Bonde la Ufa?",
    options: ["Ziwa Victoria", "Ziwa Turkana", "Ziwa Naivasha", "Ziwa Nakuru"],
    correctAnswer: 1,
    category: "geography",
    difficulty: "medium",
    explanation:
      "Ziwa Turkana ni ziwa kubwa zaidi la mvuke (alkaline) duniani na ni katika Bonde la Ufa.",
  },
  {
    id: "geography_003",
    question: "Mto gani ni mkuu zaidi wa pwani ya Kenya?",
    options: ["Mto Tana", "Mto Galana", "Mto Sabaki", "Mto Ewaso Nyiro"],
    correctAnswer: 0,
    category: "geography",
    difficulty: "hard",
    explanation:
      "Mto Tana ni mto mrefu zaidi nchini Kenya na ni muhimu kwa umwagiliaji na umeme.",
  },

  // Language Questions
  {
    id: "language_001",
    question: 'Neno "Asante" ni lugha gani?',
    options: ["Kikuyu", "Luo", "Kiswahili", "Kalenjin"],
    correctAnswer: 2,
    category: "language",
    difficulty: "easy",
    explanation: "Asante ni neno la Kiswahili, lugha ya kitaifa ya Kenya.",
    audioSupport: true,
  },
  {
    id: "language_002",
    question: 'Kiswahili "Karibu" maana yake ni?',
    options: ["Goodbye", "Welcome", "Thank you", "Please"],
    correctAnswer: 1,
    category: "language",
    difficulty: "easy",
    explanation:
      'Karibu maana yake ni "Welcome" au "You are welcome" kwa Kiingereza.',
  },
  {
    id: "language_003",
    question: "Lugha gani ni ya kwanza zaidi Kenya?",
    options: ["Kiswahili", "Kikuyu", "Luo", "Kamba"],
    correctAnswer: 1,
    category: "language",
    difficulty: "medium",
    explanation: "Kikuyu ni lugha yenye wasemaji wengi zaidi nchini Kenya.",
  },

  // History Questions
  {
    id: "history_001",
    question: "Kenya ilipata uhuru mwaka gani?",
    options: ["1963", "1964", "1962", "1965"],
    correctAnswer: 0,
    category: "history",
    difficulty: "easy",
    explanation: "Kenya ilipata uhuru kutoka Uingereza tarehe 12 Desemba 1963.",
    audioSupport: true,
  },
  {
    id: "history_002",
    question: "Jomo Kenyatta alikuwa nani?",
    options: [
      "Mfalme wa kwanza",
      "Rais wa kwanza",
      "Waziri Mkuu wa kwanza",
      "Kiongozi wa dini",
    ],
    correctAnswer: 1,
    category: "history",
    difficulty: "easy",
    explanation:
      "Jomo Kenyatta alikuwa Rais wa kwanza wa Kenya baada ya uhuru.",
  },
  {
    id: "history_003",
    question: "Vita vya Mau Mau vilianza mwaka gani?",
    options: ["1950", "1952", "1954", "1956"],
    correctAnswer: 1,
    category: "history",
    difficulty: "medium",
    explanation: "Vita vya Mau Mau (hali ya hatari) vilianza rasmi mwaka 1952.",
  },
];

export const CulturalCaptchaSystem: React.FC<CulturalCaptchaSystemProps> = ({
  onSuccess,
  onFailure,
  maxAttempts = 3,
  requiredScore = 2,
  showExplanations = true,
}) => {
  const [currentCaptcha, setCurrentCaptcha] = useState<CulturalCaptcha | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadNewCaptcha();
  }, []);

  const loadNewCaptcha = () => {
    // Filter out used questions or get random if this is the first
    const availableCaptchas = CULTURAL_CAPTCHAS.filter(
      (captcha) =>
        captcha.difficulty === "easy" || captcha.difficulty === "medium",
    );

    const randomCaptcha =
      availableCaptchas[Math.floor(Math.random() * availableCaptchas.length)];
    setCurrentCaptcha(randomCaptcha);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || completed || failed) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentCaptcha) return;

    const correct = selectedAnswer === currentCaptcha.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setTotalQuestions((prev) => prev + 1);

    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Check if we've met the requirements
    setTimeout(
      () => {
        const newCorrectAnswers = correctAnswers + (correct ? 1 : 0);
        const newTotalQuestions = totalQuestions + 1;

        if (newCorrectAnswers >= requiredScore) {
          setCompleted(true);
          onSuccess();
        } else if (newTotalQuestions >= maxAttempts) {
          setFailed(true);
          onFailure(
            `Failed captcha: ${newCorrectAnswers}/${requiredScore} correct answers`,
          );
        } else {
          loadNewCaptcha();
        }
      },
      showExplanations ? 3000 : 1500,
    );
  };

  const resetCaptcha = () => {
    setAttempts(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setCompleted(false);
    setFailed(false);
    loadNewCaptcha();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wildlife":
        return "🦁";
      case "culture":
        return "🏺";
      case "geography":
        return "🏔️";
      case "language":
        return "💬";
      case "history":
        return "📚";
      default:
        return "❓";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wildlife":
        return "text-green-600";
      case "culture":
        return "text-orange-600";
      case "geography":
        return "text-blue-600";
      case "language":
        return "text-purple-600";
      case "history":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (completed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Captcha Completed!
            </h3>
            <p className="text-green-700">
              Hongera! You correctly answered {correctAnswers} out of{" "}
              {totalQuestions} questions about Kenya.
            </p>
            <Badge className="bg-green-100 text-green-800">
              ✅ Cultural Verification Passed
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (failed) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 mx-auto text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              Captcha Failed
            </h3>
            <p className="text-red-700">
              Samahani! You need to answer at least {requiredScore} questions
              correctly about Kenya. Score: {correctAnswers}/{totalQuestions}
            </p>
            <Button onClick={resetCaptcha} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCaptcha) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading cultural verification...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Cultural Verification</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`text-2xl ${getCategoryIcon(currentCaptcha.category)}`}
            >
              {getCategoryIcon(currentCaptcha.category)}
            </span>
            <Badge
              variant="outline"
              className={getCategoryColor(currentCaptcha.category)}
            >
              {currentCaptcha.category}
            </Badge>
            <Badge variant="outline">{currentCaptcha.difficulty}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Question {totalQuestions + 1} • Need {requiredScore} correct
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {correctAnswers}/{requiredScore} correct
            </span>
          </div>
          <Progress
            value={(correctAnswers / requiredScore) * 100}
            className="w-full"
          />
        </div>

        {/* Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentCaptcha.question}
          </h3>

          {/* Audio Support */}
          {currentCaptcha.audioSupport && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>🔊</span>
              <span>Audio support available via USSD</span>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {currentCaptcha.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  showResult
                    ? index === currentCaptcha.correctAnswer
                      ? "bg-green-100 border-green-300"
                      : index === selectedAnswer &&
                          index !== currentCaptcha.correctAnswer
                        ? "bg-red-100 border-red-300"
                        : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      selectedAnswer === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-wrap">{option}</span>
                  {showResult && index === currentCaptcha.correctAnswer && (
                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                  )}
                  {showResult &&
                    index === selectedAnswer &&
                    index !== currentCaptcha.correctAnswer && (
                      <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                    )}
                </div>
              </Button>
            ))}
          </div>

          {/* Submit Button */}
          {!showResult && (
            <Button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="w-full"
              size="lg"
            >
              Submit Answer
            </Button>
          )}

          {/* Result and Explanation */}
          {showResult && (
            <Alert
              className={
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              <div className="flex items-start space-x-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="space-y-2">
                  <AlertDescription
                    className={isCorrect ? "text-green-800" : "text-red-800"}
                  >
                    <strong>
                      {isCorrect
                        ? "Sawa! (Correct!)"
                        : "Si sahihi. (Incorrect)"}
                    </strong>
                  </AlertDescription>

                  {showExplanations && currentCaptcha.explanation && (
                    <p className="text-sm text-muted-foreground">
                      {currentCaptcha.explanation}
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Cultural Context */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 text-orange-600" />
            <h4 className="font-medium text-orange-900">
              Why Cultural Captcha?
            </h4>
          </div>
          <p className="text-sm text-orange-700">
            This system protects against automated spam while being accessible
            to Kenyan users. Questions are designed to be answerable by anyone
            familiar with Kenyan culture, geography, and wildlife.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CulturalCaptchaSystem;
