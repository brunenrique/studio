import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

let cachedKey: Buffer | null = null;

export function getCryptoKey(): Buffer {
  if (cachedKey) return cachedKey;

  const envKey = process.env.CRYPTO_SECRET_KEY;
  if (envKey) {
    cachedKey = Buffer.from(envKey, 'base64');
    return cachedKey;
  }

  if (process.env.NODE_ENV === 'development') {
    cachedKey = randomBytes(32);
    console.warn('CRYPTO_SECRET_KEY not set. Using random key for development');
    return cachedKey;
  }

  throw new Error('CRYPTO_SECRET_KEY environment variable is required');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Encrypts a string using AES.
 * @param text The string to encrypt.
 * @returns The encrypted string.
 */
export function encrypt(text: string): string {
  const key = getCryptoKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/**
 * Decrypts a string using AES.
 * @param ciphertext The string to decrypt.
 * @returns The decrypted string.
 */
export function decrypt(ciphertext: string): string {
  const data = Buffer.from(ciphertext, 'base64');
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const text = data.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', getCryptoKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);
  return decrypted.toString('utf8');
}
