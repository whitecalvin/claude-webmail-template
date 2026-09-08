"use client";

// Admin Console > Backup & Retention tab: backup KPIs, retention policies,
// in-progress mailbox restores, and legal-hold status.
import { BACKUP_KPIS, RESTORE_JOBS, RETENTION_POLICIES } from "@/lib/mock-admin";
import { AdminCard, Pill, ProgressBar } from "../primitives";
import { useToast } from "@/context/toast-context";

const TONE_COLOR: Record<string, string> = {
  success: "#2E8B5B",
  info: "#2B4BF2",
  neutral: "#9A9EA5",
  danger: "#C0433B",
};

export function BackupTab() {
  const toast = useToast();
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-7">
      <div className="grid grid-cols-4 gap-4">
        {BACKUP_KPIS.map((k) => (
          <AdminCard key={k.label}>
            <p className="text-xs text-(--text-muted)">{k.label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight">{k.value}</p>
            <p className="mt-1 text-[11px] text-(--text-muted)">{k.note}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AdminCard title="보관 정책">
          <div className="flex flex-col gap-2">
            {RETENTION_POLICIES.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-lg border border-(--border-app) px-3 py-2">
                <div>
                  <p className="text-xs font-semibold">{r.name}</p>
                  <p className="text-[10.5px] text-(--text-muted)">{r.scope}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">{r.period}</p>
                  <p className="text-[10.5px] text-(--text-muted)">{r.mode}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="복구 작업">
          <div className="flex flex-col gap-3">
            {RESTORE_JOBS.map((r) => (
              <div key={r.name}>
                <div className="mb-1 flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{r.name}</span>
                  <Pill label={r.state} tone={r.tone} />
                </div>
                <ProgressBar pct={r.pct} color={TONE_COLOR[r.tone]} />
                <p className="mt-1 text-[10.5px] text-(--text-muted)">{r.meta}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: "#17181B" }}>
        <h3 className="text-[13px] font-bold text-white">법적 보존 (Legal Hold)</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">
          진행 중인 감사 2건에 대해 계정 6개의 삭제가 차단되어 있습니다.
        </p>
        <button
          type="button"
          onClick={() => toast.info("법적 보존 대상 계정 6개를 엽니다", { sub: "진행 중인 감사 2건" })}
          className="mt-2.5 h-8 rounded-lg bg-white/10 px-3 text-xs font-semibold text-white"
        >
          대상 보기
        </button>
      </div>
    </div>
  );
}
