"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockAppointments, mockPatients } from '@/lib/mock-data';
import { getWeeklySessionCounts, getProblemTypeCounts } from '@/lib/analytics';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function AnalyticsPage() {
  const weekly = getWeeklySessionCounts(mockAppointments);
  const problems = Object.entries(getProblemTypeCounts(mockPatients)).map(([type, count]) => ({ type, count }));

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
