"use client";

import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AuditLogPage() {
  const { logs } = useAuditLogs();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Audit Trail</h1>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Logs Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Quando</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.userId || '-'}</TableCell>
                  <TableCell>{
                    typeof log.timestamp === 'string'
                      ? new Date(log.timestamp).toLocaleString()
                      : (log.timestamp as any)?.toDate?.().toLocaleString()
                  }</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.details || '-'}
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
