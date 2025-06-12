"use client";

import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/resources/resource-card";

export type Resource = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "Artigo" | "Vídeo" | "Exercício";
};

const resources: Resource[] = [
  {
    id: "1",
    title: "Entendendo a Ansiedade",
    description: "Saiba mais sobre sintomas e tratamentos para ansiedade.",
    imageUrl: "https://placehold.co/600x400",
    type: "Artigo",
  },
  {
    id: "2",
    title: "Técnicas de Respiração",
    description: "Exercício guiado para momentos de estresse.",
    imageUrl: "https://placehold.co/600x400",
    type: "Vídeo",
  },
  {
    id: "3",
    title: "Diário da Gratidão",
    description: "Ferramenta simples para registrar pensamentos positivos.",
    imageUrl: "https://placehold.co/600x400",
    type: "Exercício",
  },
  {
    id: "4",
    title: "Importância do Sono",
    description: "Artigo sobre como o sono afeta a saúde mental.",
    imageUrl: "https://placehold.co/600x400",
    type: "Artigo",
  },
  {
    id: "5",
    title: "Mindfulness para Iniciantes",
    description: "Vídeo introdutório ao mindfulness.",
    imageUrl: "https://placehold.co/600x400",
    type: "Vídeo",
  },
  {
    id: "6",
    title: "Alongamento para Relaxar",
    description: "Sequência rápida de alongamentos para o dia a dia.",
    imageUrl: "https://placehold.co/600x400",
    type: "Exercício",
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Recursos e Materiais de Apoio</h1>
      <div className="flex gap-2">
        <Button variant="outline">Todos</Button>
        <Button variant="outline">Artigos</Button>
        <Button variant="outline">Vídeos</Button>
        <Button variant="outline">Exercícios</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} {...resource} />
        ))}
      </div>
    </div>
  );
}
