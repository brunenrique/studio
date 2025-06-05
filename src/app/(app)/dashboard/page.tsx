"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Users,
  CalendarDays,
  ListChecks,
  FileText,
  Lightbulb,
  PiggyBank,
  BirthdayCake,
  Settings2,
} from 'lucide-react';
import Image from 'next/image';
import {
  format,
  parseISO,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
  addDays,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
} from 'date-fns';
import {
  mockAppointments,
  mockPatients,
  mockWaitingList,
  mockFinancialRecords,
} from '@/lib/mock-data';

interface DashboardConfig {
  showAppointments: boolean;
  showFinancialSummary: boolean;
  showActivePatients: boolean;
  showUpcomingBirthdays: boolean;
  showWaitingList: boolean;
}

const DEFAULT_CONFIG: DashboardConfig = {
  showAppointments: true,
  showFinancialSummary: true,
  showActivePatients: true,
  showUpcomingBirthdays: true,
  showWaitingList: true,
};

const CONFIG_KEY = 'psiguard_dashboard_config';

export default function DashboardPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const updateConfig = (key: keyof DashboardConfig, value: boolean) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  };

  if (!user) return null;

  const today = startOfDay(new Date());
  const weekEnd = endOfDay(addDays(today, 6));

  const appointmentsToday = mockAppointments.filter((appt) =>
    isSameDay(parseISO(appt.dateTime), today)
  ).length;
  const appointmentsWeek = mockAppointments.filter((appt) =>
    isWithinInterval(parseISO(appt.dateTime), { start: today, end: weekEnd })
  ).length;

  const activePatientsCount = mockPatients.length;
  const waitingListCount = mockWaitingList.length;

  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);
  const monthlyRecords = mockFinancialRecords.filter((rec) =>
    isWithinInterval(parseISO(rec.date), { start: startMonth, end: endMonth })
  );
  const income = monthlyRecords
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const expense = monthlyRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const net = income - expense;

  const upcomingBirthdays = mockPatients
    .map((p) => {
      const dob = parseISO(p.dateOfBirth);
      let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
      return { ...p, nextBirthday };
    })
    .filter((p) => differenceInCalendarDays(p.nextBirthday, today) <= 30)
    .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Bem-vindo(a), {user.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo da sua atividade recente.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="shrink-0"
          >
            <Settings2 className="h-4 w-4 mr-2" /> Personalizar
          </Button>
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

      {showConfig && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Configurar Dashboard</CardTitle>
            <CardDescription>Escolha quais widgets deseja exibir.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="appointments"
                checked={config.showAppointments}
                onCheckedChange={(checked) =>
                  updateConfig('showAppointments', Boolean(checked))
                }
              />
              <Label htmlFor="appointments">Resumo de Agendamentos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="financial"
                checked={config.showFinancialSummary}
                onCheckedChange={(checked) =>
                  updateConfig('showFinancialSummary', Boolean(checked))
                }
              />
              <Label htmlFor="financial">Resumo Financeiro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="patients"
                checked={config.showActivePatients}
                onCheckedChange={(checked) =>
                  updateConfig('showActivePatients', Boolean(checked))
                }
              />
              <Label htmlFor="patients">Pacientes Ativos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="birthdays"
                checked={config.showUpcomingBirthdays}
                onCheckedChange={(checked) =>
                  updateConfig('showUpcomingBirthdays', Boolean(checked))
                }
              />
              <Label htmlFor="birthdays">Próximos Aniversários</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="waitlist"
                checked={config.showWaitingList}
                onCheckedChange={(checked) =>
                  updateConfig('showWaitingList', Boolean(checked))
                }
              />
              <Label htmlFor="waitlist">Pacientes na Lista de Espera</Label>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {config.showAppointments && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <CalendarDays className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointmentsToday}</div>
              <p className="text-xs text-muted-foreground">
                hoje • {appointmentsWeek} na semana
              </p>
              <Button asChild variant="link" className="px-0 mt-2">
                <Link href="/appointments">Ver Agenda</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {config.showActivePatients && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePatientsCount}</div>
              <p className="text-xs text-muted-foreground">pacientes cadastrados</p>
              <Button asChild variant="link" className="px-0 mt-2">
                <Link href="/patients">Gerenciar Pacientes</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {config.showWaitingList && (
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

        {config.showFinancialSummary && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumo Financeiro</CardTitle>
              <PiggyBank className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                despesas: {expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} • saldo: {net.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </CardContent>
          </Card>
        )}

        {config.showUpcomingBirthdays && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Aniversários</CardTitle>
              <BirthdayCake className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-1">
              {upcomingBirthdays.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum aniversário nos próximos 30 dias.</p>
              )}
              {upcomingBirthdays.map((p) => (
                <div key={p.id} className="text-sm flex justify-between">
                  <span>{p.name}</span>
                  <span>{format(p.nextBirthday, 'dd/MM')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />Funcionalidades Principais
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as ferramentas essenciais do PsiGuard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start h-12 text-left">
            <Link href="/patients/new" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Novo Paciente
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start h-12 text-left">
            <Link href="/appointments" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Novo Agendamento
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start h-12 text-left col-span-full sm:col-span-1">
            <Link href="/patients" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Insights de IA (via Prontuário)
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />Lembrete de Segurança
          </CardTitle>
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
