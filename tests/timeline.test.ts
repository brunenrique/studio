process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString("base64");
import { generateTimelineEvents } from "../src/lib/timeline";
import { mockAppointments, getMockPatientsList } from "../src/lib/mock-data";

test("generateTimelineEvents merges and sorts events", () => {
  const events = generateTimelineEvents();
  const patients = getMockPatientsList();
  expect(events.length).toBe(
    mockAppointments.length +
      patients.reduce((sum, p) => sum + p.sessionNotes.length, 0),
  );
  for (let i = 1; i < events.length; i++) {
    const prev = new Date(events[i - 1].date).getTime();
    const curr = new Date(events[i].date).getTime();
    expect(prev).toBeLessThanOrEqual(curr);
  }
});

test("generateTimelineEvents filters by patientId", () => {
  const events = generateTimelineEvents("patient-001");
  expect(events.length).toBe(4);
});
