import type {
  Patient,
  Appointment,
  WaitingListItem,
  User,
  Note,
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
const initialSessionNotesP1: Note[] = [
  {
    id: 'sn001',
    date: new Date(new Date().setDate(today.getDate() - 14)).toISOString(),
    content: 'Paciente relatou ansiedade relacionada ao trabalho. Discutimos mecanismos de enfrentamento.',
    patientHistorySummaryForAI: 'Sessão inicial.',
  },
  {
    id: 'sn002',
    date: new Date(new Date().setDate(today.getDate() - 7)).toISOString(),
    content: 'Acompanhamento da ansiedade. Paciente testou exercícios de respiração profunda. Relatou alguma melhora.',
    patientHistorySummaryForAI: 'Paciente relatou ansiedade relacionada ao trabalho. Discutimos mecanismos de enfrentamento.',
  },
];

// 📝 Notas mock – paciente 2
const initialSessionNotesP2: Note[] = [
  {
    id: 'sn003',
    date: new Date(new Date().setDate(today.getDate() - 10)).toISOString(),
    content: 'Paciente está enfrentando dificuldades com mudanças recentes na vida. Exploramos o impacto emocional.',
    patientHistorySummaryForAI: 'Novo paciente encaminhado com suspeita de transtorno de ajustamento.',
  },
];

// 👩‍⚕️ Pacientes mock
export let mockPatients: Patient[] = [
  {
    id: 'patient-001',
    name: 'Alice Wonderland',
    contact: 'alice@example.com',
    secondaryContact: '(11) 99999-1111',
    email: 'alice@wonderland.com',
    gender: 'Feminino',
    profession: 'Engenheira',
    address: 'Rua das Flores, 123',
    emergencyContact: 'Mãe - (11) 88888-0000',
    allergies: 'Nenhuma conhecida',
    medications: 'N/A',
    familyHistory: 'Histórico de ansiedade na família',
    chiefComplaint: 'Ansiedade no trabalho',
    habits: 'Não fuma, bebe socialmente',
    status: 'ativo',
    treatmentPlan: 'Terapia Cognitivo-Comportamental',
    evolution: 'Melhora gradual',
    balanceDue: 200,
    payments: [
      { id: 'pay-001', date: new Date().toISOString(), amount: 300, method: 'Pix' }
    ],
    dateOfBirth: '1990-05-15',
    sessionNotes: initialSessionNotesP1,
  },
  {
    id: 'patient-002',
    name: 'Bob The Builder',
    contact: 'bob@example.com',
    secondaryContact: '(21) 99999-2222',
    email: 'bob@builder.com',
    gender: 'Masculino',
    profession: 'Arquiteto',
    address: 'Avenida Central, 45',
    emergencyContact: 'Esposa - (21) 77777-0000',
    allergies: 'Penicilina',
    medications: 'Antialérgico',
    familyHistory: 'Pai hipertenso',
    chiefComplaint: 'Dificuldade de adaptação',
    habits: 'Fumante leve',
    status: 'ativo',
    treatmentPlan: 'Psicoterapia breve',
    evolution: 'Em acompanhamento',
    balanceDue: 0,
    payments: [
      { id: 'pay-002', date: new Date().toISOString(), amount: 500, method: 'Cartão' }
    ],
    dateOfBirth: '1985-11-20',
    sessionNotes: initialSessionNotesP2,
  },
  {
    id: 'patient-003',
    name: 'Charlie Brown',
    contact: 'charlie@example.com',
    secondaryContact: '(31) 99999-3333',
    email: 'charlie@brown.com',
    gender: 'Masculino',
    profession: 'Estudante',
    address: 'Praça Principal, 10',
    emergencyContact: 'Pai - (31) 66666-0000',
    allergies: 'Glúten',
    medications: 'N/A',
    familyHistory: 'Mãe com depressão',
    chiefComplaint: 'Baixa autoestima',
    habits: 'Atividade física regular',
    status: 'ativo',
    treatmentPlan: 'Psicoterapia contínua',
    evolution: 'Em progresso',
    balanceDue: 150,
    payments: [],
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
