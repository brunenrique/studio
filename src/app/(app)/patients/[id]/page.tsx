// Caminho: src/app/patients/[id]/page.tsx

"use client";

import { useState } from 'react';
import { PatientDetailsClient } from '@/components/patients/PatientDetailsClient'; // <--- O trabalho pesado está aqui
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Esta página agora serve como um "esqueleto" que delega a lógica para os componentes filhos.
export default function PatientDetailPage({ params }: { params: { id: string } }) {
  
  // A lógica de tarefas pode permanecer, pois não estamos mexendo nela.
  // ... (toda a sua lógica de state e handlers para as tarefas) ...

  return (
    <>
      <Link href="/patients" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para Pacientes
      </Link>
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes do Paciente</TabsTrigger>
          <TabsTrigger value="tasks">Ações & To-Do</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {/* A mágica acontece dentro deste componente */}
          <PatientDetailsClient patientId={params.id} />
        </TabsContent>
        <TabsContent value="tasks">
          {/* Seu conteúdo de tarefas existente */}
        </TabsContent>
      </Tabs>
    </>
  );
}