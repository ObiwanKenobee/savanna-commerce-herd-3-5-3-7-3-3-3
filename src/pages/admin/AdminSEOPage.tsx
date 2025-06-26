import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Globe,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Map,
  Languages,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  MousePointer,
  Smartphone,
} from "lucide-react";
import { SEOManager } from "@/components/seo/SEOManager";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import { SitemapGenerator } from "@/components/seo/SitemapGenerator";
import { useSitemap, useWebVitals } from "@/hooks/useSEO";
import { seoService } from "@/services/seoService";

interface SEODashboardData {
  overview: {
    totalPages: number;
    optimizedPages: number;
    avgSeoScore: number;
    totalKeywords: number;
    organicTraffic: number;
    coreWebVitalsScore: number;
  };
  regionalPerformance: Array<{
    region: string;
    traffic: number;
    conversionRate: number;
    avgPageLoad: number;
    topKeywords: string[];
  }>;
  contentClusters: Array<{
    id: string;
    name: string;
    pillarPage: string;
    supportingPages: number;
    totalTraffic: number;
    avgRanking: number;
  }>;
  crawlStatus: {
    lastCrawl: string;
    totalUrls: number;
    indexedUrls: number;
    errorUrls: number;
    warnings: number;
  };
}

export const AdminSEOPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<SEODashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const { isGenerating, error, generateSitemaps } = useSitemap();
  const {
    vitals,
    isLoading: vitalsLoading,
    reload: reloadVitals,
  } = useWebVitals(selectedRegion === "all" ? "kenya" : selectedRegion);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData({
        overview: {
          totalPages: 125847,
          optimizedPages: 98432,
          avgSeoScore: 87,
          totalKeywords: 15673,
          organicTraffic: 2456789,
          coreWebVitalsScore: 89,
        },
        regionalPerformance: [
          {
            region: "Kenya",
            traffic: 1234567,
            conversionRate: 3.45,
            avgPageLoad: 1.2,
            topKeywords: [
              "unga wholesale",
              "sukari bei nafuu",
              "maharagwe jumla",
            ],
          },
          {
            region: "Tanzania",
            traffic: 567890,
            conversionRate: 2.89,
            avgPageLoad: 1.5,
            topKeywords: [
              "unga bei rahisi",
              "sukari Dar es Salaam",
              "maharage jumla",
            ],
          },
          {
            region: "Uganda",
            traffic: 345678,
            conversionRate: 3.12,
            avgPageLoad: 1.8,
            topKeywords: [
              "flour wholesale Kampala",
              "sugar affordable",
              "beans bulk",
            ],
          },
        ],
        contentClusters: [
          {
            id: "1",
            name: "Wholesale Food Cluster",
            pillarPage: "/wholesale-food-kenya",
            supportingPages: 45,
            totalTraffic: 456789,
            avgRanking: 3.2,
          },
          {
            id: "2",
            name: "Local Markets Cluster",
            pillarPage: "/local-markets-nairobi",
            supportingPages: 32,
            totalTraffic: 234567,
            avgRanking: 5.1,
          },
          {
            id: "3",
            name: "B2B Supplier Cluster",
            pillarPage: "/b2b-suppliers-east-africa",
            supportingPages: 28,
            totalTraffic: 345678,
            avgRanking: 2.8,
          },
        ],
        crawlStatus: {
          lastCrawl: "2024-01-15T10:30:00Z",
          totalUrls: 125847,
          indexedUrls: 123456,
          errorUrls: 234,
          warnings: 567,
        },
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handleSitemapGeneration = async () => {
    const sitemaps = await generateSitemaps();
    if (sitemaps) {
      console.log("Sitemaps generated:", sitemaps);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Management</h1>
          <p className="text-muted-foreground">
            Planetary-scale SEO optimization for 5+ billion users
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="kenya">Kenya</SelectItem>
              <SelectItem value="tanzania">Tanzania</SelectItem>
              <SelectItem value="uganda">Uganda</SelectItem>
              <SelectItem value="rwanda">Rwanda</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSitemapGeneration}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Generate Sitemaps
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </p>
                <p className="text-2xl font-bold">
                  {dashboardData?.overview.totalPages.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {dashboardData?.overview.optimizedPages.toLocaleString()}{" "}
                optimized
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg SEO Score
                </p>
                <p className="text-2xl font-bold">
                  {dashboardData?.overview.avgSeoScore}/100
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={dashboardData?.overview.avgSeoScore}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Organic Traffic
                </p>
                <p className="text-2xl font-bold">
                  {dashboardData?.overview.organicTraffic.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="default" className="text-xs">
                +12.5% this month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Core Web Vitals
                </p>
                <p className="text-2xl font-bold">
                  {dashboardData?.overview.coreWebVitalsScore}/100
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={dashboardData?.overview.coreWebVitalsScore}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
          <TabsTrigger value="crawl">Crawl Status</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.regionalPerformance.map((region) => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{region.region}</span>
                        <Badge variant="outline">
                          {region.traffic.toLocaleString()} visits
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">CVR: </span>
                          <span className="font-medium">
                            {region.conversionRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Load: </span>
                          <span className="font-medium">
                            {region.avgPageLoad}s
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Top: </span>
                          <span className="font-medium">
                            {region.topKeywords[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Clusters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Content Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.contentClusters.map((cluster) => (
                    <div key={cluster.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cluster.name}</span>
                        <Badge
                          variant={
                            cluster.avgRanking <= 3
                              ? "default"
                              : cluster.avgRanking <= 5
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          Pos {cluster.avgRanking}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pages: </span>
                          <span className="font-medium">
                            {cluster.supportingPages}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Traffic:{" "}
                          </span>
                          <span className="font-medium">
                            {cluster.totalTraffic.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crawl Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Crawl & Index Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData?.crawlStatus.indexedUrls.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Indexed URLs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardData?.crawlStatus.errorUrls.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {dashboardData?.crawlStatus.warnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      ((dashboardData?.crawlStatus.indexedUrls || 0) /
                        (dashboardData?.crawlStatus.totalUrls || 1)) *
                        100,
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Index Coverage
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          {selectedPage ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Button variant="outline" onClick={() => setSelectedPage(null)}>
                  ← Back to Pages
                </Button>
                <h2 className="text-xl font-semibold">
                  SEO Editor: {selectedPage}
                </h2>
              </div>
              <SEOManager
                page={selectedPage}
                productData={{
                  name: "Sample Product",
                  category: "Food",
                  price: 1200,
                }}
              />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>SEO Pages Management</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Page
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Bulk Import
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>SEO Score</TableHead>
                      <TableHead>Traffic</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>/wholesale-unga-kenya</TableCell>
                      <TableCell>
                        <Badge variant="default">92/100</Badge>
                      </TableCell>
                      <TableCell>45,673</TableCell>
                      <TableCell>234</TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedPage("/wholesale-unga-kenya")
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>/sukari-wholesale-nairobi</TableCell>
                      <TableCell>
                        <Badge variant="secondary">78/100</Badge>
                      </TableCell>
                      <TableCell>23,456</TableCell>
                      <TableCell>187</TableCell>
                      <TableCell>1 day ago</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedPage("/sukari-wholesale-nairobi")
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Regions Tab - Localized SEO */}
        <TabsContent value="regions">
          <LocalizedSEO />
        </TabsContent>

        {/* Sitemaps Tab */}
        <TabsContent value="sitemaps">
          <SitemapGenerator />
        </TabsContent>

        <TabsContent value="crawl">
          <Card>
            <CardHeader>
              <CardTitle>Crawl Status & Indexing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crawl management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>SEO Tools & Utilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">SEO tools coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEOPage;
