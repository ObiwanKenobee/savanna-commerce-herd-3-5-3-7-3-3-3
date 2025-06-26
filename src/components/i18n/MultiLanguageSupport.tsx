import { useState, useEffect, createContext, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  Languages,
  Volume2,
  Type,
  Settings,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
  Brain,
  Mic,
  Speaker,
  BookOpen,
  Flag,
  Zap,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Language definitions
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  region: string;
  usage: number; // percentage of users
}

interface Translation {
  key: string;
  en: string;
  sw: string;
  context?: string;
  category: "ui" | "business" | "marketing" | "error" | "success";
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
  supportedLanguages: Language[];
}

// Translation data
const translations: Translation[] = [
  // Navigation & UI
  {
    key: "nav.home",
    en: "Home",
    sw: "Nyumbani",
    category: "ui",
  },
  {
    key: "nav.marketplace",
    en: "Marketplace",
    sw: "Sokoni",
    category: "ui",
  },
  {
    key: "nav.orders",
    en: "Orders",
    sw: "Maagizo",
    category: "ui",
  },
  {
    key: "nav.profile",
    en: "Profile",
    sw: "Wasifu",
    category: "ui",
  },
  {
    key: "nav.settings",
    en: "Settings",
    sw: "Mipangilio",
    category: "ui",
  },
  {
    key: "nav.help",
    en: "Help",
    sw: "Msaada",
    category: "ui",
  },

  // Business Terms
  {
    key: "business.supplier",
    en: "Supplier",
    sw: "Mhudumu",
    category: "business",
  },
  {
    key: "business.retailer",
    en: "Retailer",
    sw: "Muuzaji",
    category: "business",
  },
  {
    key: "business.order",
    en: "Order",
    sw: "Agizo",
    category: "business",
  },
  {
    key: "business.payment",
    en: "Payment",
    sw: "Malipo",
    category: "business",
  },
  {
    key: "business.delivery",
    en: "Delivery",
    sw: "Utoaji",
    category: "business",
  },
  {
    key: "business.inventory",
    en: "Inventory",
    sw: "Hesabu za Mali",
    category: "business",
  },
  {
    key: "business.price",
    en: "Price",
    sw: "Bei",
    category: "business",
  },
  {
    key: "business.quantity",
    en: "Quantity",
    sw: "Idadi",
    category: "business",
  },
  {
    key: "business.total",
    en: "Total",
    sw: "Jumla",
    category: "business",
  },

  // Actions
  {
    key: "action.add",
    en: "Add",
    sw: "Ongeza",
    category: "ui",
  },
  {
    key: "action.edit",
    en: "Edit",
    sw: "Hariri",
    category: "ui",
  },
  {
    key: "action.delete",
    en: "Delete",
    sw: "Futa",
    category: "ui",
  },
  {
    key: "action.save",
    en: "Save",
    sw: "Hifadhi",
    category: "ui",
  },
  {
    key: "action.cancel",
    en: "Cancel",
    sw: "Ghairi",
    category: "ui",
  },
  {
    key: "action.search",
    en: "Search",
    sw: "Tafuta",
    category: "ui",
  },
  {
    key: "action.filter",
    en: "Filter",
    sw: "Chuja",
    category: "ui",
  },
  {
    key: "action.buy",
    en: "Buy Now",
    sw: "Nunua Sasa",
    category: "business",
  },
  {
    key: "action.add_to_cart",
    en: "Add to Cart",
    sw: "Weka Kilioti",
    category: "business",
  },

  // Messages & Notifications
  {
    key: "message.welcome",
    en: "Welcome to Savanna Marketplace",
    sw: "Karibu Sokoni la Savanna",
    category: "marketing",
  },
  {
    key: "message.order_confirmed",
    en: "Your order has been confirmed",
    sw: "Agizo lako limethibitishwa",
    category: "success",
  },
  {
    key: "message.payment_successful",
    en: "Payment completed successfully",
    sw: "Malipo yamekamilika",
    category: "success",
  },
  {
    key: "message.delivery_update",
    en: "Your package is out for delivery",
    sw: "Kifurushi chako kiko njiani",
    category: "success",
  },
  {
    key: "error.network",
    en: "Network connection error",
    sw: "Hitilafu ya mtandao",
    category: "error",
  },
  {
    key: "error.payment_failed",
    en: "Payment failed. Please try again",
    sw: "Malipo yameshindwa. Jaribu tena",
    category: "error",
  },

  // Product Categories
  {
    key: "category.food_beverages",
    en: "Food & Beverages",
    sw: "Chakula na Vinywaji",
    category: "business",
  },
  {
    key: "category.agriculture",
    en: "Agriculture",
    sw: "Kilimo",
    category: "business",
  },
  {
    key: "category.textiles",
    en: "Textiles",
    sw: "Nguo na Mitambo",
    category: "business",
  },
  {
    key: "category.electronics",
    en: "Electronics",
    sw: "Vifaa vya Umeme",
    category: "business",
  },

  // Status & States
  {
    key: "status.pending",
    en: "Pending",
    sw: "Inasubiri",
    category: "ui",
  },
  {
    key: "status.confirmed",
    en: "Confirmed",
    sw: "Imethibitishwa",
    category: "ui",
  },
  {
    key: "status.processing",
    en: "Processing",
    sw: "Inaandaliwa",
    category: "ui",
  },
  {
    key: "status.shipped",
    en: "Shipped",
    sw: "Imetumwa",
    category: "ui",
  },
  {
    key: "status.delivered",
    en: "Delivered",
    sw: "Imefikishwa",
    category: "ui",
  },
  {
    key: "status.cancelled",
    en: "Cancelled",
    sw: "Imeghairiwa",
    category: "ui",
  },

  // Wildlife-themed terms (keeping the brand identity)
  {
    key: "wildlife.pride",
    en: "Pride",
    sw: "Kundi",
    category: "marketing",
    context: "Group of users/community",
  },
  {
    key: "wildlife.cheetah_delivery",
    en: "Cheetah Speed Delivery",
    sw: "Utoaji wa Kasi ya Duma",
    category: "marketing",
  },
  {
    key: "wildlife.elephant_suppliers",
    en: "Elephant Suppliers",
    sw: "Wahudumu Tembo",
    category: "marketing",
    context: "Large, reliable suppliers",
  },
  {
    key: "wildlife.gazelle_retailers",
    en: "Swift Gazelle Retailers",
    sw: "Wauzaji Swala Wepesi",
    category: "marketing",
    context: "Fast, agile retailers",
  },

  // Time & Dates
  {
    key: "time.now",
    en: "Now",
    sw: "Sasa",
    category: "ui",
  },
  {
    key: "time.today",
    en: "Today",
    sw: "Leo",
    category: "ui",
  },
  {
    key: "time.yesterday",
    en: "Yesterday",
    sw: "Jana",
    category: "ui",
  },
  {
    key: "time.tomorrow",
    en: "Tomorrow",
    sw: "Kesho",
    category: "ui",
  },
  {
    key: "time.this_week",
    en: "This Week",
    sw: "Wiki Hii",
    category: "ui",
  },

  // Common phrases
  {
    key: "phrase.thank_you",
    en: "Thank you",
    sw: "Asante",
    category: "ui",
  },
  {
    key: "phrase.please_wait",
    en: "Please wait",
    sw: "Ngoja kidogo",
    category: "ui",
  },
  {
    key: "phrase.loading",
    en: "Loading...",
    sw: "Inapakia...",
    category: "ui",
  },
  {
    key: "phrase.no_results",
    en: "No results found",
    sw: "Hakuna matokeo",
    category: "ui",
  },
];

const supportedLanguages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    rtl: false,
    region: "Global",
    usage: 65,
  },
  {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    flag: "🇰🇪",
    rtl: false,
    region: "East Africa",
    usage: 35,
  },
];

// Create translation context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation function
const createTranslationFunction = (currentLanguage: string) => {
  return (key: string, params?: Record<string, string>): string => {
    const translation = translations.find((t) => t.key === key);

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    let text =
      (translation[currentLanguage as keyof Translation] as string) ||
      translation.en;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, "g"), value);
      });
    }

    return text;
  };
};

// Language Provider Component
export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get from localStorage or browser preference
    const saved = localStorage.getItem("preferred-language");
    if (saved) return saved;

    // Detect browser language
    const browserLang = navigator.language.split("-")[0];
    return (
      supportedLanguages.find((lang) => lang.code === browserLang)?.code || "en"
    );
  });

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem("preferred-language", lang);

    // Update document language
    document.documentElement.lang = lang;

    // Update document direction for RTL languages
    const language = supportedLanguages.find((l) => l.code === lang);
    document.documentElement.dir = language?.rtl ? "rtl" : "ltr";
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: createTranslationFunction(currentLanguage),
    isRTL:
      supportedLanguages.find((l) => l.code === currentLanguage)?.rtl || false,
    supportedLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language Switcher Component
export const LanguageSwitcher = ({
  showLabel = true,
}: {
  showLabel?: boolean;
}) => {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage();

  const currentLang = supportedLanguages.find(
    (lang) => lang.code === currentLanguage,
  );

  return (
    <div className="flex items-center space-x-2">
      {showLabel && (
        <Label className="text-sm text-gray-600 flex items-center">
          <Globe className="h-4 w-4 mr-1" />
          {t("nav.language") || "Language"}:
        </Label>
      )}
      <Select value={currentLanguage} onValueChange={setLanguage}>
        <SelectTrigger className="w-auto min-w-[140px]">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLang?.flag}</span>
              <span>{currentLang?.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
                <Badge variant="outline" className="text-xs">
                  {language.usage}%
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Voice/Audio Support Component
const VoiceSupport = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { currentLanguage, t } = useLanguage();

  const handleTextToSpeech = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);

    // Set language-specific voice
    const voices = speechSynthesis.getVoices();
    const langVoice = voices.find(
      (voice) =>
        voice.lang.startsWith(currentLanguage) ||
        (currentLanguage === "sw" && voice.lang.includes("sw")),
    );

    if (langVoice) {
      utterance.voice = langVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    toast({
      title: voiceEnabled ? "Voice disabled" : "Voice enabled",
      description: voiceEnabled
        ? "Text-to-speech has been disabled"
        : "Text-to-speech is now available",
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleVoice}
        className={voiceEnabled ? "bg-blue-50 border-blue-300" : ""}
      >
        {voiceEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <Speaker className="h-4 w-4" />
        )}
      </Button>

      {voiceEnabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTextToSpeech(t("message.welcome"))}
          disabled={isPlaying}
        >
          <Mic className="h-4 w-4" />
          {isPlaying ? "Playing..." : "Test Voice"}
        </Button>
      )}
    </div>
  );
};

// Cultural Context Component
const CulturalContext = () => {
  const { currentLanguage, t } = useLanguage();

  const culturalTips = {
    en: [
      "Use formal greetings in business communications",
      "Time punctuality is highly valued",
      "Direct communication is preferred",
    ],
    sw: [
      "Salamu za 'Hujambo' au 'Habari' ni muhimu katika biashara",
      "Heshima na uvumilivu ni muhimu katika mazungumzo",
      "Tumia maneno mazuri na ya heshima",
    ],
  };

  const currentTips =
    culturalTips[currentLanguage as keyof typeof culturalTips] ||
    culturalTips.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>{t("ui.cultural_tips") || "Cultural Tips"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {currentTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Translation Management Dashboard
export const MultiLanguageSupport = () => {
  const { currentLanguage, supportedLanguages, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCulturalContext, setShowCulturalContext] = useState(false);

  const categories = ["all", "ui", "business", "marketing", "error", "success"];

  const filteredTranslations = translations.filter(
    (trans) =>
      selectedCategory === "all" || trans.category === selectedCategory,
  );

  const translationStats = {
    total: translations.length,
    byCategory: categories.slice(1).map((cat) => ({
      category: cat,
      count: translations.filter((t) => t.category === cat).length,
    })),
    coverage: {
      en: 100,
      sw: Math.round(
        (translations.filter((t) => t.sw).length / translations.length) * 100,
      ),
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Languages className="h-8 w-8 text-green-600" />
            <span>Multi-Language Support</span>
          </h1>
          <p className="text-gray-600">
            Comprehensive language localization for East African markets
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <VoiceSupport />
          <Button
            variant="outline"
            onClick={() => setShowCulturalContext(true)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Cultural Tips
          </Button>
        </div>
      </div>

      {/* Language Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold">{translationStats.total}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Languages Supported</p>
                <p className="text-2xl font-bold">
                  {supportedLanguages.length}
                </p>
              </div>
              <Flag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">English Coverage</p>
                <p className="text-2xl font-bold text-green-600">
                  {translationStats.coverage.en}%
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
                <p className="text-sm text-gray-600">Swahili Coverage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {translationStats.coverage.sw}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Usage by Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Language Usage by Region</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportedLanguages.map((language) => (
              <div
                key={language.code}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <p className="font-medium">{language.name}</p>
                    <p className="text-sm text-gray-600">
                      {language.nativeName}
                    </p>
                    <p className="text-xs text-gray-500">{language.region}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{language.usage}%</p>
                  <p className="text-sm text-gray-600">of users</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Translation Browser */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Type className="h-5 w-5" />
              <span>Translation Browser</span>
            </span>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTranslations.map((translation) => (
              <div key={translation.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {translation.key}
                  </code>
                  <Badge variant="outline">{translation.category}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600">English 🇬🇧</Label>
                    <p className="text-sm font-medium">{translation.en}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">
                      Kiswahili 🇰🇪
                    </Label>
                    <p className="text-sm font-medium">
                      {translation.sw || "—"}
                    </p>
                  </div>
                </div>

                {translation.context && (
                  <div className="mt-2">
                    <Label className="text-xs text-gray-600">Context</Label>
                    <p className="text-xs text-gray-500">
                      {translation.context}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Context Dialog */}
      <Dialog open={showCulturalContext} onOpenChange={setShowCulturalContext}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Cultural Context & Communication Guidelines</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <CulturalContext />

            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Translation:</strong> Our system uses cultural
                context to provide more accurate and appropriate translations
                for business communications in East Africa.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// HOC for translating components
export const withTranslation = <P extends object>(
  Component: React.ComponentType<
    P & { t: (key: string, params?: Record<string, string>) => string }
  >,
) => {
  return (props: P) => {
    const { t } = useLanguage();
    return <Component {...props} t={t} />;
  };
};

// Utility hook for formatted messages
export const useFormattedMessage = () => {
  const { t } = useLanguage();

  return {
    formatCurrency: (amount: number, currency = "KES") => {
      const formatted = amount.toLocaleString();
      return `${currency} ${formatted}`;
    },

    formatDate: (date: Date | string) => {
      const d = new Date(date);
      return d.toLocaleDateString();
    },

    formatRelativeTime: (date: Date | string) => {
      const now = new Date();
      const target = new Date(date);
      const diffMs = now.getTime() - target.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays === 0) return t("time.today");
      if (diffDays === 1) return t("time.yesterday");
      if (diffDays < 7) return t("time.this_week");
      return target.toLocaleDateString();
    },
  };
};

export default MultiLanguageSupport;
