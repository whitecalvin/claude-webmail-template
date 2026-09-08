"use client";

// Blocking, non-dismissible overlay with a progress bar for actions that
// simulate taking time (e.g. "send now" on a scheduled mail).
export function LoadingModal({
  title,
  sub,
  pct,
}: {
  title: string;
  sub: string;
  pct: number;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(20,22,30,.42)" }}
    >
      <div className="flex w-full max-w-[300px] flex-col items-center gap-2 rounded-[14px] bg-(--surface-app) p-4 text-center text-(--text-app)">
        <div
          className="h-[34px] w-[34px] animate-spin rounded-full border-[3px]"
          style={{ borderColor: "#E4E7F5", borderTopColor: "var(--color-primary)" }}
        />
        <p className="text-[13.5px] font-bold">{title}</p>
        <p className="text-[12px] text-(--text-muted)">{sub}</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0F0EC]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, backgroundColor: "var(--color-primary)" }}
          />
        </div>
      </div>
    </div>
  );
}
