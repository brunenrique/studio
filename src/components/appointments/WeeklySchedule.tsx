"use client";

import { useDrop } from 'react-dnd';
import type { Appointment, WaitingListItem } from '@/lib/types';
import { format, startOfWeek, addDays, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import React from 'react';
import { WAITING_ITEM_TYPE } from '@/components/waitlist/WaitlistDragList';

interface WeeklyScheduleProps {
  appointments: Appointment[];
  onDropFromWaitlist: (date: Date, item: WaitingListItem) => void;
}

export function WeeklySchedule({ appointments, onDropFromWaitlist }: WeeklyScheduleProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const times = Array.from({ length: 20 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return { hour, minute };
  });

  const getAppt = (date: Date) =>
    appointments.find(a => new Date(a.dateTime).getTime() === date.getTime());

  const renderCell = (day: Date, time: { hour: number; minute: number }) => {
    const start = setMinutes(setHours(day, time.hour), time.minute);
    const appt = getAppt(start);
    const [{ isOver, canDrop }, drop] = useDrop<WaitingListItem, void, { isOver: boolean; canDrop: boolean }>({
      accept: WAITING_ITEM_TYPE,
      drop: item => onDropFromWaitlist(start, item),
      canDrop: () => !appt,
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div
        key={`${day.toDateString()}-${time.hour}-${time.minute}`}
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className={cn(
          'h-12 border flex items-center justify-center text-xs',
          appt && 'bg-primary/10',
          isOver && canDrop && !appt && 'bg-green-200',
          isOver && !canDrop && 'bg-red-200'
        )}
      >
        {appt ? appt.patientName : format(start, 'HH:mm')}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid text-center" style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}>
        <div className="border" />
        {days.map(d => (
          <div key={`head-${d.toDateString()}`} className="border px-1 py-1 text-xs font-medium">
            {format(d, 'EEE dd/MM')}
          </div>
        ))}
        {times.map((t, idx) => (
          <React.Fragment key={idx}>
            <div className="border flex items-center justify-center text-xs font-medium">
              {format(setMinutes(setHours(weekStart, t.hour), t.minute), 'HH:mm')}
            </div>
            {days.map(day => renderCell(day, t))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
