"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import {
  AUTH_METHODS,
  MFA_METHODS,
  SECURITY_EVENTS,
  SESSIONS,
} from "@/lib/mock-security-personal";
import { CURRENT_USER } from "@/lib/current-user";
import { ModuleRail } from "@/components/layout/ModuleRail";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { useToast } from "@/context/toast-context";

// "계정 보안" settings page: 2FA/password status, MFA methods, signed-in
// sessions (with revoke), and a personal security event log.
const TONE_PILL: Record<string, string> = {
  success: "bg-(--status-success-bg) text-(--status-success)",
  warning: "bg-(--status-warning-bg) text-(--status-warning)",
  danger: "bg-(--status-danger-bg) text-(--status-danger)",
  info: "bg-(--color-primary)/10 text-(--color-primary)",
  neutral: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

const EVENT_DOT: Record<string, string> = {
  success: "#2E8B5B",
  warning: "#B4740F",
  danger: "#C0433B",
};

type ConfirmKind = "reissue" | "logout-all" | null;

export default function SecurityPage() {
  const toast = useToast();
  const [sessions, setSessions] = useState(SESSIONS);
  const [unusedCodes, setUnusedCodes] = useState(7);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);

  const revokeSession = (device: string) => {
    setSessions((prev) => prev.filter((s) => s.device !== device));
    toast.success("세션을 로그아웃했습니다", { sub: device });
  };

  return (
    <div className="flex h-dvh w-full bg-(--surface-muted) text-(--text-app)">
      <div className="hidden lg:block">
        <ModuleRail />
      </div>
      <div className="hidden lg:block">
        <SettingsNav active="security" />
      </div>
      <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
            aria-label="설정으로"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[19px] font-bold tracking-tight">계정 보안</h1>
            <p className="text-xs text-(--text-muted)">
              {CURRENT_USER.name} · {CURRENT_USER.email} · 마지막 비밀번호 변경 132일 전
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-(--status-warning-bg) px-3 py-1.5 text-xs font-bold text-(--status-warning)">
            보안 점수 72 / 100 · 개선 3건
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <h2 className="mb-3 text-sm font-bold">2단계 인증</h2>
              <div className="flex flex-col gap-3">
                {MFA_METHODS.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold">{m.name}</p>
                        {m.badge && (
                          <span className="shrink-0 rounded-full bg-(--color-primary)/10 px-1.5 py-0.5 text-[9.5px] font-bold text-(--color-primary)">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-(--text-muted)">{m.desc}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE_PILL[m.tone]}`}>
                      {m.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => toast.info(`${m.name} ${m.action} 화면으로 이동합니다`)}
                      className="shrink-0 text-[11px] font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {m.action}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-(--color-primary)/[.06] px-3 py-2 text-[11px] text-(--text-muted)">
                백업 코드 10개 중 <strong className="text-(--text-app)">{unusedCodes}개</strong> 미사용 · 안전한
                곳에 보관하세요{" "}
                <button
                  type="button"
                  onClick={() => setConfirmKind("reissue")}
                  className="font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  재발급
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <h2 className="mb-3 text-sm font-bold">비밀번호 · SSO</h2>
              <div className="flex flex-col gap-3">
                {AUTH_METHODS.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{m.name}</p>
                      <p className="truncate text-[11px] text-(--text-muted)">{m.desc}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE_PILL[m.tone]}`}>
                      {m.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => toast.info(`${m.name} ${m.action} 화면으로 이동합니다`)}
                      className="shrink-0 text-[11px] font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {m.action}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-[#F0DAD6] bg-[#FFFBFA] px-3 py-2 text-[11px] text-[#8E3B33]">
                앱 비밀번호 2개가 IMAP 접속에 사용 중입니다. 최신 클라이언트는 OAuth를 지원합니다.{" "}
                <button
                  type="button"
                  onClick={() => toast.info("앱 비밀번호 관리 화면으로 이동합니다")}
                  className="font-bold underline"
                >
                  확인
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-bold">로그인 기기 · 세션</h2>
              <button
                type="button"
                onClick={() => setConfirmKind("logout-all")}
                className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-[#C0433B]"
              >
                <LogOut size={12} />
                전체 로그아웃
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {sessions.map((s) => (
                <div
                  key={s.device}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                  style={{
                    borderColor: s.highlighted ? "#F0DAD6" : "var(--border-app)",
                    backgroundColor: s.highlighted ? "#FFFBFA" : "transparent",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{s.device}</p>
                    <p className="truncate text-[11px] text-(--text-muted)">{s.meta}</p>
                  </div>
                  {s.badge && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE_PILL[s.badgeTone ?? "neutral"]}`}>
                      {s.badge}
                    </span>
                  )}
                  <span className="shrink-0 text-[11px] text-(--text-muted)">{s.when}</span>
                  {s.badgeTone !== "info" || s.badge !== "현재 기기" ? (
                    <button
                      type="button"
                      onClick={() => revokeSession(s.device)}
                      className="shrink-0 text-[11px] font-semibold text-[#C0433B]"
                    >
                      로그아웃
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <h3 className="mb-2 mt-4 text-xs font-bold text-(--text-muted)">최근 보안 활동</h3>
            <div className="flex flex-col gap-1.5">
              {SECURITY_EVENTS.map((e) => (
                <div key={e.text} className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: EVENT_DOT[e.tone] }} />
                  <span className="min-w-0 flex-1 truncate">{e.text}</span>
                  <span className="shrink-0 text-(--text-muted)">{e.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {confirmKind === "reissue" && (
        <ConfirmDialog
          tone="warning"
          title="백업 코드를 재발급할까요?"
          description="기존 백업 코드 10개는 즉시 무효화되고, 새 코드 10개가 발급됩니다."
          confirmLabel="재발급"
          onCancel={() => setConfirmKind(null)}
          onConfirm={() => {
            setConfirmKind(null);
            setUnusedCodes(10);
            toast.success("백업 코드가 재발급되었습니다", { sub: "새 코드 10개 · 안전한 곳에 보관하세요" });
          }}
        />
      )}

      {confirmKind === "logout-all" && (
        <ConfirmDialog
          tone="destructive"
          title="다른 모든 기기에서 로그아웃할까요?"
          description="현재 기기를 제외한 모든 세션이 즉시 종료됩니다."
          confirmLabel="전체 로그아웃"
          onCancel={() => setConfirmKind(null)}
          onConfirm={() => {
            setConfirmKind(null);
            setSessions((prev) => prev.filter((s) => s.badge === "현재 기기"));
            toast.success("다른 모든 기기에서 로그아웃했습니다");
          }}
        />
      )}
    </div>
  );
}
