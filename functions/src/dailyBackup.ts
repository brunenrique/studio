import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

export const dailyBackup = onSchedule('0 3 * * *', async () => {
    console.info('dailyBackup start');
    const [apptSnap, patientSnap] = await Promise.all([
      db.collection('appointments').get(),
      db.collection('patients').get(),
    ]);

    const data = {
      appointments: apptSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      patients: patientSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    };

    const bucket = storage.bucket();
    const filePath = `backups/${new Date().toISOString().split('T')[0]}.json`;
    await bucket.file(filePath).save(JSON.stringify(data, null, 2), {
      contentType: 'application/json',
    });
    console.info('dailyBackup end');
  });
