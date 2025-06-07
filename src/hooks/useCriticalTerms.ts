import { useMemo } from 'react';
import type { SessionNote } from '@/lib/types';

const TERMS = ['ideação suicida', 'automutilação', 'abandono escolar'];

export function useCriticalTerms(notes: SessionNote[]): string[] {
  return useMemo(() => {
    const found = new Set<string>();
    notes.forEach((n) => {
      const lower = n.notes.toLowerCase();
      TERMS.forEach((t) => {
        if (lower.includes(t)) found.add(t);
      });
    });
    return Array.from(found);
  }, [notes]);
}
