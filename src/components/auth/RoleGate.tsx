"use client";
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import React from 'react';

interface RoleGateProps {
  allowed: UserRole[];
  children: React.ReactNode;
}

export function RoleGate({ allowed, children }: RoleGateProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!user || !allowed.includes(user.role)) {
    return <p className="p-8">Sem acesso.</p>;
  }

  return <>{children}</>;
}
