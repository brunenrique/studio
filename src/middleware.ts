// Caminho: middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // --- CONDIÇÃO DE SEGURANÇA ---
  // Só executa este middleware em ambiente de produção.
  // Em desenvolvimento, o Next.js define NODE_ENV como 'development'.
  if (process.env.NODE_ENV === 'development') {
    // Se estiver em desenvolvimento, não faz nada e continua para a página.
    return NextResponse.next();
  }

  // A lógica original, que agora só roda em produção:
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');

  if (proto === 'http') {
    const url = new URL(request.nextUrl.href);
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// A configuração do matcher permanece a mesma.
export const config = {
  matcher: '/:path*',
};