import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';

let app: App;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  app = initializeApp({ credential: cert(serviceAccount) });
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

const TOKEN_SECRET = process.env.ASSESSMENT_TOKEN_SECRET as string | undefined;
if (!TOKEN_SECRET) {
  throw new Error('ASSESSMENT_TOKEN_SECRET environment variable is required');
}

export function signAssessmentToken(payload: { assessmentId: string; patientId: string }): string {
  return jwt.sign(payload, TOKEN_SECRET as string, { expiresIn: '7d' });
}

export function verifyAssessmentToken(token: string): { assessmentId: string; patientId: string } {
  return jwt.verify(token, TOKEN_SECRET as string) as { assessmentId: string; patientId: string };
}
