
'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TranslatedText } from '@/components/TranslatedText';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { DialogClose } from '@radix-ui/react-dialog';
import { findProductImage } from '@/lib/image-utils';
import { useLanguage } from '@/context/LanguageContext';
import type { Color } from '@/lib/types';


const SheetClose = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <DialogClose {...props} asChild>
    {children}
  </DialogClose>
);

export function CartSheetContent() {
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { language } = useLanguage();

  const getTranslatedColor = (color: string | undefined | Color) => {
    if (typeof color === 'object' && color !== null) {
      switch (language) {
        case 'fr':
          return color.name_fr;
        case 'en':
          return color.name_en;
        default:
          return color.name_de;
      }
    }
    return color;
  };


  if (totalItems === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
        <div
          aria-hidden="true"
          className="relative mb-4 h-24 w-24 text-muted-foreground"
        >
          <ShoppingBag className="h-full w-full" />
        </div>
        <div className="text-xl font-medium">
          <TranslatedText fr="Votre panier est vide" en="Your cart is empty">
            Ihr Warenkorb ist leer
          </TranslatedText>
        </div>
        <SheetClose>
          <Button asChild>
            <Link href="/products/all">
              <TranslatedText fr="Continuer les achats" en="Continue Shopping">
                Weiter einkaufen
              </TranslatedText>
            </Link>
          </Button>
        </SheetClose>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-grow pr-6">
        <div className="flex flex-col gap-6 py-4">
          {cartItems.map((item) => {
            const productImage = findProductImage(item.product.images[0]);
            const translatedColor = getTranslatedColor(item.color);
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={productImage.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/logo.png';
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">
                      <Link href={`/product/${item.product.slug}`} prefetch={true}>
                        <SheetClose>
                          <TranslatedText
                            fr={item.product.name_fr}
                            en={item.product.name_en}
                          >
                            {item.product.name}
                          </TranslatedText>
                        </SheetClose>
                      </Link>
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    €{item.product.price.toFixed(2)}
                  </p>
                  {(item.size || translatedColor) && (
                    <p className="text-xs text-muted-foreground">
                      {item.size} {item.size && translatedColor && ' / '}{' '}
                      {typeof translatedColor === 'string' ? translatedColor : (translatedColor && typeof translatedColor === 'object' ? translatedColor.name_de : '')}
                    </p>
                  )}
                  <div className="mt-2 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t px-6 py-4">
        <div className="flex justify-between text-base font-medium text-foreground">
          <p>
            <TranslatedText fr="Sous-total" en="Subtotal">
              Zwischensumme
            </TranslatedText>
          </p>
          <p>€{subtotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          <TranslatedText
            fr="Taxes et frais de port calculés à la caisse."
            en="Taxes and shipping calculated at checkout."
          >
            Steuern und Versand an der Kasse berechnet.
          </TranslatedText>
        </p>
        <div className="mt-6">
          <SheetClose>
            <Button asChild className="w-full">
              <Link href="/checkout">
                <TranslatedText fr="Passer à la caisse" en="Checkout">
                  Zur Kasse
                </TranslatedText>
              </Link>
            </Button>
          </SheetClose>
        </div>
      </div>
    </>
  );
}
