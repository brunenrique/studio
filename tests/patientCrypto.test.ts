import { encryptPatient, decryptPatient, decryptPatientForRole } from '../src/lib/patientCrypto';
import { Patient } from '../src/lib/types';

beforeAll(() => {
  const key = Buffer.alloc(32).toString('base64');
  process.env.CRYPTO_SECRET_KEY = key;
});

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY;
});

const patient: Patient = {
  id: 'p1',
  name: 'Test',
  contact: '1234567890',
  cpf: '11122233344',
  dateOfBirth: '2000-01-01',
  sessionNotes: [
    {
      id: 'n1',
      date: '2024-01-01',
      notes: 'ok',
      sessionSummary: 'ok',
      sessionTags: ['teste'],
    },
  ],
  treatmentPlan: 'Plano inicial',
};

test('encryptPatient/decryptPatient roundtrip', () => {
  const enc = encryptPatient(patient);
  expect(enc.name).not.toBe(patient.name);
  const dec = decryptPatient(enc);
  expect(dec).toEqual(patient);
});

test('decryptPatientForRole only decrypts for PSYCHOLOGIST', () => {
  const enc = encryptPatient(patient);
  const asPsych = decryptPatientForRole(enc, 'PSYCHOLOGIST');
  expect(asPsych).toEqual(patient);
  const asOther = decryptPatientForRole(enc, 'RECEPCAO');
  expect(asOther.name).not.toBe(patient.name);
});
