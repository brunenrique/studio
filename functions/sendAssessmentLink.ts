import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { logSendResult } from './src/logger';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET;
if (!TOKEN_SECRET) {
  throw new Error('ASSESSMENT_TOKEN_SECRET environment variable is required');
}

function signToken(data: { patientId: string; assessmentId: string }) {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: '7d' });
}

async function internalSend(patientId: string, assessmentId: string, channels: string[]) {
  const token = signToken({ patientId, assessmentId });
  const link = `${process.env.PUBLIC_URL}/assessments/fill/${token}`;
  await db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
  const patientSnap = await db.doc(`patients/${patientId}`).get();
  const patient = patientSnap.data();
  if (!patient) return;

  if (channels.includes('email')) {
    try {
      const r = await sgMail.send({
        to: patient.contact,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: 'Novo Inventário',
        text: `Por favor, preencha: ${link}`,
      });
      logSendResult('email', patientId, 'success', r[0].statusCode);
    } catch (e) {
      logSendResult('email', patientId, 'error', e);
    }
  }

  if (channels.includes('whatsapp') && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      const m = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${patient.contact}`,
        body: `Preencha: ${link}`,
      });
      logSendResult('whatsapp', patientId, 'success', m.sid);
    } catch (e) {
      logSendResult('whatsapp', patientId, 'error', e);
    }
  }
}

export const sendAssessmentLink = functions.https.onCall(async (data: { patientId: string; assessmentId: string; channels: string[] }) => {
  const { patientId, assessmentId, channels } = data;
  await internalSend(patientId, assessmentId, channels);
});

export const onAssessmentCreate = functions.firestore
  .document('patients/{patientId}/assessments/{assessmentId}')
  .onCreate(async (_snap: functions.firestore.DocumentSnapshot, ctx: functions.EventContext) => {
    const { patientId, assessmentId } = ctx.params as { patientId: string; assessmentId: string };
    await internalSend(patientId, assessmentId, ['email']);
  });
