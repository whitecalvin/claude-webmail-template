"use client";

import { AlertTriangle, Check, Info, RotateCcw, X } from "lucide-react";
import type { ToastTone } from "@/types/overlay";
import { IconButton } from "./IconButton";

const ICON = { success: Check, error: AlertTriangle, info: Info, undo: RotateCcw } satisfies Record<ToastTone, typeof Check>;

export function Toast({ title, description, tone = "info", actionLabel, onAction, onDismiss, dismissLabel = "Close" }: { title: string; description?: string; tone?: ToastTone; actionLabel?: string; onAction?: () => void; onDismiss: () => void; dismissLabel?: string }) {
  const Icon = ICON[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className="pointer-events-auto flex items-center gap-2.5 rounded-(--radius-app) bg-(--toast-bg) px-3.5 py-2.5 text-(--toast-text) shadow-(--shadow-panel)">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10"><Icon size={13} strokeWidth={2.5} /></span>
      <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold">{title}</p>{description ? <p className="truncate text-[11px] text-(--toast-muted)">{description}</p> : null}</div>
      {actionLabel ? <button type="button" onClick={onAction} className="shrink-0 text-xs font-semibold text-(--toast-action) hover:underline">{actionLabel}</button> : null}
      <IconButton label={dismissLabel} icon={<X size={13} />} compact variant="ghost" onClick={onDismiss} className="text-(--toast-muted) hover:text-(--toast-text)" />
    </div>
  );
}
