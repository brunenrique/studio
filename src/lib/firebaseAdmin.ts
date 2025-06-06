import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount as any) });

export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
