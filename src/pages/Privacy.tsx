import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Globe,
  Mail,
  Clock,
  FileText,
  Users,
  Database,
  Settings,
  AlertTriangle,
} from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🛡️ Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Protecting your privacy like elephants protect their young - with
            unwavering dedication and the wisdom of the savannah community.
          </p>
          <div className="mt-4 text-sm text-green-600 font-medium">
            Last Updated: January 2024 • Effective Date: January 1, 2024
          </div>
        </div>

        {/* Quick Overview */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Your Privacy Matters:</strong> We collect only what's
            necessary for marketplace operations, never sell your data, and give
            you full control over your information. Your data stays in Africa
            when possible.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Quick Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="#information-collection"
                  className="block text-sm text-green-600 hover:underline"
                >
                  📊 Information We Collect
                </a>
                <a
                  href="#how-we-use"
                  className="block text-sm text-green-600 hover:underline"
                >
                  🎯 How We Use Your Data
                </a>
                <a
                  href="#data-sharing"
                  className="block text-sm text-green-600 hover:underline"
                >
                  🤝 Data Sharing
                </a>
                <a
                  href="#data-security"
                  className="block text-sm text-green-600 hover:underline"
                >
                  🔒 Security Measures
                </a>
                <a
                  href="#your-rights"
                  className="block text-sm text-green-600 hover:underline"
                >
                  ⚖️ Your Rights
                </a>
                <a
                  href="#cookies"
                  className="block text-sm text-green-600 hover:underline"
                >
                  🍪 Cookies & Tracking
                </a>
                <a
                  href="#international"
                  className="block text-sm text-green-600 hover:underline"
                >
                  🌍 International Transfers
                </a>
                <a
                  href="#contact"
                  className="block text-sm text-green-600 hover:underline"
                >
                  📞 Contact Us
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Information Collection */}
            <Card id="information-collection">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    🦁 Personal Information
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Name, email address, phone number</li>
                    <li>Business information (for suppliers)</li>
                    <li>Payment information (processed securely)</li>
                    <li>Delivery addresses</li>
                    <li>Government ID (for verification only)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    🐘 Usage Information
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Pages visited and time spent</li>
                    <li>Search queries and filters used</li>
                    <li>Products viewed and purchased</li>
                    <li>Device information and IP address</li>
                    <li>Location data (with permission)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    🦓 Communication Data
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Messages with customer support</li>
                    <li>Reviews and ratings</li>
                    <li>Community forum posts</li>
                    <li>Voice recordings (for voice commerce features)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Data */}
            <Card id="how-we-use">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>How We Use Your Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">
                      🛒 Marketplace Operations
                    </h5>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Process orders and payments</li>
                      <li>• Facilitate supplier-buyer connections</li>
                      <li>• Provide customer support</li>
                      <li>• Prevent fraud and abuse</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">
                      🎯 Personalization
                    </h5>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Recommend relevant products</li>
                      <li>• Customize your experience</li>
                      <li>• Show localized content</li>
                      <li>• Improve search results</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">
                      📊 Analytics & Improvement
                    </h5>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Platform performance analysis</li>
                      <li>• User experience research</li>
                      <li>• A/B testing new features</li>
                      <li>• Market trend analysis</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">
                      📢 Communication
                    </h5>
                    <ul className="text-sm text-orange-600 space-y-1">
                      <li>• Order status updates</li>
                      <li>• Important policy changes</li>
                      <li>• Marketing (with consent)</li>
                      <li>• Security notifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card id="data-sharing">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Data Sharing & Third Parties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>We NEVER sell your personal data.</strong> Your
                    information is only shared in these specific circumstances:
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold text-green-700">
                      ✅ Service Providers
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Payment processors (M-Pesa, banks), delivery services, and
                      cloud hosting - all under strict contracts.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold text-blue-700">
                      ✅ Business Partners
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Suppliers see buyer contact info only for order
                      fulfillment. Buyers see supplier business info.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold text-orange-700">
                      ✅ Legal Requirements
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      When required by Kenyan law, court orders, or to protect
                      rights and safety.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card id="data-security">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  <span>Security Measures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto text-red-600 mb-2" />
                    <h5 className="font-semibold text-red-700">Encryption</h5>
                    <p className="text-xs text-red-600">
                      All data encrypted in transit and at rest
                    </p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <UserCheck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h5 className="font-semibold text-blue-700">
                      Access Control
                    </h5>
                    <p className="text-xs text-blue-600">
                      Role-based access and multi-factor authentication
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Eye className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h5 className="font-semibold text-green-700">Monitoring</h5>
                    <p className="text-xs text-green-600">
                      24/7 security monitoring and incident response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card id="your-rights">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  <span>Your Privacy Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Badge className="bg-indigo-100 text-indigo-700">
                      Access & Download
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of all your personal data in a portable
                      format.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-700">
                      Correction
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Update or correct any inaccurate personal information.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge className="bg-red-100 text-red-700">Deletion</Badge>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your account and associated data.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge className="bg-orange-100 text-orange-700">
                      Opt-out
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Unsubscribe from marketing communications anytime.
                    </p>
                  </div>
                </div>

                <Alert className="border-indigo-200 bg-indigo-50">
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    To exercise your rights, email{" "}
                    <strong>privacy@digitalsavannah.com</strong> or use your
                    account settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card id="international">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>International Data Transfers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We prioritize keeping African data in Africa. Your data is
                  primarily stored in Kenya and South Africa. When international
                  transfers are necessary (e.g., global payment processing), we
                  ensure:
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Adequate protection through approved mechanisms</li>
                  <li>Compliance with Kenyan data protection laws</li>
                  <li>Contractual safeguards with all recipients</li>
                  <li>Regular audits of international partners</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card id="contact">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>Contact Our Privacy Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-blue-700 mb-2">
                      Data Protection Officer
                    </h5>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📧 privacy@digitalsavannah.com</p>
                      <p>📞 +254 700 123 456</p>
                      <p>📍 Digital Savannah Ltd, Nairobi, Kenya</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">
                      Response Times
                    </h5>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>🕒 General inquiries: 2-3 business days</p>
                      <p>⚡ Privacy concerns: Within 24 hours</p>
                      <p>🚨 Security incidents: Immediate response</p>
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

export default Privacy;
