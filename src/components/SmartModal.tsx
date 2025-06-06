"use client";

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSmartMenu } from '@/lib/use-smart-menu';
import { AnimatePresence, motion } from 'framer-motion';

interface SmartModalProps {
  id: string;
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
}

export function SmartModal({ id, open, onClose, title, children }: SmartModalProps) {
  const modal = useSmartMenu({ id });
  const isOpen = open ?? modal.open;

  useEffect(() => {
    if (open !== undefined) modal.setOpen(open);
  }, [open]);

  useEffect(() => {
    if (!isOpen && onClose) onClose();
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={(e) => {
            if (e.target === e.currentTarget) modal.setOpen(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={modal.ref}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: modal.animation.duration / 1000, ease: modal.animation.easing }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
