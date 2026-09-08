"use client";

// Shared top bar rendered above every Admin Console tab: page title/subtitle,
// an optional date-range picker, and a tab-specific call-to-action button.
import { useState } from "react";
import { useToast } from "@/context/toast-context";
import { Dropdown } from "@/components/ui/Dropdown";

const RANGE_OPTIONS = ["오늘", "최근 7일", "최근 30일", "최근 90일"];

export function AdminHeader({
  title,
  sub,
  cta,
  showRange = true,
}: {
  title: string;
  sub: string;
  cta: string;
  showRange?: boolean;
}) {
  const toast = useToast();
  const [range, setRange] = useState("최근 7일");

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-(--border-app) bg-background px-7 py-4">
      <div>
        <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
        <p className="text-xs text-(--text-muted)">{sub}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {showRange && (
          <Dropdown variant="header" align="right" value={range} options={RANGE_OPTIONS} onChange={setRange} />
        )}
        <button
          type="button"
          onClick={() => toast.info(`${cta} 화면으로 이동합니다`)}
          className="h-8.5 rounded-[9px] bg-[#17181B] px-3.5 text-xs font-semibold text-white transition hover:bg-black dark:bg-white dark:text-[#17181B]"
        >
          {cta}
        </button>
      </div>
    </header>
  );
}
