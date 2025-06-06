"use client";
import type { PatientFullData } from '@/lib/types';
import { usePatientFullData } from '@/hooks/usePatientFullData';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  data: PatientFullData;
}

export function PatientDetailsClient({ data }: Props) {
  const realtime = usePatientFullData(data.patient.id);
  const { patient, sessions, notes, payments, documents, treatmentPlans } = realtime ?? data;
  const lastNote = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{patient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Contato: {patient.contact}</p>
          <p>Nascimento: {format(new Date(patient.dateOfBirth), 'dd/MM/yyyy')}</p>
          {patient.gender && <p>Gênero: {patient.gender}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{format(new Date(s.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{s.status}</TableCell>
                  <TableCell>{s.noteId && <a href={`#note-${s.noteId}`} className="underline text-primary">ver</a>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {lastNote && (
        <Card id={`note-${lastNote.id}`}>
          <CardHeader>
            <CardTitle>Nota da Última Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm">{lastNote.content}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 && <p className="text-sm">Nenhum documento.</p>}
          <ul className="text-sm space-y-1">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} download className="underline text-primary">
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Finanças</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Total Pago: R$ {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
          <p>Saldo Devedor: R$ {patient.balanceDue?.toFixed(2) ?? '0.00'}</p>
          {payments.length > 0 && (
            <ul className="list-disc ml-4">
              {payments.slice(0, 3).map((p) => (
                <li key={p.id}>{format(new Date(p.date), 'dd/MM/yyyy')} - R$ {p.amount.toFixed(2)}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plano de Tratamento</CardTitle>
        </CardHeader>
        <CardContent>
          {treatmentPlans.length === 0 && <p className="text-sm">Nenhum plano registrado.</p>}
          <ul className="list-disc ml-4 text-sm space-y-1">
            {treatmentPlans.map((tp) => (
              <li key={tp.id}>{tp.goal}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
