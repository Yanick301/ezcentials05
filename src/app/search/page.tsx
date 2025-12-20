
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { TranslatedText } from '@/components/TranslatedText';
import { products as allProducts } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { ProductListSkeleton } from '@/components/skeletons/ProductListSkeleton';

const ITEMS_PER_PAGE = 12;

function SearchPageClient() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to debounce and allow React to render
    const timeoutId = setTimeout(() => {
      if (queryParam) {
        const lowerCaseQuery = queryParam.toLowerCase();
        const filteredProducts = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.name_fr.toLowerCase().includes(lowerCaseQuery) ||
            product.description_fr.toLowerCase().includes(lowerCaseQuery) ||
            product.name_en.toLowerCase().includes(lowerCaseQuery) ||
            product.description_en.toLowerCase().includes(lowerCaseQuery)
        );
        setResults(filteredProducts);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 150); // Small debounce for better performance

    return () => clearTimeout(timeoutId);
  }, [queryParam]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    items: results,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {isLoading ? (
        <>
          <h1 className="mb-8 text-center font-headline text-3xl md:text-5xl">
            <TranslatedText fr="Recherche..." en="Searching...">Suche...</TranslatedText>
          </h1>
          <ProductListSkeleton count={8} />
        </>
      ) : (
        <>
          <h1 className="mb-8 text-center font-headline text-3xl md:text-5xl break-words">
            {queryParam && results.length > 0 ? (
              <>
                <TranslatedText fr="Résultats de recherche pour" en="Search results for">Suchergebnisse für</TranslatedText>: "{queryParam}"
              </>
            ) : queryParam && results.length === 0 ? (
                <TranslatedText fr={`Aucun résultat trouvé pour "${queryParam}"`} en={`No results found for "${queryParam}"`}>Keine Ergebnisse gefunden für "{queryParam}"</TranslatedText>
            ) : (
              <TranslatedText fr="Recherche" en="Search">Suche</TranslatedText>
            )}
          </h1>

          {totalItems > 0 && (
            <p className="mb-6 text-center text-sm text-muted-foreground">
              <TranslatedText 
                fr={`Affichage de ${startIndex} à ${endIndex} sur ${totalItems} résultats`}
                en={`Showing ${startIndex} to ${endIndex} of ${totalItems} results`}
              >
                Zeige {startIndex} bis {endIndex} von {totalItems} Ergebnissen
              </TranslatedText>
            </p>
          )}

          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          ) : (
             !queryParam && (
                <p className="text-center text-muted-foreground">
                    <TranslatedText fr="Veuillez entrer un terme de recherche pour trouver des produits." en="Please enter a search term to find products.">Bitte geben Sie einen Suchbegriff ein, um Produkte zu finden.</TranslatedText>
                </p>
             )
          )}
        </>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={
          <div className="container mx-auto flex h-[60vh] items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
            <SearchPageClient />
        </Suspense>
    )
}
