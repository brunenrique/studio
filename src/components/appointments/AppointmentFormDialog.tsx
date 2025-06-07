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

  async function onSubmit(values: AppointmentFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const [hours, minutes] = values.time.split(":"").map(Number);
    const combinedDateTime = setMinutes(setHours(values.date, hours), minutes);
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

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  });

  return null; // interface do componente omitida por brevidade
}
