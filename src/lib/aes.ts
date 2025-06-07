/* istanbul ignore file */
import CryptoJS from 'crypto-js'

// Riscos: colocar a chave de criptografia diretamente no código fonte é inseguro
// porque ela pode ser exposta para o cliente. É melhor obtê-la de um
// ambiente seguro (ex.: variáveis de ambiente do serviço de hospedagem)
// e não incluí-la no bundle do aplicativo.
function getKey(): string {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY não definida')
  return key
}

export function encryptData(text: string): string {
  return CryptoJS.AES.encrypt(text, getKey()).toString()
}

export function decryptData(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, getKey())
  return bytes.toString(CryptoJS.enc.Utf8)
}
