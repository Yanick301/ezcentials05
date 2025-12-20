
import { Suspense } from 'react';
import AllProductsPageClient from './AllProductsPageClient';
import { ProductListSkeleton } from '@/components/skeletons/ProductListSkeleton';

export default function AllProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 h-12 w-full max-w-md mx-auto">
          <div className="h-full w-full bg-muted animate-pulse rounded-md" />
        </div>
        <ProductListSkeleton count={12} />
      </div>
    }>
      <AllProductsPageClient />
    </Suspense>
  );
}
