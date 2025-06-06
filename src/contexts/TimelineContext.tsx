"use client";

import { createContext, useContext, useState } from 'react';
import type { TimelineEvent } from '@/lib/types';

interface TimelineContextValue {
  events: TimelineEvent[];
  setEvents: (events: TimelineEvent[]) => void;
}

const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  return (
    <TimelineContext.Provider value={{ events, setEvents }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineContext() {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error('useTimelineContext must be used within TimelineProvider');
  }
  return ctx;
}
