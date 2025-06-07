import { Home, Calendar, Users, DollarSign, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export const sidebarItems: SidebarItem[] = [
  { label: "Início", href: "/", icon: Home, role: "all" },
  { label: "Agenda", href: "/appointments", icon: Calendar, role: "psychologist" },
  { label: "Pacientes", href: "/patients", icon: Users, role: "psychologist" },
  { label: "Financeiro", href: "/finance", icon: DollarSign, role: "admin" },
  { label: "Configurações", href: "/settings", icon: Settings, role: "all" },
];

export const routeTabs: RouteTabConfig[] = [
  {
    pattern: /^\/patients\/([^/]+)/,
    getTabs: ({ id }) => [
      { label: "Ficha", href: `/patients/${id}` },
      { label: "Notas", href: `/patients/${id}/notes` },
      { label: "Relatórios", href: `/patients/${id}/reports` },
      { label: "Mensurações", href: `/patients/${id}/metrics` },
      { label: "AI Insights", href: `/patients/${id}/ai` },
    ],
  },
  {
    pattern: /^\/appointments/,
    getTabs: () => [
      { label: "Semanal", href: "/appointments" },
      { label: "Calendário", href: "/appointments/calendar" },
      { label: "Espera", href: "/waiting-list" },
    ],
  },
];

export const features: FeatureItem[] = [
  {
    category: "Atendimento",
    label: "Agenda de Consultas",
    description: "Gerencie sua agenda semanal e visualize pacientes em espera.",
    href: "/appointments",
  },
  {
    category: "Atendimento",
    label: "Cadastro de Pacientes",
    description: "Registre e acompanhe dados clínicos completos.",
    href: "/patients",
  },
  {
    category: "Administração",
    label: "Financeiro",
    description: "Controle receitas, despesas e relatórios contábeis.",
    href: "/finance",
  },
  {
    category: "Administração",
    label: "Configurações",
    description: "Ajuste preferências e integrações do sistema.",
    href: "/settings",
  },
  {
    category: "Ferramentas Extras",
    label: "AI Insights",
    description: "Analise notas clínicas com auxílio de IA.",
    href: "/patients",
  },
];
