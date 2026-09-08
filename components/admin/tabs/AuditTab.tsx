"use client";

// Admin Console > Audit Log tab: read-only, filterable log of every
// administrative action. "되돌리기" (revert) is a mocked confirmation flow —
// there is no real undo of the underlying (also mocked) action.
import { useState } from "react";
import { Search } from "lucide-react";
import { AUDIT_LOGS } from "@/lib/mock-admin";
import { AdminCard, Pill } from "../primitives";
import { Drawer } from "@/components/overlay/Drawer";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/context/toast-context";

type AuditLog = (typeof AUDIT_LOGS)[number];

const ADMIN_OPTIONS = ["전체", ...Array.from(new Set(AUDIT_LOGS.map((a) => a.admin)))];
const ACTION_OPTIONS = ["전체", ...Array.from(new Set(AUDIT_LOGS.map((a) => a.action)))];
const RANGE_OPTIONS = ["최근 7일", "최근 30일", "최근 90일", "전체 기간"];

export function AuditTab() {
  const toast = useToast();
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [confirmingRevert, setConfirmingRevert] = useState(false);
  const [query, setQuery] = useState("");
  const [adminFilter, setAdminFilter] = useState("전체");
  const [actionFilter, setActionFilter] = useState("전체");
  const [range, setRange] = useState("최근 30일");

  const q = query.trim().toLowerCase();
  const filtered = AUDIT_LOGS.filter(
    (a) =>
      (adminFilter === "전체" || a.admin === adminFilter) &&
      (actionFilter === "전체" || a.action === actionFilter) &&
      (!q ||
        a.admin.toLowerCase().includes(q) ||
        a.target.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.ip.toLowerCase().includes(q))
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-7">
      <AdminCard className="flex flex-1 flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="관리자 · 대상 · 액션 검색"
              className="h-8 w-64 rounded-lg bg-black/[.04] pl-7 pr-2.5 text-xs outline-none dark:bg-white/[.06]"
            />
          </div>
          <Dropdown prefix="관리자" options={ADMIN_OPTIONS} value={adminFilter} onChange={setAdminFilter} />
          <Dropdown prefix="액션" options={ACTION_OPTIONS} value={actionFilter} onChange={setActionFilter} />
          <Dropdown prefix="기간" options={RANGE_OPTIONS} value={range} onChange={setRange} />
          <span className="ml-auto text-xs text-(--text-muted)">
            {filtered.length}건 · 보존 5년 · 변경 불가 저장소
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-(--border-app)">
          <div className="grid grid-cols-[80px_1.1fr_1fr_1.5fr_110px_80px] gap-2 border-b border-(--border-app) bg-black/[.02] px-3 py-2 text-[10.5px] font-bold uppercase tracking-[.03em] text-(--text-muted) dark:bg-white/[.03]">
            <span>시각</span>
            <span>관리자</span>
            <span>액션</span>
            <span>대상 · 변경 내용</span>
            <span>IP</span>
            <span>결과</span>
          </div>
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-(--text-muted)">조건에 맞는 로그가 없습니다.</p>
          )}
          {filtered.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(a)}
              className="grid w-full grid-cols-[80px_1.1fr_1fr_1.5fr_110px_80px] items-center gap-2 border-b border-(--border-app) px-3 py-2.5 text-left text-xs last:border-b-0 hover:bg-black/[.015] dark:hover:bg-white/[.02]"
            >
              <span className="text-(--text-muted)">{a.time}</span>
              <span className="truncate font-semibold">{a.admin}</span>
              <span>
                <Pill label={a.action} tone={a.tone} />
              </span>
              <span className="truncate text-(--text-muted)">{a.target}</span>
              <span className="truncate font-mono text-[10.5px] text-(--text-muted)">{a.ip}</span>
              <Pill label={a.result} tone={a.resultTone} />
            </button>
          ))}
        </div>
      </AdminCard>

      {selected && (
        <Drawer
          title="감사 로그 상세"
          subtitle={`${selected.action} · ${selected.time}`}
          onClose={() => setSelected(null)}
          footer={
            <>
              <button
                type="button"
                onClick={() => toast.info("JSON 뷰어는 준비 중입니다")}
                className="flex-1 rounded-[9px] border border-(--border-app) py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                JSON 보기
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRevert(true)}
                className="flex-1 rounded-[9px] py-2 text-xs font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                되돌리기
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-2.5">
            {[
              { k: "관리자", v: selected.admin },
              { k: "액션", v: selected.action },
              { k: "대상", v: selected.target },
              { k: "IP", v: selected.ip },
              { k: "결과", v: selected.result },
              { k: "시각", v: selected.time },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline gap-2.5">
                <span className="w-12 shrink-0 text-[11px] font-semibold text-(--text-muted)">{row.k}</span>
                <span className="flex-1 text-[12.5px]">{row.v}</span>
              </div>
            ))}
          </div>
        </Drawer>
      )}

      {confirmingRevert && selected && (
        <ConfirmDialog
          tone="warning"
          title="이 변경을 되돌릴까요?"
          description={`${selected.target}에 적용된 "${selected.action}"을(를) 이전 상태로 되돌립니다.`}
          confirmLabel="되돌리기"
          onCancel={() => setConfirmingRevert(false)}
          onConfirm={() => {
            setConfirmingRevert(false);
            setSelected(null);
            toast.success("변경 사항을 되돌렸습니다", { sub: selected.target });
          }}
        />
      )}
    </div>
  );
}
