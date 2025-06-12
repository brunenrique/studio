"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

import type { Group } from "../page";

const mockGroups: Group[] = [
  { id: "g1", name: "Grupo de Ansiedade", therapist: "Dr. Carlos", participants: 8 },
  { id: "g2", name: "Mindfulness Semanal", therapist: "Dra. Ana", participants: 12 },
  { id: "g3", name: "Apoio a Adolescentes", therapist: "Dr. Pedro", participants: 10 },
];

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = mockGroups.find((g) => g.id === params.id);
  const router = useRouter();

  if (!group) {
    return (
      <div className="p-4">
        <p>Grupo não encontrado.</p>
        <button onClick={() => router.back()} className="text-blue-600 underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/groups" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Terapeuta Responsável: {group.therapist}</p>
          <p>Número de Participantes: {group.participants}</p>
        </CardContent>
      </Card>
    </div>
  );
}
