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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import {
  parseBlockedTimes,
  parseWeeklyBlockedTimes,
  isDateTimeBlocked,
} from "@/lib/availability";
import {
  format,
  parseISO,
  setHours,
  setMinutes,
  isValid,
} from "date-fns";
import type { Appointment, Patient } from "@/lib/types";
import { generateRecurringAppointments } from "@/lib/recurrence";
import { useState, useEffect, useMemo } from "react";

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Nome é obrigatório." }),
  contact: z.string().min(5, { message: "Contato inválido." }),
  date: z.date({ required_error: "Data é obrigatória." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida (HH:MM)."),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.enum(["daily", "weekly", "biweekly"]).optional(),
  weekdays: z.array(z.number()).optional(),
  occurrences: z.coerce.number().int().positive().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormDialogProps {
  appointment: Appointment | null;
  onSave: (data: Appointment) => void;
  patients: Patient[];
  appointments: Appointment[];
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AppointmentFormDialog({
  appointment,
  onSave,
  patients,
  appointments,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: AppointmentFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { system } = useSettings();
  const { toast } = useToast();

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
          recurring: false,
          frequency: "weekly",
          weekdays: [new Date(appointment.dateTime).getDay()],
          occurrences: 1,
        }
      : {
          patientName: "",
          contact: "",
          date: new Date(),
          time: "09:00",
          notes: "",
          recurring: false,
          frequency: "weekly",
          weekdays: [new Date().getDay()],
          occurrences: 1,
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
          recurring: false,
          frequency: "weekly",
          weekdays: [new Date(appointment.dateTime).getDay()],
          occurrences: 1,
        });
      } else {
        form.reset({
          patientName: "",
          contact: "",
          date: new Date(),
          time: "09:00",
          notes: "",
          recurring: false,
          frequency: "weekly",
          weekdays: [new Date().getDay()],
          occurrences: 1,
        });
      }
    }
  }, [appointment, form, isOpen]);

  const timeOptions = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const total = i * 30;
      const h = String(Math.floor(total / 60)).padStart(2, "0");
      const m = String(total % 60).padStart(2, "0");
      return `${h}:${m}`;
    });
  }, []); // useMemo para calcular apenas uma vez

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const [h, m] = values.time.split(":" ).map(Number);
    const dt = setMinutes(setHours(values.date, h), m);

    const base: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: appointment?.patientId || patients[0]?.id || "",
      patientName: values.patientName,
      contact: values.contact,
      dateTime: dt.toISOString(),
      durationMinutes: system.defaultSessionDuration || 50,
      status: "pending",
      notes: values.notes,
    };

    const recRule = values.recurring
      ? {
          frequency: values.frequency!,
          weekdays: values.weekdays,
          count: values.occurrences,
        }
      : null;

    const items = recRule ? generateRecurringAppointments(base, recRule) : [base];

    const blocks = parseBlockedTimes(system.blockedTimes, system.defaultSessionDuration);
    const weekly = parseWeeklyBlockedTimes(system.weeklyBlockedTimes);

    items.forEach((appt) => {
      const date = parseISO(appt.dateTime);
      const conflict =
        appointments.some((a) => a.dateTime === appt.dateTime) ||
        isDateTimeBlocked(date, blocks, weekly);
      if (conflict) {
        toast({ title: "Horário Ocupado", variant: "destructive" });
      } else {
        onSave(appt);
      }
    });

    setIsLoading(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Novo Agendamento</DialogTitle>
          <DialogDescription>Cadastre uma nova sessão.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="mr-2" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                      <span>Agendamento Recorrente</span>
                    </label>
                  </FormLabel>
                  {field.value && (
                    <div className="space-y-2 pl-4">
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Diária</SelectItem>
                                <SelectItem value="weekly">Semanal</SelectItem>
                                <SelectItem value="biweekly">Quinzenal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weekdays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dias da Semana</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {[0,1,2,3,4,5,6].map(d => (
                                <label key={d} className="flex items-center space-x-1">
                                  <input type="checkbox" checked={field.value?.includes(d)} onChange={e => {
                                    if (e.target.checked) field.onChange([...(field.value || []), d]);
                                    else field.onChange((field.value || []).filter(v => v !== d));
                                  }} />
                                  <span>{['Dom','Seg','Ter','Qua','Qui','Sex','Sab'][d]}</span>
                                </label>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="occurrences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repetições</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
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
