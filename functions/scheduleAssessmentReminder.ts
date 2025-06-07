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

const HOURS_AFTER = parseInt(process.env.ASSESSMENT_REMINDER_HOURS || '24');

async function notify(patientId: string, message: string) {
  const snap = await db.doc(`patients/${patientId}`).get();
  const patient = snap.data() as any;
  if (!patient) return;
  const contact = patient.contact;
  const optOut = patient.notificationsOptOut || {};
  if (contact) {
    if (contact.includes('@') && !optOut.email) {
      if (await shouldSendNotification(patientId, message)) {
        await sgMail.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Inventário', text: message });
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

export const scheduleAssessmentReminder = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
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
  });
