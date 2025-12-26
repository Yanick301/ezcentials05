
'use client';

import { Product } from '@/lib/types';
import { Button } from './ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { TranslatedText } from './TranslatedText';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

export function ProductCardActions({ product }: { product: Product }) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive current URL with search params
  const currentUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = searchParams.toString();
    return pathname + (params ? `?${params}` : '');
  }, [pathname, searchParams]);

  // Derive category slug from path if present
  const derivedCategorySlug = useMemo(() => {
    if (!pathname) return null;
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'products' && parts[1]) return parts[1];
    return null;
  }, [pathname]);

  // Store URL + state on click
  const handleProductClick = useCallback(() => {
    if (typeof window === 'undefined') return;
    // Store URL
    if (currentUrl) {
      sessionStorage.setItem('productReturnUrl', currentUrl);
    }
    // Store minimal state including category and scroll
    const scrollPosition = window.scrollY || window.pageYOffset;
    const minimalState = {
      url: currentUrl,
      returnProductId: product.id,
      returnScroll: scrollPosition,
      categorySlug: derivedCategorySlug,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('productReturnState', JSON.stringify(minimalState));
  }, [currentUrl, derivedCategorySlug, product.id]);

  const getTranslatedName = () => {
    if (language === 'fr') return product.name_fr;
    if (language === 'en') return product.name_en;
    return product.name;
  };

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
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-full border bg-background/80 p-1.5 backdrop-blur-sm">
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted" onClick={handleAddToCart}>
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
        <Link 
          href={`/product/${product.slug}${currentUrl ? `?returnUrl=${encodeURIComponent(currentUrl)}` : ''}`} 
          prefetch={true}
          onClick={handleProductClick}
        >
            <Eye className="h-5 w-5 text-muted-foreground" />
        </Link>
      </Button>
    </div>
  );
}
