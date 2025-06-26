import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WildlifeLoadingProps {
  type?: "migration" | "waterhole" | "hunt";
  progress?: number;
  message?: string;
  className?: string;
}

export const WildlifeLoading = ({
  type = "migration",
  progress = 0,
  message,
  className,
}: WildlifeLoadingProps) => {
  const loadingContent = {
    migration: {
      animals: ["🦓", "🦌", "🐘", "🦏", "🦬"],
      message: message || "The herd is moving...",
      animation: "animate-pulse",
    },
    waterhole: {
      animals: ["💧"],
      message: message || "Filling the waterhole...",
      animation: "animate-bounce",
    },
    hunt: {
      animals: ["🐆", "👁️"],
      message: message || "Stalking the best deals...",
      animation: "animate-pulse",
    },
  };

  const config = loadingContent[type];

  return (
    <div className={cn("flex flex-col items-center space-y-4 p-8", className)}>
      {/* Wildlife Animation */}
      <div className="flex space-x-2 text-4xl">
        {config.animals.map((animal, index) => (
          <span
            key={index}
            className={cn(config.animation)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {animal}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} className="h-3 bg-muted" />
        <p className="text-sm text-muted-foreground text-center font-medium">
          {config.message}
        </p>
        {progress > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% complete
          </p>
        )}
      </div>
    </div>
  );
};

export const MigrationLoader = ({
  progress,
  message,
}: {
  progress?: number;
  message?: string;
}) => (
  <WildlifeLoading type="migration" progress={progress} message={message} />
);

export const WaterholeLoader = ({
  progress,
  message,
}: {
  progress?: number;
  message?: string;
}) => (
  <WildlifeLoading type="waterhole" progress={progress} message={message} />
);

export const HuntLoader = ({
  progress,
  message,
}: {
  progress?: number;
  message?: string;
}) => <WildlifeLoading type="hunt" progress={progress} message={message} />;

// Skeleton loaders with wildlife theme
export const SavannaCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
        <span className="text-xl opacity-50">🦁</span>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded"></div>
      <div className="h-3 bg-muted rounded w-4/5"></div>
    </div>
  </div>
);

export const SavannaTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-4 p-3 border rounded animate-pulse"
      >
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <span className="text-sm opacity-50">🌿</span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-2 bg-muted rounded w-2/3"></div>
        </div>
        <div className="w-16 h-6 bg-muted rounded"></div>
      </div>
    ))}
  </div>
);
