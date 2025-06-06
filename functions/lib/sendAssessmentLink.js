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
exports.onAssessmentCreate = exports.sendAssessmentLink = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const twilio_1 = __importDefault(require("twilio"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
admin.initializeApp();
const db = admin.firestore();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET;
function signToken(data) {
    return jsonwebtoken_1.default.sign(data, TOKEN_SECRET, { expiresIn: '7d' });
}
async function internalSend(patientId, assessmentId, channels) {
    const token = signToken({ patientId, assessmentId });
    const link = `${process.env.PUBLIC_URL}/assessments/fill/${token}`;
    await db.doc(`patients/${patientId}/assessments/${assessmentId}`).update({ linkToken: token });
    const patientSnap = await db.doc(`patients/${patientId}`).get();
    const patient = patientSnap.data();
    if (!patient)
        return;
    if (channels.includes('email')) {
        await mail_1.default.send({
            to: patient.contact,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Novo Inventário',
            text: `Por favor, preencha: ${link}`,
        });
    }
    if (channels.includes('whatsapp') && process.env.TWILIO_WHATSAPP_FROM) {
        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:${patient.contact}`,
            body: `Preencha: ${link}`,
        });
    }
}
exports.sendAssessmentLink = (0, https_1.onCall)(async (request) => {
    const { patientId, assessmentId, channels } = request.data;
    await internalSend(patientId, assessmentId, channels);
    // Callable functions should return a JSON-serializable value.
    return { success: true };
});
exports.onAssessmentCreate = (0, firestore_1.onDocumentCreated)('patients/{patientId}/assessments/{assessmentId}', async (event) => {
    const patientId = event.params.patientId;
    const assessmentId = event.params.assessmentId;
    await internalSend(patientId, assessmentId, ['email']);
});
//# sourceMappingURL=sendAssessmentLink.js.map