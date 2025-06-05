"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Template, TemplateCategory } from "@/lib/types";
import { useState, useEffect } from "react";

const templateFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório." }),
  category: z.enum(["session-note", "email", "treatment-plan"]),
  content: z.string().min(1, { message: "Conteúdo é obrigatório." }),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface TemplateFormDialogProps {
  template?: Template | null;
  onSave: (data: Template) => void;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TemplateFormDialog({
  template,
  onSave,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: TemplateFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: template
      ? { name: template.name, category: template.category, content: template.content }
      : { name: "", category: "session-note" as TemplateCategory, content: "" },
  });

  useEffect(() => {
    if (template) {
      form.reset({ name: template.name, category: template.category, content: template.content });
    } else {
      form.reset({ name: "", category: "session-note", content: "" });
    }
  }, [template, form, isOpen]);

  async function onSubmit(values: TemplateFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const templateData: Template = {
      id: template?.id || `tpl-${Date.now()}`,
      ...values,
    };
    onSave(templateData);
    setIsLoading(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {template ? "Editar Modelo" : "Novo Modelo"}
          </DialogTitle>
          <DialogDescription>
            {template ? "Atualize o modelo." : "Preencha os dados do novo modelo."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="session-note">Nota de Sessão</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="treatment-plan">Plano de Tratamento</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Digite o conteúdo do modelo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : template ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
