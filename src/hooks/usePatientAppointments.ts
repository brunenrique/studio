"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export function usePatientAppointments(patientId: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId),
      orderBy("dateTime", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Appointment[];
      setAppointments(data);
      setLoading(false);
    });
    return () => unsub();
  }, [patientId]);

  return { appointments, loading };
}
