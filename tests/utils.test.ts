import { encrypt, decrypt, formatCPF, isValidCPF } from '../src/lib/utils';

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

  it('encrypt uses a random IV, producing different ciphertext each time', () => {
    const c1 = encrypt(plaintext);
    const c2 = encrypt(plaintext);
    expect(c1).not.toBe(c2);
  });

  it('decrypt(encrypt(text)) returns the original plaintext', () => {
    const cipher = encrypt(plaintext);
    const decrypted = decrypt(cipher);
    expect(decrypted).toBe(plaintext);
  });
});

describe('CPF utilities', () => {
  function generateCPF(): string {
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));
    let sum = digits.reduce((acc, d, idx) => acc + d * (10 - idx), 0);
    let mod = (sum * 10) % 11;
    if (mod === 10 || mod === 11) mod = 0;
    digits.push(mod);
    sum = digits.reduce((acc, d, idx) => acc + d * (11 - idx), 0);
    mod = (sum * 10) % 11;
    if (mod === 10 || mod === 11) mod = 0;
    digits.push(mod);
    return digits.join('');
  }

  it('formatCPF applies mask', () => {
    expect(formatCPF('12345678900')).toBe('123.456.789-00');
  });

  it('isValidCPF validates numbers correctly', () => {
    const valid = generateCPF();
    expect(isValidCPF(valid)).toBe(true);
    expect(isValidCPF('111.111.111-11')).toBe(false);
  });
});
