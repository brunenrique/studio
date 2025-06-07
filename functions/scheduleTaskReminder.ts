import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import { isValidEmail, isValidE164 } from "./src/validators";

admin.initializeApp();
const db = admin.firestore();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const twilioClient = twilio(
  process.env.TWILIO_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string,
);
const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL as string;
const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM;

const MINUTES_BEFORE = parseInt(process.env.TASK_REMINDER_MINUTES || "10");

async function send(uid: string, taskId: string, title: string) {
  await admin.messaging().send({
    topic: uid,
    notification: { title: "Tarefa próxima", body: title },
    data: { taskId },
  });

  try {
    const user = await admin.auth().getUser(uid);
    if (user.email) {
      if (isValidEmail(user.email)) {
        await sgMail.send({
          to: user.email,
          from: SENDGRID_FROM,
          subject: "Lembrete de Tarefa",
          text: `Você possui a tarefa "${title}" com vencimento em breve.`,
        });
      } else {
        console.error("Contato de email inválido", user.email);
      }
    }
    if (user.phoneNumber && TWILIO_SMS_FROM) {
      if (isValidE164(user.phoneNumber)) {
        await twilioClient.messages.create({
          from: TWILIO_SMS_FROM,
          to: user.phoneNumber,
          body: `Tarefa pendente: ${title}`,
        });
      } else {
        console.error("Contato de telefone inválido", user.phoneNumber);
      }
    }
  } catch (e) {
    console.error("Erro ao enviar email/SMS", e);
  }
}

export const scheduleTaskReminder = functions.pubsub
  .schedule("* * * * *")
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const limit = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + MINUTES_BEFORE * 60 * 1000,
    );
    const snap = await db
      .collection("tasks")
      .where("status", "==", "pending")
      .where("dueDate", "<=", limit)
      .where("dueDate", ">", now)
      .get();

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as any;
      await send(data.createdBy, docSnap.id, data.title);
    }
  });
