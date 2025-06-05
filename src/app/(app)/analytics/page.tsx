"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { mockAppointments, mockPatients } from '@/lib/mock-data';
import { getWeeklySessionCounts, getProblemTypeCounts, getScheduleOccupancy } from '@/lib/analytics';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function AnalyticsPage() {
  const { system } = useSettings();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const weekly = getWeeklySessionCounts(mockAppointments);
  const problems = Object.entries(getProblemTypeCounts(mockPatients)).map(([type, count]) => ({ type, count }));

  const now = new Date();
  const periodStart = period === 'week'
    ? startOfWeek(now, { weekStartsOn: 1 })
    : startOfMonth(now);
  const periodEnd = period === 'week'
    ? endOfWeek(now, { weekStartsOn: 1 })
    : endOfMonth(now);

  const occupancy = getScheduleOccupancy(
    mockAppointments,
    periodStart,
    periodEnd,
    system.workHoursStart,
    system.workHoursEnd
  );

  const occupancyData = [
    {
      name: 'Ocupação',
      Agendado: Number(occupancy.scheduledPercent.toFixed(2)),
      Livre: Number(occupancy.freePercent.toFixed(2)),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Tendências Agregadas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Sessões por Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={300} data={weekly} className="mx-auto">
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Ocupação da Agenda</CardTitle>
          <Select value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana Atual</SelectItem>
              <SelectItem value="month">Mês Atual</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={300} data={occupancyData} className="mx-auto">
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="Agendado" stackId="a" fill="#8884d8" />
            <Bar dataKey="Livre" stackId="a" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Problemas Mais Comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={400} height={300} className="mx-auto">
            <Pie data={problems} dataKey="count" nameKey="type" outerRadius={100}>
              {problems.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}
