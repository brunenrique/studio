"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { KnowledgeBaseArticle } from '@/lib/types';
import { mockKnowledgeBaseArticles } from '@/lib/mock-data';

export default function KnowledgeBasePage() {
  const [selected, setSelected] = useState<KnowledgeBaseArticle | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Base de Conhecimento</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {mockKnowledgeBaseArticles.map((a) => (
          <Card key={a.id} onClick={() => setSelected(a)} className="cursor-pointer hover:shadow-md">
            <CardHeader>
              <CardTitle>{a.question}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {selected && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{selected.question}</CardTitle>
            <CardDescription>Resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{selected.answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
