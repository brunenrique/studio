export const FIRESTORE_COLLECTIONS = {
  ASSESSMENTS: 'assessments',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  TASKS: 'tasks',
  LOGS: 'logs',
  NOTIFICATIONS: 'notifications',
  USERS: 'users',
} as const;

export type FirestoreCollection =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];
