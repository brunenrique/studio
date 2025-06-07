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

const HOURS_AFTER = parseInt(process.env.ASSESSMENT_REMINDER_HOURS || '24');

async function notify(patientId: string, message: string) {
  const snap = await db.doc(`patients/${patientId}`).get();
  const patient = snap.data() as any;
  if (!patient) return;
  const contact = patient.contact;
  if (contact) {
    if (contact.includes('@')) {
      try {
        const res = await sgMail.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Inventário', text: message });
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

export const scheduleAssessmentReminder = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    console.info('scheduleAssessmentReminder start');
    const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - HOURS_AFTER * 60 * 60 * 1000);
    const snap = await db
      .collectionGroup('assessments')
      .where('status', '==', 'pending')
      .where('createdAt', '<=', cutoff)
      .get();

    for (const docSnap of snap.docs) {
      const patientId = docSnap.ref.parent.parent?.id;
      if (!patientId) continue;
      await notify(patientId, 'Você possui um inventário pendente para preenchimento.');
    }
    console.info('scheduleAssessmentReminder end');
  });
