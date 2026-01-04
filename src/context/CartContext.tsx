'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import type { Product, CartItem } from '@/lib/types';
import { safeJsonParse, safeGetLocalStorage, safeSetLocalStorage, isLocalStorageAvailable } from '@/lib/security';
import { getProductPrice } from '@/lib/perfume-prices';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'ezcentials-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setIsInitialLoad(false);
      return;
    }

    const localData = safeGetLocalStorage(LOCAL_STORAGE_CART_KEY);
    if (localData) {
      const parsed = safeJsonParse<CartItem[]>(localData, []);
      // Filter out invalid items to prevent crashes
      const validItems = parsed.filter(item =>
        item &&
        item.id &&
        item.product &&
        item.product.id &&
        item.product.slug &&
        typeof item.product.price === 'number' &&
        item.product.name &&
        typeof item.quantity === 'number'
      );
      setCartItems(validItems);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad && isLocalStorageAvailable()) {
      // Double check validity before saving
      const validToSave = cartItems.filter(item => item && item.product && item.product.id);
      safeSetLocalStorage(LOCAL_STORAGE_CART_KEY, JSON.stringify(validToSave));
    }
  }, [cartItems, isInitialLoad]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'id'>) => {
      const { product, quantity, size, color } = item;
      // Create a unique ID for the cart item based on product and variants
      const itemId = `${product.id}${size ? `-${size}` : ''}${color ? `-${color}` : ''
        }`;

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === itemId);

        if (existingItem) {
          // If item already exists, update its quantity
          return prevItems.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          // Otherwise, add the new item to the cart
          return [...prevItems, { id: itemId, ...item }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => {
      const price = getProductPrice(item.product, item.size);
      return sum + (typeof price === 'number' && !isNaN(price) ? price : 0) * item.quantity;
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
