"use client";

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export function useAudit() {
  return async function log(action: string, details: Record<string, any> = {}) {
    await addDoc(collection(db, 'logs'), {
      action,
      timestamp: serverTimestamp(),
      ...details,
    });
  };
}
