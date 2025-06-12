"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationInput {
  message: string;
  type: NotificationType;
  duration?: number;
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = ({ message, type, duration }: NotificationInput) => {
    const id = uuidv4();
    const notification: Notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);

    if (duration) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}
