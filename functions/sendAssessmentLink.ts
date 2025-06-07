import * as functions from 'firebase-functions';
import { makeInternalSend } from './src/internalSend';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

admin.initializeApp();
const db = admin.firestore();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET as string;
const internalSend = makeInternalSend(
  {
    db,
    sendEmail: sgMail.send.bind(sgMail),
    sendWhatsapp: (msg) => twilioClient.messages.create(msg),
  },
  TOKEN_SECRET,
);

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
