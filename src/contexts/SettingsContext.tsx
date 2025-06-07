"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface DashboardSettings {
  showAppointments: boolean;
  showPatients: boolean;
  showWaitingList: boolean;
  showFinances: boolean;
  showBirthdays: boolean;
}

export interface GlobalSystemSettings {
  workHoursStart: string;
  workHoursEnd: string;
  defaultSessionDuration: number;
  blockedTimes: string; // comma separated ISO strings
  weeklyBlockedTimes: string; // lines: weekday HH:MM-HH:MM
  externalIntegration: boolean;
}

interface SettingsContextType {
  dashboard: DashboardSettings;
  updateDashboard: (settings: Partial<DashboardSettings>) => void;
  system: GlobalSystemSettings;
  updateSystem: (settings: Partial<GlobalSystemSettings>) => void;
}

const defaultDashboard: DashboardSettings = {
  showAppointments: true,
  showPatients: true,
  showWaitingList: true,
  showFinances: true,
  showBirthdays: true,
};

const defaultSystem: GlobalSystemSettings = {
  workHoursStart: '09:00',
  workHoursEnd: '17:00',
  defaultSessionDuration: 50,
  blockedTimes: '',
  weeklyBlockedTimes: '',
  externalIntegration: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<DashboardSettings>(defaultDashboard);
  const [system, setSystem] = useState<GlobalSystemSettings>(defaultSystem);

  useEffect(() => {
    const storedDashboard = localStorage.getItem('psiguard_dashboard_settings');
    if (storedDashboard) {
      try {
        setDashboard(JSON.parse(storedDashboard));
      } catch (_) {
        // ignore parse errors
      }
    }
    const storedSystem = localStorage.getItem('psiguard_system_settings');
    if (storedSystem) {
      try {
        setSystem(JSON.parse(storedSystem));
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

  const updateSystem = (settings: Partial<GlobalSystemSettings>) => {
    setSystem((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('psiguard_system_settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ dashboard, updateDashboard, system, updateSystem }}>
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
