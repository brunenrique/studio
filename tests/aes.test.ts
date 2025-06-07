import { encryptData, decryptData } from '../src/lib/aes'

beforeAll(() => {
  process.env.ENCRYPTION_KEY = 'secret'
})

afterAll(() => {
  delete process.env.ENCRYPTION_KEY
})

describe('encryptData/decryptData', () => {
  const plaintext = 'segredo'

  it('encryptData gera texto diferente do original', () => {
    const cipher = encryptData(plaintext)
    expect(cipher).not.toBe(plaintext)
  })

  it('decryptData(encryptData(texto)) retorna texto original', () => {
    const cipher = encryptData(plaintext)
    const plain = decryptData(cipher)
    expect(plain).toBe(plaintext)
  })
})
