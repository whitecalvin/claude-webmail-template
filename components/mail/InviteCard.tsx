"use client";

import { useState } from "react";
import { useToast } from "@/context/toast-context";
import type { MeetingInvite, RsvpChoice } from "@/types/mail";

// Calendar-invite summary shown inline when an email carries a
// MeetingInvite. RSVP state here is local to the card — accepting doesn't
// create a real calendar event.
const RSVP_OPTIONS: { key: RsvpChoice; label: string }[] = [
  { key: "accept", label: "참석" },
  { key: "tentative", label: "미정" },
  { key: "decline", label: "불참" },
];

const RSVP_STYLE: Record<RsvpChoice, { bg: string; fg: string }> = {
  accept: { bg: "var(--status-success)", fg: "#fff" },
  tentative: { bg: "var(--status-warning)", fg: "#fff" },
  decline: { bg: "var(--status-danger)", fg: "#fff" },
};

export function InviteCard({ invite }: { invite: MeetingInvite }) {
  const toast = useToast();
  const [rsvp, setRsvp] = useState<RsvpChoice | null>(null);

  const handleRsvp = (choice: RsvpChoice) => {
    setRsvp(choice);
    const label = RSVP_OPTIONS.find((o) => o.key === choice)?.label;
    toast.success(`'${label}'(으)로 응답했습니다`, { sub: invite.when });
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#C9D3FB] bg-[#F8FAFF] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex w-[64px] shrink-0 flex-col items-center rounded-xl bg-(--color-primary) py-2 text-white">
          <span className="text-[10px] font-bold uppercase">{invite.dateLabel.month}</span>
          <span className="text-xl font-bold leading-none">{invite.dateLabel.day}</span>
          <span className="text-[10px]">{invite.dateLabel.weekday}</span>
        </div>

        <div className="min-w-0 flex-1">
          <dl className="flex flex-col gap-1 text-xs">
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-(--text-muted)">일시</dt>
              <dd className="font-semibold">{invite.when}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-(--text-muted)">장소</dt>
              <dd>{invite.where}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-(--text-muted)">주최</dt>
              <dd>{invite.organizer}</dd>
            </div>
            {invite.recurrence && (
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-(--text-muted)">반복</dt>
                <dd>{invite.recurrence}</dd>
              </div>
            )}
          </dl>

          {invite.conflict && (
            <div className="mt-2.5 rounded-lg bg-[#FFF6E8] px-3 py-2 text-[11px] text-[#A9762A]">
              이 시간에 <strong>{invite.conflict}</strong>가 겹칩니다.{" "}
              <button
                type="button"
                onClick={() => toast.info("캘린더에서 일정을 확인합니다", { sub: invite.conflict })}
                className="font-semibold underline"
              >
                일정 보기
              </button>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold">참석하시겠습니까?</span>
            <div className="flex gap-1.5">
              {RSVP_OPTIONS.map((opt) => {
                const isActive = rsvp === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleRsvp(opt.key)}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition"
                    style={
                      isActive
                        ? { backgroundColor: RSVP_STYLE[opt.key].bg, color: RSVP_STYLE[opt.key].fg }
                        : { backgroundColor: "rgba(0,0,0,.04)", color: "var(--text-muted)" }
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => toast.info("다른 시간을 주최자에게 제안합니다", { sub: invite.organizer })}
              className="ml-auto text-[11px] font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              다른 시간 제안
            </button>
            <button
              type="button"
              onClick={() => toast.info("메모 작성 화면을 엽니다")}
              className="text-[11px] font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              메모 남기기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
