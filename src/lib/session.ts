// Caminho: src/lib/session.ts

import { cookies } from 'next/headers'
import { adminAuth } from './firebaseAdmin'

// IMPORTANTE: Este é um arquivo de exemplo. Você deve adaptá-lo
// para o seu provedor de autenticação (Next-Auth, Clerk, Firebase Admin, etc.).

// Definindo um tipo básico para o usuário. Adicione mais campos se necessário.
interface UserSession {
  id: string
  name?: string | null
  email?: string | null
  role?: string // Ex: 'psychologist', 'admin'
}
  
  /**
   * Obtém os dados do usuário logado na sessão atual do servidor.
   * Esta função PRECISA ser adaptada para o seu sistema de autenticação.
   * 
   * @returns {Promise<UserSession | null>} Retorna o objeto do usuário se logado, ou null se não estiver.
   */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('idToken')?.value
  if (!token) return null

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    return {
      id: decoded.uid,
      name: decoded.name ?? null,
      email: decoded.email ?? null,
      role: (decoded as any).role,
    }
  } catch (err) {
    console.error('Failed to verify Firebase ID token', err)
    return null
  }
}
