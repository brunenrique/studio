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
exports.scheduleAssessmentReminder = void 0;
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
const HOURS_AFTER = parseInt(process.env.ASSESSMENT_REMINDER_HOURS || '24');
async function notify(patientId, message) {
    const snap = await db.doc(`patients/${patientId}`).get();
    const patient = snap.data();
    if (!patient)
        return;
    const contact = patient.contact;
    if (contact) {
        if (contact.includes('@')) {
            await mail_1.default.send({ to: contact, from: SENDGRID_FROM, subject: 'Lembrete de Inventário', text: message });
        }
        else if (TWILIO_SMS_FROM) {
            await twilioClient.messages.create({ from: TWILIO_SMS_FROM, to: contact, body: message });
        }
    }
}
exports.scheduleAssessmentReminder = functions.pubsub
    .schedule('every 60 minutes')
    .onRun(async () => {
    var _a;
    const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - HOURS_AFTER * 60 * 60 * 1000);
    const snap = await db
        .collectionGroup('assessments')
        .where('status', '==', 'pending')
        .where('createdAt', '<=', cutoff)
        .get();
    for (const docSnap of snap.docs) {
        const patientId = (_a = docSnap.ref.parent.parent) === null || _a === void 0 ? void 0 : _a.id;
        if (!patientId)
            continue;
        await notify(patientId, 'Você possui um inventário pendente para preenchimento.');
    }
});
//# sourceMappingURL=scheduleAssessmentReminder.js.map
