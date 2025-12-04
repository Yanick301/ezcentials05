
'use client';

import { ProductCard } from '@/components/ProductCard';
import { notFound, useParams } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo } from 'react';
import type { Product } from '@/lib/types';
import { categories, products as allProducts, getProductsByCategory } from '@/lib/data';
import type { Metadata } from 'next';
import { useLanguage } from '@/context/LanguageContext';


type CategoryPageProps = {
  params: {
    category: string;
  };
};

// This component is now client-side, so we can't export metadata directly.
// We'll handle the title dynamically in the component.

export default function CategoryPage() {
  const params = useParams();
  const { language } = useLanguage();
  const categorySlug = params.category as string;
  
  const category = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug]);
  
  const products = useMemo(() => {
    if (!categorySlug) return [];
    const filtered = getProductsByCategory(allProducts, categorySlug);
    // Sort products to ensure a stable order between server and client rendering
    return filtered.sort((a, b) => a.slug.localeCompare(b.slug));
  }, [categorySlug]);

  const getPageTitle = () => {
     if (categorySlug === 'all') {
        switch (language) {
            case 'fr': return 'Tous les produits';
            case 'en': return 'All Products';
            default: return 'Alle Produkte';
        }
     }
     if (category) {
        switch (language) {
            case 'fr': return category.name_fr;
            case 'en': return category.name_en;
            default: return category.name;
        }
     }
     return 'Produkte';
  }

  const pageTitle = getPageTitle();
  
  // Dynamically update document title
  useMemo(() => {
    if (typeof window !== 'undefined') {
        document.title = `${pageTitle} | EZCENTIALS`;
    }
  }, [pageTitle]);

  const title = categorySlug === 'all' ? 'Alle Produkte' : category?.name;
  const titleFr = categorySlug === 'all' ? 'Tous les produits' : category?.name_fr;
  const titleEn = categorySlug === 'all' ? 'All Products' : category?.name_en;

  if (products.length === 0 && categorySlug !== 'all') {
    const categoryExists = categories.some(c => c.slug === categorySlug);
    if (!categoryExists) {
        notFound();
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl md:text-5xl">
        <TranslatedText fr={titleFr || 'Produits'} en={titleEn || 'Products'}>{title || 'Produkte'}</TranslatedText>
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          <TranslatedText fr="Aucun produit trouvé dans cette catégorie." en="No products found in this category.">Keine Produkte in dieser Kategorie gefunden.</TranslatedText>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
