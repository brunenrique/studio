"use client";

import type { TimelineEvent } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

interface TimelineViewerProps {
  events: TimelineEvent[];
}

export default function TimelineViewer({ events }: TimelineViewerProps) {
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [events]
  ); // useMemo para evitar nova ordenação em cada render
  return (
    <div className="space-y-4">
      {sorted.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle className="text-sm">
              {new Date(event.date).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{event.title}</p>
            {event.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {event.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
