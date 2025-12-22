import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Crée un client Supabase avec la clé service role
 * Ce client bypass les politiques RLS et doit être utilisé uniquement dans les Server Actions
 * qui nécessitent des permissions élevées (comme la mise à jour de statut de commande)
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase admin environment variables. SUPABASE_SERVICE_ROLE_KEY is required.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}



