"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  FileText,
  LogOut,
  Settings,
  PanelLeft,
  BookOpenCheck,
  HeartPulse,
  LineChart,
  Pill,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/appointments', label: 'Agendamentos', icon: CalendarDays },
  { href: '/waiting-list', label: 'Lista de Espera', icon: ListChecks },
  { href: '/templates', label: 'Modelos', icon: FileText },
  { href: '/medications', label: 'Medicamentos', icon: Pill },
  { href: '/self-care', label: 'Saúde Mental', icon: HeartPulse },
  { href: '/knowledge-base', label: 'Base de Conhecimento', icon: BookOpenCheck },
  { href: '/analytics', label: 'Tendências', icon: LineChart },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

// Choose the most important features to appear in the top vertical section
const leftItems = [
  navItems[0], // Dashboard
  navItems[1], // Pacientes
  navItems[2], // Agendamentos
];

const rightItems = navItems.filter((item) => !leftItems.includes(item));

export function LeftSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Sidebar className="border-r bg-card" collapsible="icon" side="left">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="mb-4 block">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 space-y-2">
        <SidebarMenu>
          {leftItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    'w-full justify-start text-base h-12',
                    pathname === item.href ||
                      (pathname.startsWith(item.href) && item.href !== '/dashboard')
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-primary/5'
                  )}
                  tooltip={{ children: item.label, side: 'right', align: 'center', className: 'ml-2' }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        {user && (
          <div className="mb-4 text-center group-data-[collapsible=icon]:hidden">
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-base h-12 group-data-[collapsible=icon]:px-2">
          <LogOut className="h-5 w-5 mr-3 group-data-[collapsible=icon]:mr-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function RightSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-l bg-card" collapsible="icon" side="right">
      <SidebarContent className="flex-grow p-2 space-y-2">
        <SidebarMenu>
          {rightItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    'w-full justify-start text-base h-12',
                    pathname === item.href ||
                      (pathname.startsWith(item.href) && item.href !== '/dashboard')
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-primary/5'
                  )}
                  tooltip={{ children: item.label, side: 'left', align: 'center', className: 'mr-2' }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export { LeftSidebar as AppSidebar };

