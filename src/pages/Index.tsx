import { SavannahHero } from "@/components/wildlife/SavannahHero";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { WisdomCarousel } from "@/components/wildlife/SwahiliWisdom";
import Features from "@/components/Features";
import ValueProposition from "@/components/ValueProposition";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="edge-to-edge min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      <SavannahNavigation />
      <SavannahHero />

      {/* Wisdom Section */}
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
              Beyond B2B: A holistic socio-economic-ecological platform where
              every transaction benefits ecosystems, communities, and wildlife.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/neo-savannah">
                <button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse">
                  🔮 Enter Neo-Savannah
                </button>
              </a>
              <a href="/ecosystem-expansion">
                <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  🦁 Explore Lion Loyalty Program
                </button>
              </a>
              <a href="/ecosystem-expansion">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  🎓 Savanna Code Schools
                </button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="p-4 text-center bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🦁</div>
              <h3 className="font-semibold text-green-800 text-sm mb-1">
                Consumer-to-Ecosystem
              </h3>
              <p className="text-xs text-green-600">Wildlife impact tracking</p>
            </Card>
            <Card className="p-4 text-center bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="font-semibold text-purple-800 text-sm mb-1">
                Education-to-Enterprise
              </h3>
              <p className="text-xs text-purple-600">
                Swahili-first programming
              </p>
            </Card>
            <Card className="p-4 text-center bg-indigo-50 border-indigo-200 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">👑</div>
              <h3 className="font-semibold text-indigo-800 text-sm mb-1">
                Government-to-Grassroots
              </h3>
              <p className="text-xs text-indigo-600">Digital chief system</p>
            </Card>
            <Card className="p-4 text-center bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🐘</div>
              <h3 className="font-semibold text-orange-800 text-sm mb-1">
                Wildlife-to-Wallet
              </h3>
              <p className="text-xs text-orange-600">Animal-AI collaboration</p>
            </Card>
            <Card className="p-4 text-center bg-red-50 border-red-200 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🌧️</div>
              <h3 className="font-semibold text-red-800 text-sm mb-1">
                Crisis-to-Opportunity
              </h3>
              <p className="text-xs text-red-600">Drought insurance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="responsive-container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Circle of Digital Trade
            </h2>
            <p className="text-muted-foreground text-lg">
              Every participant plays a vital role in our thriving ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                animal: "🦌",
                role: "Swift Gazelles",
                type: "Retailers",
                description:
                  "Agile businesses that survive on volume and quick adaptation",
                traits: ["Speed", "Agility", "Volume-focused"],
                count: "2,400+ Active",
              },
              {
                animal: "🐘",
                role: "Wise Elephants",
                type: "Suppliers",
                description:
                  "Powerhouse suppliers with long memory and strong networks",
                traits: ["Memory", "Strength", "Reliability"],
                count: "850+ Trusted",
              },
              {
                animal: "🐆",
                role: "Lightning Cheetahs",
                type: "Drivers",
                description:
                  "Speed-focused delivery specialists racing across Kenya",
                traits: ["Speed", "Precision", "Coverage"],
                count: "1,200+ Ready",
              },
              {
                animal: "🦁",
                role: "Pride Leaders",
                type: "Admins",
                description: "Ecosystem guardians ensuring harmony and growth",
                traits: ["Leadership", "Wisdom", "Protection"],
                count: "24/7 Support",
              },
            ].map((ecosystem, index) => (
              <Card
                key={ecosystem.role}
                className="group hover:shadow-lg transition-all duration-300 border-green-200 hover:border-green-400"
              >
                <CardHeader className="text-center pb-3">
                  <div className="text-4xl mb-3 group-hover:animate-bounce transition-all duration-300">
                    {ecosystem.animal}
                  </div>
                  <CardTitle className="text-lg text-green-700">
                    {ecosystem.role}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {ecosystem.type}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-center leading-relaxed">
                    {ecosystem.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-green-600">
                      Key Traits:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ecosystem.traits.map((trait) => (
                        <Badge
                          key={trait}
                          variant="outline"
                          className="text-xs border-green-300 text-green-700"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <Badge className="bg-green-600 text-white">
                      {ecosystem.count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <ValueProposition />
      <EnterpriseFooter />
    </div>
  );
};

export default Index;
