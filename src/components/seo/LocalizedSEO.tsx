import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Globe,
  MapPin,
  Languages,
  Target,
  TrendingUp,
  Users,
  Search,
  Zap,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { seoService } from "@/services/seoService";

interface LocalizedKeyword {
  id: string;
  keyword: string;
  language: string;
  region: string;
  searchVolume: number;
  competition: "low" | "medium" | "high";
  intent: "informational" | "commercial" | "transactional" | "navigational";
  localVariants: string[];
  swahiliTranslation?: string;
  englishTranslation?: string;
  ranking?: number;
  traffic?: number;
}

interface RegionalData {
  region: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
  population: number;
  internetPenetration: number;
  mobileUsage: number;
  topKeywords: LocalizedKeyword[];
  culturalContext: string[];
  paymentMethods: string[];
  competitors: string[];
}

export const LocalizedSEO = () => {
  const [selectedRegion, setSelectedRegion] = useState("kenya");
  const [regionalData, setRegionalData] = useState<RegionalData | null>(null);
  const [keywords, setKeywords] = useState<LocalizedKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock regional data - in real implementation, this would come from API
  const regions: RegionalData[] = [
    {
      region: "kenya",
      country: "Kenya",
      language: "sw",
      currency: "KES",
      timezone: "Africa/Nairobi",
      population: 54985698,
      internetPenetration: 89,
      mobileUsage: 95,
      topKeywords: [
        {
          id: "1",
          keyword: "unga wholesale nairobi",
          language: "sw",
          region: "kenya",
          searchVolume: 45600,
          competition: "high",
          intent: "commercial",
          localVariants: [
            "unga jumla nairobi",
            "unga bei nafuu nairobi",
            "unga wholesale CBD",
          ],
          swahiliTranslation: "unga jumla nairobi",
          englishTranslation: "flour wholesale nairobi",
          ranking: 1,
          traffic: 23400,
        },
        {
          id: "2",
          keyword: "sukari bei nafuu",
          language: "sw",
          region: "kenya",
          searchVolume: 32100,
          competition: "medium",
          intent: "commercial",
          localVariants: [
            "sukari rahisi",
            "sukari bei ya chini",
            "cheap sugar kenya",
          ],
          swahiliTranslation: "sukari bei nafuu",
          englishTranslation: "affordable sugar",
          ranking: 2,
          traffic: 18900,
        },
      ],
      culturalContext: [
        "harambee",
        "ujamaa",
        "mama mboga",
        "boda boda",
        "matatu",
        "nyama choma",
      ],
      paymentMethods: ["M-Pesa", "Airtel Money", "T-Kash", "Equitel"],
      competitors: ["Jumia Food", "Twiga Foods", "MarketForce", "Sokowatch"],
    },
    {
      region: "tanzania",
      country: "Tanzania",
      language: "sw",
      currency: "TZS",
      timezone: "Africa/Dar_es_Salaam",
      population: 61741120,
      internetPenetration: 76,
      mobileUsage: 88,
      topKeywords: [
        {
          id: "3",
          keyword: "unga bei rahisi dar",
          language: "sw",
          region: "tanzania",
          searchVolume: 28900,
          competition: "medium",
          intent: "commercial",
          localVariants: [
            "unga rahisi dar es salaam",
            "unga bei ya chini",
            "cheap flour tanzania",
          ],
          swahiliTranslation: "unga bei rahisi",
          englishTranslation: "cheap flour",
          ranking: 3,
          traffic: 15600,
        },
      ],
      culturalContext: [
        "ujamaa",
        "harambee",
        "mama lishe",
        "dala dala",
        "ugali",
      ],
      paymentMethods: [
        "M-Pesa Tanzania",
        "Tigo Pesa",
        "Airtel Money",
        "Halopesa",
      ],
      competitors: ["Jumia Tanzania", "Kilimo Market", "iProcure"],
    },
    {
      region: "uganda",
      country: "Uganda",
      language: "en",
      currency: "UGX",
      timezone: "Africa/Kampala",
      population: 47249585,
      internetPenetration: 70,
      mobileUsage: 85,
      topKeywords: [
        {
          id: "4",
          keyword: "wholesale food kampala",
          language: "en",
          region: "uganda",
          searchVolume: 18500,
          competition: "low",
          intent: "commercial",
          localVariants: [
            "bulk food kampala",
            "food suppliers kampala",
            "cheap food wholesale",
          ],
          englishTranslation: "wholesale food kampala",
          ranking: 4,
          traffic: 9200,
        },
      ],
      culturalContext: ["boda boda", "matatu", "chapati", "posho"],
      paymentMethods: ["MTN Mobile Money", "Airtel Money", "Centenary Mobile"],
      competitors: ["Jumia Uganda", "Market Garden", "Fresh Foods"],
    },
  ];

  useEffect(() => {
    const region = regions.find((r) => r.region === selectedRegion);
    setRegionalData(region || null);
    setKeywords(region?.topKeywords || []);
  }, [selectedRegion]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const generateLocalizedContent = async () => {
    setIsLoading(true);

    // Simulate AI-powered content generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real implementation, this would call the SEO service
    // const content = await seoService.generateLocalizedMetadata(...);

    setIsLoading(false);
  };

  if (!regionalData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Localized SEO Optimization</h2>
          <p className="text-muted-foreground">
            Hyperlocal content optimization for {regionalData.country}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.region} value={region.region}>
                  {region.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={generateLocalizedContent}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Generate Content
          </Button>
        </div>
      </div>

      {/* Regional Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Population
                </p>
                <p className="text-2xl font-bold">
                  {(regionalData.population / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Internet Penetration
                </p>
                <p className="text-2xl font-bold">
                  {regionalData.internetPenetration}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <Progress
              value={regionalData.internetPenetration}
              className="h-1 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mobile Usage
                </p>
                <p className="text-2xl font-bold">
                  {regionalData.mobileUsage}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Languages className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <Progress value={regionalData.mobileUsage} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Currency
                </p>
                <p className="text-2xl font-bold">{regionalData.currency}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {regionalData.timezone}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="cultural">Cultural Context</TabsTrigger>
          <TabsTrigger value="competitors">Competition</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Performing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keywords.slice(0, 5).map((keyword) => (
                    <div key={keyword.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{keyword.keyword}</span>
                        <Badge
                          variant={
                            keyword.ranking <= 3 ? "default" : "secondary"
                          }
                        >
                          Pos {keyword.ranking}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Volume:{" "}
                          </span>
                          <span className="font-medium">
                            {keyword.searchVolume.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Traffic:{" "}
                          </span>
                          <span className="font-medium">
                            {keyword.traffic?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Intent:{" "}
                          </span>
                          <span className="font-medium capitalize">
                            {keyword.intent}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Language & Cultural Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Primary Language
                    </Label>
                    <Badge variant="outline" className="ml-2">
                      {regionalData.language === "sw" ? "Swahili" : "English"}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Cultural Context Keywords
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {regionalData.culturalContext
                        .slice(0, 6)
                        .map((context) => (
                          <Badge
                            key={context}
                            variant="secondary"
                            className="text-xs"
                          >
                            {context}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Payment Methods
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {regionalData.paymentMethods.map((method) => (
                        <Badge
                          key={method}
                          variant="outline"
                          className="text-xs"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Regional Keyword Analysis</CardTitle>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Keyword
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Search Volume</TableHead>
                    <TableHead>Competition</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">
                        {keyword.keyword}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {keyword.language === "sw" ? "Swahili" : "English"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {keyword.searchVolume.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            keyword.competition === "high"
                              ? "destructive"
                              : keyword.competition === "medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {keyword.competition}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {keyword.intent}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            keyword.ranking <= 3 ? "default" : "secondary"
                          }
                        >
                          #{keyword.ranking}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs placeholder */}
        <TabsContent value="cultural">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Context & Local Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cultural adaptation features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Competitor analysis features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Regional SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Optimization tools coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
