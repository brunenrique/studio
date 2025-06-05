"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: Notification[] = [
  { id: '1', message: 'Novo paciente adicionado \u00e0 lista de espera: Diana Prince', read: false },
  { id: '2', message: 'Consulta amanh\u00e3 com Alice Wonderland \u00e0s 10:00', read: false },
  { id: '3', message: 'Entre em contato com Clark Kent - aguardando h\u00e1 3 dias', read: false },
  { id: '4', message: 'Revisar tarefas administrativas pendentes', read: false },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) {
        return prev;
      }
      return [notification, ...prev];
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
