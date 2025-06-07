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

  // ...restante do código permanece o mesmo
}
