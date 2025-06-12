"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type AuditLog = {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    role: "Admin" | "Psychologist";
  };
  action: "LOGIN" | "VIEW_PATIENT" | "EDIT_APPOINTMENT" | "GENERATE_REPORT";
  details: string;
};

const mockData: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(),
    user: { name: "Alice", role: "Admin" },
    action: "LOGIN",
    details: "Acesso realizado ao sistema",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    user: { name: "Bruno", role: "Psychologist" },
    action: "VIEW_PATIENT",
    details: "Visualizou ficha do paciente #123",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: { name: "Clara", role: "Psychologist" },
    action: "EDIT_APPOINTMENT",
    details: "Editou consulta agendada para 02/04",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    user: { name: "Davi", role: "Admin" },
    action: "GENERATE_REPORT",
    details: "Gerou relatório mensal de atendimentos",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    user: { name: "Eduarda", role: "Psychologist" },
    action: "VIEW_PATIENT",
    details: "Acessou histórico do paciente #456",
  },
];

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Trilha de Auditoria do Sistema</h1>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Logs Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(log.timestamp, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                  <TableCell>
                    {log.user.name} ({log.user.role})
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      log.action === "LOGIN"
                        ? "default"
                        : log.action === "VIEW_PATIENT"
                        ? "secondary"
                        : log.action === "EDIT_APPOINTMENT"
                        ? "destructive"
                        : "outline"
                    }>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
