import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    if (!action || typeof data !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    let result: string;
    if (action === 'encrypt') {
      result = encrypt(data);
    } else if (action === 'decrypt') {
      result = decrypt(data);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
