import type { Metadata } from 'next';
import { getSiteUrl } from './site-url';

interface Product {
  id: string;
  name: string;
  name_fr: string;
  name_en: string;
  description: string;
  description_fr: string;
  description_en: string;
  price: number;
  old_price?: number | null;
  images: string[];
  category: string;
  slug: string;
}

interface Category {
  name: string;
  name_fr: string;
  name_en: string;
  slug: string;
}

export function generateProductMetadata(
  product: Product,
  language: 'de' | 'fr' | 'en' = 'de'
): Metadata {
  const siteUrl = getSiteUrl();
  const name = language === 'fr' ? product.name_fr : language === 'en' ? product.name_en : product.name;
  const description = language === 'fr' ? product.description_fr : language === 'en' ? product.description_en : product.description;
  const imageUrl = product.images[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/images/logo.png`;

  return {
    title: `${name} | EZCENTIALS`,
    description: description.substring(0, 160),
    openGraph: {
      title: name,
      description: description.substring(0, 160),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: description.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/product/${product.slug}`,
      languages: {
        'de-DE': `${siteUrl}/product/${product.slug}`,
        'fr-FR': `${siteUrl}/product/${product.slug}`,
        'en-GB': `${siteUrl}/product/${product.slug}`,
      },
    },
  };
}

export function generateCategoryMetadata(
  category: Category,
  language: 'de' | 'fr' | 'en' = 'de'
): Metadata {
  const siteUrl = getSiteUrl();
  const name = language === 'fr' ? category.name_fr : language === 'en' ? category.name_en : category.name;

  return {
    title: `${name} | EZCENTIALS`,
    description: `${name} - ${language === 'fr' ? 'Découvrez notre collection' : language === 'en' ? 'Discover our collection' : 'Entdecken Sie unsere Kollektion'}`,
    openGraph: {
      title: name,
      description: `${name} - ${language === 'fr' ? 'Découvrez notre collection' : language === 'en' ? 'Discover our collection' : 'Entdecken Sie unsere Kollektion'}`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/products/${category.slug}`,
    },
  };
}

export function generateProductStructuredData(product: Product, language: 'de' | 'fr' | 'en' = 'de') {
  const siteUrl = getSiteUrl();
  const name = language === 'fr' ? product.name_fr : language === 'en' ? product.name_en : product.name;
  const description = language === 'fr' ? product.description_fr : language === 'en' ? product.description_en : product.description;
  const imageUrl = product.images[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/images/logo.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.images.map(img => `${siteUrl}${img}`),
    brand: {
      '@type': 'Brand',
      name: 'EZCENTIALS',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
      ...(product.old_price && {
        priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
    },
    ...(product.old_price && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '10',
      },
    }),
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const siteUrl = getSiteUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateOrganizationStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EZCENTIALS',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    sameAs: [
      // Ajoutez vos liens de réseaux sociaux ici
    ],
  };
}















