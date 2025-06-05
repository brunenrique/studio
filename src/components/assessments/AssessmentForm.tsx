"use client";

import { useState } from 'react';
import { TestMeta } from '@/lib/types';
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  test: TestMeta;
  assessmentRefPath: string;
}

export default function AssessmentForm({ test, assessmentRefPath }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const questions = Array.from({ length: test.numQuestions });

  const handleSubmit = async () => {
    setSaving(true);
    const score = Object.values(answers).reduce((acc, cur) => acc + parseInt(cur || '0'), 0);
    await updateDoc(doc(db, assessmentRefPath), {
      status: 'completed',
      completedAt: new Date().toISOString(),
      rawAnswers: answers,
      score,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">{test.name}</h1>
      <p className="text-sm mb-4">{test.instructions}</p>
      {questions.map((_, idx) => (
        <Input
          key={idx}
          required
          type="number"
          placeholder={`Pergunta ${idx + 1}`}
          value={answers[idx] || ''}
          onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
        />
      ))}
      <Button type="submit" disabled={saving}>Enviar</Button>
    </form>
  );
}
