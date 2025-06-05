
// Placeholder for Registration Page
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Criar Conta</CardTitle>
        <CardDescription>Registre-se para começar a usar o PsiGuard.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">A funcionalidade de registro ainda não está implementada neste protótipo.</p>
        <p className="text-sm">Por favor, use as credenciais de login de demonstração:</p>
        <p className="text-sm font-mono mt-1">Email: doctor.jane@psiguard.com</p>
        <p className="text-sm font-mono">Senha: (qualquer senha)</p>
        <Button asChild className="mt-6">
          <Link href="/login">Voltar para Login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
