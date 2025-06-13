"use client";

import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PatientAssessment = {
  id: string;
  title: string;
  status: "Pendente" | "Concluída";
  assignedBy: string;
  dueDate: Date | null;
  completedAt: Date | null;
};

const assessments: PatientAssessment[] = [
  {
    id: "1",
    title: "Inventário de Depressão de Beck",
    status: "Pendente",
    assignedBy: "Dra. Ana Paula",
    dueDate: new Date("2024-08-10"),
    completedAt: null,
  },
  {
    id: "2",
    title: "Escala de Ansiedade de Hamilton",
    status: "Concluída",
    assignedBy: "Dr. Carlos Silva",
    dueDate: null,
    completedAt: new Date("2024-06-15"),
  },
  {
    id: "3",
    title: "Questionário de Qualidade de Vida",
    status: "Pendente",
    assignedBy: "Dra. Ana Paula",
    dueDate: new Date("2024-07-01"),
    completedAt: null,
  },
  {
    id: "4",
    title: "Inventário de Estresse Percebido",
    status: "Concluída",
    assignedBy: "Dr. Carlos Silva",
    dueDate: null,
    completedAt: new Date("2024-05-20"),
  },
];

export default function MyAssessmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Minhas Avaliações e Questionários</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((a) => (
          <Card key={a.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{a.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Atribuído por: {a.assignedBy}</p>
              {a.status === "Pendente" && a.dueDate && (
                <p>Data Limite: {format(a.dueDate, "dd/MM/yyyy")}</p>
              )}
              {a.status === "Concluída" && a.completedAt && (
                <p>Concluído em: {format(a.completedAt, "dd/MM/yyyy")}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button>{a.status === "Pendente" ? "Responder Agora" : "Ver Resultado"}</Button>
            </CardFooter>
            <Badge
              variant={a.status === "Pendente" ? "default" : "secondary"}
              className="absolute right-4 top-4"
            >
              {a.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

