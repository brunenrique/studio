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
import {
  generateSessionSummary,
  extractSessionTags,
} from "@/lib/sessionNotes";
import { useNotifications } from "@/contexts/NotificationContext";
import { usePatientAssessments } from "@/hooks/usePatientAssessments";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useCriticalTerms } from "@/hooks/useCriticalTerms";
import { cn } from "@/lib/utils";

interface PatientDetailsClientProps {
  patientId: string;
}

export function PatientDetailsClient({ patientId }: PatientDetailsClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const { data: assessments, loading: loadingAssessments } = usePatientAssessments(patientId);
  const { appointments, loading: loadingAppointments } = usePatientAppointments(patientId);
  const criticalTerms = useCriticalTerms(patient ? patient.sessionNotes : []);

  const attendanceReport = useMemo(() => {
    const totalAgendamentos = appointments.length;
    const faltas = appointments.filter(a => a.status === "absent" || a.status === "no-show").length;
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

  const handleAddNote = async (
    noteContent: string,
    noteDate: string
  ) => {
    if (!patient) return;

    const newNote: SessionNote = {
      id: `sn-${Date.now()}`,
      date: noteDate,
      notes: noteContent,
      sessionSummary: generateSessionSummary(noteContent),
      sessionTags: extractSessionTags(noteContent),
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
    addNotification(`Nota adicionada para ${patient.name}`);
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

  const handleEditNote = async (
    noteId: string,
    content: string,
    date: string,
  ) => {
    if (!patient) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    setPatient(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        sessionNotes: prev.sessionNotes.map(note =>
          note.id === noteId
            ? {
                ...note,
                notes: content,
                date,
                sessionSummary: generateSessionSummary(content),
                sessionTags: extractSessionTags(content),
              }
            : note,
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

  // ...restante do componente permanece como está (sem alteração)
}
