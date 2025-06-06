import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const MINUTES_BEFORE = parseInt(process.env.TASK_REMINDER_MINUTES || '10');

async function send(uid: string, taskId: string, title: string) {
  await admin.messaging().send({
    topic: uid,
    notification: { title: 'Tarefa próxima', body: title },
    data: { taskId },
  });
}

export const scheduleTaskReminder = functions.pubsub
  .schedule('* * * * *')
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
