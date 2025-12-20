
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { findProductImage } from '@/lib/image-utils';
import { TranslatedText } from './TranslatedText';
import { Star, ShoppingCart } from 'lucide-react';
import { ProductCardActions } from './ProductCardActions';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AddToFavoritesButton } from './favorites/AddToFavoritesButton';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  const productImage = useMemo(() => 
    findProductImage(product.images[0]), 
    [product.images]
  );
  const averageRating = 5;
  const [reviewCount, setReviewCount] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Generate random number only on the client-side to avoid hydration mismatch
    setReviewCount(Math.floor(Math.random() * (25 - 5 + 1)) + 5);
  }, []);

  const getTranslatedName = useCallback(() => {
    if (language === 'fr') return product.name_fr;
    if (language === 'en') return product.name_en;
    return product.name;
  }, [language, product.name, product.name_fr, product.name_en]);

  const handleAddToCart = useCallback(() => {
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0] : undefined;
    addToCart({
      product,
      quantity: 1,
      size: defaultSize,
      color: defaultColor,
    });
    toast({
      title: <TranslatedText fr="Ajouté au panier !" en="Added to cart!">Zum Warenkorb hinzugefügt!</TranslatedText>,
      description: (
        <TranslatedText 
          fr={`${getTranslatedName()} a été ajouté à votre panier.`} 
          en={`${getTranslatedName()} has been added to your cart.`}
        >
          {`${getTranslatedName()} wurde zu Ihrem Warenkorb hinzugefügt.`}
        </TranslatedText>
      ),
    });
  }, [product, addToCart, toast, getTranslatedName]);

  return (
    <div className="group flex h-full flex-col transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden bg-card border border-border">
        <div className="relative block overflow-hidden">
            <Link href={`/product/${product.slug}`} className="block" prefetch={true}>
                <div className="relative block aspect-[3/4] w-full overflow-hidden bg-muted">
                    {productImage ? (
                    <Image
                        src={productImage.imageUrl}
                        alt={getTranslatedName()}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        data-ai-hint={productImage.imageHint}
                        onError={(e) => {
                            console.error(`Failed to load product image: ${productImage.imageUrl}`);
                            e.currentTarget.src = '/images/logo.png';
                        }}
                    />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <span className="text-sm">
                                <TranslatedText fr="Image non disponible" en="Image not available">Bild nicht verfügbar</TranslatedText>
                            </span>
                        </div>
                    )}
                     {product.oldPrice && (
                        <Badge variant="destructive" className="absolute top-3 left-3 z-10 shadow-md">
                            <TranslatedText fr="PROMO" en="SALE">ANGEBOT</TranslatedText>
                        </Badge>
                    )}
                </div>
            </Link>
             <AddToFavoritesButton 
                productId={product.id}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-md p-2 text-foreground transition-all hover:bg-background hover:scale-110 shadow-md z-10"
             />
        </div>
        <div className="pt-4 px-4 pb-4 text-left flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <h3 className="font-headline text-lg md:text-xl text-foreground flex-grow pr-2 line-clamp-2">
                    <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors" prefetch={true} aria-label={getTranslatedName()}>
                        <TranslatedText fr={product.name_fr} en={product.name_en}>{product.name}</TranslatedText>
                    </Link>
                </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground flex-grow line-clamp-2">
              <TranslatedText fr={product.description_fr.substring(0, 60) + '...'} en={product.description_en.substring(0, 60) + '...'}>{product.description.substring(0,60) + '...'}</TranslatedText>
            </p>
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('h-4 w-4 transition-colors', i < Math.floor(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30')} />
              ))}
              {reviewCount > 0 ? <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span> : null}
            </div>
            <div className="mt-4 flex justify-between items-center gap-2">
              <div className="flex items-baseline gap-2">
                  <p className="text-lg font-semibold text-foreground">€{product.price.toFixed(2)}</p>
                  {product.oldPrice && (
                      <p className="text-sm text-muted-foreground line-through">€{product.oldPrice.toFixed(2)}</p>
                  )}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddToCart} className="hover:bg-primary hover:text-primary-foreground transition-colors shrink-0">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <TranslatedText fr="Ajouter" en="Add">Hinzufügen</TranslatedText>
              </Button>
            </div>
        </div>
    </div>
  );
}
