
'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { FirebaseClientProvider } from '@/firebase';
import { FavoritesProvider } from '@/context/FavoritesContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}
