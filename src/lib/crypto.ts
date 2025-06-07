// Caminho: src/lib/crypto.ts

import { 
  createCipheriv, 
  createDecipheriv, // 1. CORREÇÃO: 'createDecipheriv' está agora importado do módulo 'crypto'.
  randomBytes, 
  createHash 
} from 'crypto';

// --- Configuração ---
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// 1. Pega a chave secreta principal do ambiente.
const MASTER_KEY = process.env.CRYPTO_SECRET_KEY;

// 2. Verificação de segurança "fail-fast".
if (!MASTER_KEY) {
  throw new Error("Variável de ambiente 'CRYPTO_SECRET_KEY' não está definida. A aplicação não pode iniciar.");
}

// 3. CORREÇÃO: O objeto 'aescrypto' está agora definido corretamente no escopo do módulo.
const aescrypto = {
	key: createHash('sha256').update(String(MASTER_KEY)).digest('base64').substring(0, 32),
};

/**
 * Criptografa dados usando AES-256-GCM, o padrão para dados sensíveis.
 * @param data A string de texto plano a ser criptografada.
 * @returns Uma string no formato combinado, codificada em base64.
 */
export const encrypt = (data: string): string => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, aescrypto.key, iv);
  
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const combinedData = Buffer.concat([iv, authTag, encrypted]).toString('base64');
  
  return combinedData;
};

/**
 * Descriptografa dados que foram criptografados com AES-256-GCM.
 * @param combinedData A string base64 contendo os dados criptografados.
 * @returns A string de texto plano original.
 * @throws {Error} Se a descriptografia falhar.
 */
export const decrypt = (combinedData: string): string => {
  try {
    const combinedDataBuffer = Buffer.from(combinedData, 'base64');
    
    const iv = combinedDataBuffer.slice(0, IV_LENGTH);
    const authTag = combinedDataBuffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combinedDataBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, aescrypto.key, iv);
    decipher.setAuthTag(authTag);
    
    // CORREÇÃO do erro de 'overload' que discutimos anteriormente.
    const decryptedBytes = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    
    return decryptedBytes.toString('utf8');
  } catch (error) {
    console.error("ERRO DE SEGURANÇA: Falha ao descriptografar os dados. Possível violação de integridade.", error);
    throw new Error("Não foi possível descriptografar os dados.");
  }
};