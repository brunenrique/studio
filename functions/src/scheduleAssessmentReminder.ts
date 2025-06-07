import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

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
      await sgMail.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Inventário', text: message });
    } else if (TWILIO_SMS_FROM) {
      await twilioClient.messages.create({ from: TWILIO_SMS_FROM, to: contact, body: message });
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
