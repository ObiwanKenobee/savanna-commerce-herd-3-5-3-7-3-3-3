import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  RefreshCw,
  FileText,
  Globe,
  MapPin,
  Calendar,
  Link,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Eye,
} from "lucide-react";
import { useSitemap } from "@/hooks/useSEO";

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  hreflang?: Record<string, string>;
  images?: Array<{
    url: string;
    title: string;
    caption?: string;
  }>;
  videos?: Array<{
    url: string;
    title: string;
    description?: string;
    thumbnail?: string;
  }>;
}

interface SitemapConfig {
  baseUrl: string;
  includeImages: boolean;
  includeVideos: boolean;
  includeHreflang: boolean;
  maxUrls: number;
  compress: boolean;
  regions: string[];
  categories: string[];
}

export const SitemapGenerator = () => {
  const [config, setConfig] = useState<SitemapConfig>({
    baseUrl: "https://savannah-marketplace.com",
    includeImages: true,
    includeVideos: false,
    includeHreflang: true,
    maxUrls: 50000,
    compress: true,
    regions: ["kenya", "tanzania", "uganda", "rwanda"],
    categories: ["unga", "sukari", "maharagwe", "mchele", "mazao"],
  });

  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSitemaps, setGeneratedSitemaps] = useState<
    Record<string, string>
  >({});
  const [activeTab, setActiveTab] = useState("config");

  const {
    isGenerating: hookGenerating,
    error,
    generateSitemaps,
  } = useSitemap();

  // Mock sitemap entries - in real implementation, this would come from database
  const mockSitemapEntries: SitemapEntry[] = [
    {
      url: "/kenya/unga-wholesale-nairobi",
      lastmod: "2024-01-15T10:30:00Z",
      changefreq: "daily",
      priority: 0.9,
      hreflang: {
        "sw-KE": "/kenya/unga-wholesale-nairobi",
        "en-KE": "/kenya/en/flour-wholesale-nairobi",
        "x-default": "/unga-wholesale-nairobi",
      },
      images: [
        {
          url: "/images/unga-wholesale-nairobi.webp",
          title: "Unga Wholesale Nairobi - Bei Nafuu",
          caption: "Quality flour wholesale in Nairobi at affordable prices",
        },
      ],
    },
    {
      url: "/tanzania/unga-bei-rahisi-dar",
      lastmod: "2024-01-15T09:15:00Z",
      changefreq: "daily",
      priority: 0.8,
      hreflang: {
        "sw-TZ": "/tanzania/unga-bei-rahisi-dar",
        "en-TZ": "/tanzania/en/flour-cheap-dar",
        "x-default": "/unga-bei-rahisi-dar",
      },
    },
    {
      url: "/uganda/wholesale-food-kampala",
      lastmod: "2024-01-15T08:00:00Z",
      changefreq: "weekly",
      priority: 0.7,
      hreflang: {
        "en-UG": "/uganda/wholesale-food-kampala",
        "x-default": "/wholesale-food-kampala",
      },
    },
  ];

  useEffect(() => {
    setSitemapEntries(mockSitemapEntries);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate sitemap generation with progress
      const steps = [
        "Fetching product URLs...",
        "Generating category sitemaps...",
        "Creating regional sitemaps...",
        "Adding hreflang attributes...",
        "Optimizing for mobile...",
        "Compressing sitemaps...",
        "Finalizing XML structure...",
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }

      // Generate actual sitemaps using the hook
      const sitemaps = await generateSitemaps();

      if (sitemaps) {
        setGeneratedSitemaps(sitemaps);
      }
    } catch (error) {
      console.error("Sitemap generation failed:", error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const downloadSitemap = (type: string, content: string) => {
    const blob = new Blob([content], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitemap-${type}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateXMLSitemap = (entries: SitemapEntry[]): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    xml +=
      '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    entries.forEach((entry) => {
      xml += "  <url>\n";
      xml += `    <loc>${config.baseUrl}${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;

      // Add hreflang attributes
      if (config.includeHreflang && entry.hreflang) {
        Object.entries(entry.hreflang).forEach(([lang, url]) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${config.baseUrl}${url}" />\n`;
        });
      }

      // Add image tags
      if (config.includeImages && entry.images) {
        entry.images.forEach((image) => {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${config.baseUrl}${image.url}</image:loc>\n`;
          xml += `      <image:title>${image.title}</image:title>\n`;
          if (image.caption) {
            xml += `      <image:caption>${image.caption}</image:caption>\n`;
          }
          xml += `    </image:image>\n`;
        });
      }

      xml += "  </url>\n";
    });

    xml += "</urlset>";
    return xml;
  };

  const generateSitemapIndex = (): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml +=
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const sitemapTypes = ["products", "categories", "locations", "news"];
    const lastmod = new Date().toISOString();

    sitemapTypes.forEach((type) => {
      xml += "  <sitemap>\n";
      xml += `    <loc>${config.baseUrl}/sitemap-${type}.xml</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += "  </sitemap>\n";
    });

    xml += "</sitemapindex>";
    return xml;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sitemap Generator</h2>
          <p className="text-muted-foreground">
            Generate XML sitemaps for planetary-scale SEO optimization
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || hookGenerating}
            className="gap-2"
          >
            {isGenerating || hookGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
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

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Generating Sitemaps...
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(generationProgress)}%
                </span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="urls">URL Management</TabsTrigger>
          <TabsTrigger value="generated">Generated Sitemaps</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={config.baseUrl}
                    onChange={(e) =>
                      setConfig({ ...config, baseUrl: e.target.value })
                    }
                    placeholder="https://savannah-marketplace.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUrls">Maximum URLs per Sitemap</Label>
                  <Input
                    id="maxUrls"
                    type="number"
                    value={config.maxUrls}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        maxUrls: parseInt(e.target.value),
                      })
                    }
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Regions to Include</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "kenya",
                      "tanzania",
                      "uganda",
                      "rwanda",
                      "ethiopia",
                      "south-africa",
                    ].map((region) => (
                      <Badge
                        key={region}
                        variant={
                          config.regions.includes(region)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer capitalize"
                        onClick={() => {
                          const newRegions = config.regions.includes(region)
                            ? config.regions.filter((r) => r !== region)
                            : [...config.regions, region];
                          setConfig({ ...config, regions: newRegions });
                        }}
                      >
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Advanced Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeImages">Include Image Tags</Label>
                  <input
                    id="includeImages"
                    type="checkbox"
                    checked={config.includeImages}
                    onChange={(e) =>
                      setConfig({ ...config, includeImages: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="includeVideos">Include Video Tags</Label>
                  <input
                    id="includeVideos"
                    type="checkbox"
                    checked={config.includeVideos}
                    onChange={(e) =>
                      setConfig({ ...config, includeVideos: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="includeHreflang">Include Hreflang Tags</Label>
                  <input
                    id="includeHreflang"
                    type="checkbox"
                    checked={config.includeHreflang}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        includeHreflang: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compress">Compress Output</Label>
                  <input
                    id="compress"
                    type="checkbox"
                    checked={config.compress}
                    onChange={(e) =>
                      setConfig({ ...config, compress: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* URL Management Tab */}
        <TabsContent value="urls" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>URL Collection & Management</CardTitle>
                <Badge variant="outline">
                  {sitemapEntries.length.toLocaleString()} URLs
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Change Frequency</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Hreflang</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sitemapEntries.slice(0, 10).map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          {entry.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.lastmod).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.changefreq}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.priority >= 0.8 ? "default" : "secondary"
                          }
                        >
                          {entry.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.hreflang ? (
                          <Badge variant="outline">
                            {Object.keys(entry.hreflang).length} langs
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Sitemaps Tab */}
        <TabsContent value="generated" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["products", "categories", "locations", "news"].map((type) => (
              <Card key={type}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <Badge
                      variant={
                        generatedSitemaps[type] ? "default" : "secondary"
                      }
                    >
                      {generatedSitemaps[type] ? "Generated" : "Pending"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>URLs:</span>
                      <span>12,345</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>2.3 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 flex-1"
                      onClick={() => {
                        const xmlContent = generateXMLSitemap(sitemapEntries);
                        downloadSitemap(type, xmlContent);
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sitemap Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Sitemap Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
                    {generateSitemapIndex()}
                  </pre>
                </div>
                <Button
                  className="gap-2"
                  onClick={() => {
                    const indexContent = generateSitemapIndex();
                    downloadSitemap("index", indexContent);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Sitemap Index
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sitemap analytics features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
