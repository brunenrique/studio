let generateTimelineEvents: typeof import('../src/lib/timeline').generateTimelineEvents;
let mockAppointments: typeof import('../src/lib/mock-data').mockAppointments;
let mockPatients: typeof import('../src/lib/mock-data').mockPatients;

beforeAll(async () => {
  process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString('base64');
  ({ generateTimelineEvents } = await import('../src/lib/timeline'));
  const data = await import('../src/lib/mock-data');
  mockAppointments = data.mockAppointments;
  mockPatients = data.mockPatients;
});

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY;
});

test('generateTimelineEvents merges and sorts events', () => {
  const events = generateTimelineEvents();
  expect(events.length).toBe(mockAppointments.length + mockPatients.reduce((sum, p) => sum + p.sessionNotes.length, 0));
  for (let i = 1; i < events.length; i++) {
    const prev = new Date(events[i - 1].date).getTime();
    const curr = new Date(events[i].date).getTime();
    expect(prev).toBeLessThanOrEqual(curr);
  }
});
