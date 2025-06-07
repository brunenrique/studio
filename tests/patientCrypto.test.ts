import { encryptPatient, decryptPatient } from '../src/lib/patientCrypto';
import { Patient } from '../src/lib/types';

const patient: Patient = {
  id: 'p1',
  name: 'Test',
  contact: '1234567890',
  cpf: '11122233344',
  dateOfBirth: '2000-01-01',
  sessionNotes: [
    { id: 'n1', date: '2024-01-01', notes: 'ok' }
  ],
};

test('encryptPatient/decryptPatient roundtrip', () => {
  const enc = encryptPatient(patient);
  expect(enc.name).not.toBe(patient.name);
  const dec = decryptPatient(enc);
  expect(dec).toEqual(patient);
});
