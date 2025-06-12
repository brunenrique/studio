"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type PendingUser = {
  id: string;
  name: string;
  email: string;
  requestedAt: Date;
  credentials: string;
};

const pendingUsers: PendingUser[] = [
  {
    id: "1",
    name: "Carlos Souza",
    email: "carlos@example.com",
    requestedAt: new Date("2024-04-10"),
    credentials: "Psicólogo, CRP 123456",
  },
  {
    id: "2",
    name: "Fernanda Lima",
    email: "fernanda@example.com",
    requestedAt: new Date("2024-04-09"),
    credentials: "Psiquiatra, CRM 789012",
  },
  {
    id: "3",
    name: "João Mendes",
    email: "joao@example.com",
    requestedAt: new Date("2024-04-08"),
    credentials: "Terapeuta Ocupacional, CREFITO 345678",
  },
];

export default function UserApprovalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Aprovações de Novos Usuários</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingUsers.map((user) => (
          <Card key={user.id} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://placehold.co/48x48?text=${user.name.charAt(0)}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{user.credentials}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Solicitação em {user.requestedAt.toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Aprovar</Button>
              <Button variant="destructive">Recusar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
