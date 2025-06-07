"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

export function useRequireRole(role: UserRole) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== role)) {
      router.replace('/');
    }
  }, [isLoading, user, role, router]);

  return { user, isLoading, hasRole: !!user && user.role === role };
}
