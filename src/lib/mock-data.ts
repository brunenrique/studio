
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
} from '@/lib/types';

// 👤 Usuário mock
export const mockUser: User = {
  id: 'user-psychologist-01',
  email: 'doctor.jane@psiguard.com',
  role: 'Psicólogo',
  name: 'Dr. Jane Doe',
};

// 📅 Datas auxiliares
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

// 📝 Notas mock – paciente 1
const initialSessionNotesP1: SessionNote[] = [
  {
    id: 'sn001',
    date: new Date(new Date().setDate(today.getDate() - 14)).toISOString(),
    notes: 'Paciente relatou ansiedade relacionada ao trabalho. Discutimos mecanismos de enfrentamento.',
    patientHistorySummaryForAI: 'Sessão inicial.',
  },
  {
    id: 'sn002',
    date: new Date(new Date().setDate(today.getDate() - 7)).toISOString(),
    notes: 'Acompanhamento da ansiedade. Paciente testou exercícios de respiração profunda. Relatou alguma melhora.',
    patientHistorySummaryForAI: 'Paciente relatou ansiedade relacionada ao trabalho. Discutimos mecanismos de enfrentamento.',
  },
];

// 📝 Notas mock – paciente 2
const initialSessionNotesP2: SessionNote[] = [
  {
    id: 'sn003',
    date: new Date(new Date().setDate(today.getDate() - 10)).toISOString(),
    notes: 'Paciente está enfrentando dificuldades com mudanças recentes na vida. Exploramos o impacto emocional.',
    patientHistorySummaryForAI: 'Novo paciente encaminhado com suspeita de transtorno de ajustamento.',
  },
];

// 👩‍⚕️ Pacientes mock
export let mockPatients: Patient[] = [
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

// --- Funções de criptografia mock ---
const encryptMock = (data: string): string =>
  data ? data.split('').reverse().join('') + '_encrypted' : '';

const decryptMock = (data: string): string =>
  data.endsWith('_encrypted') ? data.slice(0, -10).split('').reverse().join('') : data;

// 🔓 Retorna lista descriptografada
export const getMockPatientsList = (): Patient[] =>
  mockPatients.map((patient) => ({
    ...patient,
    name: decryptMock(patient.name),
    contact: decryptMock(patient.contact),
    dateOfBirth: decryptMock(patient.dateOfBirth),
  }));

// 🔒 Atualiza um paciente mock
export const updateMockPatient = (updatedPatient: Patient): Patient => {
  const index = mockPatients.findIndex((p) => p.id === updatedPatient.id);
  if (index === -1) {
    console.error(`Paciente com ID ${updatedPatient.id} não encontrado.`);
    return updatedPatient;
  }

  const encryptedPatient: Patient = {
    ...updatedPatient,
    name: encryptMock(updatedPatient.name),
    contact: encryptMock(updatedPatient.contact),
    dateOfBirth: encryptMock(updatedPatient.dateOfBirth),
  };

  mockPatients[index] = encryptedPatient;
  return updatedPatient;
};

// 🔍 Busca paciente pelo ID
export const getMockPatientById = (id: string): Patient | null => {
  const patient = mockPatients.find((p) => p.id === id);
  if (!patient) return null;
  return {
    ...patient,
    name: decryptMock(patient.name),
    contact: decryptMock(patient.contact),
    dateOfBirth: decryptMock(patient.dateOfBirth),
  };
};

// 📆 Agendamentos mock
export const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    patientId: 'patient-001',
    patientName: 'Alice Wonderland',
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
    durationMinutes: 50,
    status: 'pending',
    notes: 'Sessão regular',
  },
  {
    id: 'appt-002',
    patientId: 'patient-002',
    patientName: 'Bob The Builder',
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
    durationMinutes: 50,
    status: 'present',
    notes: 'Sessão de acompanhamento',
  },
  {
    id: 'appt-003',
    patientId: 'patient-003',
    patientName: 'Charlie Brown',
    dateTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 30).toISOString(),
    durationMinutes: 50,
    status: 'pending',
  },
  {
    id: 'appt-004',
    patientId: 'patient-001',
    patientName: 'Alice Wonderland',
    dateTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 9, 0).toISOString(),
    durationMinutes: 50,
    status: 'pending',
  },
];

// ⏳ Lista de espera mock
export const mockWaitingList: WaitingListItem[] = [
  {
    id: 'wait-001',
    patientName: 'Diana Prince',
    contact: 'diana@example.com',
    requestedDate: 'Qualquer tarde de dia útil',
    addedDate: yesterday.toISOString(),
    notes: 'Prefere terapeuta mulher, se possível (não aplicável no setup atual).',
  },
  {
    id: 'wait-002',
    patientName: 'Clark Kent',
    contact: 'clark@example.com',
    addedDate: new Date(today.setDate(today.getDate() - 3)).toISOString(),
    notes: 'Encaminhamento urgente do Dr. Hamilton.',
  },
];

// 💵 Registros financeiros mock
export const mockFinanceRecords: FinanceRecord[] = [
  {
    id: 'fin-001',
    date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    amount: 200,
    description: 'Sessão de terapia',
  },
  {
    id: 'fin-002',
    date: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
    amount: 180,
    description: 'Sessão de acompanhamento',
  },
  {
    id: 'fin-003',
    date: new Date(today.getFullYear(), today.getMonth(), 12).toISOString(),
    amount: 220,
    description: 'Sessão individual',
  },
  {
    id: 'fin-004',
    date: new Date(today.getFullYear(), today.getMonth() - 1, 25).toISOString(),
    amount: 200,
    description: 'Sessão do mês anterior',
  },
];

// 📑 Modelos de texto reutilizáveis
export const mockTemplates: Template[] = [
  {
    id: 'tpl-001',
    name: 'Nota de Sessão Padrão',
    category: 'session-note',
    content: 'Paciente apresentou progresso desde a última sessão...'
  },
  {
    id: 'tpl-002',
    name: 'Email de Lembrete',
    category: 'email',
    content: 'Olá {{nome}}, este é um lembrete do seu próximo agendamento...'
  }
];

// 📚 Artigos da base de conhecimento
export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: 'kb-001',
    question: 'Como adicionar um paciente?',
    answer: 'Vá para a página de pacientes e clique em "Adicionar Paciente".'
  },
  {
    id: 'kb-002',
    question: 'Posso personalizar as métricas do dashboard?',
    answer:
      'Sim, utilize a página de configurações para escolher quais métricas deseja ver.'
  },
  {
    id: 'kb-003',
    question: 'Os dados são criptografados?',
    answer:
      'Este protótipo usa criptografia apenas em campos selecionados. Veja a documentação para mais detalhes.'
  }
];

// 💊 Lista de medicamentos comuns para referência rápida
export const mockMedications: Medication[] = [
  {
    id: 'med-001',
    name: 'Sertralina',
    class: 'ISRS',
    indications: 'Depressão, transtorno de ansiedade',
    sideEffects: 'Náusea, insônia, boca seca'
  },
  {
    id: 'med-002',
    name: 'Fluoxetina',
    class: 'ISRS',
    indications: 'Depressão, transtorno obsessivo-compulsivo',
    sideEffects: 'Agitação, dor de cabeça, insônia'
  },
  {
    id: 'med-003',
    name: 'Bupropiona',
    class: 'Antidepressivo atípico',
    indications: 'Depressão maior, cessação do tabagismo',
    sideEffects: 'Boca seca, insônia, tremores'
  },
  {
    id: 'med-004',
    name: 'Clonazepam',
    class: 'Benzodiazepínico',
    indications: 'Transtorno de ansiedade, crises convulsivas',
    sideEffects: 'Sedação, tontura, dependência'
  }
];

export const mockSymptomEntries: SymptomHeatmapEntry[] = [
  { id: 'sym-001', patientId: 'patient-001', date: format(addDays(new Date(), -5), 'yyyy-MM-dd'), symptom: 'Ansiedade', severity: 3 },
  { id: 'sym-002', patientId: 'patient-001', date: format(addDays(new Date(), -4), 'yyyy-MM-dd'), symptom: 'Ansiedade', severity: 2 },
  { id: 'sym-003', patientId: 'patient-001', date: format(addDays(new Date(), -3), 'yyyy-MM-dd'), symptom: 'Ansiedade', severity: 4 },
  { id: 'sym-004', patientId: 'patient-001', date: format(addDays(new Date(), -2), 'yyyy-MM-dd'), symptom: 'Ansiedade', severity: 5 },
  { id: 'sym-005', patientId: 'patient-001', date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), symptom: 'Ansiedade', severity: 1 },
];
