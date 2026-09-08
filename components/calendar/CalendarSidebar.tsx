"use client";

import { Check, Mail } from "lucide-react";
import { CALENDAR_LIST, MEETING_ROOMS } from "@/lib/mock-calendar";
import type { CalendarCategory } from "@/types/calendar";
import { AI_DETECTED_EVENT } from "@/lib/mock-calendar";

// Desktop calendar sidebar: an "AI detected event" suggestion banner,
// per-calendar visibility checkboxes, and today's meeting room availability.
const ROOM_STATUS_STYLE: Record<
  (typeof MEETING_ROOMS)[number]["status"],
  string
> = {
  available: "bg-(--status-success-bg) text-(--status-success)",
  busy: "bg-(--status-danger-bg) text-(--status-danger)",
  reserved: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

export function CalendarSidebar({
  visibleCategories,
  onToggleCategory,
  aiBannerDismissed,
  onDismissAiBanner,
  onAddAiEvent,
}: {
  visibleCategories: Set<CalendarCategory>;
  onToggleCategory: (key: CalendarCategory) => void;
  aiBannerDismissed: boolean;
  onDismissAiBanner: () => void;
  onAddAiEvent: () => void;
}) {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto bg-(--surface-muted) p-5">
      {!aiBannerDismissed && (
        <div className="rounded-[11px] border border-(--border-app) bg-(--surface-app) p-3.5">
          <div className="flex items-center gap-2">
            <span
              className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <Mail size={11} />
            </span>
            <span className="text-xs font-bold">메일에서 감지된 일정</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-(--text-muted)">
            &apos;{AI_DETECTED_EVENT.title}&apos; — {AI_DETECTED_EVENT.personName}
            님 메일에서 일정을 찾았습니다.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onAddAiEvent}
              className="h-8 flex-1 rounded-[8px] text-xs font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              캘린더에 추가
            </button>
            <button
              type="button"
              onClick={onDismissAiBanner}
              className="h-8 rounded-[8px] border border-(--border-app) bg-(--surface-app) px-3 text-xs text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
            >
              무시
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.04em] text-(--text-muted)">
          내 캘린더
        </p>
        <div className="flex flex-col gap-2">
          {CALENDAR_LIST.map((cal) => {
            const checked = visibleCategories.has(cal.key);
            return (
              <button
                key={cal.key}
                type="button"
                onClick={() => onToggleCategory(cal.key)}
                className="flex items-center gap-2.5 text-left text-xs text-(--text-app)"
              >
                <span
                  className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px]"
                  style={{
                    backgroundColor: checked ? cal.color : "transparent",
                    border: checked ? "none" : "1px solid var(--border-app)",
                  }}
                >
                  {checked && (
                    <Check size={9} strokeWidth={3} className="text-white" />
                  )}
                </span>
                {cal.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-[11px] border border-(--border-app) bg-(--surface-app) p-3.5">
        <p className="mb-2 text-xs font-bold">회의실 예약 현황 · 오늘</p>
        <div className="flex flex-col gap-2.5 overflow-y-auto">
          {MEETING_ROOMS.map((room) => (
            <div key={room.name} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">
                  {room.name} · {room.capacity}인
                </p>
                <p className="truncate text-[10px] text-(--text-muted)">
                  {room.amenity}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${ROOM_STATUS_STYLE[room.status]}`}
              >
                {room.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
