import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  BarChart3,
  Users,
  Shield,
  Truck,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Search,
  Crown,
  Zap,
  Activity,
  Server,
} from "lucide-react";

const AdminNavigation = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Command Center",
      href: "/admin/dashboard",
      icon: BarChart3,
      description: "Real-time savanna pulse",
    },
    {
      name: "Pride Control",
      href: "/admin/users",
      icon: Users,
      description: "User management ecosystem",
    },
    {
      name: "Waterhole Rules",
      href: "/admin/governance",
      icon: Shield,
      description: "Marketplace governance",
    },
    {
      name: "Migration Paths",
      href: "/admin/logistics",
      icon: Truck,
      description: "Delivery optimization",
    },
    {
      name: "Savanna Scalability",
      href: "/admin/growth",
      icon: TrendingUp,
      description: "Growth & expansion tools",
    },
    {
      name: "Rhino Guard",
      href: "/admin/security",
      icon: Crown,
      description: "Security & compliance",
    },
    {
      name: "Savanna Pulse",
      href: "/admin/monitoring",
      icon: Activity,
      description: "Performance monitoring",
    },
    {
      name: "DevOps Center",
      href: "/admin/devops",
      icon: Server,
      description: "Infrastructure & deployments",
    },
    {
      name: "SEO Command",
      href: "/admin/seo",
      icon: Search,
      description: "Planetary-scale SEO optimization",
    },
  ];

  const isActiveRoute = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/admin/dashboard"
              className="flex-shrink-0 flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-white">Savanna</span>
                <span className="ml-1 text-sm text-yellow-400 font-medium">
                  Admin
                </span>
                <div className="text-xs text-slate-300">🦁 Command Center</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="hidden xl:block">
                    <div>{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-300 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
              >
                7
              </Badge>
            </Button>

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex text-slate-300 hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span className="ml-2">Search</span>
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-yellow-600 text-white">
                        👑
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-white">
                        Admin Panel
                      </div>
                      <div className="text-xs text-slate-300">
                        {profile?.full_name || "Administrator"}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">🦁 Admin Access</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="flex items-center w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>User Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-slate-300 hover:text-white"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] bg-slate-900 border-slate-700"
              >
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Admin Navigation
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-white/10 text-white border border-white/20"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs opacity-75">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300">
                System Status: All Services Operational
              </span>
            </div>
            <div className="text-slate-400">
              🦓 47 active migrations • 🦏 94% security score • 🦅 7 threats
              blocked
            </div>
          </div>
          <div className="text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
