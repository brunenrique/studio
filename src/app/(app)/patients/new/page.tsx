"use client";
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assumindo que a instância do db vem de @/lib/firebase
import { useAuth } from "@/hooks/use-auth"; // Assumindo um hook de autenticação
import { useToast } from "@/hooks/use-toast";

// Schema Zod unificado com os campos de ambas as branches
const schema = z.object({
  name: z.string().min(3, { message: "O nome completo é obrigatório." }),
  email: z.string().email({ message: "O formato do e-mail é inválido." }).optional().or(z.literal('')),
  contact: z.string().min(10, { message: "O contato deve ter pelo menos 10 dígitos." }),
  cpf: z.string().length(11, { message: "O CPF deve ter exatamente 11 dígitos." }),
  dateOfBirth: z.coerce.date({
    required_error: "A data de nascimento é obrigatória.",
  }),
});

type FormValues = z.infer<typeof schema>;

export default function NewPatientPage() {
  const { user } = useAuth(); // Hook para pegar o usuário logado
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      cpf: "",
      dateOfBirth: undefined,
    },
  });

  // Proteção da rota do lado do cliente
  if (!user || user.role !== "psychologist") {
    return <p className="p-4">Acesso restrito a psicólogos.</p>;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await addDoc(collection(db, "patients"), {
        name: values.name,
        email: values.email || null,
        contact: values.contact,
        cpf: values.cpf,
        dateOfBirth: values.dateOfBirth,
        psychologistId: user.uid, // Associa o paciente ao psicólogo logado
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Sucesso!", description: "Paciente cadastrado com sucesso." });
      router.push("/patients");
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Paciente</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para cadastrar um novo paciente no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do paciente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato (Telefone)</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="Apenas números" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      {/* Utilizando input type="date" para simplicidade */}
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar Paciente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
