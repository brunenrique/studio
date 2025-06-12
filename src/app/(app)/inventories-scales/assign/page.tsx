"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

const mockPatients: Option[] = [
  { id: "p1", name: "João da Silva" },
  { id: "p2", name: "Maria Oliveira" },
];

const mockInventories: Option[] = [
  { id: "beck", name: "Inventário de Depressão de Beck" },
  { id: "hamilton", name: "Escala de Ansiedade de Hamilton" },
];

export default function AssignInventoryPage() {
  const [patient, setPatient] = useState("");
  const [inventory, setInventory] = useState("");
  const [sendDate, setSendDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submit logic
    console.log({ patient, inventory, sendDate, dueDate });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Atribuir Inventário</h1>
      <Card className="max-w-md shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Nova Atribuição</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Paciente</label>
              <Select value={patient} onValueChange={setPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Inventário</label>
              <Select value={inventory} onValueChange={setInventory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventories.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Data de Envio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {sendDate ? (
                      format(sendDate, "dd/MM/yyyy")
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={sendDate}
                    onSelect={setSendDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Data de Resposta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dueDate ? (
                      format(dueDate, "dd/MM/yyyy")
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">Atribuir</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

