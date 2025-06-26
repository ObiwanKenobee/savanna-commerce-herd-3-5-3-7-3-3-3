
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ValueProposition = () => {
  const features = [
    {
      icon: "🦒",
      title: "Visibility Like a Giraffe",
      description: "See the entire market landscape from the highest vantage point. Track inventory, prices, and trends across Kenya.",
      badge: "Market Intelligence"
    },
    {
      icon: "🐝",
      title: "Community Like a Beehive",
      description: "Group buying power that creates sweet deals for everyone. Join forces with other retailers for bulk discounts.",
      badge: "Group Buying"
    },
    {
      icon: "🐆",
      title: "Speed Like a Cheetah",
      description: "Lightning-fast delivery networks that get your orders moving at record speed across the country.",
      badge: "Fast Delivery"
    },
    {
      icon: "🦏",
      title: "Strength Like a Rhino",
      description: "Robust platform built to handle the toughest business challenges with unwavering reliability.",
      badge: "Enterprise Grade"
    },
    {
      icon: "🌳",
      title: "Growth Like an Acacia",
      description: "Your business grows deep roots and reaches new heights with our comprehensive business tools.",
      badge: "Business Growth"
    },
    {
      icon: "🦅",
      title: "Precision Like an Eagle",
      description: "Spot opportunities from miles away with our advanced analytics and market intelligence.",
      badge: "Analytics"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why Choose the 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Savanna Way?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature inspired by the wisdom of the wild, designed for the modern Kenyan business ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <Badge variant="secondary" className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
