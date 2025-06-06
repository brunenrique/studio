import { PatientDetailsClient } from '@/components/patients/PatientDetailsClient';
import { adminDb } from '@/lib/firebaseAdmin';
import type { PatientFullData, Patient, Session, Note, Payment, Document, TreatmentPlan } from '@/lib/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getPatientFullData(id: string): Promise<PatientFullData | null> {
  const patientRef = adminDb.collection('patients').doc(id);
  const [patientSnap, sessionsSnap, notesSnap, paymentsSnap, documentsSnap, plansSnap] = await Promise.all([
    patientRef.get(),
    patientRef.collection('sessions').get(),
    patientRef.collection('notes').get(),
    patientRef.collection('payments').get(),
    patientRef.collection('documents').get(),
    patientRef.collection('treatmentPlans').get(),
  ]);

  if (!patientSnap.exists) return null;

  return {
    patient: { id: patientSnap.id, ...(patientSnap.data() as Omit<Patient, 'id'>) },
    sessions: sessionsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Session)),
    notes: notesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Note)),
    payments: paymentsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Payment)),
    documents: documentsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Document)),
    treatmentPlans: plansSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as TreatmentPlan)),
  };
}

interface PatientDetailPageProps {
  params: { id: string };
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const data = await getPatientFullData(params.id);
  if (!data) return notFound();
  return <PatientDetailsClient data={data} />;
}
