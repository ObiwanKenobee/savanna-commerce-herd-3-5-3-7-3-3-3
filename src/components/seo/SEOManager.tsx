import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Globe,
  Target,
  TrendingUp,
  Eye,
  Link,
  Smartphone,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save,
  Download,
  Upload,
  Zap,
  MapPin,
  Languages,
} from "lucide-react";
import { useSEO, useWebVitals, useRegionalSEO } from "@/hooks/useSEO";
import { SEOMetadata } from "@/services/seoService";

interface SEOManagerProps {
  page: string;
  productData?: any;
  onMetadataChange?: (metadata: SEOMetadata) => void;
}

export const SEOManager = ({
  page,
  productData,
  onMetadataChange,
}: SEOManagerProps) => {
  const { region, language, currency } = useRegionalSEO();
  const {
    metadata,
    isLoading,
    error,
    isOptimized,
    coreWebVitals,
    generateMetadata,
    updateMetadata,
    saveMetadata,
  } = useSEO({
    page,
    productData,
    region,
    language,
    autoGenerate: true,
  });

  const {
    vitals,
    isLoading: vitalsLoading,
    reload: reloadVitals,
  } = useWebVitals(region);

  const [activeTab, setActiveTab] = useState("overview");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "mobile" | "google"
  >("google");

  // Handle metadata field updates
  const handleFieldUpdate = (field: keyof SEOMetadata, value: any) => {
    updateMetadata({ [field]: value });
    if (onMetadataChange && metadata) {
      onMetadataChange({ ...metadata, [field]: value });
    }
  };

  // Calculate SEO score
  const calculateSEOScore = (): number => {
    if (!metadata) return 0;

    let score = 0;
    const maxScore = 100;

    // Title optimization (20 points)
    if (metadata.title) {
      score += 10;
      if (metadata.title.length >= 30 && metadata.title.length <= 60) {
        score += 10;
      }
    }

    // Description optimization (20 points)
    if (metadata.description) {
      score += 10;
      if (
        metadata.description.length >= 120 &&
        metadata.description.length <= 160
      ) {
        score += 10;
      }
    }

    // Keywords optimization (15 points)
    if (metadata.keywords && metadata.keywords.length > 0) {
      score += 10;
      if (metadata.keywords.length >= 5 && metadata.keywords.length <= 10) {
        score += 5;
      }
    }

    // Open Graph optimization (15 points)
    if (metadata.ogTitle && metadata.ogDescription && metadata.ogImage) {
      score += 15;
    }

    // Technical SEO (20 points)
    if (metadata.canonicalUrl) score += 5;
    if (metadata.robots) score += 5;
    if (metadata.hreflang && Object.keys(metadata.hreflang).length > 0)
      score += 5;
    if (metadata.jsonLd && metadata.jsonLd.length > 0) score += 5;

    // Performance (10 points)
    if (vitals) {
      const avgPerformance =
        (vitals.lcp.fast + vitals.fid.fast + vitals.cls.fast) / 3;
      score += Math.round(avgPerformance * 10);
    }

    return Math.min(score, maxScore);
  };

  const seoScore = calculateSEOScore();

  return (
    <div className="space-y-6">
      {/* SEO Overview Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>SEO Manager</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Planetary-scale SEO optimization for{" "}
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  seoScore >= 80
                    ? "default"
                    : seoScore >= 60
                      ? "secondary"
                      : "destructive"
                }
              >
                SEO Score: {seoScore}/100
              </Badge>
              <Button
                onClick={generateMetadata}
                disabled={isLoading}
                size="sm"
                className="gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Auto-Optimize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* SEO Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">SEO Score</span>
              </div>
              <Progress value={seoScore} className="h-2" />
              <p className="text-xs text-muted-foreground">{seoScore}/100</p>
            </div>

            {/* Region & Language */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Region</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" />
                {region} ({language.toUpperCase()})
              </Badge>
            </div>

            {/* Performance Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Core Web Vitals</span>
              </div>
              {vitals ? (
                <div className="flex gap-1">
                  <Badge
                    variant={vitals.lcp.fast > 0.75 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    LCP
                  </Badge>
                  <Badge
                    variant={vitals.fid.fast > 0.75 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    FID
                  </Badge>
                  <Badge
                    variant={vitals.cls.fast > 0.75 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    CLS
                  </Badge>
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Loading...
                </Badge>
              )}
            </div>

            {/* Optimization Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge variant={isOptimized ? "default" : "secondary"}>
                {isOptimized ? "Optimized" : "Needs Work"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* SEO Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  SEO Health Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Title Optimization</span>
                  <Badge
                    variant={
                      metadata?.title &&
                      metadata.title.length >= 30 &&
                      metadata.title.length <= 60
                        ? "default"
                        : "destructive"
                    }
                  >
                    {metadata?.title ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta Description</span>
                  <Badge
                    variant={
                      metadata?.description &&
                      metadata.description.length >= 120 &&
                      metadata.description.length <= 160
                        ? "default"
                        : "destructive"
                    }
                  >
                    {metadata?.description ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Graph Tags</span>
                  <Badge
                    variant={
                      metadata?.ogTitle &&
                      metadata?.ogDescription &&
                      metadata?.ogImage
                        ? "default"
                        : "destructive"
                    }
                  >
                    {metadata?.ogTitle &&
                    metadata?.ogDescription &&
                    metadata?.ogImage
                      ? "✓"
                      : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Structured Data</span>
                  <Badge
                    variant={
                      metadata?.jsonLd && metadata.jsonLd.length > 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {metadata?.jsonLd && metadata.jsonLd.length > 0 ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hreflang Tags</span>
                  <Badge
                    variant={
                      metadata?.hreflang &&
                      Object.keys(metadata.hreflang).length > 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {metadata?.hreflang &&
                    Object.keys(metadata.hreflang).length > 0
                      ? "✓"
                      : "✗"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Largest Contentful Paint</span>
                    <span
                      className={
                        vitals?.lcp.fast > 0.75
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {vitals
                        ? `${(vitals.lcp.fast * 100).toFixed(1)}%`
                        : "Loading..."}
                    </span>
                  </div>
                  <Progress
                    value={vitals ? vitals.lcp.fast * 100 : 0}
                    className="h-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Input Delay</span>
                    <span
                      className={
                        vitals?.fid.fast > 0.75
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {vitals
                        ? `${(vitals.fid.fast * 100).toFixed(1)}%`
                        : "Loading..."}
                    </span>
                  </div>
                  <Progress
                    value={vitals ? vitals.fid.fast * 100 : 0}
                    className="h-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cumulative Layout Shift</span>
                    <span
                      className={
                        vitals?.cls.fast > 0.75
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {vitals
                        ? `${(vitals.cls.fast * 100).toFixed(1)}%`
                        : "Loading..."}
                    </span>
                  </div>
                  <Progress
                    value={vitals ? vitals.cls.fast * 100 : 0}
                    className="h-1"
                  />
                </div>
                <Button
                  onClick={reloadVitals}
                  disabled={vitalsLoading}
                  size="sm"
                  variant="outline"
                  className="w-full gap-2"
                >
                  {vitalsLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh Vitals
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic SEO</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={metadata?.title || ""}
                  onChange={(e) => handleFieldUpdate("title", e.target.value)}
                  placeholder="Enter SEO-optimized title..."
                />
                <p className="text-xs text-muted-foreground">
                  Length: {metadata?.title?.length || 0}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={metadata?.description || ""}
                  onChange={(e) =>
                    handleFieldUpdate("description", e.target.value)
                  }
                  placeholder="Enter compelling meta description..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Length: {metadata?.description?.length || 0}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={metadata?.keywords?.join(", ") || ""}
                  onChange={(e) =>
                    handleFieldUpdate(
                      "keywords",
                      e.target.value.split(", ").filter(Boolean),
                    )
                  }
                  placeholder="keyword1, keyword2, keyword3..."
                />
                <p className="text-xs text-muted-foreground">
                  Keywords: {metadata?.keywords?.length || 0}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  value={metadata?.canonicalUrl || ""}
                  onChange={(e) =>
                    handleFieldUpdate("canonicalUrl", e.target.value)
                  }
                  placeholder="https://savannah-marketplace.com/..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Open Graph & Social</h3>

              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  value={metadata?.ogTitle || ""}
                  onChange={(e) => handleFieldUpdate("ogTitle", e.target.value)}
                  placeholder="Social media title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  value={metadata?.ogDescription || ""}
                  onChange={(e) =>
                    handleFieldUpdate("ogDescription", e.target.value)
                  }
                  placeholder="Social media description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={metadata?.ogImage || ""}
                  onChange={(e) => handleFieldUpdate("ogImage", e.target.value)}
                  placeholder="https://savannah-marketplace.com/images/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robots">Robots</Label>
                <Select
                  value={metadata?.robots || "index,follow"}
                  onValueChange={(value) => handleFieldUpdate("robots", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index,follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex,follow">
                      No Index, Follow
                    </SelectItem>
                    <SelectItem value="index,nofollow">
                      Index, No Follow
                    </SelectItem>
                    <SelectItem value="noindex,nofollow">
                      No Index, No Follow
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={saveMetadata} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research & Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keyword management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance analytics features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Localization & Regional SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Localization features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                SEO Preview
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={previewMode === "google" ? "default" : "outline"}
                    onClick={() => setPreviewMode("google")}
                  >
                    Google
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    onClick={() => setPreviewMode("desktop")}
                  >
                    Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    onClick={() => setPreviewMode("mobile")}
                  >
                    Twitter
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metadata && (
                <div className="space-y-4">
                  {previewMode === "google" && (
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="space-y-1">
                        <div className="text-sm text-blue-600 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          savannah-marketplace.com
                        </div>
                        <h3 className="text-lg text-blue-800 hover:underline cursor-pointer">
                          {metadata.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {metadata.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {previewMode === "desktop" && metadata.ogImage && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-2">
                        <img
                          src={metadata.ogImage}
                          alt="OG Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <h3 className="font-semibold">
                          {metadata.ogTitle || metadata.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {metadata.ogDescription || metadata.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          SAVANNAH-MARKETPLACE.COM
                        </div>
                      </div>
                    </div>
                  )}

                  {previewMode === "mobile" && (
                    <div className="p-4 border rounded-lg bg-white max-w-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Twitter Card
                          </span>
                        </div>
                        {metadata.ogImage && (
                          <img
                            src={metadata.ogImage}
                            alt="Twitter Preview"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        <h3 className="font-semibold text-sm">
                          {metadata.twitterTitle || metadata.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {metadata.twitterDescription || metadata.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
