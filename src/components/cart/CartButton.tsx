
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
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
        <ErrorBoundary fallback={<CartErrorFallback />}>
          <CartSheetContent />
        </ErrorBoundary>
      </SheetContent>
    </Sheet>
  );
}

function CartErrorFallback() {
  const { clearCart } = useCart();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <ShoppingCart className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold">
        <TranslatedText fr="Erreur du panier" en="Cart Error">
          Warenkorbfehler
        </TranslatedText>
      </h3>
      <p className="text-sm text-muted-foreground">
        <TranslatedText
          fr="Une erreur est survenue lors du chargement de votre panier."
          en="An error occurred while loading your cart."
        >
          Beim Laden Ihres Warenkorbs ist ein Fehler aufgetreten.
        </TranslatedText>
      </p>
      <Button
        variant="destructive"
        onClick={() => {
          clearCart();
          window.location.reload();
        }}
      >
        <TranslatedText fr="Réinitialiser le panier" en="Reset Cart">
          Warenkorb zurücksetzen
        </TranslatedText>
      </Button>
    </div>
  );
}
