"use client";

import * as React from "react";

export type LayoutMode = "sidebar" | "topnav";
export type ContainerMode = "fluid" | "boxed";
export type DirectionMode = "ltr" | "rtl";

type SidebarState = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  layout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;
  container: ContainerMode;
  setContainer: (container: ContainerMode) => void;
  direction: DirectionMode;
  setDirection: (direction: DirectionMode) => void;
};

const DEFAULT_LAYOUT_KEY = "apex-layout";
const DEFAULT_CONTAINER_KEY = "apex-container";
const DEFAULT_DIRECTION_KEY = "apex-direction";

function applyLayoutClass(mode: LayoutMode) {
  const root = document.documentElement;
  root.classList.remove("layout-sidebar", "layout-topnav");
  root.classList.add(`layout-${mode}`);
}

function applyContainerClass(mode: ContainerMode) {
  const root = document.documentElement;
  root.classList.remove("container-fluid", "container-boxed");
  root.classList.add(`container-${mode}`);
}

function applyDirectionClass(mode: DirectionMode) {
  const root = document.documentElement;
  root.dir = mode;
  root.classList.remove("dir-ltr", "dir-rtl");
  root.classList.add(`dir-${mode}`);
}

const SidebarContext = React.createContext<SidebarState>({
  collapsed: false,
  setCollapsed: () => null,
  mobileOpen: false,
  setMobileOpen: () => null,
  layout: "sidebar",
  setLayout: () => null,
  container: "fluid",
  setContainer: () => null,
  direction: "ltr",
  setDirection: () => null,
});

interface SidebarProviderProps {
  children: React.ReactNode;
  storageKeyPrefix?: string;
}

export function SidebarProvider({ children, storageKeyPrefix }: SidebarProviderProps) {
  const layoutKey = storageKeyPrefix ? `${storageKeyPrefix}-layout` : DEFAULT_LAYOUT_KEY;
  const containerKey = storageKeyPrefix ? `${storageKeyPrefix}-container` : DEFAULT_CONTAINER_KEY;
  const directionKey = storageKeyPrefix ? `${storageKeyPrefix}-direction` : DEFAULT_DIRECTION_KEY;

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [layout, setLayoutState] = React.useState<LayoutMode>(() => {
    if (typeof window === "undefined") return "sidebar";
    return (localStorage.getItem(layoutKey) as LayoutMode) || "sidebar";
  });

  const setLayout = React.useCallback((mode: LayoutMode) => {
    setLayoutState(mode);
    localStorage.setItem(layoutKey, mode);
    applyLayoutClass(mode);
  }, [layoutKey]);

  const [container, setContainerState] = React.useState<ContainerMode>(() => {
    if (typeof window === "undefined") return "fluid";
    return (localStorage.getItem(containerKey) as ContainerMode) || "fluid";
  });

  const setContainer = React.useCallback((mode: ContainerMode) => {
    setContainerState(mode);
    localStorage.setItem(containerKey, mode);
    applyContainerClass(mode);
  }, [containerKey]);

  const [direction, setDirectionState] = React.useState<DirectionMode>(() => {
    if (typeof window === "undefined") return "ltr";
    return (localStorage.getItem(directionKey) as DirectionMode) || "ltr";
  });

  const setDirection = React.useCallback((mode: DirectionMode) => {
    setDirectionState(mode);
    localStorage.setItem(directionKey, mode);
    applyDirectionClass(mode);
  }, [directionKey]);

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, layout, setLayout, container, setContainer, direction, setDirection }),
    [collapsed, mobileOpen, layout, setLayout, container, setContainer, direction, setDirection]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export const useSidebar = () => React.useContext(SidebarContext);
