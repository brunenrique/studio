"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { SystemSettings } from "@/lib/types";
import { mockSystemSettings } from "@/lib/mock-data";

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (settings: SystemSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);

  useEffect(() => {
    const stored = localStorage.getItem("psiguard_settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore parse errors and use defaults
      }
    }
  }, []);

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem("psiguard_settings", JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
