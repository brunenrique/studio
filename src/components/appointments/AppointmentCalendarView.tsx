"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  History,
} from "lucide-react";
import {
  format,
  parseISO,
  isSameDay,
  isPast,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { BlockTimeDialog } from "./BlockTimeDialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmartModal } from "@/components/SmartModal";
import { AppointmentHistoryModal } from "./AppointmentHistoryModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Appointment, Patient, AttendanceStatus, BlockedTime } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import {
  parseBlockedTimes,
  parseWeeklyBlockedTimes,
} from "@/lib/availability";

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const FILTER_KEY = "psiguard_agenda_status";
const SHOW_CANCELED_KEY = "psiguard_agenda_show_canceled";

export function AppointmentCalendarView({
  appointments,
  patients,
  onUpdateAppointment,
  onDeleteAppointment,
}: AppointmentCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
  const [showCanceled, setShowCanceled] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);
  const [historyFor, setHistoryFor] = useState<Appointment | null>(null);
  const { toast } = useToast();
  const { system, updateSystem } = useSettings();

  useEffect(() => {
    const storedFilter = localStorage.getItem(FILTER_KEY) as
      | ("all" | AttendanceStatus)
      | null;
    const storedShow = localStorage.getItem(SHOW_CANCELED_KEY);
    if (storedFilter) setStatusFilter(storedFilter);
    if (storedShow !== null) setShowCanceled(storedShow === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem(SHOW_CANCELED_KEY, String(showCanceled));
  }, [showCanceled]);

  const statusMap: Record<AttendanceStatus, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "border-yellow-500" },
    present: { label: "Presente", color: "border-green-500" },
    absent: { label: "Ausente", color: "border-red-500" },
    rescheduled: { label: "Remarcado", color: "border-blue-500" },
    canceled: { label: "Cancelado", color: "border-gray-500" },
  };

  const getBadgeVariant = (
    dateTime: string,
    status: AttendanceStatus
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "present") return "default";
    if (status === "absent") return "destructive";
    if (status === "canceled") return "outline";
    if (isPast(parseISO(dateTime)) && status === "pending") return "secondary";
    return "outline";
  };

  const filtered = useMemo(() => {
    return appointments
      .filter(
        (a) =>
          (!selectedDate || isSameDay(parseISO(a.dateTime), selectedDate)) &&
          (statusFilter === "all" || a.status === statusFilter) &&
          (showCanceled || a.status !== "canceled")
      )
      .sort(
        (a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime()
      );
  }, [appointments, selectedDate, statusFilter, showCanceled]);

  const { dailyBlocks, combined } = useMemo(() => {
    const blocks = parseBlockedTimes(
      system.blockedTimes,
      system.defaultSessionDuration
    );
    const weekly = parseWeeklyBlockedTimes(system.weeklyBlockedTimes);
    const dailyBlocks: BlockedTime[] = [];
    blocks.forEach((b) => {
      if (!selectedDate || isSameDay(parseISO(b.dateTime), selectedDate))
        dailyBlocks.push(b);
    });
    if (selectedDate) {
      weekly.forEach((w) => {
        if (selectedDate.getDay() === w.weekday) {
          const [sh, sm] = w.start.split(":" ).map(Number);
          const [eh, em] = w.end.split(":" ).map(Number);
          const start = new Date(selectedDate);
          start.setHours(sh, sm, 0, 0);
          const duration = eh * 60 + em - (sh * 60 + sm);
          dailyBlocks.push({
            id: `w-${w.id}-${format(selectedDate, "yyyyMMdd")}`,
            dateTime: start.toISOString(),
            durationMinutes: duration,
            reason: w.reason,
          });
        }
      });
    }
    type CombinedItem =
      | { type: "appt"; appt: Appointment }
      | { type: "block"; block: BlockedTime };
    const combined: CombinedItem[] = [
      ...filtered.map((a) => ({ type: "appt", appt: a } as const)),
      ...dailyBlocks.map((b) => ({ type: "block", block: b } as const)),
    ].sort((a, b) => {
      const da =
        a.type === "appt"
          ? parseISO(a.appt.dateTime)
          : parseISO(a.block.dateTime);
      const db =
        b.type === "appt"
          ? parseISO(b.appt.dateTime)
          : parseISO(b.block.dateTime);
      return da.getTime() - db.getTime();
    });
    return { dailyBlocks, combined };
  }, [filtered, selectedDate, system]); // useMemo reduz cálculos

  const handleEdit = useCallback((appt: Appointment) => {
    setEditingAppointment(appt);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      onDeleteAppointment(id);
      toast({
        title: "Agendamento Excluído",
        variant: "destructive",
      });
    },
    [onDeleteAppointment, toast]
  );

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    onUpdateAppointment({ ...appt, status });
    toast({ title: "Status Atualizado" });
  };

  return (
    <TooltipProvider>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Agenda</CardTitle>
          <CardDescription>
            Total de {appointments.length} agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="present">Presente</SelectItem>
                  <SelectItem value="absent">Ausente</SelectItem>
                  <SelectItem value="rescheduled">Remarcado</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={showCanceled} onCheckedChange={setShowCanceled} />
                Mostrar cancelados
              </label>
              <Button variant="outline" size="sm" onClick={() => setIsBlockOpen(true)}>
                Bloquear Horário
              </Button>
            </div>
            {combined.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-4">Nenhum agendamento encontrado.</p>
            ) : (
              <ul className="space-y-2">
                {combined.map((item) => (
                  item.type === "block" ? (
                    <li
                      key={item.block.id}
                      className="flex items-center justify-between rounded-md border p-2 bg-gray-200 text-gray-500 line-through"
                    >
                      <span className="font-medium">
                        {format(parseISO(item.block.dateTime), "HH:mm")} - Indisponível
                      </span>
                    </li>
                  ) : (
                    <li
                      key={item.appt.id}
                      className={cn("flex items-center justify-between rounded-md border p-2", statusMap[item.appt.status].color)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(parseISO(item.appt.dateTime), "HH:mm")} - {item.appt.patientName}
                        </span>
                        <Badge variant={getBadgeVariant(item.appt.dateTime, item.appt.status)} className="w-max mt-1">
                          {statusMap[item.appt.status].label}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setHistoryFor(item.appt)}>
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item.appt)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setToDelete(item.appt)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Select
                          value={item.appt.status}
                          onValueChange={v => handleStatusChange(item.appt.id, v as AttendanceStatus)}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="present">Presente</SelectItem>
                            <SelectItem value="absent">Ausente</SelectItem>
                            <SelectItem value="rescheduled">Remarcado</SelectItem>
                            <SelectItem value="canceled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <SmartModal
                        id="delete-appt"
                        open={toDelete?.id === item.appt.id}
                        onClose={() => setToDelete(null)}
                        title="Confirmar Exclusão"
                      >
                        <p className="text-sm">Deseja excluir este agendamento?</p>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button onClick={() => setToDelete(null)}>Cancelar</Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(item.appt.id);
                              setToDelete(null);
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </SmartModal>
                    </li>
                  )
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2 pt-4">
              {Object.entries(statusMap).map(([key, val]) => (
                <Badge key={key} className={val.color} variant="outline">
                  {val.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <AppointmentFormDialog
        appointment={editingAppointment}
        patients={patients}
        appointments={appointments}
        onSave={(data) => {
          setEditingAppointment(null);
          onUpdateAppointment(data);
        }}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      >
        <button className="hidden" />
      </AppointmentFormDialog>
      <BlockTimeDialog
        onSave={(blk) => {
          const updated = system.blockedTimes
            ? `${system.blockedTimes}, ${blk.dateTime}`
            : blk.dateTime;
          updateSystem({ blockedTimes: updated });
          toast({ title: "Horário Bloqueado" });
        }}
        isOpen={isBlockOpen}
        onOpenChange={setIsBlockOpen}
      >
        <button className="hidden" />
      </BlockTimeDialog>
      <AppointmentHistoryModal
        appointmentId={historyFor?.id ?? null}
        open={historyFor !== null}
        onOpenChange={(o) => {
          if (!o) setHistoryFor(null);
        }}
      />
    </TooltipProvider>
  );
}
