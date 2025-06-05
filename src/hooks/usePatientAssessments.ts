"use client";

import { useEffect, useState } from 'react';
import { AssessmentResult } from '@/lib/types';
import { db } from '@/lib/firebaseClient';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export function usePatientAssessments(patientId: string) {
  const [data, setData] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'patients', patientId, 'assessments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const results = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as AssessmentResult[];
      setData(results);
      setLoading(false);
    });
    return () => unsub();
  }, [patientId]);

  return { data, loading };
}
