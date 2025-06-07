import admin from 'firebase-admin';
import {
  mockPatients,
  mockAppointments,
  mockWaitingList,
  mockFinanceRecords,
  mockTemplates,
  mockKnowledgeBaseArticles,
  mockMedications,
  mockSymptomEntries,
  mockFormulations,
  mockTasks,
} from '../lib/mock-data';

function init() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) {
    console.error('FIREBASE_SERVICE_ACCOUNT env var is required');
    process.exit(1);
  }
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
  return admin.firestore();
}

async function seed() {
  const db = init();
  const batch = db.batch();

  mockPatients.forEach(p => batch.set(db.collection('patients').doc(p.id), p));
  mockAppointments.forEach(a => batch.set(db.collection('appointments').doc(a.id), a));
  mockWaitingList.forEach(w => batch.set(db.collection('waitingList').doc(w.id), w));
  mockFinanceRecords.forEach(f => batch.set(db.collection('financeRecords').doc(f.id), f));
  mockTemplates.forEach(t => batch.set(db.collection('templates').doc(t.id), t));
  mockKnowledgeBaseArticles.forEach(k => batch.set(db.collection('knowledgeBase').doc(k.id), k));
  mockMedications.forEach(m => batch.set(db.collection('medications').doc(m.id), m));
  mockSymptomEntries.forEach(s => batch.set(db.collection('symptomEntries').doc(s.id), s));
  mockFormulations.forEach(f => batch.set(db.collection('formulations').doc(f.sessionId), f));
  mockTasks.forEach(t => batch.set(db.collection('tasks').doc(t.id), t));

  await batch.commit();
  console.log('Demo data seeded');
}

seed();
