import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createAppointmentFromWaitingList = functions.https.onCall(
  async (
    data: {
      waitingListEntryId: string;
      date: string;
      time: string;
      durationMinutes: number;
      psychologistId: string;
    },
  ) => {
    const { waitingListEntryId, date, time, durationMinutes, psychologistId } = data;

    const waitingSnap = await db.collection('waitingList').doc(waitingListEntryId).get();
    if (!waitingSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Waiting list entry not found');
    }
    const waiting = waitingSnap.data() as { patientName: string; patientPhone: string };

    const overlapSnap = await db
      .collection('appointments')
      .where('psychologistId', '==', psychologistId)
      .where('date', '==', date)
      .where('time', '==', time)
      .limit(1)
      .get();

    if (!overlapSnap.empty) {
      throw new functions.https.HttpsError('already-exists', 'Slot already booked');
    }

    await db.collection('appointments').add({
      date,
      time,
      psychologistId,
      patientName: waiting.patientName,
      patientPhone: waiting.patientPhone,
      durationMinutes,
      status: 'pending',
    });

    await waitingSnap.ref.delete();

    return { success: true };
  },
);
