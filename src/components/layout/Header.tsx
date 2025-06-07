"use client";

import { Button } from '@/components/ui/button';
import { NotificationBell } from './NotificationBell';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSmartMenu } from '@/lib/use-smart-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const menu = useSmartMenu({ id: 'profile', restoreFocus: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (menu.open) {
      const el = menu.ref.current?.querySelector<HTMLElement>('button, a');
      el?.focus();
    } else {
      buttonRef.current?.focus();
    }
  }, [menu.open]);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Logo />
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(search)}`);
        }}
        className="flex-1 max-w-xs hidden md:block"
      >
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full"
        />
      </form>

      <div className="flex items-center gap-4 ml-auto">
        <NotificationBell />
        <ThemeToggle />

        {user && (
          <DropdownMenu open={menu.open} onOpenChange={menu.setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                ref={buttonRef}
                onClick={menu.toggle}
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                title="Menu do perfil"
                data-menu-button
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`}
                    alt={user.name}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
<AnimatePresence>
  {menu.open && (
    <DropdownMenuContent align="end" className="w-56" asChild forceMount>
      <motion.div
        ref={menu.ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: menu.animation.duration / 1000, ease: menu.animation.easing }}
      >
        <div className="px-2 py-1.5 text-sm font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="-mx-1 my-1 h-px bg-muted" />
        <button
          onClick={() => {
            router.push('/medications');
            menu.setOpen(false);
          }}
          className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
        >
          Medicamentos
        </button>
        <button
          onClick={() => {
            router.push('/knowledge-base');
            menu.setOpen(false);
          }}
          className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
        >
          Base de Conhecimento
        </button>
        <button
          onClick={() => {
            router.push('/settings');
            menu.setOpen(false);
          }}
          className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
        >
          Configurações
        </button>
        <div className="-mx-1 my-1 h-px bg-muted" />
        <button
          onClick={() => {
            handleLogout();
            menu.setOpen(false);
          }}
          className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
        >
          Sair
        </button>
      </motion.div>
    </DropdownMenuContent>
  )}
</AnimatePresence>

          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
