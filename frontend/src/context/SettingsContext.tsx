"use client";

// ** React Imports
import { createContext, useState, ReactNode, useEffect } from "react";

// ** MUI Imports
import { PaletteMode } from "@mui/material";

export type Settings = {
  mode: PaletteMode;
};

export type SettingsContextValue = {
  settings: Settings;
  saveSettings: (updatedSettings: Settings) => void;
};

const initialSettings: Settings = {
  mode: "light",
};

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings,
});

export const SettingsProvider = ({
  children,
  settings: PropSettings,
}: {
  children: ReactNode;
  settings?: Settings;
}) => {
  // ** State
  const [settings, setSettings] = useState<Settings>({ ...initialSettings });

  const saveSettings = (updatedSettings: Settings) => {
    setSettings(updatedSettings);
  };

  useEffect(() => {
    if (PropSettings) {
      setSettings(PropSettings);
    }
  }, [PropSettings]);

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
