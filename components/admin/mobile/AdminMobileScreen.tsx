"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminMobileRow } from "./AdminMobileRow";
import { useToast } from "@/context/toast-context";
import type { AdminMobileScreen as AdminMobileScreenType } from "@/types/admin";

// Generic renderer for one entry from MOBILE_ADMIN_SCREENS — header (with an
// optional CTA), optional filter chips, a list of AdminMobileRow, and an
// optional footer action. One `screen` config drives all mobile admin pages.
export function AdminMobileScreen({
  screen,
  onBack,
}: {
  screen: AdminMobileScreenType;
  onBack: () => void;
}) {
  const toast = useToast();
  const [activeChip, setActiveChip] = useState(screen.chips?.[0]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="관리자 메뉴로"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{screen.title}</p>
          <p className="truncate text-[11px] text-(--text-muted)">{screen.sub}</p>
        </div>
        {screen.actionLabel && (
          <button
            type="button"
            onClick={() => toast.info(`${screen.actionLabel} 화면으로 이동합니다`)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {screen.actionLabel}
          </button>
        )}
      </div>

      {screen.chips && (
        <div className="flex shrink-0 gap-1.5 border-b border-(--border-app) px-4 py-2.5">
          {screen.chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveChip(c)}
              className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
                activeChip === c
                  ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                  : "bg-black/5 text-(--text-muted) dark:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {screen.rows.map((row, i) => (
          <AdminMobileRow key={i} row={row} />
        ))}
      </div>

      {(screen.footerText || screen.footerBtn) && (
        <div className="flex shrink-0 items-center gap-3 border-t border-(--border-app) px-4 py-3">
          {screen.footerText && (
            <p className="flex-1 text-[12px] leading-relaxed text-(--text-muted)">
              {screen.footerText}
            </p>
          )}
          {screen.footerBtn && (
            <button
              type="button"
              onClick={() => toast.info(`${screen.footerBtn} 실행`)}
              className="h-9 shrink-0 rounded-lg px-4 text-xs font-semibold text-white"
              style={{ backgroundColor: "#17181B" }}
            >
              {screen.footerBtn}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
