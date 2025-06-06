"use client";

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10" data-ai-hint="notification bell">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none bg-secondary text-secondary-foreground transform translate-x-1/2 -translate-y-1/2 rounded-full">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Abrir notificações</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{unreadCount} notificações</TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notificações
          {unreadCount > 0 && (
            <button className="text-xs underline" onClick={markAllAsRead}>
              Marcar todas como lidas
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-sm text-muted-foreground">
            Nenhuma notificação
          </DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onSelect={() => markAsRead(n.id)}
              className={n.read ? 'text-muted-foreground text-sm' : 'font-semibold text-sm'}
            >
              {n.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
