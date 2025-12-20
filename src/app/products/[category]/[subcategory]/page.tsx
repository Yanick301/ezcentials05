'use client';

import { ProductCard } from '@/components/ProductCard';
import { notFound, useParams } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { categories, products as allProducts, getProductsByCategory, getProductsBySubcategory } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { SEOHead } from '@/components/SEOHead';
import { ProductFilters } from '@/components/ProductFilters';
import { SubCategoryList } from '@/components/SubCategoryList';

const ITEMS_PER_PAGE = 12;

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

interface FilterState {
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
}

export default function SubCategoryPage() {
  const params = useParams();
  const { language } = useLanguage();
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;
  
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    selectedSizes: [],
    selectedColors: [],
  });
  
  const category = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug]);

  const subcategory = useMemo(() => {
    if (!category || !category.subcategories) return undefined;
    return category.subcategories.find((s) => s.slug === subcategorySlug);
  }, [category, subcategorySlug]);
  
  // Filtrer les produits par catégorie et sous-catégorie
  const allProductsInSubcategory = useMemo(() => {
    if (!categorySlug || !subcategorySlug) return [];
    return getProductsBySubcategory(allProducts, categorySlug, subcategorySlug);
  }, [categorySlug, subcategorySlug]);
  
  // Pour les filtres, on utilise tous les produits de la catégorie
  const allProductsInCategory = useMemo(() => {
    if (!categorySlug) return [];
    return getProductsByCategory(allProducts, categorySlug);
  }, [categorySlug]);

  // Calculer la plage de prix maximale pour initialiser le filtre
  const maxPriceInSubcategory = useMemo(() => {
    if (allProductsInSubcategory.length === 0) return 1000;
    return Math.max(...allProductsInSubcategory.map(p => p.price), 1000);
  }, [allProductsInSubcategory]);

  // Initialiser le filtre de prix avec la plage maximale
  useEffect(() => {
    if (allProductsInSubcategory.length > 0 && filters.priceRange[1] === 1000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPriceInSubcategory]
      }));
    }
  }, [allProductsInSubcategory.length, maxPriceInSubcategory]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allProductsInSubcategory];

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes?.some(size => filters.selectedSizes.includes(size))
      );
    }

    // Color filter
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors?.some(c => {
          const colorName = language === 'fr' ? c.name_fr : language === 'en' ? c.name_en : c.name_de;
          return filters.selectedColors.includes(colorName);
        })
      );
    }

    return filtered;
  }, [allProductsInSubcategory, filters, language]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => {
          const nameA = language === 'fr' ? a.name_fr : language === 'en' ? a.name_en : a.name;
          const nameB = language === 'fr' ? b.name_fr : language === 'en' ? b.name_en : b.name;
          return nameA.localeCompare(nameB);
        });
      case 'name-desc':
        return sorted.sort((a, b) => {
          const nameA = language === 'fr' ? a.name_fr : language === 'en' ? a.name_en : a.name;
          const nameB = language === 'fr' ? b.name_fr : language === 'en' ? b.name_en : b.name;
          return nameB.localeCompare(nameA);
        });
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted;
      default:
        return sorted;
    }
  }, [filteredProducts, sortOption, language]);

  const products = sortedProducts;

  const getPageTitle = () => {
    if (subcategory) {
      switch (language) {
        case 'fr': return subcategory.name_fr;
        case 'en': return subcategory.name_en;
        default: return subcategory.name;
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
  };

  const pageTitle = useMemo(() => getPageTitle(), [subcategory, category, language]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = `${pageTitle} | EZCENTIALS`;
    }
  }, [pageTitle]);

  const title = subcategory?.name || category?.name || 'Produkte';
  const titleFr = subcategory?.name_fr || category?.name_fr || 'Produits';
  const titleEn = subcategory?.name_en || category?.name_en || 'Products';

  if (!category || !subcategory) {
    notFound();
  }

  const breadcrumbs = [
    { label: language === 'fr' ? 'Accueil' : language === 'en' ? 'Home' : 'Startseite', href: '/' },
    { 
      label: language === 'fr' ? category.name_fr : language === 'en' ? category.name_en : category.name, 
      href: `/products/${categorySlug}` 
    },
    { 
      label: language === 'fr' ? subcategory.name_fr : language === 'en' ? subcategory.name_en : subcategory.name, 
      href: `/products/${categorySlug}/${subcategorySlug}` 
    },
  ];

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    items: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <>
      {category && <SEOHead category={category} type="category" />}
      <div className="container mx-auto px-4 py-12">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="mb-8 text-center font-headline text-4xl md:text-5xl">
          <TranslatedText fr={titleFr || 'Produits'} en={titleEn || 'Products'}>{title || 'Produkte'}</TranslatedText>
        </h1>
        
        {category && category.subcategories && category.subcategories.length > 0 && (
          <SubCategoryList 
            subcategories={category.subcategories} 
            parentCategorySlug={categorySlug}
            className="mb-8"
          />
        )}
        
        {products.length > 0 && (
          <ProductFilters
            products={allProductsInCategory}
            filteredProducts={products}
            onFilterChange={setFilters}
            onSortChange={setSortOption}
            currentSort={sortOption}
            language={language}
          />
        )}

        {totalItems > 0 && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            <TranslatedText 
              fr={`Affichage de ${startIndex} à ${endIndex} sur ${totalItems} produit${totalItems > 1 ? 's' : ''}`}
              en={`Showing ${startIndex} to ${endIndex} of ${totalItems} product${totalItems > 1 ? 's' : ''}`}
            >
              Zeige {startIndex} bis {endIndex} von {totalItems} Produkt{totalItems > 1 ? 'en' : ''}
            </TranslatedText>
          </p>
        )}

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            <TranslatedText fr="Aucun produit trouvé dans cette sous-catégorie." en="No products found in this subcategory.">Keine Produkte in dieser Unterkategorie gefunden.</TranslatedText>
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}

