"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { NOTIFICATIONS } from "@/lib/mock-notifications";

const TABS = ["전체", "결재", "멘션"] as const;
type Tab = (typeof TABS)[number];

// Bell-icon dropdown in the top bar. Its own local copy of NOTIFICATIONS
// (so "mark all read" doesn't need to reach into a shared store) means the
// unread state resets whenever this popover unmounts and remounts.
export function NotificationPopover({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [tab, setTab] = useState<Tab>("전체");

  const filtered = items.filter((n) => tab === "전체" || n.kind === tab);
  const unreadCount = items.filter((n) => n.unread).length;
  const countFor = (t: Tab) => (t === "전체" ? items.length : items.filter((n) => n.kind === t).length);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-2 flex w-[340px] flex-col overflow-hidden rounded-(--radius-app) border border-(--border-app) bg-(--surface-app) shadow-[0_16px_34px_-18px_rgba(20,22,30,.34)]">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-(--border-app) px-3.5 py-3">
          <p className="text-[13.5px] font-bold">알림</p>
          {unreadCount > 0 && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {unreadCount}
            </span>
          )}
          <button
            type="button"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
            className="ml-auto text-[11.5px] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            모두 읽음
          </button>
        </div>

        <div className="flex shrink-0 gap-1.5 border-b border-(--border-app) px-3.5 py-2.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-[26px] rounded-full px-2.5 text-[11.5px] font-semibold transition ${
                tab === t
                  ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                  : "bg-black/5 text-(--text-muted) dark:bg-white/10"
              }`}
            >
              {t} {countFor(t)}
            </button>
          ))}
        </div>

        <div className="max-h-[340px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-[12.5px] text-(--text-muted)">알림이 없습니다.</p>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2.5 border-b border-(--border-app) px-3.5 py-2.5 last:border-b-0 hover:bg-black/[.02] dark:hover:bg-white/[.03]"
              >
                <span
                  className="mt-1 h-[6px] w-[6px] shrink-0 rounded-full"
                  style={{ backgroundColor: n.unread ? "var(--color-primary)" : "transparent" }}
                />
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                  style={{ backgroundColor: n.avatarBg, color: n.avatarFg }}
                >
                  {n.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold">{n.title}</p>
                  <p className="truncate text-[11.5px] text-(--text-muted)">{n.body}</p>
                </div>
                <span className="shrink-0 text-[10.5px] text-[#9A9EA5]">{n.time}</span>
              </div>
            ))
          )}
        </div>

        <Link
          href="/approvals"
          onClick={onClose}
          className="shrink-0 border-t border-(--border-app) py-2.5 text-center text-[11.5px] font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          알림 센터 열기
        </Link>
      </div>
    </>
  );
}
