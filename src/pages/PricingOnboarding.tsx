import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Truck,
  Crown,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  MapPin,
  Building,
  CreditCard,
  Smartphone,
  Globe,
  BarChart3,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  wildlife: string;
  userType: "retailer" | "supplier" | "logistics" | "enterprise";
}

const PricingOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    businessType: "",
    expectedVolume: "",
    acceptTerms: false,
    acceptMarketing: false,
  });

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const pricingPlans: PricingPlan[] = [
    {
      id: "retailer-free",
      name: "Waterhole Starter",
      price: 0,
      currency: "KES",
      period: "Forever",
      description:
        "Perfect for mama mbogas and small kiosks starting their digital journey",
      features: [
        "USSD ordering (*384*7#)",
        "M-Pesa payments",
        "Basic inventory alerts",
        "Community group buying",
        "SMS notifications",
        "5% transaction fee",
      ],
      limitations: ["Limited to 50 orders/month", "Basic support only"],
      wildlife: "🦓",
      userType: "retailer",
    },
    {
      id: "retailer-pro",
      name: "Lion's Pride Pro",
      price: 1500,
      currency: "KES",
      period: "month",
      description: "Advanced features for growing retailers and supermarkets",
      features: [
        "Everything in Starter",
        "Waterhole Credit (BNPL)",
        "Advanced analytics",
        "Priority support",
        "Bulk ordering discounts",
        "White-label receipts",
        "3% transaction fee",
      ],
      popular: true,
      wildlife: "🦁",
      userType: "retailer",
    },
    {
      id: "supplier-growth",
      name: "Elephant Scale",
      price: 8500,
      currency: "KES",
      period: "month",
      description: "Comprehensive platform for wholesalers and brand suppliers",
      features: [
        "Supplier dashboard",
        "Inventory management",
        "Demand forecasting",
        "Analytics & insights",
        "Customer ratings",
        "API access",
        "6% commission + fixed fee",
      ],
      wildlife: "🐘",
      userType: "supplier",
    },
    {
      id: "supplier-enterprise",
      name: "Baobab Enterprise",
      price: 25000,
      currency: "KES",
      period: "month",
      description: "White-label solution for major brands like Bidco, Unilever",
      features: [
        "Everything in Growth",
        "White-label storefront",
        "Custom branding",
        "Dedicated account manager",
        "Advanced reporting",
        "Multi-location support",
        "4% commission + enterprise fee",
      ],
      wildlife: "🌳",
      userType: "supplier",
    },
    {
      id: "logistics-partner",
      name: "Safari Routes",
      price: 0,
      currency: "KES",
      period: "Pay per delivery",
      description: "Earnings platform for boda boda and delivery partners",
      features: [
        "Route optimization",
        "Earnings tracking",
        "Performance ratings",
        "Weather alerts",
        "Surge pricing",
        "Mobile app access",
        "KES 50-300 per delivery",
      ],
      wildlife: "🏍️",
      userType: "logistics",
    },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = pricingPlans.find((p) => p.id === planId);
    if (plan) {
      setUserType(plan.userType);
      setCurrentStep(2);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.businessName.trim()) errors.push("Business name is required");
    if (!formData.ownerName.trim()) errors.push("Owner name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!formData.location) errors.push("Location is required");
    if (!formData.businessType) errors.push("Business type is required");
    if (!formData.password) errors.push("Password is required");
    if (formData.password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      errors.push("Passwords do not match");
    if (!formData.acceptTerms)
      errors.push("Please accept the terms and conditions");

    return errors;
  };

  const handleSignUp = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.ownerName,
        business_name: formData.businessName,
        phone: formData.phone,
        location: formData.location,
        business_type: formData.businessType,
        user_type: userType,
        pricing_plan: selectedPlan,
        expected_volume: formData.expectedVolume,
      });

      if (result.user) {
        // Redirect based on user type
        const dashboardRoutes = {
          retailer: "/dashboard/retailer",
          supplier: "/dashboard/supplier",
          logistics: "/dashboard/logistics",
          enterprise: "/dashboard/enterprise",
        };
        navigate(
          dashboardRoutes[userType as keyof typeof dashboardRoutes] ||
            "/dashboard",
        );
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeroSection = () => (
    <div className="bg-gradient-to-br from-green-900 via-green-800 to-orange-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🦁 Welcome to the <span className="text-yellow-400">Savanna</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Kenya's Premier B2B Marketplace connecting retailers, suppliers, and
            logistics partners
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-semibold text-lg mb-2">Retailers</h3>
              <p className="text-green-100 text-sm md:text-base">
                Order via USSD, get credit, grow your business
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-semibold text-lg mb-2">Suppliers</h3>
              <p className="text-green-100 text-sm md:text-base">
                Reach thousands of retailers across Kenya
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center sm:col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-lg mb-2">Logistics</h3>
              <p className="text-green-100 text-sm md:text-base">
                Optimize routes, maximize earnings
              </p>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
            onClick={() => setCurrentStep(2)}
          >
            Choose Your Pride 🦁 <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPricingSection = () => (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Choose Your Savanna Experience
          </h2>
          <p className="text-xl text-green-600">
            Tailored pricing for every type of wildlife in the marketplace
            ecosystem
          </p>
        </div>

        <Tabs defaultValue="retailer" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="retailer" className="text-lg">
              🛒 Retailers
            </TabsTrigger>
            <TabsTrigger value="supplier" className="text-lg">
              🏭 Suppliers
            </TabsTrigger>
            <TabsTrigger value="logistics" className="text-lg">
              🚚 Logistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retailer" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {pricingPlans
                .filter((plan) => plan.userType === "retailer")
                .map((plan) => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                    onSelect={handlePlanSelect}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="supplier" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {pricingPlans
                .filter((plan) => plan.userType === "supplier")
                .map((plan) => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                    onSelect={handlePlanSelect}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
              {pricingPlans
                .filter((plan) => plan.userType === "logistics")
                .map((plan) => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                    onSelect={handlePlanSelect}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderSignUpForm = () => (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Join the {pricingPlans.find((p) => p.id === selectedPlan)?.name}{" "}
              Pride
            </h2>
            <p className="text-green-600">
              {pricingPlans.find((p) => p.id === selectedPlan)?.wildlife}{" "}
              Complete your registration to get started
            </p>
          </div>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Mama Jane's Kiosk"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g., Jane Wanjiku"
                    value={formData.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="eldoret">Eldoret</SelectItem>
                      <SelectItem value="thika">Thika</SelectItem>
                      <SelectItem value="malindi">Malindi</SelectItem>
                      <SelectItem value="kitale">Kitale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleInputChange("businessType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userType === "retailer" && (
                        <>
                          <SelectItem value="kiosk">Kiosk</SelectItem>
                          <SelectItem value="supermarket">
                            Supermarket
                          </SelectItem>
                          <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        </>
                      )}
                      {userType === "supplier" && (
                        <>
                          <SelectItem value="manufacturer">
                            Manufacturer
                          </SelectItem>
                          <SelectItem value="distributor">
                            Distributor
                          </SelectItem>
                          <SelectItem value="importer">Importer</SelectItem>
                          <SelectItem value="brand">Brand Owner</SelectItem>
                        </>
                      )}
                      {userType === "logistics" && (
                        <>
                          <SelectItem value="boda-boda">Boda Boda</SelectItem>
                          <SelectItem value="truck-fleet">
                            Truck Fleet
                          </SelectItem>
                          <SelectItem value="courier">
                            Courier Service
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="expectedVolume">Expected Monthly Volume</Label>
                <Select
                  value={formData.expectedVolume}
                  onValueChange={(value) =>
                    handleInputChange("expectedVolume", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50k">Under KES 50,000</SelectItem>
                    <SelectItem value="50k-200k">
                      KES 50,000 - 200,000
                    </SelectItem>
                    <SelectItem value="200k-500k">
                      KES 200,000 - 500,000
                    </SelectItem>
                    <SelectItem value="500k-1m">
                      KES 500,000 - 1,000,000
                    </SelectItem>
                    <SelectItem value="over-1m">Over KES 1,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptTerms", checked === true)
                    }
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    I accept the{" "}
                    <a href="/terms" className="text-green-600 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-green-600 hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    *
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptMarketing", checked === true)
                    }
                  />
                  <Label htmlFor="acceptMarketing" className="text-sm">
                    I want to receive updates about new features and promotions
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              >
                {isLoading ? "Creating Account..." : `Join the Savanna 🦁`}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-green-600"
                  onClick={() => setCurrentStep(3)}
                >
                  Sign in here
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSignInForm = () => {
    const [signInData, setSignInData] = useState({
      email: "",
      password: "",
    });
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
      if (!signInData.email || !signInData.password) {
        alert("Please fill in all fields");
        return;
      }

      setIsSigningIn(true);
      try {
        const result = await signIn(signInData.email, signInData.password);
        if (result.user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        alert("Sign in failed. Please check your credentials.");
      } finally {
        setIsSigningIn(false);
      }
    };

    return (
      <div className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-green-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl text-green-800">
                  🦁 Welcome Back to the Savanna
                </CardTitle>
                <CardDescription>
                  Sign in to your account to continue your journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signInEmail">Email Address</Label>
                  <Input
                    id="signInEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="signInPassword">Password</Label>
                  <Input
                    id="signInPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <Button variant="link" className="text-green-600">
                    Forgot your password?
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-green-600"
                    onClick={() => setCurrentStep(2)}
                  >
                    Sign up here
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="bg-white border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-green-800">
              Join the Savanna Marketplace
            </div>
            <div className="text-sm text-green-600">
              Step {currentStep} of 3
            </div>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      {currentStep === 1 && renderHeroSection()}
      {currentStep === 1 && renderPricingSection()}
      {currentStep === 2 && renderSignUpForm()}
      {currentStep === 3 && renderSignInForm()}

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Savanna Marketplace. All rights reserved. 🦁</p>
          <p className="text-green-200 mt-2">
            Connecting Kenya's business ecosystem, one transaction at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

const PricingCard: React.FC<{
  plan: PricingPlan;
  onSelect: (planId: string) => void;
}> = ({ plan, onSelect }) => (
  <Card
    className={`relative overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
      plan.popular
        ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
        : "border-green-200 hover:border-green-300"
    }`}
  >
    {plan.popular && (
      <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 text-xs font-semibold">
        Most Popular
      </div>
    )}
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl text-green-800 flex items-center space-x-2">
            <span>{plan.wildlife}</span>
            <span>{plan.name}</span>
          </CardTitle>
          <CardDescription className="mt-2">{plan.description}</CardDescription>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-green-800">
            {plan.price === 0 ? "Free" : `KES ${plan.price.toLocaleString()}`}
          </span>
          {plan.price > 0 && (
            <span className="text-green-600">/{plan.period}</span>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      {plan.limitations && (
        <ul className="space-y-1 mb-6">
          {plan.limitations.map((limitation, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 text-gray-500"
            >
              <div className="w-4 h-4 flex-shrink-0 text-center">•</div>
              <span className="text-xs">{limitation}</span>
            </li>
          ))}
        </ul>
      )}
      <Button
        onClick={() => onSelect(plan.id)}
        className={`w-full ${
          plan.popular
            ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        Choose {plan.name}
      </Button>
    </CardContent>
  </Card>
);

export default PricingOnboarding;
