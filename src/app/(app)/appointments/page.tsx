"use client";

import { useEffect, useState } from "react";
import type { Appointment, Patient } from "@/lib/types";
import { AppointmentCalendarView } from "@/components/appointments/AppointmentCalendarView";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AppointmentFormDialog } from "@/components/appointments/AppointmentFormDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebaseClient";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAppointments } from "@/hooks/useAppointments";
import { mockPatients } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { generateICS } from "@/lib/ics";

export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { system } = useSettings();

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const handleAddOrUpdateAppointment = async (appointmentData: Appointment) => {
    const exists = appointments.find((a) => a.id === appointmentData.id);
    if (exists) {
      await updateDoc(doc(db, "appointments", appointmentData.id), {
        patientName: appointmentData.patientName,
        contact: appointmentData.contact || "",
        dateTime: appointmentData.dateTime,
        durationMinutes: appointmentData.durationMinutes,
        status: appointmentData.status,
        notes: appointmentData.notes || "",
        psychologistId: user?.id || "",
      });
      await addDoc(
        collection(db, "appointments", appointmentData.id, "history"),
        {
          before: exists,
          after: appointmentData,
          userId: user?.id || "unknown",
          timestamp: serverTimestamp(),
        },
      );
      toast({ title: "Agendamento Atualizado" });
    } else {
      const { id, ...data } = appointmentData;
      data.psychologistId = user?.id || "";
      await addDoc(collection(db, "appointments"), data);
      toast({ title: "Novo Agendamento" });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteDoc(doc(db, "appointments", appointmentId));
    toast({ title: "Agendamento Cancelado", variant: "destructive" });
  };

  const myAppointments = appointments.filter(
    (a) => a.psychologistId === user?.id,
  );

  const handleExport = () => {
    if (system.calendarExportMethod === "ics") {
      const ics = generateICS(myAppointments);
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "agenda.ics";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Integração com Google não implementada.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Agendamentos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os agendamentos das sessões.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            className="shadow-md"
          >
            Exportar Agenda
          </Button>
          <AppointmentFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSave={handleAddOrUpdateAppointment}
            patients={patients}
            appointment={null}
          >
            <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" />
              Novo Agendamento
            </Button>
          </AppointmentFormDialog>
        </div>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Calendário de Sessões</CardTitle>
          <CardDescription>
            Total de {myAppointments.length} agendamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentCalendarView
            appointments={myAppointments}
            patients={patients}
            onUpdateAppointment={handleAddOrUpdateAppointment} // ✅ corrigido aqui
            onDeleteAppointment={handleDeleteAppointment} // ✅ e aqui
          />
        </CardContent>
      </Card>
    </div>
  );
}
