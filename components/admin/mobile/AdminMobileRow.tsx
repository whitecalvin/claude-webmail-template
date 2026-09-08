"use client";

import { AlertTriangle, CheckCircle2, Circle, Info, TriangleAlert } from "lucide-react";
import { Pill } from "../primitives";
import type { AdminMobileRow as AdminMobileRowType, Tone } from "@/types/admin";

// Generic list row used across every AdminMobileScreen — a tone-colored
// icon/avatar, up to three lines of text, and an optional trailing pill.
const TONE_ICON: Record<Tone, typeof Info> = {
  danger: AlertTriangle,
  warning: TriangleAlert,
  success: CheckCircle2,
  info: Info,
  violet: Circle,
  teal: Circle,
  neutral: Circle,
};

const TONE_ICON_COLOR: Record<Tone, { bg: string; fg: string }> = {
  danger: { bg: "#FBEAE8", fg: "#C0433B" },
  warning: { bg: "#FDF0E4", fg: "#B4740F" },
  success: { bg: "#E9F3EC", fg: "#2E8B5B" },
  info: { bg: "#ECEFFE", fg: "#2B4BF2" },
  violet: { bg: "#EDEBF7", fg: "#6B5CA8" },
  teal: { bg: "#E8F1F5", fg: "#3B7A94" },
  neutral: { bg: "#F0F0EC", fg: "#5C6068" },
};

export function AdminMobileRow({ row }: { row: AdminMobileRowType }) {
  const colors = TONE_ICON_COLOR[row.tone];
  const Icon = TONE_ICON[row.tone];

  return (
    <div
      className="flex items-start gap-3 border-b border-(--border-app) px-5 py-3"
      style={{ backgroundColor: row.on ? "rgba(43,75,242,.04)" : "transparent" }}
    >
      <span
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] text-[11px] font-bold"
        style={{ backgroundColor: colors.bg, color: colors.fg }}
      >
        {row.avatar ?? <Icon size={16} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{row.name}</span>
          {row.meta && (
            <span className="shrink-0 text-[11.5px] text-(--text-muted)">{row.meta}</span>
          )}
        </div>
        {row.line2 && (
          <p className="truncate text-[13px] text-(--text-app)">{row.line2}</p>
        )}
        {row.line3 && (
          <p className="truncate text-[12px] text-(--text-muted)">{row.line3}</p>
        )}
      </div>
      {row.tag && (
        <span className="mt-0.5 shrink-0">
          <Pill label={row.tag} tone={row.tagTone ?? row.tone} />
        </span>
      )}
    </div>
  );
}
