"use client";

import type { WaitingListItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Trash2 } from "lucide-react"; // CalendarPlus for scheduling
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SmartModal } from "@/components/SmartModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


interface WaitlistTableProps {
  items: WaitingListItem[];
  onDeleteItem: (itemId: string) => void;
  // onScheduleItem: (item: WaitingListItem) => void; // To open appointment dialog
}

export function WaitlistTable({ items, onDeleteItem }: WaitlistTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [toDelete, setToDelete] = useState<WaitingListItem | null>(null);

  const handleDelete = (itemId: string, patientName: string) => {
    onDeleteItem(itemId);
    toast({
      title: "Item Removido",
      description: `${patientName} foi removido da lista de espera.`,
      variant: "destructive"
    });
  };

  const handleSchedule = (item: WaitingListItem) => {
    // This would ideally pass the patient info to the new appointment dialog
    // For now, it navigates to the appointments page with a query param (conceptual)
    toast({
      title: "Agendar Paciente",
      description: `Abrindo agenda para ${item.patientName}. (Funcionalidade de agendamento direto da lista de espera pendente)`,
    });
    router.push(`/appointments?schedulePatient=${encodeURIComponent(item.patientName)}&contact=${encodeURIComponent(item.contact)}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Paciente</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Data de Adição</TableHead>
          <TableHead>Preferência</TableHead>
          <TableHead>Observações</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24">
              Lista de espera vazia.
            </TableCell>
          </TableRow>
        )}
        {items.map((item) => (
          <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">{item.patientName}</TableCell>
            <TableCell>{item.contact}</TableCell>
            <TableCell>{format(parseISO(item.addedDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
            <TableCell>{item.requestedDate || "N/A"}</TableCell>
            <TableCell className="max-w-xs truncate">{item.notes || "N/A"}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handleSchedule(item)} className="mr-2 text-green-600 hover:text-green-500">
                <CalendarPlus className="h-4 w-4" />
                <span className="sr-only">Agendar</span>
              </Button>
              {/* Edit for waiting list item could be added here */}
              {/* <Button variant="ghost" size="icon" className="mr-2 text-blue-600 hover:text-blue-500">
                <Edit className="h-4 w-4" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/80"
                onClick={() => setToDelete(item)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
              <SmartModal
                id="delete-wait-item"
                open={toDelete?.id === item.id}
                onClose={() => setToDelete(null)}
                title="Confirmar Exclusão"
              >
                <p className="text-sm">
                  Tem certeza que deseja remover {item.patientName} da lista de espera?
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button onClick={() => setToDelete(null)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(item.id, item.patientName);
                      setToDelete(null);
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </SmartModal>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
