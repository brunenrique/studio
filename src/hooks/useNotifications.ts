"use client";

import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface Notification {
  id: string;
  message: string;
  type: string;
}

interface AddNotificationOptions {
  message: string;
  type: string;
  duration?: number;
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ message, type, duration }: AddNotificationOptions) => {
      const id = uuid();
      setNotifications((prev) => [...prev, { id, message, type }]);

      if (duration) {
        setTimeout(() => removeNotification(id), duration);
      }
    },
    [removeNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
