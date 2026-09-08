"use client";

// Admin Console > Security & Spam tab: aggregate detection KPIs and a
// filterable log of blocked/quarantined mail. Distinct from the personal
// security page and from the org-wide Audit Log tab.
import { useState } from "react";
import { Download } from "lucide-react";
import { LOG_FILTERS, SEC_KPIS, SEC_LOGS } from "@/lib/mock-admin";
import { AdminCard, Pill } from "../primitives";
import { useToast } from "@/context/toast-context";

export function SecurityTab() {
  const toast = useToast();
  const [filter, setFilter] = useState("전체");
  const filteredLogs = SEC_LOGS.filter((l) => filter === "전체" || l.kind === filter);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-7">
      <div className="grid grid-cols-4 gap-4">
        {SEC_KPIS.map((k) => (
          <AdminCard key={k.label}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
                style={{ backgroundColor: k.bg, color: k.fg }}
              >
                {k.icon}
              </span>
              <div>
                <p className="text-lg font-bold">{k.value}</p>
                <p className="text-[11px] text-(--text-muted)">{k.label}</p>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="flex flex-1 flex-col" title="차단 · 격리 로그">
        <div className="mb-3 flex items-center gap-2">
          {LOG_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
                filter === f
                  ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                  : "bg-black/5 text-(--text-muted) dark:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            type="button"
            onClick={() => toast.success("CSV 내보내기를 시작했습니다", { sub: `${filteredLogs.length}건` })}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-lg border border-(--border-app) px-2.5 text-xs font-semibold"
          >
            <Download size={12} />
            CSV 내보내기
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-(--border-app)">
          <div className="grid grid-cols-[110px_1.6fr_1.7fr_1fr_70px_80px] gap-2 border-b border-(--border-app) bg-black/2 px-3 py-2 text-[10.5px] font-bold uppercase tracking-[.03em] text-(--text-muted) dark:bg-white/3">
            <span>시각</span>
            <span>발신자</span>
            <span>제목 · 판정 근거</span>
            <span>수신자</span>
            <span>점수</span>
            <span>조치</span>
          </div>
          {filteredLogs.length === 0 && (
            <p className="p-6 text-center text-xs text-(--text-muted)">해당 조건의 로그가 없습니다.</p>
          )}
          {filteredLogs.map((l) => (
            <div
              key={l.time}
              className="grid grid-cols-[110px_1.6fr_1.7fr_1fr_70px_80px] items-center gap-2 border-b border-(--border-app) px-3 py-2.5 text-xs last:border-b-0 hover:bg-black/1.5 dark:hover:bg-white/2"
            >
              <span className="text-(--text-muted)">{l.time}</span>
              <span className="truncate font-mono text-[11px]">{l.from}</span>
              <span className="truncate">{l.subject}</span>
              <span className="truncate text-(--text-muted)">{l.to}</span>
              <span
                className="font-bold"
                style={{ color: l.score >= 90 ? "#C0433B" : l.score >= 50 ? "#E0AC4A" : "#2E8B5B" }}
              >
                {l.score}
              </span>
              <Pill label={l.action} tone={l.tone} />
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
