"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  quickMedModules,
  type QuickMedModule,
  type QuickMed,
} from "@/lib/psychopharm-guide";

export default function MedicationsPage() {
  const [search, setSearch] = useState("");

  const filtered: QuickMedModule[] = quickMedModules
    .map((mod) => ({
      ...mod,
      medications: mod.medications.filter((m: QuickMed) =>
        (m.name + m.class + m.onLabel + m.offLabel)
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    }))
    .filter((m) => m.medications.length > 0 || search === "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Guia Rápido de Psicofarmacologia
        </h1>
        <p className="text-muted-foreground">
          Consulta simplificada de medicamentos.
        </p>
      </div>
      <Input
        placeholder="Buscar por nome ou condição..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Accordion type="multiple" className="space-y-4">
        {filtered.map((mod) => (
          <AccordionItem key={mod.name} value={mod.name}>
            <AccordionTrigger>{mod.name}</AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="pl-2">
                {mod.medications.map((m) => (
                  <AccordionItem key={m.id} value={m.id}>
                    <AccordionTrigger>{m.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Classe:</strong> {m.class}
                        </p>
                        <p>
                          <strong>On-label:</strong> {m.onLabel}
                        </p>
                        <p>
                          <strong>Off-label:</strong> {m.offLabel}
                        </p>
                        <p>
                          <strong>Mecanismo:</strong> {m.mechanism}
                        </p>
                        <p>
                          <strong>Início clínico:</strong> {m.onset}
                        </p>
                        <p>
                          <strong>Efeitos + comuns:</strong> {m.effects}
                        </p>
                        <p>
                          <strong>Contra:</strong> {m.contra}
                        </p>
                        <p>
                          <strong>Interações:</strong> {m.interactions}
                        </p>
                        <p>
                          <strong>Dica clínica / Monitor:</strong> {m.tip}
                        </p>
                        {m.source && (
                          <p className="text-xs text-muted-foreground">
                            Fonte: {m.source}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
