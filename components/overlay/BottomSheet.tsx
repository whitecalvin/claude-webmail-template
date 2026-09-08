"use client";

import type { ReactNode } from "react";

// Mobile-only bottom sheet for picking one of several options (e.g. "move
// to folder"). BottomSheetRow renders each selectable option inside it.
export function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center lg:hidden"
      style={{ backgroundColor: "rgba(20,22,30,.42)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl bg-(--surface-app) pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 text-(--text-app)"
      >
        <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-[#DEDED8]" />
        <p className="px-[18px] pb-2.5 text-[13.5px] font-bold">{title}</p>
        {children}
      </div>
    </div>
  );
}

export function BottomSheetRow({
  label,
  dot,
  meta,
  onClick,
}: {
  label: string;
  dot?: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[44px] w-full items-center gap-2.5 px-[18px] text-left text-[13.5px] hover:bg-black/[.03] dark:hover:bg-white/[.05]"
    >
      {dot && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
      <span className="flex-1">{label}</span>
      {meta && <span className="text-[11.5px] text-(--text-muted)">{meta}</span>}
    </button>
  );
}
