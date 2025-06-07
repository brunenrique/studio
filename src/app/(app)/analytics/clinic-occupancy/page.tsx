"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useSettings } from "@/contexts/SettingsContext";
import { parseBlockedTimes, parseWeeklyBlockedTimes } from "@/lib/availability";
import { startOfWeek, addDays, differenceInMinutes, parseISO, isSameDay, addWeeks, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClinicOccupancyPage() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { system } = useSettings();
  const [week, setWeek] = useState<"current" | "next">("current");

  if (!user || user.role !== "ADMIN") {
    return <p className="p-4">Acesso restrito aos administradores.</p>;
  }

  const data = useMemo(() => {
    const wStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), week === "current" ? 0 : 1);
    const days = Array.from({ length: 7 }, (_, i) => addDays(wStart, i));
    const blocks = parseBlockedTimes(system.blockedTimes, system.defaultSessionDuration);
    const weeklyBlocks = parseWeeklyBlockedTimes(system.weeklyBlockedTimes);
    const [sh, sm] = system.workHoursStart.split(":" ).map(Number);
    const [eh, em] = system.workHoursEnd.split(":" ).map(Number);
    const dailyMinutes = differenceInMinutes(new Date(0,0,0,eh,em), new Date(0,0,0,sh,sm));

    return days.map(day => {
      let blockedMinutes = 0;
      blocks.forEach(b => {
        if (isSameDay(parseISO(b.dateTime), day)) blockedMinutes += b.durationMinutes;
      });
      weeklyBlocks.forEach(w => {
        if (day.getDay() === w.weekday) {
          const [wh, wm] = w.start.split(":" ).map(Number);
          const [ehh, emm] = w.end.split(":" ).map(Number);
          blockedMinutes += differenceInMinutes(new Date(0,0,0,ehh,emm), new Date(0,0,0,wh,wm));
        }
      });
      const availableMinutes = Math.max(dailyMinutes - blockedMinutes, 0);
      const totalSlots = Math.floor(availableMinutes / system.defaultSessionDuration);
      const ocupados = appointments.filter(a => isSameDay(parseISO(a.dateTime), day)).length;
      const percentualOcupacao = totalSlots ? (ocupados / totalSlots) * 100 : 0;
      return {
        day: format(day, "EEE", { locale: ptBR }),
        totalSlots,
        ocupados,
        percentualOcupacao,
      };
    });
  }, [appointments, week, system]);

  const barData = data.map(d => ({ day: d.day, ocupacao: Math.round(d.percentualOcupacao) }));

  const percentColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Mapa de Ocupação Semanal</h1>
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Ocupacao por Dia</CardTitle>
          <Select value={week} onValueChange={v => setWeek(v as "current" | "next") }>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Semana Atual</SelectItem>
              <SelectItem value="next">Próxima Semana</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Ocupados</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(d => (
                <TableRow key={d.day}>
                  <TableCell>{d.day}</TableCell>
                  <TableCell>{d.totalSlots}</TableCell>
                  <TableCell>{d.ocupados}</TableCell>
                  <TableCell className={percentColor(d.percentualOcupacao)}>
                    {d.percentualOcupacao.toFixed(0)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="day" />
                <YAxis domain={[0,100]} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v:number)=>`${v}%`} />
                <Bar dataKey="ocupacao" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
