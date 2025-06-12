"use client";

import { useState, useEffect } from 'react';
import type { Template } from '@/lib/types';
import { mockTemplates } from '@/lib/mock-data';
import { TemplateTable } from '@/components/templates/TemplateTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    setTemplates(mockTemplates);
  }, []);

  const handleSave = (tpl: Template) => {
    setTemplates(prev => {
      const exists = prev.find(t => t.id === tpl.id);
      if (exists) {
        return prev.map(t => (t.id === tpl.id ? tpl : t));
      }
      return [...prev, tpl];
    });
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Modelos</h1>
          <p className="text-muted-foreground">Gerencie modelos reutilizáveis.</p>
        </div>
        <Button asChild className="shadow-md">
          <Link href="/templates/new" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Novo Modelo
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Modelos Salvos</CardTitle>
          <CardDescription>Total de {templates.length} modelos disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateTable templates={templates} onSave={handleSave} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
