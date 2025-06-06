"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import type { Task } from '@/lib/types';

export function useTasks(patientId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = collection(db, 'tasks');
    const q = patientId
      ? query(base, where('patientId', '==', patientId), orderBy('dueDate', 'asc'))
      : query(base, orderBy('dueDate', 'asc'));

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Task[];
      setTasks(data);
      setLoading(false);
    });

    return () => unsub();
  }, [patientId]);

  return { tasks, loading };
}
