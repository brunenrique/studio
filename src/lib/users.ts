import { adminDb } from '@/lib/firebaseAdmin';
import type { User } from '@/lib/types';

export async function getUsers(): Promise<User[]> {
  const snap = await adminDb.collection('users').get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<User, 'id'>) }));
}
