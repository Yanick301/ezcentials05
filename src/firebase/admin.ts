
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// IMPORTANT: DO NOT MODIFY THIS FILE

// This file is the single source of truth for initializing the Firebase Admin SDK.
// It is a server-only module.
// It safely handles initialization to prevent re-initializing the app.

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return {
      app: getApps()[0],
      auth: getAuth(),
      firestore: getFirestore(),
    };
  }

  const app = initializeApp({
    // Use service account credentials if available (recommended for most server environments)
    // Otherwise, rely on Application Default Credentials (e.g., on Google Cloud Run)
    credential: SERVICE_ACCOUNT ? cert(SERVICE_ACCOUNT) : undefined,
    // Provide the projectId to ensure the correct database is connected,
    // especially in local development or when credentials don't explicitly specify it.
    projectId: firebaseConfig.projectId,
  });

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export { getFirebaseAdmin };
