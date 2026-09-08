"use client";

// Admin Console > Domain & Policy tab: verified sending domains, send-rate
// limits, org-wide mail policy toggles, and the AI-feature rollout plan.
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AI_ROLLOUT, DOMAINS, POLICY_TOGGLES, SEND_LIMITS } from "@/lib/mock-admin";
import { AdminCard, AdminSwitch, Pill } from "../primitives";
import { useToast } from "@/context/toast-context";

export function PolicyTab() {
  const toast = useToast();
  const [toggles, setToggles] = useState(POLICY_TOGGLES);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("오늘 03:02");

  const toggle = (key: string) =>
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));

  const syncNow = () => {
    setSyncing(true);
    toast.info("HR 조직도 동기화를 시작합니다");
    window.setTimeout(() => {
      setSyncing(false);
      setLastSync("방금");
      toast.success("조직도 동기화를 완료했습니다", { sub: "1,284명" });
    }, 800);
  };

  return (
    <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-7">
      <div className="flex flex-col gap-4">
        <AdminCard
          title="도메인"
          action={<Pill label="3개 확인됨" tone="success" />}
        >
          <div className="flex flex-col gap-2.5">
            {DOMAINS.map((d) => (
              <div key={d.name} className="rounded-lg border border-(--border-app) p-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold">{d.name}</p>
                  <Pill label={d.tag} tone={d.ok ? "info" : "danger"} />
                </div>
                <p className="mt-1 text-[11px] text-(--text-muted)">{d.meta}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.checks.map((c) => (
                    <Pill key={c} label={c} tone="success" />
                  ))}
                  {d.failing?.map((c) => (
                    <Pill key={c} label={c} tone="danger" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="발송 제한">
          <div className="flex flex-col gap-2">
            {SEND_LIMITS.map((l) => (
              <div key={l.name} className="flex items-center justify-between rounded-lg border border-(--border-app) px-3 py-2 text-xs">
                <span className="text-(--text-muted)">{l.name}</span>
                <span className="font-semibold">{l.value} ▾</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="flex flex-col gap-4">
        <AdminCard title="메일 정책">
          <div className="flex flex-col gap-3">
            {toggles.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => toggle(t.key)}
                className="flex items-start gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{t.name}</p>
                  <p className="text-[11px] text-(--text-muted)">{t.desc}</p>
                </div>
                <AdminSwitch on={t.on} onToggle={() => toggle(t.key)} />
              </button>
            ))}
          </div>
        </AdminCard>

        <div className="rounded-xl p-4" style={{ backgroundColor: "#17181B" }}>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: "#2B4BF2" }}>
              AI
            </span>
            <h3 className="text-[13px] font-bold text-white">AI 기능 배포 범위</h3>
          </div>
          <p className="text-[11.5px] leading-relaxed text-white/60">
            요약·작성 도움 기능을 조직 단위로 단계 배포합니다. 본문은 국내 리전에서만 처리되며 학습에 사용되지 않습니다.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {AI_ROLLOUT.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-lg bg-white/[.06] px-3 py-2 text-xs">
                <div>
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-[10.5px] text-white/50">{r.count}</p>
                </div>
                <Pill label={r.state} tone={r.tone} />
              </div>
            ))}
          </div>
        </div>

        <AdminCard className="!bg-[#FBF9F4] !border-[#EBE4D6]">
          <p className="text-xs leading-relaxed text-(--text-app)">
            HR 시스템(그로우) 조직도를 매일 03:00에 동기화합니다. 마지막 동기화 {lastSync} · 1,284명
          </p>
          <button
            type="button"
            onClick={syncNow}
            disabled={syncing}
            className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#DDD3B8] bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
          >
            <RefreshCw size={12} className={syncing ? "animate-spin" : undefined} />
            {syncing ? "동기화 중..." : "지금 동기화"}
          </button>
        </AdminCard>
      </div>
    </div>
  );
}
