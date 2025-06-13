import {
  encryptPatientObject,
  decryptPatientObject,
} from "../src/lib/patient-utils";
import { Patient } from "../src/lib/types";

beforeAll(() => {
  process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString("base64");
});

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY;
});

const patient: Patient = {
  id: "p1",
  name: "Test",
  contact: "123",
  cpf: "11122233344",
  dateOfBirth: "2000-01-01",
  sessionNotes: [],
  treatmentPlan: "plan",
};

describe("encryptPatientObject/decryptPatientObject", () => {
  it("handles empty arrays and strings", () => {
    const enc = encryptPatientObject({ ...patient, sessionNotes: [] });
    const dec = decryptPatientObject(enc);
    expect(dec.sessionNotes).toEqual([]);
  });

  it("round trips all sensitive fields", () => {
    const enc = encryptPatientObject(patient);
    for (const key of [
      "contact",
      "cpf",
      "dateOfBirth",
      "sessionNotes",
      "treatmentPlan",
    ]) {
      // @ts-ignore
      expect(enc[key]).not.toBe(patient[key]);
    }
    const dec = decryptPatientObject(enc);
    expect(dec).toEqual(patient);
  });
});
