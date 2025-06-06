import { verifyAssessmentToken, adminDb } from '@/lib/firebaseAdmin';
import AssessmentForm from '@/components/assessments/AssessmentForm';
import { notFound } from 'next/navigation';

interface PageProps { params: { token: string } }

export default async function AssessmentFillPage({ params }: PageProps) {
  let payload: { assessmentId: string; patientId: string };
  try {
    payload = verifyAssessmentToken(params.token);
  } catch {
    return notFound();
  }

  const assessmentRef = adminDb.doc(`patients/${payload.patientId}/assessments/${payload.assessmentId}`);
  const assessmentSnap = await assessmentRef.get();
  if (!assessmentSnap.exists) return notFound();
  const assessment = assessmentSnap.data() as any;
  if (assessment.status === 'completed') return notFound();

  const testSnap = await adminDb.collection('testsLibrary').doc(assessment.testId).get();
  const test = testSnap.data();
  if (!test) return notFound();

  return <AssessmentForm test={{ id: testSnap.id, ...(test as any) }} assessmentRefPath={assessmentRef.path} />;
}
