"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type WaitingListEntry = {
  id: string;
  patientName: string;
  submittedAt: Date;
  contact: string;
  status: "Aguardando" | "Contatado" | "Agendado";
};

const data: WaitingListEntry[] = [
  {
    id: "1",
    patientName: "Ana Silva",
    submittedAt: new Date("2024-04-10"),
    contact: "ana@example.com",
    status: "Aguardando",
  },
  {
    id: "2",
    patientName: "Bruno Costa",
    submittedAt: new Date("2024-04-09"),
    contact: "(11) 98765-4321",
    status: "Contatado",
  },
  {
    id: "3",
    patientName: "Carla Souza",
    submittedAt: new Date("2024-04-08"),
    contact: "carla@example.com",
    status: "Agendado",
  },
  {
    id: "4",
    patientName: "Daniel Rocha",
    submittedAt: new Date("2024-04-07"),
    contact: "(21) 91234-5678",
    status: "Aguardando",
  },
  {
    id: "5",
    patientName: "Eduarda Lima",
    submittedAt: new Date("2024-04-06"),
    contact: "eduarda@example.com",
    status: "Contatado",
  },
];

const statusClasses: Record<WaitingListEntry["status"], string> = {
  Aguardando: "bg-warning-100 text-warning-800",
  Contatado: "bg-blue-100 text-blue-800",
  Agendado: "bg-accent-100 text-accent-800",
};

export default function WaitingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Lista de Espera</h1>
        <Button>Adicionar à Lista</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Data de Submissão</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.patientName}</TableCell>
              <TableCell>{item.submittedAt.toLocaleDateString()}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>
                <Badge className={statusClasses[item.status]}>{item.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como Contatado</DropdownMenuItem>
                    <DropdownMenuItem>Remover da Lista</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
