"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Bold, Check, Italic, Link2, Trash2, Underline } from "lucide-react";
import { BUILDER_ROWS, MY_RULES, SIGNATURE_TABS } from "@/lib/mock-rules";
import { CURRENT_USER } from "@/lib/current-user";
import { Modal } from "@/components/overlay/Modal";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { useToast } from "@/context/toast-context";
import { ModuleRail } from "@/components/layout/ModuleRail";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { Switch } from "@/components/ui/Switch";

// "필터 · 자동 분류" settings page: personal mail rules, an out-of-office
// auto-reply toggle, and signature editing (three tabs — 기본/새 메일/답장).
// Reached both from the Settings nav and directly via /rules.
export default function RulesPage() {
  const toast = useToast();
  const [rules, setRules] = useState(MY_RULES);
  const [oooOn, setOooOn] = useState(true);
  const [insertNew, setInsertNew] = useState(true);
  const [insertReply, setInsertReply] = useState(true);
  const [sigTab, setSigTab] = useState(SIGNATURE_TABS[0]);
  const [creatingRule, setCreatingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [showApplied, setShowApplied] = useState(false);
  const [builderRows, setBuilderRows] = useState(BUILDER_ROWS);

  const conditionCount = builderRows.filter((r) => r.kind === "조건").length;
  const actionCount = builderRows.filter((r) => r.kind === "동작").length;

  const addBuilderRow = (kind: "조건" | "동작") => {
    setBuilderRows((prev) => [...prev, { kind, field: "필드 선택", op: "조건 선택", value: "값 입력" }]);
  };

  const removeBuilderRow = (index: number) => {
    setBuilderRows((prev) => prev.filter((_, i) => i !== index));
  };

  const activeCount = rules.filter((r) => r.on).length;
  const toggle = (name: string) =>
    setRules((prev) => prev.map((r) => (r.name === name ? { ...r, on: !r.on } : r)));

  const handleCreateRule = () => {
    const name = newRuleName.trim();
    if (!name) return;
    setRules((prev) => [{ name, logic: "조건 2 · 동작 2", hits: 0, on: true }, ...prev]);
    setNewRuleName("");
    setCreatingRule(false);
    toast.success("규칙을 만들었습니다", { sub: name });
  };

  const handleDeleteRule = (name: string) => {
    const removed = rules.find((r) => r.name === name);
    setRules((prev) => prev.filter((r) => r.name !== name));
    if (!removed) return;
    toast.undo("규칙이 삭제되었습니다", () => setRules((prev) => [removed, ...prev]), { sub: name });
  };

  return (
    <div className="flex h-dvh w-full bg-(--surface-muted) text-(--text-app)">
      <div className="hidden lg:block">
        <ModuleRail />
      </div>
      <div className="hidden lg:block">
        <SettingsNav active="filters" />
      </div>
      <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
            aria-label="설정으로"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[19px] font-bold tracking-tight">내 규칙 · 서명 · 자동응답</h1>
            <p className="text-xs text-(--text-muted)">
              규칙 {activeCount}건 활성 · 이번 주 214통 자동 분류됨
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreatingRule(true)}
            className="ml-auto h-9 rounded-lg px-3.5 text-xs font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            규칙 만들기
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <h2 className="mb-3 text-sm font-bold">자동 분류 규칙</h2>
              <div className="flex flex-col gap-2.5">
                {rules.map((r) => (
                  <div key={r.name} className="group flex items-center gap-3 rounded-lg border border-(--border-app) p-3">
                    <Switch on={r.on} onToggle={() => toggle(r.name)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{r.name}</p>
                      <p className="truncate text-[11px] text-(--text-muted)">{r.logic}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold">{r.hits}</p>
                      <p className="text-[10px] text-(--text-muted)">7일</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(r.name)}
                      className="shrink-0 rounded-lg p-1.5 text-(--text-muted) opacity-0 transition hover:bg-black/5 hover:text-[#C0433B] group-hover:opacity-100 dark:hover:bg-white/10"
                      aria-label="규칙 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold">부재중 자동응답</h2>
                <span className="ml-auto">
                  <Switch on={oooOn} onToggle={() => setOooOn((v) => !v)} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-(--text-muted)">시작</span>
                  <div className="flex h-9 items-center rounded-lg border border-(--border-app) px-2.5 text-xs">
                    2026-09-14 09:00
                  </div>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-(--text-muted)">종료</span>
                  <div className="flex h-9 items-center rounded-lg border border-(--border-app) px-2.5 text-xs">
                    2026-09-19 18:00
                  </div>
                </label>
              </div>
              <div className="mt-2.5 rounded-lg border border-(--border-app) bg-black/[.015] p-3 text-xs leading-relaxed dark:bg-white/[.02]">
                휴가로 자리를 비웁니다 (9/14–9/19). 급한 사안은 강태윤 책임(taeyun.kang@gxsoft.co.kr)에게 연락
                부탁드립니다.
              </div>
              <div className="mt-2.5 flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-xs">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[5px]" style={{ backgroundColor: "var(--color-primary)" }}>
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </span>
                  사내에만 발송
                </label>
                <label className="flex items-center gap-2 text-xs text-(--text-muted)">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[5px] border border-(--border-app)" />
                  외부 발신자 포함
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold">규칙 만들기</h2>
                <span className="ml-auto text-[11px] text-(--text-muted)">
                  조건 {conditionCount} · 동작 {actionCount}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {builderRows.map((row, i) => (
                  <div key={i} className="group flex items-center gap-1.5 text-xs">
                    <span
                      className={`w-11 shrink-0 rounded px-1.5 py-1 text-center text-[10px] font-bold ${
                        row.kind === "조건"
                          ? "bg-(--color-primary)/10 text-(--color-primary)"
                          : "bg-(--status-success-bg) text-(--status-success)"
                      }`}
                    >
                      {row.kind}
                    </span>
                    <span className="flex-1 truncate rounded border border-(--border-app) px-2 py-1">{row.field}</span>
                    <span className="flex-1 truncate rounded border border-(--border-app) px-2 py-1">{row.op}</span>
                    <span className="flex-1 truncate rounded border border-(--border-app) px-2 py-1">{row.value}</span>
                    <button
                      type="button"
                      onClick={() => removeBuilderRow(i)}
                      className="shrink-0 rounded p-1 text-(--text-muted) opacity-0 transition hover:bg-black/5 hover:text-[#C0433B] group-hover:opacity-100 dark:hover:bg-white/10"
                      aria-label="행 삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => addBuilderRow("조건")}
                  className="h-8 flex-1 rounded-lg border border-dashed border-(--border-app) text-xs font-medium text-(--text-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
                >
                  + 조건
                </button>
                <button
                  type="button"
                  onClick={() => addBuilderRow("동작")}
                  className="h-8 flex-1 rounded-lg border border-dashed border-(--border-app) text-xs font-medium text-(--text-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
                >
                  + 동작
                </button>
              </div>
              <div className="mt-2.5 rounded-lg bg-(--color-primary)/[.06] px-3 py-2 text-[11px] text-(--text-muted)">
                지난 30일 메일에 시험 적용하면 <strong className="text-(--text-app)">38통</strong>이
                일치합니다.
              </div>
              <button
                type="button"
                onClick={() => setShowApplied(true)}
                className="mt-2.5 h-9 w-full rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: "#17181B" }}
              >
                저장 후 적용
              </button>
            </div>

            <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-5">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold">서명</h2>
                <button
                  type="button"
                  onClick={() => toast.info("새 서명 편집 화면을 엽니다")}
                  className="ml-auto text-[11px] font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  서명 추가
                </button>
              </div>
              <div className="mb-2.5 flex gap-1.5">
                {SIGNATURE_TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSigTab(t)}
                    className={`h-7 rounded-full px-2.5 text-[11px] font-semibold transition ${
                      sigTab === t
                        ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                        : "bg-black/5 text-(--text-muted) dark:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-(--border-app) bg-black/[.015] p-3 dark:bg-white/[.02]">
                <div className="mb-2.5 flex gap-1">
                  {[Bold, Italic, Underline, Link2].map((Icon, i) => (
                    <span key={i} className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-black/5 dark:bg-white/10">
                      <Icon size={13} />
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: "#E4EAFE", color: "var(--color-primary)" }}
                  >
                    {CURRENT_USER.name.slice(0, 1)}
                  </span>
                  <div className="text-xs">
                    <p className="font-bold">{CURRENT_USER.name} · 전략기획팀 책임</p>
                    <p className="text-(--text-muted)">지엑스소프트 주식회사</p>
                    <p className="text-(--text-muted)">{CURRENT_USER.email} · 02-2000-1234</p>
                    <p style={{ color: "var(--color-primary)" }}>gxsoft.co.kr</p>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setInsertNew((v) => !v)}
                    className="flex h-4 w-4 items-center justify-center rounded-[5px]"
                    style={{
                      backgroundColor: insertNew ? "var(--color-primary)" : "transparent",
                      border: insertNew ? "none" : "1px solid var(--border-app)",
                    }}
                  >
                    {insertNew && <Check size={10} strokeWidth={3} className="text-white" />}
                  </button>
                  새 메일에 삽입
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setInsertReply((v) => !v)}
                    className="flex h-4 w-4 items-center justify-center rounded-[5px]"
                    style={{
                      backgroundColor: insertReply ? "var(--color-primary)" : "transparent",
                      border: insertReply ? "none" : "1px solid var(--border-app)",
                    }}
                  >
                    {insertReply && <Check size={10} strokeWidth={3} className="text-white" />}
                  </button>
                  답장 · 전달에 삽입
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {creatingRule && (
        <Modal onClose={() => setCreatingRule(false)} maxWidth={400}>
          <div className="flex items-center gap-2.5 border-b border-(--border-app) px-4 py-3.5">
            <p className="flex-1 text-sm font-bold">규칙 만들기</p>
            <button
              type="button"
              onClick={() => setCreatingRule(false)}
              className="flex h-[26px] w-[26px] items-center justify-center rounded-lg text-[13px] text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2.5 px-4 py-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-(--text-muted)">규칙 이름</span>
              <input
                type="text"
                autoFocus
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateRule();
                }}
                placeholder="예: 청구서 자동 라벨"
                className="h-9 rounded-[9px] border border-(--border-app) px-3 text-[13px] outline-none focus:border-(--color-primary)"
              />
            </label>
          </div>
          <div className="flex items-center gap-2 border-t border-(--border-app) bg-(--surface-muted) px-4 py-3">
            <span className="text-[11px] text-(--text-muted)">⌘↵ 저장</span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setCreatingRule(false)}
                className="h-[34px] rounded-[9px] border border-(--border-app) px-3.5 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCreateRule}
                disabled={!newRuleName.trim()}
                className="h-[34px] rounded-[9px] px-3.5 text-xs font-semibold text-white transition disabled:opacity-40"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                만들기
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showApplied && (
        <ConfirmDialog
          tone="alert"
          title="규칙이 적용됐습니다"
          description="기존 메일 38통에 소급 적용 완료"
          confirmLabel="확인"
          onCancel={() => setShowApplied(false)}
          onConfirm={() => setShowApplied(false)}
        />
      )}
    </div>
  );
}
