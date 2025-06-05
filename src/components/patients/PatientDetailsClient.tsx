"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { getMockPatientById, updateMockPatient } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  UserCircle,
  CalendarDays as CalendarIcon,
  Phone,
  Gift,
  UploadCloud,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { SessionNotesSection } from "./SessionNotesSection";
import { AIInsightsSection } from "./AIInsightsSection";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { TreatmentPlanDialog } from "./TreatmentPlanDialog";
import { format, parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface PatientDetailsClientProps {
  patientId: string;
}


export function PatientDetailsClient({ patientId }: PatientDetailsClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const foundPatient = getMockPatientById(patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

  const handleAddNote = async (
    id: string,
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
  };

  const handleDeleteNote = async (id: string, noteId: string) => {
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

  const handleUploadDocument = async (name: string) => {
    if (!patient) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name,
      url: `/uploads/${name}`,
      uploadedAt: new Date().toISOString(),
    };

    await new Promise((r) => setTimeout(r, 500));

    setPatient((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        documents: [...(prev.documents || []), newDoc],
      };
      updateMockPatient(updated);
      return updated;
    });

    toast({ title: "Documento Adicionado", description: "Arquivo salvo com sucesso." });
  };

  const handleAddTreatmentPlan = async (title: string, description: string) => {
    if (!patient) return;
    const newPlan = {
      id: `tp-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    await new Promise((r) => setTimeout(r, 500));

    setPatient((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        treatmentPlans: [...(prev.treatmentPlans || []), newPlan],
      };
      updateMockPatient(updated);
      return updated;
    });

    toast({ title: "Plano criado", description: "Novo plano de tratamento salvo." });
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!patient) return;
    setPatient((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        documents: (prev.documents || []).filter((d) => d.id !== docId),
      };
      updateMockPatient(updated);
      return updated;
    });
    toast({ title: "Documento Removido" });
  };

  const handleDeleteTreatmentPlan = async (planId: string) => {
    if (!patient) return;
    setPatient((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        treatmentPlans: (prev.treatmentPlans || []).filter((p) => p.id !== planId),
      };
      updateMockPatient(updated);
      return updated;
    });
    toast({ title: "Plano removido" });
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
                  <span className="font-semibold">Status:</span> Ativo
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      <SessionNotesSection
        patient={patient}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      <Card className="shadow-lg mt-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline">Documentos</CardTitle>
            <CardDescription>Arquivos anexados ao paciente.</CardDescription>
          </div>
          <DocumentUploadDialog onUpload={handleUploadDocument}>
            <Button size="sm" className="shadow-md">
              <UploadCloud className="mr-2 h-4 w-4" /> Adicionar Documento
            </Button>
          </DocumentUploadDialog>
        </CardHeader>
        <CardContent>
          {patient.documents && patient.documents.length > 0 ? (
            <ul className="space-y-2">
              {patient.documents.map((doc) => (
                <li key={doc.id} className="flex justify-between items-center border rounded p-2">
                  <span>{doc.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="p-1 h-auto">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum documento cadastrado.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline">Planos de Tratamento</CardTitle>
            <CardDescription>Registros de planos associados.</CardDescription>
          </div>
          <TreatmentPlanDialog onSave={handleAddTreatmentPlan}>
            <Button size="sm" className="shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
            </Button>
          </TreatmentPlanDialog>
        </CardHeader>
        <CardContent>
          {patient.treatmentPlans && patient.treatmentPlans.length > 0 ? (
            <ul className="space-y-2">
              {patient.treatmentPlans.map((plan) => (
                <li key={plan.id} className="flex justify-between items-center border rounded p-2">
                  <div>
                    <p className="font-medium">{plan.title}</p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTreatmentPlan(plan.id)} className="p-1 h-auto">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum plano cadastrado.</p>
          )}
        </CardContent>
      </Card>

      <AIInsightsSection
        patient={patient}
        latestSessionNote={
          patient.sessionNotes.length > 0
            ? patient.sessionNotes[patient.sessionNotes.length - 1]
            : undefined
        }
      />

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
