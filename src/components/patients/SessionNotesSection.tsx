"use client";

import type { SessionNote, Patient } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Save, Loader2, Trash2, FilePenLine } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface SessionNotesSectionProps {
  patient: Patient;
  onAddNote: (
    noteContent: string,
    noteDate: string
  ) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onEditNote: (
    noteId: string,
    noteContent: string,
    noteDate: string,
  ) => Promise<void>;
}

export function SessionNotesSection({
  patient,
  onAddNote,
  onDeleteNote,
  onEditNote,
}: SessionNotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [newNoteDate, setNewNoteDate] = useState(
    () => new Date().toISOString().slice(0, 16)
  );
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editNoteDate, setEditNoteDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveNote = async () => {
    if (newNote.trim() === "") return;
    setIsSaving(true);
    try {
      await onAddNote(newNote, newNoteDate);
      setNewNote("");
      setNewNoteDate(new Date().toISOString().slice(0, 16));
      setShowAddNoteForm(false);
      toast({
        title: "Nota Adicionada",
        description: "A anotação foi salva com sucesso.",
      });
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({
        title: "Erro ao Salvar Nota",
        description: "Não foi possível salvar a anotação.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (note: SessionNote) => {
    setEditingId(note.id);
    setEditNote(note.notes);
    setEditNoteDate(note.date.slice(0, 16));
  };

  const handleUpdateNote = async () => {
    if (!editingId || editNote.trim() === "") return;
    setIsUpdating(true);
    try {
      await onEditNote(editingId, editNote, editNoteDate);
      setEditingId(null);
      toast({
        title: "Nota Atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      toast({
        title: "Erro ao Atualizar Nota",
        description: "Não foi possível atualizar a anotação.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
              placeholder="Digite as notas da sessão aqui..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
              className="mb-3 text-base"
            />
            <Input
              type="datetime-local"
              value={newNoteDate}
              onChange={(e) => setNewNoteDate(e.target.value)}
              className="mb-3"
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
                  {editingId === note.id ? (
                    <>
                      <h3 className="text-sm font-semibold text-primary mb-2">Editar Nota</h3>
                      <Textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={5}
                        className="mb-3 text-base"
                      />
                      <Input
                        type="datetime-local"
                        value={editNoteDate}
                        onChange={(e) => setEditNoteDate(e.target.value)}
                        className="mb-3"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingId(null)} disabled={isUpdating}>
                          Cancelar
                        </Button>
                        <Button onClick={handleUpdateNote} disabled={isUpdating || editNote.trim() === ""}>
                          {isUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Salvar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-primary">
                          Sessão de {format(parseISO(note.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(note)}
                            className="p-1 h-auto"
                          >
                            <FilePenLine className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          onClick={() => onDeleteNote(note.id)}
                            className="p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.notes}</p>
                      {user?.role === 'PSYCHOLOGIST' && note.sessionSummary && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-semibold">Resumo Clínico:</span>{' '}
                          {note.sessionSummary}
                        </p>
                      )}
                      {user?.role === 'PSYCHOLOGIST' && note.sessionTags && note.sessionTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {note.sessionTags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
