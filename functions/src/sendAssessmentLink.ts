import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

const secrets = functions.config().secrets || {};
sgMail.setApiKey(secrets.sendgrid_api_key || (process.env.SENDGRID_API_KEY as string));
const twilioClient = twilio(
  secrets.twilio_sid || (process.env.TWILIO_SID as string),
  secrets.twilio_auth_token || (process.env.TWILIO_AUTH_TOKEN as string),
);
const TOKEN_SECRET = (secrets.assessment_token_secret || process.env.ASSESSMENT_TOKEN_SECRET) as string;
const FROM_EMAIL = secrets.sendgrid_from_email || process.env.SENDGRID_FROM_EMAIL;
const WHATSAPP_FROM = secrets.twilio_whatsapp_from || process.env.TWILIO_WHATSAPP_FROM;
const PUBLIC_URL = secrets.public_url || process.env.PUBLIC_URL;

function signToken(data: { patientId: string; assessmentId: string }) {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: '7d' });
}

async function internalSend(patientId: string, assessmentId: string, channels: string[]) {
  const token = signToken({ patientId, assessmentId });
  const link = `${PUBLIC_URL}/assessments/fill/${token}`;
  await db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
  const patientSnap = await db.doc(`patients/${patientId}`).get();
  const patient = patientSnap.data();
  if (!patient) return;

  if (channels.includes('email')) {
    await sgMail.send({
      to: patient.contact,
      from: FROM_EMAIL as string,
      subject: 'Novo Inventário',
      text: `Por favor, preencha: ${link}`,
    });
  }

  if (channels.includes('whatsapp') && WHATSAPP_FROM) {
    await twilioClient.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:${patient.contact}`,
      body: `Preencha: ${link}`,
    });
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
