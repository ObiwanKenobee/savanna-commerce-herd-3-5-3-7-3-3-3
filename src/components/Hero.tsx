
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden watercolor-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      {/* Animated Wildlife Silhouettes */}
      <div className="absolute bottom-20 left-0 migration-animation opacity-20">
        <div className="flex space-x-8">
          {['🦓', '🦌', '🐘'].map((animal, index) => (
            <span key={index} className="text-4xl savanna-pulse" style={{ animationDelay: `${index * 0.5}s` }}>
              {animal}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Trade Smarter,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Grow Faster
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Kenya's premier B2B marketplace where suppliers and retailers unite like a pride. 
            Fast as a cheetah, strong as an elephant, growing like the savanna.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Hunt for the best prices – like a leopard on the prowl! 🐆"
                className="pl-12 pr-32 py-4 text-lg rounded-full border-2 border-primary/20 focus:border-primary"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 rounded-full">
              Join the Herd – Sign Up in 60 Seconds
              <span className="ml-2">🦬</span>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2">
              Watch Demo
              <span className="ml-2">▶️</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 opacity-30 animate-pulse">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/30 to-secondary/30" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30" />
      </div>
    </section>
  );
};

export default Hero;
