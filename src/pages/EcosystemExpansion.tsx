import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { LionLoyaltyProgram } from "@/components/ecosystem/LionLoyaltyProgram";
import { EcoDigitalTwins } from "@/components/ecosystem/EcoDigitalTwins";
import { SavannaCodeSchools } from "@/components/ecosystem/SavannaCodeSchools";
import { IndigenousKnowledgeDAOs } from "@/components/ecosystem/IndigenousKnowledgeDAOs";
import { DigitalChiefSystem } from "@/components/ecosystem/DigitalChiefSystem";
import { CarbonCreditMicroExchanges } from "@/components/ecosystem/CarbonCreditMicroExchanges";
import { WildlifeToWallet } from "@/components/ecosystem/WildlifeToWallet";
import { CrisisToOpportunity } from "@/components/ecosystem/CrisisToOpportunity";
import {
  Sparkles,
  Globe,
  TreePine,
  GraduationCap,
  Crown,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const EcosystemExpansion = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const ecosystemAreas = [
    {
      id: "c2e",
      title: "Consumer-to-Ecosystem (C2E)",
      icon: Heart,
      description: "Lion Loyalty Program & Eco-Digital Twins",
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-800",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "Wildlife impact tracking",
        "Virtual animal adoption",
        "AR safari experiences",
        "Conservation NFTs",
      ],
    },
    {
      id: "e2e",
      title: "Education-to-Enterprise (E2E)",
      icon: GraduationCap,
      description: "Savanna Code Schools & Indigenous Knowledge DAOs",
      color: "from-purple-500 to-blue-600",
      textColor: "text-purple-800",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Swahili-first programming",
        "Traditional wisdom tokenization",
        "Anti-poaching tools",
        "Knowledge preservation",
      ],
    },
    {
      id: "g2g",
      title: "Government-to-Grassroots (G2G)",
      icon: Crown,
      description: "Digital Chief System & Carbon Credit Exchanges",
      color: "from-indigo-500 to-purple-600",
      textColor: "text-indigo-800",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      features: [
        "Traditional governance 2.0",
        "USSD accessibility",
        "Carbon farming",
        "Satellite verification",
      ],
    },
    {
      id: "w2w",
      title: "Wildlife-to-Wallet (W2W)",
      icon: Zap,
      description: "Animal-AI Collaboration & Bio-Transactional Systems",
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-800",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Elephant route optimization",
        "Beehive network uptime",
        "Environmental alerts",
        "Clean energy credits",
      ],
    },
    {
      id: "c2o",
      title: "Crisis-to-Opportunity (C2O)",
      icon: TrendingUp,
      description: "Drought Insurance & Refugee Skills Matching",
      color: "from-red-500 to-pink-600",
      textColor: "text-red-800",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      features: [
        "Drought prediction markets",
        "Smart contract insurance",
        "Refugee marketplace",
        "Cross-border payments",
      ],
    },
  ];

  const impactMetrics = [
    {
      label: "Hectares Protected",
      value: "100,000+",
      icon: TreePine,
      color: "text-green-600",
    },
    {
      label: "Students Trained",
      value: "50,000",
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      label: "Chiefs Connected",
      value: "500+",
      icon: Crown,
      color: "text-indigo-600",
    },
    {
      label: "Carbon Credits",
      value: "25,000",
      icon: Globe,
      color: "text-blue-600",
    },
    {
      label: "Refugees Employed",
      value: "2,847",
      icon: Users,
      color: "text-red-600",
    },
    {
      label: "Wildlife Conflicts ↓",
      value: "30%",
      icon: Sparkles,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      <SavannahNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
            <Sparkles className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Transformative Expansion Framework
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-700 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Savannah Ecosystem 2.0
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A holistic socio-economic-ecological platform that evolves beyond
            B2B into a multidimensional impact system where every transaction
            benefits ecosystems, communities, and wildlife.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setActiveTab("c2e")}
            >
              <Heart className="mr-2 h-5 w-5" />
              Explore Ecosystem
            </Button>
            <Button variant="outline" size="lg">
              <Globe className="mr-2 h-5 w-5" />
              View Implementation Roadmap
            </Button>
          </div>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {impactMetrics.map((metric, index) => (
            <Card key={metric.label} className="text-center p-4">
              <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Ecosystem Areas Overview */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Five Transformative Frameworks
              </h2>
              <p className="text-muted-foreground">
                Each framework creates multidimensional value while preserving
                and enhancing natural ecosystems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemAreas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${area.bgColor} ${area.borderColor}`}
                    onClick={() => setActiveTab(area.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <area.icon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRight
                          className={`h-5 w-5 ${area.textColor} opacity-60`}
                        />
                      </div>
                      <CardTitle className={`text-lg ${area.textColor}`}>
                        {area.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {area.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {area.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center text-xs text-muted-foreground"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${area.color}`}
                            ></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ecosystem Components */}
        <div className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="c2e">C2E Model</TabsTrigger>
              <TabsTrigger value="e2e">E2E Pipeline</TabsTrigger>
              <TabsTrigger value="g2g">G2G Integration</TabsTrigger>
              <TabsTrigger value="w2w">W2W Economy</TabsTrigger>
              <TabsTrigger value="c2o">C2O Protocols</TabsTrigger>
            </TabsList>

            <TabsContent value="c2e" className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-green-100 text-green-700">
                  Consumer-to-Ecosystem Model
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Lion Loyalty & Eco-Digital Twins
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Every consumer purchase funds habitat protection with
                  real-time satellite tracking and virtual wildlife adoption
                  experiences
                </p>
              </div>
              <LionLoyaltyProgram
                userPurchases={47}
                habitatProtected={15420}
                carbonOffset={523}
              />
              <EcoDigitalTwins />
            </TabsContent>

            <TabsContent value="e2e" className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-purple-100 text-purple-700">
                  Education-to-Enterprise Pipeline
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Savanna Code Schools & Knowledge DAOs
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Swahili-first programming education building real conservation
                  tools while preserving indigenous wisdom through blockchain
                </p>
              </div>
              <SavannaCodeSchools />
              <IndigenousKnowledgeDAOs />
            </TabsContent>

            <TabsContent value="g2g" className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-indigo-100 text-indigo-700">
                  Government-to-Grassroots Integration
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Digital Chiefs & Carbon Exchanges
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Traditional governance enhanced with digital tools and
                  satellite-verified carbon farming for smallholders
                </p>
              </div>
              <DigitalChiefSystem />
              <CarbonCreditMicroExchanges />
            </TabsContent>

            <TabsContent value="w2w" className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-orange-100 text-orange-700">
                  Wildlife-to-Wallet Economy
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Animal-AI Collaboration
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Elephant movements optimize delivery routes while beehive
                  activity powers network infrastructure and environmental
                  monitoring
                </p>
              </div>
              <WildlifeToWallet />
            </TabsContent>

            <TabsContent value="c2o" className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-red-100 text-red-700">
                  Crisis-to-Opportunity Protocols
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Drought Markets & Refugee Skills
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Smart contract insurance for drought protection and global
                  marketplace connecting refugee artisans with ethical buyers
                </p>
              </div>
              <CrisisToOpportunity />
            </TabsContent>
          </Tabs>
        </div>

        {/* Implementation Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-blue-800">
                Implementation Roadmap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-lg font-bold text-blue-600">Year 1</div>
                  <div className="text-sm font-medium">C2E Rollout</div>
                  <div className="text-xs text-muted-foreground">
                    Wildlife NFTs + USSD tracking
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    100,000 hectares protected
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-purple-600">
                    Year 2
                  </div>
                  <div className="text-sm font-medium">E2E Scale</div>
                  <div className="text-xs text-muted-foreground">
                    Swahili coding SDK
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    50,000 students trained
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-green-600">Year 3</div>
                  <div className="text-sm font-medium">W2W Maturity</div>
                  <div className="text-xs text-muted-foreground">
                    Animal-IoT mesh networks
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    30% conflict reduction
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <Card className="p-8 bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">
                Why This Redefines Platforms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    🌿 Non-Extractive Value
                  </div>
                  <div className="text-sm opacity-90">
                    Every transaction benefits ecosystems rather than depleting
                    them
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    🏛️ Polycentric Governance
                  </div>
                  <div className="text-sm opacity-90">
                    Blends traditional and modern systems for inclusive
                    decision-making
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    💪 Anti-Fragile Design
                  </div>
                  <div className="text-sm opacity-90">
                    Thrives on climate shocks and transforms crises into
                    opportunities
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Join the Ecosystem Revolution
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default EcosystemExpansion;
