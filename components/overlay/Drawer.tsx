"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

// Full-height right-edge panel for showing detail views without leaving the
// current page (e.g. an audit log entry). Closes on Escape or backdrop click.
export function Drawer({
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("common");
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end"
      style={{ backgroundColor: "rgba(20,22,30,.42)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[460px] flex-col bg-(--surface-app) text-(--text-app) shadow-[-18px_0_40px_-20px_rgba(20,22,30,.5)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-(--border-app) px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold">{title}</p>
            {subtitle && (
              <p className="truncate text-[11.5px] text-(--text-muted)">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={t("close")}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && (
          <div className="flex shrink-0 gap-2 border-t border-(--border-app) p-3.5">{footer}</div>
        )}
      </div>
    </div>
  );
}
