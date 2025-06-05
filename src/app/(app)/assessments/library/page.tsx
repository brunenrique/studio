import { adminDb } from '@/lib/firebaseAdmin';
import { TestMeta } from '@/lib/types';
import ApplyTestModal from '@/components/assessments/ApplyTestModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function LibraryPage() {
  const snap = await adminDb.collection('testsLibrary').get();
  const tests: TestMeta[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<TestMeta, 'id'>) }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Biblioteca de Inventários</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instrumento</TableHead>
            <TableHead>Domínio</TableHead>
            <TableHead>Nº Perguntas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map(test => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell>{test.domain}</TableCell>
              <TableCell>{test.numQuestions}</TableCell>
              <TableCell className="text-right"><ApplyTestModal test={test} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
