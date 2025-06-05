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
import { Loader2 } from "lucide-react";
import type { ServiceType } from "@/lib/types";
import { useState, useEffect } from "react";

const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório." }),
  defaultDuration: z.coerce
    .number()
    .int()
    .positive({ message: "Duração deve ser positiva." }),
  price: z.coerce.number().nonnegative().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceTypeFormDialogProps {
  service?: ServiceType | null;
  onSave: (data: ServiceType) => void;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ServiceTypeFormDialog({
  service,
  onSave,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: ServiceTypeFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? {
          name: service.name,
          defaultDuration: service.defaultDuration,
          price: service.price,
        }
      : { name: "", defaultDuration: 50, price: undefined },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        defaultDuration: service.defaultDuration,
        price: service.price,
      });
    } else {
      form.reset({ name: "", defaultDuration: 50, price: undefined });
    }
  }, [service, form, isOpen]);

  async function onSubmit(values: ServiceFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const serviceData: ServiceType = {
      id: service?.id || `svc-${Date.now()}`,
      name: values.name,
      defaultDuration: values.defaultDuration,
      price: values.price,
    };
    onSave(serviceData);
    setIsLoading(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {service ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {service ? "Atualize o serviço." : "Preencha os dados do novo serviço."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Terapia Individual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração Padrão (min)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="200" {...field} />
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : service ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
