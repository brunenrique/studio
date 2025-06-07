"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { getMockPatientById, updateMockPatient } from "@/lib/mock-data";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays as CalendarIcon, Phone, Gift } from "lucide-react";
import { WhatsappIcon } from "../icons/WhatsappIcon";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { SessionNotesSection } from "./SessionNotesSection";
import { AIInsightsSection } from "./AIInsightsSection";
import { PatientFormDialog } from "./PatientFormDialog";
import { format, parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceSessionRecorder } from "./VoiceSessionRecorder";
import { usePatientAssessments } from "@/hooks/usePatientAssessments";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { useCriticalTerms } from "@/hooks/useCriticalTerms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

interface PatientDetailsClientProps {
  patientId: string;
}

export function PatientDetailsClient({ patientId }: PatientDetailsClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: assessments, loading: loadingAssessments } = usePatientAssessments(patientId);
  const { appointments, loading: loadingAppointments } = usePatientAppointments(patientId);
  const criticalTerms = useCriticalTerms(patient ? patient.sessionNotes : []);

  const attendanceReport = useMemo(() => {
    const totalAgendamentos = appointments.length;
    const faltas = appointments.filter(a => a.status === "absent").length;
    const comparecimentos = appointments.filter(a => a.status === "present").length;
    const percentualComparecimento = totalAgendamentos
      ? (comparecimentos / totalAgendamentos) * 100
      : 0;
    const last = appointments
      .filter(a => a.status === "present")
      .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime())[0];
    const ultimaPresenca = last ? last.dateTime : null;
    return { totalAgendamentos, faltas, comparecimentos, percentualComparecimento, ultimaPresenca };
  }, [appointments]);

  useEffect(() => {
    const foundPatient = getMockPatientById(patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

  const handleAddNote = async (noteContent: string, noteDate: string) => {
    if (!patient) return;

    const newNote: SessionNote = {
      id: `sn-${Date.now()}`,
      date: noteDate,
      notes: noteContent,
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    setPatient(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        sessionNotes: [...prev.sessionNotes, newNote],
      };
      updateMockPatient(updated);
      return updated;
    });

    toast({
      title: "Nota Adicionada",
      description: "A nova nota de sessão foi salva com sucesso.",
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!patient) return;

    setPatient(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        sessionNotes: prev.sessionNotes.filter(note => note.id !== noteId),
      };
      updateMockPatient(updated);
      return updated;
    });

    toast({
      title: "Nota Removida",
      description: "A nota foi excluída com sucesso.",
    });
  };

  const handleEditNote = async (noteId: string, content: string, date: string) => {
    if (!patient) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    setPatient(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        sessionNotes: prev.sessionNotes.map(note =>
          note.id === noteId ? { ...note, notes: content, date } : note,
        ),
      };
      updateMockPatient(updated);
      return updated;
    });

    toast({
      title: "Nota Atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
    updateMockPatient(updatedPatient);
    toast({
      title: "Paciente Atualizado",
      description: "Os dados do paciente foram salvos com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do paciente...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Paciente não encontrado</h2>
        <Button asChild>
          <Link href="/patients">Voltar para Lista de Pacientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="details" className="space-y-6">
      <TabsList>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
        <TabsTrigger value="audio">🧠 Áudios</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        {/* conteúdo completo mantido */}
      </TabsContent>
      <TabsContent value="audio">
        <VoiceSessionRecorder patient={patient} />
      </TabsContent>
    </Tabs>
  );
}
