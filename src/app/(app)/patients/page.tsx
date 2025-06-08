"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebaseClient';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

// --- IMPORTAÇÃO CORRETA ---
// Usamos o api-client para TODAS as operações de cripto, não os utils diretamente.
import { encryptPatientData } from '@/lib/api-client';

// ... outros imports de UI ...

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  // ... resto dos seus states ...

  useEffect(() => {
    // ... sua lógica de buscar pacientes do Firestore (está correta) ...
  }, [user]);

  const handleAddOrUpdatePatient = async (patientFormData: Omit<Patient, 'id'>, patientId?: string) => {
    if (!user) { /* ... */ return; }

    try {
      // 1. Criptografa CADA CAMPO SENSÍVEL usando a API
      const encryptedCpf = await encryptPatientData(patientFormData.cpf || '');
      const encryptedContact = await encryptPatientData(patientFormData.contact || '');
      // ... criptografe outros campos aqui

      const secureData = {
        ...patientFormData,
        cpf: encryptedCpf,
        contact: encryptedContact,
        // ...
      };

      const patientRef = doc(db, 'patients', patientId || crypto.randomUUID());
      await setDoc(patientRef, secureData, { merge: true });

      toast({ title: patientId ? "Paciente Atualizado" : "Paciente Adicionado" });
      // ...
    } catch (error) {
      // ...
    }
  };

  // ... O resto do seu JSX permanece o mesmo ...
}