'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type BrowserSupabaseClient = SupabaseClient<Database>;

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
}

/**
 * Create a browser Supabase client.
 * Important: do NOT throw when env vars are missing, so the app can still render
 * (we show a friendly configuration message instead).
 */
export function createClient(): BrowserSupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabasePublicEnv();
  if (!isConfigured) return null;
  
  // Configuration pour garantir la persistance de session
  const authOptions: any = {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  };
  
  // Utiliser localStorage si disponible (client-side uniquement)
  if (typeof window !== 'undefined') {
    try {
      // Tester si localStorage est disponible
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      authOptions.storage = window.localStorage;
      authOptions.storageKey = 'sb-auth-token';
    } catch (e) {
      // localStorage non disponible (mode privé, restrictions, etc.)
      console.warn('localStorage not available, session may not persist:', e);
    }
  }
  
  return createBrowserClient<Database>(url, anonKey, {
    auth: authOptions,
  });
}











