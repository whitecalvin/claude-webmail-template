"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent, type KeyboardEvent } from "react";
import { Clock, Maximize2, Minimize2, Paperclip, Trash2, Upload, X } from "lucide-react";
import { useMail } from "@/context/mail-context";
import { useToast } from "@/context/toast-context";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { InlineBanner } from "@/components/banner/InlineBanner";
import { ComposeEditor } from "@/components/compose/ComposeEditor";
import type { ComposeDraft } from "@/types/mail";

// The compose window: recipient chips, cc/bcc, an AI "rewrite tone" banner,
// drag-and-drop attachments, and a send/schedule split button. All of it is
// mocked — "sending" just appends to the in-memory Sent folder (see
// context/mail-context.tsx's sendEmail), and the AI/schedule features are
// non-functional demos of the UI only.
const INTERNAL_DOMAIN = "@gxsoft.co.kr";
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024 * 1024;
const LARGE_FILE_LINK_THRESHOLD = 25 * 1024 * 1024;
const TONE_OPTIONS = [
  { key: "polite", label: "정중하게" },
  { key: "concise", label: "간결하게" },
  { key: "english", label: "영문으로" },
] as const;
type ToneKey = (typeof TONE_OPTIONS)[number]["key"];

interface Recipient {
  id: string;
  label: string;
  initials: string;
  bg: string;
  fg: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  ext: string;
}

const RECIPIENT_PALETTE = [
  { bg: "#E4EAFE", fg: "#2B4BF2" },
  { bg: "#E9F3EC", fg: "#2E8B5B" },
  { bg: "#EDEBF7", fg: "#6B5CA8" },
  { bg: "#FDF0E4", fg: "#B4740F" },
  { bg: "#E8F1F5", fg: "#3B7A94" },
  { bg: "#FBEAE8", fg: "#C0433B" },
];

const EXT_STYLE: Record<string, { bg: string; fg: string }> = {
  pdf: { bg: "#FBEAE8", fg: "#C0433B" },
  doc: { bg: "#E9EEFC", fg: "#2B4BF2" },
  docx: { bg: "#E9EEFC", fg: "#2B4BF2" },
  xls: { bg: "#E9F3EC", fg: "#2E8B5B" },
  xlsx: { bg: "#E9F3EC", fg: "#2E8B5B" },
  ppt: { bg: "#FDF0E4", fg: "#B4740F" },
  pptx: { bg: "#FDF0E4", fg: "#B4740F" },
  zip: { bg: "#EDEBF7", fg: "#6B5CA8" },
  png: { bg: "#E8F1F5", fg: "#3B7A94" },
  jpg: { bg: "#E8F1F5", fg: "#3B7A94" },
  jpeg: { bg: "#E8F1F5", fg: "#3B7A94" },
};
const DEFAULT_EXT_STYLE = { bg: "#F0F0EC", fg: "#5C6068" };

// Deterministic hash so the same recipient always gets the same chip color
// across renders/sessions, without storing a color per contact anywhere.
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function parseRecipients(raw: string): Recipient[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => {
      const palette = RECIPIENT_PALETTE[hashString(label) % RECIPIENT_PALETTE.length];
      const namePart = label.split("@")[0];
      const initials = namePart.slice(0, 2);
      return {
        id: `rcpt-${label}-${Math.random().toString(36).slice(2, 6)}`,
        label,
        initials,
        bg: palette.bg,
        fg: palette.fg,
      };
    });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toAttachments(files: FileList | File[]): Attachment[] {
  return Array.from(files).map((f) => ({
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: f.name,
    size: f.size,
    ext: f.name.split(".").pop()?.toLowerCase() ?? "",
  }));
}

function ComposeForm({
  initial,
  onClose,
}: {
  initial: ComposeDraft;
  onClose: () => void;
}) {
  const { sendEmail } = useMail();
  const toast = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>(() => parseRecipients(initial.to));
  const [recipientInput, setRecipientInput] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(Boolean(initial.cc || initial.bcc));
  const [cc, setCc] = useState(initial.cc ?? "");
  const [bcc, setBcc] = useState(initial.bcc ?? "");
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [tone, setTone] = useState<ToneKey | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recipientInputRef = useRef<HTMLInputElement>(null);
  const ccInputRef = useRef<HTMLInputElement>(null);

  const hasContent =
    recipients.length > 0 ||
    subject.trim() ||
    body.trim() ||
    attachments.length > 0 ||
    recipientInput.trim() ||
    cc.trim() ||
    bcc.trim();
  const ccAddrs = cc
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const bccAddrs = bcc
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  // Drives the "N external recipients" warning banner — anyone whose address
  // isn't on the internal domain, across To/Cc/Bcc combined.
  const externalCount =
    recipients.filter((r) => !r.label.toLowerCase().endsWith(INTERNAL_DOMAIN)).length +
    [...ccAddrs, ...bccAddrs].filter((a) => !a.toLowerCase().endsWith(INTERNAL_DOMAIN)).length;

  const commitRecipientInput = () => {
    const val = recipientInput.trim();
    if (!val) return;
    setRecipients((prev) => [...prev, ...parseRecipients(val)]);
    setRecipientInput("");
  };

  const handleRecipientKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitRecipientInput();
    } else if (e.key === "Backspace" && !recipientInput && recipients.length > 0) {
      setRecipients((prev) => prev.slice(0, -1));
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    const tooBig = incoming.filter((f) => f.size > MAX_ATTACHMENT_BYTES);
    const accepted = incoming.filter((f) => f.size <= MAX_ATTACHMENT_BYTES);
    if (accepted.length > 0) {
      setAttachments((prev) => [...prev, ...toAttachments(accepted)]);
      const large = accepted.filter((f) => f.size > LARGE_FILE_LINK_THRESHOLD);
      if (large.length > 0) {
        toast.info("대용량 파일은 링크로 자동 전환됩니다", { sub: large.map((f) => f.name).join(", ") });
      }
    }
    if (tooBig.length > 0) {
      toast.error("최대 2GB를 초과하는 파일은 첨부할 수 없습니다", { sub: tooBig.map((f) => f.name).join(", ") });
    }
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    commitRecipientInput();
    const toStr = recipients.map((r) => r.label).join(", ") || recipientInput.trim();
    const attachmentNote =
      attachments.length > 0 ? `\n\n첨부파일 ${attachments.length}개: ${attachments.map((a) => a.name).join(", ")}` : "";
    sendEmail({ to: toStr, cc, bcc, subject, body: body + attachmentNote });
    const sub = [
      attachments.length > 0 ? `첨부 ${attachments.length}개` : null,
      bccAddrs.length > 0 ? `숨은참조 ${bccAddrs.length}명 포함` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    toast.success("메일을 보냈습니다", sub ? { sub } : undefined);
  };

  const handleClose = () => {
    if (hasContent) {
      setConfirmingDiscard(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !scheduleOpen) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleOpen, hasContent]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <form
        onSubmit={handleSend}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-full w-full flex-col overflow-hidden bg-background shadow-2xl transition-all sm:h-[min(88vh,760px)] sm:max-h-none sm:max-w-[calc(100vw-2rem)] sm:rounded-[14px] sm:border sm:border-(--border-app) ${
          expanded ? "sm:w-260" : "sm:w-190"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2.5 border-b border-(--border-app) px-4 py-3">
          <span className="text-sm font-bold tracking-tight">새 메일</span>
          <span className="rounded-full bg-(--surface-muted) px-2 py-0.5 text-[11px] text-(--text-muted)">
            임시저장 · 방금
          </span>
          <div className="ml-auto flex items-center gap-1 text-(--text-muted)">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="hidden rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10 sm:block"
              aria-label={expanded ? "축소" : "확대"}
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="닫기"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col px-4">
            <div className="flex items-start gap-3 border-b border-(--border-app) py-2.5">
              <span className="mt-1.5 shrink-0 text-xs font-semibold text-(--text-muted)">받는 사람</span>
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {recipients.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRecipients((prev) => prev.filter((x) => x.id !== r.id))}
                    className="group flex items-center gap-1.5 rounded-full bg-(--surface-muted) py-1 pl-1 pr-2.5 text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
                    title="제거"
                  >
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ backgroundColor: r.bg, color: r.fg }}
                    >
                      {r.initials}
                    </span>
                    {r.label}
                    <X size={10} className="text-(--text-muted) group-hover:text-(--status-danger)" />
                  </button>
                ))}
                <input
                  ref={recipientInputRef}
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={handleRecipientKeyDown}
                  onBlur={commitRecipientInput}
                  placeholder="이름 또는 이메일 입력…"
                  className="min-w-35 flex-1 bg-transparent text-xs outline-none placeholder:text-[#B0B4BA]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowCcBcc((v) => !v)}
                className="mt-1 shrink-0 text-[11.5px] font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                참조 · 숨은참조
                {ccAddrs.length + bccAddrs.length > 0 && ` (${ccAddrs.length + bccAddrs.length})`}
              </button>
            </div>

            {showCcBcc && (
              <>
                <div className="flex items-center gap-3 border-b border-(--border-app) py-2">
                  <span className="w-14 shrink-0 text-xs font-semibold text-(--text-muted)">참조</span>
                  <input
                    ref={ccInputRef}
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="참조 수신자"
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#B0B4BA]"
                  />
                </div>
                <div className="flex items-center gap-3 border-b border-(--border-app) py-2">
                  <span className="w-14 shrink-0 text-xs font-semibold text-(--text-muted)">숨은참조</span>
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="숨은참조 수신자"
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#B0B4BA]"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-3 py-2.5">
              <span className="w-14 shrink-0 text-xs font-semibold text-(--text-muted)">제목</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="제목을 입력하세요"
                className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-[#B0B4BA]"
              />
            </div>
          </div>

          <div className="mx-4 mb-1 flex flex-wrap items-center gap-3 rounded-xl border border-[#EBE4D6] bg-[#FBF9F4] px-4 py-3">
            <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-[#17181B] text-[9px] font-extrabold text-white">
              AI
            </span>
            <span className="text-xs text-(--text-muted)">톤을 선택하면 초안을 다시 씁니다.</span>
            <div className="ml-auto flex gap-1.5">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTone(t.key);
                    toast.info(`'${t.label}' 어조로 다시 쓰는 중입니다`);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    tone === t.key
                      ? "bg-[#17181B] text-white"
                      : "border border-[#E6DFD0] bg-white text-[#5C6068] hover:bg-black/2"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {externalCount > 0 && (
            <div className="px-4 pb-1">
              <InlineBanner
                tone="warning"
                title={`외부 수신자 ${externalCount}명이 포함돼 있습니다`}
                body="사내 정보는 외부로 발송되지 않도록 다시 확인해 주세요."
                actionLabel="수신자 확인"
                onAction={() => {
                  const toIsExternal = recipients.some((r) => !r.label.toLowerCase().endsWith(INTERNAL_DOMAIN));
                  if (toIsExternal) {
                    recipientInputRef.current?.focus();
                  } else {
                    setShowCcBcc(true);
                    requestAnimationFrame(() => ccInputRef.current?.focus());
                  }
                }}
              />
            </div>
          )}

          <ComposeEditor
            value={body}
            onChange={setBody}
            placeholder="내용을 입력하세요"
            onImageAttach={(file) => addFiles([file])}
          />

          <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row">
            {attachments.length > 0 && (
              <div className="flex flex-1 flex-col gap-1.5">
                {attachments.map((att) => {
                  const style = EXT_STYLE[att.ext] ?? DEFAULT_EXT_STYLE;
                  return (
                    <div
                      key={att.id}
                      className="flex items-center gap-2.5 rounded-[10px] border border-(--border-app) bg-background px-3 py-2"
                    >
                      <span
                        className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-[7px] text-[9px] font-extrabold uppercase"
                        style={{ backgroundColor: style.bg, color: style.fg }}
                      >
                        {att.ext.slice(0, 3) || "FILE"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">{att.name}</p>
                        <p className="text-[11px] text-(--text-muted)">
                          {formatBytes(att.size)} · 업로드 완료
                          {att.size > LARGE_FILE_LINK_THRESHOLD ? " · 대용량 링크" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="shrink-0 text-(--text-muted) hover:text-(--status-danger)"
                        aria-label="첨부파일 제거"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-[10px] border border-dashed px-3 py-2 transition sm:w-55 ${
                isDragging
                  ? "border-(--color-primary) bg-(--color-primary)/6"
                  : "border-(--border-app) bg-black/1.5 dark:bg-white/2"
              }`}
            >
              <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-[7px] bg-(--surface-muted) text-(--text-muted)">
                <Upload size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold">파일을 끌어다 놓으세요</p>
                <p className="text-[11px] leading-tight text-(--text-muted)">
                  25 MB 초과 시 대용량 링크로 자동 전환 · 최대 2 GB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-(--border-app) bg-(--surface-muted) px-3 py-2.5">
          <div className="relative flex items-center overflow-hidden rounded-[9px]" style={{ backgroundColor: "var(--color-primary)" }}>
            <button
              type="submit"
              className="px-4 py-2 text-[13px] font-semibold text-white transition hover:brightness-110"
            >
              보내기
            </button>
            <span className="h-4 w-px bg-white/30" />
            <button
              type="button"
              onClick={() => setScheduleOpen((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-medium text-white/90 transition hover:brightness-110"
            >
              <Clock size={12} />
              예약
            </button>
            {scheduleOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setScheduleOpen(false)} />
                <div className="absolute bottom-full left-0 z-50 mb-2 w-48 overflow-hidden rounded-[10px] border border-(--border-app) bg-background py-1 text-foreground shadow-xl">
                  {["오늘 18:00", "내일 09:00", "다음 주 월요일 09:00"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setScheduleOpen(false);
                        commitRecipientInput();
                        toast.success("예약 발송으로 등록되었습니다", { sub: opt });
                        onClose();
                      }}
                      className="block w-full px-3 py-2 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg p-1.5 text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="파일 첨부"
              title="파일 첨부"
            >
              <Paperclip size={15} />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[11px] text-(--text-muted) sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-(--status-success)" />
              발신 암호화 (TLS)
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-(--text-muted) hover:bg-black/5 hover:text-(--status-danger) dark:hover:bg-white/10"
              aria-label="삭제"
              title="삭제"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </form>

      {confirmingDiscard && (
        <ConfirmDialog
          tone="default"
          title="저장하지 않고 나갈까요?"
          description="작성 중인 메일은 임시보관함에 남습니다."
          cancelLabel="계속 작성"
          confirmLabel="임시 저장"
          onCancel={() => setConfirmingDiscard(false)}
          middleAction={{
            label: "저장 안 함",
            onClick: () => {
              setConfirmingDiscard(false);
              onClose();
            },
          }}
          onConfirm={() => {
            setConfirmingDiscard(false);
            toast.info("임시보관함에 저장되었습니다");
            onClose();
          }}
        />
      )}
    </div>
  );
}

export function ComposeModal() {
  const { composeDraft, composeSessionId, closeCompose } = useMail();

  if (!composeDraft) return null;

  // Keying on composeSessionId forces React to unmount/remount ComposeForm
  // (rather than diffing props) whenever openCompose() is called again, so
  // a fresh "reply" always starts from a clean form instead of merging into
  // whatever was left in a still-open compose window.
  return <ComposeForm key={composeSessionId} initial={composeDraft} onClose={closeCompose} />;
}
