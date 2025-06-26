import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Home, Wifi } from "lucide-react";
import { useSavannahAudio } from "@/hooks/useSavannahAudio";
import { useEffect } from "react";

interface ErrorStateProps {
  type?: "hyena" | "drought" | "stampede" | "lost";
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
  showActions?: boolean;
}

export const WildlifeErrorState = ({
  type = "hyena",
  title,
  message,
  onRetry,
  onHome,
  showActions = true,
}: ErrorStateProps) => {
  const { playHyenaLaugh } = useSavannahAudio();

  useEffect(() => {
    if (type === "hyena") {
      playHyenaLaugh();
    }
  }, [type, playHyenaLaugh]);

  const errorConfigs = {
    hyena: {
      emoji: "🥴",
      title: title || "Hyenas Stole Your Page!",
      message:
        message ||
        "Those mischievous hyenas scattered your data across the savanna. Let's gather it back together.",
      tip: "💡 The herd is working to track down your page. This usually takes just a moment.",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    drought: {
      emoji: "🌵",
      title: title || "Network Drought Detected",
      message:
        message ||
        "The digital savanna is experiencing a connectivity drought. We've switched to survival mode.",
      tip: "🐪 We've enabled offline mode to keep essential features working.",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    stampede: {
      emoji: "🦬",
      title: title || "Server Stampede",
      message:
        message ||
        "Too many digital wildebeest are thundering through our servers right now.",
      tip: "⏳ The herd will settle down in a moment. Please be patient.",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    lost: {
      emoji: "🧭",
      title: title || "Lost in the Savanna",
      message:
        message ||
        "Seems like you've wandered off the beaten path in our digital wilderness.",
      tip: "🦁 Let our pride guide you back to familiar territory.",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  };

  const config = errorConfigs[type];

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card
        className={`max-w-md w-full ${config.bgColor} ${config.borderColor}`}
      >
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{config.emoji}</div>
          <CardTitle className="text-xl font-bold text-foreground">
            {config.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center leading-relaxed">
            {config.message}
          </p>

          <Alert className="border-dashed">
            <AlertDescription className="text-sm">
              {config.tip}
            </AlertDescription>
          </Alert>

          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onHome && (
                <Button variant="outline" onClick={onHome} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Specialized error components
export const HyenaError = ({
  onRetry,
  onHome,
}: Pick<ErrorStateProps, "onRetry" | "onHome">) => (
  <WildlifeErrorState type="hyena" onRetry={onRetry} onHome={onHome} />
);

export const DroughtError = ({ onRetry }: Pick<ErrorStateProps, "onRetry">) => (
  <WildlifeErrorState type="drought" onRetry={onRetry} showActions={false} />
);

export const StampedeError = ({
  onRetry,
}: Pick<ErrorStateProps, "onRetry">) => (
  <WildlifeErrorState type="stampede" onRetry={onRetry} />
);

export const LostError = ({ onHome }: Pick<ErrorStateProps, "onHome">) => (
  <WildlifeErrorState type="lost" onHome={onHome} />
);

// Network status indicator
export const NetworkStatus = ({ isOnline }: { isOnline: boolean }) => {
  if (isOnline) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-auto bg-yellow-50 border-yellow-200 z-50">
      <Wifi className="h-4 w-4" />
      <AlertDescription className="text-sm">
        🌵 <strong>Drought Mode:</strong> Limited connectivity - essential
        features only
      </AlertDescription>
    </Alert>
  );
};
