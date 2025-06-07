
// src/app/(auth)/register/page.tsx
"use client";

// Placeholder for Registration Page
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Mock user registration function
const mockRegisterUser = async (
  email: string,
  password: string,
  role: string
): Promise<{ success: boolean }> => {
  // In a real application, this would be an API call to your backend
  console.log("Attempting to register user:", { email, password, role });
  // Simulate a successful registration after a delay
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      console.log("Mock registration successful!");
      resolve({ success: true });
    }, 1000);
  });
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PSYCHOLOGIST'); // Default role
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (!email || !password || !role) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      // Replace with actual API call later
      const result = await mockRegisterUser(email, password, role);
      if (result.success) {
        setSuccess(true);
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Handle registration failure (e.g., email already exists)
        setError('Falha no registro. Tente novamente.'); // More specific error handling needed
      }
    } catch (err) {
      setError('Ocorreu um erro durante o registro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Criar Conta</CardTitle>
        <CardDescription>Registre-se para começar a usar o PsiGuard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="PSYCHOLOGIST">Psicólogo</SelectItem>
                {/* Add other roles as needed in the future */}
                {/* <SelectItem value="admin_global">Admin Global</SelectItem> */}
                {/* <SelectItem value="admin_secretario">Admin/Secretário</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">Registro bem-sucedido! Redirecionando...</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Criar Conta'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login">Voltar para Login</Link>
        </div>
      </CardContent>
    </Card>
  );
}
