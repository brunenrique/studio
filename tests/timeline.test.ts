import { generateTimelineEvents } from '../src/lib/timeline';
import { mockAppointments, mockPatients } from '../src/lib/mock-data';

test('generateTimelineEvents merges and sorts events', () => {
  const events = generateTimelineEvents();
  expect(events.length).toBe(mockAppointments.length + mockPatients.reduce((sum, p) => sum + p.sessionNotes.length, 0));
  for (let i = 1; i < events.length; i++) {
    const prev = new Date(events[i - 1].date).getTime();
    const curr = new Date(events[i].date).getTime();
    expect(prev).toBeLessThanOrEqual(curr);
  }
});
