"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointmentFromWaitingList = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
exports.createAppointmentFromWaitingList = functions.https.onCall(async (data, context) => {
    const { waitingListEntryId, date, time, durationMinutes, psychologistId, } = data;
    const waitingSnap = await db.collection('waitingList').doc(waitingListEntryId).get();
    if (!waitingSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Waiting list entry not found');
    }
    const waiting = waitingSnap.data();
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
});
//# sourceMappingURL=createAppointmentFromWaitingList.js.map
