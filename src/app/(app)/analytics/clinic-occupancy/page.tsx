"use client";

import DetailedOccupancyTable, { DetailedOccupancy } from "@/components/analytics/detailed-occupancy-table";
import OccupancyChart from "@/components/dashboard/occupancy-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClinicOccupancyPage() {
  const mockData: DetailedOccupancy[] = [
    { label: "Seg", totalSlots: 10, occupied: 8, percent: 80 },
    { label: "Ter", totalSlots: 10, occupied: 5, percent: 50 },
    { label: "Qua", totalSlots: 10, occupied: 7, percent: 70 },
    { label: "Qui", totalSlots: 10, occupied: 9, percent: 90 },
    { label: "Sex", totalSlots: 10, occupied: 6, percent: 60 },
    { label: "Sáb", totalSlots: 10, occupied: 4, percent: 40 },
    { label: "Dom", totalSlots: 10, occupied: 2, percent: 20 },
  ];

  const chartData = mockData.map((d) => ({ day: d.label, percent: d.percent }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Ocupação da Clínica</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resumo Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailedOccupancyTable data={mockData} />
          <OccupancyChart data={chartData} height={256} />
        </CardContent>
      </Card>
    </div>
  );
}
