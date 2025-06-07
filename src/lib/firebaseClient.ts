import { FirebaseError, FirebaseApp, initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(
      `Firebase config missing for ${key}. Check your NEXT_PUBLIC_FIREBASE_* env vars.`
    );
  }
});

let app: FirebaseApp;
try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
} catch (err) {
  const error = err as FirebaseError;
  console.error('Firebase initialization error:', error.code || error.message);
  throw err;
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (typeof window !== 'undefined') {
  const updateNetwork = async () => {
    if (navigator.onLine) {
      try {
        await enableNetwork(db);
        console.info('Firebase network enabled');
      } catch (err) {
        console.error('Failed to enable Firebase network', err);
      }
    } else {
      try {
        await disableNetwork(db);
        console.warn('Network unavailable, using offline Firestore');
      } catch (err) {
        console.error('Failed to disable Firebase network', err);
      }
    }
  };

  window.addEventListener('online', updateNetwork);
  window.addEventListener('offline', updateNetwork);
  updateNetwork();
}
