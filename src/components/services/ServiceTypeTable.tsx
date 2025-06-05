"use client";

import type { ServiceType } from "@/lib/types";
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
import { ServiceTypeFormDialog } from "./ServiceTypeFormDialog";

interface ServiceTypeTableProps {
  services: ServiceType[];
  onSave: (service: ServiceType) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceTypeTable({ services, onSave, onDelete }: ServiceTypeTableProps) {
  const [editing, setEditing] = useState<ServiceType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (service: ServiceType) => {
    setEditing(service);
    setIsFormOpen(true);
  };

  const handleSave = (svc: ServiceType) => {
    onSave(svc);
    toast({
      title: editing ? "Serviço Atualizado" : "Serviço Criado",
      description: `O serviço ${svc.name} foi salvo com sucesso.`,
    });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "Serviço Excluído",
      description: `O serviço ${name} foi removido.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Duração (min)</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Nenhum serviço cadastrado.
              </TableCell>
            </TableRow>
          )}
          {services.map((svc) => (
            <TableRow key={svc.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{svc.name}</TableCell>
              <TableCell>{svc.defaultDuration}</TableCell>
              <TableCell>{svc.price ? `R$ ${svc.price}` : '-'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(svc)}
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
                        Tem certeza que deseja excluir o serviço {svc.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(svc.id, svc.name)} className="bg-destructive hover:bg-destructive/90">
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

      <ServiceTypeFormDialog
        service={editing}
        onSave={handleSave}
        isOpen={isFormOpen && !!editing}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <button className="hidden" />
      </ServiceTypeFormDialog>
    </>
  );
}
