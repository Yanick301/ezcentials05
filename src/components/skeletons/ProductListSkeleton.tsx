import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 8 }: ProductListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}







































