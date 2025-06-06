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
import type { Patient, Note } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsSectionProps {
  patient: Patient;
  latestSessionNote?: Note;
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
      latestSessionNote?.content ||
      (patient.sessionNotes && patient.sessionNotes.length > 0
        ? patient.sessionNotes[patient.sessionNotes.length - 1].content
        : "Nenhuma nota de sessão recente disponível.");

    const patientHistory = (patient.sessionNotes ?? [])
      .filter((note) => note.id !== latestSessionNote?.id)
      .slice(0, 5)
      .map(
        (note) =>
          `Data: ${new Date(note.date).toLocaleDateString()}\nNotas: ${note.content}`,
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
            <CardDescription data-ai-hint="AI insights section description">
              Analise as notas da sessão e o histórico do paciente para obter insights.
            </CardDescription>
          </div>

          <Button
            onClick={handleGetInsights}
            disabled={isLoading || !canGenerateInsights}
            className="shadow-md"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Gerar Insights
          </Button>
        </div>
        {!canGenerateInsights && (
          <p className="text-sm text-muted-foreground mt-2">
            Adicione pelo menos uma nota de sessão para gerar insights.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Analisando dados...</p>
          </div>
        )}
        {error && (
          <div className="text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}
        {insights && (
          <div>
            <h4 className="font-semibold mb-2 text-lg">Resultado da Análise:</h4>
            <Textarea
              value={insights}
              readOnly
              rows={8}
              className="bg-background/70 text-base leading-relaxed"
              placeholder="Os insights gerados pela IA aparecerão aqui."
              data-ai-hint="AI insights output textarea"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Lembrete: Os insights da IA são para auxílio e não substituem o julgamento clínico profissional.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
