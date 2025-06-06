"use client";

import type { Task } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, Trash2, CheckSquare } from "lucide-react";
import { SmartModal } from "@/components/SmartModal";
import { useState } from "react";
import { format } from "date-fns";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit, onDelete, onToggleStatus }: TaskTableProps) {
  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const [toDelete, setToDelete] = useState<Task | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24">
              Nenhuma tarefa.
            </TableCell>
          </TableRow>
        )}
        {tasks.map((task) => (
          <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.taskType}</TableCell>
            <TableCell>
              <Badge variant={priorityColor(task.priority)} className="capitalize">
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(task.dueDate), "dd/MM/yyyy HH:mm")}</TableCell>
            <TableCell>{task.status === "done" ? "Concluída" : "Pendente"}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(task)}
                className="mr-2 text-green-600 hover:text-green-500"
              >
                <CheckSquare className="h-4 w-4" />
                <span className="sr-only">Concluir</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="mr-2 text-blue-600 hover:text-blue-500"
              >
                <FilePenLine className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/80"
                onClick={() => setToDelete(task)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
              <SmartModal
                id="delete-task"
                open={toDelete?.id === task.id}
                onClose={() => setToDelete(null)}
                title="Confirmar Exclusão"
              >
                <p className="text-sm">Tem certeza que deseja excluir esta tarefa?</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button onClick={() => setToDelete(null)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDelete(task.id);
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
