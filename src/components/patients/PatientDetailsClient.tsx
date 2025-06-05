"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { mockPatients, mockAppointments } from "@/lib/mock-data"; // mockPatients agora está exportado corretamente
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  UserCircle,
  CalendarDays as CalendarIcon,
  Phone,
  Gift,
  Mail,
  PhoneCall,
  UploadCloud,
  FilePlus,
  Goal,
  LineChart,
  DollarSign,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { SessionNotesSection } from "./SessionNotesSection";
import { AIInsightsSection } from "./AIInsightsSection";
import { format, parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface PatientDetailsClientProps {
  patientId: string;
}

// ✅ Corrigido: tipando o parâmetro 'p'
const getMockPatientById = (id: string): Patient | null => {
  return mockPatients.find((p: Patient) => p.id === id) || null;
};

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

  const patientAppointments = mockAppointments
    .filter((appt) => appt.patientId === patient?.id)
    .sort(
      (a, b) =>
        parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime(),
    );

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
                  <span className="font-semibold">Status:</span>{" "}
                  {patient.status || "indefinido"}
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      <Accordion type="multiple" className="mt-6 space-y-2">
        <AccordionItem value="demographics">
          <AccordionTrigger>Informações Demográficas</AccordionTrigger>
          <AccordionContent>
            <ul className="text-sm grid gap-1">
              {patient.gender && (
                <li>
                  <span className="font-semibold">Gênero:</span> {patient.gender}
                </li>
              )}
              {patient.profession && (
                <li>
                  <span className="font-semibold">Profissão:</span> {patient.profession}
                </li>
              )}
              {patient.address && (
                <li>
                  <span className="font-semibold">Endereço:</span> {patient.address}
                </li>
              )}
              {patient.secondaryContact && (
                <li>
                  <span className="font-semibold">Contato Secundário:</span> {patient.secondaryContact}
                </li>
              )}
              {patient.email && (
                <li>
                  <span className="font-semibold">Email:</span> {patient.email}
                </li>
              )}
              {patient.emergencyContact && (
                <li>
                  <span className="font-semibold">Contato de Emergência:</span> {patient.emergencyContact}
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clinical">
          <AccordionTrigger>Histórico Clínico e Anamnese</AccordionTrigger>
          <AccordionContent>
            <ul className="text-sm grid gap-1">
              {patient.allergies && (
                <li>
                  <span className="font-semibold">Alergias:</span> {patient.allergies}
                </li>
              )}
              {patient.medications && (
                <li>
                  <span className="font-semibold">Medicações:</span> {patient.medications}
                </li>
              )}
              {patient.familyHistory && (
                <li>
                  <span className="font-semibold">Histórico Familiar:</span> {patient.familyHistory}
                </li>
              )}
              {patient.chiefComplaint && (
                <li>
                  <span className="font-semibold">Queixa Principal:</span> {patient.chiefComplaint}
                </li>
              )}
              {patient.habits && (
                <li>
                  <span className="font-semibold">Hábitos:</span> {patient.habits}
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appointments">
          <AccordionTrigger>Histórico de Consultas</AccordionTrigger>
          <AccordionContent>
            {patientAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma consulta registrada.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {patientAppointments.map((appt) => (
                  <li key={appt.id}>
                    {format(parseISO(appt.dateTime), "dd/MM/yyyy HH:mm")} - {appt.notes || "Sessão"}
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documents">
          <AccordionTrigger>Documentos Anexados</AccordionTrigger>
          <AccordionContent>
            <Button variant="outline" size="sm" className="mb-2">
              <UploadCloud className="mr-2 h-4 w-4" /> Enviar Arquivo
            </Button>
            <p className="text-sm text-muted-foreground">Upload de arquivos não implementado neste protótipo.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="treatment">
          <AccordionTrigger>Planos de Tratamento e Metas</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">
              {patient.treatmentPlan || "Sem plano registrado."}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="evolution">
          <AccordionTrigger>Registro de Evolução</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">
              {patient.evolution || "Sem registro."}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="finance">
          <AccordionTrigger>Informações Financeiras</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm mb-2">
              <span className="font-semibold">Saldo Devedor:</span> R$ {patient.balanceDue?.toFixed(2) || "0,00"}
            </p>
            <Button variant="outline" size="sm" className="mb-2">
              <DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento
            </Button>
            {patient.payments && patient.payments.length > 0 && (
              <ul className="text-sm space-y-1">
                {patient.payments.map((p) => (
                  <li key={p.id}>
                    {format(parseISO(p.date), "dd/MM/yyyy")} - R$ {p.amount.toFixed(2)} {p.method ? `(${p.method})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger>Comunicação Rápida</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {patient.email && (
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${patient.email}`}>
                    <Mail className="mr-2 h-4 w-4" /> E-mail
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${patient.contact}`}>
                  <PhoneCall className="mr-2 h-4 w-4" /> Ligar
                </a>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="next">
          <AccordionTrigger>Agendar Próxima Consulta</AccordionTrigger>
          <AccordionContent>
            <Button asChild size="sm">
              <Link href={`/appointments/new?patientId=${patient.id}`}>Agendar</Link>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
