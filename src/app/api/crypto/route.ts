import CryptoJS from 'crypto-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action, data } = body ?? {}
  if (typeof action !== 'string' || typeof data !== 'string') {
    return NextResponse.json(
      { error: 'Missing action or data' },
      { status: 400 }
    )
  }

  const key = process.env.CRYPTO_SECRET_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'CRYPTO_SECRET_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    let result: string
    if (action === 'encrypt') {
      result = CryptoJS.AES.encrypt(data, key).toString()
    } else if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, key)
      result = bytes.toString(CryptoJS.enc.Utf8)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ result }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    )
  }
}

