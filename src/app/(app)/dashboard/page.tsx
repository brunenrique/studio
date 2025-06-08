"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect e useState
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { db } from "@/lib/firebaseClient"; // Importa a conexão com o Firestore
import { collection, onSnapshot } from "firebase/firestore"; // Funções do Firestore
import type { Patient } from "@/lib/types";

// Componentes da UI (sem alteração)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, CalendarDays, ListChecks, FileText, Lightbulb, PiggyBank, Gift } from "lucide-react";
import { startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { dashboard } = useSettings();

  // --- ESTADOS PARA DADOS REAIS ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- DADOS TEMPORÁRIOS COMO ARRAYS VAZIOS ---
  const appointments: any[] = [];
  const waitingList: any[] = [];
  const financeRecords: any[] = [];

  // Busca pacientes do Firestore quando o usuário está logado
  useEffect(() => {
    if (user?.id) {
      const patientsCollectionRef = collection(db, 'patients');
      const unsubscribe = onSnapshot(patientsCollectionRef, (snapshot) => {
        const patientsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
        setPatients(patientsList);
        setIsDataLoading(false);
      }, (error) => {
        console.error("Erro ao buscar pacientes no dashboard: ", error);
        setIsDataLoading(false);
      });
      return () => unsubscribe(); // Limpa o listener
    } else if (!isAuthLoading) {
        setIsDataLoading(false); // Se não há usuário, para de carregar
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando Dashboard...</p>
      </div>
    );
  }
  
  if (!user) {
    // Pode redirecionar para o login ou mostrar uma mensagem
    return <p>Por favor, faça o login para ver o dashboard.</p>
  }

  const now = new Date();

  // Cálculos agora usam os dados do estado ou os arrays vazios
  const todaysAppointmentsCount = appointments.filter(a => isSameDay(new Date(a.dateTime), now)).length;
  const weeklyAppointmentsCount = appointments.length; // Lógica simplificada por enquanto
  const activePatientsCount = patients.length;
  const waitingListCount = waitingList.length;
  const monthlyRevenue = financeRecords.reduce((sum, r) => sum + r.amount, 0);

  // Funcionalidade de aniversário comentada, pois depende de dados descriptografados
  const upcomingBirthdays: any[] = [];
  
  return (
    <div className="space-y-8">
      {/* O resto do seu JSX permanece exatamente o mesmo */}
      <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between relative">
        {/* ... Conteúdo do card de boas-vindas ... */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ... Todos os seus cards de estatísticas (agora usando os dados do estado ou arrays vazios) ... */}
      </div>
      
      <Card className="shadow-lg">
         {/* ... Conteúdo do card de funcionalidades ... */}
      </Card>
      
      <Card className="shadow-lg bg-primary/5 border-primary/20">
         {/* ... Conteúdo do card de lembrete de segurança ... */}
      </Card>
    </div>
  );
}