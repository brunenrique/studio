"use client";

import { useState, useEffect } from 'react';
import { TestMeta } from '@/lib/types';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  test: TestMeta;
}

export default function ApplyTestModal({ test }: Props) {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [patientId, setPatientId] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getDocs(collection(db, 'patients')).then((snap) => {
      setPatients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  const handleSend = async () => {
    if (!patientId) return;
    setSending(true);
    await addDoc(collection(db, 'patients', patientId, 'assessments'), {
      testId: test.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setSending(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Aplicar</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Aplicar {test.name}</DialogTitle>
        </DialogHeader>
        <Select onValueChange={setPatientId} value={patientId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o paciente" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSend} disabled={!patientId || sending} className="w-full">
          Enviar Link
        </Button>
      </DialogContent>
    </Dialog>
  );
}
