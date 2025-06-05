"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { mockPatients } from '@/lib/mock-data'; // ✅ corrigido aqui
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PatientFormDialog } from '@/components/patients/PatientFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // ✅ agora usando mockPatients direto
    setPatients(mockPatients);
  }, []);

  const handleAddOrUpdatePatient = (patientData: Patient) => {
    setPatients(prevPatients => {
      const existingIndex = prevPatients.findIndex(p => p.id === patientData.id);
      if (existingIndex > -1) {
        // Atualiza paciente existente
        const updatedPatients = [...prevPatients];
        updatedPatients[existingIndex] = patientData;
        return updatedPatients;
      } else {
        // Adiciona novo paciente
        return [...prevPatients, patientData];
      }
    });

    toast({
      title: patientData.id.startsWith("patient-") && patients.find(p => p.id === patientData.id)
        ? "Paciente Atualizado"
        : "Paciente Adicionado",
      description: `Os dados de ${patientData.name} foram salvos.`,
    });

    setIsFormOpen(false);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
    // O toast de exclusão é tratado dentro do PatientTable
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gerenciamento de Pacientes</h1>
          <p className="text-muted-foreground">
            Visualize, adicione, edite ou remova pacientes.
          </p>
        </div>
        <PatientFormDialog
          patient={null}
          onSave={handleAddOrUpdatePatient}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
        >
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Paciente
          </Button>
        </PatientFormDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>Total de {patients.length} pacientes cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientTable
            patients={patients}
            onUpdatePatient={handleAddOrUpdatePatient}
            onDeletePatient={handleDeletePatient}
          />
        </CardContent>
      </Card>
    </div>
  );
}
