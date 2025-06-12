"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export interface DetailedOccupancy {
  label: string;
  totalSlots: number;
  occupied: number;
  percent: number;
}

interface Props {
  data: DetailedOccupancy[];
}

export default function DetailedOccupancyTable({ data }: Props) {
  const percentColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
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
        {data.map((d) => (
          <TableRow key={d.label}>
            <TableCell>{d.label}</TableCell>
            <TableCell>{d.totalSlots}</TableCell>
            <TableCell>{d.occupied}</TableCell>
            <TableCell className={percentColor(d.percent)}>
              {d.percent.toFixed(0)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
