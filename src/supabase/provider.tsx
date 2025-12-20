'use client';

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { createClient, getSupabasePublicEnv, type BrowserSupabaseClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from './auth/use-user';
import type { Database } from '@/lib/supabase/database.types';

interface SupabaseContextState {
  supabase: BrowserSupabaseClient | null;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
  isSupabaseConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextState | undefined>(undefined);

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const supabase = useMemo(() => createClient(), []);
  const { isConfigured } = getSupabasePublicEnv();

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsUserLoading(false);
      const errorMsg = 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart.';
      console.error('Supabase Configuration Error:', errorMsg);
      setUserError(new Error(errorMsg));
      return;
    }

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Supabase Auth Error:', error);
        setUserError(error);
        setIsUserLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsUserLoading(false);
      setUserError(null);
    }).catch((err) => {
      console.error('Unexpected error getting session:', err);
      setUserError(err instanceof Error ? err : new Error('Une erreur inattendue s\'est produite'));
      setIsUserLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Charger le profil utilisateur quand l'utilisateur change
  useEffect(() => {
    if (!supabase) return;
    if (!user) {
      setProfile(null);
      return;
    }

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: any; error: any };

        if (error) {
          console.error('Error loading user profile:', error);
          setProfile(null);
          return;
        }

        if (data) {
          setProfile({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            photoURL: data.photo_url || undefined,
            isAdmin: data.is_admin || false,
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setProfile(null);
      }
    };

    loadProfile();

    // Écouter les changements du profil en temps réel
    const channel = supabase
      .channel(`user_profile:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const data = payload.new as Database['public']['Tables']['user_profiles']['Row'];
            setProfile({
              id: data.id,
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              photoURL: data.photo_url || undefined,
              isAdmin: data.is_admin || false,
            });
          } else if (payload.eventType === 'DELETE') {
            setProfile(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const value = useMemo(
    () => ({
      supabase,
      user,
      session,
      profile,
      isUserLoading,
      userError,
      isSupabaseConfigured: isConfigured,
    }),
    [supabase, user, session, profile, isUserLoading, userError, isConfigured]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}









