"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Task } from '@/lib/types';
import { mockTasks } from '@/lib/mock-data';
import { useNotifications } from './NotificationContext';

interface TasksContextType {
  tasks: Task[];
  addTask: (data: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { addNotification } = useNotifications();

  const addTask = (data: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      dueDate: data.dueDate,
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    if (data.dueDate) {
      const dateStr = new Date(data.dueDate).toLocaleString();
      addNotification(`Lembrete de tarefa: ${data.title} para ${dateStr}`);
    } else {
      addNotification(`Nova tarefa: ${data.title}`);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (ctx === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return ctx;
};
