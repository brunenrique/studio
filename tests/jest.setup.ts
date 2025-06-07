// Jest setup to mock Firebase modules used in tests
import '@testing-library/jest-dom';
process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString('base64');

jest.mock('firebase/auth', () => {
  return {
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
    signInWithPopup: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined),
    onAuthStateChanged: jest.fn(() => () => {}),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
  };
});

jest.mock('../src/lib/firebaseClient', () => {
  return { auth: {}, db: {} };
});
