
'use client';

import { products as allProducts, getProductById } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { TranslatedText } from '@/components/TranslatedText';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProductListSkeleton } from '@/components/skeletons/ProductListSkeleton';

export default function FavoritesPage() {
  const { favorites, isFavoritesLoading } = useFavorites();

  const favoriteProducts = useMemo(() => {
    return favorites
      .map((productId) => getProductById(allProducts, productId))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [favorites]);

  if (isFavoritesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-2" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <ProductListSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
            <h1 className="mb-2 font-headline text-3xl">
                <TranslatedText fr="Mes favoris" en="My Favorites">Meine Favoriten</TranslatedText>
            </h1>
            <p className="text-lg text-muted-foreground">
                <TranslatedText fr="Voici vos articles précieusement sélectionnés." en="Here are your treasured items.">
                    Hier sind Ihre wertvollen Artikel.
                </TranslatedText>
            </p>
        </div>
      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-12 text-center">
          <Heart className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold"><TranslatedText fr="Aucun favori pour le moment" en="No favorites yet">Noch keine Favoriten</TranslatedText></h3>
          <p className="mt-2 text-muted-foreground"><TranslatedText fr="Cliquez sur le cœur d'un produit pour l'enregistrer." en="Click the heart on products to save them.">Klicken Sie auf das Herz bei Produkten, um sie zu speichern.</TranslatedText></p>
          <Button asChild className="mt-6">
            <Link href="/products/all">
                <TranslatedText fr="Explorer les produits" en="Explore Products">Produkte entdecken</TranslatedText>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
