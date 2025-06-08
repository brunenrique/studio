"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <Logo />
      <h1 className="mt-6 text-3xl font-headline font-bold text-primary">Bem-vindo ao PsiGuard</h1>
      <p className="mt-4 max-w-xl text-foreground">
        Simplifique a gestão de pacientes e agendamentos em um ambiente prático.
      </p>
      <Button className="mt-8" onClick={() => router.push('/dashboard')}>Ir para Dashboard</Button>
    </div>
  );
}
