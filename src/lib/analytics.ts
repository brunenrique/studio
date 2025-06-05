import { Appointment, Patient } from './types';
import { startOfWeek, format } from 'date-fns';

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
