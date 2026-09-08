"use client";

// Full-width strip banner for app-wide notices (maintenance, offline mode,
// acting-as-delegate). Distinct from InlineBanner, which is scoped to a
// single card/section rather than the whole page.
export type GlobalBannerTone = "maintenance" | "offline" | "delegate";

const TONE_STYLE: Record<GlobalBannerTone, { wrap: string; dot: string; text: string; action: string }> = {
  maintenance: { wrap: "bg-[#17181B]", dot: "bg-[#E8B84B]", text: "text-[#F7F7F5]", action: "text-[#B9C6FA]" },
  offline: { wrap: "bg-[#FBEAE8]", dot: "bg-[#C0433B]", text: "text-[#7A2A24]", action: "text-[#A6362F]" },
  delegate: { wrap: "bg-[#ECEFFE]", dot: "bg-[#2B4BF2]", text: "text-[#1B36C4]", action: "text-[#1B36C4]" },
};

export function GlobalBanner({
  tone,
  message,
  actionLabel,
  onAction,
  onDismiss,
}: {
  tone: GlobalBannerTone;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) {
  const s = TONE_STYLE[tone];
  return (
    <div
      role={tone === "offline" ? "alert" : "status"}
      aria-live={tone === "offline" ? "assertive" : "polite"}
      className={`flex min-h-10 items-center gap-2.5 px-4 py-2 ${s.wrap}`}
    >
      <span className={`h-1.75 w-1.75 shrink-0 rounded-full ${s.dot}`} />
      <p className={`min-w-0 flex-1 truncate text-[12px] ${s.text}`}>{message}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={`shrink-0 text-[11.5px] font-semibold hover:underline ${s.action}`}
        >
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`shrink-0 text-[11px] opacity-70 hover:opacity-100 ${s.text}`}
          aria-label="닫기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
