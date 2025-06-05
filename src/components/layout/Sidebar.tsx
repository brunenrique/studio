"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  BellRing,
  LogOut,
  Settings,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"; // Assuming enhanced sidebar is available

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Pacientes", icon: Users },
  { href: "/appointments", label: "Agendamentos", icon: CalendarDays },
  { href: "/waiting-list", label: "Lista de Espera", icon: ListChecks },
  { href: "/tasks", label: "Tarefas", icon: BellRing },
  // { href: '/settings', label: 'Configurações', icon: Settings }, // Future
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Sidebar className="border-r bg-card" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="mb-4 block">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    "w-full justify-start text-base h-12",
                    pathname === item.href ||
                      (pathname.startsWith(item.href) &&
                        item.href !== "/dashboard")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-primary/5",
                  )}
                  tooltip={{
                    children: item.label,
                    side: "right",
                    align: "center",
                    className: "ml-2",
                  }}
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
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-base h-12 group-data-[collapsible=icon]:px-2"
        >
          <LogOut className="h-5 w-5 mr-3 group-data-[collapsible=icon]:mr-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            Sair
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
