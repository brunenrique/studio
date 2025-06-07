"use client";

import dynamic from 'next/dynamic';
import { mockFormulations } from '@/lib/mock-data';
import type { FormulationDiagram } from '@/lib/types';

const FormulationTree = dynamic(() => import('@/components/tools/FormulationTree'), {
  ssr: false,
});

export default function FormulationTreePage() {
  const diag: FormulationDiagram | undefined = mockFormulations[0];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Árvore de Formulação</h1>
      {diag && <FormulationTree diagramJson={diag.diagramJson} />}
    </div>
  );
}
