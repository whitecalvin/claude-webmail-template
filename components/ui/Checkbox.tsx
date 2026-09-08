"use client";

// Custom checkbox control rendered as a <button> instead of a native
// <input type="checkbox">, so its visuals stay consistent across browsers/OS
// and match the rest of the app's design system (no native checkbox chrome).
import { Check } from "lucide-react";

export function Checkbox({
  checked,
  onChange,
  label,
  size = 15,
}: {
  checked: boolean;
  onChange: () => void;
  /** Accessible name; not rendered visually. Pair with visible text separately if needed. */
  label: string;
  /** Box side length in pixels. */
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
      className="flex shrink-0 items-center justify-center rounded-sm"
      style={{
        height: size,
        width: size,
        backgroundColor: checked ? "var(--color-primary)" : "transparent",
        border: checked ? "none" : "1px solid var(--border-app)",
      }}
    >
      {checked && <Check size={Math.round(size * 0.66)} strokeWidth={3} className="text-white" />}
    </button>
  );
}
