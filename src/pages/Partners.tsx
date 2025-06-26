import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Building,
  Globe,
  Star,
  TrendingUp,
  Shield,
  Award,
  Target,
  Zap,
  Heart,
  Crown,
} from "lucide-react";

const Partners = () => {
  const partnerMetrics = [
    {
      label: "Active Partners",
      value: "12,847",
      icon: Users,
      change: "+18.2%",
    },
    {
      label: "Partner Revenue",
      value: "KSH 180M",
      icon: TrendingUp,
      change: "+24.7%",
    },
    { label: "Success Rate", value: "94.8%", icon: Target, change: "+3.2%" },
    {
      label: "Global Reach",
      value: "47 Countries",
      icon: Globe,
      change: "+12%",
    },
  ];

  const topPartners = [
    {
      id: 1,
      name: "Nairobi Fresh Produce Alliance",
      type: "Supplier Network",
      tier: "Diamond",
      revenue: "KSH 45M",
      rating: 4.9,
      members: 450,
      growth: "+28%",
      specialization: "Agricultural Products",
      established: "2019",
    },
    {
      id: 2,
      name: "East Africa Tech Consortium",
      type: "Technology Partner",
      tier: "Platinum",
      revenue: "KSH 78M",
      rating: 4.8,
      members: 120,
      growth: "+35%",
      specialization: "Digital Solutions",
      established: "2020",
    },
    {
      id: 3,
      name: "Sustainable Logistics Network",
      type: "Logistics Partner",
      tier: "Gold",
      revenue: "KSH 32M",
      rating: 4.7,
      members: 89,
      growth: "+22%",
      specialization: "Green Transportation",
      established: "2021",
    },
  ];

  const partnerPrograms = [
    {
      title: "Diamond Partnership Program",
      description: "Exclusive tier for highest-performing strategic partners",
      benefits: [
        "Priority support",
        "Revenue sharing",
        "Co-marketing opportunities",
      ],
      requirements: "KSH 50M+ annual revenue",
      partners: 12,
      icon: Crown,
    },
    {
      title: "Innovation Incubator",
      description: "Supporting emerging tech startups and innovative solutions",
      benefits: ["Mentorship", "Funding access", "Platform integration"],
      requirements: "Innovative tech solution",
      partners: 89,
      icon: Zap,
    },
    {
      title: "Community Impact Initiative",
      description: "Partners focused on social and environmental impact",
      benefits: ["Impact measurement", "CSR opportunities", "Grant access"],
      requirements: "Measurable social impact",
      partners: 156,
      icon: Heart,
    },
  ];

  const collaborationOpportunities = [
    {
      title: "Cross-Border Trade Expansion",
      description:
        "Joint initiative to expand into Uganda and Tanzania markets",
      potential: "KSH 120M market opportunity",
      timeline: "Q2 2024",
      partners: 23,
      status: "Planning",
    },
    {
      title: "Sustainable Packaging Initiative",
      description: "Development of biodegradable packaging solutions",
      potential: "40% cost reduction",
      timeline: "Q3 2024",
      partners: 15,
      status: "Active",
    },
    {
      title: "Digital Financial Services",
      description: "Integrated payment and lending solutions for SMEs",
      potential: "KSH 200M lending capacity",
      timeline: "Q1 2024",
      partners: 8,
      status: "Implementation",
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "diamond":
        return "bg-purple-500";
      case "platinum":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-300";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "planning":
        return "bg-blue-500";
      case "implementation":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Partner Ecosystem Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Building Africa's largest collaborative business network
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {partnerMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge className="bg-green-500">{metric.change}</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="directory">Partner Directory</TabsTrigger>
            <TabsTrigger value="programs">Partner Programs</TabsTrigger>
            <TabsTrigger value="collaborations">
              Active Collaborations
            </TabsTrigger>
            <TabsTrigger value="onboarding">Partner Onboarding</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            <div className="grid gap-6">
              {topPartners.map((partner) => (
                <Card
                  key={partner.id}
                  className="hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {partner.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{partner.type}</Badge>
                          <Badge className={getTierColor(partner.tier)}>
                            {partner.tier}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{partner.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Since {partner.established}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Annual Revenue
                        </p>
                        <p className="font-bold text-lg">{partner.revenue}</p>
                        <Badge className="bg-green-500 mt-1">
                          {partner.growth}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Members/Team
                        </p>
                        <p className="font-bold">{partner.members} members</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Specialization
                        </p>
                        <p className="font-bold">{partner.specialization}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Partner Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Revenue Contribution</TableHead>
                      <TableHead>Transaction Volume</TableHead>
                      <TableHead>Customer Satisfaction</TableHead>
                      <TableHead>Growth Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPartners.slice(0, 3).map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">
                          {partner.name}
                        </TableCell>
                        <TableCell>{partner.revenue}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={85} className="w-16 h-2" />
                            <span className="text-sm">85%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{partner.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {partner.growth}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partnerPrograms.map((program, index) => {
                const Icon = program.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {program.title}
                        </CardTitle>
                      </div>
                      <p className="text-muted-foreground">
                        {program.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {program.benefits.map((benefit, i) => (
                              <li
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <Shield className="h-3 w-3 text-green-500" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Active Partners
                            </p>
                            <p className="font-bold">{program.partners}</p>
                          </div>
                          <Button size="sm">Apply Now</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Requirements:</span>{" "}
                          {program.requirements}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <div className="grid gap-6">
              {collaborationOpportunities.map((collab, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {collab.title}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {collab.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(collab.status)}>
                        {collab.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Potential Value
                        </p>
                        <p className="font-bold">{collab.potential}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Timeline
                        </p>
                        <p className="font-medium">{collab.timeline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Partners Involved
                        </p>
                        <p className="font-medium">
                          {collab.partners} organizations
                        </p>
                      </div>
                      <div>
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>New Partner Application</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        Quick Onboarding Process
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Application Review (24-48 hours)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Due Diligence & Verification</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Integration & Training</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Go-Live & Support</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Start Application</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Partner Success Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Time to Revenue</span>
                      <span className="font-bold">14 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Partner Satisfaction Score</span>
                      <span className="font-bold">9.2/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-bold text-green-600">94.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average ROI (First Year)</span>
                      <span className="font-bold text-green-600">340%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Partners;
