"use client";
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import React from 'react';

interface RoleGateProps {
  allowed: UserRole[];
  children: React.ReactNode;
}

export function RoleGate({ allowed, children }: RoleGateProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  // Temporariamente, não aplicamos validação de função/permissão
  return <>{children}</>;
}
