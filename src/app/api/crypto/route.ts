import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/crypto'; // Importando do novo arquivo crypto.ts

export async function POST(req: NextRequest) {
  try {
    // 1. Pega os dados da requisição
    const { action, data } = await req.json();

    // 2. Valida se os dados necessários vieram
    if (!action || typeof data !== 'string') {
      return NextResponse.json({ error: 'Requisição inválida: "action" e "data" são obrigatórios.' }, { status: 400 });
    }

    let result: string;

    // 3. Decide qual ação tomar com base no pedido
    if (action === 'encrypt') {
      result = encrypt(data); // Chama a função para criptografar
    } else if (action === 'decrypt') {
      result = decrypt(data); // Chama a função para descriptografar
    } else {
      return NextResponse.json({ error: 'Ação inválida: use "encrypt" ou "decrypt".' }, { status: 400 });
    }

    // 4. Retorna o resultado com sucesso
    return NextResponse.json({ result }, { status: 200 });
  } catch (e) {
    // Se qualquer coisa der errado (JSON mal formatado, etc.), retorna um erro genérico.
    return NextResponse.json({ error: 'Erro ao processar a requisição.' }, { status: 500 });
  }
}
