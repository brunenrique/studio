"use client";

import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  const { dashboard, updateDashboard } = useSettings();

  const handleChange = (key: keyof typeof dashboard) => (checked: boolean) => {
    updateDashboard({ [key]: checked });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configurações</h1>
      <Card className="shadow-lg max-w-md">
        <CardHeader>
          <CardTitle>Métricas do Dashboard</CardTitle>
          <CardDescription>Escolha quais cartões de métrica deseja exibir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <Checkbox checked={dashboard.showAppointments} onCheckedChange={handleChange('showAppointments')} />
            Mostrar agendamentos futuros
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={dashboard.showPatients} onCheckedChange={handleChange('showPatients')} />
            Mostrar pacientes ativos
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={dashboard.showWaitingList} onCheckedChange={handleChange('showWaitingList')} />
            Mostrar lista de espera
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={dashboard.showFinances} onCheckedChange={handleChange('showFinances')} />
            Mostrar resumo financeiro
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={dashboard.showBirthdays} onCheckedChange={handleChange('showBirthdays')} />
            Mostrar aniversários próximos
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
