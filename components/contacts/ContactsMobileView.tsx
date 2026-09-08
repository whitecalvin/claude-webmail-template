"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, Star, Trash2 } from "lucide-react";
import { MY_CONTACTS } from "@/lib/mock-contacts";
import { useToast } from "@/context/toast-context";
import type { Contact } from "@/types/contacts";

// Mobile contacts: a filterable list that drills into a full-screen edit
// form on tap, in place of the desktop's side-by-side list/detail layout.
const FILTERS = ["전체", "즐겨찾기", "외부 파트너"] as const;
type Filter = (typeof FILTERS)[number];

const NEW_CONTACT_PALETTE = [
  { bg: "#E4EAFE", fg: "#2B4BF2" },
  { bg: "#E9F3EC", fg: "#2E8B5B" },
  { bg: "#EDEBF7", fg: "#6B5CA8" },
  { bg: "#FDF0E4", fg: "#B4740F" },
];

export function ContactsMobileView() {
  const toast = useToast();
  const [contacts, setContacts] = useState<Contact[]>(MY_CONTACTS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesFilter =
        filter === "전체" ||
        (filter === "즐겨찾기" && c.starred) ||
        (filter === "외부 파트너" && c.group === "외부 파트너");
      return matchesQuery && matchesFilter;
    });
  }, [contacts, query, filter]);

  const open = contacts.find((c) => c.id === openId) ?? null;

  const toggleStar = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    );
  };

  const updateOpen = (patch: Partial<Contact>) => {
    if (!open) return;
    setContacts((prev) =>
      prev.map((c) => (c.id === open.id ? { ...c, ...patch } : c))
    );
  };

  const deleteOpen = () => {
    if (!open) return;
    setContacts((prev) => prev.filter((c) => c.id !== open.id));
    setOpenId(null);
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
    setOpenId(newContact.id);
    toast.success("새 연락처를 추가했습니다", { sub: "정보를 입력해 주세요" });
  };

  if (open) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) px-4 py-3">
          <button
            type="button"
            onClick={() => setOpenId(null)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="목록으로"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-[15px] font-bold">연락처 편집</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-(--border-app) p-3.5">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold"
              style={{ backgroundColor: open.bg, color: open.fg }}
            >
              {open.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{open.name}</p>
              <p className="truncate text-xs text-(--text-muted)">{open.title}</p>
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
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-(--text-muted)">
                  {label}
                </span>
                <input
                  type="text"
                  value={open[field]}
                  onChange={(e) => updateOpen({ [field]: e.target.value })}
                  className="h-11 rounded-[9px] border border-(--border-app) bg-background px-3 text-sm outline-none focus:border-(--color-primary)"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success("연락처를 저장했습니다", { sub: open.name })}
              className="h-11 flex-1 rounded-[9px] text-sm font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={deleteOpen}
              aria-label="삭제"
              className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#E8CBC8] text-(--status-danger)"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-(--border-app) px-5 pb-3 pt-2">
        <div>
          <p className="text-xl font-bold tracking-tight">주소록</p>
          <p className="mt-0.5 text-[11.5px] text-(--text-muted)">
            개인 {contacts.length}명
          </p>
        </div>
        <button
          type="button"
          onClick={addContact}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-[9px] text-white transition hover:brightness-110"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-label="연락처 추가"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="shrink-0 border-b border-(--border-app) px-4 py-3">
        <div className="relative mb-2.5">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 · 회사 · 메일"
            className="h-10 w-full rounded-[10px] bg-black/4 pl-9 pr-3 text-sm outline-none dark:bg-white/6"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                filter === f
                  ? "bg-(--text-app) text-(--surface-app)"
                  : "bg-black/5 text-(--text-muted) dark:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-(--text-muted)">
            조건에 맞는 연락처가 없습니다.
          </p>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            role="button"
            tabIndex={0}
            onClick={() => setOpenId(c.id)}
            className="flex cursor-pointer items-center gap-3 border-b border-(--border-app) px-4 py-3"
          >
            <span
              className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[11px] text-xs font-bold"
              style={{ backgroundColor: c.bg, color: c.fg }}
            >
              {c.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="truncate text-xs text-(--text-muted)">
                {c.title} · {c.company}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(c.id);
              }}
              className="shrink-0 p-1"
              aria-label="즐겨찾기"
            >
              <Star
                size={16}
                fill={c.starred ? "#e0ac4a" : "none"}
                color={c.starred ? "#e0ac4a" : "var(--text-muted)"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
