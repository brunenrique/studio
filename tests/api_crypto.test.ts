import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from '../src/app/api/crypto/route'

beforeAll(() => {
  process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString('base64')
})

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY
})

test('encrypt then decrypt returns original text', async () => {
  const text = 'texto secreto'

  await testApiHandler({
    appHandler,
    async test({ fetch }) {
      const encRes = await fetch({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'encrypt', data: text })
      })
      const { result: encrypted } = await encRes.json()

      const decRes = await fetch({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decrypt', data: encrypted })
      })
      const { result: decrypted } = await decRes.json()
      expect(decrypted).toBe(text)
    }
  })
})
