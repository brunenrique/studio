"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/4 w-80 -translate-x-1/2 rounded-md bg-popover p-2 shadow-lg">
          <Command>
            <CommandInput placeholder="Digite um comando" />
            <CommandList>
              <CommandItem onSelect={() => { router.push('/patients'); setOpen(false); }}>Ir pra pacientes</CommandItem>
              <CommandItem onSelect={() => { router.push('/patients?new=1'); setOpen(false); }}>Novo paciente</CommandItem>
              <CommandItem onSelect={() => { router.push('/dashboard'); setOpen(false); }}>Dashboard</CommandItem>
            </CommandList>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
