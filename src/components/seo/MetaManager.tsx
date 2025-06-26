import React, { useEffect } from "react";
import { SEOMetadata } from "@/services/seoService";

interface MetaManagerProps {
  metadata: SEOMetadata;
  region?: string;
  language?: string;
}

export const MetaManager = ({
  metadata,
  region = "kenya",
  language = "sw",
}: MetaManagerProps) => {
  useEffect(() => {
    // Update document title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Basic SEO meta tags
    if (metadata.description) {
      updateMetaTag("description", metadata.description);
    }

    if (metadata.keywords && metadata.keywords.length > 0) {
      updateMetaTag("keywords", metadata.keywords.join(", "));
    }

    if (metadata.robots) {
      updateMetaTag("robots", metadata.robots);
    }

    // Open Graph meta tags
    if (metadata.ogTitle) {
      updateMetaTag("og:title", metadata.ogTitle, true);
    }

    if (metadata.ogDescription) {
      updateMetaTag("og:description", metadata.ogDescription, true);
    }

    if (metadata.ogImage) {
      updateMetaTag("og:image", metadata.ogImage, true);
    }

    if (metadata.ogType) {
      updateMetaTag("og:type", metadata.ogType, true);
    }

    // Twitter Card meta tags
    if (metadata.twitterCard) {
      updateMetaTag("twitter:card", metadata.twitterCard);
    }

    if (metadata.twitterTitle) {
      updateMetaTag("twitter:title", metadata.twitterTitle);
    }

    if (metadata.twitterDescription) {
      updateMetaTag("twitter:description", metadata.twitterDescription);
    }

    if (metadata.twitterImage) {
      updateMetaTag("twitter:image", metadata.twitterImage);
    }

    // Region-specific meta tags
    updateMetaTag("geo.region", region.toUpperCase());
    updateMetaTag(
      "geo.country",
      region === "kenya"
        ? "KE"
        : region === "tanzania"
          ? "TZ"
          : region === "uganda"
            ? "UG"
            : "RW",
    );
    updateMetaTag("language", language);

    // USSD and mobile optimization
    updateMetaTag("format-detection", "telephone=yes");
    updateMetaTag("mobile-web-app-capable", "yes");
    updateMetaTag("apple-mobile-web-app-capable", "yes");
    updateMetaTag("apple-mobile-web-app-status-bar-style", "default");

    // Canonical URL
    if (metadata.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", metadata.canonicalUrl);
    }

    // Hreflang tags
    if (metadata.hreflang) {
      // Remove existing hreflang tags
      document
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .forEach((link) => {
          link.remove();
        });

      // Add new hreflang tags
      Object.entries(metadata.hreflang).forEach(([lang, url]) => {
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        link.setAttribute("href", url);
        document.head.appendChild(link);
      });
    }

    // JSON-LD structured data
    if (metadata.jsonLd && metadata.jsonLd.length > 0) {
      // Remove existing JSON-LD scripts
      document
        .querySelectorAll('script[type="application/ld+json"]')
        .forEach((script) => {
          script.remove();
        });

      // Add new JSON-LD scripts
      metadata.jsonLd.forEach((data, index) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data, null, 2);
        script.id = `jsonld-${index}`;
        document.head.appendChild(script);
      });
    }

    // African marketplace specific meta tags
    updateMetaTag("author", "Savannah Marketplace");
    updateMetaTag("application-name", "Savannah Marketplace");
    updateMetaTag("msapplication-TileColor", "#f59e0b");
    updateMetaTag("theme-color", "#f59e0b");

    // Clean up function
    return () => {
      // Optionally clean up meta tags when component unmounts
      // This is usually not necessary as they should persist
    };
  }, [metadata, region, language]);

  // This component doesn't render anything visible
  return null;
};

// Helper hook for managing meta tags
export const useMetaTags = (
  metadata: SEOMetadata,
  region?: string,
  language?: string,
) => {
  useEffect(() => {
    // Implementation similar to MetaManager useEffect
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Apply all meta tags
    if (metadata.title) document.title = metadata.title;
    if (metadata.description)
      updateMetaTag("description", metadata.description);
    if (metadata.keywords?.length)
      updateMetaTag("keywords", metadata.keywords.join(", "));
    if (metadata.robots) updateMetaTag("robots", metadata.robots);

    // Apply Open Graph tags
    if (metadata.ogTitle) updateMetaTag("og:title", metadata.ogTitle, true);
    if (metadata.ogDescription)
      updateMetaTag("og:description", metadata.ogDescription, true);
    if (metadata.ogImage) updateMetaTag("og:image", metadata.ogImage, true);
    if (metadata.ogType) updateMetaTag("og:type", metadata.ogType, true);

    // Apply Twitter Card tags
    if (metadata.twitterCard)
      updateMetaTag("twitter:card", metadata.twitterCard);
    if (metadata.twitterTitle)
      updateMetaTag("twitter:title", metadata.twitterTitle);
    if (metadata.twitterDescription)
      updateMetaTag("twitter:description", metadata.twitterDescription);
    if (metadata.twitterImage)
      updateMetaTag("twitter:image", metadata.twitterImage);
  }, [metadata, region, language]);
};
