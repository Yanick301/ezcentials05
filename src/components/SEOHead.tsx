'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Product, Category } from '@/lib/types';
import { generateProductMetadata, generateCategoryMetadata, generateProductStructuredData } from '@/lib/seo';

interface SEOHeadProps {
  product?: Product;
  category?: Category;
  type?: 'product' | 'category' | 'default';
}

export function SEOHead({ product, category, type = 'default' }: SEOHeadProps) {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let metadata: any = {};
    let structuredData: object | null = null;

    if (type === 'product' && product) {
      metadata = generateProductMetadata(product, language);
      structuredData = generateProductStructuredData(product, language);
    } else if (type === 'category' && category) {
      metadata = generateCategoryMetadata(category, language);
    }

    // Update document title
    if (metadata.title) {
      document.title = typeof metadata.title === 'string' 
        ? `${metadata.title} | EZCENTIALS`
        : `${metadata.title} | EZCENTIALS`;
    }

    // Update meta description
    if (metadata.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', metadata.description);
    }

    // Update Open Graph tags
    if (metadata.openGraph) {
      const ogTags = [
        { property: 'og:title', content: metadata.openGraph.title as string },
        { property: 'og:description', content: metadata.openGraph.description as string },
        { property: 'og:type', content: metadata.openGraph.type as string },
        { property: 'og:locale', content: metadata.openGraph.locale as string },
      ];

      if (metadata.openGraph.images && metadata.openGraph.images[0]) {
        ogTags.push({ property: 'og:image', content: metadata.openGraph.images[0].url as string });
      }

      ogTags.forEach(tag => {
        let meta = document.querySelector(`meta[property="${tag.property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });
    }

    // Inject structured data
    if (structuredData) {
      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"][data-product-seo]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-product-seo', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Update canonical link
    if (metadata.alternates?.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', metadata.alternates.canonical);
    }
  }, [product, category, type, language]);

  return null;
}



























