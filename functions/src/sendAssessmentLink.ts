import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET as string;

function signToken(data: { patientId: string; assessmentId: string }) {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: '7d' });
}

async function withRetry<T>(
  action: () => Promise<T>,
  message: string,
  patientId: string,
  retries = 1,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === retries) {
        console.error({ message, patientId, error });
        throw error;
      } else {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
  // should never reach here
  throw new Error('Retry loop exited unexpectedly');
}

async function internalSend(patientId: string, assessmentId: string, channels: string[]) {
  const token = signToken({ patientId, assessmentId });
  const link = `${process.env.PUBLIC_URL}/assessments/fill/${token}`;
  await db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
  const patientSnap = await db.doc(`patients/${patientId}`).get();
  const patient = patientSnap.data();
  if (!patient) return;

  if (channels.includes('email')) {
    await withRetry(
      () =>
        sgMail.send({
          to: patient.contact,
          from: process.env.SENDGRID_FROM_EMAIL as string,
          subject: 'Novo Inventário',
          text: `Por favor, preencha: ${link}`,
        }),
      'Failed to send email',
      patientId
    );
  }

  if (channels.includes('whatsapp') && process.env.TWILIO_WHATSAPP_FROM) {
    await withRetry(
      () =>
        twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM as string,
          to: `whatsapp:${patient.contact}`,
          body: `Preencha: ${link}`,
        }),
      'Failed to send WhatsApp message',
      patientId
    );
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
