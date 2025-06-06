"use client";

import { useEffect, useState } from 'react';
import type { TimelineEvent } from '@/lib/types';
import { generateTimelineEvents } from '@/lib/timeline';

export function useTimeline(patientId?: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    setEvents(generateTimelineEvents(patientId));
  }, [patientId]);

  return { events };
}
