
"use client";

import { useState, useEffect } from 'react';
import type { Appointment, Patient } from '@/lib/types';
import { mockAppointments, getMockPatientsList } from '@/lib/mock-data';
import { AppointmentCalendarView } from '@/components/appointments/AppointmentCalendarView';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { useToast } from "@/hooks/use-toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]); // Needed for patient selection in form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultDateForNew, setDefaultDateForNew] = useState<Date | undefined>(new Date());
  const { toast } = useToast();


  useEffect(() => {
    // Simulate fetching data
    setAppointments(mockAppointments.map(app => ({
      ...app,
      patientName: getMockPatientsList().find(p => p.id === app.patientId)?.name || "Desconhecido"
    })));
    setPatients(getMockPatientsList());
  }, []);

  const handleAddOrUpdateAppointment = (appointmentData: Appointment) => {
    setAppointments(prevAppointments => {
      const existingIndex = prevAppointments.findIndex(a => a.id === appointmentData.id);
      const patientName = patients.find(p => p.id === appointmentData.patientId)?.name || "Desconhecido";
      const dataWithPatientName = { ...appointmentData, patientName };

      if (existingIndex > -1) {
        const updatedAppointments = [...prevAppointments];
        updatedAppointments[existingIndex] = dataWithPatientName;
        return updatedAppointments;
      } else {
        return [...prevAppointments, dataWithPatientName];
      }
    });
    toast({
      title: appointmentData.id.startsWith("appt-") && appointments.find(a => a.id === appointmentData.id) ? "Agendamento Atualizado" : "Agendamento Criado",
      description: `Agendamento para ${appointmentData.patientName} salvo.`,
    });
    setIsFormOpen(false); // Close dialog
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prevAppointments => prevAppointments.filter(a => a.id !== appointmentId));
    // Toast handled in AppointmentCalendarView
  };
  
  const openNewAppointmentDialog = (date?: Date) => {
    setDefaultDateForNew(date || new Date());
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Agenda de Agendamentos</h1>
            <p className="text-muted-foreground">Visualize, crie e gerencie seus agendamentos.</p>
        </div>
        <AppointmentFormDialog
            appointment={null}
            patients={patients}
            onSave={handleAddOrUpdateAppointment}
            defaultDate={defaultDateForNew}
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
          >
          <Button onClick={() => openNewAppointmentDialog()} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Novo Agendamento
          </Button>
        </AppointmentFormDialog>
      </div>

      <AppointmentCalendarView
        appointments={appointments}
        patients={patients}
        onUpdateAppointment={handleAddOrUpdateAppointment}
        onDeleteAppointment={handleDeleteAppointment}
      />
    </div>
  );
}
