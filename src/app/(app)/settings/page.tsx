"use client";

import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Ajuste preferências que afetam todo o sistema.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
