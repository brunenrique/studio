import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

export const onSessionNoteUpdate = onDocumentUpdated('patients/{patientId}/sessionNotes/{noteId}', async (event) => {
    const before = event.data?.before.data() as any;
    const after = event.data?.after.data() as any;

    // Only create a version if notes were modified
    if (before.notes === after.notes && before.date === after.date) {
      return null;
    }

    const versionsCol = db
      .collection('patients')
      .doc(event.params.patientId)
      .collection('sessionNotes')
      .doc(event.params.noteId)
      .collection('versions');

    await versionsCol.add({
      ...before,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });
