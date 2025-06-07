/* istanbul ignore file */
import type { TimelineEvent } from './types';
import { mockAppointments, mockPatients } from './mock-data';

export function generateTimelineEvents(patientId?: string): TimelineEvent[] {
  const allEvents: TimelineEvent[] = [];

  const appointments = patientId
    ? mockAppointments.filter(a => a.patientId === patientId)
    : mockAppointments;

  appointments.forEach(a => {
    allEvents.push({
      id: `appt-${a.id}`,
      date: a.dateTime,
      title: `Agendamento com ${a.patientName}`,
      description: a.notes,
    });
  });

  const patients = patientId
    ? mockPatients.filter(p => p.id === patientId)
    : mockPatients;

  patients.forEach(p => {
    p.sessionNotes.forEach(n => {
      allEvents.push({
        id: `note-${n.id}`,
        date: n.date,
        title: `Nota de sessão - ${p.name}`,
        description: n.notes,
      });
    });
  });

  return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
