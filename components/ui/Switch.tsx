"use client";

// Shared on/off toggle switch. Several screens had hand-rolled copies of
// this that differed only in size — consolidated here with a `size` prop.
const SIZE_STYLE = {
  sm: { track: "h-5 w-8", knob: "h-3.5 w-3.5", travel: 14 },
  md: { track: "h-5.5 w-9", knob: "h-4 w-4", travel: 16 },
  lg: { track: "h-5.75 w-10", knob: "h-4.25 w-4.25", travel: 17 },
} as const;

export function Switch({
  on,
  onToggle,
  size = "md",
  label,
}: {
  on: boolean;
  onToggle: () => void;
  size?: keyof typeof SIZE_STYLE;
  label?: string;
}) {
  const dims = SIZE_STYLE[size];
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex shrink-0 items-center rounded-full p-0.75 transition ${dims.track}`}
      style={{ backgroundColor: on ? "var(--color-primary)" : "var(--border-app)" }}
      aria-pressed={on}
      aria-label={label}
    >
      <span
        className={`rounded-full bg-white shadow-sm transition-transform ${dims.knob}`}
        style={{ transform: on ? `translateX(${dims.travel}px)` : "translateX(0)" }}
      />
    </button>
  );
}
