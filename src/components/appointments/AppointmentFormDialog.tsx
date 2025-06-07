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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { cn, formatCPF, isValidCPF } from "@/lib/utils";
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
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida (HH:MM)."),
  durationMinutes: z.coerce.number().int().positive("Duração deve ser positiva."),
  status: z.enum(["pending", "present", "absent", "rescheduled"]),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormDialogProps {
  appointment?: Appointment | null;
  patients: Patient[];
  onSave: (data: Appointment) => void;
  children: React.ReactNode; // Trigger element
  defaultDate?: Date; // Optional default date for new appointments
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
  onOpenChange: controlledOnOpenChange
}: AppointmentFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientQuery, setPatientQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;
  
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


  async function onSubmit(values: AppointmentFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const [hours, minutes] = values.time.split(":").map(Number);
    const combinedDateTime = setMinutes(setHours(values.date, hours), minutes);

    const appointmentData: Appointment = {
      id: appointment?.id || `appt-${Date.now()}`,
      patientId: values.patientId,
      patientName: patients.find(p => p.id === values.patientId)?.name ?? "",
      dateTime: combinedDateTime.toISOString(),
      durationMinutes: values.durationMinutes,
      status: values.status as AttendanceStatus,
      notes: values.notes,
    };
    onSave(appointmentData);
    setIsLoading(false);
    onOpenChange(false);
  }

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => { // Every 30 minutes
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">{appointment ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Atualize os detalhes do agendamento." : "Preencha as informações do novo agendamento."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        value={patientQuery}
                        onChange={e => {
                          setPatientQuery(e.target.value);
                          setShowSuggestions(true);
                          field.onChange('');
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Nome do paciente"
                        autoComplete="off"
                      />
                      {showSuggestions && filteredPatients.length > 0 && (
                        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-background shadow-md">
                          {filteredPatients.map(p => (
                            <li
                              key={p.id}
                              className="cursor-pointer px-2 py-1 hover:bg-accent"
                              onMouseDown={() => {
                                setPatientQuery(p.name);
                                field.onChange(p.id);
                                form.setValue('contact', p.contact);
                                form.setValue('cpf', formatCPF(p.cpf || ''));
                                setShowSuggestions(false);
                              }}
                            >
                              <span className="block text-sm font-medium">{p.name}</span>
                              <span className="block text-xs text-muted-foreground">
                                {p.cpf ? formatCPF(p.cpf) : 'Sem CPF'}
                                {` • Último: ${getLastAttendance(p) ?? 'N/A'}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                    <Input placeholder="(XX) XXXXX-XXXX" {...field} />
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
                    <Input
                      {...field}
                      onChange={e => field.onChange(formatCPF(e.target.value))}
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
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
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
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
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
                          {timeOptions.map(timeOpt => (
                            <SelectItem key={timeOpt} value={timeOpt}>{timeOpt}</SelectItem>
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
                  <FormLabel>Duração (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
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
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="present">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="rescheduled">Remarcado</SelectItem>
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
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas sobre o agendamento..." {...field} />
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (appointment ? "Salvar Alterações" : "Criar Agendamento")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
