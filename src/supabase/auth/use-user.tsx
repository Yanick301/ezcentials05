'use client';

import { useSupabase } from '../provider';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
};

export interface UserHookResult {
  user: ReturnType<typeof useSupabase>['user'];
  profile: UserProfile | null;
  isUserLoading: boolean;
  error: Error | null;
}

export const useUser = (): UserHookResult => {
  const { user, profile, isUserLoading, userError } = useSupabase();

  return {
    user,
    profile,
    isUserLoading,
    error: userError,
  };
};

// Hook pour accéder à l'auth Supabase directement
export const useAuth = () => {
  const { supabase, user, session } = useSupabase();
  return {
    supabase,
    user,
    session,
    signOut: () => supabase.auth.signOut(),
  };
};









