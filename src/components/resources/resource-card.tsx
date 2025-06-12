import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  type: string;
}

export function ResourceCard({ title, description, imageUrl, type }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <Image src={imageUrl} alt={title} width={400} height={200} className="h-40 w-full object-cover" />
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs uppercase text-muted-foreground mb-2">{type}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
