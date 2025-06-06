"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import type { AuditLogEntry } from '@/lib/types';

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as AuditLogEntry[];
      setLogs(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { logs, loading };
}
