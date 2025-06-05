
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando PsiGuard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <Logo />
      <h1 className="mt-6 text-3xl font-headline font-bold text-primary">Bem-vindo ao PsiGuard</h1>
      <p className="mt-4 max-w-xl text-foreground">
        Simplifique a gestão de pacientes e agendamentos em um ambiente seguro e prático.
      </p>
      <ul className="mt-6 space-y-1 text-muted-foreground text-sm">
        <li>• Controle de usuários e permissões</li>
        <li>• Prontuário eletrônico seguro</li>
        <li>• Gerenciamento de agenda e lista de espera</li>
      </ul>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => router.push('/login')}>Entrar</Button>
        <Button variant="outline" onClick={() => router.push('/register')}>Registrar</Button>
      </div>
    </div>
  );
}
