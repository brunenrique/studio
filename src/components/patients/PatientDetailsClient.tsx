"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { getMockPatientById, updateMockPatient } from "@/lib/mock-data";
import { useState, useEffect } from "react";
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

  const totalAppointments = appointments.length;
  const absences = appointments.filter(a => a.status === 'absent').length;
  const presences = appointments.filter(a => a.status === 'present').length;
  const attendancePercentage = totalAppointments > 0 ? (presences / totalAppointments) * 100 : 0;
  const lastPresenceDate = appointments
    .filter(a => a.status === 'present')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0]?.dateTime;

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
    <div className="space-y-6">
      {criticalTerms.length > 0 && (
        <Alert variant="destructive" className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Termos críticos detectados nas notas: {criticalTerms.join(', ')}.
            </AlertDescription>
          </div>
        </Alert>
      )}
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="outline" className="shadow-sm">
          <Link href="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pacientes
          </Link>
        </Button>
        <PatientFormDialog patient={patient} onSave={handleSavePatient}>
          <Button variant="default">Editar</Button>
        </PatientFormDialog>
      </div>
      <Card className="shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-accent/20 p-6 flex flex-col items-center justify-center text-center">
            <Image
              src={`https://placehold.co/150x150.png?text=${patient.name.charAt(0)}`}
              alt={patient.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-background shadow-lg mb-4"
              data-ai-hint="profile picture"
            />
            <CardTitle className="text-2xl font-bold font-headline text-primary">{patient.name}</CardTitle>
            <CardDescription className="text-foreground/80">
              ID do Paciente: {patient.id}
            </CardDescription>
          </div>
          <div className="md:w-2/3 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold">Detalhes do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <div className="flex items-center">
                  <span className="font-semibold">Contato:</span> {patient.contact}
                  {user?.role === 'AGENDAMENTO' && /^\d{10,13}$/.test(patient.contact) && (
                    <a
                      href={`https://wa.me/${patient.contact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-green-600 hover:text-green-700"
                    >
                      <WhatsappIcon className="h-4 w-4" />
                      <span className="sr-only">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
              {patient.cpf && (
                <div className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <span className="font-semibold">CPF:</span> {patient.cpf}
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <span className="font-semibold">Nascimento:</span>{" "}
                  {format(parseISO(patient.dateOfBirth), "dd/MM/yyyy")}
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <span className="font-semibold">Idade:</span>{" "}
                  {differenceInYears(new Date(), parseISO(patient.dateOfBirth))} anos
                </div>
              </div>
              <div className="flex items-center sm:col-span-2">
                <UserCircle className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <span className="font-semibold">Status:</span> Ativo (placeholder)
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      {user?.role === 'PSYCHOLOGIST' && (
        <Card
          className={cn(
            'shadow-lg',
            totalAppointments > 0 && absences / totalAppointments > 0.5 &&
              'border-destructive bg-destructive/10'
          )}
        >
          <CardHeader>
            <CardTitle>Relatório de Faltas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Total de Sessões:</span>{' '}
              {totalAppointments}
            </div>
            <div>
              <span className="font-semibold">Faltas:</span>{' '}
              <span className={absences / (totalAppointments || 1) > 0.5 ? 'text-destructive font-semibold' : ''}>{absences}</span>
            </div>
            <div>
              <span className="font-semibold">Comparecimentos:</span>{' '}
              {presences}
            </div>
            <div>
              <span className="font-semibold">% Comparecimento:</span>{' '}
              {attendancePercentage.toFixed(0)}%
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Última Presença:</span>{' '}
              {lastPresenceDate ? format(parseISO(lastPresenceDate), 'dd/MM/yyyy') : '-'}
            </div>
          </CardContent>
        </Card>
      )}

      <SessionNotesSection
        patient={patient}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onEditNote={handleEditNote}
      />
      <AIInsightsSection
        patient={patient}
        latestSessionNote={
          patient.sessionNotes.length > 0
            ? patient.sessionNotes[patient.sessionNotes.length - 1]
            : undefined
        }
      />
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="assessments">
          <AccordionTrigger>Mensuração & Avaliação</AccordionTrigger>
          <AccordionContent>
            {loadingAssessments ? (
              <p>Carregando avaliações...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Instrumento</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{a.testId}</TableCell>
                      <TableCell>{a.score ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Card className="shadow-lg mt-6" data-ai-hint="compliance and reminders section">
        <CardHeader>
          <CardTitle className="font-semibold text-lg">Lembretes e Conformidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li data-ai-hint="lgpd reminder">
              Assegure-se de ter o consentimento do paciente para o tratamento de dados
              (LGPD/GDPR).
            </li>
            <li data-ai-hint="encryption reminder">
              Todos os dados de pacientes são criptografados localmente antes do armazenamento.
            </li>
            <li data-ai-hint="notification reminder">
              Notificações de sessão automáticas (24h e 30min antes) são funcionalidades planejadas.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
