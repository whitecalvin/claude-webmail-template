"use client";

import { A11Y_ROWS, CONTRAST_ROWS } from "@/lib/mock-accessibility";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { SettingsHeaderTitle } from "@/components/settings/SettingsHeaderTitle";
import { SettingsNav } from "@/components/settings/SettingsNav";

// Accessibility (KWCAG 2.2) compliance report — a static self-audit page for
// public-sector procurement requirements. Read-only aside from navigation.
export default function AccessibilityPage() {
  const passed = A11Y_ROWS.filter((r) => r.state === "통과").length;

  return (
    <WorkspaceLayout title={<SettingsHeaderTitle title="접근성 명세 · KWCAG 2.2" />} headerActions={<span className="rounded-full bg-(--status-success-bg) px-3 py-1.5 text-xs font-bold text-(--status-success)">통과 {passed} / {A11Y_ROWS.length}</span>} showGlobalSearch={false} className="flex flex-col bg-(--surface-muted) lg:flex-row">
      <SettingsNav active="accessibility" />
      <section aria-label="접근성 명세" className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 p-5 sm:p-8">
        <p className="text-xs text-(--text-muted)">공공기관 납품 기준 · 자체 점검 2026년 8월 28일</p>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="rounded-xl border border-(--border-app) bg-background p-5">
            <h2 className="mb-3 text-sm font-bold">점검 항목</h2>
            <div className="flex flex-col gap-2">
              {A11Y_ROWS.map((r) => (
                <div key={r.name} className="flex items-center gap-3 border-b border-(--border-app) pb-2 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{r.name}</p>
                    <p className="text-[10.5px] text-(--text-muted)">{r.how}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.state === "통과"
                        ? "bg-(--status-success-bg) text-(--status-success)"
                        : "bg-(--status-warning-bg) text-(--status-warning)"
                    }`}
                  >
                    {r.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-(--border-app) bg-background p-5">
              <h2 className="mb-3 text-sm font-bold">명암비 검증</h2>
              <div className="flex flex-col gap-2.5">
                {CONTRAST_ROWS.map((r) => (
                  <div key={r.pair} className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg border border-(--border-app) bg-white text-xs font-bold"
                      style={{ color: r.fg }}
                    >
                      Aa
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-medium">{r.pair}</p>
                      <p className="text-[10.5px] text-(--text-muted)">{r.ratio}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        r.fail
                          ? "bg-(--status-warning-bg) text-(--status-warning)"
                          : "bg-(--status-success-bg) text-(--status-success)"
                      }`}
                    >
                      {r.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-(--border-app) bg-background p-5">
              <h2 className="mb-3 text-sm font-bold">포커스 · 터치 영역</h2>
              <button
                type="button"
                className="h-9 rounded-lg px-4 text-xs font-semibold text-white"
                style={{
                  backgroundColor: "var(--color-primary)",
                  outline: "2px solid var(--color-primary)",
                  outlineOffset: "3px",
                }}
              >
                포커스 상태
              </button>
              <p className="mt-2 text-[11px] text-(--text-muted)">
                최소 44 × 44 px · 모바일 버튼 · 탭 · 목록 행 (필터 칩 34px)
              </p>
              <p className="mt-3 text-xs leading-relaxed text-(--text-muted)">
                포커스 링은 2px 액센트 외곽선 + 3px 오프셋으로 통일하며, 키보드 사용 시에만 표시됩니다
                (:focus-visible).
              </p>
              <div className="mt-3 rounded-lg bg-black/2 p-3 text-xs dark:bg-white/3">
                <p className="font-semibold">보조 기술 테스트</p>
                <p className="mt-1 text-(--text-muted)">NVDA 2025.1 · VoiceOver (macOS 15) · 센스리더 3.5</p>
                <p className="mt-1 text-(--text-muted)">
                  메일 목록은 표 구조로 읽히며, 읽지 않음 상태는 텍스트로도 전달됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </WorkspaceLayout>
  );
}
