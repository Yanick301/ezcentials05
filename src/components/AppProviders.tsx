
'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { SupabaseProvider } from '@/supabase';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <SupabaseProvider>
            <FavoritesProvider>
              <CartProvider>{children}</CartProvider>
            </FavoritesProvider>
          </SupabaseProvider>
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  );
}
