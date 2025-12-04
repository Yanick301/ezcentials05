
<<<<<<< HEAD
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AllProductsPageClient from './AllProductsPageClient';
import { TranslatedText } from '@/components/TranslatedText';

export default function AllProductsPage() {
=======
'use client';

import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { TranslatedText } from '@/components/TranslatedText';
import { useMemo, useEffect } from 'react';
import { products as allProducts } from '@/lib/data';
import { useCart } from '@/context/CartContext';

export default function AllProductsPageClient() {
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

>>>>>>> f2dd296782045b3b2894b98727e6a5ffacf6951e
  return (
    <Suspense fallback={
      <div className="container mx-auto flex h-[60vh] items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4"><TranslatedText fr="Chargement des produits..." en="Loading products...">Lade Produkte...</TranslatedText></p>
      </div>
    }>
      <AllProductsPageClient />
    </Suspense>
  );
}
