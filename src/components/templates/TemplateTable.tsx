"use client";

import type { Template } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { TemplateFormDialog } from "./TemplateFormDialog";

interface TemplateTableProps {
  templates: Template[];
  onSave: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

export function TemplateTable({ templates, onSave, onDelete }: TemplateTableProps) {
  const [editing, setEditing] = useState<Template | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (template: Template) => {
    setEditing(template);
    setIsFormOpen(true);
  };

  const handleSave = (tpl: Template) => {
    onSave(tpl);
    toast({
      title: editing ? "Modelo Atualizado" : "Modelo Criado",
      description: `O modelo ${tpl.name} foi salvo com sucesso.`,
    });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "Modelo Excluído",
      description: `O modelo ${name} foi removido.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24">
                Nenhum modelo cadastrado.
              </TableCell>
            </TableRow>
          )}
          {templates.map((tpl) => (
            <TableRow key={tpl.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{tpl.name}</TableCell>
              <TableCell>{tpl.category}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(tpl)}
                  className="mr-2 text-blue-600 hover:text-blue-500"
                >
                  <FilePenLine className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o modelo {tpl.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(tpl.id, tpl.name)} className="bg-destructive hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TemplateFormDialog
        template={editing}
        onSave={handleSave}
        isOpen={isFormOpen && !!editing}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <button className="hidden" />
      </TemplateFormDialog>
    </>
  );
}
