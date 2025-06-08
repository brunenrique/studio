/* istanbul ignore file */
import { format, addDays } from "date-fns";
import type {
  Patient,
  Appointment,
  WaitingListItem,
  User,
  SessionNote,
  Template,
  KnowledgeBaseArticle,
  FinanceRecord,
  Medication,
  SymptomHeatmapEntry,
  FormulationDiagram,
  Task,
} from "@/lib/types";
// Importa as funções de utilidade do nosso novo arquivo central
import { encryptPatientObject, decryptPatientObject } from "./patient-utils";

// ============================================================================
// DADOS MOCADOS
// ============================================================================

// 👤 Usuário mock
export const mockUser: User = {
  id: "user-psychologist-01",
  email: "doctor.jane@psiguard.com",
  role: "PSYCHOLOGIST",
  isApproved: true,
  name: "Dr. Jane Doe",
  profileImage: "https://placehold.co/100x100?text=JD",
};

// 📅 Datas auxiliares
const today = new Date();
const tomorrow = addDays(today, 1);
const yesterday = addDays(today, -1);
const nextWeek = addDays(today, 7);

// 📝 Notas mock (definidas antes para serem usadas na criação dos pacientes)
const initialSessionNotesP1: SessionNote[] = [
  { id: "sn001", date: addDays(today, -14).toISOString(), notes: "Paciente relatou ansiedade.", patientHistorySummaryForAI: "Sessão inicial." },
  { id: "sn002", date: addDays(today, -7).toISOString(), notes: "Acompanhamento da ansiedade.", patientHistorySummaryForAI: "Paciente relatou ansiedade." },
];
const initialSessionNotesP2: SessionNote[] = [
  { id: "sn003", date: addDays(today, -10).toISOString(), notes: "Dificuldades com mudanças recentes.", patientHistorySummaryForAI: "Novo paciente." },
];
const initialSessionNotesP3: SessionNote[] = [
  { id: "sn004", date: addDays(today, -21).toISOString(), notes: "Queixas de dores de cabeça.", patientHistorySummaryForAI: "Referenciado por clínico." },
  { id: "sn005", date: addDays(today, -5).toISOString(), notes: "Melhora com meditação.", patientHistorySummaryForAI: "Queixas de dores de cabeça." },
];

// 👩‍⚕️ Pacientes mock
// A lista é criada com dados limpos e depois criptografada com a função importada.
export let mockPatients: Patient[] = [
  {
    id: "patient-001", name: "Alice Wonderland", contact: "11999990001", cpf: "12345678901", dateOfBirth: "1990-05-15",
    sessionNotes: initialSessionNotesP1, treatmentPlan: "Reduzir episódios de ansiedade.", psychologistId: mockUser.id,
    notificationsOptOut: { email: false, sms: false },
  },
  {
    id: "patient-002", name: "Bob The Builder", contact: "11999990002", cpf: "98765432100", dateOfBirth: "1985-11-20",
    sessionNotes: initialSessionNotesP2, treatmentPlan: "Melhorar habilidades de enfrentamento.", psychologistId: mockUser.id,
    notificationsOptOut: { email: false, sms: false },
  },
  // Adicione outros pacientes aqui se desejar
].map(encryptPatientObject);

// ============================================================================
// FUNÇÕES DE UTILIDADE EXPORTADAS (que usam os dados mocados)
// ============================================================================

export const getMockPatientsList = (): Patient[] => mockPatients.map(decryptPatientObject);

export const updateMockPatient = (updatedPatient: Patient): void => {
  const index = mockPatients.findIndex((p) => p.id === updatedPatient.id);
  if (index > -1) {
    mockPatients[index] = encryptPatientObject(updatedPatient);
  } else {
    console.error(`Paciente com ID ${updatedPatient.id} não encontrado para atualização.`);
  }
};

export const getMockPatientById = (id: string): Patient | null => {
  const encryptedPatient = mockPatients.find((p) => p.id === id);
  if (!encryptedPatient) return null;
  return decryptPatientObject(encryptedPatient);
};

// NOTA: As variáveis abaixo não estão definidas e foram removidas
// das exportações para evitar erros. Se você precisar delas,
// deverá recriar os dados mocados correspondentes.
// export const mockAppointments = [];
// export const mockWaitingList = [];
// export const mockFinanceRecords = [];
// etc...