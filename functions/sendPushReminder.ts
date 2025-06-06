import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendPushReminder = functions.https.onCall(async (data: { uid: string; taskId: string; title: string }) => {
  const { uid, taskId, title } = data;
  await admin.messaging().send({
    topic: uid,
    notification: { title: 'Tarefa próxima', body: title },
    data: { taskId },
  });
});
