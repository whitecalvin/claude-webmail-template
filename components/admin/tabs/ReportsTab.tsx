"use client";

// Admin Console > Reports & Export tab: an ad-hoc report builder, recent
// export history, and recurring scheduled reports.
import { useState } from "react";
import {
  EXPORT_POLICY,
  EXPORT_ROWS,
  REPORT_COLUMNS,
  REPORT_SCHEDULES,
} from "@/lib/mock-admin";
import { AdminCard, AdminSwitch, Pill } from "../primitives";
import { useToast } from "@/context/toast-context";

const FORMATS = ["CSV", "XLSX", "JSON"];

export function ReportsTab() {
  const toast = useToast();
  const [format, setFormat] = useState("CSV");
  const [columns, setColumns] = useState(REPORT_COLUMNS);
  const [schedules, setSchedules] = useState(REPORT_SCHEDULES);

  const toggleCol = (name: string) =>
    setColumns((prev) => prev.map((c) => (c.name === name ? { ...c, active: !c.active } : c)));
  const toggleSchedule = (name: string) =>
    setSchedules((prev) => prev.map((s) => (s.name === name ? { ...s, on: !s.on } : s)));

  return (
    <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-4 overflow-y-auto p-7">
      <div className="flex flex-col gap-4">
        <AdminCard title="리포트 만들기">
          <p className="mb-3 -mt-2 text-[11px] text-(--text-muted)">최대 90일 · 최대 100만 행</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "리포트 종류", value: "발송 리포트" },
              { label: "기간", value: "최근 7일" },
              { label: "범위", value: "전체 조직" },
              { label: "그룹화", value: "일별" },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-(--text-muted)">{f.label}</span>
                <div className="flex h-9 items-center justify-between rounded-lg border border-(--border-app) px-2.5 text-xs">
                  {f.value}
                  <span className="text-[9px] text-(--text-muted)">▾</span>
                </div>
              </label>
            ))}
          </div>

          <p className="mb-1.5 mt-3 text-[11px] font-semibold text-(--text-muted)">포함할 열</p>
          <div className="flex flex-wrap gap-1.5">
            {columns.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleCol(c.name)}
                className={`h-7 rounded-full px-2.5 text-[11px] font-semibold transition ${
                  c.active
                    ? "bg-(--color-primary)/15 text-(--color-primary)"
                    : "bg-black/5 text-(--text-muted) dark:bg-white/10"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <p className="mb-1.5 mt-3 text-[11px] font-semibold text-(--text-muted)">형식</p>
          <div className="flex gap-1.5">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`h-8 flex-1 rounded-lg border text-xs font-semibold transition ${
                  format === f
                    ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                    : "border-(--border-app) text-(--text-muted)"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <p className="text-[11px] text-(--text-muted)">예상 42,180행 · 약 6 MB</p>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => toast.info("정기 리포트로 예약합니다", { sub: format })}
                className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
              >
                예약
              </button>
              <button
                type="button"
                onClick={() => toast.success("리포트 내보내기를 시작했습니다", { sub: `${format} · 예상 42,180행` })}
                className="h-8 rounded-lg px-3 text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                내보내기
              </button>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="내보내기 정책">
          <ul className="flex flex-col gap-1.5">
            {EXPORT_POLICY.map((p) => (
              <li key={p} className="flex gap-2 text-[11.5px] leading-relaxed text-(--text-muted)">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-(--color-primary)" />
                {p}
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="flex flex-col gap-4">
        <AdminCard title="최근 내보내기">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_60px_50px_54px_50px] gap-1 text-[10px] font-bold uppercase text-(--text-muted)">
              <span>리포트</span>
              <span>요청자</span>
              <span>크기</span>
              <span>완료</span>
              <span>상태</span>
            </div>
            {EXPORT_ROWS.map((e) => (
              <div key={e.name} className="grid grid-cols-[1fr_60px_50px_54px_50px] items-center gap-1 border-t border-(--border-app) pt-2 text-[11px]">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{e.name}</p>
                  <p className="truncate text-[10px] text-(--text-muted)">{e.range}</p>
                </div>
                <span className="truncate text-(--text-muted)">{e.by}</span>
                <span className="text-(--text-muted)">{e.size}</span>
                <span className="text-(--text-muted)">{e.when}</span>
                <Pill label={e.state} tone={e.tone} />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="정기 리포트">
          <div className="flex flex-col gap-2.5">
            {schedules.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{s.name}</p>
                  <p className="truncate text-[10.5px] text-(--text-muted)">
                    {s.cadence} · {s.to}
                  </p>
                </div>
                <AdminSwitch on={s.on} onToggle={() => toggleSchedule(s.name)} />
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
