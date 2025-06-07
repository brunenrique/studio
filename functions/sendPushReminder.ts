import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logSendResult } from './src/logger';

admin.initializeApp();

export const sendPushReminder = functions.https.onCall(async (data: { uid: string; taskId: string; title: string }) => {
  const { uid, taskId, title } = data;
  try {
    const r = await admin.messaging().send({
      topic: uid,
      notification: { title: 'Tarefa próxima', body: title },
      data: { taskId },
    });
    logSendResult('push', uid, 'success', r);
  } catch (e) {
    logSendResult('push', uid, 'error', e);
  }
});
