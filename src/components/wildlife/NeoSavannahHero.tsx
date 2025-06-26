import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Eye, Coins, Globe, ShoppingCart } from "lucide-react";
import { NEO_SAVANNAH_THEME } from "@/theme/neo-savannah-theme";

interface NeoSavannahHeroProps {
  onExplore?: () => void;
  onStartShopping?: () => void;
  className?: string;
}

const NeoSavannahHero: React.FC<NeoSavannahHeroProps> = ({
  onExplore,
  onStartShopping,
  className = "",
}) => {
  const [currentTime, setCurrentTime] = useState<
    "cyberdawn" | "digitalmidday" | "neondusk" | "quantumnight"
  >("quantumnight");
  const [stats, setStats] = useState({
    traders: 12847,
    transactions: 94521,
    mbogaCoins: 2847329,
    countries: 47,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Time-based theme switching
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setCurrentTime("cyberdawn");
    else if (hour >= 11 && hour < 17) setCurrentTime("digitalmidday");
    else if (hour >= 17 && hour < 22) setCurrentTime("neondusk");
    else setCurrentTime("quantumnight");

    // Animate stats
    const interval = setInterval(() => {
      setStats((prev) => ({
        traders: prev.traders + Math.floor(Math.random() * 5),
        transactions: prev.transactions + Math.floor(Math.random() * 15),
        mbogaCoins: prev.mbogaCoins + Math.floor(Math.random() * 100),
        countries: prev.countries + (Math.random() > 0.95 ? 1 : 0),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 3D Canvas Background
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? "#00FF9F" : "#00D4FF",
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cyber grid
      ctx.strokeStyle = "rgba(0, 255, 159, 0.05)";
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 159, ${0.3 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTimeGradient = () => {
    return NEO_SAVANNAH_THEME.environment.timeOfDay[currentTime];
  };

  const cyberpunkAnimals = [
    { icon: "🦁", name: "Cyber Lion", glitch: true },
    { icon: "🐘", name: "Mech Elephant", pulse: true },
    { icon: "🦌", name: "Quantum Gazelle", shimmer: true },
    { icon: "🦏", name: "Robo Rhino", flicker: true },
    { icon: "🐆", name: "Tech Cheetah", glow: true },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: getTimeGradient() }}
      />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid-bg" />

      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Time-based Badge */}
        <Badge className="mb-8 bg-holographic-green/20 border-holographic-green text-holographic-green hover:bg-holographic-green/30">
          <Zap className="w-4 h-4 mr-2" />
          {currentTime.replace(/([A-Z])/g, " $1").toUpperCase()} MODE ACTIVE
        </Badge>

        {/* Main Title */}
        <h1
          className="mb-6 text-4xl md:text-7xl lg:text-8xl font-cyber cyber-heading glitch-text"
          data-text="NEO-SAVANNAH"
        >
          NEO-SAVANNAH
        </h1>

        {/* Subtitle */}
        <div className="mb-8 text-xl md:text-2xl digital-text max-w-4xl">
          <span className="block">Where the raw beauty of African savanna</span>
          <span className="block animate-hologram">
            merges with sleek{" "}
            <span className="text-electric-amber font-bold">
              cyberpunk aesthetics
            </span>
          </span>
          <span className="block mt-2">
            A digitally immersive, high-tech bazaar powered by{" "}
            <span className="text-glowing-blue font-bold">
              AI, AR, and Blockchain
            </span>
          </span>
        </div>

        {/* Cyberpunk Wildlife Icons */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {cyberpunkAnimals.map((animal, index) => (
            <div
              key={animal.name}
              className={`
                text-4xl cursor-pointer transition-all duration-300 hover:scale-110
                ${animal.glitch ? "animate-glitch" : ""}
                ${animal.pulse ? "animate-cyber-pulse" : ""}
                ${animal.shimmer ? "animate-hologram" : ""}
                ${animal.flicker ? "animate-neon-flicker" : ""}
                ${animal.glow ? "filter drop-shadow-[0_0_10px_currentColor]" : ""}
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
              title={animal.name}
            >
              {animal.icon}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onExplore}
            size="lg"
            className="neon-btn group text-lg px-8 py-4"
          >
            <Eye className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Activate Cyber-Eyes
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={onStartShopping}
            size="lg"
            className="hologram border-2 border-glowing-blue bg-glowing-blue/10 text-glowing-blue hover:bg-glowing-blue/20 text-lg px-8 py-4"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Enter Digital Bazaar
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="cyber-card p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold cyber-heading mb-2">
              {stats.traders.toLocaleString()}
            </div>
            <div className="digital-text text-sm">Digital Traders</div>
            <div className="mt-2 text-xs text-holographic-green/60">
              🦾 {Math.floor(stats.traders * 0.34)} Cyborgs Online
            </div>
          </div>

          <div className="cyber-card p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold cyber-heading mb-2">
              {stats.transactions.toLocaleString()}
            </div>
            <div className="digital-text text-sm">Quantum Trades</div>
            <div className="mt-2 text-xs text-electric-amber/60">
              ⚡ Real-time blockchain sync
            </div>
          </div>

          <div className="cyber-card p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold cyber-heading mb-2 flex items-center justify-center">
              {NEO_SAVANNAH_THEME.currency.mbogaCoin.symbol}
              {(stats.mbogaCoins / 1000000).toFixed(1)}M
            </div>
            <div className="digital-text text-sm">Mboga Coins</div>
            <div className="mt-2 text-xs text-digital-purple/60">
              💎 Market cap growing
            </div>
          </div>

          <div className="cyber-card p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold cyber-heading mb-2">
              {stats.countries}
            </div>
            <div className="digital-text text-sm">Global Nodes</div>
            <div className="mt-2 text-xs text-glowing-blue/60">
              🌍 Planetary network
            </div>
          </div>
        </div>

        {/* Crypto Status */}
        <div className="mt-8 flex items-center gap-4 text-sm digital-text">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-holographic-green rounded-full animate-pulse"></div>
            <span>Blockchain Synchronized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-amber rounded-full animate-pulse"></div>
            <span>AR Nodes Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-glowing-blue rounded-full animate-pulse"></div>
            <span>AI Guide Online</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-holographic-green rounded-full flex justify-center">
            <div className="w-1 h-3 bg-holographic-green rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="particles absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor:
                i % 3 === 0 ? "#00FF9F" : i % 3 === 1 ? "#00D4FF" : "#FFB000",
            }}
          />
        ))}
      </div>

      {/* Audio Visualization (Placeholder) */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 text-xs digital-text">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-holographic-green"
              style={{
                height: `${Math.random() * 20 + 5}px`,
                animation: `pulse ${0.5 + Math.random() * 0.5}s infinite`,
              }}
            />
          ))}
        </div>
        <span>Neo-Savannah Ambient</span>
      </div>
    </div>
  );
};

export default NeoSavannahHero;
