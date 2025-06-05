"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface Article {
  id: string;
  question: string;
  answer: string;
}

const articles: Article[] = [
  { id: '1', question: 'Como adicionar um paciente?', answer: 'Vá para a página de pacientes e clique em "Adicionar Paciente".' },
  { id: '2', question: 'Posso personalizar as métricas do dashboard?', answer: 'Sim, utilize a página de configurações para escolher quais métricas deseja ver.' },
  { id: '3', question: 'Os dados são criptografados?', answer: 'Este protótipo usa criptografia apenas em campos selecionados. Veja a documentação para mais detalhes.' },
];

export default function KnowledgeBasePage() {
  const [selected, setSelected] = useState<Article | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Base de Conhecimento</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((a) => (
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
