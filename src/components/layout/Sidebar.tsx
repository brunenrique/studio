"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetOverlay, SheetPortal } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, Users, CalendarDays, ListChecks, FileText, Pill, HeartPulse, BookOpenCheck, LineChart, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  {
    title: 'Consultório',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/patients', label: 'Pacientes', icon: Users },
      { href: '/appointments', label: 'Agendamentos', icon: CalendarDays },
      { href: '/waiting-list', label: 'Lista de Espera', icon: ListChecks },
    ],
  },
  {
    title: 'Ferramentas',
    items: [
      { href: '/templates', label: 'Modelos', icon: FileText },
      { href: '/medications', label: 'Medicamentos', icon: Pill },
      { href: '/self-care', label: 'Saúde Mental', icon: HeartPulse },
      { href: '/knowledge-base', label: 'Base de Conhecimento', icon: BookOpenCheck },
      { href: '/analytics', label: 'Tendências', icon: LineChart },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { href: '/settings', label: 'Configurações', icon: Settings },
    ],
  },
];

function SidebarContent({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  return (
    <aside className={cn('w-[72vw] max-w-xs md:w-56 lg:w-60 bg-card border-r flex flex-col', className)}>
      <div className="p-4">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 space-y-6 text-sm">
        {sections.map(section => (
          <div
            key={section.title}
            className="space-y-1 mt-4 first:mt-0 border-t border-border/20 pt-4 first:border-t-0"
          >
            <p className="px-2 text-muted-foreground font-semibold mb-1">{section.title}</p>
            <ul className="space-y-1">
              {section.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-4 py-2 hover:bg-primary/15',
                      pathname === item.href && 'bg-primary/15 font-semibold'
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t p-4 max-[480px]:hidden">
        {user && (
          <p className="mb-2 text-sm font-medium">{user.name}</p>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
        >
          <LogOut className="h-[18px] w-[18px] mr-2" /> Sair
        </Button>
      </div>
    </aside>
  );
}

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handle = () => setIsDesktop(mq.matches);
    handle();
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  if (isDesktop) {
    return <SidebarContent />;
  }

  const closeDrawer = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <SheetPortal>
        <SheetOverlay className="fixed inset-0 z-50 bg-black/40 md:hidden" />
        <SheetContent
          side="left"
          className="p-0 w-[72vw] max-w-xs md:w-56 lg:w-60 h-full overflow-y-auto shadow-xl bg-background"
        >
          <SidebarContent className="h-full" onNavigate={closeDrawer} />
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
