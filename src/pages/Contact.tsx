import React, { useState } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Headphones,
  Users,
  Zap,
  Shield,
  BookOpen,
  Video,
  MessageCircle,
  Globe,
  Smartphone,
  Coffee,
  Star,
  CheckCircle,
  Send,
  Calendar,
  AlertTriangle,
  Info,
  Heart,
  Lightbulb,
} from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  userType: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface SupportChannel {
  name: string;
  description: string;
  availability: string;
  responseTime: string;
  icon: React.ReactNode;
  contact: string;
  bestFor: string[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const Contact = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("contact");
  const [formData, setFormData] = useState<ContactForm>({
    name: user?.email || "",
    email: user?.email || "",
    phone: "",
    company: "",
    userType: "retailer",
    subject: "",
    message: "",
    priority: "medium",
  });

  const supportChannels: SupportChannel[] = [
    {
      name: "Live Chat",
      description: "Instant support for urgent issues",
      availability: "24/7",
      responseTime: "< 2 minutes",
      icon: <MessageCircle className="h-8 w-8 text-green-500" />,
      contact: "Chat widget",
      bestFor: ["Technical issues", "Account problems", "Urgent queries"],
    },
    {
      name: "WhatsApp Support",
      description: "Quick help via WhatsApp",
      availability: "6 AM - 10 PM EAT",
      responseTime: "< 5 minutes",
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      contact: "+254 700 123 456",
      bestFor: ["Order updates", "Quick questions", "Mobile support"],
    },
    {
      name: "Email Support",
      description: "Detailed support via email",
      availability: "24/7",
      responseTime: "< 2 hours",
      icon: <Mail className="h-8 w-8 text-blue-500" />,
      contact: "support@digitalsavanna.co.ke",
      bestFor: ["Complex issues", "Feature requests", "Documentation"],
    },
    {
      name: "Phone Support",
      description: "Voice support for complex issues",
      availability: "8 AM - 6 PM EAT",
      responseTime: "Immediate",
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      contact: "+254 20 123 4567",
      bestFor: ["Complex setup", "Training needs", "Enterprise support"],
    },
    {
      name: "Video Call Support",
      description: "Screen sharing for technical help",
      availability: "9 AM - 5 PM EAT",
      responseTime: "Scheduled",
      icon: <Video className="h-8 w-8 text-orange-500" />,
      contact: "Book via calendar",
      bestFor: [
        "Training sessions",
        "Demo requests",
        "Complex troubleshooting",
      ],
    },
    {
      name: "Community Forum",
      description: "Get help from the community",
      availability: "24/7",
      responseTime: "Varies",
      icon: <Users className="h-8 w-8 text-red-500" />,
      contact: "community.digitalsavanna.co.ke",
      bestFor: ["Best practices", "Tips sharing", "Feature discussions"],
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "How do I get started on Digital Savanna?",
      answer:
        "Getting started is easy! Simply sign up with your phone number or email, complete your profile, and you can start browsing suppliers or listing your products immediately. Our onboarding wizard will guide you through the setup process.",
      category: "Getting Started",
      helpful: 156,
    },
    {
      question: "What are the fees for using the platform?",
      answer:
        "We offer transparent pricing with no hidden fees. Basic features are free, with premium plans starting at KES 2,000/month. Transaction fees are only 2.5% for successful orders. Check our pricing page for detailed information.",
      category: "Pricing",
      helpful: 143,
    },
    {
      question: "How does the AI inventory management work?",
      answer:
        "Our Elephant Memory AI learns your purchasing patterns and automatically suggests reorders when you're running low. It considers seasonality, demand trends, and your specific business patterns to optimize inventory levels.",
      category: "AI Features",
      helpful: 128,
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Absolutely! We use bank-level encryption and are PCI DSS compliant. All payments are processed through secure channels, and we never store your complete payment information on our servers.",
      category: "Security",
      helpful: 134,
    },
    {
      question: "How do I report a problem with an order?",
      answer:
        "You can report order issues through your dashboard, live chat, or WhatsApp. Our support team investigates all issues within 2 hours and works with both parties to resolve disputes fairly.",
      category: "Orders",
      helpful: 112,
    },
    {
      question: "Can I use Digital Savanna on feature phones?",
      answer:
        "Yes! We support USSD access on feature phones. Dial *384# to access basic features like browsing products, placing orders, and checking your account balance. SMS updates are also available.",
      category: "Mobile Access",
      helpful: 98,
    },
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock form submission
    toast({
      title: "🦁 Message Sent Successfully!",
      description:
        "Our support pride will respond within 2 hours. Check your email for updates.",
    });

    // Reset form
    setFormData({
      name: user?.email || "",
      email: user?.email || "",
      phone: "",
      company: "",
      userType: "retailer",
      subject: "",
      message: "",
      priority: "medium",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="edge-to-edge min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <EnterpriseNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="responsive-container">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6 space-x-3">
              <Headphones className="h-16 w-16" />
              <h1 className="text-5xl font-bold">Contact & Support</h1>
              <Heart className="h-16 w-16" />
            </div>
            <p className="text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Our pride is here to help you succeed. Get in touch and we'll
              respond faster than a cheetah!
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Expert Team</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>&lt; 2 Min Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-container py-12">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger
              value="contact"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Us</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="flex items-center space-x-2"
            >
              <Headphones className="h-4 w-4" />
              <span>Support Channels</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    <span>Send us a Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company/Business</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          placeholder="Your business name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userType">I am a...</Label>
                        <select
                          id="userType"
                          value={formData.userType}
                          onChange={(e) =>
                            handleInputChange("userType", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="retailer">
                            🦌 Retailer (Swift Gazelle)
                          </option>
                          <option value="supplier">
                            🐘 Supplier (Wise Elephant)
                          </option>
                          <option value="logistics">
                            🐆 Logistics (Lightning Cheetah)
                          </option>
                          <option value="other">🦁 Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority Level</Label>
                        <select
                          id="priority"
                          value={formData.priority}
                          onChange={(e) =>
                            handleInputChange(
                              "priority",
                              e.target.value as ContactForm["priority"],
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="low">🟢 Low - General inquiry</option>
                          <option value="medium">
                            🟡 Medium - Standard support
                          </option>
                          <option value="high">
                            🟠 High - Important issue
                          </option>
                          <option value="urgent">
                            🔴 Urgent - Business critical
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Please provide as much detail as possible..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Alert className={getPriorityColor(formData.priority)}>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Response Time:</strong>{" "}
                        {formData.priority === "urgent"
                          ? "Within 30 minutes"
                          : formData.priority === "high"
                            ? "Within 1 hour"
                            : formData.priority === "medium"
                              ? "Within 2 hours"
                              : "Within 24 hours"}
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Direct Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span>Direct Contact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Phone Support</div>
                        <div className="text-sm text-gray-600">
                          +254 20 123 4567
                        </div>
                        <div className="text-xs text-gray-500">
                          8 AM - 6 PM EAT
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-gray-600">
                          +254 700 123 456
                        </div>
                        <div className="text-xs text-gray-500">
                          6 AM - 10 PM EAT
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-600">
                          support@digitalsavanna.co.ke
                        </div>
                        <div className="text-xs text-gray-500">
                          24/7 - Response within 2 hours
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Locations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span>Office Locations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium">Nairobi HQ</div>
                      <div className="text-sm text-gray-600">
                        iHub, Ngong Road
                        <br />
                        P.O. Box 12345, Nairobi
                        <br />
                        Kenya
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Mombasa Office</div>
                      <div className="text-sm text-gray-600">
                        Nyali Centre, Links Road
                        <br />
                        P.O. Box 67890, Mombasa
                        <br />
                        Kenya
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Kisumu Branch</div>
                      <div className="text-sm text-gray-600">
                        Mega Plaza, Oginga Odinga Street
                        <br />
                        P.O. Box 54321, Kisumu
                        <br />
                        Kenya
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Support */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Emergency Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 text-sm mb-3">
                      For urgent technical issues affecting your business
                      operations:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span className="font-medium">
                          Emergency Hotline: +254 700 URGENT
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">
                          Live chat with "URGENT" prefix
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Choose Your Support Channel
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Multiple ways to get help, each optimized for different types
                  of questions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportChannels.map((channel) => (
                  <Card
                    key={channel.name}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {channel.icon}
                        <h3 className="font-bold text-lg">{channel.name}</h3>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {channel.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Availability:</span>
                          <span className="font-medium">
                            {channel.availability}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Response:</span>
                          <span className="font-medium text-green-600">
                            {channel.responseTime}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Contact:</span>
                          <div className="font-medium">{channel.contact}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          Best for:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {channel.bestFor.map((use) => (
                            <Badge
                              key={use}
                              variant="outline"
                              className="text-xs"
                            >
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        Contact via {channel.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Support Stats */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-center">
                    Our Support Promise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        &lt; 2 min
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Response Time
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        98.5%
                      </div>
                      <div className="text-sm text-gray-600">
                        Customer Satisfaction
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600">Coverage</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        95%
                      </div>
                      <div className="text-sm text-gray-600">
                        First Contact Resolution
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Quick answers to common questions from our community
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-800 flex-1">
                          {faq.question}
                        </h3>
                        <Badge variant="outline" className="ml-4">
                          {faq.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-4">
                        {faq.answer}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{faq.helpful} people found this helpful</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            👍 Helpful
                          </Button>
                          <Button variant="ghost" size="sm">
                            Still need help?
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Search FAQ */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">
                    Can't find what you're looking for?
                  </h3>
                  <div className="flex items-center space-x-4 max-w-md mx-auto mb-4">
                    <Input placeholder="Search FAQs..." className="flex-1" />
                    <Button>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Or contact our support team for personalized help
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "📘 User Guide",
                  description: "Complete guide to using Digital Savanna",
                  icon: <BookOpen className="h-8 w-8 text-blue-500" />,
                  link: "/help/user-guide",
                  type: "Documentation",
                },
                {
                  title: "🎥 Video Tutorials",
                  description: "Step-by-step video walkthroughs",
                  icon: <Video className="h-8 w-8 text-red-500" />,
                  link: "/help/videos",
                  type: "Video",
                },
                {
                  title: "🔧 API Documentation",
                  description: "For developers integrating with our platform",
                  icon: <Zap className="h-8 w-8 text-yellow-500" />,
                  link: "/help/api",
                  type: "Technical",
                },
                {
                  title: "🏆 Best Practices",
                  description: "Tips for maximizing your success",
                  icon: <Lightbulb className="h-8 w-8 text-green-500" />,
                  link: "/help/best-practices",
                  type: "Guide",
                },
                {
                  title: "🛡️ Security Guide",
                  description: "Keeping your account and data safe",
                  icon: <Shield className="h-8 w-8 text-purple-500" />,
                  link: "/help/security",
                  type: "Security",
                },
                {
                  title: "📞 USSD Guide",
                  description: "Using Digital Savanna on feature phones",
                  icon: <Smartphone className="h-8 w-8 text-orange-500" />,
                  link: "/help/ussd",
                  type: "Mobile",
                },
                {
                  title: "💰 Billing Help",
                  description: "Understanding pricing and payments",
                  icon: <Star className="h-8 w-8 text-cyan-500" />,
                  link: "/help/billing",
                  type: "Billing",
                },
                {
                  title: "🚀 Getting Started",
                  description: "Quick start guide for new users",
                  icon: <CheckCircle className="h-8 w-8 text-pink-500" />,
                  link: "/help/getting-started",
                  type: "Onboarding",
                },
                {
                  title: "🌍 Community",
                  description: "Connect with other users",
                  icon: <Users className="h-8 w-8 text-indigo-500" />,
                  link: "/community",
                  type: "Community",
                },
              ].map((resource) => (
                <Card
                  key={resource.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {resource.description}
                    </p>
                    <Badge variant="outline" className="mb-4">
                      {resource.type}
                    </Badge>
                    <Button variant="outline" className="w-full">
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default Contact;
