
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length === 0) {
    // Always initialize with the config object.
    // This is safe for all environments, including Firebase App Hosting.
    // App Hosting will override these values with environment variables if present.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}

// Explicitly export from each module to avoid conflicts
export {
  FirebaseProvider,
  useFirebase,
  useAuth,
  useFirestore,
  useStorage,
  useFirebaseApp,
  useMemoFirebase,
} from './provider';

export type { FirebaseContextState, FirebaseServicesAndUser } from './provider';

export { FirebaseClientProvider } from './client-provider';

export { useCollection } from './firestore/use-collection';
export type { UseCollectionResult } from './firestore/use-collection';

export { useDoc } from './firestore/use-doc';
export type { UseDocResult } from './firestore/use-doc';

export { useUser } from './auth/use-user';
export type { UserProfile, UserHookResult } from './auth/use-user';

export type { WithId } from './firestore/types';

export { FirestorePermissionError } from './errors';
export { errorEmitter, type AppEvents } from './error-emitter';
