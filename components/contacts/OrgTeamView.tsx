"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Mail } from "lucide-react";
import { ORG_MEMBERS, ORG_TREE, PERSON_MAILS } from "@/lib/mock-contacts";
import { useToast } from "@/context/toast-context";

// Desktop org-chart drill-down: members of one team on the left, the
// selected person's profile/presence/recent-mail history on the right.
const PRESENCE_STYLE: Record<
  (typeof ORG_MEMBERS)[number]["presence"],
  { color: string; label: string }
> = {
  working: { color: "#2e8b5b", label: "업무 중 · 사무실" },
  away: { color: "#a9762a", label: "자리 비움" },
  offline: { color: "#9a9ea5", label: "오프라인" },
};

export function OrgTeamView({ teamId }: { teamId: string }) {
  const toast = useToast();
  const team = ORG_TREE.find((n) => n.id === teamId);
  const members = useMemo(
    () => ORG_MEMBERS.filter((m) => m.teamId === teamId),
    [teamId]
  );
  const [selectedId, setSelectedId] = useState<string | null>(members[0]?.id ?? null);
  const selected = members.find((m) => m.id === selectedId) ?? null;
  const parent = team ? ORG_TREE.find((n) => n.id === team.parentId) : null;

  return (
    <div className="grid min-w-0 flex-1 grid-cols-[1fr_340px]">
      <div className="min-w-0 overflow-y-auto border-r border-(--border-app) p-5">
        <div className="mb-4 flex items-center gap-3">
          <div>
            <h1 className="text-base font-bold tracking-tight">{team?.name}</h1>
            <p className="text-xs text-(--text-muted)">
              {parent?.name} › {team?.name} · {members.length}명
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("팀 전체에게 메일 쓰기 화면을 엽니다", { sub: `${team?.name} · ${members.length}명` })}
            className="ml-auto h-8 rounded-[9px] px-3 text-xs font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            팀 전체에 메일
          </button>
          <button
            type="button"
            onClick={() => toast.success("vCard를 내보냈습니다", { sub: `${members.length}명` })}
            className="h-8 rounded-[9px] border border-(--border-app) px-3 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            vCard 내보내기
          </button>
        </div>

        {members.length === 0 && (
          <p className="mt-10 text-center text-sm text-(--text-muted)">
            이 팀은 아직 구성원 정보가 등록되지 않았습니다.
          </p>
        )}
        <div className="grid grid-cols-3 gap-3">
          {members.map((m) => {
            const isSelected = m.id === selectedId;
            const presence = PRESENCE_STYLE[m.presence];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className="flex flex-col items-start gap-2 rounded-[11px] border p-3.5 text-left transition"
                style={{
                  borderColor: isSelected ? "var(--color-primary)" : "var(--border-app)",
                }}
              >
                <div className="flex w-full items-center gap-2">
                  <span
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: m.bg, color: m.fg }}
                  >
                    {m.initials}
                  </span>
                  <span
                    className="ml-auto h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: presence.color }}
                  />
                </div>
                <p className="truncate text-[13px] font-semibold">{m.name}</p>
                <p className="w-full truncate text-[11px] text-(--text-muted)">
                  {m.title}
                </p>
                <p className="w-full truncate text-[11px] text-(--text-muted)/80">
                  {m.email}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-y-auto bg-(--surface-muted) p-5">
        {!selected ? (
          <p className="mt-10 text-center text-sm text-(--text-muted)">
            구성원을 선택하세요.
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <span
                className="flex h-[76px] w-[76px] items-center justify-center rounded-full text-2xl font-bold"
                style={{ backgroundColor: selected.bg, color: selected.fg }}
              >
                {selected.initials}
              </span>
              <p className="mt-3 text-[17px] font-bold">{selected.name}</p>
              <p className="text-xs text-(--text-muted)">{selected.title}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: PRESENCE_STYLE[selected.presence].color }}>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: PRESENCE_STYLE[selected.presence].color }}
                />
                {PRESENCE_STYLE[selected.presence].label}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => toast.info("메일 쓰기 화면을 엽니다", { sub: selected.email })}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[9px] text-xs font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Mail size={13} />
                메일 쓰기
              </button>
              <button
                type="button"
                onClick={() => toast.info("일정 잡기 화면을 엽니다", { sub: selected.name })}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-(--border-app) bg-(--surface-app) text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                <CalendarPlus size={13} />
                일정 잡기
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              {(
                [
                  ["이메일", selected.email],
                  ["사내 전화", selected.phone],
                  ["휴대전화", selected.mobile],
                  ["조직", team?.name ?? ""],
                  ["입사", selected.joined],
                  ["결재선", selected.approvalLine],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-[9px] border border-(--border-app) bg-(--surface-app) px-3 py-2"
                >
                  <span className="w-14 shrink-0 text-[11px] text-(--text-muted)">
                    {label}
                  </span>
                  <span className="truncate text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>

            <p className="mb-2 mt-5 text-xs font-bold text-(--text-muted)">
              최근 주고받은 메일
            </p>
            <div className="flex flex-col gap-1.5">
              {(PERSON_MAILS[selected.id] ?? []).length === 0 && (
                <p className="text-xs text-(--text-muted)">기록이 없습니다.</p>
              )}
              {(PERSON_MAILS[selected.id] ?? []).map((pm) => (
                <div
                  key={pm.subject}
                  className="flex items-center gap-2 rounded-[9px] border border-(--border-app) bg-(--surface-app) px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                    {pm.subject}
                  </span>
                  <span className="shrink-0 text-[11px] text-(--text-muted)">
                    {pm.date}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
