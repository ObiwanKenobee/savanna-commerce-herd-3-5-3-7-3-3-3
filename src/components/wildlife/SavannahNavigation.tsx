import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  Bell,
  Settings,
  Volume2,
  VolumeX,
  LogOut,
} from "lucide-react";

interface SavannahNavigationProps {
  pridePoints?: number;
  notifications?: number;
}

export const SavannahNavigation = ({
  pridePoints = 0,
  notifications = 0,
}: SavannahNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    {
      name: "Ecosystem 2.0",
      href: "/ecosystem-expansion",
      emoji: "🌍",
      description: "Transformative expansion framework",
      requiresAuth: false,
      allowedRoles: [],
      subItems: [
        {
          name: "Features",
          href: "/features",
          description: "Platform capabilities",
        },
        {
          name: "About Us",
          href: "/about",
          description: "Our mission & vision",
        },
        { name: "Pricing", href: "/pricing", description: "Plans & packages" },
      ],
    },
    {
      name: "African Heritage",
      href: "/african-heritage",
      emoji: "🏛️",
      description: "Pre-colonial engineering innovations",
      requiresAuth: false,
      allowedRoles: [],
      subItems: [
        {
          name: "Heritage Dashboard",
          href: "/african-heritage",
          description: "Innovation showcase",
        },
        {
          name: "Admin Panel",
          href: "/admin/african-heritage",
          description: "Heritage management",
        },
      ],
    },
    {
      name: "Open Market",
      href: "/open-market",
      emoji: "🛒",
      description: "Savannah marketplace with personalized shops",
      requiresAuth: false,
      allowedRoles: [],
      subItems: [
        {
          name: "Browse Market",
          href: "/open-market",
          description: "Explore shops",
        },
        {
          name: "Group Buying",
          href: "/group-buying",
          description: "Bulk purchase power",
        },
        {
          name: "Chama DAOs",
          href: "/chama-daos",
          description: "Community organizations",
        },
        {
          name: "M-Pesa Goats",
          href: "/mpesa-goats",
          description: "Digital livestock trading",
        },
      ],
    },
    {
      name: "Enterprise Hub",
      href: "/watering-holes",
      emoji: "🏢",
      description: "Business collaboration ecosystem",
      requiresAuth: true,
      allowedRoles: ["admin", "supplier", "retailer"],
      subItems: [
        {
          name: "Watering Holes",
          href: "/watering-holes",
          description: "Trading hubs",
        },
        {
          name: "Herd Directory",
          href: "/herd-directory",
          description: "Supplier network",
        },
        {
          name: "Swift Retailers",
          href: "/swift-retailers",
          description: "Fast retail solutions",
        },
        {
          name: "Pack Stories",
          href: "/pack-stories",
          description: "Success stories",
        },
      ],
    },
    {
      name: "Innovation",
      href: "/innovation",
      emoji: "⚡",
      description: "Cutting-edge solutions",
      requiresAuth: false,
      allowedRoles: [],
      subItems: [
        {
          name: "Matatu Mesh",
          href: "/matatu-mesh",
          description: "Transport network",
        },
        {
          name: "Maasai Merit",
          href: "/maasai-merit",
          description: "Cultural value system",
        },
        {
          name: "Harambee Procurement",
          href: "/harambee-procurement",
          description: "Community sourcing",
        },
        {
          name: "Oral Contracts",
          href: "/oral-contracts",
          description: "Trust-based agreements",
        },
      ],
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Enhanced Logo with Wildlife Theme - Responsive */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-lg sm:text-xl lg:text-2xl group-hover:animate-bounce">
                  🌍
                </span>
              </div>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Digital Savannah
              </h1>
              <p className="text-xs lg:text-xs text-emerald-600 font-medium hidden sm:block">
                Where Every Trade Thrives
              </p>
            </div>
          </Link>

          {/* Tablet Navigation - Simplified for medium screens */}
          <div className="hidden lg:flex xl:hidden items-center space-x-2 flex-1 justify-center">
            {navigationLinks.slice(0, 3).map((link) => (
              <Link key={link.name} to={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-full px-3 text-sm"
                >
                  <span className="mr-1 text-sm">{link.emoji}</span>
                  <span className="hidden lg:inline">{link.name}</span>
                </Button>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-full px-3 text-sm"
                >
                  More ⚡
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-md border-green-200">
                {navigationLinks.slice(3).map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer">
                      <span className="mr-2">{link.emoji}</span>
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation - Full breakpoints */}
          <div className="hidden xl:flex items-center space-x-4 2xl:space-x-6 flex-1 justify-center max-w-4xl mx-4">
            {navigationLinks.map((link) => (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-full px-2 xl:px-3 2xl:px-4 text-sm xl:text-base"
                  >
                    <span className="mr-1 xl:mr-2 text-sm">{link.emoji}</span>
                    <span className="hidden xl:inline">{link.name}</span>
                    <span className="xl:hidden">{link.emoji}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-md border-green-200">
                  <DropdownMenuLabel className="text-green-700">
                    {link.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={link.href} className="cursor-pointer font-medium">
                      <span className="mr-2">{link.emoji}</span>
                      {link.description}
                    </Link>
                  </DropdownMenuItem>
                  {link.subItems && link.subItems.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      {link.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild>
                          <Link
                            to={subItem.href}
                            className="cursor-pointer pl-6"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {subItem.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {subItem.description}
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          {/* User Actions - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Search - Hidden on mobile, visible on larger screens */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex hover:bg-green-50 rounded-full p-2"
            >
              <Search className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
            </Button>

            {/* Shopping Cart - Always visible but smaller on mobile */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-green-50 rounded-full p-1.5 sm:p-2"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </Button>
            </Link>

            {/* Auth Buttons - Responsive sizing and text */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 hover:border-green-400 hover:bg-green-50 rounded-full text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden lg:inline">Sign In</span>
                  <span className="lg:hidden">Sign In</span>
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="mr-1 sm:mr-2">🦬</span>
                  <span className="hidden md:inline">Join the Herd</span>
                  <span className="md:hidden">Join</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu - Visible on mobile and tablet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="xl:hidden hover:bg-green-50 rounded-full p-1.5 sm:p-2"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] xs:w-[320px] sm:w-[380px] bg-white/95 backdrop-blur-md overflow-y-auto"
              >
                <SheetHeader className="pb-4">
                  <SheetTitle className="flex items-center text-green-700 text-lg sm:text-xl">
                    <span className="mr-2 text-lg sm:text-xl">🌍</span>
                    <div>
                      <div>Digital Savannah</div>
                      <div className="text-xs text-emerald-600 font-normal">
                        Where Every Trade Thrives
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navigationLinks.map((link) => (
                      <div key={link.name} className="space-y-1">
                        <Link
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-3 text-lg font-medium text-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <span className="text-xl">{link.emoji}</span>
                          <div>
                            <div>{link.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {link.description}
                            </div>
                          </div>
                        </Link>
                        {link.subItems && link.subItems.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {link.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center p-2 text-sm text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              >
                                <div>
                                  <div className="font-medium">
                                    {subItem.name}
                                  </div>
                                  <div className="text-xs">
                                    {subItem.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Auth Buttons for Mobile - Responsive */}
                  <div className="pt-6 space-y-3 border-t border-green-200">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-green-200 hover:border-green-400 text-sm sm:text-base py-2 sm:py-3"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign In to the Pride
                      </Button>
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3">
                        <span className="mr-2">🦬</span>
                        Join the Digital Herd
                      </Button>
                    </Link>

                    {/* Quick Actions for Mobile */}
                    <div className="pt-3 border-t border-green-200/50">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" size="sm" className="w-full">
                            <ShoppingCart className="mr-1 h-4 w-4" />
                            Cart
                          </Button>
                        </Link>
                        <Link
                          to="/support"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" size="sm" className="w-full">
                            <Settings className="mr-1 h-4 w-4" />
                            Help
                          </Button>
                        </Link>
                      </div>
                    </div>
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
