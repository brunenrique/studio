"use client";

import type { Appointment, Patient, AttendanceStatus } from "@/lib/types";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Ban,
  Edit3,
  Trash2,
  Clock,
  User,
  AlertCircle,
  Info,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  format,
  parseISO,
  isSameDay,
  isPast,
  isToday,
  addMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmartModal } from "@/components/SmartModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export function AppointmentCalendarView({
  appointments,
  patients,
  onUpdateAppointment,
  onDeleteAppointment,
}: AppointmentCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    onDeleteAppointment(appointmentId);
    toast({
      title: "Agendamento Excluído",
      description: "O agendamento foi removido com sucesso.",
      variant: "destructive",
    });
  };

  const handleStatusChange = (appointmentId: string, status: AttendanceStatus) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (appointment) {
      onUpdateAppointment({ ...appointment, status });
      toast({
        title: "Status Atualizado",
        description: `Status do agendamento de ${appointment.patientName} alterado para ${statusMap[status].label}.`,
      });
    }
  };

  const filteredAppointments = appointments
    .filter(
      (app) =>
        (!selectedDate || isSameDay(parseISO(app.dateTime), selectedDate)) &&
        (statusFilter === "all" || app.status === statusFilter),
    )
    .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());

  const statusMap: Record<AttendanceStatus, { label: string; icon: React.ElementType; color: string }> = {
    pending: { label: "Pendente", icon: Clock, color: "text-yellow-500" },
    present: { label: "Presente", icon: CheckCircle, color: "text-green-500" },
    absent: { label: "Ausente", icon: XCircle, color: "text-red-500" },
    rescheduled: { label: "Remarcado", icon: CalendarIcon, color: "text-blue-500" },
    canceled: { label: "Cancelado", icon: Ban, color: "text-gray-500" },
  };

  const getAppointmentBadgeVariant = (dateTime: string, status: AttendanceStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "present") return "default";
    if (status === "absent") return "destructive";
    if (status === "canceled") return "outline";
    if (isPast(parseISO(dateTime)) && status === "pending") return "secondary";
    return "outline";
  };

  return (
    <TooltipProvider>
      [...restante do conteúdo permanece inalterado...]
    </TooltipProvider>
  );
}
