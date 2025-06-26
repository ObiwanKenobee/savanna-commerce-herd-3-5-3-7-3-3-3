import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Users,
  ShoppingBag,
  DollarSign,
  Truck,
  Star,
  Shield,
  AlertTriangle,
  CheckCircle,
  Scale,
  Clock,
  MessageSquare,
} from "lucide-react";

const SupplierAgreements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            📋 Supplier Agreements
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Comprehensive partnership terms for suppliers joining our digital
            savannah marketplace - building trust through clear agreements and
            mutual respect.
          </p>
          <div className="mt-4 text-sm text-orange-600 font-medium">
            Last Updated: January 2024 • Effective Immediately Upon Registration
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-700">50K+</div>
              <div className="text-sm text-green-600">Active Buyers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-700">2.5%</div>
              <div className="text-sm text-blue-600">Platform Fee</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Truck className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-700">24-48h</div>
              <div className="text-sm text-purple-600">Payment Processing</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-2xl font-bold text-amber-700">4.8/5</div>
              <div className="text-sm text-amber-600">Avg Supplier Rating</div>
            </CardContent>
          </Card>
        </div>

        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Partnership Agreement:</strong> By registering as a
            supplier, you enter into a binding agreement with Digital Savannah.
            Please read these terms carefully as they define our mutual
            obligations.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Agreement Sections</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="#eligibility"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  ✅ Supplier Eligibility
                </a>
                <a
                  href="#onboarding"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  🚀 Onboarding Process
                </a>
                <a
                  href="#product-standards"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  📦 Product Standards
                </a>
                <a
                  href="#pricing-fees"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  💰 Pricing & Fees
                </a>
                <a
                  href="#order-fulfillment"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  🚚 Order Fulfillment
                </a>
                <a
                  href="#quality-standards"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  ⭐ Quality Standards
                </a>
                <a
                  href="#payment-terms"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  💳 Payment Terms
                </a>
                <a
                  href="#termination"
                  className="block text-sm text-orange-600 hover:underline"
                >
                  🔚 Agreement Termination
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Eligibility */}
            <Card id="eligibility">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Supplier Eligibility Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">
                      🏢 Business Requirements
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Valid business registration in Kenya</li>
                      <li>• KRA PIN certificate</li>
                      <li>• Operating for minimum 6 months</li>
                      <li>• Physical business address</li>
                      <li>• Business bank account</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      👤 Individual Requirements
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Valid national ID or passport</li>
                      <li>• Minimum age of 18 years</li>
                      <li>• Verifiable contact information</li>
                      <li>• Clean credit history (if applicable)</li>
                      <li>• No criminal background in fraud</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verification Process:</strong> All suppliers undergo
                    identity and business verification. False information will
                    result in immediate account suspension and potential legal
                    action.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Product Standards */}
            <Card id="product-standards">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  <span>Product Standards & Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">
                      ✅ Permitted Products
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>
                          • Food products (with KEBS certification where
                          required)
                        </li>
                        <li>• Electronics and appliances (with warranty)</li>
                        <li>• Clothing and textiles</li>
                        <li>• Home and garden supplies</li>
                        <li>• Business and industrial equipment</li>
                        <li>• Health and beauty products (with permits)</li>
                        <li>• Educational materials and services</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">
                      ❌ Prohibited Products
                    </h4>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Illegal drugs or controlled substances</li>
                        <li>• Weapons, explosives, or dangerous items</li>
                        <li>• Counterfeit or pirated goods</li>
                        <li>• Adult content or services</li>
                        <li>• Live animals (without proper permits)</li>
                        <li>• Expired or recalled products</li>
                        <li>• Items violating intellectual property rights</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">
                      📋 Required Information
                    </h5>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Accurate product descriptions</li>
                      <li>• High-quality product images</li>
                      <li>• Detailed specifications</li>
                      <li>• Clear pricing and availability</li>
                      <li>• Shipping and handling information</li>
                    </ul>
                  </div>

                  <div className="p-4 border border-orange-200 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">
                      🔍 Quality Checks
                    </h5>
                    <ul className="text-sm text-orange-600 space-y-1">
                      <li>• Random product inspections</li>
                      <li>• Customer feedback monitoring</li>
                      <li>• Compliance audits</li>
                      <li>• Performance reviews</li>
                      <li>• Continuous improvement support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Fees */}
            <Card id="pricing-fees">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Pricing Structure & Platform Fees</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      🆓 Registration
                    </h4>
                    <div className="text-2xl font-bold text-blue-600">FREE</div>
                    <p className="text-sm text-blue-600 mt-1">
                      No upfront costs to join
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <h4 className="font-semibold text-green-700 mb-2">
                      💰 Transaction Fee
                    </h4>
                    <div className="text-2xl font-bold text-green-600">
                      2.5%
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Per successful sale
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-700 mb-2">
                      ⚡ Premium Features
                    </h4>
                    <div className="text-2xl font-bold text-purple-600">
                      KSH 500
                    </div>
                    <p className="text-sm text-purple-600 mt-1">
                      Per month (optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">
                    📊 Fee Breakdown
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">
                            Service
                          </th>
                          <th className="text-left p-2 font-semibold">Fee</th>
                          <th className="text-left p-2 font-semibold">
                            When Charged
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Product Listing</td>
                          <td className="p-2 text-green-600 font-semibold">
                            FREE
                          </td>
                          <td className="p-2">Never</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Transaction Processing</td>
                          <td className="p-2 text-blue-600 font-semibold">
                            2.5%
                          </td>
                          <td className="p-2">Per completed sale</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Payment Processing</td>
                          <td className="p-2 text-orange-600 font-semibold">
                            As charged by provider
                          </td>
                          <td className="p-2">M-Pesa, Bank fees</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Premium Analytics</td>
                          <td className="p-2 text-purple-600 font-semibold">
                            KSH 500/month
                          </td>
                          <td className="p-2">Optional subscription</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Fulfillment */}
            <Card id="order-fulfillment">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Order Fulfillment Obligations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      ⏰ Time Requirements
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Acknowledge orders within 2 hours</li>
                      <li>• Ship within promised timeframe</li>
                      <li>• Provide tracking information</li>
                      <li>• Update status regularly</li>
                      <li>• Handle delays proactively</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">
                      📦 Packaging Standards
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Secure and protective packaging</li>
                      <li>• Professional presentation</li>
                      <li>• Include order receipt/invoice</li>
                      <li>• Eco-friendly materials preferred</li>
                      <li>• Clear labeling and addressing</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Metrics:</strong> We track fulfillment
                    speed, accuracy, and customer satisfaction. Consistently
                    poor performance may result in account restrictions or
                    termination.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card id="payment-terms">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Payment Terms & Processing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">
                      💰 Payment Schedule
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Weekly payments (Tuesdays)</li>
                      <li>• 24-48 hour processing time</li>
                      <li>• Minimum payout: KSH 500</li>
                      <li>• Automatic fee deduction</li>
                      <li>• Detailed payment statements</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      🏦 Payment Methods
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Bank transfer (preferred)</li>
                      <li>• M-Pesa payments</li>
                      <li>• Mobile money platforms</li>
                      <li>• Check payments (on request)</li>
                      <li>• International wire (for exports)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-700 mb-2">
                    📋 Payment Conditions
                  </h4>
                  <ul className="text-sm text-amber-600 space-y-1">
                    <li>
                      • Payments held for 7 days after delivery confirmation
                    </li>
                    <li>• Refunds may affect payment timing</li>
                    <li>• Tax compliance required for payments</li>
                    <li>• Bank details must match registered business</li>
                    <li>• Payment disputes resolved within 14 days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card id="termination">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Agreement Termination</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      👤 Voluntary Termination
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 30-day notice required</li>
                      <li>• Complete all pending orders</li>
                      <li>• Settle outstanding payments</li>
                      <li>• Data export available</li>
                      <li>• Account reactivation possible</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-2">
                      ⚖️ Involuntary Termination
                    </h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Violation of agreement terms</li>
                      <li>• Fraudulent activity</li>
                      <li>• Consistently poor performance</li>
                      <li>• Legal compliance issues</li>
                      <li>• Immediate account suspension</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <Scale className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Post-Termination:</strong> Certain obligations
                    survive termination including payment of fees, warranty
                    obligations, and confidentiality requirements. Customer data
                    may be retained as required by law.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Supplier Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      🎯 Dedicated Support
                    </h4>
                    <div className="space-y-1 text-sm text-blue-600">
                      <p>📧 suppliers@digitalsavannah.com</p>
                      <p>📞 +254 700 SUPPLIERS</p>
                      <p>💬 Live chat in supplier dashboard</p>
                      <p>🕒 24/7 emergency support</p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">
                      📚 Resources
                    </h4>
                    <div className="space-y-1 text-sm text-green-600">
                      <p>📖 Supplier handbook</p>
                      <p>🎥 Video tutorials</p>
                      <p>👥 Supplier community forum</p>
                      <p>📊 Best practices guide</p>
                    </div>
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

export default SupplierAgreements;
