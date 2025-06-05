"use client";

import { useState, useEffect } from 'react';
import type { KnowledgeBaseItem } from '@/lib/types';
import { mockKnowledgeBase } from '@/lib/mock-data';
import { KnowledgeBaseTable } from '@/components/knowledge-base/KnowledgeBaseTable';
import { KnowledgeFormDialog } from '@/components/knowledge-base/KnowledgeFormDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setItems(mockKnowledgeBase);
  }, []);

  const handleAddItem = (item: KnowledgeBaseItem) => {
    setItems(prev => [...prev, item]);
    toast({
      title: "Nota Salva",
      description: `"${item.title}" foi adicionada à base de conhecimento.`,
    });
    setIsFormOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    toast({
      title: "Nota Removida",
      description: `Item removido com sucesso.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Base de Conhecimento</h1>
          <p className="text-muted-foreground">Notas pessoais e referências úteis.</p>
        </div>
        <KnowledgeFormDialog onSave={handleAddItem} isOpen={isFormOpen} onOpenChange={setIsFormOpen}>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Nota
          </Button>
        </KnowledgeFormDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Notas Salvas</CardTitle>
          <CardDescription>Total de {items.length} notas.</CardDescription>
        </CardHeader>
        <CardContent>
          <KnowledgeBaseTable items={items} onDeleteItem={handleDeleteItem} />
        </CardContent>
      </Card>
    </div>
  );
}
