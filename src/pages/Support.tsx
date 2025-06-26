import { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Globe,
  Headphones,
  MessageSquare,
  Book,
  HelpCircle,
  Zap,
  Shield,
} from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const supportChannels = [
    {
      name: "Live Chat",
      description: "Instant support with our wildlife guides",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "< 2 minutes",
      color: "bg-green-500",
      action: "Start Chat",
    },
    {
      name: "WhatsApp Support",
      description: "Connect via WhatsApp for mobile-first help",
      icon: MessageSquare,
      availability: "6 AM - 10 PM EAT",
      responseTime: "< 5 minutes",
      color: "bg-green-600",
      action: "Open WhatsApp",
    },
    {
      name: "Voice Support",
      description: "Speak with our pride leaders directly",
      icon: Phone,
      availability: "Business hours",
      responseTime: "< 30 seconds",
      color: "bg-blue-500",
      action: "Call Now",
    },
    {
      name: "Video Tutorial",
      description: "Watch step-by-step savanna guides",
      icon: Video,
      availability: "Always available",
      responseTime: "Instant",
      color: "bg-purple-500",
      action: "Watch Now",
    },
  ];

  const faqCategories = [
    {
      category: "Getting Started",
      icon: "🦁",
      questions: [
        {
          question: "How do I join the digital savanna?",
          answer:
            "Simply click 'Join the Herd' and follow our wildlife-guided onboarding process. We'll help you choose your animal avatar and set up your trading profile.",
        },
        {
          question: "What documents do I need for KYC verification?",
          answer:
            "You'll need a valid Kenyan ID, business registration certificate (if applicable), and M-Pesa phone number for verification.",
        },
        {
          question: "How does the wildlife metaphor system work?",
          answer:
            "Each user type has an animal representation: Retailers are swift gazelles, Suppliers are mighty elephants, Drivers are fast cheetahs, and Admins are pride lions.",
        },
      ],
    },
    {
      category: "Trading & Transactions",
      icon: "🐘",
      questions: [
        {
          question: "How do I place bulk orders like an elephant?",
          answer:
            "Navigate to any product, select 'Bulk Order', specify quantities, and join or create a group buying pool for better prices.",
        },
        {
          question: "What payment methods are supported?",
          answer:
            "We support M-Pesa, bank transfers, cash on delivery, and BNPL (Buy Now, Pay Later) options for verified members.",
        },
        {
          question: "How does group buying work?",
          answer:
            "Join other retailers in 'watering holes' to combine orders and unlock bulk pricing. The more gazelles, the better the deals!",
        },
      ],
    },
    {
      category: "Technical Support",
      icon: "🔧",
      questions: [
        {
          question: "The app is slow on my phone - what can I do?",
          answer:
            "Enable 'Cheetah Mode' in settings for faster performance, or use our USSD service by dialing *384*SAVANNA#.",
        },
        {
          question: "How do I use USSD for offline trading?",
          answer:
            "Dial *384*SAVANNA# from any phone. Follow prompts to browse products, place orders, and check balances without internet.",
        },
        {
          question: "Can I integrate with my existing ERP system?",
          answer:
            "Yes! We support API integrations with SAP, Oracle, and custom ERPs. Contact our tech lions for setup assistance.",
        },
      ],
    },
    {
      category: "Account & Security",
      icon: "🛡️",
      questions: [
        {
          question: "How secure is my data in the digital savanna?",
          answer:
            "We use bank-level encryption, multi-factor authentication, and comply with GDPR, SOC 2, and local data protection laws.",
        },
        {
          question: "I forgot my password - how do I reset it?",
          answer:
            "Click 'Forgot Password' on login, enter your phone number, and follow the SMS verification process.",
        },
        {
          question: "How do I upgrade my account tier?",
          answer:
            "Complete more transactions, maintain good ratings, and pass advanced KYC to evolve from cub to lion status.",
        },
      ],
    },
  ];

  const supportStats = [
    { label: "Average Response Time", value: "47 seconds", icon: Clock },
    { label: "Customer Satisfaction", value: "97.8%", icon: CheckCircle },
    { label: "Issues Resolved", value: "99.2%", icon: Shield },
    { label: "Languages Supported", value: "42", icon: Globe },
  ];

  const quickActions = [
    { title: "Track My Order", icon: "📦", action: "View Status" },
    { title: "Report a Bug", icon: "🐛", action: "Submit Report" },
    { title: "Request Refund", icon: "💰", action: "Start Process" },
    { title: "Update Profile", icon: "👤", action: "Edit Details" },
    { title: "Download Invoice", icon: "📄", action: "Get Invoice" },
    { title: "Security Alert", icon: "🚨", action: "Report Issue" },
  ];

  const filteredFAQs = faqCategories.filter((category) =>
    category.questions.some(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🦁 Pride Support Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to the watering hole of knowledge! Our pride is here to help
            you thrive in the digital savanna.
          </p>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {supportStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto text-green-600 mb-3" />
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col space-y-2 p-4 hover:bg-green-50"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="help" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search the savanna knowledge base... 🔍"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-green-200 focus:border-green-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {(searchQuery ? filteredFAQs : faqCategories).map(
                (category, categoryIndex) => (
                  <Card
                    key={categoryIndex}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.category}</span>
                        <Badge variant="outline">
                          {category.questions.length} topics
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.questions.map((faq, faqIndex) => (
                          <details key={faqIndex} className="group">
                            <summary className="flex items-center justify-between cursor-pointer p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                              <span className="font-medium">
                                {faq.question}
                              </span>
                              <HelpCircle className="h-4 w-4 text-green-600 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            {/* Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 ${channel.color} rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {channel.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Availability:</span>
                          <span className="font-medium">
                            {channel.availability}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response Time:</span>
                          <span className="font-medium text-green-600">
                            {channel.responseTime}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full">{channel.action}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Support Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Create Support Ticket</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg"
                      >
                        <option value="">Select category...</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Management</option>
                        <option value="trading">Trading Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select className="w-full mt-1 p-2 border rounded-lg">
                        <option value="low">Low - General question</option>
                        <option value="medium">
                          Medium - Issue affecting work
                        </option>
                        <option value="high">High - System down</option>
                        <option value="urgent">
                          Urgent - Business critical
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief description of your issue..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      For faster resolution, please include screenshots, error
                      messages, and your account details.
                    </AlertDescription>
                  </Alert>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Submit Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Community Forum</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join thousands of traders sharing knowledge, tips, and
                    success stories in our vibrant community.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Members</span>
                      <span className="font-bold">23,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Discussions</span>
                      <span className="font-bold">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solutions Shared</span>
                      <span className="font-bold">8,967</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Join Community</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Expert Network</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect with verified experts, successful traders, and
                    industry mentors for personalized guidance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Verified Experts</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mentorship Sessions</span>
                      <span className="font-bold">2,340</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-bold">94%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Find Mentor</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive guides, API documentation, and best practices
                    for the savanna ecosystem.
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Video Tutorials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Step-by-step video guides covering everything from basic
                    trading to advanced features.
                  </p>
                  <Button variant="outline" className="w-full">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Headphones className="h-5 w-5" />
                    <span>Webinars</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Live training sessions, market insights, and Q&A with our
                    expert team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;
