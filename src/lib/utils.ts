import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js'; // Assuming you have crypto-js installed

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || 'your-secret-key-fallback'; // Use a strong, environment-specific key

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Encrypts a string using AES.
 * @param text The string to encrypt.
 * @returns The encrypted string.
 */
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * Decrypts a string using AES.
 * @param ciphertext The string to decrypt.
 * @returns The decrypted string.
 */
export function decrypt(ciphertext: string): string {
  return CryptoJS.AES.decrypt(ciphertext, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}