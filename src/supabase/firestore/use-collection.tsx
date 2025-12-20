'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSupabase } from '../provider';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UseCollectionResult<T> {
  data: (T & { id: string })[] | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UseCollectionOptions {
  filter?: (query: any) => any;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

/**
 * Hook React pour s'abonner à une collection Supabase en temps réel.
 * Remplace useCollection de Firestore.
 */
export function useCollection<T = any>(
  table: string | null | undefined,
  options?: UseCollectionOptions
): UseCollectionResult<T> {
  const { supabase } = useSupabase();
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!table) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Charger les données initiales
    const loadData = async () => {
      try {
        // `supabase.from()` is strongly typed to known table names when Database types are provided.
        // Our hook accepts a dynamic string, so we cast to keep flexibility.
        let query = supabase.from(table as any).select('*');

        // Appliquer les filtres si fournis
        if (options?.filter) {
          query = options.filter(query);
        }

        // Appliquer le tri si fourni
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true,
          });
        }

        // Appliquer la limite si fournie
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: collectionData, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError);
          setData(null);
          setIsLoading(false);
          return;
        }

        if (collectionData) {
          setData(collectionData.map((item: any) => ({ ...item, id: item.id })) as (T & { id: string })[]);
        } else {
          setData([]);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(null);
        setIsLoading(false);
      }
    };

    loadData();

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel(`${table}:changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as any,
        },
        (payload) => {
          // Recharger les données quand il y a un changement
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, supabase, JSON.stringify(options)]);

  return { data, isLoading, error };
}









