import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Play } from "lucide-react";
import { useSavannahAudio } from "@/hooks/useSavannahAudio";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const SavannahHero = () => {
  const audio = useSavannahAudio();
  const { playClickSound = () => {}, playNotification = () => {} } =
    audio || {};
  const [searchValue, setSearchValue] = useState("");
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<
    "dawn" | "midday" | "dusk" | "night"
  >("midday");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setCurrentTimeOfDay("dawn");
    else if (hour >= 10 && hour < 16) setCurrentTimeOfDay("midday");
    else if (hour >= 16 && hour < 20) setCurrentTimeOfDay("dusk");
    else setCurrentTimeOfDay("night");
  }, []);

  const timeOfDayStyles = {
    dawn: "from-orange-400/20 via-yellow-200/10 to-pink-300/10",
    midday: "from-blue-400/20 via-green-200/10 to-yellow-300/10",
    dusk: "from-orange-600/20 via-red-200/10 to-purple-300/10",
    night: "from-slate-600/20 via-blue-900/10 to-purple-900/10",
  };

  const watering_holes = [
    { name: "Fresh Produce Hub", emoji: "🥬", active: 234 },
    { name: "Electronics Oasis", emoji: "📱", active: 189 },
    { name: "Fashion Watering Hole", emoji: "👕", active: 156 },
    { name: "Home & Garden", emoji: "🏡", active: 98 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Sky Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${timeOfDayStyles[currentTimeOfDay]} transition-all duration-1000`}
      />

      {/* Animated Savannah Horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-100/50 to-transparent">
        <svg
          className="absolute bottom-0 w-full h-32"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C300,120 400,140 600,130 C800,120 900,125 1200,140 L1200,160 Z"
            className="fill-green-200/60"
          />
          <path
            d="M0,160 C250,130 350,145 550,135 C750,125 850,130 1200,145 L1200,160 Z"
            className="fill-green-300/40"
          />
        </svg>

        {/* Acacia Trees Silhouettes */}
        <div className="absolute bottom-8 left-1/4 text-6xl opacity-30 animate-sway">
          🌳
        </div>
        <div
          className="absolute bottom-12 right-1/3 text-4xl opacity-25 animate-sway"
          style={{ animationDelay: "1s" }}
        >
          🌳
        </div>
        <div
          className="absolute bottom-6 right-1/4 text-5xl opacity-20 animate-sway"
          style={{ animationDelay: "2s" }}
        >
          🌳
        </div>
      </div>

      {/* Migrating Wildlife */}
      <div className="absolute bottom-20 w-full overflow-hidden">
        <div className="migration-animation opacity-30">
          <div className="flex space-x-8 text-2xl">
            {["🦓", "🦌", "🐘", "🦏", "🦬"].map((animal, index) => (
              <span
                key={index}
                className="savanna-pulse inline-block"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {animal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Watering Holes */}
      <div className="absolute inset-0 pointer-events-none">
        {watering_holes.map((hole, index) => (
          <Card
            key={hole.name}
            className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-primary/20 p-3 animate-float`}
            style={{
              top: `${20 + index * 15}%`,
              left: `${15 + index * 20}%`,
              animationDelay: `${index * 0.5}s`,
            }}
            onClick={() => playNotification()}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{hole.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-green-700">
                  {hole.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hole.active} active traders
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <div className="animate-fade-in">
          {/* Welcome to the Digital Savannah */}
          <div className="mb-6">
            <Badge
              variant="secondary"
              className="mb-4 bg-green-100 text-green-700 border-green-200"
            >
              🌍 Welcome to the Digital Savannah
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-foreground leading-tight">
              Where Every
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-amber-500 to-orange-500">
                Trade Thrives
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join Kenya's living ecosystem where retailers roam like swift
            gazelles 🦌, suppliers stand strong like mighty elephants 🐘, and
            drivers race like cheetahs 🐆.
            <span className="block mt-2 text-green-600 font-medium">
              "Mkono moja haulei mwana" - Together we grow stronger.
            </span>
          </p>

          {/* Enhanced Search - The Watering Hole */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-amber-500 to-orange-500 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white rounded-full border-2 border-green-200 shadow-xl">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  placeholder="Hunt for the best deals in the digital savanna... 🔍🦁"
                  className="pl-16 pr-40 py-6 text-lg rounded-full border-0 bg-transparent focus:ring-0 focus:outline-none"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-green-600 hover:bg-green-700 px-8 py-4"
                  onClick={() => playClickSound()}
                >
                  Search the Savanna
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                "🥬 Fresh Produce",
                "📱 Electronics",
                "👕 Fashion",
                "🏡 Home & Garden",
              ].map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => {
                    setSearchValue(suggestion.split(" ").slice(1).join(" "));
                    playClickSound();
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => playClickSound()}
            >
              <span className="mr-3 text-xl">🦬</span>
              Join the Herd - Start Trading
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 rounded-full border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300"
              onClick={() => playClickSound()}
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Safari Demo
            </Button>
          </div>

          {/* Wildlife Roles Preview */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-200 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:animate-bounce">
                  🦌
                </div>
                <h3 className="font-bold text-green-700 mb-2">
                  Swift Gazelles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Agile retailers surviving on volume and quick moves
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-200 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:animate-bounce">
                  🐘
                </div>
                <h3 className="font-bold text-green-700 mb-2">
                  Mighty Elephants
                </h3>
                <p className="text-sm text-muted-foreground">
                  Powerful suppliers with long memory and strong networks
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-200 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:animate-bounce">
                  🐆
                </div>
                <h3 className="font-bold text-green-700 mb-2">
                  Lightning Cheetahs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Speed-focused delivery specialists racing across Kenya
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Additional animations for the savannah theme
const savannahAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-sway {
  animation: sway 4s ease-in-out infinite;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = savannahAnimations;
  document.head.appendChild(style);
}
