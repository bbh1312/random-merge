import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined);
const STORAGE_KEY = "sound_muted";

export const useSoundSetting = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundSetting must be used within SoundProvider");
  return ctx;
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "true") setMuted(true);
    });
  }, []);

  const toggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? "true" : "false");
      return next;
    });
  };

  return <SoundContext.Provider value={{ muted, toggleMuted }}>{children}</SoundContext.Provider>;
};
