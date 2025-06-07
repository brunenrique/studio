// Caminho: src/lib/patientCrypto.ts (USANDO SEU ARQUIVO EXISTENTE)

import { 
  createCipheriv, 
  createDecipheriv,
  randomBytes, 
  createHash 
} from 'crypto';

// --- Configuração ---
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

const MASTER_KEY = process.env.CRYPTO_SECRET_KEY;

if (!MASTER_KEY) {
  throw new Error("Variável de ambiente 'CRYPTO_SECRET_KEY' não está definida. A aplicação não pode iniciar.");
}

const aescrypto = {
    key: createHash('sha256').update(String(MASTER_KEY)).digest('base64').substring(0, 32),
};

/**
 * Criptografa dados sensíveis de pacientes usando AES-256-GCM.
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
 * Descriptografa dados sensíveis de pacientes que foram criptografados com AES-256-GCM.
 */
export const decrypt = (combinedData: string): string => {
  try {
    const combinedDataBuffer = Buffer.from(combinedData, 'base64');
    
    const iv = combinedDataBuffer.slice(0, IV_LENGTH);
    const authTag = combinedDataBuffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combinedDataBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, aescrypto.key, iv);
    decipher.setAuthTag(authTag);
    
    const decryptedBytes = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    
    return decryptedBytes.toString('utf8');
  } catch (error) {
    console.error("ERRO DE SEGURANÇA: Falha ao descriptografar os dados. Possível violação de integridade.", error);
    throw new Error("Não foi possível descriptografar os dados.");
  }
};