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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, setHours, setMinutes, isValid } from "date-fns";
import type { Appointment } from "@/lib/types";
import { useState, useEffect } from "react";

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Nome é obrigatório." }),
  contact: z.string().min(5, { message: "Contato inválido." }),
  date: z.date({ required_error: "Data é obrigatória." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida (HH:MM)."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAppointmentDialogProps {
  appointment: Appointment | null;
  onSave: (data: Appointment) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditAppointmentDialog({
  appointment,
  onSave,
  onDelete,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: EditAppointmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: appointment
      ? {
          patientName: appointment.patientName,
          contact: appointment.contact || "",
          date: parseISO(appointment.dateTime),
          time: format(parseISO(appointment.dateTime), "HH:mm"),
          notes: appointment.notes || "",
        }
      : {
          patientName: "",
          contact: "",
          date: new Date(),
          time: "09:00",
          notes: "",
        },
  });

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        form.reset({
          patientName: appointment.patientName,
          contact: appointment.contact || "",
          date: parseISO(appointment.dateTime),
          time: format(parseISO(appointment.dateTime), "HH:mm"),
          notes: appointment.notes || "",
        });
      }
    }
  }, [appointment, form, isOpen]);

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const total = i * 30;
    const h = String(Math.floor(total / 60)).padStart(2, "0");
    const m = String(total % 60).padStart(2, "0");
    return `${h}:${m}`;
  });

  async function onSubmit(values: FormValues) {
    if (!appointment) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const [h, m] = values.time.split(":" ).map(Number);
    const dt = setMinutes(setHours(values.date, h), m);
    const updated: Appointment = {
      ...appointment,
      patientName: values.patientName,
      contact: values.contact,
      dateTime: dt.toISOString(),
      notes: values.notes,
    };
    onSave(updated);
    setIsLoading(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Editar Agendamento</DialogTitle>
          <DialogDescription>Atualize ou cancele este agendamento.</DialogDescription>
        </DialogHeader>
        {appointment && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do paciente" {...field} />
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(xx) xxxxx-xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> 
                              {field.value && isValid(field.value) ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <Clock className="mr-2 h-4 w-4 opacity-50" />
                            <SelectValue placeholder="HH:MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="max-h-60">
                          {timeOptions.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4 flex justify-between">
                <Button type="button" variant="destructive" onClick={() => { onDelete(appointment.id); onOpenChange(false); }}>
                  Cancelar Agendamento
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                    Fechar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

