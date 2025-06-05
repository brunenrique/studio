
"use client";

import { useState, useEffect } from 'react';
import type { WaitingListItem } from '@/lib/types';
import { mockWaitingList } from '@/lib/mock-data';
import { WaitlistTable } from '@/components/waitlist/WaitlistTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddToWaitlistDialog } from '@/components/waitlist/AddToWaitlistDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function WaitingListPage() {
  const [waitlistItems, setWaitlistItems] = useState<WaitingListItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setWaitlistItems(mockWaitingList);
  }, []);

  const handleAddItem = (itemData: WaitingListItem) => {
    setWaitlistItems(prevItems => [...prevItems, itemData]);
    toast({
      title: "Paciente Adicionado à Lista",
      description: `${itemData.patientName} foi adicionado(a) à lista de espera.`,
    });
    setIsFormOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setWaitlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // Toast handled in WaitlistTable
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Lista de Espera</h1>
            <p className="text-muted-foreground">Gerencie pacientes aguardando por um horário.</p>
        </div>
        <AddToWaitlistDialog 
            onSave={handleAddItem}
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
        >
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar à Lista
          </Button>
        </AddToWaitlistDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Pacientes em Espera</CardTitle>
          <CardDescription>Total de {waitlistItems.length} pacientes na lista.</CardDescription>
        </CardHeader>
        <CardContent>
          <WaitlistTable items={waitlistItems} onDeleteItem={handleDeleteItem} />
        </CardContent>
      </Card>
    </div>
  );
}
