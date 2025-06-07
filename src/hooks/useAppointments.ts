"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("dateTime", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Appointment[];
      setAppointments(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { appointments, loading };
}
