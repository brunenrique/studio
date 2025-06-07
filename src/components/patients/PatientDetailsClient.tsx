// Caminho: src/components/patients/PatientDetailsClient.tsx

"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { decryptPatientData } from '@/lib/api-client'; // Nossa função de descriptografia

export function PatientDetailsClient({ patientId }: { patientId: string }) {
  // Estado para armazenar os dados do paciente JÁ DESCRIPTOGRAFADOS
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const patientRef = doc(db, 'patients', patientId);

    const unsubscribe = onSnapshot(patientRef, async (docSnap) => {
      setIsLoading(true);
      setError(null);

      if (docSnap.exists()) {
        const encryptedData = { id: docSnap.id, ...docSnap.data() } as Patient;

        try {
          // CHAMA A API PARA DESCRIPTOGRAFAR OS DADOS
          const [decryptedCpf] = await Promise.all([
            decryptPatientData(encryptedData.cpf),
            // Adicione outras chamadas decryptPatientData para outros campos aqui
          ]);

          // Atualiza o estado com os dados "limpos" para exibição
          setPatient({
            ...encryptedData,
            cpf: decryptedCpf,
          });

        } catch (err) {
          console.error("Falha ao descriptografar dados do paciente:", err);
          setError("Não foi possível carregar os dados seguros do paciente.");
        }
      } else {
        setError("Paciente não encontrado.");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [patientId]);

  if (isLoading) {
    return <div>Carregando informações do paciente...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!patient) {
    return <div>Nenhum dado de paciente para exibir.</div>;
  }

  // Agora, você exibe os dados descriptografados de forma segura
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">{patient.name}</h2>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>CPF:</strong> {patient.cpf}</p> {/* <-- EXIBINDO O CPF REAL E DESCRIPTOGRAFADO */}
      {/* Adicione outros campos aqui */}
    </div>
  );
}