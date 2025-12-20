
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import { safeJsonParse, safeGetLocalStorage, safeSetLocalStorage, isLocalStorageAvailable } from '@/lib/security';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  isFavoritesLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_FAVORITES_KEY = 'ezcentials-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial favorites from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setIsLoading(false);
      return;
    }
    
    const localData = safeGetLocalStorage(LOCAL_STORAGE_FAVORITES_KEY);
    if (localData) {
      const parsed = safeJsonParse<string[]>(localData, []);
      setFavorites(parsed);
    }
    setIsLoading(false);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && isLocalStorageAvailable()) {
      safeSetLocalStorage(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((currentFavorites) => {
      const isCurrentlyFavorite = currentFavorites.includes(productId);
      if (isCurrentlyFavorite) {
        return currentFavorites.filter((id) => id !== productId);
      } else {
        return [...currentFavorites, productId];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isFavoritesLoading: isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
