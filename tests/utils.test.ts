import { encrypt, decrypt } from '../src/lib/utils';

beforeAll(() => {
  const key = Buffer.alloc(32).toString('base64');
  process.env.CRYPTO_SECRET_KEY = key;
});

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY;
});

describe('encrypt/decrypt', () => {
  const plaintext = 'hello world';

  it('encrypt produces output different from the plaintext', () => {
    const cipher = encrypt(plaintext);
    expect(cipher).not.toBe(plaintext);
  });

  it('decrypt(encrypt(text)) returns the original plaintext', () => {
    const cipher = encrypt(plaintext);
    const decrypted = decrypt(cipher);
    expect(decrypted).toBe(plaintext);
  });
});
