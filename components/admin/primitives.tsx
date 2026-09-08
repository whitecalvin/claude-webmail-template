"use client";

import type { ReactNode } from "react";
import type { Tone } from "@/types/admin";
import { Switch } from "@/components/ui/Switch";

// Small presentational building blocks shared by every Admin Console tab
// (card container, status pill, sparkline/progress visualizations, switch).

export const TONE_STYLE: Record<Tone, string> = {
  success: "bg-[#E9F3EC] text-[#2E8B5B] dark:bg-[#2E8B5B]/20 dark:text-[#6FE0A8]",
  warning: "bg-[#FDF0E4] text-[#B4740F] dark:bg-[#B4740F]/20 dark:text-[#F0B96A]",
  danger: "bg-[#FBEAE8] text-[#C0433B] dark:bg-[#C0433B]/20 dark:text-[#F29A92]",
  info: "bg-[#ECEFFE] text-[#2B4BF2] dark:bg-[#2B4BF2]/20 dark:text-[#A9B8FB]",
  violet: "bg-[#EDEBF7] text-[#6B5CA8] dark:bg-[#6B5CA8]/20 dark:text-[#C6BCEB]",
  teal: "bg-[#E8F1F5] text-[#3B7A94] dark:bg-[#3B7A94]/20 dark:text-[#8FC4D9]",
  neutral: "bg-black/6 text-(--text-muted) dark:bg-white/8",
};

export function Pill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE_STYLE[tone]}`}
    >
      {label}
    </span>
  );
}

export function AdminCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-(--border-app) bg-background p-4 ${className}`}
    >
      {title && (
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-[13px] font-bold tracking-tight">{title}</h3>
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Sparkline({ bars, height = 28 }: { bars: number[]; height?: number }) {
  const max = Math.max(...bars, 1);
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {bars.map((v, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm"
          style={{
            height: `${Math.max((v / max) * 100, 6)}%`,
            backgroundColor: i >= bars.length - 3 ? "#B9C6FA" : "#E4E7F5",
          }}
        />
      ))}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  deltaUp,
  bars,
}: {
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  bars: number[];
}) {
  return (
    <AdminCard>
      <p className="text-xs text-(--text-muted)">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-xl font-bold tracking-tight">{value}</p>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            deltaUp
              ? "bg-[#E9F3EC] text-[#2E8B5B]"
              : "bg-[#FBEAE8] text-[#C0433B]"
          }`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-2">
        <Sparkline bars={bars} />
      </div>
    </AdminCard>
  );
}

export function ProgressBar({
  pct,
  color = "var(--color-primary)",
  track = "#F0F0EC",
  height = 6,
}: {
  pct: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  return (
    <div className="w-full overflow-hidden rounded-full" style={{ backgroundColor: track, height }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

// Kept as a named re-export (rather than switching every admin tab's import)
// since AdminSwitch is imported by name across most of the admin tab files.
export const AdminSwitch = Switch;

export function TableHeader({ columns }: { columns: { label: string; className?: string }[] }) {
  return (
    <div className="flex gap-3 border-b border-(--border-app) bg-black/1.5 px-3 py-2 text-[10.5px] font-bold uppercase tracking-[.03em] text-(--text-muted) dark:bg-white/2">
      {columns.map((c) => (
        <span key={c.label} className={c.className}>
          {c.label}
        </span>
      ))}
    </div>
  );
}

export function statNum(n: number) {
  return n.toLocaleString("ko-KR");
}
