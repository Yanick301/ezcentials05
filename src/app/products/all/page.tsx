
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AllProductsPageClient from './AllProductsPageClient';
import { TranslatedText } from '@/components/TranslatedText';

export default function AllProductsPage() {
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
