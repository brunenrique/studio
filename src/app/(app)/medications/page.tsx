"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockMedications } from "@/lib/mock-data";
import type { Medication } from "@/lib/types";

export default function MedicationsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockMedications.filter((m: Medication) =>
    (m.name + m.class + m.indications + m.sideEffects)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Medicamentos</h1>
        <p className="text-muted-foreground">Lista de referência rápida.</p>
      </div>
      <Input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((m) => (
          <Card key={m.id} className="hover:shadow-md">
            <CardHeader>
              <CardTitle>{m.name}</CardTitle>
              <CardDescription>{m.class}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Indicações:</strong> {m.indications}
              </p>
              <p>
                <strong>Efeitos colaterais:</strong> {m.sideEffects}
              </p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum medicamento encontrado.</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Informações meramente educativas. Para prescrição e orientações, consulte um
        profissional de saúde.
      </p>
    </div>
  );
}
