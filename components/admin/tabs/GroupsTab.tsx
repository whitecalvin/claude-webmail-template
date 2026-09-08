"use client";

// Admin Console > Groups & Mailing Lists tab: distribution lists, security
// groups, and shared mailboxes, plus a moderation queue for gated sends.
import { useState } from "react";
import { Search } from "lucide-react";
import { GROUPS, MODERATION_QUEUE } from "@/lib/mock-admin";
import { AdminCard, Pill } from "../primitives";
import { useToast } from "@/context/toast-context";
import type { Tone } from "@/types/admin";

const TYPE_TONE: Record<string, Tone> = {
  "배포 리스트": "info",
  "보안 그룹": "violet",
  "공유 메일함": "success",
};

const EXT_TONE: Record<string, Tone> = { 허용: "success", 차단: "neutral" };
const MOD_TONE: Record<string, Tone> = { "조정 필수": "warning", 자동회신: "teal", 없음: "neutral" };

export function GroupsTab() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState(GROUPS);
  const [queue, setQueue] = useState(MODERATION_QUEUE);

  const filteredGroups = groups.filter((g) => {
    const q = query.trim().toLowerCase();
    return !q || g.addr.toLowerCase().includes(q) || g.name.toLowerCase().includes(q);
  });

  const createGroup = () => {
    setGroups((prev) => [
      { addr: "new-group@gxsoft.co.kr", name: "새 그룹", type: "배포 리스트", owner: "나", members: 1, ext: "차단", mod: "없음" },
      ...prev,
    ]);
    toast.success("그룹을 만들었습니다", { sub: "new-group@gxsoft.co.kr" });
  };

  const decideModeration = (subject: string, approve: boolean) => {
    setQueue((prev) => prev.filter((m) => m.subject !== subject));
    toast.success(approve ? "발송을 승인했습니다" : "발송을 거부했습니다", { sub: subject });
  };

  return (
    <div className="grid flex-1 grid-cols-[1fr_340px] gap-4 overflow-y-auto p-7">
      <AdminCard>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="그룹 주소 · 이름 검색"
              className="h-8 w-64 rounded-lg bg-black/4 pl-7 pr-2.5 text-xs outline-none dark:bg-white/6"
            />
          </div>
          <span className="ml-auto text-xs text-(--text-muted)">
            그룹 {groups.filter((g) => g.type !== "공유 메일함").length}개 · 메일링리스트 {groups.length}개
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-(--border-app)">
          <div className="grid grid-cols-[2fr_1.4fr_70px_1fr_100px] gap-2 border-b border-(--border-app) bg-black/2 px-3 py-2 text-[10.5px] font-bold uppercase tracking-[.03em] text-(--text-muted) dark:bg-white/3">
            <span>그룹 주소</span>
            <span>유형 · 소유자</span>
            <span>멤버</span>
            <span>외부 발신</span>
            <span>조정</span>
          </div>
          {filteredGroups.length === 0 && (
            <p className="p-6 text-center text-xs text-(--text-muted)">검색 결과가 없습니다.</p>
          )}
          {filteredGroups.map((g) => (
            <div
              key={g.addr}
              className="grid grid-cols-[2fr_1.4fr_70px_1fr_100px] items-center gap-2 border-b border-(--border-app) px-3 py-2.5 text-xs last:border-b-0 hover:bg-black/1.5 dark:hover:bg-white/2"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-[11px] font-semibold">{g.addr}</p>
                <p className="truncate text-[10.5px] text-(--text-muted)">{g.name}</p>
              </div>
              <div className="min-w-0">
                <Pill label={g.type} tone={TYPE_TONE[g.type]} />
                <p className="mt-0.5 truncate text-[10.5px] text-(--text-muted)">{g.owner}</p>
              </div>
              <span>{g.members.toLocaleString()}</span>
              <span>
                <Pill label={g.ext} tone={EXT_TONE[g.ext]} />
              </span>
              <span>
                <Pill label={g.mod} tone={MOD_TONE[g.mod] ?? "neutral"} />
              </span>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="flex flex-col gap-4">
        <AdminCard title="그룹 만들기">
          <div className="flex flex-col gap-2.5">
            {[
              { label: "그룹 주소", value: "new-group@gxsoft.co.kr" },
              { label: "유형", value: "배포 리스트" },
              { label: "멤버 추가", value: "이름 또는 이메일" },
              { label: "외부 발신", value: "차단" },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-(--text-muted)">{f.label}</span>
                <div className="flex h-9 items-center rounded-lg border border-(--border-app) px-2.5 text-xs text-(--text-muted)">
                  {f.value}
                </div>
              </label>
            ))}
            <button
              type="button"
              onClick={createGroup}
              className="mt-1 h-9 rounded-lg text-xs font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              그룹 생성
            </button>
          </div>
        </AdminCard>

        <AdminCard title="조정 대기">
          {queue.length === 0 ? (
            <p className="text-xs text-(--text-muted)">대기 중인 항목이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {queue.map((m) => (
                <div key={m.subject} className="rounded-lg border border-(--border-app) p-2.5">
                  <p className="truncate text-xs font-semibold">{m.subject}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-(--text-muted)">{m.meta}</p>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => decideModeration(m.subject, true)}
                      className="h-7 flex-1 rounded-md text-[11px] font-semibold text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      onClick={() => decideModeration(m.subject, false)}
                      className="h-7 flex-1 rounded-md border border-(--border-app) text-[11px] font-semibold"
                    >
                      거부
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
