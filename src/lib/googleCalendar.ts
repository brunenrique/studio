import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export async function initGapi() {
  return new Promise((resolve) => {
    gapi.load('client:auth2', async () => {
      await gapi.client.init({ apiKey: API_KEY, clientId: CLIENT_ID, scope: SCOPE });
      resolve(true);
    });
  });
}

export async function authorizeWithPopup() {
  await initGapi();
  await gapi.auth2.getAuthInstance().signIn();
}

export async function syncAppointment(appointment: { id: string; patientName: string; dateTime: string; durationMinutes: number; notes?: string }) {
  await initGapi();
  const auth = gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    await auth.signIn();
  }

  const start = new Date(appointment.dateTime);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60000);

  const event = {
    id: appointment.id,
    summary: `Sessão com ${appointment.patientName}`,
    description: appointment.notes || '',
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
  };

  await gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event });
}
