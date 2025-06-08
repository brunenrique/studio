"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { mockAppointments, mockPatients } from "@/lib/mock-data";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { useMemo } from "react";

export default function PsychologistIndicatorsPage() {
  const { user } = useAuth();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const myAppointments = useMemo(
    () => mockAppointments.filter((a) => a.psychologistId === user?.id),
    [user]
  );
  const monthAppts = useMemo(
    () =>
      myAppointments.filter((a) =>
        isWithinInterval(parseISO(a.dateTime), {
          start: monthStart,
          end: monthEnd,
        })
      ),
    [myAppointments, monthStart, monthEnd]
  ); // Filtragens memorizadas

  const sessionsCount = monthAppts.length;
  const absences = monthAppts.filter((a) => a.status === "absent").length;
  const canceled = monthAppts.filter((a) => a.status === "canceled").length;
  const rescheduled = monthAppts.filter(
    (a) => a.status === "rescheduled",
  ).length;
  const activePatients = mockPatients.filter(
    (p) => p.psychologistId === user?.id,
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">
        Indicadores do Psicólogo
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sessões no mês</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {sessionsCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ausências</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{absences}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancelamentos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{canceled}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remarcações</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {rescheduled}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Ativos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {activePatients}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
