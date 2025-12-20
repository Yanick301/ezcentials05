'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '../provider';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UseDocResult<T> {
  data: (T & { id: string }) | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook React pour s'abonner à un document Supabase en temps réel.
 * Remplace useDoc de Firestore.
 */
export function useDoc<T = any>(
  table: string | null | undefined,
  id: string | null | undefined
): UseDocResult<T> {
  const { supabase } = useSupabase();
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!table || !id) {
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
        const { data: docData, error: fetchError } = await supabase
          // `supabase.from()` is strongly typed to known table names when Database types are provided.
          // Our hook accepts a dynamic string, so we cast to keep flexibility.
          .from(table as any)
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          setError(fetchError);
          setData(null);
          setIsLoading(false);
          return;
        }

        if (docData) {
          const docWithId = { ...(docData as Record<string, any>), id: (docData as any).id } as T & { id: string };
          setData(docWithId);
        } else {
          setData(null);
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
      .channel(`${table}:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as any,
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as Record<string, any>;
            setData({ ...newData, id: newData.id } as T & { id: string });
          } else if (payload.eventType === 'DELETE') {
            setData(null);
          }
          setIsLoading(false);
          setError(null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, id, supabase]);

  return { data, isLoading, error };
}









