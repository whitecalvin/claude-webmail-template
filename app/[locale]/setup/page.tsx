"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Check, RefreshCw } from "lucide-react";
import { DB_CHECKS, SETUP_DNS_RECORDS, SETUP_STEPS } from "@/lib/mock-setup";
import { useToast } from "@/context/toast-context";

// Self-hosted mail server "first run" install wizard (/setup) — a 7-step
// flow ending in redirect to /login. Each step's "recheck" actions simulate
// a delay before flipping their mock statuses to passing.
const DNS_STATE_TONE: Record<string, string> = {
  확인됨: "bg-(--status-success-bg) text-(--status-success)",
  "전파 중": "bg-(--status-warning-bg) text-(--status-warning)",
  미설정: "bg-(--status-warning-bg) text-(--status-warning)",
};

export default function SetupPage() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const progress = Math.round((step / SETUP_STEPS.length) * 100);
  const [dbChecks, setDbChecks] = useState(DB_CHECKS);
  const [dbChecking, setDbChecking] = useState(false);
  const [dnsRecords, setDnsRecords] = useState(SETUP_DNS_RECORDS);
  const [dnsChecking, setDnsChecking] = useState(false);
  const [invited, setInvited] = useState(false);

  const next = () => {
    if (step === SETUP_STEPS.length) {
      router.push("/login");
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const recheckDb = () => {
    setDbChecking(true);
    toast.info("데이터베이스 연결을 다시 테스트합니다");
    window.setTimeout(() => {
      setDbChecks((prev) => prev.map((c) => ({ ...c, state: "통과" })));
      setDbChecking(false);
      toast.success("연결 테스트를 통과했습니다", { sub: `${DB_CHECKS.length}개 중 ${DB_CHECKS.length}개 통과` });
    }, 700);
  };

  const copyDnsValue = (value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    toast.success("값을 복사했습니다", { sub: value });
  };

  const recheckDns = () => {
    setDnsChecking(true);
    toast.info("DNS 레코드를 다시 검사합니다");
    window.setTimeout(() => {
      setDnsRecords((prev) => prev.map((r) => ({ ...r, state: "확인됨" })));
      setDnsChecking(false);
      toast.success("DNS 검사를 완료했습니다", { sub: `${SETUP_DNS_RECORDS.length}개 중 ${SETUP_DNS_RECORDS.length}개 확인` });
    }, 700);
  };

  const sendInvites = () => {
    setInvited(true);
    toast.success("초대 메일을 발송했습니다", { sub: "1,284명에게 전송 완료" });
  };

  return (
    <div className="flex min-h-dvh w-full lg:grid lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-6 bg-[#17181B] p-8 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: "#2B4BF2" }}>
            M
          </span>
          <span className="text-sm font-bold">Mailwave 메일 서버</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">FIRST RUN</p>
          <h1 className="mt-2 text-xl font-bold tracking-tight">설치 마법사</h1>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            서버 설치가 끝났습니다. 일곱 단계를 마치면 사용자가 바로 메일을 쓸 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {SETUP_STEPS.map((s, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isNow = n === step;
            return (
              <div
                key={s.name}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2"
                style={{ backgroundColor: isNow ? "rgba(255,255,255,.08)" : "transparent" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: isDone ? "#2B4BF2" : isNow ? "#fff" : "transparent",
                    color: isDone ? "#fff" : isNow ? "#17181B" : "#2A2C31",
                    border: !isDone && !isNow ? "1px solid #2A2C31" : undefined,
                  }}
                >
                  {isDone ? <Check size={12} /> : n}
                </span>
                <div className="min-w-0">
                  <p className={`truncate text-xs font-semibold ${isNow || isDone ? "text-white" : "text-white/40"}`}>
                    {s.name}
                  </p>
                  <p className="truncate text-[10.5px] text-white/35">{s.desc}</p>
                </div>
                {isDone && <span className="ml-auto shrink-0 text-[10px] text-white/40">완료</span>}
                {isNow && <span className="ml-auto shrink-0 text-[10px] text-[#7B94FF]">진행</span>}
              </div>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4 text-[11px] text-white/40">
          <p>서버 mail.gxsoft.co.kr · v2.4.1</p>
          <button
            type="button"
            onClick={() => toast.info("설치 안내 문서를 새 탭에서 엽니다")}
            className="text-left underline"
          >
            설치 안내 문서 열기
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-background">
        <div className="flex shrink-0 items-center gap-3 border-b border-(--border-app) px-6 py-5 sm:px-10">
          <div>
            <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
              {step} / {SETUP_STEPS.length} 단계
            </p>
            <h2 className="mt-1 text-[22px] font-bold tracking-tight sm:text-[27px]">{SETUP_STEPS[step - 1].name}</h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-27.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "var(--color-primary)" }} />
            </div>
            <span className="text-xs font-semibold text-(--text-muted)">진행률 {progress}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          {step === 1 && (
            <div className="max-w-lg">
              <p className="mb-4 text-sm text-(--text-muted)">
                라이선스 키를 입력하고 최초 관리자 계정을 만듭니다.
              </p>
              <div className="flex flex-col gap-3">
                {["라이선스 키", "관리자 이름", "관리자 이메일", "관리자 비밀번호"].map((label) => (
                  <label key={label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-(--text-muted)">{label}</span>
                    <div className="flex h-11 items-center rounded-lg border border-(--border-app) px-3 font-mono text-xs text-(--text-muted)">
                      {label === "라이선스 키" ? "MWV-XXXXX-XXXXX-XXXXX" : "—"}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_452px]">
              <div className="flex flex-col gap-3">
                <div className="flex rounded-lg bg-black/4 p-1 text-xs dark:bg-white/6">
                  {["PostgreSQL 16", "MySQL 8", "MariaDB 11"].map((db, i) => (
                    <span key={db} className={`flex-1 rounded-md py-2 text-center font-semibold ${i === 0 ? "bg-background shadow-sm" : "text-(--text-muted)"}`}>
                      {db}
                    </span>
                  ))}
                </div>
                {[
                  ["호스트", "db.internal.gxsoft.co.kr"],
                  ["포트", "5432"],
                  ["데이터베이스", "mailwave_prod"],
                  ["스키마", "public"],
                  ["계정", "mailwave"],
                  ["비밀번호", "••••••••••••"],
                  ["SSL 모드", "require"],
                  ["커넥션 풀", "최대 40 · 유휴 5"],
                ].map(([label, value]) => (
                  <label key={label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-(--text-muted)">{label}</span>
                    <div className="flex h-11 items-center rounded-lg border border-(--border-app) px-3 font-mono text-xs">
                      {value}
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <div className="rounded-xl border border-(--border-app) p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <p className="text-sm font-bold">연결 테스트</p>
                    <button
                      type="button"
                      onClick={recheckDb}
                      disabled={dbChecking}
                      className="ml-auto flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white disabled:opacity-60"
                      style={{ backgroundColor: "#17181B" }}
                    >
                      <RefreshCw size={12} className={dbChecking ? "animate-spin" : undefined} />
                      {dbChecking ? "테스트 중..." : "다시 테스트"}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dbChecks.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-[10.5px] text-(--text-muted)">{c.detail}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            c.state === "통과"
                              ? "bg-(--status-success-bg) text-(--status-success)"
                              : "bg-(--status-warning-bg) text-(--status-warning)"
                          }`}
                        >
                          {c.state}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-(--text-muted)">
                    마지막 테스트 방금 · {dbChecks.length}개 중 {dbChecks.filter((c) => c.state === "통과").length}개 통과
                  </p>
                </div>
                <div className="mt-3 rounded-lg bg-[#E4EAFE] p-3 text-[11px] leading-relaxed text-foreground">
                  다음을 누르면 스키마 42개 테이블을 생성하고 초기 데이터를 넣습니다(약 40초). 이미 데이터가
                  있는 데이터베이스라면 설치를 중단하고 <strong>기존 스키마 이어쓰기</strong> 여부를 먼저
                  묻습니다.
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-lg">
              <p className="mb-4 text-sm text-(--text-muted)">조직 정보와 기본 도메인을 등록합니다.</p>
              <div className="flex flex-col gap-3">
                {[
                  ["조직명", "지엑스소프트 주식회사"],
                  ["대표 도메인", "gxsoft.co.kr"],
                  ["담당자 이메일", "it-admin@gxsoft.co.kr"],
                ].map(([label, value]) => (
                  <label key={label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-(--text-muted)">{label}</span>
                    <div className="flex h-11 items-center rounded-lg border border-(--border-app) px-3 text-xs">{value}</div>
                  </label>
                ))}
                <div className="rounded-lg bg-[#E4EAFE] p-3 text-[11px] text-foreground">
                  HR 조직도(그로우)에서 부서 42개를 자동으로 가져올 수 있습니다.
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="overflow-hidden rounded-xl border border-(--border-app)">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-(--border-app) bg-black/2 text-left text-[10px] font-bold uppercase text-(--text-muted) dark:bg-white/3">
                      <th className="p-2.5">유형</th>
                      <th className="p-2.5">호스트</th>
                      <th className="p-2.5">값</th>
                      <th className="p-2.5">상태</th>
                      <th className="p-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((r, i) => (
                      <tr key={i} className="border-b border-(--border-app) last:border-b-0">
                        <td className="p-2.5 font-mono">{r.type}</td>
                        <td className="p-2.5 font-mono">{r.host}</td>
                        <td className="max-w-65 truncate p-2.5 font-mono text-(--text-muted)">{r.value}</td>
                        <td className="p-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${DNS_STATE_TONE[r.state]}`}>{r.state}</span>
                        </td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => copyDnsValue(r.value)}
                            className="h-7 rounded-md border border-(--border-app) px-2 text-[10.5px] font-semibold"
                          >
                            복사
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={recheckDns}
                  disabled={dnsChecking}
                  className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: "#17181B" }}
                >
                  <RefreshCw size={12} className={dnsChecking ? "animate-spin" : undefined} />
                  {dnsChecking ? "검사 중..." : "DNS 다시 검사"}
                </button>
                <span className="text-[11px] text-(--text-muted)">
                  마지막 검사 2분 전 · {dnsRecords.length}개 중 {dnsRecords.filter((r) => r.state === "확인됨").length}개 확인
                </span>
              </div>
              <div className="mt-3 rounded-lg bg-[#E4EAFE] p-3 text-[11px] leading-relaxed text-foreground">
                DNS 전파는 최대 24시간 걸립니다. DKIM과 DMARC는 지금 건너뛰고 다음 단계로 넘어가도 되며,
                나중에 <strong>관리자 · 도메인 · 정책</strong>에서 같은 화면으로 확인할 수 있습니다. 다만 두
                레코드가 없으면 외부 메일 서버가 발신 메일을 스팸으로 분류할 수 있습니다.
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="max-w-lg">
              <p className="mb-4 text-sm text-(--text-muted)">메일 데이터 저장 경로와 백업 주기를 설정합니다.</p>
              <div className="flex flex-col gap-3">
                {[
                  ["저장 경로", "/var/mailwave/data"],
                  ["백업 주기", "일 1회 · 04:00"],
                  ["보관 기간", "3년"],
                ].map(([label, value]) => (
                  <label key={label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-(--text-muted)">{label}</span>
                    <div className="flex h-11 items-center rounded-lg border border-(--border-app) px-3 font-mono text-xs">{value}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="max-w-lg">
              <p className="mb-4 text-sm text-(--text-muted)">기본 보안 정책을 설정합니다. 나중에 관리자 콘솔에서 조정할 수 있습니다.</p>
              <div className="flex flex-col gap-2.5">
                {["스팸 · 피싱 자동 격리", "DLP 기밀 문서 차단", "관리자 2단계 인증 필수", "외부 메일 경고 배너"].map((label, i) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-(--border-app) px-3 py-2.5 text-xs font-semibold">
                    {label}
                    <span
                      className="flex h-5.5 w-9 items-center rounded-full p-0.75"
                      style={{ backgroundColor: i < 3 ? "var(--color-primary)" : "var(--border-app)" }}
                    >
                      <span
                        className="h-4 w-4 rounded-full bg-white"
                        style={{ transform: i < 3 ? "translateX(16px)" : "translateX(0)" }}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="max-w-lg">
              <p className="mb-4 text-sm text-(--text-muted)">
                직원들에게 초대 메일을 발송합니다. CSV로 가져온 1,284명에게 첫 로그인 안내가 전송됩니다.
              </p>
              <div className="rounded-lg border border-(--border-app) p-4 text-xs">
                <p className="font-semibold">초대 대상</p>
                <p className="mt-1 text-(--text-muted)">1,284명 · gxsoft.co.kr</p>
              </div>
              <button
                type="button"
                onClick={sendInvites}
                disabled={invited}
                className="mt-3 h-10 w-full rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {invited ? "발송 완료" : "초대 메일 발송"}
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-(--border-app) px-6 py-4 sm:px-10">
          {step > 1 && (
            <button type="button" onClick={back} className="h-10 rounded-lg border border-(--border-app) px-4 text-sm font-semibold">
              뒤로
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="ml-auto h-10 rounded-lg px-5 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {step === SETUP_STEPS.length ? "설치 완료 · 로그인" : `다음 · ${SETUP_STEPS[step]?.name ?? ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
