"use client";

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { InlineBanner } from "@/components/banner/InlineBanner";
import { useToast } from "@/context/toast-context";
import {
  QUARANTINE_DETAIL_CHECKS,
  QUARANTINE_MAILS,
  QUARANTINE_TABS,
  type QuarantineKind,
} from "@/lib/mock-quarantine";

// Spam/phishing/malware quarantine inbox: a filterable list plus a detail
// view showing why a message was held and a release/allow-sender/delete
// action bar.

const KIND_STYLE: Record<QuarantineKind, string> = {
  피싱: "bg-[#EDEBF7] text-[#6B5CA8]",
  스팸: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
  멀웨어: "bg-[#FBEAE8] text-[#C0433B]",
};

function scoreStyle(score: number) {
  if (score >= 90) return "bg-[#FBEAE8] text-[#C0433B]";
  if (score >= 50) return "bg-[#FDF0E4] text-[#B4740F]";
  return "bg-[#E9F3EC] text-[#2E8B5B]";
}

const CHECK_ICON_STYLE = {
  fail: "text-[#C0433B]",
  warn: "text-[#B4740F]",
  pass: "text-[#2E8B5B]",
};

export default function QuarantinePage() {
  const toast = useToast();
  const [tab, setTab] = useState<(typeof QUARANTINE_TABS)[number]>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(QUARANTINE_MAILS[0]?.id ?? null);
  const [mails, setMails] = useState(QUARANTINE_MAILS);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const filtered = mails.filter((m) => tab === "전체" || m.kind === tab);
  const selected = mails.find((m) => m.id === selectedId) ?? null;

  const releaseSelected = () => {
    if (!selected) return;
    setMails((prev) => prev.filter((m) => m.id !== selected.id));
    setSelectedId(null);
    toast.success("받은편지함으로 이동했습니다", { sub: selected.subject });
  };

  const requestAllowSender = () => {
    if (!selected) return;
    toast.info("발신자 허용 요청을 보냈습니다", { sub: "보안팀 승인 후 적용됩니다" });
  };

  const removeSelected = () => {
    if (!selected) return;
    setMails((prev) => prev.filter((m) => m.id !== selected.id));
    setSelectedId(null);
    setConfirmingDelete(false);
    toast.success("메일이 영구 삭제되었습니다");
  };

  return (
    <WorkspaceLayout
      title={<span className="flex items-center gap-2">격리함 <span className="rounded-full bg-[#FDF0E4] px-2 py-0.5 text-[11px] font-bold text-[#B4740F]">{mails.length}건</span></span>}
      headerActions={<span className="hidden text-[11px] font-normal text-(--text-muted) sm:inline">14일 후 자동 삭제</span>}
      showGlobalSearch={false}
      className="flex flex-col lg:flex-row"
    >
      <div className="flex min-h-0 w-full flex-col border-r border-(--border-app) lg:w-[420px]">
        <div className="flex shrink-0 gap-1.5 border-b border-(--border-app) px-4 py-2.5">
          {QUARANTINE_TABS.map((t) => (
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
              {t} {t === "전체" ? mails.length : mails.filter((m) => m.kind === t).length}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((m) => {
            const isActive = m.id === selectedId;
            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(m.id)}
                className="cursor-pointer border-b border-(--border-app) px-4 py-3"
                style={{
                  borderLeft: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                  backgroundColor: isActive ? "rgba(43,75,242,.05)" : "transparent",
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${KIND_STYLE[m.kind]}`}>
                    {m.kind}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-(--text-muted)">{m.from}</span>
                  <span className="shrink-0 text-[11px] text-(--text-muted)">{m.time}</span>
                </div>
                <p className="truncate text-[13px] font-bold">{m.subject}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="truncate text-[11px] text-(--text-muted)">{m.reason}</span>
                  <span className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${scoreStyle(m.score)}`}>
                    {m.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 flex-col bg-(--surface-muted) lg:flex">
        {!selected ? (
          <p className="m-auto text-sm text-(--text-muted)">메일을 선택하세요.</p>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) bg-(--surface-app) px-6 py-3.5">
              <button
                type="button"
                onClick={releaseSelected}
                className="h-8 rounded-lg px-3 text-xs font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                받은편지함으로 이동
              </button>
              <button
                type="button"
                onClick={requestAllowSender}
                className="h-8 rounded-lg border border-(--border-app) px-3 text-xs font-semibold"
              >
                발신자 허용 요청
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="h-8 rounded-lg border border-[#E8CBC8] px-3 text-xs font-semibold text-[#C0433B]"
              >
                삭제
              </button>
              <span className="ml-auto hidden text-[11px] text-(--text-muted) md:inline">
                해제는 보안팀 승인 후 적용됩니다
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h1 className="text-lg font-bold">{selected.subject}</h1>
              <p className="mt-1 text-xs text-(--text-muted)">
                {selected.from} · 오늘 {selected.time} · 수신 인사팀 14명
              </p>
              <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${scoreStyle(selected.score)}`}>
                {selected.kind} · 위험 {selected.score}
              </span>

              <div className="mt-3">
                <InlineBanner
                  tone="danger"
                  title="발신 도메인이 사내 도메인을 모방하고 있습니다"
                  body="gxsoft.co.kr을 모방한 gxsoft-kr.net에서 발송되었습니다. 본문 링크는 외부 로그인 페이지로 연결됩니다. 열지 말고 삭제를 권장합니다."
                  actionLabel="발신 도메인 조회"
                  onAction={() => toast.info("발신 도메인 조회 결과", { sub: "gxsoft-kr.net · 등록 3일 전 · 평판 위험" })}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                  <p className="mb-2.5 text-[13px] font-bold">판정 근거</p>
                  <div className="flex flex-col gap-2.5">
                    {QUARANTINE_DETAIL_CHECKS.map((c) => (
                      <div key={c.name} className="flex items-start gap-2">
                        {c.ok === "pass" ? (
                          <Check size={14} className={`mt-0.5 shrink-0 ${CHECK_ICON_STYLE[c.ok]}`} />
                        ) : c.ok === "warn" ? (
                          <AlertTriangle size={14} className={`mt-0.5 shrink-0 ${CHECK_ICON_STYLE[c.ok]}`} />
                        ) : (
                          <X size={14} className={`mt-0.5 shrink-0 ${CHECK_ICON_STYLE[c.ok]}`} />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold">{c.name}</p>
                          <p className="text-[11px] text-(--text-muted)">{c.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-(--border-app) bg-(--surface-app) p-4">
                  <p className="mb-2.5 text-[13px] font-bold">안전 미리보기 (텍스트 전용)</p>
                  <p className="text-xs leading-relaxed text-(--text-muted)">
                    안녕하세요, 인사팀입니다. 연봉계약서 서명 기한이 임박했습니다. 아래 링크에서 본인 확인 후
                    서명해 주세요.
                  </p>
                  <p className="mt-2 truncate text-xs text-[#C0433B] line-through">
                    https://gxsoft-kr.net/sign/verify?id=8f2a
                  </p>
                  <p className="mt-1 text-[11px] text-(--text-muted)">링크 1개가 차단되었습니다.</p>
                  <div className="mt-3 rounded-lg bg-(--color-primary)/[.06] p-2.5 text-[11px] text-(--text-muted)">
                    <strong className="text-(--text-app)">AI</strong> 인사팀 실제 공지는 사내 결재
                    시스템으로만 발송됩니다.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {confirmingDelete && selected && (
        <ConfirmDialog
          tone="destructive"
          title="메일을 영구 삭제할까요?"
          description={`"${selected.subject}" 메일을 삭제하면 되돌릴 수 없습니다.`}
          confirmLabel="영구 삭제"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={removeSelected}
        />
      )}
    </WorkspaceLayout>
  );
}
