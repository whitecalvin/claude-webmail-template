"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Plus, FileText, HelpCircle } from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { SearchSyntaxPanel } from "@/components/search/SearchSyntaxPanel";
import { useToast } from "@/context/toast-context";
import {
  SAVED_SEARCHES,
  SEARCH_CHIPS,
  SEARCH_FACETS,
  SEARCH_GROUPS,
  SEARCH_QUERY,
} from "@/lib/mock-search";

// Global search results page for the pre-baked SEARCH_QUERY. Editing the
// query box only re-filters once the user actually changes it (see
// `queryEdited` below) — until then it shows the full curated result set,
// since a plain substring match against the default query text wouldn't
// find anything (it contains `from:`/`has:` operators, not literal words).
const SORT_OPTIONS = ["관련도순", "최신순", "보낸사람순"] as const;

function SearchPageContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");
  const [chips, setChips] = useState(SEARCH_CHIPS);
  const [facets, setFacets] = useState(SEARCH_FACETS);
  const [showSyntax, setShowSyntax] = useState(false);
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>("관련도순");
  const query = urlQuery ?? SEARCH_QUERY;
  const queryEdited = urlQuery !== null;

  const q = query.trim().toLowerCase();
  const filteredGroups = !queryEdited
    ? SEARCH_GROUPS
    : SEARCH_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            !q ||
            item.subject.toLowerCase().includes(q) ||
            item.sender.toLowerCase().includes(q) ||
            item.hit.toLowerCase().includes(q)
        ),
      })).filter((group) => group.items.length > 0);
  const resultCount = filteredGroups.reduce((sum, g) => sum + g.items.length, 0);

  const cycleSort = () => {
    setSortBy((prev) => {
      const next = SORT_OPTIONS[(SORT_OPTIONS.indexOf(prev) + 1) % SORT_OPTIONS.length];
      toast.info(`정렬 기준을 "${next}"(으)로 변경했습니다`);
      return next;
    });
  };

  const toggleChip = (label: string) =>
    setChips((prev) => prev.map((c) => (c.label === label ? { ...c, active: !c.active } : c)));

  const toggleFacet = (groupName: string, label: string) =>
    setFacets((prev) =>
      prev.map((g) =>
        g.name !== groupName
          ? g
          : { ...g, rows: g.rows.map((r) => (r.label === label ? { ...r, checked: !r.checked } : r)) }
      )
    );

  return (
    <WorkspaceLayout showGlobalSearch className="flex flex-col lg:flex-row">
      <section aria-label="검색 결과" className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-(--border-app)">
        <header className="shrink-0 border-b border-(--border-app) px-5 py-3.5 sm:px-6">
          <div className="flex h-11 items-center gap-2 rounded-[11px] border border-(--border-app) bg-black/2 px-3 dark:bg-white/3">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {queryEdited ? `“${query}”` : "전체 검색 결과"}
            </span>
            <span className="shrink-0 text-[11px] text-(--text-muted)">
              결과 {resultCount}건 · 0.12초
            </span>
            <button
              type="button"
              onClick={() => setShowSyntax(true)}
              className="shrink-0 text-(--text-muted) hover:text-foreground"
              aria-label="검색 문법 도움말"
              title="검색 문법 도움말 (?)"
            >
              <HelpCircle size={16} />
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => toggleChip(c.label)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition ${
                  c.active
                    ? "bg-(--color-primary)/10 text-(--color-primary)"
                    : "border border-dashed border-(--border-app) text-(--text-muted)"
                }`}
              >
                {c.active && <Check size={11} />}
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => toast.info("검색 조건 추가 화면을 엽니다")}
              className="flex items-center gap-1 rounded-full border border-dashed border-(--border-app) px-2.5 py-1 text-[11.5px] font-medium text-(--text-muted)"
            >
              <Plus size={11} />
              조건 추가
            </button>
            <button
              type="button"
              onClick={cycleSort}
              className="ml-auto hidden text-[11px] font-semibold sm:inline"
              style={{ color: "var(--color-primary)" }}
            >
              {sortBy} ▾
            </button>
          </div>
        </header>

        <section aria-label="검색 결과 목록" className="flex-1 overflow-y-auto">
          {filteredGroups.length === 0 && (
            <p className="p-8 text-center text-sm text-(--text-muted)">검색 결과가 없습니다.</p>
          )}
          {filteredGroups.map((group, groupIndex) => (
            <section key={group.name} aria-labelledby={`search-group-${groupIndex}`}>
              <h2 id={`search-group-${groupIndex}`} className="border-b border-(--border-app) bg-black/1.5 px-5 py-2.5 text-[11px] font-bold text-(--text-muted) dark:bg-white/2 sm:px-6">
                {group.name}
              </h2>
              {group.items.map((item, i) => (
                <article
                  key={i}
                  className="flex items-start gap-3 border-b border-(--border-app) px-5 py-3 hover:bg-black/1.5 dark:hover:bg-white/2 sm:px-6"
                >
                  <span
                    className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: item.bg, color: item.fg }}
                  >
                    {item.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-semibold">{item.sender}</span>
                      {item.folder && (
                        <span className="shrink-0 text-[11px] text-(--text-muted)">{item.folder}</span>
                      )}
                      {item.date && (
                        <span className="ml-auto shrink-0 text-[11px] text-(--text-muted)">{item.date}</span>
                      )}
                    </div>
                    <h3 className="truncate text-[13px] font-medium">{item.subject}</h3>
                    {item.hit && (
                      <p className="truncate text-xs text-(--text-muted)">
                        {item.hitPrefix}
                        <span className="rounded bg-[#FBF3D8] font-semibold text-foreground">
                          {item.hit}
                        </span>
                        {item.hitSuffix}
                      </p>
                    )}
                    {item.file && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="flex items-center gap-1 rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-(--text-muted) dark:bg-white/10">
                          <FileText size={10} />
                          {item.file.type}
                        </span>
                        <span className="truncate text-[11px] text-(--text-muted)">{item.file.name}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </section>
      </section>

      <aside aria-label="검색 필터" className="hidden w-75 shrink-0 flex-col gap-5 overflow-y-auto bg-(--surface-muted) p-5 lg:flex">
        <p className="text-xs font-bold">검색 조건 좁히기</p>
        {facets.map((group) => (
          <div key={group.name}>
            <p className="mb-2 text-[11px] font-bold text-(--text-muted)">{group.name}</p>
            <div className="flex flex-col gap-1.5">
              {group.rows.map((row) => (
                <button
                  key={row.label}
                  type="button"
                  onClick={() => toggleFacet(group.name, row.label)}
                  className="flex items-center gap-2 text-left text-xs"
                >
                  <span
                    className="flex h-3.75 w-3.75 shrink-0 items-center justify-center rounded-sm"
                    style={{
                      backgroundColor: row.checked ? "var(--color-primary)" : "transparent",
                      border: row.checked ? "none" : "1px solid var(--border-app)",
                    }}
                  >
                    {row.checked && <Check size={9} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{row.label}</span>
                  <span className="shrink-0 text-(--text-muted)">{row.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-[11px] border border-(--border-app) bg-background p-3.5">
          <p className="mb-2 text-xs font-bold">저장된 검색</p>
          <div className="flex flex-col gap-2">
            {SAVED_SEARCHES.map((s) => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {showSyntax && <SearchSyntaxPanel onClose={() => setShowSyntax(false)} />}
    </WorkspaceLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
