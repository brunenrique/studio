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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { Patient } from "@/lib/types";
import { useState } from "react";
import React from 'react';
const patientFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  contact: z.string().min(5, { message: "Contato inválido." }), // Can be email or phone
  cpf: z.string().length(11, { message: "CPF deve ter 11 dígitos." }),
  dateOfBirth: z.date({ required_error: "Data de nascimento é obrigatória." }),
  treatmentPlan: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormDialogProps {
  patient?: Patient | null;
  onSave: (data: Patient) => void;
  children: React.ReactNode; // Trigger element
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PatientFormDialog({ patient, onSave, children, isOpen: controlledIsOpen, onOpenChange: controlledOnOpenChange }: PatientFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? {
          ...patient,
          dateOfBirth: patient.dateOfBirth
            ? parseISO(patient.dateOfBirth)
            : new Date(),
        }
      : {
          name: "",
          contact: "",
          cpf: "",
          dateOfBirth: undefined,
          treatmentPlan: "",
        },
  });
  
  React.useEffect(() => {
    if (patient) {
      form.reset({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? parseISO(patient.dateOfBirth) : new Date(),
        treatmentPlan: patient.treatmentPlan || "",
      });
    } else {
      form.reset({ name: "", contact: "", cpf: "", dateOfBirth: undefined, treatmentPlan: "" });
    }
  }, [patient, form, isOpen]);


  async function onSubmit(values: PatientFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let encryptedCpf = values.cpf;
    try {
      const res = await fetch('/api/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'encrypt', data: values.cpf })
      });
      const json = await res.json();
      if (json.result) encryptedCpf = json.result;
    } catch (err) {
      console.error('Failed to encrypt CPF', err);
    }

    const patientData: Patient = {
      id: patient?.id || `patient-${Date.now()}`, // Generate new ID or use existing
      ...values,
      cpf: encryptedCpf,
      dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
      sessionNotes: patient?.sessionNotes || [],
      treatmentPlan: values.treatmentPlan || "",
    };
    onSave(patientData);
    setIsLoading(false);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">{patient ? "Editar Paciente" : "Adicionar Novo Paciente"}</DialogTitle>
          <DialogDescription>
            {patient ? "Atualize os detalhes do paciente." : "Preencha as informações do novo paciente."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do Paciente" {...field} />
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
                  <FormLabel>Contato (Email/Telefone)</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com ou (XX) XXXXX-XXXX" {...field} />
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
                    <Input placeholder="Somente números" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatmentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano Terapêutico</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Objetivos e etapas do tratamento"
                      {...field}
                    />
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (patient ? "Salvar Alterações" : "Adicionar Paciente")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
