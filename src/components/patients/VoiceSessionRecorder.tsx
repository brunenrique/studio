"use client";

import { useState, useRef, useEffect } from "react";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface VoiceSessionRecorderProps {
  patient: Patient;
}

interface TranscriptItem {
  id: string;
  timestamp: string;
  speaker: "psychologist" | "patient";
  text: string;
}

export function VoiceSessionRecorder({ patient }: VoiceSessionRecorderProps) {
  const [speaker, setSpeaker] = useState<"psychologist" | "patient">(
    "psychologist",
  );
  const [isRecording, setIsRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const storageKey = `transcripts_${patient.id}`;

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (raw) {
      try {
        setTranscripts(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(transcripts));
    }
  }, [transcripts, storageKey]);

  const initRecognition = () => {
    if (typeof window === "undefined") return null;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }
    const rec: SpeechRecognition = new SpeechRecognition();
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(" ");
      const item: TranscriptItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        speaker,
        text,
      };
      setTranscripts(prev => [...prev, item]);
    };
    rec.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = rec;
    return rec;
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const rec = recognitionRef.current ?? initRecognition();
    if (!rec) return;
    setSupported(true);
    setIsRecording(true);
    try {
      rec.start();
    } catch {
      // swallow start errors
      setIsRecording(false);
    }
  };

  const handleDelete = (id: string) => {
    setTranscripts(prev => prev.filter(t => t.id !== id));
  };

  if (!supported) {
    return (
      <p className="text-sm text-muted-foreground">
        Web Speech API não suportada neste navegador.
      </p>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Gravador de Sessão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          <label className="text-sm font-medium">Falante:</label>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={speaker}
            onChange={e => setSpeaker(e.target.value as "psychologist" | "patient")}
            disabled={isRecording}
          >
            <option value="psychologist">Psicólogo</option>
            <option value="patient">Paciente</option>
          </select>
          <Button onClick={toggleRecording} className="sm:ml-auto">
            {isRecording ? "Parar" : "Gravar"}
          </Button>
        </div>
        {transcripts.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma transcrição salva.</p>
        )}
        <ul className="space-y-2">
          {transcripts.map(t => (
            <li
              key={t.id}
              className="border rounded-md p-2 flex justify-between"
            >
              <div className="text-sm">
                <p className="text-xs text-muted-foreground">
                  {new Date(t.timestamp).toLocaleTimeString()} - {t.speaker === "psychologist" ? "Psicólogo" : "Paciente"}
                </p>
                <p className="whitespace-pre-wrap">{t.text}</p>
              </div>
              <button
                className="text-xs text-red-500 ml-2"
                onClick={() => handleDelete(t.id)}
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
