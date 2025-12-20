import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}






































