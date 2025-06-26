import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { SavannahHero } from "@/components/wildlife/SavannahHero";
import { WisdomCarousel } from "@/components/wildlife/SwahiliWisdom";
import Features from "@/components/Features";
import ValueProposition from "@/components/ValueProposition";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import NeoSavannahHero from "@/components/wildlife/NeoSavannahHero";
import CyberMarketplace from "@/components/marketplace/CyberMarketplace";
import MzeeCyber from "@/components/innovation/Mzeecyber";
import BlockchainVisualizer from "@/components/innovation/BlockchainVisualizer";
import { Eye, Coins, Shield, Globe, Zap, Star, TrendingUp } from "lucide-react";

const NeoSavannahIndex = () => {
  const [isNeoMode, setIsNeoMode] = useState(true);
  const [showBlockchain, setShowBlockchain] = useState(false);

  const toggleMode = () => {
    setIsNeoMode(!isNeoMode);
    setShowBlockchain(false);
  };

  const handleExplore = () => {
    setShowBlockchain(true);
    setTimeout(() => {
      const blockchainElement = document.getElementById("blockchain-section");
      blockchainElement?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleStartShopping = () => {
    const marketplaceElement = document.getElementById("cyber-marketplace");
    marketplaceElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen ${isNeoMode ? "neo-savannah-app cyber-grid-bg" : "bg-gradient-to-b from-green-50/30 to-white"}`}
    >
      {/* Navigation */}
      <SavannahNavigation />

      {/* Neo-Savannah Mode Toggle */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={toggleMode}
          className={`
            ${
              isNeoMode
                ? "neon-btn animate-cyber-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          `}
        >
          {isNeoMode ? "🌍 Classic Mode" : "🔮 Neo-Savannah"}
        </Button>
      </div>

      {/* Hero Section */}
      {isNeoMode ? (
        <NeoSavannahHero
          onExplore={handleExplore}
          onStartShopping={handleStartShopping}
        />
      ) : (
        <SavannahHero />
      )}

      {/* Blockchain Visualization (Neo-Savannah mode only) */}
      {isNeoMode && showBlockchain && (
        <section id="blockchain-section" className="py-20 relative">
          {/* Background Effects */}
          <div className="absolute inset-0 scanlines opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-digital-purple/20 text-digital-purple border-digital-purple">
                <Zap className="w-4 h-4 mr-2" />
                Quantum Infrastructure Active
              </Badge>
              <h2
                className="text-4xl md:text-6xl font-cyber cyber-heading mb-4 glitch-text"
                data-text="BLOCKCHAIN CORE"
              >
                BLOCKCHAIN CORE
              </h2>
              <p className="text-lg digital-text max-w-2xl mx-auto">
                Witness the power of quantum-secured smart contracts governing
                every transaction in our digital savannah ecosystem.
              </p>
            </div>
            <BlockchainVisualizer showLiveData={true} />
          </div>
        </section>
      )}

      {/* Main Content Based on Mode */}
      {isNeoMode ? (
        <>
          {/* Cyber Marketplace Section */}
          <section id="cyber-marketplace" className="py-20 relative">
            <div className="absolute inset-0 cyber-grid-bg opacity-30"></div>
            <CyberMarketplace
              onProductClick={(product) =>
                console.log("Product clicked:", product)
              }
              onARScan={(product) => {
                // Simulate AR scanning
                const arModal = document.createElement("div");
                arModal.className =
                  "fixed inset-0 bg-cyber-black/80 flex items-center justify-center z-50 backdrop-blur-lg";
                arModal.innerHTML = `
                  <div class="cyber-card p-8 text-center max-w-md mx-4 animate-materialize">
                    <div class="text-6xl mb-4 animate-hologram">${product.hologramPreview}</div>
                    <h3 class="cyber-heading text-2xl mb-4">${product.name}</h3>
                    <p class="digital-text mb-6">AR preview loading... Point your device camera at the product QR code to see the full holographic experience.</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="neon-btn">
                      Close AR View
                    </button>
                  </div>
                `;
                document.body.appendChild(arModal);

                setTimeout(() => {
                  if (document.body.contains(arModal)) {
                    arModal.remove();
                  }
                }, 5000);
              }}
            />
          </section>

          {/* Neo-Savannah Features */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-electric-amber/20 text-electric-amber border-electric-amber">
                  <Star className="w-4 h-4 mr-2" />
                  Digital Evolution Features
                </Badge>
                <h2
                  className="text-4xl font-cyber cyber-heading mb-4 glitch-text"
                  data-text="CYBER WILDLIFE"
                >
                  CYBER WILDLIFE
                </h2>
                <p className="text-lg digital-text max-w-2xl mx-auto">
                  Experience the future of commerce where traditional African
                  wildlife metaphors meet cutting-edge technology.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-hologram group-hover:animate-glitch">
                    🤖🦁
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">
                    AI Pride Leader
                  </h3>
                  <p className="digital-text mb-4">
                    Mzee Cyber, your AI-powered digital chief, guides you
                    through the marketplace with ancestral wisdom and quantum
                    intelligence.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-holographic-green/20 text-holographic-green border-holographic-green text-xs">
                      Voice Commands
                    </Badge>
                    <Badge className="bg-glowing-blue/20 text-glowing-blue border-glowing-blue text-xs">
                      Smart Recommendations
                    </Badge>
                  </div>
                </div>

                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-cyber-pulse group-hover:animate-quantum-spin">
                    🔮🐘
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">
                    Holographic Memory
                  </h3>
                  <p className="digital-text mb-4">
                    Scan QR codes to see 3D holograms of products, their origin
                    stories, and supply chain in augmented reality.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-digital-purple/20 text-digital-purple border-digital-purple text-xs">
                      AR Preview
                    </Badge>
                    <Badge className="bg-electric-amber/20 text-electric-amber border-electric-amber text-xs">
                      3D Models
                    </Badge>
                  </div>
                </div>

                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-quantum-spin group-hover:animate-neon-flicker">
                    ⚛️🦌
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">
                    Quantum Commerce
                  </h3>
                  <p className="digital-text mb-4">
                    Smart contracts handle escrow, disputes, and payments
                    automatically. Lightning-fast transactions with Mboga Coins.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-hot-pink/20 text-hot-pink border-hot-pink text-xs">
                      Smart Contracts
                    </Badge>
                    <Badge className="bg-glowing-blue/20 text-glowing-blue border-glowing-blue text-xs">
                      Instant Payment
                    </Badge>
                  </div>
                </div>

                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-neon-flicker group-hover:animate-hologram">
                    🏆🐆
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">
                    Digital Pride Points
                  </h3>
                  <p className="digital-text mb-4">
                    Earn badges, climb leaderboards, and unlock achievements.
                    Build your digital reputation in the cyber-savannah.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-electric-amber/20 text-electric-amber border-electric-amber text-xs">
                      Gamification
                    </Badge>
                    <Badge className="bg-holographic-green/20 text-holographic-green border-holographic-green text-xs">
                      Achievements
                    </Badge>
                  </div>
                </div>

                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-data-stream group-hover:animate-cyber-pulse">
                    🌐🦏
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">Neural Network</h3>
                  <p className="digital-text mb-4">
                    Connect with traders across Africa and beyond through our
                    decentralized quantum marketplace network.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-digital-purple/20 text-digital-purple border-digital-purple text-xs">
                      Global Reach
                    </Badge>
                    <Badge className="bg-glowing-blue/20 text-glowing-blue border-glowing-blue text-xs">
                      Decentralized
                    </Badge>
                  </div>
                </div>

                <div className="cyber-card p-8 text-center group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4 animate-materialize group-hover:animate-glitch">
                    🛡️🦅
                  </div>
                  <h3 className="cyber-heading text-xl mb-4">
                    Quantum Security
                  </h3>
                  <p className="digital-text mb-4">
                    Every transaction is secured by blockchain technology and
                    protected by our AI-powered cyber-eagle fraud detection.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-hot-pink/20 text-hot-pink border-hot-pink text-xs">
                      Blockchain
                    </Badge>
                    <Badge className="bg-holographic-green/20 text-holographic-green border-holographic-green text-xs">
                      AI Security
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Neo-Savannah Stats */}
          <section className="py-20 relative">
            <div className="absolute inset-0 scanlines opacity-10"></div>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-cyber cyber-heading mb-4">
                  Digital Ecosystem Metrics
                </h2>
                <p className="text-lg digital-text">
                  Real-time data from our quantum-secured network
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="cyber-card p-6 text-center">
                  <div className="text-3xl mb-2 animate-cyber-pulse">🦾</div>
                  <div className="cyber-heading text-2xl mb-1">15,847</div>
                  <div className="digital-text text-sm">Cyber Traders</div>
                  <div className="text-xs text-holographic-green/60 mt-1">
                    +1.2K this week
                  </div>
                </div>

                <div className="cyber-card p-6 text-center">
                  <div className="text-3xl mb-2 animate-quantum-spin">⚛️</div>
                  <div className="cyber-heading text-2xl mb-1">2.84M</div>
                  <div className="digital-text text-sm">
                    Quantum Transactions
                  </div>
                  <div className="text-xs text-electric-amber/60 mt-1">
                    +15% growth
                  </div>
                </div>

                <div className="cyber-card p-6 text-center">
                  <div className="text-3xl mb-2 animate-hologram">🌽⚡</div>
                  <div className="cyber-heading text-2xl mb-1">94.5M</div>
                  <div className="digital-text text-sm">Mboga Coins</div>
                  <div className="text-xs text-digital-purple/60 mt-1">
                    In circulation
                  </div>
                </div>

                <div className="cyber-card p-6 text-center">
                  <div className="text-3xl mb-2 animate-neon-flicker">🌍</div>
                  <div className="cyber-heading text-2xl mb-1">47</div>
                  <div className="digital-text text-sm">Global Nodes</div>
                  <div className="text-xs text-glowing-blue/60 mt-1">
                    Across Africa
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Traditional Sections */}
          <section className="py-16 px-4">
            <div className="responsive-container max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-amber-100 text-amber-700"
                >
                  🏛️ Ancient Wisdom for Modern Trade
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Harambee Spirit in Digital Commerce
                </h2>
                <p className="text-muted-foreground text-lg">
                  Guided by the timeless wisdom of our ancestors, building the
                  future together.
                </p>
              </div>
              <WisdomCarousel />
            </div>
          </section>

          {/* Ecosystem 2.0 Feature */}
          <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="responsive-container max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                >
                  🌍 New: Transformative Expansion
                </Badge>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Savannah Ecosystem 2.0
                </h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
                  Beyond B2B: A holistic socio-economic-ecological platform
                  where every transaction benefits ecosystems, communities, and
                  wildlife.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={toggleMode}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🔮 Enter Neo-Savannah
                  </Button>
                  <Link to="/ecosystem-expansion">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                      🎓 Explore Ecosystem
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card
                  className="p-4 text-center bg-green-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={toggleMode}
                >
                  <div className="text-2xl mb-2">🦁</div>
                  <h3 className="font-semibold text-green-800 text-sm mb-1">
                    Consumer-to-Ecosystem
                  </h3>
                  <p className="text-xs text-green-600">
                    Wildlife impact tracking
                  </p>
                </Card>
                <Card
                  className="p-4 text-center bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={toggleMode}
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <h3 className="font-semibold text-purple-800 text-sm mb-1">
                    Education-to-Enterprise
                  </h3>
                  <p className="text-xs text-purple-600">
                    Swahili-first programming
                  </p>
                </Card>
                <Card
                  className="p-4 text-center bg-indigo-50 border-indigo-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={toggleMode}
                >
                  <div className="text-2xl mb-2">👑</div>
                  <h3 className="font-semibold text-indigo-800 text-sm mb-1">
                    Government-to-Grassroots
                  </h3>
                  <p className="text-xs text-indigo-600">
                    Digital chief system
                  </p>
                </Card>
                <Card
                  className="p-4 text-center bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={toggleMode}
                >
                  <div className="text-2xl mb-2">🐘</div>
                  <h3 className="font-semibold text-orange-800 text-sm mb-1">
                    Wildlife-to-Wallet
                  </h3>
                  <p className="text-xs text-orange-600">
                    Animal-AI collaboration
                  </p>
                </Card>
                <Card
                  className="p-4 text-center bg-red-50 border-red-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={toggleMode}
                >
                  <div className="text-2xl mb-2">🌧️</div>
                  <h3 className="font-semibold text-red-800 text-sm mb-1">
                    Crisis-to-Opportunity
                  </h3>
                  <p className="text-xs text-red-600">Drought insurance</p>
                </Card>
              </div>
            </div>
          </section>

          <Features />
          <ValueProposition />
        </>
      )}

      <EnterpriseFooter />

      {/* AI Market Guide (Neo-Savannah mode only) */}
      {isNeoMode && (
        <MzeeCyber
          onSearch={(query) => {
            console.log("Searching for:", query);
            // Implement search functionality
            const marketplaceElement =
              document.getElementById("cyber-marketplace");
            marketplaceElement?.scrollIntoView({ behavior: "smooth" });
          }}
          onPurchase={(item) => {
            console.log("Purchasing:", item);
            // Implement purchase functionality
            alert("🔮 Quantum purchase initiated! Smart contract deploying...");
          }}
        />
      )}

      {/* Floating Particles (Neo-Savannah mode only) */}
      {isNeoMode && (
        <div className="particles fixed inset-0 pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                backgroundColor:
                  i % 4 === 0
                    ? "#00FF9F"
                    : i % 4 === 1
                      ? "#00D4FF"
                      : i % 4 === 2
                        ? "#FFB000"
                        : "#B048FF",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NeoSavannahIndex;
