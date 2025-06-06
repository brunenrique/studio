
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, CalendarDays, ListChecks, FileText, Lightbulb, PiggyBank, Gift } from 'lucide-react';
import {
  mockAppointments,
  mockPatients,
  mockWaitingList,
  mockFinanceRecords,
} from '@/lib/mock-data';
import { startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays } from 'date-fns';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard } = useSettings();

  if (!user) return null; // Or a loading state

  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
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
      <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Bem-vindo(a), {user.name}!</h1>
          <p className="text-muted-foreground mt-1">Aqui está um resumo da sua atividade recente.</p>
        </div>
        <Image 
            src="https://placehold.co/300x200.png"
            alt="Decorative dashboard illustration"
            width={300}
            height={200}
            className="rounded-lg mt-4 md:mt-0"
            data-ai-hint="clinic illustration"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboard.showAppointments && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground">agendamentos hoje</p>
            <div className="text-2xl font-bold mt-2">{weeklyAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground">agendamentos nesta semana</p>
            <Button asChild variant="link" className="px-0 mt-2">
              <Link href="/appointments">Ver Agenda</Link>
            </Button>
          </CardContent>
        </Card>
        )}

        {dashboard.showPatients && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatientsCount}</div>
            <p className="text-xs text-muted-foreground">pacientes sob seus cuidados</p>
            <Button asChild variant="link" className="px-0 mt-2">
              <Link href="/patients">Gerenciar Pacientes</Link>
            </Button>
          </CardContent>
        </Card>
        )}

        {dashboard.showWaitingList && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lista de Espera</CardTitle>
            <ListChecks className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingListCount}</div>
            <p className="text-xs text-muted-foreground">pacientes aguardando agendamento</p>
            <Button asChild variant="link" className="px-0 mt-2">
              <Link href="/waiting-list">Ver Lista</Link>
            </Button>
          </CardContent>
        </Card>
        )}

        {dashboard.showFinances && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financeiro do Mês</CardTitle>
            <PiggyBank className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">total recebido</p>
          </CardContent>
        </Card>
        )}

        {dashboard.showBirthdays && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Aniversários</CardTitle>
            <Gift className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {upcomingBirthdays.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum nas próximas semanas</p>
            ) : (
              <ul className="text-sm space-y-1">
                {upcomingBirthdays.map((b) => (
                  <li key={b.name}>
                    {b.name} - {b.date.toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        )}
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Funcionalidades Principais</CardTitle>
          <CardDescription>Acesse rapidamente as ferramentas essenciais do PsiGuard.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start h-12 text-left">
            <Link href="/patients/new" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Novo Paciente
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start h-12 text-left">
            <Link href="/appointments" className="flex items-center gap-2"> {/* Points to calendar, dialog will open from there */}
               <CalendarDays className="h-4 w-4" /> Novo Agendamento
            </Link>
          </Button>
           <Button asChild variant="outline" className="justify-start h-12 text-left col-span-full sm:col-span-1">
            <Link href="/patients" className="flex items-center gap-2"> {/* Placeholder link */}
               <Lightbulb className="h-4 w-4" /> Insights de IA (via Prontuário)
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-lg bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Lembrete de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">
            Lembre-se de que todos os dados sensíveis dos pacientes são tratados com o máximo cuidado. 
            Este sistema visa auxiliar sua prática profissional, mantendo a confidencialidade e segurança das informações.
            (Nota: Criptografia client-side e notificações por email são funcionalidades planejadas e não totalmente implementadas neste protótipo).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
