"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

export interface SettingsFormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsForm({ title, description, children, className }: SettingsFormProps) {
  return (
    <Card className={cn("shadow-lg max-w-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
