// Caminho: src/app/api/crypto/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/patientCrypto';
import { getCurrentUser } from '@/lib/session';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  // --- ETAPA DE SEGURANÇA: AUTENTICAÇÃO E AUTORIZAÇÃO ---
  const user = await getCurrentUser();

  if (!user) {
    // Se não houver usuário logado, nega o acesso imediatamente.
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const { action, data } = await req.json();

    // --- ETAPA DE VALIDAÇÃO ---
    if (!action || typeof data !== 'string' || data.length === 0) {
      return NextResponse.json(
        { error: 'Requisição inválida: "action" e "data" (não vazia) são obrigatórios.' },
        { status: 400 }
      );
    }

    // Limite de tamanho para evitar abuso (ex: 1MB de dados por requisição)
    if (data.length > 1024 * 1024) {
      return NextResponse.json(
        { error: 'Os dados excedem o limite de tamanho.' },
        { status: 413 }
      );
    }

    let result: string;

    // --- ETAPA DE EXECUÇÃO ---
    if (action === 'encrypt') {
      result = encrypt(data);
      await logAuditEvent({ userId: user.id, action: 'DATA_ENCRYPT' });
    } else if (action === 'decrypt') {
      result = decrypt(data);
      await logAuditEvent({ userId: user.id, action: 'DATA_DECRYPT_SUCCESS' });
    } else {
      return NextResponse.json(
        { error: 'Ação inválida: use "encrypt" ou "decrypt".' },
        { status: 400 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });

  } catch (error) {
    // Captura erros, especialmente a falha de descriptografia da nossa biblioteca
    if (error instanceof Error && error.message.includes("Não foi possível descriptografar")) {
      // Falha de integridade! Este é um evento de segurança sério.
      // A variável 'user' já está disponível a partir do escopo externo.
      await logAuditEvent({
        userId: user.id,
        action: 'DATA_DECRYPT_FAILURE',
        details: 'Possível violação de integridade de dados.',
      });
      // Retorna uma mensagem genérica para o cliente
      return NextResponse.json(
        { error: 'Falha na verificação de segurança dos dados.' },
        { status: 400 }
      );
    }

    // Tratamento para outros erros inesperados
    console.error("Erro inesperado na API de criptografia:", error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  } // <-- Final do bloco catch
} // <-- Final da função POST