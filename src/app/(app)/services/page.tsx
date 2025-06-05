"use client";

import { useState, useEffect } from 'react';
import type { ServiceType } from '@/lib/types';
import { mockServiceTypes } from '@/lib/mock-data';
import { ServiceTypeTable } from '@/components/services/ServiceTypeTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ServiceTypeFormDialog } from '@/components/services/ServiceTypeFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setServices(mockServiceTypes);
  }, []);

  const handleSave = (svc: ServiceType) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === svc.id);
      if (exists) {
        return prev.map(s => (s.id === svc.id ? svc : s));
      }
      return [...prev, svc];
    });
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Serviços</h1>
          <p className="text-muted-foreground">Defina os tipos de consulta oferecidos.</p>
        </div>
        <ServiceTypeFormDialog onSave={handleSave} isOpen={isFormOpen} onOpenChange={setIsFormOpen}>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Serviço
          </Button>
        </ServiceTypeFormDialog>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Serviços Cadastrados</CardTitle>
          <CardDescription>Total de {services.length} serviços disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceTypeTable services={services} onSave={handleSave} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
