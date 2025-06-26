import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Gavel,
  Users,
  ShoppingCart,
  Shield,
  AlertTriangle,
  FileText,
  DollarSign,
  Truck,
  MessageSquare,
  Globe,
  Lock,
  Scale,
} from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ⚖️ Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            The laws of our digital savannah - fair rules that protect every
            member of our trading community, from the smallest trader to the
            mightiest supplier.
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            Last Updated: January 2024 • Effective Date: January 1, 2024
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> By using Digital Savannah, you agree to
            these terms. Please read them carefully as they affect your rights
            and responsibilities as a member of our marketplace community.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="#acceptance"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  🤝 Agreement & Acceptance
                </a>
                <a
                  href="#accounts"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  👤 User Accounts
                </a>
                <a
                  href="#marketplace"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  🛒 Marketplace Rules
                </a>
                <a
                  href="#payments"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  💰 Payments & Fees
                </a>
                <a
                  href="#delivery"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  🚚 Delivery & Returns
                </a>
                <a
                  href="#conduct"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  📋 User Conduct
                </a>
                <a
                  href="#intellectual"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  ©️ Intellectual Property
                </a>
                <a
                  href="#liability"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  ⚖️ Liability & Disputes
                </a>
                <a
                  href="#termination"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  🔚 Account Termination
                </a>
                <a
                  href="#governing"
                  className="block text-sm text-amber-600 hover:underline"
                >
                  🇰🇪 Governing Law
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Acceptance */}
            <Card id="acceptance">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  <span>Agreement & Acceptance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Welcome to Digital Savannah! These Terms of Service ("Terms")
                  govern your use of our marketplace platform. By accessing or
                  using our services, you agree to be bound by these Terms and
                  our Privacy Policy.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    🦁 What This Means
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>
                      • You must be 18+ or have guardian consent to use our
                      platform
                    </li>
                    <li>
                      • You're responsible for understanding and following these
                      terms
                    </li>
                    <li>• We may update these terms with notice to users</li>
                    <li>
                      • Continued use after changes means you accept the new
                      terms
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card id="accounts">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>User Accounts & Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">
                      👥 Account Types
                    </h5>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>
                        • <strong>Buyer:</strong> Purchase goods from suppliers
                      </li>
                      <li>
                        • <strong>Supplier:</strong> Sell products to buyers
                      </li>
                      <li>
                        • <strong>Hybrid:</strong> Both buy and sell
                      </li>
                      <li>
                        • <strong>Admin:</strong> Platform management
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">
                      ✅ Requirements
                    </h5>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Accurate and complete information</li>
                      <li>• Valid email and phone number</li>
                      <li>• Business license (for suppliers)</li>
                      <li>• Identity verification when requested</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security:</strong> You're responsible for keeping
                    your account secure. Don't share passwords, enable 2FA when
                    available, and notify us immediately of any unauthorized
                    access.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Marketplace Rules */}
            <Card id="marketplace">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span>Marketplace Rules & Conduct</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      🛒 For Buyers
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Provide accurate delivery information</li>
                      <li>Pay for orders promptly and in full</li>
                      <li>Inspect goods upon delivery</li>
                      <li>Report issues within 48 hours</li>
                      <li>Leave honest reviews and ratings</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      🏪 For Suppliers
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>List only genuine, legal products</li>
                      <li>Provide accurate descriptions and pricing</li>
                      <li>Maintain adequate inventory levels</li>
                      <li>Ship orders within promised timeframes</li>
                      <li>Respond to customer inquiries promptly</li>
                      <li>Honor return and refund policies</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-700 mb-2">
                      🚫 Prohibited Activities
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      <li>Selling counterfeit or illegal goods</li>
                      <li>Manipulating reviews or ratings</li>
                      <li>Creating fake accounts or identities</li>
                      <li>Harassment or abusive behavior</li>
                      <li>Circumventing platform fees</li>
                      <li>Spamming or unsolicited marketing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments & Fees */}
            <Card id="payments">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span>Payments, Fees & Pricing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">
                      💳 Payment Methods
                    </h5>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• M-Pesa and mobile money</li>
                      <li>• Bank transfers</li>
                      <li>• Credit/debit cards</li>
                      <li>• Trade credit (approved accounts)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">
                      💰 Platform Fees
                    </h5>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Buyers: No platform fees</li>
                      <li>• Suppliers: 2.5% transaction fee</li>
                      <li>• Premium features: Subscription based</li>
                      <li>• Payment processing: As charged by providers</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pricing:</strong> All prices are in Kenya Shillings
                    (KES) unless otherwise stated. Suppliers are responsible for
                    including all applicable taxes in their pricing.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Delivery & Returns */}
            <Card id="delivery">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  <span>Delivery, Returns & Refunds</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold text-orange-700">
                      🚚 Delivery Responsibility
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Suppliers are responsible for timely delivery and product
                      condition until received by buyer. Digital Savannah
                      facilitates but doesn't directly provide delivery
                      services.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold text-blue-700">
                      ↩️ Returns Policy
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Return policies are set by individual suppliers but must
                      allow returns for defective or significantly misdescribed
                      items within 7 days of delivery.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold text-green-700">
                      💸 Refund Process
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Approved refunds are processed within 5-7 business days.
                      Dispute resolution may extend this timeframe. Platform
                      fees are non-refundable except in cases of our error.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card id="liability">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-5 w-5 text-red-600" />
                  <span>Limitation of Liability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important Limitation:</strong> Digital Savannah is a
                    marketplace platform connecting buyers and suppliers. We
                    don't manufacture, store, or directly sell products listed
                    on our platform.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">
                      🛡️ Our Responsibilities
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Maintain platform availability and security</li>
                      <li>Process payments and facilitate transactions</li>
                      <li>Provide customer support and dispute resolution</li>
                      <li>Enforce marketplace policies fairly</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">
                      ❌ Not Our Responsibility
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Product quality, safety, or fitness for purpose</li>
                      <li>Delivery delays or shipping damages</li>
                      <li>Supplier or buyer conduct outside our platform</li>
                      <li>Tax obligations or regulatory compliance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card id="termination">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Account Termination</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Either party may terminate this agreement at any time.
                  However, certain obligations survive termination.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-700 mb-2">
                      👤 User Termination
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Close account anytime from settings</li>
                      <li>• Complete pending transactions first</li>
                      <li>• Download your data before closing</li>
                      <li>• Outstanding fees remain due</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">
                      ⚖️ Platform Termination
                    </h5>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Violation of terms or policies</li>
                      <li>• Fraudulent or illegal activity</li>
                      <li>• Repeated customer complaints</li>
                      <li>• Non-payment of fees</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card id="governing">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>Governing Law & Disputes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 mb-2">
                    🇰🇪 Kenyan Law Applies
                  </h4>
                  <p className="text-sm text-green-600">
                    These Terms are governed by the laws of Kenya. Any disputes
                    will be resolved in Kenyan courts, with Nairobi as the
                    preferred jurisdiction.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-700">
                    🤝 Dispute Resolution Process
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Direct negotiation between parties</li>
                    <li>Platform-mediated resolution</li>
                    <li>Independent mediation (if both parties agree)</li>
                    <li>Kenyan court system (as final resort)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Questions About These Terms?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 mb-2">
                    <strong>Contact our Legal Team:</strong>
                  </p>
                  <div className="text-sm text-blue-600 space-y-1">
                    <p>📧 legal@digitalsavannah.com</p>
                    <p>📞 +254 700 123 456</p>
                    <p>📍 Digital Savannah Ltd, Nairobi, Kenya</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
