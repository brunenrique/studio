"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from '@/components/layout/Sidebar';
import { AppHeader } from '@/components/layout/Header';
import { ContextTabs } from '@/components/navigation/ContextTabs';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Usuários podem acessar o sistema sem autenticação
  // portanto o redirecionamento para "/login" foi removido.

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // A aprovação de administradores foi temporariamente desativada,
  // portanto não bloqueamos o acesso de usuários não aprovados.

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <ContextTabs />
        <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
