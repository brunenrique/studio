process.env.ASSESSMENT_TOKEN_SECRET = 'secret';
jest.mock('firebase-functions', () => ({
  __esModule: true,
  default: {
    https: { onCall: jest.fn() },
    firestore: { document: jest.fn(() => ({ onCreate: jest.fn() })) },
  },
  https: { onCall: jest.fn() },
  firestore: { document: jest.fn(() => ({ onCreate: jest.fn() })) },
}));


jest.mock('@sendgrid/mail', () => {
  const send = jest.fn();
  const setApiKey = jest.fn();
  return { __esModule: true, default: { send, setApiKey }, send, setApiKey };
});

const messagesCreate = jest.fn();
jest.mock('twilio', () => {
  return { __esModule: true, default: jest.fn(() => ({ messages: { create: messagesCreate } })) };
});

let patientData: any = {};
const updateMock = jest.fn();
const getMock = jest.fn();
const docMock = jest.fn((path: string) => {
  if (path.includes('/assessments/')) {
    return { update: updateMock };
  }
  return { get: getMock };
});

jest.mock('firebase-admin', () => {
  return {
    __esModule: true,
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({ doc: docMock })),
    default: { initializeApp: jest.fn(), firestore: jest.fn(() => ({ doc: docMock })) },
  };
});
const sgMail = require('@sendgrid/mail');
const { makeInternalSend } = require('../functions/src/internalSend');
const internalSend = makeInternalSend(
  {
    db: { doc: docMock } as any,
    sendEmail: jest.fn((msg) => sgMail.send(msg)),
    sendWhatsapp: jest.fn((msg) => messagesCreate(msg)),
  },
  'secret',
);

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ASSESSMENT_TOKEN_SECRET = 'secret';
  process.env.PUBLIC_URL = 'http://test';
  process.env.SENDGRID_FROM_EMAIL = 'from@example.com';
  process.env.TWILIO_WHATSAPP_FROM = 'whatsapp:123';
});

test('sends email and whatsapp with correct data', async () => {
  patientData = { contact: 'user@example.com' };
  getMock.mockResolvedValue({ data: () => patientData });
  updateMock.mockResolvedValue(undefined);
  await internalSend('p1', 'a1', ['email', 'whatsapp']);
  expect(updateMock).toHaveBeenCalledWith({ linkToken: expect.any(String) });
  expect(sgMail.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'user@example.com', from: 'from@example.com' })
  );
  expect(messagesCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      to: 'whatsapp:user@example.com',
      from: 'whatsapp:123',
    })
  );
});

test('throws on invalid contact', async () => {
  patientData = { contact: 'bad' };
  getMock.mockResolvedValue({ data: () => patientData });
  updateMock.mockResolvedValue(undefined);
  await expect(internalSend('p1', 'a1', ['email'])).rejects.toThrow('Invalid contact');
});

test('does not send when opt-out', async () => {
  patientData = { contact: 'user@example.com', optOut: true };
  getMock.mockResolvedValue({ data: () => patientData });
  updateMock.mockResolvedValue(undefined);
  await internalSend('p1', 'a1', ['email', 'whatsapp']);
  expect(sgMail.send).not.toHaveBeenCalled();
  expect(messagesCreate).not.toHaveBeenCalled();
});
