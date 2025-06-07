import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

async function shouldSendNotification(
  patientId: string,
  message: string,
) {
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
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET as string;
const TOKEN_EXPIRY = process.env.ASSESSMENT_TOKEN_EXPIRY || '7d';
const PUBLIC_URL = process.env.PUBLIC_URL as string;
if (PUBLIC_URL && !PUBLIC_URL.startsWith('https://')) {
  console.warn('PUBLIC_URL should use HTTPS');
}

export function signToken(data: { patientId: string; assessmentId: string }) {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
}

async function internalSend(patientId: string, assessmentId: string, channels: string[]) {
  const token = signToken({ patientId, assessmentId });
  const link = `${PUBLIC_URL}/assessments/fill/${token}`;
  await db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
  const patientSnap = await db.doc(`patients/${patientId}`).get();
  const patient = patientSnap.data();
  if (!patient) return;
  const optOut = patient.notificationsOptOut || {};

  if (channels.includes('email') && !optOut.email) {
    const message = `Por favor, preencha: ${link}`;
    if (await shouldSendNotification(patientId, message)) {
      await sgMail.send({
        to: patient.contact,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: 'Novo Inventário',
        text: message,
      });
      await logNotification(patientId, 'email', message);
    }
  }

  if (channels.includes('whatsapp') && process.env.TWILIO_WHATSAPP_FROM && !optOut.sms) {
    const message = `Preencha: ${link}`;
    if (await shouldSendNotification(patientId, message)) {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${patient.contact}`,
        body: message,
      });
      await logNotification(patientId, 'whatsapp', message);
    }
  }
}

export const sendAssessmentLink = onCall<{ patientId: string; assessmentId: string; channels: string[] }>(async (request: CallableRequest<{ patientId: string; assessmentId: string; channels: string[] }>) => {
  const { patientId, assessmentId, channels } = request.data;
  await internalSend(patientId, assessmentId, channels);
  // Callable functions should return a JSON-serializable value.
  return { success: true };
});

export const onAssessmentCreate = onDocumentCreated('patients/{patientId}/assessments/{assessmentId}', async (event) => {
  const patientId = event.params.patientId;
  const assessmentId = event.params.assessmentId;
  await internalSend(patientId, assessmentId, ['email']);
});

export const onAppointmentUpdate = onDocumentUpdated('appointments/{appointmentId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;

  const historyRef = db
    .collection('appointments')
    .doc(event.params.appointmentId)
    .collection('history');

  await historyRef.add({
    before,
    after,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
