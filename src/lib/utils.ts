import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js';
import crypto from 'crypto';

let cachedKey: Buffer | undefined;

export function getCryptoKey(): Buffer {
  if (cachedKey) return cachedKey;
  const key = process.env.CRYPTO_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[dev] Generated random CRYPTO_SECRET_KEY");
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

// 🆔 Formata um CPF aplicando máscara 000.000.000-00
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

// ✅ Validação simples de CPF
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits.charAt(i)) * (10 - i);
  let mod = (sum * 10) % 11;
  if (mod === 10 || mod === 11) mod = 0;
  if (mod !== parseInt(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits.charAt(i)) * (11 - i);
  mod = (sum * 10) % 11;
  if (mod === 10 || mod === 11) mod = 0;
  return mod === parseInt(digits.charAt(10));
}
