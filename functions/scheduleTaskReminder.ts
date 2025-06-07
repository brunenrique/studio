import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

admin.initializeApp();
const db = admin.firestore();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL as string;
const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM;

const MINUTES_BEFORE = parseInt(process.env.TASK_REMINDER_MINUTES || '10');

async function send(uid: string, taskId: string, title: string) {
  await admin.messaging().send({
    topic: uid,
    notification: { title: 'Tarefa próxima', body: title },
    data: { taskId },
  });

  try {
    const user = await admin.auth().getUser(uid);
    if (user.email) {
      await sgMail.send({
        to: user.email,
        from: SENDGRID_FROM,
        subject: 'Lembrete de Tarefa',
        text: `Você possui a tarefa "${title}" com vencimento em breve.`,
      });
    }
    if (user.phoneNumber && TWILIO_SMS_FROM) {
      await twilioClient.messages.create({
        from: TWILIO_SMS_FROM,
        to: user.phoneNumber,
        body: `Tarefa pendente: ${title}`,
      });
    }
  } catch (e) {
    console.error('Erro ao enviar email/SMS', e);
  }
}

// A frequência de execução pode ser alterada pela variável de ambiente
// `TASK_REMINDER_CRON` (padrão executa a cada minuto).
export const scheduleTaskReminder = functions.pubsub
  .schedule(process.env.TASK_REMINDER_CRON || '* * * * *')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const limit = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + MINUTES_BEFORE * 60 * 1000,
    );
    const snap = await db
      .collection('tasks')
      .where('status', '==', 'pending')
      .where('dueDate', '<=', limit)
      .where('dueDate', '>', now)
      .get();

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as any;
      await send(data.createdBy, docSnap.id, data.title);
    }
  });
