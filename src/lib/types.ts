// 🔐 Papéis disponíveis no sistema
export type UserRole = "ADMIN" | "PSYCHOLOGIST" | "RECEPCAO" | "AGENDAMENTO";

// 🩺 Status possíveis de um agendamento
export type AttendanceStatus =
  | "pending"
  | "present"
  | "absent"
  | "rescheduled"
  | "canceled";

// 👤 Representação de um usuário (psicólogo ou administrativo)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  profileImage?: string;
}

// 📝 Nota de sessão (com histórico opcional usado para IA)
export interface SessionNote {
  id: string;
  date: string; // ISO 8601
  notes: string;
  patientHistorySummaryForAI?: string;
}

// 🧍 Paciente
export interface Patient {
  id: string;
  name: string;
  contact: string;
  cpf?: string;
  dateOfBirth: string; // ISO 8601
  sessionNotes: SessionNote[];
}

// 📅 Agendamento de sessão
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  contact?: string;
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

// 📑 Modelo reutilizável (anotação, email, plano de tratamento, etc.)
export type TemplateCategory = "session-note" | "email" | "treatment-plan";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  content: string;
}

// 📚 Artigo da base de conhecimento
export interface KnowledgeBaseArticle {
  id: string;
  question: string;
  answer: string;
}

// 💰 Registro financeiro simples
export interface FinanceRecord {
  id: string;
  date: string; // ISO 8601
  amount: number;
  description?: string;
}

// 💊 Medicamento de referência rápida
export interface Medication {
  id: string;
  name: string;
  class: string;
  indications: string;
  sideEffects: string;
}

// 📋 Metadados de um inventário/teste
export interface TestMeta {
  id: string;
  name: string;
  domain: string;
  numQuestions: number;
  instructions: string;
  scoringAlgorithm: string;
}

// 📊 Aplicação de inventário para um paciente
export interface Assessment {
  id: string;
  testId: string;
  status: "pending" | "completed" | "expired";
  linkToken: string;
  createdAt: string; // ISO 8601
  completedAt?: string;
}

// ✅ Resultado da aplicação
export interface AssessmentResult extends Assessment {
  score: number;
  subscores?: Record<string, number>;
  rawAnswers?: Record<string, unknown>;
}

// 🔄 Tipo utilitário: paciente parcial para formulários e updates
export type PartialPatient = Partial<Patient>;

// 🗒️ Tarefa profissional
export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "done";

export type TaskType = "session" | "report" | "admin";

export interface Task {
  id: string;
  patientId: string | null;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // ISO 8601
  status: TaskStatus;
  taskType: TaskType;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  createdBy: string;
}

// 📝 Registro de auditoria
export interface AuditLogEntry {
  id: string;
  action: string;
  userId?: string;
  timestamp: string; // ISO 8601 or Firestore timestamp string
  details?: string;
}

// 📊 Evento para a Linha do Tempo
export interface TimelineEvent {
  id: string;
  date: string; // ISO 8601
  title: string;
  description?: string;
}

// 🔥 Entrada para o Heatmap de Sintomas
export interface SymptomHeatmapEntry {
  id: string;
  patientId: string;
  date: string; // ISO 8601
  symptom: string;
  severity: number; // 1-5
}

// 🌳 Diagrama de Formulacao da Sessao
export interface FormulationDiagram {
  sessionId: string;
  diagramJson: string;
}

// 🚫 Horário bloqueado pontual
export interface BlockedTime {
  id: string;
  dateTime: string; // ISO 8601
  durationMinutes: number;
  reason?: string;
}

// 🔁 Bloqueio semanal recorrente
export interface WeeklyBlockedTime {
  id: string;
  weekday: number; // 0 (domingo) - 6 (sábado)
  start: string; // HH:MM
  end: string; // HH:MM
  reason?: string;
}
