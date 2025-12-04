
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
};

export interface UserHookResult {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  error: Error | null;
}

export const useUser = (): UserHookResult => {
  const { auth, firestore, isUserLoading: isAuthLoading } = useFirebase();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      setIsProfileLoading(true);
      return;
    }
    
    if (!user || !firestore) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    const userProfileRef = doc(firestore, 'userProfiles', user.uid);
    
    const unsubscribeProfile = onSnapshot(userProfileRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...(docSnap.data() as Omit<UserProfile, 'id'>) });
      } else {
        console.warn(`No profile document found for user ${user.uid}`);
        setProfile(null);
      }
      setIsProfileLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching user profile:", err);
      setError(err);
      setProfile(null);
      setIsProfileLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, firestore, isAuthLoading]);

  const isTotalLoading = isAuthLoading || (!!user && isProfileLoading);

  return { user, profile, isUserLoading: isTotalLoading, error };
};
