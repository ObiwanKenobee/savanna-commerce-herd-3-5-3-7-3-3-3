import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Shield,
  Eye,
  Phone,
  Mail,
  Clock,
  FileText,
  Users,
  Lock,
  CheckCircle,
  MessageSquare,
  Camera,
  Flag,
  Search,
} from "lucide-react";
import { useState } from "react";

const FraudReporting = () => {
  const [reportForm, setReportForm] = useState({
    type: "",
    description: "",
    evidence: "",
    contact: "",
    urgency: "medium",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            🚨 Fraud Reporting Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Protecting our savannah community from predators - report suspicious
            activity and fraud to keep our marketplace safe for all members.
          </p>
          <div className="mt-4 text-sm text-red-600 font-medium">
            Anonymous Reporting Available • 24/7 Response Team • Zero Tolerance
            Policy
          </div>
        </div>

        {/* Emergency Contact */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency:</strong> For immediate security threats or
            ongoing fraud, call our 24/7 hotline:
            <span className="font-mono font-bold">
              {" "}
              +254 700 FRAUD (372834)
            </span>{" "}
            or email
            <span className="font-mono font-bold">
              {" "}
              emergency@digitalsavannah.com
            </span>
          </AlertDescription>
        </Alert>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-700">99.8%</div>
              <div className="text-sm text-green-600">
                Fraud Prevention Rate
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-700">&lt; 2h</div>
              <div className="text-sm text-blue-600">Average Response Time</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-700">1,247</div>
              <div className="text-sm text-purple-600">Cases Resolved</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-2xl font-bold text-amber-700">24/7</div>
              <div className="text-sm text-amber-600">Support Available</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Report Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-red-600" />
                  <span>Report Fraud or Suspicious Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubmitted ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Report Submitted Successfully!</strong> Reference
                      ID: FR-
                      {Math.random().toString(36).substr(2, 9).toUpperCase()}
                      <br />
                      Our security team will investigate within 2 hours. You'll
                      receive updates via email.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium">
                        Type of Fraud/Issue
                      </label>
                      <select
                        value={reportForm.type}
                        onChange={(e) =>
                          setReportForm({ ...reportForm, type: e.target.value })
                        }
                        className="w-full mt-1 p-2 border rounded-lg"
                      >
                        <option value="">Select fraud type...</option>
                        <option value="fake-products">
                          Fake or Counterfeit Products
                        </option>
                        <option value="payment-fraud">Payment Fraud</option>
                        <option value="identity-theft">Identity Theft</option>
                        <option value="fake-supplier">
                          Fake Supplier/Business
                        </option>
                        <option value="phishing">Phishing/Scam Messages</option>
                        <option value="price-manipulation">
                          Price Manipulation
                        </option>
                        <option value="review-fraud">Fake Reviews</option>
                        <option value="other">Other Suspicious Activity</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Urgency Level
                      </label>
                      <select
                        value={reportForm.urgency}
                        onChange={(e) =>
                          setReportForm({
                            ...reportForm,
                            urgency: e.target.value,
                          })
                        }
                        className="w-full mt-1 p-2 border rounded-lg"
                      >
                        <option value="low">Low - No immediate threat</option>
                        <option value="medium">
                          Medium - Potential ongoing issue
                        </option>
                        <option value="high">
                          High - Active fraud in progress
                        </option>
                        <option value="critical">
                          Critical - Immediate security threat
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Detailed Description
                      </label>
                      <Textarea
                        value={reportForm.description}
                        onChange={(e) =>
                          setReportForm({
                            ...reportForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Please provide as much detail as possible: what happened, when, who was involved, any suspicious behavior patterns..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Evidence/Supporting Information
                      </label>
                      <Textarea
                        value={reportForm.evidence}
                        onChange={(e) =>
                          setReportForm({
                            ...reportForm,
                            evidence: e.target.value,
                          })
                        }
                        placeholder="Screenshots, order numbers, user IDs, messages, URLs, or any other evidence you have..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Contact Information (Optional)
                      </label>
                      <Input
                        value={reportForm.contact}
                        onChange={(e) =>
                          setReportForm({
                            ...reportForm,
                            contact: e.target.value,
                          })
                        }
                        placeholder="Email or phone for follow-up (leave blank for anonymous reporting)"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Providing contact info helps us investigate faster, but
                        anonymous reports are welcome.
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleSubmit}
                        disabled={!reportForm.type || !reportForm.description}
                        className="flex-1"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Submit Report
                      </Button>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Attach Files
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Common Fraud Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-orange-600" />
                  <span>Recognize Common Fraud Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-700 mb-2">
                      🎭 Fake Suppliers
                    </h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• No verifiable business address</li>
                      <li>• Prices significantly below market</li>
                      <li>• Poor grammar in communications</li>
                      <li>• Requests payment outside platform</li>
                      <li>• New account with high-value items</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-700 mb-2">
                      💳 Payment Fraud
                    </h4>
                    <ul className="text-sm text-orange-600 space-y-1">
                      <li>• Requests for upfront payments</li>
                      <li>• Unusual payment methods</li>
                      <li>• Overpayment and refund scams</li>
                      <li>• Fake payment confirmations</li>
                      <li>• Pressure for immediate payment</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700 mb-2">
                      📦 Product Scams
                    </h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Stock photos from other sites</li>
                      <li>• Counterfeit branded items</li>
                      <li>• Non-existent products</li>
                      <li>• Bait and switch tactics</li>
                      <li>• No return/refund policy</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">
                      🎣 Phishing Attempts
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Fake login pages</li>
                      <li>• Suspicious email requests</li>
                      <li>• URL redirects to external sites</li>
                      <li>• Requests for account details</li>
                      <li>• Urgent security warnings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investigation Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Our Investigation Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-700">
                        Report Received & Acknowledged
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Within 15 minutes of submission, you'll receive a
                        reference number and initial acknowledgment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-700">
                        Initial Assessment
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Security team reviews urgency and assigns appropriate
                        investigator within 2 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-700">
                        Investigation & Evidence Gathering
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Detailed investigation including account analysis,
                        transaction review, and evidence verification.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-700">
                        Action Taken
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Account suspension, transaction reversal, law
                        enforcement referral, or other protective measures.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      5
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-700">
                        Resolution & Follow-up
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Case closure notification and implementation of
                        preventive measures to avoid similar incidents.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-700 mb-1">
                      🚨 Fraud Hotline
                    </h5>
                    <p className="text-sm text-red-600 font-mono">
                      +254 700 FRAUD
                    </p>
                    <p className="text-xs text-red-500">
                      24/7 Emergency Response
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-700 mb-1">
                      📧 Email
                    </h5>
                    <p className="text-sm text-blue-600 font-mono">
                      security@digitalsavannah.com
                    </p>
                    <p className="text-xs text-blue-500">Non-urgent reports</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-700 mb-1">
                      💬 Live Chat
                    </h5>
                    <p className="text-sm text-green-600">
                      Available in your account
                    </p>
                    <p className="text-xs text-green-500">
                      Business hours support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protection Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Protection Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      Always verify supplier credentials before large orders
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Use only platform payment systems</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Be cautious of deals too good to be true</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Report suspicious messages immediately</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Keep records of all communications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Security Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <Badge className="bg-orange-100 text-orange-700 mb-2">
                      Active Alert
                    </Badge>
                    <h5 className="font-semibold text-orange-700 text-sm mb-1">
                      Fake Electronics Suppliers
                    </h5>
                    <p className="text-xs text-orange-600">
                      Multiple reports of fake electronics suppliers offering
                      Samsung phones at 50% below market price.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Badge className="bg-yellow-100 text-yellow-700 mb-2">
                      Warning
                    </Badge>
                    <h5 className="font-semibold text-yellow-700 text-sm mb-1">
                      Phishing SMS Campaign
                    </h5>
                    <p className="text-xs text-yellow-600">
                      Fraudulent SMS messages claiming account suspension.
                      Always verify through official channels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span>Legal Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    False reporting is a serious offense and may result in
                    account termination and legal action.
                  </p>
                  <p>
                    All reports are investigated thoroughly and may be shared
                    with law enforcement agencies when appropriate.
                  </p>
                  <p>
                    Digital Savannah cooperates fully with legal authorities in
                    fraud investigations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudReporting;
