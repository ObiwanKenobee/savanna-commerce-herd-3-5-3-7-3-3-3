import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Globe,
  Users,
  Smartphone,
  MapPin,
  Target,
  Zap,
  Settings,
  Code,
  Languages,
  CreditCard,
  Wifi,
  Network,
} from "lucide-react";

interface TerritoryData {
  region: string;
  country: string;
  userDensity: number;
  supplierGaps: number;
  internetCoverage: number;
  marketPotential: number;
  competitionLevel: number;
  expansionCost: number;
  priority: "high" | "medium" | "low";
  flag: string;
}

interface WhiteLabelClient {
  id: string;
  name: string;
  type: "supplier" | "retailer" | "distributor";
  size: "small" | "medium" | "large" | "enterprise";
  monthlyRevenue: number;
  customizations: string[];
  status: "active" | "trial" | "pending";
  logo?: string;
}

interface APIPartner {
  id: string;
  name: string;
  type: "fintech" | "logistics" | "agriculture" | "payment";
  integration: string;
  dataAccess: string[];
  monthlyAPIcalls: number;
  revenue: number;
  status: "active" | "pending" | "suspended";
}

interface LocalizationFeature {
  language: string;
  region: string;
  completion: number;
  priority: number;
  features: string[];
  flag: string;
}

const GrowthToolkit = () => {
  const [selectedCountry, setSelectedCountry] = useState("kenya");
  const [expansionBudget, setExpansionBudget] = useState(500000);

  const territoryData: TerritoryData[] = [
    {
      region: "Western Kenya",
      country: "Kenya",
      userDensity: 45,
      supplierGaps: 78,
      internetCoverage: 67,
      marketPotential: 85,
      competitionLevel: 32,
      expansionCost: 120000,
      priority: "high",
      flag: "🇰🇪",
    },
    {
      region: "Central Uganda",
      country: "Uganda",
      userDensity: 38,
      supplierGaps: 82,
      internetCoverage: 54,
      marketPotential: 78,
      competitionLevel: 28,
      expansionCost: 95000,
      priority: "high",
      flag: "🇺🇬",
    },
    {
      region: "Northern Tanzania",
      country: "Tanzania",
      userDensity: 34,
      supplierGaps: 71,
      internetCoverage: 61,
      marketPotential: 71,
      competitionLevel: 45,
      expansionCost: 140000,
      priority: "medium",
      flag: "🇹🇿",
    },
    {
      region: "Eastern Rwanda",
      country: "Rwanda",
      userDensity: 28,
      supplierGaps: 89,
      internetCoverage: 76,
      marketPotential: 65,
      competitionLevel: 23,
      expansionCost: 85000,
      priority: "medium",
      flag: "🇷🇼",
    },
  ];

  const whiteLabelClients: WhiteLabelClient[] = [
    {
      id: "1",
      name: "Unilever East Africa",
      type: "supplier",
      size: "enterprise",
      monthlyRevenue: 450000,
      customizations: [
        "Custom Branding",
        "Advanced Analytics",
        "Bulk Management",
      ],
      status: "active",
    },
    {
      id: "2",
      name: "Bidco Africa",
      type: "supplier",
      size: "large",
      monthlyRevenue: 280000,
      customizations: ["White-label App", "Custom Domain", "Integrated CRM"],
      status: "active",
    },
    {
      id: "3",
      name: "Kenya Co-op Federation",
      type: "distributor",
      size: "large",
      monthlyRevenue: 0,
      customizations: [
        "Multi-tenant System",
        "Regional Controls",
        "Member Portal",
      ],
      status: "trial",
    },
  ];

  const apiPartners: APIPartner[] = [
    {
      id: "1",
      name: "Tala (Credit Scoring)",
      type: "fintech",
      integration: "Credit Data API",
      dataAccess: [
        "Transaction History",
        "Supplier Ratings",
        "Payment Behavior",
      ],
      monthlyAPIcalls: 45000,
      revenue: 12000,
      status: "active",
    },
    {
      id: "2",
      name: "Safaricom M-Pesa",
      type: "payment",
      integration: "Payment Gateway",
      dataAccess: ["Transaction Status", "User Verification"],
      monthlyAPIcalls: 125000,
      revenue: 25000,
      status: "active",
    },
    {
      id: "3",
      name: "AgriTech Solutions",
      type: "agriculture",
      integration: "Market Prices API",
      dataAccess: ["Product Pricing", "Market Trends"],
      monthlyAPIcalls: 23000,
      revenue: 8000,
      status: "pending",
    },
  ];

  const localizationFeatures: LocalizationFeature[] = [
    {
      language: "Swahili",
      region: "East Africa",
      completion: 85,
      priority: 1,
      features: ["UI Translation", "USSD Support", "Voice Commands"],
      flag: "🇰🇪",
    },
    {
      language: "Luganda",
      region: "Uganda",
      completion: 45,
      priority: 2,
      features: ["Basic UI", "SMS Integration"],
      flag: "🇺🇬",
    },
    {
      language: "Amharic",
      region: "Ethiopia",
      completion: 20,
      priority: 3,
      features: ["Research Phase"],
      flag: "🇪🇹",
    },
    {
      language: "Dholuo",
      region: "Western Kenya",
      completion: 60,
      priority: 2,
      features: ["Audio Support", "Community Features"],
      flag: "🇰🇪",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const TerritoryCard = ({ territory }: { territory: TerritoryData }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-lg flex items-center gap-2">
              {territory.flag} {territory.region}
            </h4>
            <p className="text-sm text-muted-foreground">{territory.country}</p>
          </div>
          <Badge className={getPriorityColor(territory.priority)}>
            {territory.priority} priority
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Market Potential</span>
              <span className="font-medium">{territory.marketPotential}%</span>
            </div>
            <Progress value={territory.marketPotential} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Supplier Gaps</span>
              <span className="font-medium text-red-600">
                {territory.supplierGaps}%
              </span>
            </div>
            <Progress value={territory.supplierGaps} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Internet Coverage</span>
              <span className="font-medium">{territory.internetCoverage}%</span>
            </div>
            <Progress value={territory.internetCoverage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>User Density</span>
              <span className="font-medium">{territory.userDensity}%</span>
            </div>
            <Progress value={territory.userDensity} className="h-2" />
          </div>
        </div>

        <div className="border-t pt-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Expansion Cost:</span>
            <span className="font-bold">
              KSH {territory.expansionCost.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Competition Level:</span>
            <span
              className={
                territory.competitionLevel < 40
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {territory.competitionLevel}%
            </span>
          </div>
        </div>

        {territory.internetCoverage < 70 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <p className="text-xs text-blue-800">
              📱 Recommended: USSD onboarding for low-internet areas
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Target className="h-3 w-3 mr-1" />
            Launch Campaign
          </Button>
          <Button size="sm" variant="outline">
            <MapPin className="h-3 w-3 mr-1" />
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🌍 Savanna Scalability</h1>
          <p className="text-muted-foreground">
            Scale platform operations strategically across Africa
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Code className="h-4 w-4 mr-2" />
            API Management
          </Button>
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            Global Expansion
          </Button>
        </div>
      </div>

      {/* Growth Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Target Markets
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  White-label Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">KSH 730K</p>
              </div>
              <div className="text-2xl">💼</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  API Partners
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="text-2xl">🔗</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Languages
                </p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="text-2xl">🗣️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expansion" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="expansion">🗺️ Territory Matrix</TabsTrigger>
          <TabsTrigger value="whitelabel">💼 White-label Portal</TabsTrigger>
          <TabsTrigger value="api">🔗 API Partners</TabsTrigger>
          <TabsTrigger value="localization">🗣️ Localization Lab</TabsTrigger>
        </TabsList>

        <TabsContent value="expansion" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗺️ Territory Expansion Matrix - Strategic Growth Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Growth Lever: USSD onboarding in low-internet zones
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Target regions with &lt;70% internet coverage using USSD and
                    SMS-based onboarding for maximum reach.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-4">
                    Expansion Planning Tools
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Target Country
                      </label>
                      <Select
                        value={selectedCountry}
                        onValueChange={setSelectedCountry}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
                          <SelectItem value="uganda">🇺🇬 Uganda</SelectItem>
                          <SelectItem value="tanzania">🇹🇿 Tanzania</SelectItem>
                          <SelectItem value="rwanda">🇷🇼 Rwanda</SelectItem>
                          <SelectItem value="ethiopia">🇪🇹 Ethiopia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Expansion Budget (KSH)
                      </label>
                      <Input
                        type="number"
                        value={expansionBudget}
                        onChange={(e) =>
                          setExpansionBudget(parseInt(e.target.value))
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <Button className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Calculate ROI
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {territoryData.map((territory) => (
                    <TerritoryCard
                      key={territory.region}
                      territory={territory}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whitelabel" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💼 White-Label Portal - Premium Storefronts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">
                      Growth Lever: 5% premium for branded storefronts
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Large suppliers get custom-branded experiences with advanced
                    analytics and bulk management tools.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whiteLabelClients.map((client) => (
                    <Card
                      key={client.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{client.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {client.type} • {client.size}
                            </p>
                          </div>
                          <Badge className={getStatusColor(client.status)}>
                            {client.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Monthly Revenue:</span>
                            <span className="font-bold">
                              {client.monthlyRevenue > 0
                                ? `KSH ${client.monthlyRevenue.toLocaleString()}`
                                : "Trial Period"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Customizations:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {client.customizations.map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" className="flex-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Available White-Label Features
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                    <div>✅ Custom Branding</div>
                    <div>✅ Dedicated Domain</div>
                    <div>✅ Advanced Analytics</div>
                    <div>✅ Bulk Management</div>
                    <div>✅ CRM Integration</div>
                    <div>✅ API Access</div>
                    <div>✅ Priority Support</div>
                    <div>✅ Multi-tenant System</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔗 API Management - Partner Ecosystem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">
                      Growth Lever: Grant strategic partners credit data access
                    </span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Partners like Tala get access to credit scoring data,
                    creating additional revenue streams and stronger ecosystem.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apiPartners.map((partner) => (
                    <Card
                      key={partner.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {partner.type} • {partner.integration}
                            </p>
                          </div>
                          <Badge className={getStatusColor(partner.status)}>
                            {partner.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Monthly API Calls:</span>
                            <span className="font-bold">
                              {partner.monthlyAPIcalls.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Monthly Revenue:</span>
                            <span className="font-bold text-green-600">
                              KSH {partner.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Data Access:
                          </p>
                          <div className="space-y-1">
                            {partner.dataAccess.map((access) => (
                              <div
                                key={access}
                                className="text-xs bg-gray-100 rounded px-2 py-1"
                              >
                                {access}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            API Docs
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-4">API Revenue Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            KSH 45K
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Monthly API Revenue
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">193K</p>
                          <p className="text-sm text-muted-foreground">
                            Total API Calls
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            12
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Active Partners
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="localization" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗣️ Localization Lab - Multi-language Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-teal-600" />
                    <span className="font-semibold text-teal-800">
                      Growth Lever: Add Swahili dialects and Dholuo support
                    </span>
                  </div>
                  <p className="text-sm text-teal-700">
                    Expand reach in rural areas by supporting local languages
                    with voice commands and audio features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localizationFeatures.map((feature) => (
                    <Card
                      key={feature.language}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {feature.flag} {feature.language}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.region}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Priority {feature.priority}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Completion</span>
                            <span className="font-medium">
                              {feature.completion}%
                            </span>
                          </div>
                          <Progress
                            value={feature.completion}
                            className="h-2"
                          />
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Features:</p>
                          <div className="space-y-1">
                            {feature.features.map((feat) => (
                              <div
                                key={feat}
                                className="text-xs bg-gray-100 rounded px-2 py-1"
                              >
                                {feat}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Wifi className="h-3 w-3 mr-1" />
                            Test USSD
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Zap className="h-3 w-3 mr-1" />
                            Deploy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>📱 USSD Integration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">USSD Gateway</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS Fallback</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Voice Commands</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Offline Mode</span>
                          <Switch />
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-800">
                          📞 USSD Code: *384*7# for market access without
                          internet
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🎯 Rural Penetration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Swahili Users</span>
                          <span className="font-bold">67,834</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>USSD Sessions</span>
                          <span className="font-bold">12,456/month</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SMS Orders</span>
                          <span className="font-bold">3,287/month</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Voice Interactions</span>
                          <span className="font-bold">892/month</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Expand Rural Reach
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthToolkit;
