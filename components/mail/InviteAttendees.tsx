"use client";

import { useToast } from "@/context/toast-context";
import type { MeetingInvite } from "@/types/mail";

// Sidebar shown next to a meeting-invite email: attendee response tally,
// per-person status, and an AI-generated meeting briefing.
const STATE_STYLE: Record<string, { bg: string; fg: string }> = {
  참석: { bg: "var(--status-success-bg)", fg: "var(--status-success)" },
  미정: { bg: "var(--status-warning-bg)", fg: "var(--status-warning)" },
  불참: { bg: "var(--status-danger-bg)", fg: "var(--status-danger)" },
  "응답 없음": { bg: "rgba(0,0,0,.06)", fg: "var(--text-muted)" },
};

export function InviteAttendees({ invite }: { invite: MeetingInvite }) {
  const toast = useToast();
  const tally = {
    참석: invite.attendees.filter((a) => a.state === "참석").length,
    미정: invite.attendees.filter((a) => a.state === "미정").length,
    불참: invite.attendees.filter((a) => a.state === "불참").length,
  };
  const responded = invite.attendees.length - invite.attendees.filter((a) => a.state === "응답 없음").length;

  return (
    <aside className="hidden w-75 shrink-0 flex-col gap-4 overflow-y-auto border-l border-(--border-app) bg-[#FCFCFB] p-4 lg:flex">
      <div>
        <p className="text-xs font-bold">참석 현황</p>
        <p className="mt-0.5 text-[11px] text-(--text-muted)">
          {invite.attendees.length}명 중 {responded}명 응답
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
          {(["참석", "미정", "불참"] as const).map((k) => (
            <div key={k} className="rounded-lg py-2" style={{ backgroundColor: STATE_STYLE[k].bg }}>
              <p className="text-sm font-bold" style={{ color: STATE_STYLE[k].fg }}>
                {tally[k]}
              </p>
              <p className="text-[10px] text-(--text-muted)">{k}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {invite.attendees.map((a) => (
          <div key={a.name} className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-[10px] font-bold dark:bg-white/10">
              {a.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-[11.5px] font-semibold">{a.name}</p>
                {a.isHost && (
                  <span className="shrink-0 rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-bold text-(--text-muted) dark:bg-white/10">
                    주최
                  </span>
                )}
              </div>
              <p className="truncate text-[10.5px] text-(--text-muted)">{a.team}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: STATE_STYLE[a.state].bg, color: STATE_STYLE[a.state].fg }}
            >
              {a.state}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-(--border-app) bg-background p-3">
        <p className="text-xs font-bold">AI 브리핑</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-(--text-muted)">
          지난 스프린트 리뷰에서 논의된 GPU 노드 증설 건의 최종 검토가 이번 회의 안건에 포함되어 있습니다.
        </p>
        <button
          type="button"
          onClick={() => toast.info("관련 메일 검색 결과로 이동합니다", { sub: "GPU 노드 증설" })}
          className="mt-2 text-[11px] font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          관련 메일 3건 보기
        </button>
      </div>
    </aside>
  );
}
