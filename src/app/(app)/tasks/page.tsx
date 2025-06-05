"use client";

import { useState } from "react";
import { useRecurringTasks } from "@/contexts/RecurringTasksContext";
import { AddRecurringTaskDialog } from "@/components/tasks/AddRecurringTaskDialog";
import { RecurringTasksTable } from "@/components/tasks/RecurringTasksTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TasksPage() {
  const { tasks, completeTask } = useRecurringTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Tarefas e Lembretes</h1>
          <p className="text-muted-foreground">
            Agende lembretes recorrentes e acompanhe suas tarefas administrativas.
          </p>
        </div>
        <AddRecurringTaskDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen}>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
        </AddRecurringTaskDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Tarefas Agendadas</CardTitle>
          <CardDescription>Total de {tasks.length} tarefas cadastradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecurringTasksTable tasks={tasks} onComplete={completeTask} />
        </CardContent>
      </Card>
    </div>
  );
}
