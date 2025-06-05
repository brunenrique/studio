"use client";

import { useState } from "react";
import type { TreatmentPlan } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TreatmentPlanSectionProps {
  plan: TreatmentPlan | undefined;
  onSave: (plan: TreatmentPlan) => void;
}

export function TreatmentPlanSection({ plan, onSave }: TreatmentPlanSectionProps) {
  const [content, setContent] = useState(plan?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedPlan: TreatmentPlan = {
      id: plan?.id || `plan-${Date.now()}`,
      title: plan?.title || "Plano de Tratamento",
      content,
    };
    onSave(updatedPlan);
    toast({
      title: "Plano Salvo",
      description: "O plano de tratamento foi atualizado.",
    });
    setIsSaving(false);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Plano de Tratamento</CardTitle>
        <CardDescription>Defina ou edite o plano terapêutico do paciente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Descreva o plano de tratamento"
        />
        <div className="text-right">
          <Button onClick={handleSave} disabled={isSaving || content.trim() === ""}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Plano
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
