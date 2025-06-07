import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { makeInternalSend } from './internalSend';

admin.initializeApp();
const db = admin.firestore();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET as string;
export const internalSend = makeInternalSend(
  {
    db,
    sendEmail: sgMail.send.bind(sgMail),
    sendWhatsapp: (msg) => twilioClient.messages.create(msg),
  },
  TOKEN_SECRET,
);

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
