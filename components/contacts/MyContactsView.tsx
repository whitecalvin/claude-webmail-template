"use client";

import { useMemo, useState } from "react";
import { Search, Star, Trash2 } from "lucide-react";
import { CONTACT_GROUPS, MY_CONTACTS } from "@/lib/mock-contacts";
import { useToast } from "@/context/toast-context";
import type { Contact, ContactGroup } from "@/types/contacts";

// Desktop "My Contacts" view: a filterable list on the left, an edit form
// for the selected contact on the right.
const GROUP_PILL_STYLE: Record<ContactGroup, string> = {
  "외부 파트너": "bg-[#ECEFFE] text-[#2B4BF2]",
  "구매 담당": "bg-[#FDF0E4] text-[#B4740F]",
  자문: "bg-[#EDEBF7] text-[#6B5CA8]",
  개인: "bg-[#F0F0EC] text-[#5C6068]",
};

const NEW_CONTACT_PALETTE = [
  { bg: "#E4EAFE", fg: "#2B4BF2" },
  { bg: "#E9F3EC", fg: "#2E8B5B" },
  { bg: "#EDEBF7", fg: "#6B5CA8" },
  { bg: "#FDF0E4", fg: "#B4740F" },
];

export function MyContactsView() {
  const toast = useToast();
  const [contacts, setContacts] = useState<Contact[]>(MY_CONTACTS);
  const [query, setQuery] = useState("");
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(contacts[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesGroup =
        activeGroupFilter === "전체" ||
        (activeGroupFilter === "즐겨찾기" && c.starred) ||
        c.group === activeGroupFilter;
      return matchesQuery && matchesGroup;
    });
  }, [contacts, query, activeGroupFilter]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const updateSelected = (patch: Partial<Contact>) => {
    if (!selected) return;
    setContacts((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, ...patch } : c))
    );
  };

  const toggleStar = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    );
  };

  const deleteSelected = () => {
    if (!selected) return;
    setContacts((prev) => prev.filter((c) => c.id !== selected.id));
    setSelectedId(null);
  };

  const addContact = () => {
    const palette = NEW_CONTACT_PALETTE[contacts.length % NEW_CONTACT_PALETTE.length];
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: "새 연락처",
      email: "",
      company: "",
      title: "",
      phone: "",
      mobile: "",
      memo: "",
      group: "개인",
      initials: "새",
      bg: palette.bg,
      fg: palette.fg,
      starred: false,
    };
    setContacts((prev) => [newContact, ...prev]);
    setSelectedId(newContact.id);
    toast.success("새 연락처를 추가했습니다", { sub: "정보를 입력해 주세요" });
  };

  return (
    <div className="grid min-w-0 flex-1 grid-cols-[1fr_360px]">
      <div className="flex min-w-0 flex-col overflow-hidden border-r border-(--border-app)">
        <div className="flex shrink-0 items-center gap-3 border-b border-(--border-app) px-5 py-4">
          <div>
            <h1 className="text-base font-bold tracking-tight">내 주소록</h1>
            <p className="text-xs text-(--text-muted)">
              개인 {contacts.length}명 · 최근 자동 수집 2명
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("CSV · vCard 가져오기 화면으로 이동합니다")}
            className="ml-auto h-8 rounded-[9px] border border-(--border-app) px-3 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            가져오기 (CSV · vCard)
          </button>
          <button
            type="button"
            onClick={addContact}
            className="h-8 rounded-[9px] px-3 text-xs font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + 연락처 추가
          </button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--border-app) px-5 py-3">
          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 · 회사 · 메일"
              className="h-8 w-60 rounded-lg bg-black/4 pl-7 pr-2.5 text-xs outline-none dark:bg-white/6"
            />
          </div>
          {CONTACT_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setActiveGroupFilter(g)}
              className={`h-8 rounded-full px-3 text-xs font-medium transition ${
                activeGroupFilter === g
                  ? "bg-(--text-app) text-(--surface-app)"
                  : "bg-black/5 text-(--text-muted) hover:bg-black/10 dark:bg-white/10"
              }`}
            >
              {g}{" "}
              {g === "전체"
                ? contacts.length
                : g === "즐겨찾기"
                  ? contacts.filter((c) => c.starred).length
                  : contacts.filter((c) => c.group === g).length}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[1.7fr_1.5fr_1.2fr_90px] gap-3 border-b border-(--border-app) px-5 py-2 text-[10.5px] font-bold uppercase tracking-[.04em] text-(--text-muted)">
            <span>이름</span>
            <span>메일</span>
            <span>회사 · 직위</span>
            <span className="text-right">그룹</span>
          </div>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-(--text-muted)">
              조건에 맞는 연락처가 없습니다.
            </p>
          )}
          {filtered.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(c.id)}
                className={`grid cursor-pointer grid-cols-[1.7fr_1.5fr_1.2fr_90px] items-center gap-3 border-b border-(--border-app) px-5 py-2.5 text-left transition ${
                  isSelected
                    ? "border-l-2 border-l-(--color-primary) bg-(--color-primary)/5"
                    : "hover:bg-black/2 dark:hover:bg-white/3"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: c.bg, color: c.fg }}
                  >
                    {c.initials}
                  </span>
                  <span className="truncate text-[12.5px] font-semibold">{c.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(c.id);
                    }}
                    className="shrink-0"
                    aria-label="즐겨찾기"
                  >
                    <Star
                      size={13}
                      fill={c.starred ? "#e0ac4a" : "none"}
                      color={c.starred ? "#e0ac4a" : "var(--text-muted)"}
                    />
                  </button>
                </div>
                <span className="truncate text-xs text-(--text-muted)">{c.email}</span>
                <span className="truncate text-xs text-(--text-muted)">{c.company}</span>
                <span className="flex justify-end">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${GROUP_PILL_STYLE[c.group]}`}
                  >
                    {c.group}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto bg-(--surface-muted) p-5">
        {!selected ? (
          <p className="m-auto text-sm text-(--text-muted)">
            연락처를 선택하세요.
          </p>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[13px] font-bold">연락처 편집</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${GROUP_PILL_STYLE[selected.group]}`}
              >
                {selected.group}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-[11px] border border-(--border-app) bg-background p-3.5">
              <span
                className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                style={{ backgroundColor: selected.bg, color: selected.fg }}
              >
                {selected.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{selected.name}</p>
                <p className="truncate text-xs text-(--text-muted)">{selected.title}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {(
                [
                  ["name", "이름"],
                  ["company", "회사"],
                  ["title", "직위 · 부서"],
                  ["email", "이메일"],
                  ["mobile", "휴대전화"],
                  ["phone", "회사 전화"],
                  ["memo", "메모"],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-(--text-muted)">
                    {label}
                  </span>
                  <input
                    type="text"
                    value={selected[field]}
                    onChange={(e) => updateSelected({ [field]: e.target.value })}
                    className="h-9.5 rounded-[9px] border border-(--border-app) bg-background px-3 text-xs outline-none focus:border-(--color-primary)"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.success("연락처를 저장했습니다", { sub: selected.name })}
                className="h-9 flex-1 rounded-[9px] text-sm font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="h-9 rounded-[9px] border border-(--border-app) px-4 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                취소
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                aria-label="삭제"
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#E8CBC8] text-(--status-danger) hover:bg-(--status-danger-bg)"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
