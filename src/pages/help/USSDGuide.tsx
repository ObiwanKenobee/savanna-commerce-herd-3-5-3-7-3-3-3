import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ShoppingCart,
  CreditCard,
  Package,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

const USSDGuidePage = () => {
  const ussdCommands = [
    {
      code: "*384#",
      title: "Main Menu",
      description: "Access Savanna Marketplace main menu",
      steps: [
        "Dial *384# on any phone",
        "Select language (1=English, 2=Kiswahili)",
        "Choose your option from the menu",
      ],
    },
    {
      code: "*384*1#",
      title: "Quick Browse",
      description: "Browse products without login",
      steps: [
        "See available products in your area",
        "Check current prices",
        "Find nearby suppliers",
      ],
    },
    {
      code: "*384*2#",
      title: "Place Order",
      description: "Order products via USSD",
      steps: [
        "Enter your phone number",
        "Select products from list",
        "Confirm order and payment method",
      ],
    },
    {
      code: "*384*3#",
      title: "Check Credit",
      description: "View BNPL balance and payments",
      steps: [
        "Enter PIN to verify identity",
        "See available credit limit",
        "Check payment due dates",
      ],
    },
    {
      code: "*384*4#",
      title: "Track Orders",
      description: "Track your delivery status",
      steps: [
        "Enter order number or phone number",
        "Get real-time delivery updates",
        "Contact driver if needed",
      ],
    },
    {
      code: "*384*9#",
      title: "Help & Support",
      description: "Get help and contact support",
      steps: [
        "Access FAQ and guides",
        "Request callback from support",
        "Report issues or problems",
      ],
    },
  ];

  const troubleshooting = [
    {
      problem: "Session timeout",
      solution: "USSD sessions last 3 minutes. Dial again if it times out.",
      icon: <RefreshCw className="h-5 w-5 text-orange-600" />,
    },
    {
      problem: "Network error",
      solution:
        "Try again in a few seconds. Works on all networks (Safaricom, Airtel, Telkom).",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    },
    {
      problem: "Invalid PIN",
      solution: "Use your M-Pesa PIN or call 0700-SAVANNA to reset.",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    },
    {
      problem: "Product not found",
      solution: "Product might be out of stock. Try browsing similar items.",
      icon: <Package className="h-5 w-5 text-blue-600" />,
    },
  ];

  const languages = [
    {
      name: "English",
      code: "1",
      sample:
        "Welcome to Savanna Marketplace\n1. Browse Products\n2. Place Order\n3. Check Credit\n4. Track Orders\n9. Help",
    },
    {
      name: "Kiswahili",
      code: "2",
      sample:
        "Karibu Savanna Marketplace\n1. Tazama Bidhaa\n2. Agiza\n3. Angalia Mkopo\n4. Fuatilia Agizo\n9. Msaada",
    },
  ];

  const handleDialUSSD = (code: string) => {
    window.location.href = `tel:${code}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📱 USSD Trading Guide
                </h1>
                <p className="text-gray-600">
                  Trade without internet • Works on any phone
                </p>
              </div>
            </div>

            {/* Quick Access */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🚀 Quick Start</h3>
                    <p className="text-green-100 mb-4">
                      Start trading immediately - no app download required
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Works on all phones</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>No internet needed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Smartphone className="h-4 w-4" />
                        <span>All networks supported</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={() => handleDialUSSD("*384#")}
                      className="bg-white text-green-600 hover:bg-green-50 text-2xl font-bold py-6 px-8"
                    >
                      Dial *384#
                    </Button>
                    <div className="text-xs text-green-100 mt-2">
                      Tap to dial now
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - USSD Commands */}
            <div className="lg:col-span-2 space-y-6">
              {/* USSD Commands */}
              <div>
                <h2 className="text-2xl font-bold mb-6">📞 USSD Commands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ussdCommands.map((command, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {command.title}
                          </CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDialUSSD(command.code)}
                          >
                            {command.code}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {command.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {command.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">
                                {stepIndex + 1}
                              </div>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Language Support */}
              <div>
                <h2 className="text-2xl font-bold mb-6">🌍 Language Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {languages.map((lang, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <span className="text-lg">
                            {lang.name === "English" ? "🇬🇧" : "🇰🇪"}
                          </span>
                          <span>{lang.name}</span>
                          <Badge variant="secondary">Press {lang.code}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm whitespace-pre-line">
                          {lang.sample}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Tutorial */}
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Step-by-Step: First Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Dial *384#",
                        description:
                          "On any phone, dial the USSD code and press call",
                        icon: <Phone className="h-5 w-5" />,
                      },
                      {
                        step: 2,
                        title: "Select Language",
                        description: "Press 1 for English or 2 for Kiswahili",
                        icon: <span className="text-lg">🌍</span>,
                      },
                      {
                        step: 3,
                        title: 'Choose "Place Order"',
                        description: "Press 2 from the main menu",
                        icon: <ShoppingCart className="h-5 w-5" />,
                      },
                      {
                        step: 4,
                        title: "Enter Phone Number",
                        description: "Type your M-Pesa registered phone number",
                        icon: <Smartphone className="h-5 w-5" />,
                      },
                      {
                        step: 5,
                        title: "Browse Products",
                        description: "Select products from the available list",
                        icon: <Package className="h-5 w-5" />,
                      },
                      {
                        step: 6,
                        title: "Confirm Order",
                        description: "Review and confirm your order details",
                        icon: <CheckCircle className="h-5 w-5" />,
                      },
                      {
                        step: 7,
                        title: "Choose Payment",
                        description: "Select M-Pesa payment or BNPL credit",
                        icon: <CreditCard className="h-5 w-5" />,
                      },
                      {
                        step: 8,
                        title: "Complete",
                        description: "You'll receive SMS confirmation",
                        icon: <span className="text-lg">✅</span>,
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start space-x-4"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        {item.step < 8 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Dial Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>⚡ Quick Dial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleDialUSSD("*384#")}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                    >
                      📱 *384# - Main Menu
                    </Button>
                    <Button
                      onClick={() => handleDialUSSD("*384*1#")}
                      variant="outline"
                      className="w-full"
                    >
                      🛒 *384*1# - Quick Browse
                    </Button>
                    <Button
                      onClick={() => handleDialUSSD("*384*2#")}
                      variant="outline"
                      className="w-full"
                    >
                      📦 *384*2# - Place Order
                    </Button>
                    <Button
                      onClick={() => handleDialUSSD("*384*3#")}
                      variant="outline"
                      className="w-full"
                    >
                      💳 *384*3# - Check Credit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Network Support */}
              <Card>
                <CardHeader>
                  <CardTitle>📶 Network Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">🟢</span>
                        <span>Safaricom</span>
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Full Support
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">🔴</span>
                        <span>Airtel</span>
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Full Support
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">🟡</span>
                        <span>Telkom</span>
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Full Support
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-600">
                    USSD works on all networks across Kenya. No data charges
                    apply.
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle>🔧 Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {troubleshooting.map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-gray-200 pl-3"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {item.icon}
                          <span className="font-medium text-sm">
                            {item.problem}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.solution}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Need More Help?
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips & Tricks */}
              <Card>
                <CardHeader>
                  <CardTitle>💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <div className="font-medium">Save Common Codes</div>
                        <div className="text-gray-600">
                          Bookmark frequent USSD codes in your phone
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">📱</span>
                      <div>
                        <div className="font-medium">Use Speed Dial</div>
                        <div className="text-gray-600">
                          Add *384# to your contacts for quick access
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">⏰</span>
                      <div>
                        <div className="font-medium">Session Timing</div>
                        <div className="text-gray-600">
                          Complete transactions within 3 minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">🚨 Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-red-700">
                      If USSD is not working or you need immediate assistance
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 0700-SAVANNA
                    </Button>
                    <div className="text-xs text-red-600 text-center">
                      Free support line • Available 24/7
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default USSDGuidePage;
