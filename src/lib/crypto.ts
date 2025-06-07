// Caminho: src/lib/crypto.ts

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

// --- Configuração ---
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para AES, o IV é de 16 bytes (128 bits)
const AUTH_TAG_LENGTH = 16;

// 1. Pega a chave secreta principal do ambiente.
const MASTER_KEY = process.env.CRYPTO_SECRET_KEY;

// 2. Verificação de segurança "fail-fast".
if (!MASTER_KEY) {
  throw new Error("Variável de ambiente 'CRYPTO_SECRET_KEY' não está definida. A aplicação não pode iniciar.");
}

// 3. Garante que a chave tenha exatamente 32 bytes para o AES-256.
//    Usamos um hash SHA-256 para derivar uma chave de tamanho fixo a partir da chave mestre.
const aescrypto = {
	key: createHash('sha256').update(String(MASTER_KEY)).digest('base64').substring(0, 32),
};

/**
 * Criptografa dados usando AES-256-GCM, o padrão para dados sensíveis.
 * Retorna uma string combinada contendo o IV, a tag de autenticação e o texto cifrado.
 * @param data A string de texto plano a ser criptografada.
 * @returns Uma string no formato "iv:authTag:encryptedData", codificada em base64.
 */
export const encrypt = (data: string): string => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, aescrypto.key, iv);
  
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combina iv, authTag e dados criptografados em uma única string para armazenamento.
  const combinedData = Buffer.concat([iv, authTag, encrypted]).toString('base64');
  
  return combinedData;
};

/**
 * Descriptografa dados que foram criptografados com AES-256-GCM.
 * Valida a integridade dos dados usando a tag de autenticação.
 * @param combinedData A string base64 contendo iv, authTag e os dados criptografados.
 * @returns A string de texto plano original.
 * @throws {Error} Se a descriptografia falhar (dados corrompidos ou chave incorreta).
 */
export const decrypt = (combinedData: string): string => {
  try {
    const combinedDataBuffer = Buffer.from(combinedData, 'base64');
    
    const iv = combinedDataBuffer.slice(0, IV_LENGTH);
    const authTag = combinedDataBuffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combinedDataBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, aescrypto.key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([decipher.update(encrypted, 'hex', 'utf8'), decipher.final('utf8')]);
    
    return decrypted.toString();
  } catch (error) {
    // Esta falha é um evento de segurança! Ela indica possível adulteração dos dados.
    console.error("ERRO DE SEGURANÇA: Falha ao descriptografar os dados. Possível violação de integridade.", error);
    // Em um cenário real, você poderia acionar um alerta aqui.
    // Retornar uma string vazia ou lançar o erro depende da política da sua aplicação.
    // Lançar o erro é mais explícito sobre a falha.
    throw new Error("Não foi possível descriptografar os dados.");
  }
};