"use client";

import { useEffect, type ReactNode } from "react";

// Base centered modal used directly for simple dialogs and as the foundation
// for ConfirmDialog. `dismissible` controls both the Escape-key handler and
// whether clicking the backdrop closes it.
export function Modal({
  onClose,
  dismissible = true,
  maxWidth = 420,
  children,
}: {
  onClose: () => void;
  dismissible?: boolean;
  maxWidth?: number;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!dismissible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dismissible, onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(20,22,30,.42)" }}
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full overflow-hidden rounded-[14px] bg-(--surface-app) text-(--text-app) shadow-[0_24px_60px_-20px_rgba(20,22,30,.5)]"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
