"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (message: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: Notification[] = [];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'notifications', user.id, 'items'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Notification[];
      setNotifications(data);
    });
    return () => unsub();
  }, [user]);

  const addNotification = async (message: string) => {
    if (!user) return;
    await addDoc(collection(db, 'notifications', user.id, 'items'), {
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'notifications', user.id, 'items', id), { read: true });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) => updateDoc(doc(db, 'notifications', user.id, 'items', n.id), { read: true }))
    );
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
