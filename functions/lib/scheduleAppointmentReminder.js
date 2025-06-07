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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAppointmentReminder = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const twilio_1 = __importDefault(require("twilio"));
admin.initializeApp();
const db = admin.firestore();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL;
const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM;
const MINUTES_BEFORE_24H = 24 * 60; // 24 hours
const MINUTES_BEFORE_30M = 30; // 30 minutes
async function notifyPatient(patientId, message) {
    const patientSnap = await db.doc(`patients/${patientId}`).get();
    const patient = patientSnap.data();
    if (!patient)
        return;
    const contact = patient.contact;
    if (contact) {
        if (contact.includes('@')) {
            await mail_1.default.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Sessão', text: message });
        }
        else if (TWILIO_SMS_FROM) {
            await twilioClient.messages.create({ from: TWILIO_SMS_FROM, to: contact, body: message });
        }
    }
}
async function processReminders(minutesBefore, flag) {
    const now = Date.now();
    const targetStart = new Date(now + (minutesBefore - 1) * 60 * 1000).toISOString();
    const targetEnd = new Date(now + minutesBefore * 60 * 1000).toISOString();
    const snap = await db
        .collection('appointments')
        .where('status', '==', 'pending')
        .where('dateTime', '>=', targetStart)
        .where('dateTime', '<=', targetEnd)
        .get();
    for (const docSnap of snap.docs) {
        const data = docSnap.data();
        if (data[flag])
            continue;
        const message = `Lembrete: você tem uma sessão agendada para ${data.dateTime}`;
        await notifyPatient(data.patientId, message);
        await docSnap.ref.update({ [flag]: true });
    }
}
exports.scheduleAppointmentReminder = functions.pubsub
    .schedule('* * * * *')
    .onRun(async () => {
    await processReminders(MINUTES_BEFORE_24H, 'reminder24hSent');
    await processReminders(MINUTES_BEFORE_30M, 'reminder30mSent');
});
//# sourceMappingURL=scheduleAppointmentReminder.js.map
