"use client";

import { useState } from "react";
import { ModuleRail } from "@/components/layout/ModuleRail";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { useToast } from "@/context/toast-context";
import {
  APPROVALS,
  APPROVAL_CHAIN,
  APPROVAL_COMMENTS,
  APPROVAL_LINE_ITEMS,
  APPROVAL_TABS,
  TYPE_STYLE,
} from "@/lib/mock-approvals";

// Approvals (결재) inbox: a tabbed list of approval requests, a detail view
// with the approval chain and line items, and a comment thread.
type PendingAction = "approve" | "reject" | null;

const CHAIN_STATE_STYLE = {
  완료: { bg: "#2E8B5B", fg: "#fff" },
  대기: { bg: "#fff", fg: "var(--color-primary)" },
  예정: { bg: "var(--surface-muted)", fg: "var(--text-muted)" },
};

export default function ApprovalsPage() {
  const toast = useToast();
  const [tab, setTab] = useState<(typeof APPROVAL_TABS)[number]>("내 차례");
  const [selectedId, setSelectedId] = useState(APPROVALS[0]?.id ?? null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [comments, setComments] = useState(APPROVAL_COMMENTS);
  const [commentDraft, setCommentDraft] = useState("");
  const selected = APPROVALS.find((a) => a.id === selectedId) ?? null;

  const postComment = () => {
    const text = commentDraft.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      { initials: "나", name: "한지우", time: "방금", body: text },
    ]);
    setCommentDraft("");
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-(--surface-app) lg:flex-row">
      <div className="hidden lg:block">
        <ModuleRail />
      </div>

      <div className="flex min-h-0 w-full flex-col border-r border-(--border-app) lg:w-[400px]">
        <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) px-4 py-3.5">
          <p className="text-base font-bold">결재 · 승인</p>
          <span className="rounded-full bg-[#FDF0E4] px-2 py-0.5 text-[11px] font-bold text-[#B4740F]">
            내 차례 4건
          </span>
        </div>
        <div className="flex shrink-0 gap-1.5 border-b border-(--border-app) px-4 py-2.5">
          {APPROVAL_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
                tab === t
                  ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                  : "bg-black/5 text-(--text-muted) dark:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {APPROVALS.map((a) => {
            const isActive = a.id === selectedId;
            return (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(a.id)}
                className="cursor-pointer border-b border-(--border-app) px-4 py-3"
                style={{
                  backgroundColor: isActive ? "rgba(43,75,242,.05)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${TYPE_STYLE[a.type]}`}>
                    {a.type}
                  </span>
                  <span className="text-[10.5px] text-(--text-muted)">{a.no}</span>
                  <span className="ml-auto shrink-0 text-[11px] font-semibold text-(--text-muted)">
                    {a.due}
                  </span>
                </div>
                <p className="line-clamp-2 text-[13px] font-semibold">{a.title}</p>
                <p className="mt-1 text-[11px] text-(--text-muted)">
                  {a.author} · {a.amount}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <BottomTabBar />

      <div className="hidden min-w-0 flex-1 flex-col bg-(--surface-muted) lg:flex">
        {!selected ? (
          <p className="m-auto text-sm text-(--text-muted)">결재 문서를 선택하세요.</p>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) bg-(--surface-app) px-6 py-3.5">
              <button
                type="button"
                onClick={() => setPendingAction("approve")}
                className="h-8 rounded-lg px-3 text-xs font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                승인
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("reject")}
                className="h-8 rounded-lg border border-[#E8CBC8] px-3 text-xs font-semibold text-[#C0433B]"
              >
                반려
              </button>
              <button
                type="button"
                onClick={() => toast.info("보류 · 의견 요청을 보냈습니다", { sub: selected?.title })}
                className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
              >
                보류 · 의견 요청
              </button>
              <span className="ml-auto hidden text-[11px] text-(--text-muted) md:inline">
                문서번호 {selected.no} · 보존 5년
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-snug">{selected.title}</h1>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    기안 {selected.author} (기술본부 CTO) · 2026-09-01 17:22 · 메일 스레드 연동
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-(--text-muted)">요청 금액</p>
                  <p className="text-xl font-bold">{selected.amount}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                <p className="mb-3 text-[13px] font-bold">결재선</p>
                <div className="flex items-center">
                  {APPROVAL_CHAIN.map((node, i) => (
                    <div key={node.name} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: CHAIN_STATE_STYLE[node.state].bg,
                            color: CHAIN_STATE_STYLE[node.state].fg,
                            border: node.state === "예정" ? "1px solid var(--border-app)" : undefined,
                            boxShadow: node.isNow ? "0 0 0 4px #ECEFFE" : undefined,
                          }}
                        >
                          {node.initials}
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold">{node.name}</p>
                          <p className="text-[10px] text-(--text-muted)">{node.role}</p>
                          <p className="text-[10px] text-(--text-muted)">{node.detail}</p>
                        </div>
                      </div>
                      {i < APPROVAL_CHAIN.length - 1 && (
                        <span
                          className="mx-1 mt-[-24px] h-[2px] flex-1 rounded-full"
                          style={{ backgroundColor: node.state === "완료" ? "#2E8B5B" : "var(--border-app)" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                  <p className="mb-2.5 text-[13px] font-bold">요청 내역</p>
                  <div className="flex flex-col gap-2">
                    {APPROVAL_LINE_ITEMS.map((it) => (
                      <div key={it.name} className="flex items-center justify-between text-xs">
                        <span className="text-(--text-muted)">{it.name}</span>
                        <span className="font-semibold">{it.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-(--color-primary)/[.06] p-2.5 text-[11px] text-(--text-muted)">
                    <strong className="text-(--text-app)">AI</strong> 유사 기안 3건과 비교해 단가가 평균 대비
                    8% 낮습니다. 재무팀 이연 의견이 반영된 최신본입니다.
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                  <p className="mb-2.5 text-[13px] font-bold">의견 · 이력</p>
                  <div className="flex flex-col gap-3">
                    {comments.map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 text-[10px] font-bold dark:bg-white/10">
                          {c.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold">
                            {c.name} <span className="font-normal text-(--text-muted)">{c.time}</span>
                          </p>
                          <p className="text-xs text-(--text-muted)">{c.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        postComment();
                      }
                    }}
                    placeholder="의견을 남기세요… (Enter로 등록)"
                    className="mt-3 h-9 w-full rounded-lg border border-(--border-app) px-3 text-xs outline-none focus:border-(--color-primary)"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {pendingAction && selected && (
        <ConfirmDialog
          tone={pendingAction === "reject" ? "warning" : "default"}
          title={pendingAction === "approve" ? "이 결재를 승인할까요?" : "이 결재를 반려할까요?"}
          description={
            pendingAction === "approve"
              ? `${selected.title} · ${selected.amount}`
              : "반려 사유는 의견 · 이력에 함께 기록됩니다."
          }
          confirmLabel={pendingAction === "approve" ? "승인" : "반려"}
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            setPendingAction(null);
            toast.success(pendingAction === "approve" ? "결재를 승인했습니다" : "결재를 반려했습니다", {
              sub: selected.title,
            });
          }}
        />
      )}
    </div>
  );
}
