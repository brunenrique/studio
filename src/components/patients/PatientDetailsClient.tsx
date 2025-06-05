"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { getMockPatientById } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays as CalendarIcon, Phone, Gift, PlusCircle } from "lucide-react";
import Link from "next/link";
import { SessionNotesSection } from "./SessionNotesSection";
import { AIInsightsSection } from "./AIInsightsSection";
import { DocumentFormDialog } from "./DocumentFormDialog";
import { DocumentTable } from "./DocumentTable";
import { TreatmentPlanSection } from "./TreatmentPlanSection";
import { format, parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface PatientDetailsClientProps {
  patientId: string;
}


export function PatientDetailsClient({ patientId }: PatientDetailsClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundPatient = getMockPatientById(patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

  const handleAddNote = async (id: string, noteContent: string) => {
    if (!patient) return;

    const newNote: SessionNote = {
      id: `sn-${Date.now()}`,
      date: new Date().toISOString(),
      notes: noteContent,
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    setPatient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sessionNotes: [...prev.sessionNotes, newNote],
      };
    });

    toast({
      title: "Nota Adicionada",
      description: "A nova nota de sessão foi salva com sucesso.",
    });
  };

  // ✅ Corrigido: adicionada função para deletar nota
  const handleDeleteNote = async (noteId: string) => {
    if (!patient) return;

    setPatient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sessionNotes: prev.sessionNotes.filter(note => note.id !== noteId),
      };
    });

    toast({
      title: "Nota Removida",
      description: "A nota foi excluída com sucesso.",
    });
  };

  const handleAddDocument = (data: Omit<import("@/lib/types").Document, 'id'>) => {
    if (!patient) return;
    const newDoc = { id: `doc-${Date.now()}`, ...data };
    setPatient(prev => prev && { ...prev, documents: [...prev.documents, newDoc] });
    toast({
      title: "Documento Adicionado",
      description: `O documento ${data.name} foi salvo.`,
    });
  };

  const handleDeleteDocument = (docId: string) => {
    if (!patient) return;
    setPatient(prev => prev && { ...prev, documents: prev.documents.filter(d => d.id !== docId) });
  };

  const handleSavePlan = (plan: import("@/lib/types").TreatmentPlan) => {
    if (!patient) return;
    setPatient(prev => prev && { ...prev, treatmentPlan: plan });
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
      <Button asChild variant="outline" className="mb-6 shadow-sm">
        <Link href="/patients">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pacientes
        </Link>
      </Button>

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
                <div>
                  <span className="font-semibold">Contato:</span> {patient.contact}
                </div>
              </div>
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

      {/* ✅ Corrigido: passando também o onDeleteNote */}
      <SessionNotesSection
        patient={patient}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      <AIInsightsSection
        patient={patient}
        latestSessionNote={
          patient.sessionNotes.length > 0
            ? patient.sessionNotes[patient.sessionNotes.length - 1]
            : undefined
        }
      />

      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-headline">Documentos</CardTitle>
            <CardDescription>Arquivos relacionados ao paciente.</CardDescription>
          </div>
          <DocumentFormDialog onSave={handleAddDocument} isOpen={isDocFormOpen} onOpenChange={setIsDocFormOpen}>
            <Button onClick={() => setIsDocFormOpen(true)} size="sm" className="shadow">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Documento
            </Button>
          </DocumentFormDialog>
        </CardHeader>
        <CardContent>
          <DocumentTable documents={patient.documents} onDelete={handleDeleteDocument} />
        </CardContent>
      </Card>

      <TreatmentPlanSection plan={patient.treatmentPlan} onSave={handleSavePlan} />

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
              A criptografia client-side para campos sensíveis é uma prioridade de segurança (não
              implementada neste protótipo).
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
