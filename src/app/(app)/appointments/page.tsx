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
import { addDoc, collection, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAppointments } from '@/hooks/useAppointments';
import { mockPatients } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
      await addDoc(collection(db, 'appointments', appointmentData.id, 'history'), {
        before: exists,
        after: appointmentData,
        action: 'updated',
        userId: user?.id || 'unknown',
        timestamp: serverTimestamp(),
      });
      toast({ title: 'Agendamento Atualizado' });
    } else {
      const { id, ...data } = appointmentData;
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...data,
        createdBy: user?.id || 'unknown',
      });
      await addDoc(collection(db, 'appointments', docRef.id, 'history'), {
        before: null,
        after: { id: docRef.id, ...data, createdBy: user?.id || 'unknown' },
        action: 'created',
        userId: user?.id || 'unknown',
        timestamp: serverTimestamp(),
      });
      toast({ title: 'Novo Agendamento' });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    const ref = doc(db, 'appointments', appointmentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const before = snap.data() as Appointment;
    const after = { ...before, status: 'canceled' } as Appointment;
    await updateDoc(ref, { status: 'canceled' });
    await addDoc(collection(ref, 'history'), {
      before,
      after,
      action: 'canceled',
      userId: user?.id || 'unknown',
      timestamp: serverTimestamp(),
    });
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
