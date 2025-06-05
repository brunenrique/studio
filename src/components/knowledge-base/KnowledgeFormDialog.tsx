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
import { Loader2 } from "lucide-react";
import type { KnowledgeBaseItem } from "@/lib/types";
import { useState } from "react";

const knowledgeFormSchema = z.object({
  title: z.string().min(2, { message: "Título é obrigatório." }),
  description: z.string().min(2, { message: "Descrição é obrigatória." }),
  link: z.string().url({ message: "Link inválido." }).optional().or(z.literal("")),
});

type KnowledgeFormValues = z.infer<typeof knowledgeFormSchema>;

interface KnowledgeFormDialogProps {
  item?: KnowledgeBaseItem | null;
  onSave: (data: KnowledgeBaseItem) => void;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function KnowledgeFormDialog({ item, onSave, children, isOpen: controlledIsOpen, onOpenChange: controlledOnOpenChange }: KnowledgeFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<KnowledgeFormValues>({
    resolver: zodResolver(knowledgeFormSchema),
    defaultValues: item ? { ...item, link: item.link || "" } : { title: "", description: "", link: "" },
  });

  function resetForm() {
    form.reset(item ? { ...item, link: item.link || "" } : { title: "", description: "", link: "" });
  }

  async function onSubmit(values: KnowledgeFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItem: KnowledgeBaseItem = {
      id: item?.id || `kb-${Date.now()}`,
      title: values.title,
      description: values.description,
      link: values.link || undefined,
      createdDate: item?.createdDate || new Date().toISOString(),
    };
    onSave(newItem);
    setIsLoading(false);
    onOpenChange(false);
    resetForm();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">{item ? "Editar Nota" : "Nova Nota"}</DialogTitle>
          <DialogDescription>
            {item ? "Atualize sua nota." : "Adicione uma nova referência ou anotação."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da nota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Conteúdo ou resumo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
