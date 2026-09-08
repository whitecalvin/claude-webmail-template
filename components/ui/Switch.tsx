"use client";

// Shared on/off toggle switch. Several screens had hand-rolled copies of
// this that differed only in size — consolidated here with a `size` prop.
const SIZE_STYLE = {
  sm: { track: "h-5 w-8", knob: "h-[14px] w-[14px]", travel: 14 },
  md: { track: "h-[22px] w-9", knob: "h-[16px] w-[16px]", travel: 16 },
  lg: { track: "h-[23px] w-10", knob: "h-[17px] w-[17px]", travel: 17 },
} as const;

export function Switch({
  on,
  onToggle,
  size = "md",
}: {
  on: boolean;
  onToggle: () => void;
  size?: keyof typeof SIZE_STYLE;
}) {
  const dims = SIZE_STYLE[size];
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex shrink-0 items-center rounded-full p-[3px] transition ${dims.track}`}
      style={{ backgroundColor: on ? "var(--color-primary)" : "var(--border-app)" }}
      aria-pressed={on}
    >
      <span
        className={`rounded-full bg-white shadow-sm transition-transform ${dims.knob}`}
        style={{ transform: on ? `translateX(${dims.travel}px)` : "translateX(0)" }}
      />
    </button>
  );
}
