"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface HistoryEntry {
  id: string;
  action?: string;
  before?: any;
  after?: any;
  userId?: string;
  timestamp?: any;
}

export function useAppointmentHistory(appointmentId: string | null) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!appointmentId) return;
    const q = query(
      collection(db, "appointments", appointmentId, "history"),
      orderBy("timestamp", "desc"),
    );
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as HistoryEntry[];
      setHistory(data);
    });
    return () => unsub();
  }, [appointmentId]);

  return { history };
}
