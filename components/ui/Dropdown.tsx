"use client";

// Shared "button + floating option list" dropdown used throughout the app in
// place of a native <select>, so the open menu can be styled consistently
// (rounded corners, shadow, hover states) instead of relying on OS chrome.
import { useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

type DropdownVariant = "filter" | "form" | "header";
type DropdownAlign = "left" | "right";

const TRIGGER_STYLE: Record<DropdownVariant, string> = {
  // Compact inline trigger for toolbar-style filters (e.g. table filter bars).
  filter:
    "h-8 rounded-lg border border-(--border-app) px-2.5 text-xs font-medium text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10",
  // Full-width trigger for form fields inside modals/panels.
  form: "flex h-9 w-full items-center justify-between rounded-[9px] border border-(--border-app) px-3 text-[13px] outline-none hover:bg-black/5 dark:hover:bg-white/5",
  // Slightly taller/bolder trigger used in page headers (e.g. date-range pickers).
  header:
    "h-8.5 rounded-[9px] border border-(--border-app) px-3 text-xs font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/10",
};

const MENU_WIDTH: Record<DropdownVariant, string> = {
  filter: "w-44",
  form: "w-full",
  header: "w-32",
};

function normalizeOptions(options: DropdownOption[] | string[]): DropdownOption[] {
  return options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}

export function Dropdown({
  value,
  options,
  onChange,
  variant = "filter",
  align = "left",
  /** Optional "Label: " prefix rendered before the current value on the trigger. */
  prefix,
}: {
  value: string;
  options: DropdownOption[] | string[];
  onChange: (value: string) => void;
  variant?: DropdownVariant;
  align?: DropdownAlign;
  prefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const normalized = normalizeOptions(options);
  const current = normalized.find((o) => o.value === value);
  const currentLabel = current?.label ?? value;

  return (
    <div className={variant === "form" ? "relative w-full" : "relative"}>
      <button type="button" onClick={() => setOpen((v) => !v)} className={TRIGGER_STYLE[variant]}>
        {variant === "form" ? (
          <>
            <span className="truncate">{currentLabel}</span>
            <span className="shrink-0 text-[9px] text-(--text-muted)">▾</span>
          </>
        ) : (
          `${prefix ? `${prefix}: ` : ""}${currentLabel} ▾`
        )}
      </button>
      {open && (
        <>
          {/* Invisible full-screen layer so any outside click closes the menu. */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-(--border-app) bg-background py-1 shadow-xl ${
              MENU_WIDTH[variant]
            } ${align === "right" ? "right-0" : "left-0"}`}
          >
            {normalized.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5 ${
                  value === opt.value ? "font-bold text-(--color-primary)" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
