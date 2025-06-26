import { useEffect } from "react";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  locale?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = config.title;
    }

    // Update meta description
    if (config.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", config.description);
    }

    // Update meta keywords
    if (config.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", config.keywords);
    }

    // Update canonical URL
    if (config.canonical) {
      let linkCanonical = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement;
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = config.canonical;
    }

    // Update Open Graph image
    if (config.ogImage) {
      let metaOgImage = document.querySelector('meta[property="og:image"]');
      if (!metaOgImage) {
        metaOgImage = document.createElement("meta");
        metaOgImage.setAttribute("property", "og:image");
        document.head.appendChild(metaOgImage);
      }
      metaOgImage.setAttribute("content", config.ogImage);
    }

    // Update locale
    if (config.locale) {
      document.documentElement.lang = config.locale;
    }
  }, [config]);

  return {
    updateTitle: (title: string) => {
      document.title = title;
    },
    updateDescription: (description: string) => {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    },
  };
};
