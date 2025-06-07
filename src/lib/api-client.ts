// Caminho: src/lib/api-client.ts

/**
 * Envia um texto para a API segura para ser criptografado.
 * @param plainText O texto que você quer proteger (ex: "123.456.789-00").
 * @returns A versão criptografada do texto.
 * @throws {Error} Se a API falhar.
 */
export async function encryptPatientData(plainText: string): Promise<string> {
  // Se o texto estiver vazio, não há nada a fazer.
  if (!plainText) return "";

  const response = await fetch('/api/crypto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'encrypt', data: plainText }),
  });

  const result = await response.json();

  if (!response.ok) {
    // Se a API retornar um erro, nós o lançamos para ser tratado pelo componente.
    throw new Error(result.error || 'Falha ao criptografar os dados.');
  }

  return result.result;
}

/**
 * Envia um texto criptografado para a API segura para ser descriptografado.
 * @param encryptedText O texto criptografado que veio do banco de dados.
 * @returns O texto original, legível.
 * @throws {Error} Se a API falhar.
 */
export async function decryptPatientData(encryptedText: string): Promise<string> {
  // Se não houver nada para descriptografar, retorna uma string vazia.
  if (!encryptedText) return "";
    
  const response = await fetch('/api/crypto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'decrypt', data: encryptedText }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Erro da API de Descriptografia:", result.error);
    // Lança um erro para que o componente que chamou saiba que algo deu errado.
    throw new Error('Falha ao acessar os dados seguros do paciente.');
  }

  return result.result;
}