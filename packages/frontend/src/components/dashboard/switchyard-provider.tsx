"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type SwitchyardContextType = {
  sidebarTheme: "dark" | "light";
  setSidebarTheme: (theme: "dark" | "light") => void;
  sidebarCaptions: "show" | "hide";
  setSidebarCaptions: (mode: "show" | "hide") => void;
};

const SwitchyardContext = createContext<SwitchyardContextType | undefined>(undefined);

export function SwitchyardProvider({ children }: { children: React.ReactNode }) {
  const [sidebarTheme, setSidebarThemeState] = useState<"dark" | "light">("dark");
  const [sidebarCaptions, setSidebarCaptionsState] = useState<"show" | "hide">("show");

  useEffect(() => {
    const storedTheme = localStorage.getItem("switchyard-sidebar-theme");
    if (storedTheme === "dark" || storedTheme === "light") setSidebarThemeState(storedTheme);
    const storedCaptions = localStorage.getItem("switchyard-sidebar-captions");
    if (storedCaptions === "show" || storedCaptions === "hide") setSidebarCaptionsState(storedCaptions);
  }, []);

  const setSidebarTheme = useCallback((theme: "dark" | "light") => {
    setSidebarThemeState(theme);
    localStorage.setItem("switchyard-sidebar-theme", theme);
    document.documentElement.classList.remove("sidebar-theme-dark", "sidebar-theme-light");
    document.documentElement.classList.add(`sidebar-theme-${theme}`);
  }, []);

  const setSidebarCaptions = useCallback((mode: "show" | "hide") => {
    setSidebarCaptionsState(mode);
    localStorage.setItem("switchyard-sidebar-captions", mode);
    if (mode === "hide") {
      document.documentElement.classList.add("sidebar-captions-hide");
    } else {
      document.documentElement.classList.remove("sidebar-captions-hide");
    }
  }, []);

  return (
    <SwitchyardContext.Provider value={{ sidebarTheme, setSidebarTheme, sidebarCaptions, setSidebarCaptions }}>
      {children}
    </SwitchyardContext.Provider>
  );
}

export function useSwitchyard() {
  const context = useContext(SwitchyardContext);
  if (!context) throw new Error("useSwitchyard must be used within SwitchyardProvider");
  return context;
}
