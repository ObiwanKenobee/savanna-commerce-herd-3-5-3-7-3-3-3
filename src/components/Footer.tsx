
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Savanna Marketplace</h3>
                <p className="text-sm opacity-80">Trade Smarter, Grow Faster</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Kenya's premier B2B marketplace where businesses thrive together like the wildlife of our beautiful savanna.
            </p>
            <div className="flex space-x-4">
              {['🦁', '🐘', '🦒', '🐆'].map((animal, index) => (
                <span 
                  key={index} 
                  className="text-2xl hover:scale-110 transition-transform cursor-pointer"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {animal}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Browse Suppliers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Retailers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Group Buying</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Waterhole Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">24/7 Chat 💬</a></li>
              <li><a href="#" className="hover:text-white transition-colors">USSD: *384#</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm mb-4 md:mb-0">
            © 2024 Savanna Marketplace. Proudly Kenyan. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-white/20">
          <p className="text-primary-foreground/60 text-sm">
            🌍 Built with love for the Kenyan business community • Powered by nature's wisdom
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
