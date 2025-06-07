import { addMinutes, getDay, parseISO } from 'date-fns';
import type { BlockedTime, WeeklyBlockedTime } from './types';

export function parseBlockedTimes(
  text: string,
  durationMinutes = 60
): BlockedTime[] {
  return text
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((iso, idx) => ({
      id: `blk-${idx}`,
      dateTime: iso,
      durationMinutes,
    }));
}

export function parseWeeklyBlockedTimes(text: string): WeeklyBlockedTime[] {
  return text
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry, idx) => {
      const [dayStr, timeRange] = entry.split(/\s+/);
      const [start, end] = timeRange.split('-');
      return {
        id: `wblk-${idx}`,
        weekday: parseInt(dayStr, 10),
        start,
        end,
      };
    });
}

export function isDateTimeBlocked(
  date: Date,
  blocks: BlockedTime[],
  weekly: WeeklyBlockedTime[]
): boolean {
  for (const b of blocks) {
    const start = parseISO(b.dateTime);
    const end = addMinutes(start, b.durationMinutes);
    if (date >= start && date < end) return true;
  }
  for (const w of weekly) {
    if (getDay(date) === w.weekday) {
      const [sh, sm] = w.start.split(':').map(Number);
      const [eh, em] = w.end.split(':').map(Number);
      const start = new Date(date);
      start.setHours(sh, sm, 0, 0);
      const end = new Date(date);
      end.setHours(eh, em, 0, 0);
      if (date >= start && date < end) return true;
    }
  }
  return false;
}
