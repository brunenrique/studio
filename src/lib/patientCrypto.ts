import type { Patient, SessionNote } from "./types";
import { encrypt, decrypt } from "./utils";

function encNote(note: SessionNote): SessionNote {
  return { ...note, notes: encrypt(note.notes) };
}

function decNote(note: SessionNote): SessionNote {
  return { ...note, notes: decrypt(note.notes) };
}

export function encryptPatient(patient: Patient): Patient {
  return {
    ...patient,
    psychologistId: patient.psychologistId,
    name: encrypt(patient.name),
    contact: encrypt(patient.contact),
    cpf: patient.cpf ? encrypt(patient.cpf) : undefined,
    dateOfBirth: encrypt(patient.dateOfBirth),
    sessionNotes: patient.sessionNotes.map(encNote),
  };
}

export function decryptPatient(patient: Patient): Patient {
  return {
    ...patient,
    psychologistId: patient.psychologistId,
    name: decrypt(patient.name),
    contact: decrypt(patient.contact),
    cpf: patient.cpf ? decrypt(patient.cpf) : undefined,
    dateOfBirth: decrypt(patient.dateOfBirth),
    sessionNotes: patient.sessionNotes.map(decNote),
  };
}

export function decryptPatientForRole(
  patient: Patient,
  role: import("./types").UserRole,
): Patient {
  if (role !== "PSYCHOLOGIST") return patient;
  return decryptPatient(patient);
}
