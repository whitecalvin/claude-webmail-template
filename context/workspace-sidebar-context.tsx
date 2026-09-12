"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  WORKSPACE_SIDEBAR_COOKIE_MAX_AGE,
  WORKSPACE_SIDEBAR_COOKIE_NAME,
} from "@/lib/workspace-sidebar";

interface WorkspaceSidebarContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const WorkspaceSidebarContext =
  createContext<WorkspaceSidebarContextValue | null>(null);

function persistCollapsedState(collapsed: boolean) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${WORKSPACE_SIDEBAR_COOKIE_NAME}=${collapsed ? "1" : "0"}; Path=/; Max-Age=${WORKSPACE_SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function WorkspaceSidebarProvider({
  children,
  initialCollapsed,
}: {
  children: ReactNode;
  initialCollapsed: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    persistCollapsedState(next);
  }, [collapsed]);

  const value = useMemo(
    () => ({ collapsed, toggleCollapsed }),
    [collapsed, toggleCollapsed]
  );

  return (
    <WorkspaceSidebarContext.Provider value={value}>
      {children}
    </WorkspaceSidebarContext.Provider>
  );
}

export function useWorkspaceSidebar() {
  const context = useContext(WorkspaceSidebarContext);
  if (!context) {
    throw new Error(
      "useWorkspaceSidebar must be used within WorkspaceSidebarProvider"
    );
  }
  return context;
}
