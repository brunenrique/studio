import { addDays, differenceInCalendarWeeks, startOfWeek, parseISO } from 'date-fns';
import type { RecurrenceRule, Appointment } from './types';

/**
 * Generates recurring dates based on a rule.
 * @param start ISO string or Date representing the first occurrence
 * @param rule Recurrence rule
 */
export function generateRecurringDates(start: Date | string, rule: RecurrenceRule): Date[] {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const dates: Date[] = [];
  const untilDate = rule.until ? (typeof rule.until === 'string' ? parseISO(rule.until) : rule.until) : null;
  const freqWeeks = rule.frequency === 'daily' ? 0 : rule.frequency === 'weekly' ? 1 : 2;

  if (rule.count !== undefined && rule.count <= 0) return [];
  if (untilDate && untilDate < startDate) return [];
  const allowedWeekdays = rule.weekdays?.filter((d) => d >= 0 && d <= 6);
  if (rule.weekdays && (!allowedWeekdays || allowedWeekdays.length === 0)) return [];

  let day = startOfWeek(startDate, { weekStartsOn: 0 });
  let added = 0;
  const maxIterations = 1000; // safety guard

  for (let i = 0; i < maxIterations; i++) {
    const current = addDays(day, i);
    if (untilDate && current > untilDate) break;
    if (rule.count && added >= rule.count) break;

    if (current >= startDate) {
      if (!allowedWeekdays || allowedWeekdays.includes(current.getDay())) {
        if (
          freqWeeks === 0 ||
          differenceInCalendarWeeks(current, startDate, { weekStartsOn: 0 }) % freqWeeks === 0
        ) {
          dates.push(new Date(current));
          added++;
          if (rule.count && added >= rule.count) break;
        }
      }
    }
  }

  return dates;
}

export function generateRecurringAppointments(base: Appointment, rule: RecurrenceRule): Appointment[] {
  const dates = generateRecurringDates(base.dateTime, rule);
  const recurId = `rec-${Date.now()}`;
  return dates.map((d, idx) => ({
    ...base,
    id: `${base.id}-${idx}`,
    dateTime: typeof d === 'string' ? d : d.toISOString(),
    recurrenceId: recurId,
  }));
}
