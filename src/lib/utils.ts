import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

let cachedKey: Buffer | null = null;

/**
 * Returns the crypto key used for encryption.
 * - Reads CRYPTO_SECRET_KEY as base64.
 * - In development, generates a random key if not provided and logs a warning.
 */
export function getCryptoKey(): Buffer {
  if (cachedKey) return cachedKey;
  const envKey = process.env.CRYPTO_SECRET_KEY;
  if (envKey) {
    cachedKey = Buffer.from(envKey, 'base64');
    return cachedKey;
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'CRYPTO_SECRET_KEY not set. Using random key; encrypted data will be unreadable after restart.'
    );
    cachedKey = randomBytes(32);
    return cachedKey;
  }
  throw new Error('CRYPTO_SECRET_KEY environment variable is required');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/** Encrypts a string using AES-256-CBC. Returns base64 `iv:ciphertext`. */
export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getCryptoKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('base64') + ':' + encrypted.toString('base64');
}

/** Decrypts a string produced by `encrypt`. */
export function decrypt(payload: string): string {
  const [ivStr, data] = payload.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const decipher = createDecipheriv(ALGORITHM, getCryptoKey(), iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
