"use client";

import type { RecurringTask } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { add, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecurringTasksTableProps {
  tasks: RecurringTask[];
  onComplete: (id: string) => void;
}

export function RecurringTasksTable({ tasks, onComplete }: RecurringTasksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tarefa</TableHead>
          <TableHead>Intervalo</TableHead>
          <TableHead>Última Conclusão</TableHead>
          <TableHead>Próximo Vencimento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              Nenhuma tarefa cadastrada.
            </TableCell>
          </TableRow>
        )}
        {tasks.map((task) => {
          const nextDue = add(parseISO(task.lastCompleted), { days: task.intervalDays });
          return (
            <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{task.description}</TableCell>
              <TableCell>{task.intervalDays} dias</TableCell>
              <TableCell>{format(parseISO(task.lastCompleted), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell>{format(nextDue, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => onComplete(task.id)}>
                  Concluir
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default RecurringTasksTable;
