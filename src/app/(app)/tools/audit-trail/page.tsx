"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

const mockData: AuditEntry[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: "admin@example.com",
    action: "LOGIN",
    details: "Usuário realizou login no sistema",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: "psicologo@example.com",
    action: "VIEW_PATIENT_RECORD",
    details: "Visualizou prontuário do paciente #123",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: "psicologo@example.com",
    action: "UPDATE_SESSION_NOTE",
    details: "Atualizou nota da sessão 456",
  },
];

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Trilha de Auditoria</h1>
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
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.details || "-"}
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
