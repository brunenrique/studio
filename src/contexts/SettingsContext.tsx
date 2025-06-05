"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface DashboardSettings {
  showAppointments: boolean;
  showPatients: boolean;
  showWaitingList: boolean;
  showFinances: boolean;
  showBirthdays: boolean;
}

interface SettingsContextType {
  dashboard: DashboardSettings;
  updateDashboard: (settings: Partial<DashboardSettings>) => void;
}

const defaultDashboard: DashboardSettings = {
  showAppointments: true,
  showPatients: true,
  showWaitingList: true,
  showFinances: true,
  showBirthdays: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<DashboardSettings>(defaultDashboard);

  useEffect(() => {
    const stored = localStorage.getItem('psiguard_dashboard_settings');
    if (stored) {
      try {
        setDashboard(JSON.parse(stored));
      } catch (_) {
        // ignore parse errors
      }
    }
  }, []);

  const updateDashboard = (settings: Partial<DashboardSettings>) => {
    setDashboard((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('psiguard_dashboard_settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ dashboard, updateDashboard }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
