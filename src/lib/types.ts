// 🔐 Papéis disponíveis no sistema
export type UserRole = 'Admin Global' | 'Psicólogo' | 'Admin/Secretário';

// 🩺 Status possíveis de um agendamento
export type AttendanceStatus = 'pending' | 'present' | 'absent' | 'rescheduled';

// 👤 Representação de um usuário (psicólogo ou administrativo)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// 📝 Nota de sessão (com histórico opcional usado para IA)
export interface SessionNote {
  id: string;
  date: string; // ISO 8601
  notes: string;
  patientHistorySummaryForAI?: string;
}

// 💳 Pagamento relacionado a um paciente
export interface Payment {
  id: string;
  date: string; // ISO 8601
  amount: number;
  method?: string;
}

// 🧍 Paciente
export interface Patient {
  id: string;
  name: string;
  contact: string;
  dateOfBirth: string; // ISO 8601
  sessionNotes: SessionNote[];
  gender?: string;
  profession?: string;
  address?: string;
  secondaryContact?: string;
  email?: string;
  emergencyContact?: string;
  allergies?: string;
  medications?: string;
  familyHistory?: string;
  chiefComplaint?: string;
  habits?: string;
  status?: string;
  treatmentPlan?: string;
  evolution?: string;
  balanceDue?: number;
  payments?: Payment[];
}

// 📅 Agendamento de sessão
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string; // ISO 8601
  durationMinutes: number;
  status: AttendanceStatus;
  notes?: string;
}

// ⏳ Entrada da lista de espera
export interface WaitingListItem {
  id: string;
  patientName: string;
  contact: string;
  addedDate: string; // ISO 8601
  requestedDate?: string;
  notes?: string;
}

// 🔄 Tipo utilitário: paciente parcial para formulários e updates
export type PartialPatient = Partial<Patient>;
