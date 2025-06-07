process.env.ASSESSMENT_TOKEN_SECRET = 'secret';
process.env.ASSESSMENT_TOKEN_EXPIRY = '1h';
process.env.SENDGRID_API_KEY = 'SG.test';
jest.mock('firebase-functions/v2/https', () => ({ onCall: (fn: any) => fn }));
jest.mock('firebase-functions/v2/firestore', () => ({
  onDocumentCreated: () => () => {},
  onDocumentUpdated: () => () => {},
}));
import { signToken } from '../functions/src/sendAssessmentLink';
import jwt from 'jsonwebtoken';


afterAll(() => {
  delete process.env.ASSESSMENT_TOKEN_SECRET;
  delete process.env.ASSESSMENT_TOKEN_EXPIRY;
  delete process.env.SENDGRID_API_KEY;
});

test('token expiration respects ASSESSMENT_TOKEN_EXPIRY', () => {
  const token = signToken({ patientId: 'p1', assessmentId: 'a1' });
  const payload = jwt.decode(token) as jwt.JwtPayload;
  expect(payload && payload.exp && payload.iat).toBeDefined();
  const diff = (payload!.exp! as number) - (payload!.iat! as number);
  expect(diff).toBeLessThanOrEqual(3600);
});
