
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Brain, 
  Target,
  Eye,
  Zap,
  Database,
  Activity,
  PieChart,
  LineChart,
  Map
} from "lucide-react";

const Analytics = () => {
  const analyticsModules = [
    {
      title: "Predictive Market Intelligence",
      description: "AI-powered forecasting with 97% accuracy across 50+ market indicators",
      icon: Brain,
      metrics: "2.3M data points analyzed daily",
      status: "Active",
      accuracy: 97
    },
    {
      title: "Real-time Supply Chain Visibility",
      description: "End-to-end tracking across 12 African countries with IoT integration",
      icon: Eye,
      metrics: "45,000+ shipments tracked",
      status: "Live",
      coverage: 92
    },
    {
      title: "Advanced Risk Assessment",
      description: "ML-driven risk scoring for suppliers, markets, and trade routes",
      icon: Target,
      metrics: "Risk reduced by 34%",
      status: "Enhanced",
      effectiveness: 89
    }
  ];

  const kpiDashboard = [
    { label: "Platform Revenue", value: "KSH 450M", change: "+23.5%", trend: "up" },
    { label: "Transaction Volume", value: "2.4M", change: "+18.2%", trend: "up" },
    { label: "Active Users", value: "89.4K", change: "+31.4%", trend: "up" },
    { label: "Market Penetration", value: "67.8%", change: "+12.1%", trend: "up" }
  ];

  const regionalData = [
    { region: "East Africa", revenue: "KSH 180M", growth: 85, users: "34.5K", penetration: "78%" },
    { region: "West Africa", revenue: "KSH 95M", growth: 72, users: "18.2K", penetration: "45%" },
    { region: "Southern Africa", revenue: "KSH 120M", growth: 68, users: "25.1K", penetration: "62%" },
    { region: "Central Africa", revenue: "KSH 55M", growth: 54, users: "11.6K", penetration: "38%" }
  ];

  const aiInsights = [
    {
      title: "Demand Surge Prediction",
      insight: "Solar panel demand expected to increase 340% in Q2 due to government incentives",
      confidence: 94,
      action: "Recommend increasing supplier partnerships"
    },
    {
      title: "Supply Chain Optimization",
      insight: "Route efficiency can be improved by 23% using alternative logistics partners",
      confidence: 87,
      action: "Suggest partner diversification"
    },
    {
      title: "Market Expansion Opportunity",
      insight: "Uganda and Tanzania markets show 78% readiness for platform expansion",
      confidence: 91,
      action: "Initiate market entry strategy"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Intelligence & Analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered insights driving data-driven decisions across the African ecosystem
          </p>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpiDashboard.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold mb-2">{kpi.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{kpi.label}</div>
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="intelligence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="regional">Regional Analytics</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Models</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence" className="space-y-6">
            {/* Analytics Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {analyticsModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <Badge className="mt-1">{module.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{module.description}</p>
                      <div className="space-y-3">
                        <div className="text-sm font-medium">{module.metrics}</div>
                        {module.accuracy && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Accuracy</span>
                              <span className="text-sm">{module.accuracy}%</span>
                            </div>
                            <Progress value={module.accuracy} className="h-2" />
                          </div>
                        )}
                        {module.coverage && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Coverage</span>
                              <span className="text-sm">{module.coverage}%</span>
                            </div>
                            <Progress value={module.coverage} className="h-2" />
                          </div>
                        )}
                        {module.effectiveness && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Effectiveness</span>
                              <span className="text-sm">{module.effectiveness}%</span>
                            </div>
                            <Progress value={module.effectiveness} className="h-2" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI-Generated Market Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.insight}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">{insight.action}</span>
                        <Button size="sm" variant="outline">Implement</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5" />
                  <span>Regional Performance Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {regionalData.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">{region.region}</h4>
                        <Badge className="bg-primary">{region.penetration} penetration</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-lg font-bold">{region.revenue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Users</p>
                          <p className="text-lg font-bold">{region.users}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Growth Rate</p>
                          <p className="text-lg font-bold text-green-600">{region.growth}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Market Development</span>
                          <span className="text-sm">{region.growth}%</span>
                        </div>
                        <Progress value={region.growth} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5" />
                    <span>Demand Forecasting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Agricultural Products</h4>
                      <p className="text-sm text-green-600">+34% increase predicted for Q2</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">Solar Technology</h4>
                      <p className="text-sm text-blue-600">+67% surge expected due to policy changes</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-800">Textiles</h4>
                      <p className="text-sm text-orange-600">Seasonal decline of -12% anticipated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Supply Chain Risk</span>
                      <Badge className="bg-green-500">Low</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Market Volatility</span>
                      <Badge className="bg-yellow-500">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Currency Risk</span>
                      <Badge className="bg-green-500">Low</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Political Stability</span>
                      <Badge className="bg-green-500">High</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive overview of platform performance and strategic metrics
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Deep dive into market trends, opportunities, and competitive landscape
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detailed financial analysis with revenue breakdowns and projections
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
