
'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { TranslatedText } from './TranslatedText';
import { Star, ShoppingCart } from 'lucide-react';
import { ProductCardActions } from './ProductCardActions';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AddToFavoritesButton } from './favorites/AddToFavoritesButton';

const { placeholderImages } = placeholderImagesData;

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  const productImage = placeholderImages.find(p => p.id === product.images[0]);
  const averageRating = 5;
  const [reviewCount, setReviewCount] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Generate random number only on the client-side to avoid hydration mismatch
    setReviewCount(Math.floor(Math.random() * (25 - 5 + 1)) + 5);
  }, []);

  const handleAddToCart = () => {
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0] : undefined;
    addToCart({
      product,
      quantity: 1,
      size: defaultSize,
      color: defaultColor,
    });
    toast({
      title: 'Ajouté au panier !',
      description: `${getTranslatedName()} a été ajouté à votre panier.`,
    });
  };
  
  const getTranslatedName = () => {
    if (language === 'fr') return product.name_fr;
    if (language === 'en') return product.name_en;
    return product.name;
  }

  return (
    <div className="group flex h-full flex-col">
        <div className="relative block">
            <Link href={`/product/${product.slug}`} className="block">
                <div className="relative block aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-lg">
                    {productImage && (
                    <img
                        src={productImage.imageUrl}
                        alt={getTranslatedName()}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={productImage.imageHint}
                    />
                    )}
                     {product.oldPrice && (
                        <Badge variant="destructive" className="absolute top-3 left-3">PROMO</Badge>
                    )}
                </div>
            </Link>
             <AddToFavoritesButton 
                productId={product.id}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-background/80"
             />
        </div>
        <div className="pt-4 text-left flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <h3 className="font-headline text-xl text-foreground flex-grow pr-2">
                    <Link href={`/product/${product.slug}`}><TranslatedText fr={product.name_fr} en={product.name_en}>{product.name}</TranslatedText></Link>
                </h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground flex-grow">
              <TranslatedText fr={product.description_fr.substring(0, 50) + '...'} en={product.description_en.substring(0, 50) + '...'}>{product.description.substring(0,50) + '...'}</TranslatedText>
            </p>
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < Math.floor(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted')} />
              ))}
              {reviewCount > 0 ? <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span> : null}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                  <p className="text-lg font-medium text-foreground">€{product.price.toFixed(2)}</p>
                  {product.oldPrice && (
                      <p className="text-sm text-muted-foreground line-through">€{product.oldPrice.toFixed(2)}</p>
                  )}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <TranslatedText fr="Ajouter" en="Add">Ajouter</TranslatedText>
              </Button>
            </div>
        </div>
    </div>
  );
}
