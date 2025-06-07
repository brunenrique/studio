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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { cn, formatCPF, isValidCPF } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { parseBlockedTimes, parseWeeklyBlockedTimes, isDateTimeBlocked } from "@/lib/availability";
import { format, parseISO, setHours, setMinutes, addMinutes, isValid } from "date-fns";
import type { Appointment, Patient, AttendanceStatus } from "@/lib/types";
import { mockAppointments } from "@/lib/mock-data";
import { useState, useEffect } from "react";

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Paciente é obrigatório."),
  contact: z.string().optional(),
  cpf: z.string().optional().refine(v => !v || isValidCPF(v), {
    message: "CPF inválido.",
  }),
  date: z.date({ required_error: "Data é obrigatória." }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida (HH:MM)."),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duração deve ser positiva."),
  status: z.enum(["pending", "present", "absent", "rescheduled", "canceled"]),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormDialogProps {
  appointment?: Appointment | null;
  patients: Patient[];
  onSave: (data: Appointment) => void;
  children: React.ReactNode;
  defaultDate?: Date;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AppointmentFormDialog({
  appointment,
  patients,
  onSave,
  children,
  defaultDate,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: AppointmentFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientQuery, setPatientQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { system } = useSettings();

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen;

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: appointment
      ? {
          patientId: appointment.patientId,
          contact: "",
          cpf: "",
          date: parseISO(appointment.dateTime),
          time: format(parseISO(appointment.dateTime), "HH:mm"),
          durationMinutes: appointment.durationMinutes,
          status: appointment.status,
          notes: appointment.notes || "",
        }
      : {
          patientId: "",
          contact: "",
          cpf: "",
          date: defaultDate || new Date(),
          time: "09:00",
          durationMinutes: 50,
          status: "pending",
          notes: "",
        },
  });

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientQuery.toLowerCase())
  );

  const getLastAttendance = (p: Patient): string | null => {
    const appts = mockAppointments.filter(a => a.patientId === p.id);
    const dates = [
      ...appts.map(a => new Date(a.dateTime)),
      ...p.sessionNotes.map(n => new Date(n.date)),
    ];
    if (dates.length === 0) return null;
    const last = dates.reduce((prev, cur) => (cur > prev ? cur : prev));
    return format(last, 'dd/MM/yyyy');
  };

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        const patient = patients.find(p => p.id === appointment.patientId);
        form.reset({
          patientId: appointment.patientId,
          contact: patient?.contact || '',
          cpf: patient?.cpf ? formatCPF(patient.cpf) : '',
          date: parseISO(appointment.dateTime),
          time: format(parseISO(appointment.dateTime), "HH:mm"),
          durationMinutes: appointment.durationMinutes,
          status: appointment.status,
          notes: appointment.notes || "",
        });
        setPatientQuery(patient?.name || '');
      } else {
        form.reset({
          patientId: "",
          contact: "",
          cpf: "",
          date: defaultDate || new Date(),
          time: "09:00",
          durationMinutes: 50,
          status: "pending",
          notes: "",
        });
        setPatientQuery('');
      }
    }
  }, [appointment, defaultDate, form, isOpen, patients]);

  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === 'contact') {
        const existing = patients.find(p => p.contact === values.contact);
        if (values.contact && existing && existing.id !== form.getValues('patientId')) {
          setPhoneError('Telefone já cadastrado para outro paciente.');
        } else {
          setPhoneError(null);
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form, patients]);

  async function onSubmit(values: AppointmentFormValues) {
    if (phoneError) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const [hours, minutes] = values.time.split(":").map(Number);
    const combinedDateTime = setMinutes(setHours(values.date, hours), minutes);
    if (isDateTimeBlocked(combinedDateTime, blocked, weekly)) {
      setIsLoading(false);
      return;
    }
    const appointmentData: Appointment = {
      id: appointment?.id || `appt-${Date.now()}`,
      patientId: values.patientId,
      patientName: patients.find((p) => p.id === values.patientId)?.name ?? "",
      dateTime: combinedDateTime.toISOString(),
      durationMinutes: values.durationMinutes,
      status: values.status as AttendanceStatus,
      notes: values.notes,
    };
    onSave(appointmentData);
    setIsLoading(false);
    onOpenChange(false);
  }

  const blocked = parseBlockedTimes(system.blockedTimes, system.defaultSessionDuration);
  const weekly = parseWeeklyBlockedTimes(system.weeklyBlockedTimes);
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }).filter((t) => {
    const [h, m] = t.split(":" ).map(Number);
    const date = setMinutes(setHours(form.getValues("date"), h), m);
    return !isDateTimeBlocked(date, blocked, weekly);
  });

  const handlePatientSelect = (p: Patient) => {
    form.setValue('patientId', p.id);
    form.setValue('contact', p.contact);
    form.setValue('cpf', p.cpf ? formatCPF(p.cpf) : '');
    setPatientQuery(p.name);
    setShowSuggestions(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {appointment ? 'Atualize as informações do agendamento.' : 'Preencha os dados para criar um agendamento.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="relative">
              <FormField
                control={form.control}
                name="patientId"
                render={() => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <FormControl>
                      <Input
                        value={patientQuery}
                        onChange={(e) => {
                          setPatientQuery(e.target.value);
                          setShowSuggestions(true);
                          form.setValue('patientId', '');
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Nome do paciente"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showSuggestions && filteredPatients.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow">
                  {filteredPatients.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handlePatientSelect(p)}
                      className="flex w-full cursor-pointer items-start px-3 py-2 text-left hover:bg-muted"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Última sessão: {getLastAttendance(p) ?? 'N/A'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                  {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
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
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                    />
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
                          <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value && isValid(field.value) ? (
                              format(field.value, 'dd/MM/yyyy')
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
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
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
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (min)</FormLabel>
                  <FormControl>
                    <Input type="number" min={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="present">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="rescheduled">Remarcado</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
