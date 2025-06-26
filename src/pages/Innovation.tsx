import React from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Zap,
  Brain,
  Smartphone,
  Globe,
  Heart,
  Users,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Target,
  Award,
  Shield,
  Package,
  Truck,
  MessageSquare,
} from "lucide-react";

const Innovation = () => {
  const innovations = [
    {
      title: "Matatu Mesh",
      description: "Revolutionary transport network connecting communities",
      href: "/matatu-mesh",
      icon: Truck,
      category: "Transport",
      status: "Active",
      impact: "10,000+ daily users",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Maasai Merit",
      description: "Cultural value system for trust-based commerce",
      href: "/maasai-merit",
      icon: Award,
      category: "Cultural",
      status: "Beta",
      impact: "500+ communities",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Harambee Procurement",
      description: "Community-powered sourcing and purchasing",
      href: "/harambee-procurement",
      icon: Users,
      category: "Community",
      status: "Active",
      impact: "2,500+ groups",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Oral Contracts",
      description: "Trust-based agreements with digital verification",
      href: "/oral-contracts",
      icon: MessageSquare,
      category: "Legal",
      status: "Pilot",
      impact: "1,200+ contracts",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "M-Pesa Goats",
      description: "Digital livestock trading and management",
      href: "/mpesa-goats",
      icon: Smartphone,
      category: "Fintech",
      status: "Active",
      impact: "5,000+ transactions",
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Refugee Markets",
      description: "Inclusive marketplace for displaced communities",
      href: "/refugee-markets",
      icon: Heart,
      category: "Social",
      status: "Active",
      impact: "800+ families",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="h-4 w-4" />
            Innovation Hub
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Digital Savannah Innovation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Pioneering solutions that blend African wisdom with cutting-edge
            technology, creating sustainable impact across communities and
            cultures.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Brain className="mr-2 h-5 w-5" />
              Explore Innovations
            </Button>
            <Button variant="outline" size="lg">
              <Target className="mr-2 h-5 w-5" />
              Submit Idea
            </Button>
          </div>
        </div>

        {/* Innovation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {innovations.map((innovation) => {
            const IconComponent = innovation.icon;
            return (
              <Card
                key={innovation.title}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${innovation.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {innovation.category}
                    </Badge>
                    <Badge
                      variant={
                        innovation.status === "Active"
                          ? "default"
                          : innovation.status === "Beta"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {innovation.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                    {innovation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{innovation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      {innovation.impact}
                    </span>
                    <Link to={innovation.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-green-50"
                      >
                        Learn More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Innovation Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Active Innovations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">25</div>
              <div className="text-gray-600">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join the Innovation Movement
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the next wave of African innovation that's changing the
            world.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" variant="secondary">
                <Zap className="mr-2 h-5 w-5" />
                Get Started Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                <Users className="mr-2 h-5 w-5" />
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Innovation;
