"use client";

import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";
import { ModuleRail } from "./ModuleRail";
import { TopBar } from "./TopBar";
import { CustomizerPanel } from "@/components/customizer/CustomizerPanel";

export interface WorkspaceLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  headerActions?: ReactNode;
  onMenuClick?: () => void;
  onOpenTour?: () => void;
  onToggleDelegate?: () => void;
  showGlobalSearch?: boolean;
  showMobilePageContext?: boolean;
  showBottomTabBar?: boolean;
  className?: string;
}

export function WorkspaceLayout({ children, title, headerActions, onMenuClick, onOpenTour, onToggleDelegate, showGlobalSearch = true, showMobilePageContext = true, showBottomTabBar = true, className = "" }: WorkspaceLayoutProps) {
  return (
    <>
      <div className="flex h-dvh w-full overflow-hidden bg-(--surface-app) text-(--text-app)">
        <div className="hidden lg:block"><ModuleRail /></div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar title={title} actions={headerActions} onMenuClick={onMenuClick} onOpenTour={onOpenTour} onToggleDelegate={onToggleDelegate} showGlobalSearch={showGlobalSearch} showMobilePageContext={showMobilePageContext} />
          <main className={`min-h-0 min-w-0 flex-1 ${className}`}>{children}</main>
          {showBottomTabBar ? <BottomTabBar /> : null}
        </div>
      </div>
      <CustomizerPanel />
    </>
  );
}
