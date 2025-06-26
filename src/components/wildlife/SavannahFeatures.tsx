import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  CreditCard,
  Truck,
  Eye,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { WILDLIFE_METAPHORS } from "@/theme/savannah-theme";

export const SavannahFeatures = () => {
  const features = [
    {
      system: "fraud_detection",
      icon: <Eye className="h-8 w-8" />,
      title: "Vulture Watch",
      subtitle: "AI-Powered Fraud Detection",
      description:
        "Our vigilant AI never misses suspicious activity, protecting the herd from digital predators.",
      stats: "99.8% accuracy",
      color: "from-red-500 to-orange-500",
      emoji: "🦅",
    },
    {
      system: "database",
      icon: <Globe className="h-8 w-8" />,
      title: "Baobab Roots",
      subtitle: "Deep Data Infrastructure",
      description:
        "Like the ancient baobab tree, our data roots run deep and wide, connecting the entire ecosystem.",
      stats: "Zero downtime",
      color: "from-green-500 to-emerald-500",
      emoji: "🌳",
    },
    {
      system: "routing",
      icon: <Truck className="h-8 w-8" />,
      title: "Antelope Paths",
      subtitle: "Optimized Delivery Routes",
      description:
        "Swift as antelopes, our routing system finds the fastest paths across Kenya's digital savanna.",
      stats: "30% faster delivery",
      color: "from-blue-500 to-cyan-500",
      emoji: "🛤️",
    },
    {
      system: "payments",
      icon: <CreditCard className="h-8 w-8" />,
      title: "Rhino Charge",
      subtitle: "Unstoppable M-Pesa Processing",
      description:
        "With the unstoppable force of a charging rhino, our payment system never backs down.",
      stats: "99.9% success rate",
      color: "from-purple-500 to-pink-500",
      emoji: "🦏",
    },
  ];

  const ecosystemBenefits = [
    {
      title: "Symbiotic Revenue",
      description:
        "Like oxpeckers on rhinos - we take small commissions without harming your business",
      icon: "🐦",
      type: "Commensalism",
    },
    {
      title: "Mutual Growth",
      description:
        "Group buying benefits everyone, like buffaloes and egrets working together",
      icon: "🦬",
      type: "Mutualism",
    },
    {
      title: "Herd Protection",
      description:
        "The pride protects all members - fraud detection keeps everyone safe",
      icon: "🦁",
      type: "Protection",
    },
    {
      title: "Knowledge Sharing",
      description:
        "Elephants share wisdom - our data insights help the whole ecosystem thrive",
      icon: "🐘",
      type: "Wisdom",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-green-100 text-green-700"
          >
            🦅 Technical Infrastructure
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Powered by Wildlife Instincts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our technical systems mirror nature's most efficient hunters,
            builders, and survivors. Each component evolved to serve the digital
            ecosystem with instinctive precision.
          </p>
        </div>

        {/* Core Systems Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={feature.system}
              className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 transition-all duration-500 wildlife-card"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-all duration-500`}
              />

              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-green-700 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl group-hover:animate-bounce">
                    {feature.emoji}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <Badge
                    className={`bg-gradient-to-r ${feature.color} text-white border-0`}
                  >
                    {feature.stats}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ecosystem Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              The Circle of Digital Trade
            </h3>
            <p className="text-lg text-muted-foreground">
              Nature teaches us the perfect balance of give and take
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemBenefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="text-center group hover:shadow-lg transition-all duration-300 border-green-200 hover:border-green-400"
              >
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-3 group-hover:animate-bounce">
                    {benefit.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className="mx-auto border-green-300 text-green-700 mb-2"
                  >
                    {benefit.type}
                  </Badge>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700 mb-2">
              Ecosystem Health Metrics
            </CardTitle>
            <p className="text-green-600">
              Real-time vitals of our digital savanna
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Watering Hole Activity",
                  value: 98,
                  unit: "% uptime",
                  icon: "💧",
                },
                {
                  label: "Herd Growth Rate",
                  value: 85,
                  unit: "% monthly",
                  icon: "📈",
                },
                {
                  label: "Predator Detection",
                  value: 99.8,
                  unit: "% accuracy",
                  icon: "🛡️",
                },
                {
                  label: "Migration Speed",
                  value: 92,
                  unit: "% faster",
                  icon: "⚡",
                },
              ].map((metric, index) => (
                <div key={metric.label} className="text-center space-y-3">
                  <div className="text-2xl">{metric.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      {metric.value}
                      {metric.unit}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {metric.label}
                    </div>
                  </div>
                  <Progress value={metric.value} className="h-2 bg-green-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-4">
                Ready to Join the Digital Savanna?
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Experience the power of nature-inspired technology. Where every
                trade thrives in perfect harmony.
              </p>
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3"
              >
                <span className="mr-2">🦬</span>
                Start Your Safari
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
