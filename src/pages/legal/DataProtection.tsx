import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Database,
  Globe,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Trash2,
} from "lucide-react";

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🛡️ Data Protection Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Comprehensive data protection framework ensuring compliance with
            Kenyan Data Protection Act 2019 and international best practices for
            our marketplace community.
          </p>
          <div className="mt-4 text-sm text-blue-600 font-medium">
            Compliant with: Kenya DPA 2019 • GDPR Principles • ISO 27001
            Standards
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-700">Compliant</div>
              <div className="text-sm text-green-600">Kenya DPA 2019</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-700">ISO 27001</div>
              <div className="text-sm text-blue-600">Security Standards</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Globe className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-700">GDPR</div>
              <div className="text-sm text-purple-600">EU Principles</div>
            </CardContent>
          </Card>
        </div>

        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Legal Framework:</strong> This policy implements the
            requirements of the Kenya Data Protection Act 2019, Office of the
            Data Protection Commissioner guidelines, and international best
            practices.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Sections</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="#legal-basis"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  ⚖️ Legal Basis for Processing
                </a>
                <a
                  href="#data-categories"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  📊 Data Categories
                </a>
                <a
                  href="#processing-purposes"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🎯 Processing Purposes
                </a>
                <a
                  href="#retention"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🕒 Data Retention
                </a>
                <a
                  href="#security-measures"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🔒 Security Measures
                </a>
                <a
                  href="#data-subject-rights"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  👤 Data Subject Rights
                </a>
                <a
                  href="#transfers"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🌍 International Transfers
                </a>
                <a
                  href="#breach-procedures"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🚨 Breach Procedures
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Legal Basis */}
            <Card id="legal-basis">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Legal Basis for Processing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">
                      📜 Contract Performance
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Processing orders and payments</li>
                      <li>• Account management</li>
                      <li>• Service delivery</li>
                      <li>• Customer support</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      ⚖️ Legal Obligation
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Tax compliance (KRA requirements)</li>
                      <li>• Anti-money laundering (AML)</li>
                      <li>• Identity verification</li>
                      <li>• Financial reporting</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">
                      🎯 Legitimate Interest
                    </h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Fraud prevention</li>
                      <li>• Platform security</li>
                      <li>• Analytics and improvements</li>
                      <li>• Direct marketing (with opt-out)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-2">
                      ✅ Consent
                    </h4>
                    <ul className="text-sm text-orange-600 space-y-1">
                      <li>• Marketing communications</li>
                      <li>• Location tracking</li>
                      <li>• Optional data collection</li>
                      <li>• Third-party integrations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Categories */}
            <Card id="data-categories">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Personal Data Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      👤 Identity Data
                    </h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Full name, date of birth</li>
                        <li>• National ID, passport number</li>
                        <li>• Profile photographs</li>
                        <li>• Business registration details</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      📞 Contact Data
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Email addresses, phone numbers</li>
                        <li>• Physical addresses</li>
                        <li>• Emergency contact information</li>
                        <li>• Communication preferences</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">
                      💰 Financial Data
                    </h4>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Bank account details</li>
                        <li>• M-Pesa and mobile money numbers</li>
                        <li>• Transaction history</li>
                        <li>• Credit scoring information</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">
                      📊 Behavioral Data
                    </h4>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <ul className="text-sm text-orange-600 space-y-1">
                        <li>• Platform usage patterns</li>
                        <li>• Search and browsing history</li>
                        <li>• Purchase preferences</li>
                        <li>• Device and location information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sensitive Data:</strong> We do not intentionally
                    collect sensitive personal data (race, religion, health,
                    political views) unless specifically required and with
                    explicit consent.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Data Subject Rights */}
            <Card id="data-subject-rights">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>Your Data Protection Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Under the Kenya Data Protection Act 2019, you have the
                  following rights regarding your personal data:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-indigo-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-indigo-600" />
                      <h5 className="font-semibold text-indigo-700">
                        Right to Access
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of all personal data we hold about you,
                      including how it's processed.
                    </p>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h5 className="font-semibold text-green-700">
                        Right to Rectification
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Correct any inaccurate or incomplete personal data we hold
                      about you.
                    </p>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <h5 className="font-semibold text-red-700">
                        Right to Erasure
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal data under specific
                      circumstances.
                    </p>
                  </div>

                  <div className="p-4 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Download className="h-4 w-4 text-orange-600" />
                      <h5 className="font-semibold text-orange-700">
                        Right to Portability
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive your personal data in a structured,
                      machine-readable format.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">
                    🚀 How to Exercise Your Rights
                  </h4>
                  <div className="space-y-2 text-sm text-indigo-600">
                    <p>
                      📧 Email:{" "}
                      <strong>dataprotection@digitalsavannah.com</strong>
                    </p>
                    <p>
                      📞 Phone: <strong>+254 700 123 456</strong>
                    </p>
                    <p>
                      🕒 Response Time: <strong>Within 30 days</strong>
                    </p>
                    <p>
                      💰 Cost:{" "}
                      <strong>Free (may charge for excessive requests)</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Measures */}
            <Card id="security-measures">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  <span>Technical & Organizational Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">
                      🔐 Technical Safeguards
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>End-to-end encryption for sensitive data</li>
                      <li>Multi-factor authentication systems</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Automated backup and disaster recovery</li>
                      <li>Network security monitoring 24/7</li>
                      <li>Data anonymization and pseudonymization</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      👥 Organizational Measures
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Staff data protection training programs</li>
                      <li>Role-based access controls</li>
                      <li>Confidentiality agreements for all employees</li>
                      <li>Regular policy reviews and updates</li>
                      <li>Incident response procedures</li>
                      <li>Third-party vendor assessments</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Certification:</strong> Our security measures are
                    audited annually and comply with ISO 27001 information
                    security management standards.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card id="retention">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Data Retention Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold text-purple-700">
                          Data Type
                        </th>
                        <th className="text-left p-2 font-semibold text-purple-700">
                          Retention Period
                        </th>
                        <th className="text-left p-2 font-semibold text-purple-700">
                          Legal Basis
                        </th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="p-2">Account Information</td>
                        <td className="p-2">Active account + 7 years</td>
                        <td className="p-2">Legal obligation (tax records)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Transaction Records</td>
                        <td className="p-2">7 years</td>
                        <td className="p-2">
                          Legal obligation (financial records)
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Communication Logs</td>
                        <td className="p-2">3 years</td>
                        <td className="p-2">
                          Legitimate interest (dispute resolution)
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Marketing Data</td>
                        <td className="p-2">Until consent withdrawn</td>
                        <td className="p-2">Consent</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Security Logs</td>
                        <td className="p-2">2 years</td>
                        <td className="p-2">Legitimate interest (security)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Contact DPO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Data Protection Officer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 mb-2">
                    📞 Contact Information
                  </h4>
                  <div className="space-y-1 text-sm text-green-600">
                    <p>
                      <strong>Name:</strong> Sarah Kiprotich, LLB, CDPO
                    </p>
                    <p>
                      <strong>Email:</strong> dpo@digitalsavannah.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +254 700 123 456
                    </p>
                    <p>
                      <strong>Address:</strong> Digital Savannah Ltd, Data
                      Protection Office, Nairobi, Kenya
                    </p>
                    <p>
                      <strong>Office Hours:</strong> Monday - Friday, 8:00 AM -
                      5:00 PM EAT
                    </p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    You also have the right to lodge a complaint with the Office
                    of the Data Protection Commissioner if you believe we have
                    not handled your personal data appropriately.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
