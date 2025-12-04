
'use client';

import { ProductCard } from '@/components/ProductCard';
import { useSearchParams, notFound } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { categories, products as allProducts, getProductsByCategory } from '@/lib/data';
import { useCart } from '@/context/CartContext';


export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  useEffect(() => {
    if (searchParams.get('clearCart') === 'true') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  const products = useMemo(() => {
    return allProducts.sort((a, b) => a.id.localeCompare(b.id));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl md:text-5xl">
        <TranslatedText fr="Tous les produits" en="All Products">Alle Produkte</TranslatedText>
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          <TranslatedText fr="Aucun produit trouvé." en="No products found.">Keine Produkte gefunden.</TranslatedText>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
