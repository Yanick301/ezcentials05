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
      setCartItems(parsed);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad && isLocalStorageAvailable()) {
      safeSetLocalStorage(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialLoad]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'id'>) => {
      const { product, quantity, size, color } = item;
      // Create a unique ID for the cart item based on product and variants
      const itemId = `${product.id}${size ? `-${size}` : ''}${
        color ? `-${color}` : ''
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
    (sum, item) => sum + item.product.price * item.quantity,
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
