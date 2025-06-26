import React, { useState } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  Lightbulb,
  HeartHandshake,
  Leaf,
  Crown,
  Coffee,
  Smartphone,
  Truck,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  expertise: string[];
  animalSpirit: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  metrics?: string;
  icon: React.ReactNode;
}

const About = () => {
  const [selectedTab, setSelectedTab] = useState("story");

  const teamMembers: TeamMember[] = [
    {
      name: "David Kinyanjui",
      role: "Founder & Chief Pride Leader",
      avatar: "/api/placeholder/100/100",
      bio: "Former M-Pesa architect with 15 years in fintech. Passionate about connecting African entrepreneurs.",
      expertise: ["Fintech", "Mobile Payments", "Market Strategy"],
      animalSpirit: "🦁 Lion - Visionary Leader",
    },
    {
      name: "Grace Wambui",
      role: "Chief Technology Officer",
      avatar: "/api/placeholder/100/100",
      bio: "Full-stack engineer who built systems serving 50M+ users. Expert in scalable African solutions.",
      expertise: ["System Architecture", "AI/ML", "Mobile Development"],
      animalSpirit: "🐘 Elephant - Technical Memory",
    },
    {
      name: "Samuel Rotich",
      role: "Head of Marketplace Operations",
      avatar: "/api/placeholder/100/100",
      bio: "Ex-Jumia operations lead. Deep understanding of African logistics and supply chain challenges.",
      expertise: ["Operations", "Logistics", "Supply Chain"],
      animalSpirit: "🐆 Cheetah - Speed & Efficiency",
    },
    {
      name: "Mary Akinyi",
      role: "Head of Community & Growth",
      avatar: "/api/placeholder/100/100",
      bio: "Community builder who scaled Kenyan startups. Expert in user engagement and cultural adaptation.",
      expertise: ["Community Building", "Growth Strategy", "Cultural Design"],
      animalSpirit: "🦅 Eagle - Community Vision",
    },
  ];

  const milestones: Milestone[] = [
    {
      year: "2019",
      title: "The Vision Seeds",
      description:
        "Founded with a mission to democratize B2B commerce in Kenya",
      metrics: "3 founders, 1 big dream",
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    },
    {
      year: "2020",
      title: "First Pride Members",
      description:
        "Launched MVP with 100 pilot suppliers and retailers in Nairobi",
      metrics: "100+ early adopters",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      year: "2021",
      title: "Savanna Expansion",
      description:
        "Expanded to 5 major Kenyan cities with mobile-first approach",
      metrics: "5 cities, 2,000+ users",
      icon: <MapPin className="h-6 w-6 text-green-500" />,
    },
    {
      year: "2022",
      title: "AI Integration",
      description:
        "Launched Elephant Memory AI and advanced logistics optimization",
      metrics: "85% efficiency gains",
      icon: <Zap className="h-6 w-6 text-purple-500" />,
    },
    {
      year: "2023",
      title: "Pride Scale",
      description: "Reached 50,000+ active users across East Africa",
      metrics: "50K+ users, $10M+ GMV",
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
    },
    {
      year: "2024",
      title: "Digital Ecosystem",
      description:
        "Full platform with community, training, and enterprise features",
      metrics: "Complete ecosystem",
      icon: <Crown className="h-6 w-6 text-red-500" />,
    },
  ];

  const impactMetrics = [
    {
      value: "50,000+",
      label: "Active Users",
      description: "Suppliers, retailers, and logistics partners",
      icon: <Users className="h-8 w-8 text-blue-500" />,
    },
    {
      value: "$15M+",
      label: "GMV Facilitated",
      description: "Gross merchandise value traded on platform",
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
    },
    {
      value: "85%",
      label: "Cost Reduction",
      description: "Average savings for our users",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
    },
    {
      value: "12",
      label: "Cities Covered",
      description: "Across Kenya, Uganda, and Tanzania",
      icon: <MapPin className="h-8 w-8 text-orange-500" />,
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service when you need it",
      icon: <Shield className="h-8 w-8 text-red-500" />,
    },
    {
      value: "24/7",
      label: "Support",
      description: "Always here to help your business grow",
      icon: <Heart className="h-8 w-8 text-pink-500" />,
    },
  ];

  const values = [
    {
      title: "Ubuntu Philosophy",
      description:
        "We believe in collective success - when one thrives, we all thrive",
      icon: <HeartHandshake className="h-8 w-8 text-blue-500" />,
      examples: [
        "Community-first features",
        "Shared success metrics",
        "Collaborative problem solving",
      ],
    },
    {
      title: "Wildlife Wisdom",
      description:
        "Nature's proven strategies guide our technology and business approach",
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      examples: [
        "Pack behavior for group buying",
        "Migration patterns for logistics",
        "Elephant memory for AI",
      ],
    },
    {
      title: "Local Innovation",
      description:
        "Solutions built specifically for African markets and cultural contexts",
      icon: <Smartphone className="h-8 w-8 text-purple-500" />,
      examples: [
        "USSD support for feature phones",
        "Swahili integration",
        "M-Pesa native payments",
      ],
    },
    {
      title: "Transparent Growth",
      description: "Open communication and fair practices in everything we do",
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      examples: [
        "Public roadmap",
        "Fair pricing",
        "Community feedback integration",
      ],
    },
  ];

  return (
    <div className="edge-to-edge min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      <SavannahNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="responsive-container">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6 space-x-3">
              <Globe className="h-16 w-16" />
              <h1 className="text-5xl font-bold">About Digital Savanna</h1>
              <Heart className="h-16 w-16" />
            </div>
            <p className="text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connecting African entrepreneurs through technology inspired by
              nature's wisdom
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Founded 2019</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>50,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>12 Cities</span>
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
            <TabsTrigger value="story" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Our Story</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Impact</span>
            </TabsTrigger>
            <TabsTrigger value="values" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Values</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-8">
            <div className="space-y-12">
              {/* Mission Statement */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                      Our Mission
                    </h2>
                    <p className="text-xl text-green-700 mb-6 max-w-4xl mx-auto leading-relaxed">
                      To democratize B2B commerce in Africa by creating a
                      digital ecosystem where every entrepreneur - from the
                      village supplier to the city retailer - can thrive through
                      the power of community and technology.
                    </p>
                    <div className="flex justify-center space-x-6">
                      <Badge className="bg-green-600 text-white px-4 py-2">
                        <Target className="h-4 w-4 mr-2" />
                        Democratize Commerce
                      </Badge>
                      <Badge className="bg-blue-600 text-white px-4 py-2">
                        <Users className="h-4 w-4 mr-2" />
                        Empower Communities
                      </Badge>
                      <Badge className="bg-purple-600 text-white px-4 py-2">
                        <Zap className="h-4 w-4 mr-2" />
                        Technology for Good
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <div>
                <h2 className="text-3xl font-bold text-center mb-8">
                  Our Journey
                </h2>
                <div className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-blue-400 transform md:-translate-x-1/2"></div>
                  <div className="space-y-8">
                    {milestones.map((milestone, index) => (
                      <div
                        key={milestone.year}
                        className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                      >
                        <div
                          className={`flex-1 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-3 mb-3">
                                {milestone.icon}
                                <h3 className="text-xl font-bold text-gray-800">
                                  {milestone.title}
                                </h3>
                                <Badge className="bg-green-100 text-green-700">
                                  {milestone.year}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-2">
                                {milestone.description}
                              </p>
                              {milestone.metrics && (
                                <div className="text-sm font-medium text-green-600">
                                  {milestone.metrics}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                        <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-green-500 rounded-full transform md:-translate-x-1/2 border-4 border-white shadow-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <Shield className="h-5 w-5" />
                      <span>The Challenge We Saw</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-red-700">
                        Fragmented supply chains leaving SMEs isolated
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-red-700">
                        High transaction costs eating into profits
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-red-700">
                        Limited access to market information and pricing
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-red-700">
                        Inefficient logistics and inventory management
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span>Our Solution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-green-700">
                        Unified marketplace connecting all stakeholders
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-green-700">
                        AI-powered tools reducing operational costs
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-green-700">
                        Real-time market data and transparent pricing
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-green-700">
                        Optimized logistics with community support
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Meet the Pride</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our diverse team brings together expertise in technology,
                  African markets, and community building to create something
                  truly special.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <Card
                    key={member.name}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xl">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                      <p className="text-green-600 font-medium mb-2">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">{member.bio}</p>

                      <div className="space-y-2 mb-3">
                        <div className="text-sm font-medium text-purple-600">
                          {member.animalSpirit}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {member.expertise.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Join Us Section */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">
                    Join Our Pride
                  </h3>
                  <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                    We're always looking for passionate individuals who share
                    our vision of transforming African commerce. Check out our
                    open positions!
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    View Open Positions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="mt-8">
            <div className="space-y-12">
              {/* Impact Metrics */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Real numbers showing how we're transforming African commerce
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {impactMetrics.map((metric) => (
                    <Card
                      key={metric.label}
                      className="text-center hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-center mb-4">
                          {metric.icon}
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          {metric.value}
                        </div>
                        <div className="font-semibold text-lg text-gray-700 mb-2">
                          {metric.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {metric.description}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Success Stories */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <span>Success Stories</span>
                    <Star className="h-6 w-6 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Grace's Shop",
                        story: "Increased revenue by 300% using group buying",
                        location: "Nakuru",
                        metric: "300% growth",
                      },
                      {
                        name: "Samuel's Supply Co",
                        story:
                          "Reduced costs by 40% with AI inventory management",
                        location: "Eldoret",
                        metric: "40% cost reduction",
                      },
                      {
                        name: "Mary's Logistics",
                        story: "Improved delivery efficiency by 60%",
                        location: "Kisumu",
                        metric: "60% efficiency gain",
                      },
                    ].map((story) => (
                      <div
                        key={story.name}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <h4 className="font-semibold text-lg mb-2">
                          {story.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {story.story}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {story.location}
                          </span>
                          <Badge className="bg-green-100 text-green-700">
                            {story.metric}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button variant="outline">
                      Read More Success Stories
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Leaf className="h-6 w-6" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      2,500
                    </div>
                    <div className="text-sm text-green-700">Tons CO₂ Saved</div>
                    <div className="text-xs text-gray-600">
                      Through optimized logistics
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      85%
                    </div>
                    <div className="text-sm text-green-700">
                      Waste Reduction
                    </div>
                    <div className="text-xs text-gray-600">
                      Better inventory management
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      15,000
                    </div>
                    <div className="text-sm text-green-700">Trees Worth</div>
                    <div className="text-xs text-gray-600">
                      Paper saved through digital processes
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="values" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Principles that guide everything we do and shape our culture
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {values.map((value) => (
                  <Card
                    key={value.title}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{value.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {value.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700">
                              In practice:
                            </div>
                            <ul className="space-y-1">
                              {value.examples.map((example) => (
                                <li
                                  key={example}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-gray-600">
                                    {example}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Culture Statement */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-purple-800 mb-4">
                    Our Culture
                  </h3>
                  <blockquote className="text-lg text-purple-700 italic mb-6 max-w-4xl mx-auto">
                    "We are more than a company - we are a pride working
                    together to transform African commerce. Every decision we
                    make is guided by our commitment to empowering entrepreneurs
                    and building sustainable communities across the continent."
                  </blockquote>
                  <div className="flex justify-center">
                    <Badge className="bg-purple-600 text-white px-6 py-2">
                      <Heart className="h-4 w-4 mr-2" />
                      Ubuntu Spirit
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default About;
