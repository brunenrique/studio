import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import type { UserRole } from '@/lib/types'

interface AuthGuardProps {
  children: React.ReactNode
  role: UserRole
}

export default async function AuthGuard({ children, role }: AuthGuardProps) {
  const user = await getCurrentUser()

  if (!user || user.role !== role) {
    redirect('/login')
  }

  return <>{children}</>
}
