import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

admin.initializeApp();
const db = admin.firestore();

async function shouldSendNotification(patientId: string, message: string) {
  const cutoff = admin.firestore.Timestamp.fromMillis(
    Date.now() - 24 * 60 * 60 * 1000,
  );
  const snap = await db
    .collection(`patients/${patientId}/notificationLog`)
    .where('message', '==', message)
    .where('createdAt', '>=', cutoff)
    .limit(1)
    .get();
  return snap.empty;
}

async function logNotification(
  patientId: string,
  channel: string,
  message: string,
) {
  await db.collection(`patients/${patientId}/notificationLog`).add({
    channel,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);

const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL as string;
const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM;

const MINUTES_BEFORE_24H = 24 * 60; // 24 hours
const MINUTES_BEFORE_30M = 30; // 30 minutes

async function notifyPatient(patientId: string, message: string) {
  const patientSnap = await db.doc(`patients/${patientId}`).get();
  const patient = patientSnap.data() as any;
  if (!patient) return;
  const contact = patient.contact;
  const optOut = patient.notificationsOptOut || {};
  if (contact) {
    if (contact.includes('@') && !optOut.email) {
      if (await shouldSendNotification(patientId, message)) {
        await sgMail.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Sessão', text: message });
        await logNotification(patientId, 'email', message);
      }
    } else if (TWILIO_SMS_FROM && !optOut.sms) {
      if (await shouldSendNotification(patientId, message)) {
        await twilioClient.messages.create({ from: TWILIO_SMS_FROM, to: contact, body: message });
        await logNotification(patientId, 'sms', message);
      }
    }
  }
}

async function processReminders(minutesBefore: number, flag: string) {
  const now = Date.now();
  const targetStart = new Date(now + (minutesBefore - 1) * 60 * 1000).toISOString();
  const targetEnd = new Date(now + minutesBefore * 60 * 1000).toISOString();
  const snap = await db
    .collection('appointments')
    .where('status', '==', 'pending')
    .where('dateTime', '>=', targetStart)
    .where('dateTime', '<=', targetEnd)
    .get();

  for (const docSnap of snap.docs) {
    const data = docSnap.data() as any;
    if (data[flag]) continue;
    const message = `Lembrete: você tem uma sessão agendada para ${data.dateTime}`;
    await notifyPatient(data.patientId, message);
    await docSnap.ref.update({ [flag]: true });
  }
}

export const scheduleAppointmentReminder = functions.pubsub
  .schedule('* * * * *')
  .onRun(async () => {
    await processReminders(MINUTES_BEFORE_24H, 'reminder24hSent');
    await processReminders(MINUTES_BEFORE_30M, 'reminder30mSent');
  });
