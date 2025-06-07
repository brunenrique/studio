import {
  Home,
  Calendar,
  Users,
  DollarSign,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  description: string;
  href: string;
  category: string;
};

export type NavRole = "psychologist" | "admin" | "all";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  role: NavRole;
}

export interface TabItem {
  label: string;
  href: string;
}

export interface RouteTabConfig {
  pattern: RegExp;
  getTabs: (params: Record<string, string>) => TabItem[];
}

export interface FeatureItem {
  label: string;
  description: string;
  href: string;
  category: "Atendimento" | "Administração" | "Ferramentas Extras";
}

export const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    description: 'Vis\u00e3o geral r\u00e1pida das m\u00e9tricas e atividades recentes.',
    href: '/dashboard',
    category: 'Consult\u00f3rio',
  },
  {
    label: 'Pacientes',
    description: 'Gerencie registros, dados e hist\u00f3rico de atendimentos.',
    href: '/patients',
    category: 'Consult\u00f3rio',
  },
  {
    label: 'Agendamentos',
    description: 'Controle e organize consultas na agenda.',
    href: '/appointments',
    category: 'Consult\u00f3rio',
  },
  {
    label: 'Lista de Espera',
    description: 'Acompanhe pacientes aguardando vagas dispon\u00edveis.',
    href: '/waiting-list',
    category: 'Consult\u00f3rio',
  },
  {
    label: 'Modelos',
    description: 'Modelos de documentos e prescri\u00e7\u00f5es para agilizar atendimento.',
    href: '/templates',
    category: 'Ferramentas',
  },
  {
    label: 'Guia R\u00e1pido',
    description: 'Refer\u00eancia r\u00e1pida de medicamentos e dosagens.',
    href: '/medications',
    category: 'Ferramentas',
  },
  {
    label: 'Sa\u00fade Mental',
    description: 'Ferramentas e dicas para autocuidado e bem-estar.',
    href: '/self-care',
    category: 'Ferramentas',
  },
  {
    label: 'Base de Conhecimento',
    description: 'Artigos e materiais de apoio para profissionais.',
    href: '/knowledge-base',
    category: 'Ferramentas',
  },
  {
    label: 'Tend\u00eancias',
    description: 'Gr\u00e1ficos e estat\u00edsticas de uso do sistema.',
    href: '/analytics',
    category: 'Ferramentas',
  },
  {
    label: 'Indicadores',
    description: 'M\u00e9tricas espec\u00edficas para avalia\u00e7\u00e3o de psic\u00f3logos.',
    href: '/analytics/psychologist',
    category: 'Ferramentas',
  },
  {
    label: 'Configura\u00e7\u00f5es',
    description: 'Personalize prefer\u00eancias e integra\u00e7\u00f5es do sistema.',
    href: '/settings',
    category: 'Sistema',
  },
  {
    label: 'Aprovar Usu\u00e1rios',
    description: 'Gerencie solicita\u00e7\u00f5es de acesso de novos profissionais.',
    href: '/user-approvals',
    category: 'Sistema',
  },
];

export const sidebarItems: SidebarItem[] = [
  { label: 'In\u00edcio', href: '/', icon: Home, role: 'all' },
  { label: 'Agenda', href: '/appointments', icon: Calendar, role: 'psychologist' },
  { label: 'Pacientes', href: '/patients', icon: Users, role: 'psychologist' },
  { label: 'Financeiro', href: '/finance', icon: DollarSign, role: 'admin' },
  { label: 'Configura\u00e7\u00f5es', href: '/settings', icon: Settings, role: 'all' },
];

export const routeTabs: RouteTabConfig[] = [
  {
    pattern: /^\/patients\/([^/]+)/,
    getTabs: ({ id }) => [
      { label: 'Ficha', href: `/patients/${id}` },
      { label: 'Notas', href: `/patients/${id}/notes` },
      { label: 'Relat\u00f3rios', href: `/patients/${id}/reports` },
      { label: 'Mensura\u00e7\u00f5es', href: `/patients/${id}/metrics` },
      { label: 'AI Insights', href: `/patients/${id}/ai` },
    ],
  },
  {
    pattern: /^\/appointments/,
    getTabs: () => [
      { label: 'Semanal', href: '/appointments' },
      { label: 'Calend\u00e1rio', href: '/appointments/calendar' },
      { label: 'Espera', href: '/waiting-list' },
    ],
  },
];

export const features: FeatureItem[] = [
  {
    category: 'Atendimento',
    label: 'Agenda de Consultas',
    description: 'Gerencie sua agenda semanal e visualize pacientes em espera.',
    href: '/appointments',
  },
  {
    category: 'Atendimento',
    label: 'Cadastro de Pacientes',
    description: 'Registre e acompanhe dados cl\u00ednicos completos.',
    href: '/patients',
  },
  {
    category: 'Administra\u00e7\u00e3o',
    label: 'Financeiro',
    description: 'Controle receitas, despesas e relat\u00f3rios cont\u00e1beis.',
    href: '/finance',
  },
  {
    category: 'Administra\u00e7\u00e3o',
    label: 'Configura\u00e7\u00f5es',
    description: 'Ajuste prefer\u00eancias e integra\u00e7\u00f5es do sistema.',
    href: '/settings',
  },
  {
    category: 'Ferramentas Extras',
    label: 'AI Insights',
    description: 'Analise notas cl\u00ednicas com aux\u00edlio de IA.',
    href: '/patients',
  },
];
