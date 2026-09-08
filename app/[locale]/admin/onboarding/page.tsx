"use client";

import { useState } from "react";
import { Check, RefreshCw, Upload } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DNS_RECORDS, MIGRATIONS, ONBOARD_STEPS } from "@/lib/mock-onboarding";
import { useToast } from "@/context/toast-context";

// Org-admin onboarding wizard (/admin/onboarding): DNS record setup, bulk
// account import, and legacy-mail migration progress. Distinct from /setup,
// which is the one-time server installer.
const STATE_TONE: Record<string, string> = {
  success: "bg-(--status-success-bg) text-(--status-success)",
  warning: "bg-(--status-warning-bg) text-(--status-warning)",
  neutral: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

export default function OnboardingPage() {
  const toast = useToast();
  const doneCount = ONBOARD_STEPS.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / ONBOARD_STEPS.length) * 100) + 5;
  const [dnsRecords, setDnsRecords] = useState(DNS_RECORDS);
  const [dnsChecking, setDnsChecking] = useState(false);

  const copyAllDns = () => {
    const text = dnsRecords.map((r) => `${r.type}\t${r.host}\t${r.value}`).join("\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    toast.success("DNS 레코드를 모두 복사했습니다", { sub: `${dnsRecords.length}건` });
  };

  const recheckDns = () => {
    setDnsChecking(true);
    toast.info("DNS 레코드를 다시 확인합니다");
    window.setTimeout(() => {
      setDnsRecords((prev) => prev.map((r) => ({ ...r, state: "확인됨", tone: "success" as const })));
      setDnsChecking(false);
      toast.success("DNS 확인을 완료했습니다", { sub: `${dnsRecords.length}건 중 ${dnsRecords.length}건 확인` });
    }, 800);
  };

  return (
    <div className="min-h-dvh bg-(--surface-muted) text-(--text-app)">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[19px] font-bold tracking-tight">조직 설치 마법사</h1>
            <p className="text-xs text-(--text-muted)">
              gxsoft.co.kr · 2단계 진행 중 · 예상 소요 20분
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-[170px] overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "var(--color-primary)" }} />
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
              {progress}%
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-2 rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
            {ONBOARD_STEPS.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2"
                style={{ backgroundColor: s.status === "now" ? "#F5F7FF" : "transparent" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: s.status === "done" ? "var(--status-success-bg)" : s.status === "now" ? "var(--color-primary)" : "black/5",
                    color: s.status === "done" ? "var(--status-success)" : s.status === "now" ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {s.status === "done" ? <Check size={12} /> : i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{s.name}</p>
                  <p className="truncate text-[10.5px] text-(--text-muted)">{s.desc}</p>
                </div>
              </div>
            ))}
            <p className="mt-2 border-t border-(--border-app) pt-3 text-[10.5px] leading-relaxed text-(--text-muted)">
              DNS 반영에 최대 48시간이 걸릴 수 있습니다. 그동안 기존 메일 서버는 계속 동작합니다.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold">DNS 레코드 등록</p>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={copyAllDns}
                    className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
                  >
                    전체 복사
                  </button>
                  <button
                    type="button"
                    onClick={recheckDns}
                    disabled={dnsChecking}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white disabled:opacity-60"
                    style={{ backgroundColor: "#17181B" }}
                  >
                    <RefreshCw size={12} className={dnsChecking ? "animate-spin" : undefined} />
                    {dnsChecking ? "확인 중..." : "다시 확인"}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-(--border-app) text-left text-[10px] font-bold uppercase text-(--text-muted)">
                      <th className="pb-2 pr-2">타입</th>
                      <th className="pb-2 pr-2">호스트</th>
                      <th className="pb-2 pr-2">값</th>
                      <th className="pb-2 pr-2">우선순위</th>
                      <th className="pb-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((r, i) => (
                      <tr key={i} className="border-b border-(--border-app) last:border-b-0">
                        <td className="py-2 pr-2 font-mono">{r.type}</td>
                        <td className="py-2 pr-2 font-mono">{r.host}</td>
                        <td className="max-w-[220px] truncate py-2 pr-2 font-mono text-(--text-muted)">{r.value}</td>
                        <td className="py-2 pr-2 text-(--text-muted)">{r.prio}</td>
                        <td className="py-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATE_TONE[r.tone]}`}>{r.state}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                <p className="mb-3 text-sm font-bold">계정 일괄 등록</p>
                <button
                  type="button"
                  onClick={() => toast.info("CSV 파일 선택 창을 엽니다")}
                  className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-(--border-app) text-(--text-muted) transition hover:bg-black/[.02] dark:hover:bg-white/[.03]"
                >
                  <Upload size={18} />
                  <span className="text-[11px]">CSV 파일을 드래그하거나 선택하세요</span>
                </button>
                <p className="mt-2 text-[10.5px] text-(--text-muted)">이름 · 이메일 · 부서 · 직급 열 필요</p>
                <p className="mt-1 text-[11px] font-semibold text-(--status-success)">1,284행 검증 완료 · 중복 3건 자동 병합</p>
              </div>
              <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                <p className="mb-3 text-sm font-bold">기존 메일 마이그레이션</p>
                <div className="flex flex-col gap-2.5">
                  {MIGRATIONS.map((m) => (
                    <div key={m.source}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold">{m.source}</span>
                        <span className="text-(--text-muted)">{m.percent}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${m.percent}%`, backgroundColor: "var(--color-primary)" }} />
                      </div>
                      <p className="mt-1 text-[10.5px] text-(--text-muted)">{m.note}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] text-(--text-muted)">
                  IMAP 동기화는 전환 후에도 7일간 유지되어 누락을 방지합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link href="/admin" className="h-9 rounded-lg border border-(--border-app) px-4 text-xs font-semibold leading-9">
            나중에 계속하기
          </Link>
          <button
            type="button"
            onClick={() => toast.info("계정 만들기 단계로 이동합니다")}
            className="h-9 rounded-lg px-4 text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            다음 · 계정 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
