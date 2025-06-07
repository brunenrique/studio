import { useEffect, useRef, useState } from 'react';
import { lockScroll, unlockScroll } from './ScrollLock';
import type { SmartMenuConfig } from './types';

export function useSmartMenu(config: SmartMenuConfig) {
  const { id, animation, restoreFocus = true, persistFocus = true } = config;
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement>(null);

  // Restore state on mount without breaking SSR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOpen(localStorage.getItem(`menu:${id}`) === 'true');
    }
  }, []);

  const toggle = () => {
    setOpen(prev => {
      const next = !prev;
      localStorage.setItem(`menu:${id}`, next.toString());
      return next;
    });
  };

  const saveFocus = (href: string) => {
    if (persistFocus) localStorage.setItem(`menu:${id}:focus`, href);
  };

  useEffect(() => {
    if (open) {
      lockScroll();
      if (restoreFocus) {
        const href = localStorage.getItem(`menu:${id}:focus`);
        const el =
          ref.current?.querySelector(`a[href='${href}']`) || ref.current?.querySelector('a');
        setTimeout(() => (el as HTMLElement)?.focus(), animation?.delay ?? 150);
      }
    } else {
      unlockScroll();
    }
    return unlockScroll;
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return {
    open,
    toggle,
    setOpen,
    ref,
    saveFocus,
    animation: {
      duration: animation?.duration ?? 250,
      easing: animation?.easing ?? 'ease-in-out',
    },
  };
}
