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
import React, { useState } from "react";
import { useRecurringTasks } from "@/contexts/RecurringTasksContext";
import { useToast } from "@/hooks/use-toast";

const taskFormSchema = z.object({
  description: z.string().min(3, { message: "Descrição obrigatória." }),
  intervalDays: z
    .string()
    .min(1)
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Intervalo deve ser maior que zero." }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface AddRecurringTaskDialogProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddRecurringTaskDialog({
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: AddRecurringTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useRecurringTasks();
  const { toast } = useToast();

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { description: "", intervalDays: 30 },
  });

  async function onSubmit(values: TaskFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addTask({
      id: `task-${Date.now()}`,
      description: values.description,
      intervalDays: values.intervalDays,
      lastCompleted: new Date().toISOString(),
    });
    toast({ title: "Tarefa Adicionada", description: "Lembrete criado com sucesso." });
    setIsLoading(false);
    onOpenChange(false);
    form.reset({ description: "", intervalDays: 30 });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Nova Tarefa Recorrente</DialogTitle>
          <DialogDescription>Configure a descrição e a periodicidade.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Revisar prontuários" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intervalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddRecurringTaskDialog;
