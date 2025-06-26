import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, Heart, Share2, BookOpen } from "lucide-react";
import { SWAHILI_PROVERBS } from "@/theme/savannah-theme";
import { useState, useEffect } from "react";

interface SwahiliWisdomProps {
  context?: "payment" | "cooperation" | "patience" | "unity";
  showTranslation?: boolean;
  variant?: "banner" | "card" | "tooltip";
  className?: string;
}

export const SwahiliWisdom = ({
  context,
  showTranslation = true,
  variant = "card",
  className,
}: SwahiliWisdomProps) => {
  const [currentProverb, setCurrentProverb] =
    useState<keyof typeof SWAHILI_PROVERBS>("patience");

  useEffect(() => {
    if (context) {
      const contextMapping = {
        payment: "patience" as const,
        cooperation: "cooperation" as const,
        patience: "patience" as const,
        unity: "unity" as const,
      };
      setCurrentProverb(contextMapping[context] || "patience");
    }
  }, [context]);

  const proverb = SWAHILI_PROVERBS[currentProverb];

  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Quote className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 italic">
                "{proverb.swahili}"
              </p>
              {showTranslation && (
                <p className="text-sm text-amber-600 mt-1">{proverb.english}</p>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            Wisdom
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === "tooltip") {
    return (
      <div
        className={`text-xs text-center text-muted-foreground italic ${className}`}
      >
        "{proverb.swahili}"
        {showTranslation && (
          <div className="text-xs opacity-75 mt-1">{proverb.english}</div>
        )}
      </div>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 rounded-full p-2">
            <Quote className="h-5 w-5 text-amber-600" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-lg font-semibold text-amber-800 italic leading-relaxed">
                "{proverb.swahili}"
              </p>
              {showTranslation && (
                <p className="text-amber-700 mt-2 font-medium">
                  {proverb.english}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-700"
              >
                Kenyan Wisdom
              </Badge>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WisdomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const proverbKeys = Object.keys(SWAHILI_PROVERBS) as Array<
    keyof typeof SWAHILI_PROVERBS
  >;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % proverbKeys.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [proverbKeys.length]);

  const currentKey = proverbKeys[currentIndex];
  const proverb = SWAHILI_PROVERBS[currentKey];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-700">Daily Wisdom</span>
        </div>
        <div className="flex space-x-1">
          {proverbKeys.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-green-600" : "bg-green-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-lg font-semibold text-green-800 italic leading-relaxed">
          "{proverb.swahili}"
        </p>
        <p className="text-green-700 font-medium">{proverb.english}</p>
        <p className="text-sm text-green-600 opacity-80">
          Context: {proverb.usage}
        </p>
      </div>
    </div>
  );
};

// Contextual usage components
export const PaymentReminderWisdom = () => (
  <SwahiliWisdom context="payment" variant="banner" className="mb-4" />
);

export const GroupBuyingWisdom = () => (
  <SwahiliWisdom context="cooperation" variant="card" className="mt-4" />
);

export const CommunityWisdom = () => (
  <SwahiliWisdom context="unity" variant="tooltip" className="mt-2" />
);
