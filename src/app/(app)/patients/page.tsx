// Caminho: src/app/patients/page.tsx

"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// --- 1. IMPORTAÇÕES ATUALIZADAS ---
import { db } from '@/lib/firebaseClient';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { encryptPatientObject } from '@/lib/patient-utils'; // <-- Usando nosso novo utilitário!

// Componentes da UI (sem alteração)
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PatientFormDialog } from '@/components/patients/PatientFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  // Busca os dados do Firestore (sem alteração aqui)
  useEffect(() => {
    if (user?.id) {
      const patientsCollectionRef = collection(db, 'patients');
      const unsubscribe = onSnapshot(patientsCollectionRef, (querySnapshot) => {
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Patient));
        setPatients(patientsList);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // --- 2. FUNÇÃO DE SALVAR ATUALIZADA E SIMPLIFICADA ---
  const handleAddOrUpdatePatient = async (patientFormData: Omit<Patient, 'id'>, patientId?: string) => {
    if (!user) {
      toast({ title: "Erro de autenticação", variant: "destructive" });
      return;
    }

    try {
      // Prepara o objeto completo do paciente com todos os dados "limpos"
      const patientObject: Patient = {
        id: patientId || crypto.randomUUID(),
        psychologistId: user.id, // Garante que o ID do psicólogo está associado
        ...patientFormData
      };

      // USA A FUNÇÃO CENTRAL PARA CRIPTOGRAFAR TODOS OS CAMPOS SENSÍVEIS
      const secureData = encryptPatientObject(patientObject);

      // Define a referência do documento para criar ou atualizar
      const patientRef = doc(db, 'patients', secureData.id);

      // Usa setDoc com merge:true que serve tanto para criar quanto para atualizar
      await setDoc(patientRef, secureData, { merge: true });

      toast({
        title: patientId ? "Paciente Atualizado" : "Paciente Adicionado",
        description: `Os dados de ${secureData.name} foram salvos com segurança.`,
      });

      setIsFormOpen(false);

    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({ title: "Erro ao salvar", description: "Ocorreu um problema.", variant: "destructive" });
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    // Implementação da lógica de exclusão real
    try {
      await deleteDoc(doc(db, 'patients', patientId));
      toast({ title: 'Paciente removido', variant: 'default' });
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    }
  };

  if (!user || user.role !== 'PSYCHOLOGIST') {
    return <p className="p-4">Acesso restrito aos psicólogos.</p>;
  }

  // O JSX permanece o mesmo
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gerenciamento de Pacientes</h1>
          <p className="text-muted-foreground">Visualize, adicione, edite ou remova pacientes.</p>
        </div>
        <PatientFormDialog
          patient={null}
          onSave={(data) => handleAddOrUpdatePatient(data)}
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
            onUpdatePatient={(patient) => handleAddOrUpdatePatient(patient, patient.id)}
            onDeletePatient={handleDeletePatient}
          />
        </CardContent>
      </Card>
    </div>
  );
}