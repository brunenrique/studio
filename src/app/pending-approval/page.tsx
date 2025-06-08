"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-headline font-bold mb-4">Aguardando Aprovação</h1>
      <p className="mb-6 max-w-md">
        Seu cadastro foi recebido e aguarda aprovação de um administrador.
        Você receberá acesso assim que for aprovado.
      </p>
      <Button onClick={() => router.push('/dashboard')}>Ir para Dashboard</Button>
    </div>
  );
}
