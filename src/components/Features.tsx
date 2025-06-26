
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      title: "The Migration Deal",
      subtitle: "Seasonal Bulk Discounts",
      description: "Like the great wildebeest migration, these deals move in cycles. Time your purchases with seasonal patterns for maximum savings.",
      icon: "🦌",
      badge: "Limited Time",
      benefit: "Up to 40% savings on bulk orders"
    },
    {
      title: "Pride Loyalty Program", 
      subtitle: "Group Rewards System",
      description: "Hunt together, save together. Refer other businesses and unlock pack rewards that benefit everyone in your pride.",
      icon: "🦁",
      badge: "Community",
      benefit: "Earn points for every referral"
    },
    {
      title: "Waterhole Hotline",
      subtitle: "24/7 Support Network",
      description: "Just like animals gather at waterholes, our support connects suppliers and retailers around the clock.",
      icon: "💬",
      badge: "Always Open",
      benefit: "Instant chat with emoji support"
    }
  ];

  return (
    <section className="py-20 px-4 watercolor-bg">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Unique Features That Make Us
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Wild</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These aren't just features – they're survival instincts for the modern Kenyan marketplace
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              
              <CardHeader className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <Badge className="w-fit mb-2 bg-accent/20 text-accent border-accent/30">
                  {feature.badge}
                </Badge>
                <CardTitle className="text-xl text-foreground">
                  {feature.title}
                </CardTitle>
                <p className="text-sm text-primary font-medium">
                  {feature.subtitle}
                </p>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    💡 {feature.benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 border-2 border-primary/20">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Join the Savanna Revolution?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop hunting alone. Join thousands of Kenyan businesses who've found their pride in our marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-full text-lg">
              Start Your Free Trial
              <span className="ml-2">🚀</span>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 rounded-full text-lg border-2">
              Schedule Demo Call
              <span className="ml-2">📞</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
