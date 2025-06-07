import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { logSendResult } from './src/logger';

admin.initializeApp();
const db = admin.firestore();

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
  if (contact) {
    if (contact.includes('@')) {
      try {
        const res = await sgMail.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Sessão', text: message });
        logSendResult('email', patientId, 'success', res[0].statusCode);
      } catch (e) {
        logSendResult('email', patientId, 'error', e);
      }
    } else if (TWILIO_SMS_FROM) {
      try {
        const m = await twilioClient.messages.create({ from: TWILIO_SMS_FROM, to: contact, body: message });
        logSendResult('sms', patientId, 'success', m.sid);
      } catch (e) {
        logSendResult('sms', patientId, 'error', e);
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
    console.info('scheduleAppointmentReminder start');
    await processReminders(MINUTES_BEFORE_24H, 'reminder24hSent');
    await processReminders(MINUTES_BEFORE_30M, 'reminder30mSent');
    console.info('scheduleAppointmentReminder end');
  });
