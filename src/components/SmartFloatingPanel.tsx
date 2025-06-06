"use client";

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFloatingMenu } from '@/lib/use-smart-menu/useFloatingMenu';

interface SmartFloatingPanelProps {
  id: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function SmartFloatingPanel({
  id,
  trigger,
  children,
  className,
  placement = 'bottom',
}: SmartFloatingPanelProps) {
  const menu = useFloatingMenu({ id, placement });

  return (
    <div className="relative inline-block">
      <div
        ref={menu.floating.refs.setReference}
        onClick={menu.toggle}
        data-menu-button
        title="Abrir menu flutuante"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {menu.open && (
          <motion.div
            ref={menu.floating.refs.setFloating}
            style={menu.floating.floatingStyles}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: menu.animation.duration / 1000,
              ease: menu.animation.easing,
            }}
            className={className || 'z-50 mt-2 rounded-md border bg-white p-2 shadow-md'}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
