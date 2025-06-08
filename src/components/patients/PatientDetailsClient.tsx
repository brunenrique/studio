// Caminho: src/components/patients/PatientDetailsClient.tsx

"use client";

import { useState, useEffect } from 'react';
import type { Patient } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

// --- 1. IMPORTAÇÃO ATUALIZADA ---
import { decryptPatientObject } from '@/lib/patient-utils'; // <-- Usando nosso novo utilitário!

// Componente para exibir um esqueleto de carregamento (opcional, mas recomendado)
const PatientDetailsSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export function PatientDetailsClient({ patientId }: { patientId: string }) {
  // Estado para armazenar os dados do paciente JÁ DESCRIPTOGRAFADOS
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setError("ID do paciente não fornecido.");
      setIsLoading(false);
      return;
    }

    const patientRef = doc(db, 'patients', patientId);

    // Ouve as mudanças no documento do paciente em tempo real
    const unsubscribe = onSnapshot(patientRef, (docSnap) => {
      setIsLoading(true);
      setError(null);

      if (docSnap.exists()) {
        // Pega os dados criptografados do Firestore
        const encryptedData = { id: docSnap.id, ...docSnap.data() } as Patient;

        // --- 2. LÓGICA DE DESCRIPTOGRAFIA SIMPLIFICADA ---
        try {
          // USA A FUNÇÃO CENTRAL PARA DESCRIPTOGRAFAR TODOS OS CAMPOS SENSÍVEIS
          const decryptedPatient = decryptPatientObject(encryptedData);

          // Atualiza o estado com os dados "limpos" e prontos para exibição
          setPatient(decryptedPatient);

        } catch (err) {
          console.error("Falha crítica ao processar dados do paciente:", err);
          setError("Não foi possível carregar os dados seguros do paciente. Contate o suporte.");
        }
      } else {
        setError("Paciente não encontrado no banco de dados.");
      }
      setIsLoading(false);
    }, (err) => {
      // Lida com erros de permissão do Firestore
      console.error("Erro de permissão do Firestore:", err);
      setError("Você não tem permissão para ver este paciente ou ocorreu um erro de rede.");
      setIsLoading(false);
    });

    // Limpa o listener quando o componente é desmontado
    return () => unsubscribe();
  }, [patientId]);

  if (isLoading) {
    return <PatientDetailsSkeleton />;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;
  }

  if (!patient) {
    return <div>Nenhum dado de paciente para exibir.</div>;
  }

  // Agora, você exibe os dados descriptografados de forma segura
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold font-headline text-gray-800 mb-4">{patient.name}</h2>
      <div className="space-y-2 text-gray-600">
        <p><strong>Email:</strong> {patient.email || 'Não informado'}</p>
        <p><strong>CPF:</strong> {patient.cpf}</p> {/* <-- EXIBINDO O CPF REAL E DESCRIPTOGRAFADO */}
        <p><strong>Contato:</strong> {patient.contact}</p>
        <p><strong>Data de Nascimento:</strong> {patient.dateOfBirth}</p>
        <hr className="my-4" />
        <h3 className="text-xl font-semibold text-gray-700">Plano Terapêutico</h3>
        <p className="whitespace-pre-wrap">{patient.treatmentPlan}</p>
        {/* Para exibir as notas, você precisaria mapeá-las */}
        <h3 className="text-xl font-semibold text-gray-700 mt-4">Notas da Sessão</h3>
        {Array.isArray(patient.sessionNotes) && patient.sessionNotes.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {patient.sessionNotes.map(note => (
              <li key={note.id}><strong>{new Date(note.date).toLocaleDateString()}:</strong> {note.notes}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma nota de sessão registrada.</p>
        )}
      </div>
    </div>
  );
}