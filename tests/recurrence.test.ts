import { generateRecurringDates, generateRecurringAppointments } from '../src/lib/recurrence';
import { Appointment, RecurrenceRule } from '../src/lib/types';

const baseAppointment: Appointment = {
  id: 'appt',
  patientId: 'p1',
  patientName: 'John',
  dateTime: '2024-01-01T10:00:00Z',
  durationMinutes: 60,
  status: 'pending',
};

describe('generateRecurringDates edge cases', () => {
  it('returns empty array when count is 0', () => {
    const rule: RecurrenceRule = { frequency: 'daily', count: 0 };
    expect(generateRecurringDates(baseAppointment.dateTime, rule)).toEqual([]);
  });

  it('returns empty array when until is before start', () => {
    const rule: RecurrenceRule = { frequency: 'weekly', until: '2023-12-30' };
    expect(generateRecurringDates(baseAppointment.dateTime, rule)).toEqual([]);
  });

  it('handles weekly recurrence', () => {
    const rule: RecurrenceRule = { frequency: 'weekly', weekdays: [2], count: 2 };
    const dates = generateRecurringDates('2024-01-01T10:00:00Z', rule);
    expect(dates.map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2024-01-02',
      '2024-01-09',
    ]);
  });

  it('ignores invalid weekday values', () => {
    const rule = { frequency: 'weekly', weekdays: [7], count: 2 } as unknown as RecurrenceRule;
    expect(generateRecurringDates(baseAppointment.dateTime, rule)).toEqual([]);
  });
});

describe('generateRecurringAppointments', () => {
  it('creates appointments mirroring generated dates', () => {
    const rule: RecurrenceRule = { frequency: 'weekly', weekdays: [2], count: 1 };
    const appts = generateRecurringAppointments(baseAppointment, rule);
    expect(appts.length).toBe(1);
    expect(appts[0].id).toBe('appt-0');
    expect(appts[0].recurrenceId).toBeDefined();
  });
});
