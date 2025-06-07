"use client";

import { useState } from 'react';
import { PatientDetailsClient } from '@/components/patients/PatientDetailsClient';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { db } from '@/lib/firebaseClient';
import { addDoc, collection, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PatientDetailPageProps {
  params: {
    id: string;
  };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { user } = useAuth();
  const { tasks } = useTasks(params.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const { toast } = useToast();

  if (!user || user.role !== 'Psicólogo') {
    return <p className="p-4">Acesso restrito aos psicólogos.</p>;
  }

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
        patientId: params.id,
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
    <>
      <Link href="/patients" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Pacientes
      </Link>
      <Tabs defaultValue="details" className="space-y-4">
      <TabsList>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
        <TabsTrigger value="tasks">Ações & To-Do</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <PatientDetailsClient patientId={params.id} />
      </TabsContent>
      <TabsContent value="tasks">
        <div className="space-y-4">
          <TaskFormDialog
            task={editing}
            onSave={handleSave}
            isOpen={isFormOpen}
            onOpenChange={(open) => {
              setIsFormOpen(open);
              if (!open) setEditing(null);
            }}
          >
            <Button onClick={() => { setEditing(null); setIsFormOpen(true); }} className="mb-4 shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa
            </Button>
          </TaskFormDialog>
          <TaskTable tasks={tasks} onEdit={(t) => { setEditing(t); setIsFormOpen(true); }} onDelete={handleDelete} onToggleStatus={handleToggle} />
        </div>
      </TabsContent>
      </Tabs>
    </>
  );
}
