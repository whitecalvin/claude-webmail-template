"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface DropdownOption { value: string; label: string; disabled?: boolean }
type DropdownVariant = "filter" | "form" | "header";
type DropdownAlign = "left" | "right";

const TRIGGER_STYLE: Record<DropdownVariant, string> = {
  filter: "h-8 rounded-lg px-2.5 text-xs font-medium",
  form: "flex h-9 w-full items-center justify-between rounded-(--radius-app) px-3 text-[13px]",
  header: "h-8.5 rounded-(--radius-app) px-3 text-xs font-semibold",
};
const MENU_WIDTH: Record<DropdownVariant, string> = { filter: "w-44", form: "w-full", header: "w-36" };

function normalizeOptions(options: DropdownOption[] | string[]): DropdownOption[] {
  return options.map((option) => typeof option === "string" ? { value: option, label: option } : option);
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[] | string[];
  onChange: (value: string) => void;
  variant?: DropdownVariant;
  align?: DropdownAlign;
  prefix?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown({ value, options, onChange, variant = "filter", align = "left", prefix, label, disabled = false, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const normalized = normalizeOptions(options);
  const currentLabel = normalized.find((option) => option.value === value)?.label ?? value;

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", keyboard);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", keyboard); };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", variant === "form" && "w-full", className)}>
      <button ref={triggerRef} type="button" disabled={disabled} aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen((state) => !state)} className={cn("inline-flex items-center gap-1.5 border border-(--control-border) bg-(--control-bg) outline-none transition hover:bg-(--control-hover) focus-visible:ring-3 focus-visible:ring-(--focus-ring) disabled:cursor-not-allowed disabled:opacity-45", TRIGGER_STYLE[variant])}>
        <span className="truncate">{prefix ? `${prefix}: ` : ""}{currentLabel}</span>
        <ChevronDown size={14} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div id={menuId} role="listbox" aria-label={label} className={cn("absolute top-full z-60 mt-1 max-h-60 overflow-y-auto rounded-(--radius-app) border border-(--control-border) bg-(--surface-app) p-1 shadow-(--shadow-panel)", MENU_WIDTH[variant], align === "right" ? "right-0" : "left-0")}>
          {normalized.map((option) => (
            <button key={option.value} type="button" role="option" aria-selected={value === option.value} disabled={option.disabled} onClick={() => { onChange(option.value); setOpen(false); triggerRef.current?.focus(); }} className="flex w-full items-center justify-between gap-2 rounded-[calc(var(--radius-app)-3px)] px-2.5 py-2 text-left text-xs outline-none hover:bg-(--control-hover) focus-visible:bg-(--control-hover) disabled:opacity-45">
              <span className={cn("truncate", value === option.value && "font-semibold text-(--color-primary)")}>{option.label}</span>
              {value === option.value ? <Check size={14} className="shrink-0 text-(--color-primary)" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
