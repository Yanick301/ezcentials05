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
  return createBrowserClient<Database>(url, anonKey);
}











