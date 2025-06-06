import { encrypt, decrypt } from '../src/lib/utils';

describe('encrypt/decrypt', () => {
  const text = 'hello world';

  it('encrypt returns a different string', () => {
    const cipher = encrypt(text);
    expect(typeof cipher).toBe('string');
    expect(cipher).not.toBe(text);
  });

  it('decrypt(encrypt(text)) returns original', () => {
    const cipher = encrypt(text);
    const plain = decrypt(cipher);
    expect(plain).toBe(text);
  });
});
