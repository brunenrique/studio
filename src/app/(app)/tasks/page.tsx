"use client";

import { useState } from 'react';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { db } from '@/lib/firebaseClient';
import { addDoc, collection, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const { tasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleSave = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'patientId'>) => {
    if (editing) {
      await updateDoc(doc(db, 'tasks', editing.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Tarefa atualizada' });
    } else {
      await addDoc(collection(db, 'tasks'), {
        ...data,
        patientId: null,
        createdBy: 'dev-user',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Tarefa criada' });
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
    toast({ title: 'Tarefa removida', variant: 'destructive' });
  };

  const handleToggle = async (task: Task) => {
    await updateDoc(doc(db, 'tasks', task.id), {
      status: task.status === 'pending' ? 'done' : 'pending',
      updatedAt: serverTimestamp(),
    });
    toast({ title: task.status === 'pending' ? 'Tarefa concluída' : 'Tarefa reaberta' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Tarefas</h1>
          <p className="text-muted-foreground">Visão geral de todas as tarefas.</p>
        </div>
        <TaskFormDialog
          task={editing}
          onSave={handleSave}
          isOpen={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditing(null);
          }}
        >
          <Button onClick={() => { setEditing(null); setIsFormOpen(true); }} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa
          </Button>
        </TaskFormDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>Total de {tasks.length} tarefas cadastradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskTable tasks={tasks} onEdit={(t) => { setEditing(t); setIsFormOpen(true); }} onDelete={handleDelete} onToggleStatus={handleToggle} />
        </CardContent>
      </Card>
    </div>
  );
}
