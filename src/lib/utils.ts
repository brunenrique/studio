import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js';
import crypto from 'crypto';

let cachedKey: Buffer | undefined;

export function getCryptoKey(): Buffer {
  if (cachedKey) return cachedKey;
  const key = process.env.CRYPTO_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.warn(`[${process.env.NODE_ENV}] Generated random CRYPTO_SECRET_KEY`);
      cachedKey = crypto.randomBytes(32);
      return cachedKey;
    }
    throw new Error("CRYPTO_SECRET_KEY is not set");
  }
  cachedKey = Buffer.from(key, "base64");
  return cachedKey;
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
  const key = getCryptoKey().toString('base64');
  return CryptoJS.AES.encrypt(text, key).toString();
}

/**
 * Decrypts a string using AES.
 * @param ciphertext The string to decrypt.
 * @returns The decrypted string.
 */
export function decrypt(ciphertext: string): string {
  const key = getCryptoKey().toString('base64');
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
}

export function tryDecrypt(value: string): string {
  try {
    const result = decrypt(value);
    return result || value;
  } catch {
    return value;
  }
}
