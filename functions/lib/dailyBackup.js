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
exports.dailyBackup = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length)
    admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
exports.dailyBackup = (0, scheduler_1.onSchedule)('0 3 * * *', async () => {
    const [apptSnap, patientSnap] = await Promise.all([
        db.collection('appointments').get(),
        db.collection('patients').get(),
    ]);
    const data = {
        appointments: apptSnap.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
        patients: patientSnap.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
    };
    const bucket = storage.bucket();
    const filePath = `backups/${new Date().toISOString().split('T')[0]}.json`;
    await bucket.file(filePath).save(JSON.stringify(data, null, 2), {
        contentType: 'application/json',
    });
});
//# sourceMappingURL=dailyBackup.js.map
