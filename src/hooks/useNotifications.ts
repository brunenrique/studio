"use client";

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// O melhor da sua branch: Tipagem forte para segurança e clareza.
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // O melhor da master: `useCallback` para performance.
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []); // Sem dependências, a função nunca é recriada.

  // O melhor de ambas: `useCallback` e a lógica limpa da master com a tipagem forte da sua branch.
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = uuidv4();
      const newNotification = { ...notification, id };
      
      setNotifications((prev) => [...prev, newNotification]);

      if (notification.duration) {
        setTimeout(() => {
          // Lógica limpa que reutiliza a função já otimizada.
          removeNotification(id);
        }, notification.duration);
      }
    },
    [removeNotification] // Depende de `removeNotification`, que é estável.
  );

  return { notifications, addNotification, removeNotification };
};

export default useNotifications;