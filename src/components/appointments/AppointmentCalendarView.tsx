"use client";

import type { Appointment, Patient, AttendanceStatus } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Clock,
  User,
  AlertCircle,
  Info,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

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

  const filteredAppointments = selectedDate
    ? appointments
        .filter((app) => isSameDay(parseISO(app.dateTime), selectedDate))
        .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime())
    : appointments.sort(
        (a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime()
      );

  const statusMap: Record<
    AttendanceStatus,
    { label: string; icon: React.ElementType; color: string }
  > = {
    pending: { label: "Pendente", icon: Clock, color: "text-yellow-500" },
    present: { label: "Presente", icon: CheckCircle, color: "text-green-500" },
    absent: { label: "Ausente", icon: XCircle, color: "text-red-500" },
    rescheduled: { label: "Remarcado", icon: CalendarIcon, color: "text-blue-500" },
  };

  const getAppointmentBadgeVariant = (
    dateTime: string,
    status: AttendanceStatus
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "present") return "default";
    if (status === "absent") return "destructive";
    if (isPast(parseISO(dateTime)) && status === "pending") return "secondary";
    return "outline";
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" /> Selecione uma Data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow-sm"
              locale={ptBR}
              modifiers={{
                booked: appointments.map((a) => parseISO(a.dateTime)),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  color: "var(--primary)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline flex items-center">
                  <Clock className="mr-2 h-5 w-5" /> Agendamentos para{" "}
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy")
                    : "Todas as Datas"}
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie os agendamentos do dia.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
                Nenhum agendamento para esta data.
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredAppointments.map((app) => {
                  const statusInfo = statusMap[app.status];
                  const appDateTime = parseISO(app.dateTime);
                  const isAppointmentPast = isPast(appDateTime) && !isToday(appDateTime);

                  return (
                    <li
                      key={app.id}
                      className={cn(
                        "p-4 border rounded-lg shadow-sm hover:shadow-md transition-all",
                        isAppointmentPast ? "bg-muted/50 opacity-80" : "bg-card"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-primary flex items-center">
                            <User className="mr-2 h-5 w-5" />{" "}
                            {app.patientName || "Paciente não encontrado"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(appDateTime, "HH:mm")} -{" "}
                            {format(
                              addMinutes(appDateTime, app.durationMinutes),
                              "HH:mm"
                            )}{" "}
                            ({app.durationMinutes} min)
                          </p>
                        </div>
                        <Badge
                          variant={getAppointmentBadgeVariant(
                            app.dateTime,
                            app.status
                          )}
                          className="mt-2 sm:mt-0 self-start sm:self-center"
                        >
                          <statusInfo.icon
                            className={cn("mr-1.5 h-3.5 w-3.5", statusInfo.color)}
                          />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {app.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1 mb-3">
                          Nota: {app.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t">
                        <Select
                          value={app.status}
                          onValueChange={(newStatus) =>
                            handleStatusChange(
                              app.id,
                              newStatus as AttendanceStatus
                            )
                          }
                          disabled={isAppointmentPast && app.status !== "pending"}
                        >
                          <SelectTrigger className="w-full sm:w-[150px] text-xs h-9">
                            <SelectValue placeholder="Alterar Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusMap).map(([key, val]) => (
                              <SelectItem key={key} value={key} className="text-xs">
                                <div className="flex items-center">
                                  <val.icon
                                    className={cn("mr-2 h-4 w-4", val.color)}
                                  />
                                  {val.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex-grow sm:flex-grow-0 flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(app)}
                                className="h-9 w-9"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar Agendamento</p>
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-9 w-9"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este agendamento
                                  para {app.patientName} em{" "}
                                  {format(appDateTime, "dd/MM/yyyy 'às' HH:mm")}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(app.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {isAppointmentPast && app.status === "pending" && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> Este agendamento
                          passado está pendente. Atualize o status.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentFormDialog
        appointment={editingAppointment}
        patients={patients}
        onSave={(data) => {
          onUpdateAppointment(data);
          toast({
            title: editingAppointment
              ? "Agendamento Atualizado"
              : "Agendamento Criado",
            description: `Agendamento para ${data.patientName} salvo.`,
          });
          setIsFormOpen(false);
          setEditingAppointment(null);
        }}
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingAppointment(null);
        }}
      >
        <button className="hidden" />
      </AppointmentFormDialog>

      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Lembretes de Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Lembretes automáticos por e-mail são enviados aos pacientes 24 horas e
            30 minutos antes de cada sessão agendada.
            (Funcionalidade ainda não implementada neste protótipo.)
          </p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
