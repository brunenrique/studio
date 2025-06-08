"use client";

// (restante do código abaixo)

import dynamic from 'next/dynamic';
import { mockAppointments, mockPatients } from '@/lib/mock-data';
import type { TimelineEvent } from '@/lib/types';
import { useMemo } from 'react';

const TimelineViewer = dynamic(() => import('@/components/analytics/TimelineViewer'), { ssr: false });

export default function TimelinePage() {
  const events = useMemo(() => {
    const result: TimelineEvent[] = [];
    mockAppointments.forEach((a) => {
      result.push({
        id: `appt-${a.id}`,
        date: a.dateTime,
        title: `Agendamento com ${a.patientName}`,
        description: a.notes,
      });
    });

    mockPatients.forEach((p) => {
      p.sessionNotes.forEach((n) => {
        result.push({
          id: `note-${n.id}`,
          date: n.date,
          title: `Nota de sessão - ${p.name}`,
          description: n.notes,
        });
      });
    });
    return result;
  }, []); // Eventos criados apenas uma vez

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Linha do Tempo</h1>
      <TimelineViewer events={events} />
    </div>
  );
}
