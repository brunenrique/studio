"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Save, Loader2 } from "lucide-react";
import type { Patient } from "@/lib/types";

interface TreatmentPlanSectionProps {
  patient: Patient;
  onSave: (plan: string) => Promise<void>;
}

export function TreatmentPlanSection({ patient, onSave }: TreatmentPlanSectionProps) {
  const [plan, setPlan] = useState<string>(patient.treatmentPlan || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(plan);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Plano Terapêutico
            </CardTitle>
            <CardDescription>
              Defina objetivos e etapas do tratamento.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button size="sm" onClick={() => setIsEditing(true)} className="shadow-md">
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              rows={6}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Ex: Reduzir episódios de ansiedade em 3 meses."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPlan(patient.treatmentPlan || "");
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving || plan.trim() === ""}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">
            {patient.treatmentPlan || "Nenhum plano definido."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

