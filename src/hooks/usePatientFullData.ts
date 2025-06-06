"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';
import type { PatientFullData, Patient, Session, Note, Payment, Document, TreatmentPlan } from '@/lib/types';

async function fetchPatientFullData(id: string): Promise<PatientFullData | null> {
  const patientRef = doc(db, 'patients', id);
  const patientSnap = await getDoc(patientRef);
  if (!patientSnap.exists()) return null;

  const [sessionsSnap, notesSnap, paymentsSnap, documentsSnap, plansSnap] = await Promise.all([
    getDocs(collection(patientRef, 'sessions')),
    getDocs(collection(patientRef, 'notes')),
    getDocs(collection(patientRef, 'payments')),
    getDocs(collection(patientRef, 'documents')),
    getDocs(collection(patientRef, 'treatmentPlans')),
  ]);

  return {
    patient: { id: patientSnap.id, ...(patientSnap.data() as Omit<Patient, 'id'>) },
    sessions: sessionsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Session)),
    notes: notesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Note)),
    payments: paymentsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Payment)),
    documents: documentsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Document)),
    treatmentPlans: plansSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as TreatmentPlan)),
  };
}

export function usePatientFullData(patientId: string) {
  const [data, setData] = useState<PatientFullData | null>(null);

  useEffect(() => {
    fetchPatientFullData(patientId).then(setData);
  }, [patientId]);

  return data;
}
