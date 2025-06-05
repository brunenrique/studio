"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { add, subDays } from 'date-fns';
import { useNotifications } from './NotificationContext';
import type { RecurringTask } from '@/lib/types';

interface RecurringTasksContextType {
  tasks: RecurringTask[];
  addTask: (task: RecurringTask) => void;
  completeTask: (id: string) => void;
}

const RecurringTasksContext = createContext<RecurringTasksContextType | undefined>(undefined);

const defaultTasks: RecurringTask[] = [
  {
    id: 'review-chronic-records',
    description: 'Revisar prontuários de pacientes crônicos',
    intervalDays: 180,
    lastCompleted: subDays(new Date(), 180).toISOString(),
  },
];

export const RecurringTasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<RecurringTask[]>(() => {
    if (typeof window === 'undefined') return defaultTasks;
    const stored = localStorage.getItem('psiguard_recurring_tasks');
    return stored ? JSON.parse(stored) : defaultTasks;
  });

  const { addNotification, notifications } = useNotifications();

  useEffect(() => {
    localStorage.setItem('psiguard_recurring_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    tasks.forEach(task => {
      const nextDue = add(new Date(task.lastCompleted), { days: task.intervalDays });
      if (new Date() >= nextDue) {
        const notifId = `task-${task.id}-reminder`;
        if (!notifications.some(n => n.id === notifId)) {
          addNotification({ id: notifId, message: `Lembrete: ${task.description}`, read: false });
        }
      }
    });
  }, [tasks, notifications, addNotification]);

  const addTask = (task: RecurringTask) => setTasks(prev => [...prev, task]);

  const completeTask = (id: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, lastCompleted: new Date().toISOString() } : t)));

  return (
    <RecurringTasksContext.Provider value={{ tasks, addTask, completeTask }}>
      {children}
    </RecurringTasksContext.Provider>
  );
};

export const useRecurringTasks = () => {
  const context = useContext(RecurringTasksContext);
  if (context === undefined) {
    throw new Error('useRecurringTasks must be used within a RecurringTasksProvider');
  }
  return context;
};

