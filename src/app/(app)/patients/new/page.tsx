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
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  dateOfBirth: z.coerce.date({ required_error: "Data de nascimento é obrigatória." }),
  crm: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewPatientPage() {
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", dateOfBirth: undefined, crm: "" },
  });

  if (!user || user.role !== "PSYCHOLOGIST") {
    return <p className="p-4">Acesso restrito aos psicólogos.</p>;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await addDoc(collection(db, "patients"), {
        name: values.name,
        email: values.email,
        dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
        crm: values.crm || null,
      });
      router.push("/patients");
    } catch (error) {
      console.error("Erro ao salvar paciente", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Novo Paciente</h1>
        <p className="text-muted-foreground">Cadastre um paciente.</p>
      </div>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
          <CardDescription>Preencha os dados do paciente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CRM (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="CRM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
