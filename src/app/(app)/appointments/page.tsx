"use client";

import { useEffect, useState } from 'react';
import type { Appointment, Patient } from '@/lib/types';
import { AppointmentCalendarView } from '@/components/appointments/AppointmentCalendarView';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient';
import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAppointments } from '@/hooks/useAppointments';
import { mockPatients } from '@/lib/mock-data';

export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const handleAddOrUpdateAppointment = async (appointmentData: Appointment) => {
    const exists = appointments.find((a) => a.id === appointmentData.id);
    if (exists) {
      await updateDoc(doc(db, 'appointments', appointmentData.id), {
        patientName: appointmentData.patientName,
        contact: appointmentData.contact || '',
        dateTime: appointmentData.dateTime,
        durationMinutes: appointmentData.durationMinutes,
        status: appointmentData.status,
        notes: appointmentData.notes || '',
      });
      toast({ title: 'Agendamento Atualizado' });
    } else {
      const { id, ...data } = appointmentData;
      await addDoc(collection(db, 'appointments'), data);
      toast({ title: 'Novo Agendamento' });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    toast({ title: 'Agendamento Cancelado', variant: 'destructive' });
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
