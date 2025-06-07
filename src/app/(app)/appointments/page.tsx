"use client";

import { useEffect, useState } from 'react';
import type { Appointment, Patient, WaitingListItem } from '@/lib/types';
import { AppointmentCalendarView } from '@/components/appointments/AppointmentCalendarView';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { db } from '@/lib/firebaseClient';
import { addDoc, collection, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAppointments } from '@/hooks/useAppointments';
import { mockPatients, mockWaitingList } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { WaitlistDragList } from '@/components/waitlist/WaitlistDragList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WeeklySchedule } from '@/components/appointments/WeeklySchedule';

export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [waitingList, setWaitingList] = useState(mockWaitingList);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

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
      addNotification(`Agendamento de ${appointmentData.patientName} atualizado`);
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

  const handleDropFromWaitlist = (date: Date, item: WaitingListItem) => {
    const iso = date.toISOString();
    if (appointments.some(a => a.dateTime === iso)) {
      toast({
        title: 'Horário Ocupado',
        variant: 'destructive',
      });
      return;
    }
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: item.id,
      patientName: item.patientName,
      contact: item.contact,
      dateTime: iso,
      durationMinutes: 50,
      status: 'pending',
      notes: item.notes,
    };
    handleAddOrUpdateAppointment(newAppt);
    setWaitingList(prev => prev.filter(w => w.id !== item.id));
  };

  if (user?.role === 'AGENDAMENTO') {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-headline">Agendamentos</h1>
              </div>
              <AppointmentFormDialog
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleAddOrUpdateAppointment}
                patients={patients}
                appointments={appointments}
                appointment={null}
              >
                <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Novo
                </Button>
              </AppointmentFormDialog>
            </div>
            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle>Agenda Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklySchedule
                  appointments={appointments}
                  onDropFromWaitlist={handleDropFromWaitlist}
                />
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-64">
            <h2 className="text-lg font-bold mb-2">Lista de Espera</h2>
            <WaitlistDragList items={waitingList} />
          </div>
        </div>
      </DndProvider>
    );
  }

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
          appointments={appointments}
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
