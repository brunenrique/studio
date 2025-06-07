import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

export interface InternalSendDeps {
  db: admin.firestore.Firestore;
  sendEmail: (msg: sgMail.MailDataRequired) => Promise<unknown>;
  sendWhatsapp: (msg: { from: string; to: string; body: string }) => Promise<unknown>;
}

export function signToken(data: { patientId: string; assessmentId: string }, secret: string) {
  return jwt.sign(data, secret, { expiresIn: '7d' });
}

export function makeInternalSend(deps: InternalSendDeps, secret: string) {
  return async function internalSend(patientId: string, assessmentId: string, channels: string[]) {
    const token = signToken({ patientId, assessmentId }, secret);
    const link = `${process.env.PUBLIC_URL}/assessments/fill/${token}`;
    await deps.db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
    const patientSnap = await deps.db.doc(`patients/${patientId}`).get();
    const patient = patientSnap.data() as { contact?: string; optOut?: boolean } | undefined;
    if (!patient || patient.optOut) return;
    if (!patient.contact || patient.contact.length < 5) {
      throw new Error('Invalid contact');
    }
    if (channels.includes('email')) {
      await deps.sendEmail({
        to: patient.contact,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: 'Novo Inventário',
        text: `Por favor, preencha: ${link}`,
      });
    }
    if (channels.includes('whatsapp') && process.env.TWILIO_WHATSAPP_FROM) {
      await deps.sendWhatsapp({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${patient.contact}`,
        body: `Preencha: ${link}`,
      });
    }
  };
}
