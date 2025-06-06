"use client";

import { ReactNode } from 'react';
import { useSmartMenu } from '@/lib/use-smart-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';

interface SmartDropdownItem {
  label: string;
  action: () => void;
}

interface SmartDropdownProps {
  id: string;
  trigger: ReactNode;
  items: SmartDropdownItem[];
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function SmartDropdown({ id, trigger, items, align = 'end', className }: SmartDropdownProps) {
  const menu = useSmartMenu({ id });

  return (
    <div className="relative inline-block">
      <div onClick={menu.toggle} data-menu-button title="Abrir menu">
        {trigger}
      </div>

      <AnimatePresence>
        {menu.open && (
          <DropdownMenuContent align={align} className={className} asChild forceMount>
            <motion.div
              ref={menu.ref}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: menu.animation.duration / 1000,
                ease: menu.animation.easing,
              }}
            >
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    menu.setOpen(false);
                  }}
                  className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </div>
  );
}
