"use client";

import type { SymptomHeatmapEntry } from "@/lib/types";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from "date-fns";

interface SymptomHeatmapProps {
  entries: SymptomHeatmapEntry[];
}

export default function SymptomHeatmap({ entries }: SymptomHeatmapProps) {
  const now = new Date();
  const days = eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });

  const severityByDate: Record<string, number> = {};
  entries.forEach((e) => {
    severityByDate[e.date.slice(0, 10)] = e.severity;
  });

  const weeks: (Date | null)[][] = [];
  let current: (Date | null)[] = Array(days[0].getDay()).fill(null);
  days.forEach((d) => {
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  const colors = [
    "bg-gray-200",
    "bg-green-200",
    "bg-green-400",
    "bg-yellow-300",
    "bg-orange-400",
    "bg-red-500",
  ];

  const labels = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-1">
        {labels.map((l) => (
          <div key={l} className="text-center text-xs font-medium">
            {l}
          </div>
        ))}
      </div>
      {weeks.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-1">
          {week.map((day, j) => {
            if (!day) return <div key={j} className="w-6 h-6" />;
            const key = format(day, "yyyy-MM-dd");
            const sev = severityByDate[key] || 0;
            return (
              <div
                key={j}
                className={`w-6 h-6 rounded ${colors[sev]}`}
                title={`${key} - ${sev}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
