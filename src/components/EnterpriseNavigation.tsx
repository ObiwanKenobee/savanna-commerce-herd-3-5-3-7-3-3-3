import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  ChevronDown,
  Bell,
  Zap,
  Truck,
  TrendingUp,
  LogOut,
  Settings,
  CreditCard,
  Languages,
  Smartphone,
  Camera,
  BarChart3,
  Package,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";

const EnterpriseNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    "retailer" | "supplier" | "logistics"
  >("retailer");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [ussdMode, setUssdMode] = useState(false);
  const [cheetahMode, setCheetahMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [rhinoScore, setRhinoScore] = useState(78);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  // Sound effects simulation
  const playSound = (type: "roar" | "chirp" | "stampede") => {
    console.log(`🔊 Playing ${type} sound effect`);
    // In production, you'd use Web Audio API or audio elements
  };

  // Animation for logo hover
  const handleLogoHover = () => {
    playSound("roar");
    console.log("🦁 Lion roars gently");
  };

  // Quick order search with enhanced functionality
  const handleQuickOrder = (query: string) => {
    if (query.trim()) {
      // Show loading toast
      console.log(`🔍 Searching for: ${query}`);

      // Navigate to marketplace with search parameters
      navigate(
        `/marketplace?search=${encodeURIComponent(query)}&cheetah=${cheetahMode ? "true" : "false"}`,
      );

      // Play search sound effect
      playSound("chirp");

      // Show success notification
      setTimeout(() => {
        console.log(`✅ Found products matching "${query}"`);
      }, 500);
    } else {
      console.log("⚠️ Please enter a search term");
    }
  };

  // WhatsApp image upload with enhanced functionality
  const handleWhatsAppUpload = () => {
    console.log("📱 Opening WhatsApp product upload");

    const message = `🦁 *SAVANNA MARKETPLACE - PRODUCT UPLOAD*

Hello! I want to list a new product on Savanna Marketplace.

📸 I will send photos and details:
• Product name and description
• Price and quantity available
• Location/delivery areas
• Any special offers

Please help me get started! 🌍`;

    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Track the action
    console.log("📊 WhatsApp upload initiated");

    // Show success notification
    setTimeout(() => {
      console.log("✅ WhatsApp opened successfully! Send your product photos.");
    }, 1000);
  };

  // Enhanced notification handler
  const handleNotificationClick = () => {
    console.log("🦎 Opening notifications panel");
    setNotifications(Math.max(0, notifications - 1));

    // Simulate showing notification panel
    setTimeout(() => {
      console.log("📋 Showing recent notifications...");
    }, 200);
  };

  // User role switching
  const handleRoleSwitch = (newRole: "retailer" | "supplier" | "logistics") => {
    setUserRole(newRole);
    console.log(`🔄 Switched to ${newRole} mode`);

    // Navigate to appropriate dashboard
    const dashboardMap = {
      retailer: "/dashboard/retailer/enhanced",
      supplier: "/dashboard/supplier/enhanced",
      logistics: "/dashboard/logistics",
    };

    navigate(dashboardMap[newRole]);
  };

  // Enhanced language switching
  const handleLanguageSwitch = (newLang: "en" | "sw") => {
    setLanguage(newLang);
    console.log(
      `🌍 Language switched to ${newLang === "en" ? "English" : "Kiswahili"}`,
    );

    // Store in localStorage
    localStorage.setItem("savanna_language", newLang);

    // Show confirmation
    const message =
      newLang === "en"
        ? "Language changed to English"
        : "Lugha imebadilishwa kuwa Kiswahili";
    console.log(`✅ ${message}`);
  };

  // Logout functionality
  const handleLogout = () => {
    console.log("🌅 Logging out with sunset animation...");

    // Clear user data
    localStorage.removeItem("savanna_user");
    localStorage.removeItem("savanna_session");

    // Navigate to home with animation
    setTimeout(() => {
      navigate("/");
      console.log("👋 Successfully logged out. Have a great day!");
    }, 1000);
  };

  const tradeMenuItems = [
    {
      name: "Orders",
      href: "/orders",
      icon: "📦",
      description: "Track your orders",
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: "📊",
      description: "Manage stock levels",
    },
    {
      name: "BNPL Credit",
      href: "/credit",
      icon: "💳",
      description: "Buy Now Pay Later",
    },
  ];

  const growMenuItems = [
    {
      name: "Analytics",
      href: "/analytics",
      icon: "📈",
      description: "Business insights",
    },
    {
      name: "Credit Score",
      href: "/credit-score",
      icon: "⭐",
      description: "Your business rating",
    },
    {
      name: "Training Hub",
      href: "/training",
      icon: "🎓",
      description: "Learn & grow",
    },
  ];

  const logisticsMenuItems = [
    {
      name: "Track Deliveries",
      href: "/track",
      icon: "📍",
      description: "Real-time tracking",
    },
    {
      name: "Driver Hub",
      href: "/drivers",
      icon: "🚛",
      description: "Delivery partners",
    },
    {
      name: "Route Optimizer",
      href: "/routes",
      icon: "🗺️",
      description: "Smart routing",
    },
  ];

  const enterpriseMenuItems = [
    {
      name: "Watering Holes",
      href: "/watering-holes",
      icon: "💧",
      description: "Community marketplaces",
    },
    {
      name: "Herd Directory",
      href: "/herd-directory",
      icon: "🦌",
      description: "Business network",
    },
    {
      name: "Swift Retailers",
      href: "/swift-retailers",
      icon: "⚡",
      description: "Fast-moving retailers",
    },
    {
      name: "Pack Stories",
      href: "/pack-stories",
      icon: "📖",
      description: "Success stories",
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#2E8B57] to-[#228B22] shadow-lg fixed top-0 w-full z-50">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT SECTION - Brand + Core Navigation */}
          <div className="flex items-center space-x-8">
            {/* Animated Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onMouseEnter={handleLogoHover}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl animate-pulse">🦁</span>
                </div>
                {/* Roar effect animation */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              </div>
              <div className="hidden md:block">
                <h1
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "serif" }}
                >
                  Savanna Marketplace
                </h1>
                <p className="text-xs text-green-100">
                  Trade Smarter in Africa
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Dropdowns */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Trade Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 flex items-center space-x-2"
                  >
                    <span className="text-lg">🦁</span>
                    <span>Trade</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm">
                  <DropdownMenuLabel className="text-[#2E8B57] font-semibold">
                    Trade Operations
                  </DropdownMenuLabel>
                  {tradeMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Grow Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 flex items-center space-x-2"
                  >
                    <span className="text-lg">🌿</span>
                    <span>Grow</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm">
                  <DropdownMenuLabel className="text-[#2E8B57] font-semibold">
                    Growth Tools
                  </DropdownMenuLabel>
                  {growMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enterprise Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 flex items-center space-x-2"
                  >
                    <span className="text-lg">🏢</span>
                    <span>Enterprise</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm">
                  <DropdownMenuLabel className="text-[#2E8B57] font-semibold">
                    Enterprise Hub
                  </DropdownMenuLabel>
                  {enterpriseMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logistics Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 flex items-center space-x-2"
                  >
                    <span className="text-lg">🚛</span>
                    <span>Logistics</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm">
                  <DropdownMenuLabel className="text-[#2E8B57] font-semibold">
                    Safari Routes
                  </DropdownMenuLabel>
                  {logisticsMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* CENTER SECTION - Role-Specific Quick Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            {userRole === "retailer" && (
              <div className="flex items-center space-x-3 w-full">
                {/* Quick Order Search */}
                <div className="relative flex-1">
                  <Input
                    placeholder="🔍 Hunt for sugar, flour, rice..."
                    className="pl-4 pr-12 bg-white/90 border-[#FFD700] focus:border-[#FFD700] focus:ring-[#FFD700]"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        handleQuickOrder(target.value);
                        target.value = ""; // Clear input after search
                      }
                    }}
                    onChange={(e) => {
                      // Auto-suggest functionality could be added here
                      const value = e.target.value;
                      if (value.length > 2) {
                        console.log(`💡 Suggesting products for: ${value}`);
                      }
                    }}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                {/* Cheetah Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <Toggle
                    pressed={cheetahMode}
                    onPressedChange={setCheetahMode}
                    className="data-[state=on]:bg-[#FFD700] data-[state=on]:text-black"
                  >
                    <Zap className="h-4 w-4" />
                  </Toggle>
                  <span className="text-xs text-white hidden lg:block">
                    Cheetah Mode
                  </span>
                </div>
              </div>
            )}

            {userRole === "supplier" && (
              <div className="flex items-center space-x-3 w-full">
                {/* List New Product Button */}
                <Button
                  onClick={handleWhatsAppUpload}
                  className="bg-[#FFD700] text-black hover:bg-[#FFA500] flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>List Product</span>
                </Button>

                {/* Rhino Score */}
                <div className="flex items-center space-x-2 min-w-[120px]">
                  <span className="text-xs text-white">🦏 Score:</span>
                  <div className="flex-1">
                    <Progress value={rhinoScore} className="h-2 bg-white/20" />
                  </div>
                  <span className="text-xs text-[#FFD700] font-bold">
                    {rhinoScore}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - User + System Controls */}
          <div className="flex items-center space-x-4">
            {/* System Toggles */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Languages className="h-4 w-4 mr-1" />
                    {language.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    ���🇧 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("sw")}>
                    🇰🇪 Kiswahili
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* USSD Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/10 ${ussdMode ? "bg-[#FFD700] text-black" : ""}`}
                onClick={() => setUssdMode(!ussdMode)}
              >
                <Smartphone className="h-4 w-4" />
              </Button>

              {/* Shopping Cart */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 relative"
              >
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  {cart.totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-green-500 text-white animate-pulse">
                      {cart.totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 relative"
                onClick={handleNotificationClick}
              >
                <span className="text-lg">🦎</span>
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white animate-pulse">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                    <span className="text-sm">🦁</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-sm"
              >
                <DropdownMenuLabel>My Den 🏠</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Role Switcher */}
                <div className="px-2 py-1">
                  <div className="text-xs text-gray-500 mb-2">Switch Role:</div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={userRole === "retailer" ? "default" : "outline"}
                      onClick={() => handleRoleSwitch("retailer")}
                      className="text-xs px-2 py-1"
                    >
                      🛒 Retailer
                    </Button>
                    <Button
                      size="sm"
                      variant={userRole === "supplier" ? "default" : "outline"}
                      onClick={() => handleRoleSwitch("supplier")}
                      className="text-xs px-2 py-1"
                    >
                      🏭 Supplier
                    </Button>
                    <Button
                      size="sm"
                      variant={userRole === "logistics" ? "default" : "outline"}
                      onClick={() => handleRoleSwitch("logistics")}
                      className="text-xs px-2 py-1"
                    >
                      🚛 Logistics
                    </Button>
                  </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/credit" className="flex items-center space-x-2">
                    <span className="text-lg">💧</span>
                    <span>Waterhole Credit</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 flex items-center space-x-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                  <span className="ml-auto text-xs">🌅 Sunset</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] bg-[#2E8B57]">
                <SheetHeader>
                  <SheetTitle className="text-white">
                    🦁 Savanna Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Priority Items for Mobile */}
                  <div className="space-y-4">
                    <h3 className="text-[#FFD700] font-semibold">
                      🇰🇪 Kenya Essentials
                    </h3>

                    <Button
                      onClick={() => (window.location.href = "tel:*384#")}
                      className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500] justify-start"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      USSD Shortcut (*384#)
                    </Button>

                    <Button
                      asChild
                      className="w-full bg-red-600 text-white hover:bg-red-700 justify-start"
                    >
                      <Link to="/credit/emergency">
                        <Zap className="h-4 w-4 mr-2" />
                        Emergency BNPL Top-Up
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 justify-start"
                    >
                      <Link to="/cart">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart ({cart.totalItems})
                        {cart.totalItems > 0 && (
                          <Badge className="ml-auto bg-green-500 text-white">
                            KES {cart.totalAmount.toLocaleString()}
                          </Badge>
                        )}
                      </Link>
                    </Button>

                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Offline Order Sync
                    </Button>
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-4">
                    <h3 className="text-[#FFD700] font-semibold">
                      🔥 Main Menu
                    </h3>

                    {tradeMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-white hover:text-[#FFD700] py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-green-200">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Enterprise Navigation */}
                  <div className="space-y-4">
                    <h3 className="text-[#FFD700] font-semibold">
                      🏢 Enterprise Hub
                    </h3>

                    {enterpriseMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-white hover:text-[#FFD700] py-2"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-green-200">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Language & Settings */}
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between text-white">
                      <span>Language:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleLanguageSwitch(language === "en" ? "sw" : "en")
                        }
                        className="text-[#FFD700]"
                      >
                        {language === "en" ? "🇬🇧 EN" : "🇰🇪 SW"}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cheetah Mode Indicator */}
      {cheetahMode && (
        <div className="bg-[#FFD700] text-black px-4 py-1 text-center text-sm font-medium">
          ⚡ Cheetah Mode Active - 1-Hour Delivery Priority ⚡
        </div>
      )}
    </nav>
  );
};

export default EnterpriseNavigation;
