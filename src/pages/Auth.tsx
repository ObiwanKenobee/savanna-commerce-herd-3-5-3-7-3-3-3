import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  safeNavigate,
  getUserRole,
  getDashboardRoute,
} from "@/utils/routeConfig";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Building,
  User,
  ShoppingCart,
  Truck,
  BarChart3,
  ArrowLeft,
  Smartphone,
} from "lucide-react";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<
    "retailer" | "supplier" | "logistics"
  >("retailer");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    businessType: "",
    location: "",
  });

  const { signIn, signUp, demoLogin, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in to appropriate enterprise dashboard
  if (user) {
    try {
      const userRole = getUserRole(user);
      const targetRoute = getDashboardRoute(userRole);

      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        safeNavigate(navigate, targetRoute, userRole);
      }, 0);

      // Show loading while redirecting
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <div className="text-lg font-semibold text-green-800">
              🦁 Welcome back!
            </div>
            <div className="text-green-600">
              Redirecting to your enterprise dashboard...
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("🚨 Redirect error:", error);
      // Fallback to manual navigation
      window.location.href = "/dashboard";
      return null;
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure passwords match",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters",
          variant: "destructive",
        });
        return false;
      }

      if (!formData.firstName || !formData.lastName || !formData.phone) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        const metadata = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          business_name: formData.businessName,
          business_type: formData.businessType,
          location: formData.location,
          user_type: userType,
        };

        await signUp(formData.email, formData.password, metadata);

        // Show success message
        toast({
          title: "🦁 Welcome to the Pride!",
          description:
            "Account created successfully. Please check your email to verify.",
        });

        // Switch to sign in mode
        setIsSignUp(false);
      } else {
        await signIn(formData.email, formData.password);

        // Show success and navigate
        toast({
          title: "🎉 Welcome back to the Savanna!",
          description: "Successfully signed in to your account.",
        });

        // Navigate based on user type to enterprise dashboards
        const dashboardMap = {
          admin: "/admin",
          retailer: "/dashboard/retailer",
          supplier: "/dashboard/supplier",
          logistics: "/dashboard/logistics",
        };

        // Use setTimeout to prevent navigation during render
        setTimeout(() => {
          const targetRoute = getDashboardRoute(userType || "retailer");
          safeNavigate(navigate, targetRoute, userType || "retailer");
        }, 500);
      }
    } catch (error: any) {
      console.error("🚨 Auth error:", error);

      let errorMessage = "Please try again";
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "🚫 Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (
    role: "retailer" | "supplier" | "logistics",
  ) => {
    setLoading(true);

    try {
      await demoLogin(role);

      toast({
        title: "🦁 Demo Mode Activated!",
        description: `Welcome to Savanna Marketplace as a ${role}`,
      });

      setTimeout(() => {
        const targetRoute = getDashboardRoute(role);
        safeNavigate(navigate, targetRoute, role);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Demo login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);

    try {
      // Use the admin credentials
      await signIn("admin@savanna-marketplace.com", "Admin123!");

      toast({
        title: "🦁 Pride Leader Access Granted!",
        description: "Welcome to Savanna Marketplace Admin Dashboard",
      });

      setTimeout(() => {
        safeNavigate(navigate, "/admin", "admin");
      }, 500);
    } catch (error: any) {
      toast({
        title: "Admin login failed",
        description: error.message || "Please check credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      id: "retailer",
      title: "Retailer/Shop Owner",
      description: "Buy products in bulk, manage inventory, join group buying",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-green-500",
      features: [
        "Group Buying",
        "BNPL Credit",
        "Inventory Management",
        "Quick Orders",
      ],
    },
    {
      id: "supplier",
      title: "Supplier/Distributor",
      description: "Sell to retailers, manage orders, track performance",
      icon: <Building className="h-6 w-6" />,
      color: "bg-blue-500",
      features: [
        "Product Catalog",
        "Order Management",
        "Analytics",
        "Bulk Pricing",
      ],
    },
    {
      id: "logistics",
      title: "Logistics Partner",
      description: "Deliver orders, optimize routes, track earnings",
      icon: <Truck className="h-6 w-6" />,
      color: "bg-purple-500",
      features: [
        "Route Optimization",
        "Delivery Tracking",
        "Driver Hub",
        "Earnings",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="pt-8 pb-12 px-4">
        {/* Clean auth layout */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="text-4xl">🦁</div>
                <h1 className="text-3xl font-bold">Join the Savanna Pride</h1>
              </div>
              <p className="text-gray-600">
                Connect with Africa's largest B2B marketplace ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Auth Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">
                    {isSignUp ? "🌱 Create Your Account" : "🏠 Welcome Back"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={isSignUp ? "signup" : "signin"}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="signin"
                        onClick={() => setIsSignUp(false)}
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        onClick={() => setIsSignUp(true)}
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    {/* User Type Selection */}
                    {isSignUp && (
                      <div className="mb-6">
                        <Label className="text-sm font-medium mb-3 block">
                          I am a:
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {userTypes.map((type) => (
                            <Button
                              key={type.id}
                              variant={
                                userType === type.id ? "default" : "outline"
                              }
                              onClick={() => setUserType(type.id as any)}
                              className="h-auto p-3 flex flex-col items-center space-y-1"
                            >
                              <div
                                className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center text-white`}
                              >
                                {type.icon}
                              </div>
                              <span className="text-xs text-center">
                                {type.title.split("/")[0]}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name fields for signup */}
                      {isSignUp && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.co.ke"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone for signup */}
                      {isSignUp && (
                        <div>
                          <Label htmlFor="phone">Phone Number (M-Pesa) *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+254712345678"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Business info for signup */}
                      {isSignUp && (
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                              id="businessName"
                              placeholder="Your business name"
                              value={formData.businessName}
                              onChange={(e) =>
                                handleInputChange(
                                  "businessName",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              placeholder="Nairobi, Kenya"
                              value={formData.location}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Password */}
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className="pl-10 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Confirm Password for signup */}
                      {isSignUp && (
                        <div>
                          <Label htmlFor="confirmPassword">
                            Confirm Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value,
                                )
                              }
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : isSignUp
                            ? "🚀 Create Account"
                            : "🦁 Sign In"}
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                        or try demo
                      </span>
                    </div>

                    {/* Demo Buttons */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDemoLogin("retailer")}
                          className="w-full"
                          disabled={loading}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Retailer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDemoLogin("supplier")}
                          className="w-full"
                          disabled={loading}
                        >
                          <Building className="h-4 w-4 mr-1" />
                          Supplier
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDemoLogin("logistics")}
                          className="w-full"
                          disabled={loading}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Logistics
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAdminLogin()}
                          className="w-full bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
                          disabled={loading}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Admin
                        </Button>
                      </div>
                    </div>

                    {/* Admin Credentials Info */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800 mb-2">
                        🦁 Admin Credentials:
                      </div>
                      <div className="space-y-1 text-xs text-yellow-700">
                        <div>
                          <strong>Email:</strong> admin@savanna-marketplace.com
                        </div>
                        <div>
                          <strong>Password:</strong> Admin123!
                        </div>
                      </div>
                    </div>

                    {/* USSD Alternative */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          No smartphone? No problem!
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Access Savanna Marketplace from any phone via USSD
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "tel:*384#")}
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                      >
                        📱 Dial *384# Now
                      </Button>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right Side - Features */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>🌍 Why Join Savanna Marketplace?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🤝</span>
                        <span className="text-sm">Group Buying</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm">1-Hour Delivery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💳</span>
                        <span className="text-sm">M-Pesa BNPL</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🛡️</span>
                        <span className="text-sm">Verified Suppliers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected User Type Details */}
                {isSignUp && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full ${userTypes.find((t) => t.id === userType)?.color} flex items-center justify-center text-white`}
                        >
                          {userTypes.find((t) => t.id === userType)?.icon}
                        </div>
                        <span>
                          {userTypes.find((t) => t.id === userType)?.title}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {userTypes.find((t) => t.id === userType)?.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Features included:
                        </div>
                        {userTypes
                          .find((t) => t.id === userType)
                          ?.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-green-600">✓</span>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Testimonials */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>🗣️ What Our Users Say</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="text-sm italic mb-2">
                        "Savanna Marketplace has revolutionized my business.
                        Group buying saves me 30% on costs!"
                      </p>
                      <div className="text-xs text-gray-600">
                        - Mary Wanjiku, Nairobi Retailer
                      </div>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm italic mb-2">
                        "The M-Pesa integration and delivery tracking are
                        game-changers for my supply business."
                      </p>
                      <div className="text-xs text-gray-600">
                        - James Kiprotich, Supplier
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="shadow-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">15,000+</div>
                        <div className="text-sm opacity-90">Active Users</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">2,500+</div>
                        <div className="text-sm opacity-90">Suppliers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">KES 2.5B+</div>
                        <div className="text-sm opacity-90">Traded Value</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">47</div>
                        <div className="text-sm opacity-90">Counties</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
