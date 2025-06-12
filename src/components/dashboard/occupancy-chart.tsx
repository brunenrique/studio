"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export interface OccupancyChartData {
  day: string;
  percent: number;
}

interface Props {
  data: OccupancyChartData[];
  height?: number;
}

export default function OccupancyChart({ data, height = 250 }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="percent" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
