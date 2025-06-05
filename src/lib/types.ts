// 🔐 Papéis disponíveis no sistema
export type UserRole = 'Admin Global' | 'Psicólogo' | 'Admin/Secretário';

// 👤 Representação de um usuário (psicólogo ou administrativo)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// 📝 Nota de sessão (com campo opcional para IA)
export interface SessionNote {
  id: string;
  date: string; // ISO
  notes: string;
  patientHistorySummaryForAI?: string;
}

// 🧍 Paciente
export interface Patient {
  id: string;
  name: string;
  contact: string;
  dateOfBirth: string; // ISO
  sessionNotes: SessionNote[];
}

// 📅 Agendamento de sessão
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string; // ISO
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'present' | 'missed';
  notes?: string;
}

// ⏳ Lista de espera
export interface WaitingListItem {
  id: string;
  patientName: string;
  contact: string;
  addedDate: string; // ISO
  requestedDate?: string;
  notes?: string;
}
