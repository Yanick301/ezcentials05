
'use client';

import { ProductCard } from '@/components/ProductCard';
import { notFound, useParams } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { categories, products as allProducts, getProductsByCategory } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { Breadcrumbs, useBreadcrumbsForCategory } from '@/components/Breadcrumbs';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { SEOHead } from '@/components/SEOHead';
import { ProductFilters } from '@/components/ProductFilters';
import { SubCategoryList } from '@/components/SubCategoryList';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

const ITEMS_PER_PAGE = 12;


type CategoryPageProps = {
  params: {
    category: string;
  };
};

// This component is now client-side, so we can't export metadata directly.
// We'll handle the title dynamically in the component.

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

interface FilterState {
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
}

export default function CategoryPage() {
  const params = useParams();
  const { language } = useLanguage();
  const categorySlug = params.category as string;
  
  // Try to restore page state from sessionStorage
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('productReturnState');
        if (stored) {
          const state = JSON.parse(stored);
          // Only restore if it's recent (within 5 minutes) and for the same category
          if (state.categorySlug === categorySlug && state.timestamp && Date.now() - state.timestamp < 5 * 60 * 1000) {
            // Clear it after reading
            sessionStorage.removeItem('productReturnState');
            return state;
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
    return null;
  };

  const restoredState = getInitialState();
  
  const [sortOption, setSortOption] = useState<SortOption>(restoredState?.sortOption || 'name-asc');
  const [filters, setFilters] = useState<FilterState>(restoredState?.filters || {
    priceRange: [0, 1000],
    selectedSizes: [],
    selectedColors: [],
  });
  
  const category = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug]);
  
  const allProductsInCategory = useMemo(() => {
    if (!categorySlug) return [];
    return getProductsByCategory(allProducts, categorySlug);
  }, [categorySlug]);

  // Calculer la plage de prix maximale pour initialiser le filtre
  const maxPriceInCategory = useMemo(() => {
    if (allProductsInCategory.length === 0) return 1000;
    return Math.max(...allProductsInCategory.map(p => p.price), 1000);
  }, [allProductsInCategory]);

  // Initialiser le filtre de prix avec la plage maximale
  useEffect(() => {
    if (allProductsInCategory.length > 0 && filters.priceRange[1] === 1000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPriceInCategory]
      }));
    }
  }, [allProductsInCategory.length, maxPriceInCategory]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allProductsInCategory];

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
  }, [allProductsInCategory, filters, language]);

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
        return sorted; // Keep original order for now
      default:
        return sorted;
    }
  }, [filteredProducts, sortOption, language]);

  const products = sortedProducts;

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

  const pageTitle = useMemo(() => getPageTitle(), [categorySlug, category, language]);
  
  // Dynamically update document title
  useEffect(() => {
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

  const breadcrumbs = category ? useBreadcrumbsForCategory(categorySlug) : [];

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

  // Store page state in sessionStorage when it changes (for return navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && categorySlug) {
      const pageState = {
        url: window.location.pathname + window.location.search,
        currentPage,
        sortOption,
        filters,
        categorySlug,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('categoryPageState', JSON.stringify(pageState));
    }
  }, [currentPage, sortOption, filters, categorySlug]);

  // Restore scroll position and highlight product when returning from product page
  useEffect(() => {
    if (typeof window !== 'undefined' && restoredState) {
      // Check if we're returning from a product page
      const returnProductId = restoredState.returnProductId;
      const returnScroll = restoredState.returnScroll;
      
      if (returnProductId) {
        // Wait for products to render, then position elegantly
        const positionProduct = () => {
          const productElement = document.getElementById(`product-${returnProductId}`);
          if (productElement) {
            // Calculate position with header offset
            const headerHeight = 100;
            const elementRect = productElement.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const offsetPosition = absoluteElementTop - headerHeight;
            
            // Instant, invisible scroll - no animation
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'auto'
            });
            
            // Elegant, subtle highlight - very professional
            requestAnimationFrame(() => {
              productElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
              productElement.style.opacity = '1';
              productElement.style.transform = 'translateY(0)';
              
              // Very subtle shadow and slight elevation
              productElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              
              // Remove highlight gracefully after 1.2 seconds
              setTimeout(() => {
                productElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                productElement.style.boxShadow = '';
                setTimeout(() => {
                  productElement.style.transition = '';
                }, 500);
              }, 1200);
            });
          } else if (returnScroll) {
            // Fallback: restore scroll position instantly
            window.scrollTo({
              top: Math.max(0, parseInt(returnScroll, 10)),
              behavior: 'auto'
            });
          }
        };
        
        // Wait for DOM to be ready
        if (paginatedItems.length > 0) {
          // Use double requestAnimationFrame for reliable execution
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              positionProduct();
            });
          });
        }
      }
    }
  }, [restoredState, paginatedItems]);

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
          <TranslatedText fr="Aucun produit trouvé dans cette catégorie." en="No products found in this category.">Keine Produkte in dieser Kategorie gefunden.</TranslatedText>
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedItems.map((product) => (
              <div 
                key={product.id} 
                id={`product-${product.id}`}
                className="transition-all duration-500 ease-out"
              >
                <ProductCard product={product} />
              </div>
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
