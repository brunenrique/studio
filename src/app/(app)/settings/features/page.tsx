"use client";

import { features } from "@/lib/features";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeaturesPage() {
  const grouped = features.reduce<Record<string, typeof features>>( (acc, f) => {
    acc[f.category] = acc[f.category] || [];
    acc[f.category].push(f);
    return acc;
  }, {} );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Funcionalidades</h1>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((f) => (
              <Card key={f.href} className="hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{f.label}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={f.href} className="text-sm text-primary underline">
                    Acessar
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
