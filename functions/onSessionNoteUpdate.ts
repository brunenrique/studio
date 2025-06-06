import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const onSessionNoteUpdate = functions.firestore
  .document('patients/{patientId}/sessionNotes/{noteId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as any;
    const after = change.after.data() as any;

    // Only create a version if notes were modified
    if (before.notes === after.notes && before.date === after.date) {
      return null;
    }

    const versionsCol = db
      .collection('patients')
      .doc(context.params.patientId)
      .collection('sessionNotes')
      .doc(context.params.noteId)
      .collection('versions');

    await versionsCol.add({
      ...before,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });
