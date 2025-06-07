"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export function usePatientAppointments(patientId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId),
      orderBy("dateTime", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Appointment[];
      setAppointments(data);
      setLoading(false);
    });
    return () => unsub();
  }, [patientId]);

  return { appointments, loading };
}
