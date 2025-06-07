"use client";

import { useSettings } from '@/contexts/SettingsContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { dashboard, updateDashboard, system, updateSystem } = useSettings();

  const handleChange = (key: keyof typeof dashboard) => (checked: boolean) => {
    updateDashboard({ [key]: checked });
  };

  const handleSystem = (key: keyof typeof system) => (
    value: string | boolean
  ) => {
    updateSystem({ [key]: value } as any);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configurações</h1>
      <Card className="shadow-lg max-w-md">
        <CardHeader>
          <CardTitle>Métricas do Dashboard</CardTitle>
          <CardDescription>
            Escolha quais cartões de métrica deseja exibir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={dashboard.showAppointments}
              onCheckedChange={handleChange('showAppointments')}
            />
            Mostrar agendamentos futuros
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={dashboard.showPatients}
              onCheckedChange={handleChange('showPatients')}
            />
            Mostrar pacientes ativos
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={dashboard.showWaitingList}
              onCheckedChange={handleChange('showWaitingList')}
            />
            Mostrar lista de espera
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={dashboard.showFinances}
              onCheckedChange={handleChange('showFinances')}
            />
            Mostrar resumo financeiro
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={dashboard.showBirthdays}
              onCheckedChange={handleChange('showBirthdays')}
            />
            Mostrar aniversários próximos
          </label>
        </CardContent>
      </Card>

      <Card className="shadow-lg max-w-md">
        <CardHeader>
          <CardTitle>Configurações Globais do Sistema</CardTitle>
          <CardDescription>
            Defina preferências que afetam todo o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Horário de Início</label>
            <Input
              type="time"
              value={system.workHoursStart}
              onChange={(e) => handleSystem('workHoursStart')(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Horário de Término</label>
            <Input
              type="time"
              value={system.workHoursEnd}
              onChange={(e) => handleSystem('workHoursEnd')(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Duração padrão das sessões (min)
            </label>
            <Input
              type="number"
              value={system.defaultSessionDuration}
              onChange={(e) =>
                handleSystem('defaultSessionDuration')(e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Bloqueios de horário</label>
            <Textarea
              value={system.blockedTimes}
              onChange={(e) => handleSystem('blockedTimes')(e.target.value)}
              placeholder="2024-05-01T15:00, 2024-05-02T10:00"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Bloqueios semanais</label>
            <Textarea
              value={system.weeklyBlockedTimes}
              onChange={(e) => handleSystem('weeklyBlockedTimes')(e.target.value)}
              placeholder="1 09:00-11:00; 3 14:00-15:00"
            />
          </div>
          <label className="flex items-center gap-2">
            <Switch
              checked={system.externalIntegration}
              onCheckedChange={(v) => handleSystem('externalIntegration')(v)}
            />
            Integração com serviços externos
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
