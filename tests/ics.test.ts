import { generateICS } from '../src/lib/ics';
import { Appointment } from '../src/lib/types';

const appointment: Appointment = {
  id: 'a1',
  patientId: 'p1',
  patientName: 'Jane,\nDoe',
  dateTime: '2024-01-01T10:00:00Z',
  durationMinutes: 60,
  status: 'pending',
  notes: 'First line\nSecond line',
};

test('escape characters in SUMMARY and DESCRIPTION', () => {
  const ics = generateICS([appointment]);
  expect(ics).toContain('SUMMARY:Sessão com Jane\\,\\nDoe');
  expect(ics).toContain('DESCRIPTION:First line\\nSecond line');
});
