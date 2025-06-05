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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface TaskTableProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskTable({ tasks, onToggle, onDelete }: TaskTableProps) {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Tarefa Removida",
      description: "Tarefa excluída.",
      variant: "destructive",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tarefa</TableHead>
          <TableHead>Lembrete</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center h-24">
              Nenhuma tarefa cadastrada.
            </TableCell>
          </TableRow>
        )}
        {tasks.map(task => (
          <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className={task.completed ? "line-through" : ""}>
              <div className="flex items-center gap-2">
                <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
                <span>{task.title}</span>
              </div>
            </TableCell>
            <TableCell>
              {task.dueDate ? format(parseISO(task.dueDate), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "—"}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
