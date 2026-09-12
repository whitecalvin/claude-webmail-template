"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/components/ui/utils";

export function Modal({ onClose, dismissible = true, maxWidth = 420, children, ariaLabel, labelledBy, describedBy, className }: { onClose: () => void; dismissible?: boolean; maxWidth?: number; children: ReactNode; ariaLabel?: string; labelledBy?: string; describedBy?: string; className?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])');
    (focusable ?? dialog)?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) onClose();
      if (event.key !== "Tab" || !dialog) return;
      const elements = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'));
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = bodyOverflow; previouslyFocused.current?.focus(); };
  }, [dismissible, onClose]);

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-(--overlay-backdrop) p-4" onMouseDown={(event) => { if (dismissible && event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={labelledBy} aria-describedby={describedBy} tabIndex={-1} className={cn("w-full overflow-hidden rounded-(--radius-app) bg-(--surface-app) text-foreground shadow-(--shadow-dialog) outline-none", className)} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
