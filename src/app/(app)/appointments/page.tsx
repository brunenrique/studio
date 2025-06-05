"use client";

import { useEffect, useState } from 'react';
import type { Appointment, Patient } from '@/lib/types';
import { mockAppointments, mockPatients } from '@/lib/mock-data';
import { AppointmentCalendarView } from '@/components/appointments/AppointmentCalendarView';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAppointments(mockAppointments);
    setPatients(mockPatients);
  }, []);

  const handleAddOrUpdateAppointment = (appointmentData: Appointment) => {
    setAppointments(prevAppointments => {
      const existingIndex = prevAppointments.findIndex(a => a.id === appointmentData.id);
      if (existingIndex > -1) {
        const updated = [...prevAppointments];
        updated[existingIndex] = appointmentData;
        return updated;
      } else {
        return [...prevAppointments, appointmentData];
      }
    });

    toast({
      title:
        appointmentData.id.startsWith("appt-") &&
        appointments.find(a => a.id === appointmentData.id)
          ? "Agendamento Atualizado"
          : "Novo Agendamento",
      description: `Agendamento para ${appointmentData.patientName} salvo com sucesso.`,
    });

    setIsFormOpen(false);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
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

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Calendário de Sessões</CardTitle>
          <CardDescription>Total de {appointments.length} agendamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentCalendarView
            appointments={appointments}
            patients={patients}
            onUpdateAppointment={handleAddOrUpdateAppointment} // ✅ corrigido aqui
            onDeleteAppointment={handleDeleteAppointment}     // ✅ e aqui
          />
        </CardContent>
      </Card>
    </div>
  );
}
