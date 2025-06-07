"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import {
  Menu,
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  FileText,
  Pill,
  HeartPulse,
  BookOpenCheck,
  LineChart,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSmartMenu } from "@/lib/use-smart-menu";
import { navigation, NavItem } from "@/lib/navigation";

function SidebarContent({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    '/dashboard': LayoutDashboard,
    '/patients': Users,
    '/appointments': CalendarDays,
    '/waiting-list': ListChecks,
    '/templates': FileText,
    '/medications': Pill,
    '/self-care': HeartPulse,
    '/knowledge-base': BookOpenCheck,
    '/analytics': LineChart,
    '/analytics/psychologist': LineChart,
    '/settings': Settings,
    '/settings/features': FileText,
    '/user-approvals': Users,
  };

  const items = navigation.filter(
    (item) => item.href !== '/user-approvals' || user?.role === 'ADMIN',
  );

  const sections = items.reduce(
    (acc: Record<string, NavItem[]>, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    },
    {},
  );

  const sectionEntries = Object.entries(sections).map(([title, items]) => ({
    title,
    items,
  }));

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sectionEntries.reduce((acc, s) => {
        acc[s.title] = true;
        return acc;
      }, {} as Record<string, boolean>),
  );

  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <aside
      className={cn(
        "w-[72vw] max-w-xs md:w-56 lg:w-60 bg-card border-r flex flex-col",
        className,
      )}
    >
      <div className="p-4">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 space-y-6 text-sm">
        {sectionEntries.map((section, i) => (
          <div
            key={section.title}
            className={cn(
              "space-y-1",
              i > 0 && "mt-4 border-t border-border/20 pt-4",
            )}
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="px-2 flex w-full items-center justify-between text-muted-foreground font-semibold mb-1"
            >
              <span>{section.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  !openSections[section.title] && "-rotate-90",
                )}
              />
            </button>
            {openSections[section.title] && (
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = icons[item.href];
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          onNavigate?.();
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-4 py-2 hover:bg-primary/15 focus:outline focus:outline-2 focus:outline-primary/70",
                          pathname === item.href && "bg-primary/15 font-semibold",
                        )}
                      >
                        {Icon && <Icon className="h-[18px] w-[18px]" />}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
      <div className="border-t p-4 max-[480px]:hidden">
        {user && <p className="mb-2 text-sm font-medium">{user.name}</p>}
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
  const { open, setOpen, toggle, ref, saveFocus, animation } = useSmartMenu({
    id: "sidebar",
    animation: { duration: 300, easing: "easeOut", delay: 100 },
  });

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          title="Abrir menu"
          data-menu-button
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="hidden lg:block h-screen">
        <SidebarContent className="h-full" />
      </div>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetPortal>
            <SheetOverlay className="fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-sm" />
            <SheetContent
              side="left"
              className="p-0 w-[72vw] max-w-xs md:w-56 lg:w-60 h-full overflow-y-auto shadow-xl bg-background"
            >
              <div className="flex justify-end p-4 lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  title="Fechar menu"
                >
                  <Menu className="h-5 w-5 rotate-180" />
                </Button>
              </div>
              <motion.div
                ref={ref}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <SidebarContent
                  className="h-full"
                  onNavigate={() => setTimeout(() => setOpen(false), 150)}
                />
              </motion.div>
            </SheetContent>
          </SheetPortal>
        </Sheet>
      </div>
    </>
  );
}
