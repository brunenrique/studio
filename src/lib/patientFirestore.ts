import { db } from './firebaseClient';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { Patient, UserRole } from './types';
import { encryptPatient, decryptPatient } from './patientCrypto';

export async function savePatient(patient: Patient): Promise<void> {
  const enc = encryptPatient(patient);
  await setDoc(doc(db, 'patients', patient.id), enc, { merge: true });
}

export async function fetchPatient(
  id: string,
  role: UserRole,
): Promise<Patient | null> {
  const snap = await getDoc(doc(db, 'patients', id));
  if (!snap.exists()) return null;
  const data = snap.data() as Patient;
  return role === 'PSYCHOLOGIST' ? decryptPatient(data) : data;
}
