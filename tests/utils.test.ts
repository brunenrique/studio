import { encrypt, decrypt } from '../src/lib/utils';

describe('encryption utils', () => {
  const text = 'hello world';

  test('encrypt returns a different string', () => {
    const ciphertext = encrypt(text);
    expect(typeof ciphertext).toBe('string');
    expect(ciphertext).not.toBe(text);
  });

  test('decrypt(encrypt(text)) returns original', () => {
    const ciphertext = encrypt(text);
    const plain = decrypt(ciphertext);
    expect(plain).toBe(text);
  });
});
