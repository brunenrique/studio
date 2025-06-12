"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Group = {
  id: string;
  name: string;
  therapist: string;
  participants: number;
};

const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Grupo de Ansiedade",
    therapist: "Dr. Carlos",
    participants: 8,
  },
  {
    id: "g2",
    name: "Mindfulness Semanal",
    therapist: "Dra. Ana",
    participants: 12,
  },
  {
    id: "g3",
    name: "Apoio a Adolescentes",
    therapist: "Dr. Pedro",
    participants: 10,
  },
];

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Grupos Terapêuticos</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockGroups.map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>Terapeuta: {group.therapist}</p>
                <p>Participantes: {group.participants}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
