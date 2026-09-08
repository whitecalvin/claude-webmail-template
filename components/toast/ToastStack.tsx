"use client";

import { Check, Info, RotateCcw, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/context/toast-context";
import type { ToastTone } from "@/types/overlay";

// Renders the queue from useToast() as stacked snackbars, bottom-left.
// Mounted once in the root layout — see context/toast-context.tsx for the
// queue logic itself.
const ICON: Record<ToastTone, typeof Check> = {
  success: Check,
  error: AlertTriangle,
  info: Info,
  undo: RotateCcw,
};

const ICON_STYLE: Record<ToastTone, string> = {
  success: "bg-[#2E8B5B]/20 text-[#6FE0A8]",
  error: "bg-[#C0433B]/25 text-[#F29A92]",
  info: "bg-[#2B4BF2]/25 text-[#B9C6FA]",
  undo: "bg-white/12 text-[#F7F7F5]",
};

export function ToastStack() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-70 flex w-85 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICON[t.tone];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 rounded-[11px] bg-[#17181B] px-3.5 py-2.5 shadow-[0_14px_30px_-16px_rgba(20,22,30,.6)]"
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ICON_STYLE[t.tone]}`}>
              <Icon size={13} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-[#F7F7F5]">{t.title}</p>
              {t.sub && (
                <p className="truncate text-[11px] text-[#9A9EA5]">{t.sub}</p>
              )}
            </div>
            {t.actionLabel && (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.();
                  dismiss(t.id);
                }}
                className="shrink-0 text-[12px] font-semibold text-[#B9C6FA] hover:underline"
              >
                {t.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-[#8E9299] hover:text-white"
              aria-label="닫기"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
