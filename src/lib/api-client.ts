// Caminho: src/lib/api-client.ts

/**
 * Criptografa uma string de dados enviando-a para a nossa API segura.
 * @param plainText O texto a ser criptografado.
 * @returns A string criptografada.
 * @throws {Error} Se a API retornar um erro.
 */
export async function encryptPatientData(plainText: string): Promise<string> {
    const response = await fetch('/api/crypto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'encrypt', data: plainText }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error || 'Falha ao criptografar os dados.');
    }
  
    return result.result;
  }
  
  /**
   * Descriptografa uma string de dados enviando-a para a nossa API segura.
   * @param encryptedText O texto criptografado.
   * @returns A string original.
   * @throws {Error} Se a API retornar um erro.
   */
  export async function decryptPatientData(encryptedText: string): Promise<string> {
      if (!encryptedText) {
          // Retorna vazio se não houver nada para descriptografar.
          return "";
      }
      
    const response = await fetch('/api/crypto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'decrypt', data: encryptedText }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      // Loga o erro para depuração, mas lança uma mensagem genérica.
      console.error("API Decryption Error:", result.error);
      throw new Error('Falha ao acessar os dados do paciente.');
    }
  
    return result.result;
  }