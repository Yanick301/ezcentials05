
'use client';

import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo, useEffect } from 'react';
import { products as allProducts } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';

const ITEMS_PER_PAGE = 12;

export default function AllProductsPageClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  useEffect(() => {
    if (searchParams.get('clearCart') === 'true') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  const products = useMemo(() => {
    // Create a new array before sorting to avoid mutating the original
    return [...allProducts].sort((a, b) => a.id.localeCompare(b.id));
  }, []);

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
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl md:text-5xl">
        <TranslatedText fr="Tous les produits" en="All Products">Alle Produkte</TranslatedText>
      </h1>
      
      {totalItems > 0 && (
        <p className="mb-6 text-center text-sm text-muted-foreground">
          <TranslatedText 
            fr={`Affichage de ${startIndex} à ${endIndex} sur ${totalItems} produits`}
            en={`Showing ${startIndex} to ${endIndex} of ${totalItems} products`}
          >
            Zeige {startIndex} bis {endIndex} von {totalItems} Produkten
          </TranslatedText>
        </p>
      )}

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          <TranslatedText fr="Aucun produit trouvé." en="No products found.">Keine Produkte gefunden.</TranslatedText>
        </p>
      ) : (
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
      )}
    </div>
  );
}
