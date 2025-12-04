
'use client';

import { ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { CartSheetContent } from './CartSheetContent';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export function CartButton() {
  const { totalItems } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {hasMounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">
            <TranslatedText fr="Ouvrir le panier" en="Open Cart">
              Warenkorb öffnen
            </TranslatedText>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>
            <TranslatedText fr="Panier" en="Cart">
              Warenkorb
            </TranslatedText>
          </SheetTitle>
        </SheetHeader>
        <CartSheetContent />
      </SheetContent>
    </Sheet>
  );
}
