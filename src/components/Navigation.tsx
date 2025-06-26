import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, User, ShoppingCart, Menu } from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { name: "Browse", href: "/marketplace" },
    { name: "Suppliers", href: "/marketplace?filter=suppliers" },
    { name: "Retailers", href: "/marketplace?filter=retailers" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700">
                Savanna Marketplace
              </h1>
              <p className="text-xs text-muted-foreground">
                Trade Smarter, Grow Faster
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-foreground hover:text-green-600 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Link to="/pricing">
              <Button className="hidden md:flex bg-green-600 hover:bg-green-700">
                Join the Herd
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-foreground hover:text-green-600 transition-colors py-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-3 border-t">
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Join the Herd
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
