"use client";

import { useState } from "react";
import { CURRENT_USER } from "@/lib/current-user";
import {
  DEFAULT_TOGGLES,
  SECURITY_ROWS,
  SEND_DEFAULTS,
  USER_RULES,
} from "@/lib/mock-settings";
import { useToast } from "@/context/toast-context";
import { Switch } from "@/components/ui/Switch";
import type { UserToggle } from "@/types/settings";

// "메일 · 서명" settings screen: signature preview, send defaults, feature
// toggles, personal filter rules, and a security summary card. Rendered by
// the dedicated /settings/signature route.

const SECURITY_TONE_STYLE: Record<
  (typeof SECURITY_ROWS)[number]["tone"],
  string
> = {
  success: "bg-[rgba(63,191,127,.16)] text-[#6fe0a8]",
  neutral: "bg-white/10 text-white",
  info: "bg-[rgba(43,75,242,.2)] text-[#a9b8fb]",
};

export function SignatureSettingsView() {
  const toast = useToast();
  const [toggles, setToggles] = useState<UserToggle[]>(DEFAULT_TOGGLES);

  const toggle = (key: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t))
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-7">
      <div>
        <h1 className="text-[19px] font-bold tracking-tight">메일 · 서명</h1>
        <p className="mt-1 text-xs text-(--text-muted)">
          발신 기본값과 서명, 부재중 응답을 관리합니다.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-(--border-app) bg-(--surface-app) p-5 sm:flex-row">
        <div className="flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold">서명</h2>
            <div className="flex flex-wrap gap-1.5 sm:ml-auto">
              <span className="rounded-full bg-(--text-app) px-2.5 py-1 text-[11px] font-semibold text-(--surface-app)">
                기본 (한국어)
              </span>
              <span className="rounded-full border border-(--border-app) px-2.5 py-1 text-[11px] font-medium text-(--text-muted)">
                English
              </span>
              <button
                type="button"
                onClick={() => toast.info("서명 언어 추가 화면을 엽니다")}
                className="rounded-full border border-dashed border-(--border-app) px-2.5 py-1 text-[11px] font-medium text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
              >
                + 추가
              </button>
            </div>
          </div>
          <div className="rounded-[10px] border border-(--border-app) bg-black/[.015] p-4 text-xs leading-relaxed dark:bg-white/[.02]">
            <p className="font-semibold">
              {CURRENT_USER.name}{" "}
              <span className="font-normal text-(--text-muted)">(Jiwoo Han)</span>
            </p>
            <p className="mt-0.5 text-(--text-muted)">경영기획본부 전략기획팀 · 차장</p>
            <p className="mt-0.5 text-(--text-muted)">
              T. 02-1234-5678 · M. 010-2345-6789
            </p>
            <p className="mt-3 border-t border-(--border-app) pt-3 text-[11px] text-(--text-muted)">
              본 메일은 수신자에게만 허용된 정보를 포함할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="w-full shrink-0 sm:w-[250px]">
          <h2 className="mb-2.5 text-sm font-bold">발신 기본값</h2>
          <div className="flex flex-col gap-1.5">
            {SEND_DEFAULTS.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between gap-2 rounded-[9px] border border-(--border-app) px-3 py-2"
              >
                <span className="shrink-0 text-[11px] text-(--text-muted)">
                  {row.name}
                </span>
                <span className="flex min-w-0 items-center gap-1 text-xs font-semibold">
                  <span className="truncate">{row.value}</span>
                  <span className="shrink-0 text-[9px] text-(--text-muted)">▾</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
          <h2 className="mb-3 text-sm font-bold">기능 설정</h2>
          <div className="flex flex-col gap-3.5">
            {toggles.map((t) => (
              <div key={t.key} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold">{t.name}</p>
                  <p className="text-[11px] text-(--text-muted)">{t.desc}</p>
                </div>
                <Switch on={t.on} onToggle={() => toggle(t.key)} size="lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
            <h2 className="mb-3 text-sm font-bold">필터 · 자동 분류 규칙</h2>
            <div className="flex flex-col gap-2">
              {USER_RULES.map((rule) => (
                <div
                  key={rule.name}
                  className="flex items-center gap-2 rounded-[9px] border border-(--border-app) bg-black/[.015] px-3 py-2 dark:bg-white/[.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{rule.name}</p>
                    <p className="truncate text-[11px] text-(--text-muted)">
                      → {rule.action}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info("규칙 편집 화면을 엽니다", { sub: rule.name })}
                    className="shrink-0 text-[11px] font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    편집
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => toast.info("규칙 추가 화면을 엽니다")}
                className="rounded-[9px] border border-dashed border-(--border-app) py-2 text-xs font-medium text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
              >
                + 규칙 추가
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#17181B] p-5">
            <h2 className="mb-3 text-sm font-bold text-white">보안</h2>
            <div className="flex flex-col gap-2">
              {SECURITY_ROWS.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center gap-2 rounded-[9px] bg-white/[.06] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{row.name}</p>
                    <p className="truncate text-[11px] text-white/55">{row.desc}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${SECURITY_TONE_STYLE[row.tone]}`}
                  >
                    {row.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
