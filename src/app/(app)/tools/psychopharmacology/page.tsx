"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface MedicationInfo {
  name: string;
  class: string;
  commonUses: string;
  sideEffects: string;
}

const medications: MedicationInfo[] = [
  {
    name: "Sertralina",
    class: "ISRS",
    commonUses: "Depressão, transtornos de ansiedade, TOC",
    sideEffects: "Náusea, insônia, disfunção sexual",
  },
  {
    name: "Quetiapina",
    class: "Antipsicótico",
    commonUses: "Esquizofrenia, transtorno bipolar, agitação",
    sideEffects: "Sedação, ganho de peso, hipotensão",
  },
  {
    name: "Bupropiona",
    class: "Antidepressivo",
    commonUses: "Depressão, cessação do tabagismo",
    sideEffects: "Agitação, redução do apetite, insônia",
  },
];

export default function PsychopharmacologyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">
        Base de Conhecimento: Psicofarmacologia
      </h1>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar medicamento..." className="pl-8" />
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {medications.map((med) => (
          <AccordionItem key={med.name} value={med.name}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                {med.name}
                <Badge variant="secondary">{med.class}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="shadow">
                <CardHeader>
                  <CardTitle className="text-base">Usos Comuns</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">{med.commonUses}</CardContent>
              </Card>
              <Card className="shadow mt-4">
                <CardHeader>
                  <CardTitle className="text-base">
                    Principais Efeitos Adversos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">{med.sideEffects}</CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

