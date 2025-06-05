import type { Patient, Appointment, WaitingListItem, User, SessionNote } from './types';

export const mockUser: User = {
  id: 'user-psychologist-01',
  email: 'doctor.jane@psiguard.com',
  role: 'psychologist',
  name: 'Dr. Jane Doe',
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);


const initialSessionNotesP1: SessionNote[] = [
  { id: 'sn001', date: new Date(new Date().setDate(today.getDate() - 14)).toISOString(), notes: 'Patient reported feeling anxious about work. Discussed coping mechanisms.', patientHistorySummaryForAI: 'Initial session.' },
  { id: 'sn002', date: new Date(new Date().setDate(today.getDate() - 7)).toISOString(), notes: 'Follow-up on anxiety. Patient tried deep breathing exercises. Some improvement noted.', patientHistorySummaryForAI: 'Patient reported feeling anxious about work. Discussed coping mechanisms.' },
];

const initialSessionNotesP2: SessionNote[] = [
  { id: 'sn003', date: new Date(new Date().setDate(today.getDate() - 10)).toISOString(), notes: 'Patient is struggling with recent life changes. Explored emotional impact.', patientHistorySummaryForAI: 'New patient referred for adjustment disorder.'},
];


const mockPatients: Patient[] = [
  {
    id: 'patient-001',
    name: 'Alice Wonderland',
    contact: 'alice@example.com',
    dateOfBirth: '1990-05-15',
    sessionNotes: initialSessionNotesP1,
  },
  {
    id: 'patient-002',
    name: 'Bob The Builder',
    contact: 'bob@example.com',
    dateOfBirth: '1985-11-20',
    sessionNotes: initialSessionNotesP2,
  },
  {
    id: 'patient-003',
    name: 'Charlie Brown',
    contact: 'charlie@example.com',
    dateOfBirth: '2000-02-10',
    sessionNotes: [],
  },
];

// Mock encryption and decryption functions
const ENCRYPTION_PREFIX = "ENCRYPTED:";

function encryptMock(data: string): string {
  if (data.startsWith(ENCRYPTION_PREFIX)) {
    return data; // Already encrypted (mock)
  }
  return `${ENCRYPTION_PREFIX}${data}`;
}

function decryptMock(data: string): string {
  if (data.startsWith(ENCRYPTION_PREFIX)) {
    return data.substring(ENCRYPTION_PREFIX.length);
  }
  return data; // Not encrypted (mock)
}

export function getMockPatientById(id: string): Patient | undefined {
  const patient = mockPatients.find(p => p.id === id);
  if (!patient) return undefined;
  // Return a deep copy with decrypted fields
  return { ...patient, name: decryptMock(patient.name), dateOfBirth: decryptMock(patient.dateOfBirth), contact: decryptMock(patient.contact) };
}
export const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    patientId: 'patient-001',
    patientName: 'Alice Wonderland',
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0).toISOString(),
    durationMinutes: 50,
    status: 'pending',
    notes: 'Regular session',
  },
  {
    id: 'appt-002',
    patientId: 'patient-002',
    patientName: 'Bob The Builder',
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0).toISOString(),
    durationMinutes: 50,
    status: 'present',
    notes: 'Follow-up',
  },
  {
    id: 'appt-003',
    patientId: 'patient-003',
    patientName: 'Charlie Brown',
    dateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 30, 0).toISOString(),
    durationMinutes: 50,
    status: 'pending',
  },
   {
    id: 'appt-004',
    patientId: 'patient-001',
    patientName: 'Alice Wonderland',
    dateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 9, 0, 0).toISOString(),
    durationMinutes: 50,
    status: 'pending',
  },
];

export const mockWaitingList: WaitingListItem[] = [
  {
    id: 'wait-001',
    patientName: 'Diana Prince',
    contact: 'diana@example.com',
    requestedDate: 'Any weekday afternoon',
    addedDate: yesterday.toISOString(),
    notes: 'Prefers female therapist if possible (N/A for single psychologist setup)',
  },
  {
    id: 'wait-002',
    patientName: 'Clark Kent',
    contact: 'clark@example.com',
    addedDate: new Date(new Date().setDate(today.getDate() - 3)).toISOString(),
    notes: 'Urgent, referred by Dr. Hamilton',
  },
];

// Function to get the list of mock patients with decrypted sensitive fields
export function getMockPatientsList(): Patient[] {
 return mockPatients.map(patient => ({
 ...patient,
    name: decryptMock(patient.name),
    dateOfBirth: decryptMock(patient.dateOfBirth),
    contact: decryptMock(patient.contact),
 }));
}

