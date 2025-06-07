// Caminho: src/app/patients/page.tsx

"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// --- 1. IMPORTAÇÕES NECESSÁRIAS ---
import { db } from '@/lib/firebaseClient'; // Sua conexão com o Firestore
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { encryptPatientData } from '@/lib/api-client'; // Nossa função de criptografia

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

  // --- 2. BUSCANDO DADOS REAIS DO FIRESTORE ---
  useEffect(() => {
    if (user?.id) { // Garante que só busca dados se o usuário estiver logado
      const patientsCollectionRef = collection(db, 'patients');
      // onSnapshot ouve as mudanças em tempo real.
      const unsubscribe = onSnapshot(patientsCollectionRef, (querySnapshot) => {
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Patient));
        setPatients(patientsList);
      });

      // Limpa o listener quando o componente é desmontado para evitar vazamento de memória
      return () => unsubscribe();
    }
  }, [user]);

  // --- 3. FUNÇÃO DE SALVAR COM CRIPTOGRAFIA ---
  const handleAddOrUpdatePatient = async (patientData: Omit<Patient, 'id'>, patientId?: string) => {
    try {
      // CRIPTOGRAFA OS DADOS SENSÍVEIS ANTES DE SALVAR
      const encryptedCpf = await encryptPatientData(patientData.cpf);
      // Adicione outros campos sensíveis aqui, se houver
      // const encryptedNotes = await encryptPatientData(patientData.notes);

      const secureData = {
        ...patientData, // Copia os dados não sensíveis (nome, etc.)
        cpf: encryptedCpf, // Sobrescreve o CPF com a versão criptografada
        // notes: encryptedNotes,
      };

      if (patientId) {
        // ATUALIZA um paciente existente no Firestore
        const patientRef = doc(db, 'patients', patientId);
        await updateDoc(patientRef, secureData);
        toast({ title: "Paciente Atualizado" });
      } else {
        // ADICIONA um novo paciente ao Firestore
        await addDoc(collection(db, 'patients'), secureData);
        toast({ title: "Paciente Adicionado" });
      }

      setIsFormOpen(false); // Fecha o formulário após o sucesso

    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({ title: "Erro ao salvar", description: "Ocorreu um problema.", variant: "destructive" });
    }
  };

  const handleDeletePatient = (patientId: string) => {
    // A lógica de exclusão real deve acontecer aqui, usando deleteDoc do Firestore
    // Ex: await deleteDoc(doc(db, 'patients', patientId));
    console.log(`Lógica para deletar paciente ${patientId} precisa ser implementada.`);
  };

  if (!user || user.role !== 'PSYCHOLOGIST') {
    return <p className="p-4">Acesso restrito aos psicólogos.</p>;
  }

  // O resto do seu JSX permanece o mesmo, mas agora será alimentado com dados reais
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gerenciamento de Pacientes</h1>
          <p className="text-muted-foreground">Visualize, adicione, edite ou remova pacientes.</p>
        </div>
        <PatientFormDialog
          patient={null}
          onSave={(data) => handleAddOrUpdatePatient(data)} // Passa os dados para a função de salvar
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