"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { useTimeline } from "@/hooks/useTimeline";
import { usePatientAssessments } from "@/hooks/usePatientAssessments";
import type { TimelineEvent } from "@/lib/types";

export default function PatientHistoryPage({ params }: any) {
  const { user } = useAuth();
  const { events } = useTimeline(params.id);
  const { data: assessments } = usePatientAssessments(params.id);

  if (!user || user.role !== "PSYCHOLOGIST") {
    return <p className="p-4">Acesso restrito aos psicólogos.</p>;
  }

  const extraEvents: TimelineEvent[] = assessments.map((a) => ({
    id: `assessment-${a.id}`,
    date: a.completedAt || a.createdAt,
    title: `Avaliação ${a.testId}`,
    description: a.score !== undefined ? `Score: ${a.score}` : undefined,
  }));

  const allEvents = [...events, ...extraEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const TimelineViewer = dynamic(() => import("@/components/analytics/TimelineViewer"), {
    ssr: false,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Histórico do Paciente</h1>
      <TimelineViewer events={allEvents} />
    </div>
  );
}
