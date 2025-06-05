export type UserRole = 'Admin Global' | 'Psicólogo' | 'Admin/Secretário';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface SessionNote {
  id: string;
  date: string; // ISO string
  notes: string;
  // For AI analysis, this could be more structured in a real app
  patientHistorySummaryForAI?: string; 
}

export interface Patient {
  id: string;
  name: string;
  contact: string; // e.g., phone or email
  dateOfBirth: string; // ISO string
  // Sensitive fields like 'address' or 'detailedMedicalHistory' would need encryption.
  // For scaffolding, we'll keep it simple.
  sessionNotes: SessionNote[];
  // Placeholder for where encrypted data might be stored or handled
  // encryptedMedicalHistory?: string; 
}

export type AttendanceStatus = 'present' | 'absent' | 'rescheduled' | 'pending';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Denormalized for easier display
  dateTime: string; // ISO string
  durationMinutes: number;
  status: AttendanceStatus;
  notes?: string; // Brief notes about the appointment itself, not session notes
}

export interface WaitingListItem {
  id: string;
  patientName: string;
  contact: string;
  requestedDate?: string; // ISO string or general preference
  addedDate: string; // ISO string
  notes?: string;
}

export interface AIInsight {
  id: string;
  timestamp: string; // ISO string
  insightText: string;
}
