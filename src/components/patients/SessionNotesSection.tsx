"use client";

import type { SessionNote, Patient } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Save, Loader2, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface SessionNotesSectionProps {
  patient: Patient;
  onAddNote: (patientId: string, noteContent: string) => Promise<void>;
  onDeleteNote: (patientId: string, noteId: string) => Promise<void>; // ✅ incluído corretamente
}

export function SessionNotesSection({
  patient,
  onAddNote,
  onDeleteNote, // ✅ recebido nas props
}: SessionNotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNote = async () => {
    if (newNote.trim() === "") return;
    setIsSaving(true);
    try {
      await onAddNote(patient.id, newNote);
      setNewNote("");
      setShowAddNoteForm(false);
    } catch (error) {
      console.error("Failed to save note:", error);
      // TO-DO: exibir feedback pro usuário
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline">Notas da Sessão</CardTitle>
            <CardDescription>Histórico de anotações das sessões.</CardDescription>
          </div>
          {!showAddNoteForm && (
            <Button
              onClick={() => setShowAddNoteForm(true)}
              size="sm"
              className="shadow-md"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nota
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddNoteForm && (
          <div className="mb-6 p-4 border rounded-md bg-card shadow">
            <h3 className="text-lg font-semibold mb-2">Nova Nota de Sessão</h3>
            <Textarea
              placeholder="Digite as notas da sessão aqui... (Lembre-se da criptografia para dados sensíveis - não implementada no protótipo)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
              className="mb-3 text-base"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddNoteForm(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={isSaving || newNote.trim() === ""}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Nota
              </Button>
            </div>
          </div>
        )}

        {patient.sessionNotes.length === 0 && !showAddNoteForm && (
          <p className="text-muted-foreground">
            Nenhuma nota de sessão registrada para este paciente.
          </p>
        )}

        <div className="space-y-6">
          {patient.sessionNotes
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
            .map((note, index) => (
              <div key={note.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="p-4 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-primary">
                      Sessão de {format(parseISO(note.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNote(patient.id, note.id)}
                      className="p-1 h-auto"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.notes}</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import type { SessionNote, Patient } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Save, Loader2, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface SessionNotesSectionProps {
  patient: Patient;
  onAddNote: (patientId: string, noteContent: string) => Promise<void>;
  onDeleteNote: (patientId: string, noteId: string) => Promise<void>; // ✅ incluído corretamente
}

export function SessionNotesSection({
  patient,
  onAddNote,
  onDeleteNote, // ✅ recebido nas props
}: SessionNotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNote = async () => {
    if (newNote.trim() === "") return;
    setIsSaving(true);
    try {
      await onAddNote(patient.id, newNote);
      setNewNote("");
      setShowAddNoteForm(false);
    } catch (error) {
      console.error("Failed to save note:", error);
      // TO-DO: exibir feedback pro usuário
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline">Notas da Sessão</CardTitle>
            <CardDescription>Histórico de anotações das sessões.</CardDescription>
          </div>
          {!showAddNoteForm && (
            <Button
              onClick={() => setShowAddNoteForm(true)}
              size="sm"
              className="shadow-md"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nota
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddNoteForm && (
          <div className="mb-6 p-4 border rounded-md bg-card shadow">
            <h3 className="text-lg font-semibold mb-2">Nova Nota de Sessão</h3>
            <Textarea
              placeholder="Digite as notas da sessão aqui... (Lembre-se da criptografia para dados sensíveis - não implementada no protótipo)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
              className="mb-3 text-base"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddNoteForm(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={isSaving || newNote.trim() === ""}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Nota
              </Button>
            </div>
          </div>
        )}

        {patient.sessionNotes.length === 0 && !showAddNoteForm && (
          <p className="text-muted-foreground">
            Nenhuma nota de sessão registrada para este paciente.
          </p>
        )}

        <div className="space-y-6">
          {patient.sessionNotes
            .sort(
              (a, b) =>
                parseISO(b.date).getTime() - parseISO(a.date).getTime()
            )
            .map((note, index) => (
              <div key={note.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="p-4 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-primary">
                      Sessão de{" "}
                      {format(
                        parseISO(note.date),
                        "dd 'de' MMMM 'de' yyyy, HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNote(patient.id, note.id)}
                      className="p-1 h-auto"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {note.notes}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
