import useSWR from 'swr';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseClient';

async function fetchFlag(flag: string) {
  const snap = await getDoc(doc(db, 'featureFlags', flag));
  return snap.exists() ? snap.data().enabled : false;
}

export function useFeatureFlag(flag: string) {
  const { data } = useSWR(flag, fetchFlag, { revalidateOnFocus: false });
  return data;
}
