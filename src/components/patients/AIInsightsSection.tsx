"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2, AlertTriangle } from "lucide-react";
import type {
  SessionInsightsInput,
  SessionInsightsOutput,
} from "@/ai/flows/session-insights";
import { getSessionInsights } from "@/ai/flows/session-insights";
import type { Patient, SessionNote } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsSectionProps {
  patient: Patient;
  latestSessionNote?: SessionNote;
}

export function AIInsightsSection({
  patient,
  latestSessionNote,
}: AIInsightsSectionProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    const currentSessionNotes =
      latestSessionNote?.notes ||
      (patient.sessionNotes.length > 0
        ? patient.sessionNotes[patient.sessionNotes.length - 1].notes
        : "Nenhuma nota de sessão recente disponível.");

    const patientHistory = patient.sessionNotes
      .filter((note) => note.id !== latestSessionNote?.id)
      .slice(0, 5)
      .map(
        (note) =>
          `Data: ${new Date(note.date).toLocaleDateString()}\nNotas: ${note.notes}`,
      )
      .join("\n\n---\n\n");

    const aiInput: SessionInsightsInput = {
      sessionNotes: currentSessionNotes,
      patientHistory:
        patientHistory || "Nenhum histórico de sessões anteriores disponível.",
    };

    try {
      const result: SessionInsightsOutput = await getSessionInsights(aiInput);
      setInsights(result.insights);
      toast({
        title: "Insights Gerados",
        description: "A análise da IA foi concluída.",
      });
    } catch (err) {
      console.error("Error getting AI insights:", err);
      setError("Falha ao gerar insights. Tente novamente mais tarde.");
      toast({
        title: "Erro ao Gerar Insights",
        description: "Ocorreu um problema ao contatar o serviço de IA.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerateInsights =
    patient.sessionNotes && patient.sessionNotes.length > 0;

  return (
    <Card className="shadow-lg rounded-lg mt-6 bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-primary" />
              Insights da IA
            </CardTitle>
            <CardDescription>
              Analise as notas da sessão e o histórico do paciente para obter
