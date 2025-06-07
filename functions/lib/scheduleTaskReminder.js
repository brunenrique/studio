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
exports.scheduleTaskReminder = void 0;
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
const MINUTES_BEFORE = parseInt(process.env.TASK_REMINDER_MINUTES || '10');
async function send(uid, taskId, title) {
    await admin.messaging().send({
        topic: uid,
        notification: { title: 'Tarefa próxima', body: title },
        data: { taskId },
    });
    try {
        const user = await admin.auth().getUser(uid);
        if (user.email) {
            await mail_1.default.send({
                to: user.email,
                from: SENDGRID_FROM,
                subject: 'Lembrete de Tarefa',
                text: `Você possui a tarefa "${title}" com vencimento em breve.`,
            });
        }
        if (user.phoneNumber && TWILIO_SMS_FROM) {
            await twilioClient.messages.create({
                from: TWILIO_SMS_FROM,
                to: user.phoneNumber,
                body: `Tarefa pendente: ${title}`,
            });
        }
    }
    catch (e) {
        console.error('Erro ao enviar email/SMS', e);
    }
}
exports.scheduleTaskReminder = functions.pubsub
    .schedule('* * * * *')
    .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const limit = admin.firestore.Timestamp.fromMillis(now.toMillis() + MINUTES_BEFORE * 60 * 1000);
    const snap = await db
        .collection('tasks')
        .where('status', '==', 'pending')
        .where('dueDate', '<=', limit)
        .where('dueDate', '>', now)
        .get();
    for (const docSnap of snap.docs) {
        const data = docSnap.data();
        await send(data.createdBy, docSnap.id, data.title);
    }
});
//# sourceMappingURL=scheduleTaskReminder.js.map
