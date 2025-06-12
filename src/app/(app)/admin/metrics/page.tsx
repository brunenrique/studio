"use client";

import StatsCard from "@/components/dashboard/stats-card";
import {
  Users,
  CalendarCheck,
  UserPlus,
} from "lucide-react";

export default function AdminMetricsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Métricas do Sistema</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          icon={Users}
          title="Total de Pacientes Ativos"
          value={128}
        />
        <StatsCard
          icon={CalendarCheck}
          title="Sessões Realizadas no Mês"
          value={42}
        />
        <StatsCard
          icon={UserPlus}
          title="Novos Usuários Pendentes"
          value={5}
        />
      </div>
    </div>
  );
}
