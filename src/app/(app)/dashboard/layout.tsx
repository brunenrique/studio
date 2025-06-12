import React from 'react'
import AuthGuard from '@/components/AuthGuard'
import type { UserRole } from '@/lib/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role={'PSYCHOLOGIST' as UserRole}>
      {children}
    </AuthGuard>
  )
}
