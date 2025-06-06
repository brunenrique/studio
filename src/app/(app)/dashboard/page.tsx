"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  ListChecks,
  FileText,
  Lightbulb,
  PiggyBank,
  Gift,
} from "lucide-react";
import {
  mockAppointments,
  mockPatients,
  mockWaitingList,
  mockFinanceRecords,
} from "@/lib/mock-data";
import { startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";
import CustomImage from "@/components/ui/custom-image";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { dashboard } = useSettings();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const todaysAppointmentsCount = mockAppointments.filter((a) =>
    isSameDay(new Date(a.dateTime), now)
  ).length;
  const weeklyAppointmentsCount = mockAppointments.filter((a) => {
    const date = new Date(a.dateTime);
    return date >= weekStart && date <= weekEnd;
  }).length;

  const activePatientsCount = mockPatients.length;
  const waitingListCount = mockWaitingList.length;

  const monthlyRevenue = mockFinanceRecords
    .filter((r) => {
      const d = new Date(r.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, r) => sum + r.amount, 0);

  const upcomingBirthdays = mockPatients
    .map((p) => {
      const dob = new Date(p.dateOfBirth);
      let bday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      if (bday < now) bday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
      return { name: p.name, date: bday };
    })
    .filter((b) => differenceInCalendarDays(b.date, now) <= 30)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between relative">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Bem-vindo(a), {user.name}!</h1>
          <p className="text-muted-foreground mt-1">Aqui está um resumo da sua atividade recente.</p>
        </div>
        <CustomImage
          src={user.profileImage || "https://placehold.co/100x100?text=Foto"}
          alt={`Foto de perfil de ${user.name}`}
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-cover mt-4 md:mt-0"
        />
      </div>

      [...restante do conteúdo permanece inalterado...]
    </div>
  );
}
