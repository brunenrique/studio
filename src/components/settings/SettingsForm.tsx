"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const settingsFormSchema = z.object({
  clinicName: z.string().min(1, "Nome da clínica é obrigatório."),
  clinicContact: z.string().min(1, "Contato é obrigatório."),
  startHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida."),
  endHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida."),
  defaultSessionDuration: z.coerce.number().int().positive(),
  externalIntegration: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings(values);
    toast({
      title: "Configurações Salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Configurações Globais</CardTitle>
        <CardDescription>Defina as preferências gerais do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clinicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Clínica</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato da Clínica</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Inicial</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Final</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="defaultSessionDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração Padrão da Sessão (min)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="externalIntegration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integração Externa (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://service.com/api" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button type="submit">Salvar Configurações</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
