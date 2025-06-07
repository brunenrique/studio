"use client";

import { useDrag } from 'react-dnd';
import React from 'react';
import type { WaitingListItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export const WAITING_ITEM_TYPE = "WAITING_ITEM";

interface WaitlistDragListProps {
  items: WaitingListItem[];
}

export function WaitlistDragList({ items }: WaitlistDragListProps) {
  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Lista vazia.</p>
      )}
      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function DraggableItem({ item }: { item: WaitingListItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: WAITING_ITEM_TYPE,
    item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [item]);

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={cn(
        "cursor-grab rounded border bg-card p-2 shadow-sm",
        isDragging && "opacity-50"
      )}
    >
      <p className="font-medium leading-none">{item.patientName}</p>
      <p className="text-sm text-muted-foreground">{item.contact}</p>
      {item.notes && (
        <p className="text-xs text-muted-foreground truncate">{item.notes}</p>
      )}
    </div>
  );
}
