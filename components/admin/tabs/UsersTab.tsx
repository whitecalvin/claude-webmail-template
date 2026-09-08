"use client";

// Admin Console > Users tab: searchable/filterable account table with
// per-row and bulk actions (suspend, delete). All state is local/in-memory —
// there is no backend, so refreshing the page resets it to ADMIN_USERS.
import { useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { ADMIN_USERS } from "@/lib/mock-admin";
import { AdminCard, ProgressBar } from "../primitives";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/context/toast-context";

type AdminUser = (typeof ADMIN_USERS)[number];

// Filter option lists are derived from the mock data itself, prefixed with an
// "all" choice, so they stay correct if the roster changes.
const DEPT_OPTIONS = ["부서 전체", ...Array.from(new Set(ADMIN_USERS.map((u) => u.dept.split(" · ")[0])))];
const ROLE_OPTIONS = ["권한 전체", ...Array.from(new Set(ADMIN_USERS.map((u) => u.role)))];
const STATUS_OPTIONS = ["상태 전체", ...Array.from(new Set(ADMIN_USERS.map((u) => u.status)))];

const ROLE_STYLE: Record<string, string> = {
  최고관리자: "bg-[#FBEAE8] text-[#C0433B]",
  부서관리자: "bg-[#ECEFFE] text-[#2B4BF2]",
  감사: "bg-[#EDEBF7] text-[#6B5CA8]",
  API: "bg-[#F0F0EC] text-[#5C6068]",
  일반: "bg-[#F7F7F5] text-[#6B6F77]",
};

const STATUS_STYLE: Record<string, string> = {
  활성: "bg-[#E9F3EC] text-[#2E8B5B]",
  용량초과: "bg-[#FDF0E4] text-[#B4740F]",
  정지: "bg-[#F0F0EC] text-[#8E9299]",
};

export function UsersTab() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(ADMIN_USERS);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [deptFilter, setDeptFilter] = useState("부서 전체");
  const [roleFilter, setRoleFilter] = useState("권한 전체");
  const [statusFilter, setStatusFilter] = useState("상태 전체");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = users.filter(
    (u) =>
      (!query || u.name.includes(query) || u.email.toLowerCase().includes(query.toLowerCase())) &&
      (deptFilter === "부서 전체" || u.dept.startsWith(deptFilter)) &&
      (roleFilter === "권한 전체" || u.role === roleFilter) &&
      (statusFilter === "상태 전체" || u.status === statusFilter)
  );

  const toggleSuspend = (u: AdminUser) => {
    const suspending = u.status !== "정지";
    setUsers((prev) =>
      prev.map((row) => (row.email === u.email ? { ...row, status: suspending ? "정지" : "활성" } : row))
    );
    setMenuFor(null);
    toast.success(suspending ? "계정을 정지했습니다" : "계정 정지를 해제했습니다", { sub: u.name });
  };

  const toggleSelect = (email: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });

  // "Select all" only ever applies to the currently filtered rows, not the
  // full roster, so selections outside the active filter are preserved.
  const allFilteredSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.email));
  const toggleSelectAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((u) => next.delete(u.email));
      else filtered.forEach((u) => next.add(u.email));
      return next;
    });

  const bulkSuspend = () => {
    setUsers((prev) => prev.map((row) => (selected.has(row.email) ? { ...row, status: "정지" } : row)));
    toast.success(`${selected.size}개 계정을 정지했습니다`);
    setSelected(new Set());
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-7">
      <AdminCard className="flex flex-1 flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 · 계정 · 부서 검색"
              className="h-8 w-[280px] rounded-lg bg-black/[.04] pl-7 pr-2.5 text-xs outline-none dark:bg-white/[.06]"
            />
          </div>
          <Dropdown value={deptFilter} options={DEPT_OPTIONS} onChange={setDeptFilter} />
          <Dropdown value={roleFilter} options={ROLE_OPTIONS} onChange={setRoleFilter} />
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
          {selected.size > 0 ? (
            // Bulk-action bar replaces the summary text while a selection is active.
            <span className="ml-auto flex items-center gap-2 text-xs">
              <strong className="text-(--text-app)">{selected.size}명</strong> 선택됨
              <button
                type="button"
                onClick={bulkSuspend}
                className="h-7 rounded-lg border border-(--border-app) px-2.5 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                일괄 정지
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="h-7 rounded-lg px-2.5 text-xs font-semibold text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
              >
                선택 해제
              </button>
            </span>
          ) : (
            <span className="ml-auto text-xs text-(--text-muted)">
              총 <strong className="text-(--text-app)">{filtered.length.toLocaleString()}</strong>개 계정 ·{" "}
              {filtered.filter((u) => u.status === "정지").length} 정지
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-(--border-app)">
          <div className="grid grid-cols-[28px_2.2fr_1.3fr_1fr_1.1fr_1fr_90px_28px] gap-2 border-b border-(--border-app) bg-black/[.02] px-3 py-2 text-[10.5px] font-bold uppercase tracking-[.03em] text-(--text-muted) dark:bg-white/[.03]">
            <Checkbox checked={allFilteredSelected} onChange={toggleSelectAll} label="전체 선택" />
            <span>사용자</span>
            <span>부서 · 직위</span>
            <span>권한</span>
            <span>용량</span>
            <span>마지막 접속</span>
            <span>상태</span>
            <span />
          </div>
          {filtered.map((u) => (
            <div
              key={u.email}
              className="group relative grid grid-cols-[28px_2.2fr_1.3fr_1fr_1.1fr_1fr_90px_28px] items-center gap-2 border-b border-(--border-app) px-3 py-2.5 text-xs last:border-b-0 hover:bg-black/[.015] dark:hover:bg-white/[.02]"
            >
              <Checkbox checked={selected.has(u.email)} onChange={() => toggleSelect(u.email)} label={`${u.name} 선택`} />
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: u.bg, color: u.fg }}
                >
                  {u.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{u.name}</p>
                  <p className="truncate text-[10.5px] text-(--text-muted)">{u.email}</p>
                </div>
              </div>
              <span className="truncate text-(--text-muted)">{u.dept}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_STYLE[u.role]}`}>
                  {u.role}
                </span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px]">{u.quota}</p>
                <ProgressBar
                  pct={u.pct}
                  height={4}
                  color={u.pct > 85 ? "#C0433B" : u.pct > 60 ? "#E0AC4A" : "#2B4BF2"}
                />
              </div>
              <span className="text-(--text-muted)">{u.last}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[u.status]}`}>
                  {u.status}
                </span>
              </span>
              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => setMenuFor((v) => (v === u.email ? null : u.email))}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-(--text-muted) opacity-0 transition hover:bg-black/5 group-hover:opacity-100 dark:hover:bg-white/10"
                  aria-label="더 보기"
                >
                  <MoreHorizontal size={14} />
                </button>
                {menuFor === u.email && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuFor(null)} />
                    <div className="absolute right-0 top-7 z-50 w-40 overflow-hidden rounded-lg border border-(--border-app) bg-(--surface-app) py-1 shadow-xl">
                      <button
                        type="button"
                        onClick={() => toggleSuspend(u)}
                        className="flex w-full items-center px-3 py-2 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        {u.status === "정지" ? "정지 해제" : "계정 정지"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingUser(u);
                          setMenuFor(null);
                        }}
                        className="flex w-full items-center px-3 py-2 text-left text-xs text-[#C0433B] hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        계정 삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {deletingUser && (
        <ConfirmDialog
          tone="destructive"
          title={`${deletingUser.name} 계정을 삭제할까요?`}
          description={`메일함과 첨부파일 전체(${deletingUser.quota})가 함께 삭제됩니다. 확인을 위해 이메일 주소를 입력하세요.`}
          confirmLabel="계정 삭제"
          requireTypedText={deletingUser.email}
          onCancel={() => setDeletingUser(null)}
          onConfirm={() => {
            setUsers((prev) => prev.filter((row) => row.email !== deletingUser.email));
            toast.success("계정이 삭제되었습니다", { sub: deletingUser.name });
            setDeletingUser(null);
          }}
        />
      )}
    </div>
  );
}
