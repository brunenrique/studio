"use client";

import type { Document } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

export function DocumentTable({ documents, onDelete }: DocumentTableProps) {
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "Documento Removido",
      description: `O documento ${name} foi excluído.`,
      variant: "destructive",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Link</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center h-24">
              Nenhum documento cadastrado.
            </TableCell>
          </TableRow>
        )}
        {documents.map((doc) => (
          <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">{doc.name}</TableCell>
            <TableCell>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Abrir
              </a>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(doc.id, doc.name)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
