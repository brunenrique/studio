"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { mockPatients } from '@/lib/mock-data';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const TimelineViewer = dynamic(() => import('@/components/analytics/TimelineViewer'), { ssr: false });

export default function TimelineToolPage() {
  const [patient, setPatient] = useState<string>('');
  const { events } = useTimeline(patient || undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Linha do Tempo Interativa</h1>
      <div className="w-64">
        <Select value={patient} onValueChange={(v) => setPatient(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os pacientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os pacientes</SelectItem>
            {mockPatients.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TimelineViewer events={events} />
    </div>
  );
}
