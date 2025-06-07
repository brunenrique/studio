export interface Feature {
  category: string;
  label: string;
  description: string;
  href: string;
}

export const features: Feature[] = [
  {
    category: 'Sessões',
    label: 'Agenda de Consultas',
    description: 'Gerencie seus horários e crie novas sessões.',
    href: '/appointments',
  },
  {
    category: 'Sessões',
    label: 'Lista de Espera',
    description: 'Acompanhe pacientes aguardando vagas.',
    href: '/waiting-list',
  },
  {
    category: 'Pacientes',
    label: 'Cadastro de Pacientes',
    description: 'Registre dados clínicos e histórico completo.',
    href: '/patients',
  },
  {
    category: 'Pacientes',
    label: 'Biblioteca de Inventários',
    description: 'Aplique avaliações e registre resultados.',
    href: '/assessments/library',
  },
  {
    category: 'Relatórios',
    label: 'Painel Analítico',
    description: 'Visualize métricas e evolução dos atendimentos.',
    href: '/analytics',
  },
  {
    category: 'Relatórios',
    label: 'Indicadores do Psicólogo',
    description: 'Dados de desempenho individual.',
    href: '/analytics/psychologist',
  },
  {
    category: 'Integrações',
    label: 'Exportação de Agenda',
    description: 'Sincronize compromissos com calendários externos.',
    href: '/settings',
  },
  {
    category: 'Configurações',
    label: 'Preferências do Sistema',
    description: 'Defina horários e opções globais.',
    href: '/settings',
  },
  {
    category: 'Segurança',
    label: 'Gerenciamento de Usuários',
    description: 'Aprovação e controle de permissões.',
    href: '/user-approvals',
  },
  {
    category: 'Segurança',
    label: 'Criptografia de Dados',
    description: 'Protege informações sensíveis dos pacientes.',
    href: '/dashboard',
  },
];
