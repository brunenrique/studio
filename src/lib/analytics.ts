import { Appointment, Patient } from './types';
import {
  startOfWeek,
  format,
  parseISO,
  addDays,
  differenceInMinutes,
} from 'date-fns';

export function getWeeklySessionCounts(appointments: Appointment[]): { week: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const appt of appointments) {
    const weekStart = startOfWeek(new Date(appt.dateTime), { weekStartsOn: 1 });
    const key = format(weekStart, 'yyyy-MM-dd');
    counts[key] = (counts[key] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

const PROBLEM_KEYWORDS: Record<string, string[]> = {
  ansiedade: ['ansiedade'],
  ajustamento: ['ajustamento'],
};

export function getProblemTypeCounts(patients: Patient[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const patient of patients) {
    for (const note of patient.sessionNotes) {
      const text = note.notes.toLowerCase();
      let matched = false;

      for (const [type, keywords] of Object.entries(PROBLEM_KEYWORDS)) {
        if (keywords.some((k) => text.includes(k))) {
          counts[type] = (counts[type] || 0) + 1;
          matched = true;
          break;
        }
      }

      if (!matched) {
        counts.outros = (counts.outros || 0) + 1;
      }
    }
  }

  return counts;
}

export interface OccupancyData {
  scheduledMinutes: number;
  freeMinutes: number;
  scheduledPercent: number;
  freePercent: number;
}

export function getScheduleOccupancy(
  appointments: Appointment[],
  start: Date,
  end: Date,
  workHoursStart = '09:00',
  workHoursEnd = '17:00'
): OccupancyData {
  const [sh, sm] = workHoursStart.split(':').map(Number);
  const [eh, em] = workHoursEnd.split(':').map(Number);
  const dailyMinutes = differenceInMinutes(
    new Date(0, 0, 0, eh, em),
    new Date(0, 0, 0, sh, sm)
  );

  let totalAvailable = 0;
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    totalAvailable += dailyMinutes;
  }

  const scheduled = appointments
    .filter((a) => {
      const dt = parseISO(a.dateTime);
      return dt >= start && dt <= end;
    })
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  const free = Math.max(totalAvailable - scheduled, 0);
  const scheduledPercent = totalAvailable
    ? (scheduled / totalAvailable) * 100
    : 0;
  const freePercent = 100 - scheduledPercent;

  return {
    scheduledMinutes: scheduled,
    freeMinutes: free,
    scheduledPercent,
    freePercent,
  };
}
