"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Patient } from "@/lib/types";

const base = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || "";

export function PatientCard({ patient }: { patient: Patient }) {
  const src = patient.photo ? `${base}/${patient.photo}` : `${base}/placeholder`;
  return (
    <Card className="flex items-center gap-4 p-4">
      <Image
        src={src}
        alt={patient.name}
        width={48}
        height={48}
        className="rounded-full object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZGRkIi8+PC9zdmc+"
      />
      <CardContent className="p-0">
        <p className="font-medium">{patient.name}</p>
        <p className="text-sm text-muted-foreground">{patient.email}</p>
      </CardContent>
    </Card>
  );
}
