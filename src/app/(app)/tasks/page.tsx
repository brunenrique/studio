"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { mockTasks } from '@/lib/mock-data';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const handleSave = (task: Task) => {
    setTasks(prev => [...prev, task]);
    toast({
      title: "Tarefa Criada",
      description: `A tarefa "${task.title}" foi adicionada.`,
    });
  };

  const handleToggle = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Minhas Tarefas</h1>
          <p className="text-muted-foreground">Organize suas atividades profissionais.</p>
        </div>
        <TaskFormDialog onSave={handleSave} isOpen={isFormOpen} onOpenChange={setIsFormOpen}>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
        </TaskFormDialog>
      </div>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
          <CardDescription>Total de {tasks.length} tarefas registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskTable tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
