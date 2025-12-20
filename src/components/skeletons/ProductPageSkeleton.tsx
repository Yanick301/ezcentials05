import { Skeleton } from '@/components/ui/skeleton';

export function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/4 mb-6" />
          <Skeleton className="h-5 w-32 mb-8" />
          <Skeleton className="h-32 w-full mb-8" />
          
          {/* Size Selection */}
          <div className="mb-6">
            <Skeleton className="h-5 w-16 mb-4" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-16" />
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <Skeleton className="h-5 w-20 mb-4" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-12 w-full mb-8" />

          {/* Tabs Skeleton */}
          <div>
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}






































