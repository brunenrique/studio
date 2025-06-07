import { getWeeklySessionCounts, getProblemTypeCounts, getScheduleOccupancy } from '../src/lib/analytics';
import { Appointment, Patient } from '../src/lib/types';
import { addDays } from 'date-fns';

const baseAppointment: Appointment = {
  id: 'a1',
  patientId: 'p1',
  patientName: 'John',
  dateTime: new Date('2024-01-01T10:00:00Z').toISOString(),
  durationMinutes: 60,
  status: 'pending',
};

const basePatient: Patient = {
  id: 'p1',
  name: 'John',
  contact: '1',
  dateOfBirth: '2000-01-01',
  sessionNotes: [],
};

describe('getWeeklySessionCounts', () => {
  it('returns empty array when there are no appointments', () => {
    expect(getWeeklySessionCounts([])).toEqual([]);
  });

  it('groups appointments by ISO week starting on Monday', () => {
    const appts: Appointment[] = [
      baseAppointment,
      {
        ...baseAppointment,
        id: 'a2',
        dateTime: new Date('2024-01-03T10:00:00Z').toISOString(),
      },
      {
        ...baseAppointment,
        id: 'a3',
        dateTime: new Date('2024-01-09T10:00:00Z').toISOString(),
      },
    ];
    const counts = getWeeklySessionCounts(appts);
    expect(counts).toEqual([
      { week: '2024-01-01', count: 2 },
      { week: '2024-01-08', count: 1 },
    ]);
  });
});

describe('getProblemTypeCounts', () => {
  const patients: Patient[] = [
    {
      ...basePatient,
      sessionNotes: [
        { id: 'n1', date: '2024-01-01', notes: 'Paciente relata ansiedade.' },
        { id: 'n2', date: '2024-01-02', notes: 'Sintomas de ajustamento.' },
        { id: 'n3', date: '2024-01-03', notes: 'Nada relevante.' },
      ],
    },
  ];

  it('categorizes notes based on keywords with "outros" fallback', () => {
    const counts = getProblemTypeCounts(patients);
    expect(counts).toEqual({ ansiedade: 1, ajustamento: 1, outros: 1 });
  });
});

describe('getScheduleOccupancy', () => {
  const start = new Date('2024-01-01T00:00:00Z');
  const end = addDays(start, 4); // five days

  it('handles empty schedule', () => {
    const occ = getScheduleOccupancy([], start, end);
    expect(occ.scheduledMinutes).toBe(0);
    expect(occ.freePercent).toBe(100);
  });

  it('calculates percentages with appointments', () => {
    const appt = { ...baseAppointment };
    const occ = getScheduleOccupancy([appt], start, end);
    const totalMinutes = 5 * 8 * 60; // 5 days * 8 hours
    expect(occ.scheduledMinutes).toBe(appt.durationMinutes);
    expect(occ.scheduledPercent).toBeCloseTo((appt.durationMinutes / totalMinutes) * 100);
  });
});
