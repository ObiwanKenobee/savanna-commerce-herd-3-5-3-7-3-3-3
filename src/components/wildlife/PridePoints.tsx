import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Target, Star } from "lucide-react";
import { WILDLIFE_METAPHORS } from "@/theme/savannah-theme";

interface PridePointsProps {
  currentPoints: number;
  nextTierPoints: number;
  currentTier: string;
  nextTier: string;
  badges: string[];
  className?: string;
}

export const PridePointsWidget = ({
  currentPoints,
  nextTierPoints,
  currentTier,
  nextTier,
  badges,
  className,
}: PridePointsProps) => {
  const progressPercentage = (currentPoints / nextTierPoints) * 100;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <Trophy className="w-4 h-4 mr-2 text-amber-500" />
          Pride Points
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {currentPoints.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Current: {currentTier} → Next: {nextTier}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentPoints}</span>
            <span>{nextTierPoints}</span>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Recent Badges
            </div>
            <div className="flex flex-wrap gap-1">
              {badges.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {badges.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{badges.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface GameChallenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  type: "seasonal" | "daily" | "referral";
  emoji: string;
}

export const SavannahChallenges = ({
  challenges,
}: {
  challenges: GameChallenge[];
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center">
        <Target className="w-5 h-5 mr-2 text-primary" />
        Active Challenges
      </h3>

      <div className="grid gap-3">
        {challenges.map((challenge) => {
          const progressPercentage =
            (challenge.progress / challenge.target) * 100;
          const isCompleted = challenge.progress >= challenge.target;

          return (
            <Card
              key={challenge.id}
              className={isCompleted ? "bg-green-50 border-green-200" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{challenge.emoji}</span>
                    <div>
                      <h4 className="font-medium text-sm">{challenge.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={isCompleted ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {challenge.reward} Pride Points
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {challenge.progress} / {challenge.target}
                    </span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const WildlifeBadge = ({
  type,
  level = 1,
  size = "default",
}: {
  type: keyof typeof WILDLIFE_METAPHORS.gamification.badges;
  level?: number;
  size?: "sm" | "default" | "lg";
}) => {
  const badgeInfo = WILDLIFE_METAPHORS.gamification.badges[type];
  const sizes = {
    sm: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      variant="default"
      className={`${sizes[size]} bg-gradient-to-r from-amber-500 to-orange-500 text-white`}
    >
      <Star className="w-3 h-3 mr-1" />
      {badgeInfo}
      {level > 1 && ` (Level ${level})`}
    </Badge>
  );
};

export const ReferralHerd = ({
  referrals,
  target = 10,
}: {
  referrals: number;
  target?: number;
}) => {
  const progressPercentage = (referrals / target) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Users className="w-4 h-4 mr-2 text-blue-500" />
          Build Your Herd
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            {referrals} / {target}
          </div>
          <div className="text-xs text-muted-foreground">
            Herd Members Recruited
          </div>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="text-xs text-center text-muted-foreground">
          "Mkono moja haulei mwana" - One hand can't raise a child
        </div>
      </CardContent>
    </Card>
  );
};
