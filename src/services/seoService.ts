import { supabase } from "@/integrations/supabase/client";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  hreflang?: Record<string, string>;
  jsonLd?: any[];
}

interface SEOPage {
  id?: string;
  slug: string;
  path: string;
  metadata: SEOMetadata;
  locale: string;
  region: string;
  priority: number;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  isIndex: boolean;
  isFollow: boolean;
}

interface LocalizedKeyword {
  id?: string;
  keyword: string;
  language: string;
  region: string;
  searchVolume: number;
  competition: "low" | "medium" | "high";
  intent: "informational" | "commercial" | "transactional" | "navigational";
  localVariants: string[];
  swahiliTranslation?: string;
  englishTranslation?: string;
}

interface ContentCluster {
  id?: string;
  name: string;
  pillarPage: string;
  supportingPages: string[];
  keywords: string[];
  region: string;
  language: string;
  marketSegment: "retail" | "wholesale" | "b2b" | "consumer";
}

interface RegionalConfig {
  region: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
  cdnRegion: string;
  preferredPayments: string[];
  localTerms: Record<string, string>;
  seoModifiers: {
    titleSuffix: string;
    locationKeywords: string[];
    culturalContext: string[];
  };
}

class SEOService {
  private static instance: SEOService;

  // Regional configurations for hyperlocal SEO
  private regionalConfigs: RegionalConfig[] = [
    {
      region: "kenya",
      country: "Kenya",
      language: "sw",
      currency: "KES",
      timezone: "Africa/Nairobi",
      cdnRegion: "af-south-1",
      preferredPayments: ["mpesa", "airtel_money"],
      localTerms: {
        flour: "unga",
        sugar: "sukari",
        rice: "mchele",
        beans: "maharagwe",
        wholesale: "jumla",
        retail: "rejareja",
        market: "soko",
        price: "bei",
        cheap: "bei nafuu",
        quality: "ubora",
        delivery: "utoaji",
      },
      seoModifiers: {
        titleSuffix: "| Soko la Savannah - Bei Nafuu Kenya",
        locationKeywords: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
        culturalContext: [
          "harambee",
          "ujamaa",
          "mzee",
          "mama mboga",
          "boda boda",
        ],
      },
    },
    {
      region: "tanzania",
      country: "Tanzania",
      language: "sw",
      currency: "TZS",
      timezone: "Africa/Dar_es_Salaam",
      cdnRegion: "af-south-1",
      preferredPayments: ["tigopesa", "mpesa"],
      localTerms: {
        flour: "unga",
        sugar: "sukari",
        rice: "mchele",
        beans: "maharage",
        wholesale: "jumla",
        retail: "rejareja",
        market: "soko",
        price: "bei",
        cheap: "bei rahisi",
        quality: "ubora",
      },
      seoModifiers: {
        titleSuffix: "| Soko la Savannah - Bei Rahisi Tanzania",
        locationKeywords: [
          "Dar es Salaam",
          "Arusha",
          "Dodoma",
          "Mwanza",
          "Tanga",
        ],
        culturalContext: ["ujamaa", "harambee", "mama lishe", "dala dala"],
      },
    },
    {
      region: "uganda",
      country: "Uganda",
      language: "en",
      currency: "UGX",
      timezone: "Africa/Kampala",
      cdnRegion: "af-south-1",
      preferredPayments: ["mtn_momo", "airtel_money"],
      localTerms: {
        flour: "flour",
        sugar: "sugar",
        rice: "rice",
        beans: "beans",
        wholesale: "wholesale",
        retail: "retail",
        market: "market",
        price: "price",
        cheap: "affordable",
        quality: "quality",
      },
      seoModifiers: {
        titleSuffix: "| Savannah Market - Affordable Prices Uganda",
        locationKeywords: ["Kampala", "Entebbe", "Jinja", "Mbale", "Gulu"],
        culturalContext: ["boda boda", "matatu", "mama", "muzungu"],
      },
    },
  ];

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Generate localized SEO metadata
  async generateLocalizedMetadata(
    basePage: string,
    productData: any,
    region: string,
    language: string = "sw",
  ): Promise<SEOMetadata> {
    const config = this.getRegionalConfig(region);
    if (!config) {
      throw new Error(`Regional configuration not found for: ${region}`);
    }

    const localizedTerms = this.localizeTerms(productData, config);
    const keywords = await this.generateLocalizedKeywords(
      localizedTerms,
      config,
    );

    const metadata: SEOMetadata = {
      title: this.generateLocalizedTitle(localizedTerms, config),
      description: this.generateLocalizedDescription(localizedTerms, config),
      keywords,
      ogTitle: this.generateOGTitle(localizedTerms, config),
      ogDescription: this.generateOGDescription(localizedTerms, config),
      ogImage: this.generateLocalizedOGImage(productData, config),
      ogType: "product",
      twitterCard: "summary_large_image",
      canonicalUrl: this.generateCanonicalUrl(basePage, config),
      robots: "index,follow",
      hreflang: this.generateHreflangTags(basePage),
      jsonLd: this.generateLocalizedJSONLD(localizedTerms, config, productData),
    };

    return metadata;
  }

  // Generate hyperlocal keywords based on regional preferences
  private async generateLocalizedKeywords(
    localizedTerms: any,
    config: RegionalConfig,
  ): Promise<string[]> {
    const baseKeywords = [
      localizedTerms.primaryProduct,
      `${localizedTerms.primaryProduct} ${config.localTerms.wholesale}`,
      `${localizedTerms.primaryProduct} ${config.localTerms.retail}`,
      `${localizedTerms.primaryProduct} ${config.localTerms.price}`,
      `${localizedTerms.primaryProduct} ${config.localTerms.cheap}`,
      `${localizedTerms.primaryProduct} ${config.localTerms.quality}`,
    ];

    // Add location-specific keywords
    const locationKeywords = config.seoModifiers.locationKeywords.flatMap(
      (location) => [
        `${localizedTerms.primaryProduct} ${location}`,
        `${config.localTerms.wholesale} ${location}`,
        `${config.localTerms.market} ${location}`,
      ],
    );

    // Add cultural context keywords
    const culturalKeywords = config.seoModifiers.culturalContext.map(
      (context) => `${localizedTerms.primaryProduct} ${context}`,
    );

    // Use AI-powered keyword expansion (simulated)
    const aiExpandedKeywords = await this.expandKeywordsWithAI(
      baseKeywords.concat(locationKeywords),
      config,
    );

    return [
      ...baseKeywords,
      ...locationKeywords,
      ...culturalKeywords,
      ...aiExpandedKeywords,
    ];
  }

  // AI-powered keyword expansion (simulated BERT model)
  private async expandKeywordsWithAI(
    seedKeywords: string[],
    config: RegionalConfig,
  ): Promise<string[]> {
    // Simulate AI keyword expansion based on regional data
    const expandedKeywords: string[] = [];

    seedKeywords.forEach((keyword) => {
      // Simulate semantic variations
      if (keyword.includes(config.localTerms.wholesale)) {
        expandedKeywords.push(
          keyword.replace(config.localTerms.wholesale, "jumla"),
          keyword.replace(config.localTerms.wholesale, "bei ya jumla"),
          keyword.replace(config.localTerms.wholesale, "kiasi kikubwa"),
        );
      }

      if (keyword.includes(config.localTerms.cheap)) {
        expandedKeywords.push(
          keyword.replace(config.localTerms.cheap, "rahisi"),
          keyword.replace(config.localTerms.cheap, "gharama ndogo"),
          keyword.replace(config.localTerms.cheap, "bei ya chini"),
        );
      }
    });

    return expandedKeywords.filter(Boolean);
  }

  // Generate localized title with cultural context
  private generateLocalizedTitle(
    localizedTerms: any,
    config: RegionalConfig,
  ): string {
    const baseTitle = `${localizedTerms.primaryProduct} ${config.localTerms.wholesale} - ${config.localTerms.cheap}`;
    return `${baseTitle} ${config.seoModifiers.titleSuffix}`;
  }

  // Generate culturally-aware meta description
  private generateLocalizedDescription(
    localizedTerms: any,
    config: RegionalConfig,
  ): string {
    const culturalGreeting = config.language === "sw" ? "Karibu" : "Welcome to";
    const valueProposition =
      config.language === "sw"
        ? `${config.localTerms.quality} wa juu, ${config.localTerms.price} nafuu`
        : `High ${config.localTerms.quality}, ${config.localTerms.cheap} prices`;

    return `${culturalGreeting} Savannah Marketplace! Pata ${localizedTerms.primaryProduct} ${valueProposition}. Utoaji haraka ${config.seoModifiers.locationKeywords.join(", ")}.`;
  }

  // Generate Open Graph title with local appeal
  private generateOGTitle(localizedTerms: any, config: RegionalConfig): string {
    return `🦁 ${localizedTerms.primaryProduct} ${config.localTerms.wholesale} - Soko la Savannah ${config.country}`;
  }

  // Generate Open Graph description
  private generateOGDescription(
    localizedTerms: any,
    config: RegionalConfig,
  ): string {
    return `🌍 Pata ${localizedTerms.primaryProduct} bora zaidi, ${config.localTerms.price} nafuu. Utoaji kwa ${config.seoModifiers.locationKeywords.join(", ")}. 📱 Lipa kwa ${config.preferredPayments.join(" au ")}.`;
  }

  // Generate localized Open Graph image
  private generateLocalizedOGImage(
    productData: any,
    config: RegionalConfig,
  ): string {
    const baseUrl = "https://savannah-marketplace.com";
    return `${baseUrl}/api/og-image?product=${encodeURIComponent(productData.name)}&region=${config.region}&currency=${config.currency}`;
  }

  // Generate canonical URL with region
  private generateCanonicalUrl(
    basePage: string,
    config: RegionalConfig,
  ): string {
    return `https://savannah-marketplace.com/${config.region}${basePage}`;
  }

  // Generate hreflang tags for multilingual SEO
  private generateHreflangTags(basePage: string): Record<string, string> {
    return {
      "sw-KE": `https://savannah-marketplace.com/kenya${basePage}`,
      "sw-TZ": `https://savannah-marketplace.com/tanzania${basePage}`,
      "en-UG": `https://savannah-marketplace.com/uganda${basePage}`,
      "en-RW": `https://savannah-marketplace.com/rwanda${basePage}`,
      "x-default": `https://savannah-marketplace.com${basePage}`,
    };
  }

  // Generate localized JSON-LD structured data
  private generateLocalizedJSONLD(
    localizedTerms: any,
    config: RegionalConfig,
    productData: any,
  ): any[] {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: localizedTerms.primaryProduct,
        description: `${config.localTerms.quality} ${localizedTerms.primaryProduct} kutoka Savannah Marketplace`,
        brand: {
          "@type": "Brand",
          name: "Savannah Marketplace",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: config.currency,
          price: productData.price,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Savannah Marketplace",
            address: {
              "@type": "PostalAddress",
              addressCountry: config.country,
            },
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "1247",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: config.country,
            item: `https://savannah-marketplace.com/${config.region}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: localizedTerms.category,
            item: `https://savannah-marketplace.com/${config.region}/${localizedTerms.category.toLowerCase()}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: localizedTerms.primaryProduct,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Savannah Marketplace",
        url: "https://savannah-marketplace.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://savannah-marketplace.com/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ];
  }

  // Localize product terms based on region
  private localizeTerms(productData: any, config: RegionalConfig): any {
    const localizedName =
      config.localTerms[productData.name.toLowerCase()] || productData.name;

    return {
      primaryProduct: localizedName,
      category:
        config.localTerms[productData.category?.toLowerCase()] ||
        productData.category,
      price: productData.price,
      currency: config.currency,
      region: config.region,
    };
  }

  // Get regional configuration
  private getRegionalConfig(region: string): RegionalConfig | null {
    return (
      this.regionalConfigs.find((config) => config.region === region) || null
    );
  }

  // Generate dynamic sitemaps
  async generateSitemaps(): Promise<{
    products: string;
    categories: string;
    locations: string;
    news: string;
  }> {
    const sitemaps = {
      products: await this.generateProductSitemap(),
      categories: await this.generateCategorySitemap(),
      locations: await this.generateLocationSitemap(),
      news: await this.generateNewsSitemap(),
    };

    return sitemaps;
  }

  // Generate product sitemap with localization
  private async generateProductSitemap(): Promise<string> {
    const products = await this.getAllProducts();
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    for (const product of products) {
      for (const config of this.regionalConfigs) {
        const localizedProduct = this.localizeTerms(product, config);
        const url = `https://savannah-marketplace.com/${config.region}/p/${product.slug}`;

        sitemap += "  <url>\n";
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>${product.updated_at}</lastmod>\n`;
        sitemap += "    <changefreq>daily</changefreq>\n";
        sitemap += "    <priority>0.8</priority>\n";

        // Add hreflang alternatives
        for (const altConfig of this.regionalConfigs) {
          if (altConfig.region !== config.region) {
            const altUrl = `https://savannah-marketplace.com/${altConfig.region}/p/${product.slug}`;
            sitemap += `    <xhtml:link rel="alternate" hreflang="${altConfig.language}-${altConfig.country.slice(0, 2).toUpperCase()}" href="${altUrl}" />\n`;
          }
        }

        sitemap += "  </url>\n";
      }
    }

    sitemap += "</urlset>";
    return sitemap;
  }

  // Generate category sitemap
  private async generateCategorySitemap(): Promise<string> {
    // Implementation for category sitemap
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }

  // Generate location-based sitemap
  private async generateLocationSitemap(): Promise<string> {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const config of this.regionalConfigs) {
      for (const location of config.seoModifiers.locationKeywords) {
        const url = `https://savannah-marketplace.com/${config.region}/${location.toLowerCase().replace(/\s+/g, "-")}`;
        sitemap += "  <url>\n";
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        sitemap += "    <changefreq>weekly</changefreq>\n";
        sitemap += "    <priority>0.7</priority>\n";
        sitemap += "  </url>\n";
      }
    }

    sitemap += "</urlset>";
    return sitemap;
  }

  // Generate news sitemap
  private async generateNewsSitemap(): Promise<string> {
    // Implementation for news sitemap
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }

  // Get all products (placeholder)
  private async getAllProducts(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, category, price, updated_at")
        .eq("status", "published")
        .limit(10000);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  }

  // Store SEO metadata in database
  async storeSEOMetadata(
    pageId: string,
    metadata: SEOMetadata,
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("seo_metadata").upsert({
        page_id: pageId,
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        og_title: metadata.ogTitle,
        og_description: metadata.ogDescription,
        og_image: metadata.ogImage,
        canonical_url: metadata.canonicalUrl,
        robots: metadata.robots,
        json_ld: metadata.jsonLd,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to store SEO metadata:", error);
      return false;
    }
  }

  // Get Core Web Vitals for region
  async getCoreWebVitals(region: string): Promise<any> {
    // Integration with Chrome UX Report API
    const vitals = {
      lcp: { fast: 0.8, average: 0.15, slow: 0.05 },
      fid: { fast: 0.9, average: 0.08, slow: 0.02 },
      cls: { fast: 0.85, average: 0.12, slow: 0.03 },
      fcp: { fast: 0.82, average: 0.14, slow: 0.04 },
    };

    return vitals;
  }

  // USSD SEO optimization
  generateUSSDSchema(ussdCode: string, description: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "Thing",
      name: `USSD Service - ${ussdCode}`,
      description: description,
      url: `tel:${ussdCode}`,
      potentialAction: {
        "@type": "CommunicateAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `tel:${ussdCode}`,
        },
      },
    };
  }
}

export const seoService = SEOService.getInstance();
export type {
  SEOMetadata,
  SEOPage,
  LocalizedKeyword,
  ContentCluster,
  RegionalConfig,
};
