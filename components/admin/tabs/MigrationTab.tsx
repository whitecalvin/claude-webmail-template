"use client";

// Admin Console > Mailbox Migration tab: progress of migrating mailboxes in
// from another mail system, batch-by-batch, with a failure/skip breakdown.
import { useState } from "react";
import { MIG_BATCHES, MIG_ERRORS, MIG_KPIS } from "@/lib/mock-admin";
import { AdminCard, Pill, ProgressBar, Sparkline } from "../primitives";
import { useToast } from "@/context/toast-context";

const TONE_COLOR: Record<string, string> = {
  success: "#2E8B5B",
  info: "#2B4BF2",
  neutral: "#9A9EA5",
  warning: "#E0AC4A",
  danger: "#C0433B",
};

const MIG_BARS = Array.from({ length: 24 }, (_, i) => 40 + Math.round(Math.sin(i / 2) * 25 + (i % 5) * 5));

export function MigrationTab() {
  const toast = useToast();
  const [errors, setErrors] = useState(MIG_ERRORS);

  const retryAll = () => {
    const total = errors.reduce((sum, e) => sum + e.count, 0);
    setErrors([]);
    toast.success("실패 · 건너뜀 항목을 다시 시도합니다", { sub: `${total.toLocaleString()}건` });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-7">
      <div className="grid grid-cols-4 gap-4">
        {MIG_KPIS.map((k) => (
          <AdminCard key={k.label}>
            <p className="text-xs text-(--text-muted)">{k.label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight">{k.value}</p>
            <p className="mt-1 text-[11px] text-(--text-muted)">{k.note}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="배치별 진행">
        <p className="mb-3 -mt-2 text-[11px] text-(--text-muted)">동시 실행 4 · 대역폭 제한 200 Mbps</p>
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-[110px_60px_1fr_90px_70px] gap-2 text-[10px] font-bold uppercase text-(--text-muted)">
            <span>배치</span>
            <span>계정</span>
            <span>진행</span>
            <span>남은 시간</span>
            <span>상태</span>
          </div>
          {MIG_BATCHES.map((b) => (
            <div key={b.name} className="grid grid-cols-[110px_60px_1fr_90px_70px] items-center gap-2 border-t border-(--border-app) pt-2.5 text-xs">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-[10.5px] text-(--text-muted)">{b.src}</p>
              </div>
              <span>{b.accounts}</span>
              <ProgressBar pct={b.pct} color={TONE_COLOR[b.tone]} />
              <span className="text-(--text-muted)">{b.eta}</span>
              <Pill label={b.state} tone={b.tone} />
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="grid grid-cols-2 gap-4">
        <AdminCard title="처리량 (최근 12시간)">
          <Sparkline bars={MIG_BARS} height={70} />
          <p className="mt-2 text-[11px] text-(--text-muted)">평균 1,840 통/분 · 피크 3,210</p>
        </AdminCard>

        <AdminCard
          title="실패 · 건너뜀"
          action={
            errors.length > 0 && (
              <button
                type="button"
                onClick={retryAll}
                className="text-[11px] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                전체 재시도
              </button>
            )
          }
        >
          <div className="flex flex-col gap-2">
            {errors.length === 0 && <p className="text-xs text-(--text-muted)">재시도 대기 중인 항목이 없습니다.</p>}
            {errors.map((e) => (
              <div key={e.reason} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: TONE_COLOR[e.tone] }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{e.reason}</p>
                  <p className="truncate text-[10.5px] text-(--text-muted)">{e.detail}</p>
                </div>
                <span className="shrink-0 text-xs font-bold">{e.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <p className="text-[11px] text-(--text-muted)">
        전환 후 7일간 원본 서버와 IMAP 동기화가 유지되므로, 실패 항목은 언제든 다시 가져올 수 있습니다.
      </p>
    </div>
  );
}
