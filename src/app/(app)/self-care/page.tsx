"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { HeartPulse, Brain } from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";

export default function SelfCarePage() {
  const [stress, setStress] = useState(50);

  useEffect(() => {
    const stored = localStorage.getItem("psiguard_stress_level");
    if (stored) {
      const num = parseInt(stored, 10);
      if (!isNaN(num)) {
        setStress(num);
      }
    }
  }, []);

  const handleStressChange = (values: number[]) => {
    const level = values[0];
    setStress(level);
    localStorage.setItem("psiguard_stress_level", String(level));
  };

  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const upcomingCount = mockAppointments.filter((a) => {
    const date = new Date(a.dateTime);
    return date >= now && date <= nextWeek;
  }).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Saúde Mental</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" /> Nível de Estresse
          </CardTitle>
          <CardDescription>
            Acompanhe e ajuste como você está se sentindo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[stress]}
            onValueChange={handleStressChange}
            max={100}
            step={1}
          />
          <Progress value={stress} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Volume de Trabalho
          </CardTitle>
          <CardDescription>
            Agendamentos previstos para os próximos 7 dias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{upcomingCount}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recursos de Apoio</CardTitle>
          <CardDescription>
            Encontre sugestões para cuidar da sua saúde mental.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <a
                href="https://apsique.com/artigos/tecnicas-respiracao"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Exercícios de Respiração
              </a>
            </li>
            <li>
              <a
                href="https://apsique.com/artigos/mindfulness"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Práticas de Mindfulness
              </a>
            </li>
            <li>
              <a
                href="https://apsique.com/buscar-terapeuta"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Encontre suporte profissional
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
