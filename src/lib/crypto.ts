// Caminho: src/lib/crypto.ts

import CryptoJS from 'crypto-js';

// 1. Pega a chave secreta do cofre do servidor (variáveis de ambiente)
//    IMPORTANTE: A chave NÃO DEVE ter o prefixo NEXT_PUBLIC_
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

// 2. Verificação de segurança: trava a aplicação se a chave não estiver configurada.
//    Isso evita que o app rode em um estado inseguro.
if (!SECRET_KEY) {
  throw new Error("Variável de ambiente 'CRYPTO_SECRET_KEY' não está definida. A aplicação não pode iniciar.");
}

/**
 * Criptografa uma string usando AES.
 * @param data A string de texto plano a ser criptografada.
 * @returns A string criptografada em base64.
 */
export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

/**
 * Descriptografa uma string que foi criptografada com a função encrypt.s
 * @param encryptedData A string criptografada.
 * @returns A string de texto plano original.
 */
export const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  // Se a descriptografia falhar, retorna uma string vazia para evitar erros.
  if (!originalText) {
      console.error("Falha ao descriptografar os dados. A chave pode estar incorreta ou os dados corrompidos.");
      return "";
  }

  return originalText;
};
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

if (!SECRET_KEY) {
  // In a server environment, we can throw an error if the key is not configured.
  // On the front-end, this would result in `undefined` for SECRET_KEY, which is handled in the API Route.
  console.error('FATAL ERROR: CRYPTO_SECRET_KEY is not configured in the environment variables.');
  // Depending on your execution environment (serverless functions, etc.), you might want a more robust way to handle this on initialization.
}

export function encrypt(data: string): string {
  if (!SECRET_KEY) {
    throw new Error('Encryption key is not available.');
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(data: string): string {
  if (!SECRET_KEY) {
    throw new Error('Encryption key is not available.');
  }
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

if (!SECRET_KEY) {
  // In a server environment, we can throw an error if the key is not configured.
  // On the front-end, this would result in `undefined` for SECRET_KEY, which is handled in the API Route.
  console.error('FATAL ERROR: CRYPTO_SECRET_KEY is not configured in the environment variables.');
  // Depending on your execution environment (serverless functions, etc.), you might want a more robust way to handle this on initialization.
}

export function encrypt(data: string): string {
  if (!SECRET_KEY) {
    throw new Error('Encryption key is not available.');
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(data: string): string {
  if (!SECRET_KEY) {
    throw new Error('Encryption key is not available.');
  }
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
I understand. I will create an empty file named `crypto.ts` in the `src/lib` directory.

```typescript
// src/lib/crypto.ts
```