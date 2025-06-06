import dynamic from 'next/dynamic';
import { mockSymptomEntries } from '@/lib/mock-data';
import type { SymptomHeatmapEntry } from '@/lib/types';

const SymptomHeatmap = dynamic(() => import('@/components/analytics/SymptomHeatmap'), { ssr: false });

export default function SymptomHeatmapPage() {
  const entries: SymptomHeatmapEntry[] = mockSymptomEntries;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Heatmap de Sintomas</h1>
      <SymptomHeatmap entries={entries} />
    </div>
  );
}
