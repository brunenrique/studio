
"use client";

import type { Patient } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye, PlusCircle } from "lucide-react";
import Link from "next/link";
import { PatientFormDialog } from "./PatientFormDialog";
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
import { format, differenceInYears, parseISO } from 'date-fns';

interface PatientTableProps {
  patients: Patient[];
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
}

export function PatientTable({ patients, onUpdatePatient, onDeletePatient }: PatientTableProps) {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };
  
  const handleFormSave = (patient: Patient) => {
    onUpdatePatient(patient);
    toast({
      title: editingPatient ? "Paciente Atualizado" : "Paciente Adicionado",
      description: `Os dados de ${patient.name} foram salvos com sucesso.`,
    });
    setEditingPatient(null); // Reset editing state
    setIsFormOpen(false); // Close dialog
  };

  const handleDelete = (patientId: string) => {
    onDeletePatient(patientId);
     toast({
      title: "Paciente Excluído",
      description: "O paciente foi removido com sucesso.",
      variant: "destructive"
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                Nenhum paciente cadastrado.
              </TableCell>
            </TableRow>
          )}
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.contact}</TableCell>
              <TableCell>{format(parseISO(patient.dateOfBirth), "dd/MM/yyyy")}</TableCell>
              <TableCell>{differenceInYears(new Date(), parseISO(patient.dateOfBirth))}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild className="mr-2 text-primary hover:text-primary/80">
                  <Link href={`/patients/${patient.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver Detalhes</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(patient)} className="mr-2 text-blue-600 hover:text-blue-500">
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
                        Tem certeza que deseja excluir o paciente {patient.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(patient.id)} className="bg-destructive hover:bg-destructive/90">
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
      <PatientFormDialog
        patient={editingPatient}
        onSave={handleFormSave}
        isOpen={isFormOpen && !!editingPatient} // Only open if editingPatient is set
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingPatient(null); // Reset on close
        }}
      >
        {/* This trigger is not used when editing, dialog controlled by state */}
        <button className="hidden"></button> 
      </PatientFormDialog>
    </>
  );
}
