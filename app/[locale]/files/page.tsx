"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, LayoutGrid, List, Search } from "lucide-react";
import { BIG_LINKS, FILE_CARDS, FILE_PERIODS, FILE_SORTS, FILE_TYPES } from "@/lib/mock-files";
import { useToast } from "@/context/toast-context";

// Attachments browser: a grid/list of files pulled from mail, filterable by
// type/period/sort, plus a large-file-link tracker in the right rail.
const LINK_STATE_STYLE: Record<string, string> = {
  활성: "bg-(--status-success-bg) text-(--status-success)",
  "만료 임박": "bg-(--status-warning-bg) text-(--status-warning)",
  만료됨: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

export default function FilesPage() {
  const toast = useToast();
  const [activeType, setActiveType] = useState("문서");
  const [activePeriod, setActivePeriod] = useState("최근 30일");
  const [activeSort, setActiveSort] = useState("최신순");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const filteredCards = FILE_CARDS.filter((f) => {
    const q = query.trim().toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.from.toLowerCase().includes(q);
  });

  const openFile = (name: string) => toast.info("파일을 다운로드합니다", { sub: name });

  return (
    <div className="flex h-dvh w-full flex-col bg-(--surface-app)">
      <div className="flex shrink-0 items-center gap-3 border-b border-(--border-app) px-5 py-4 sm:px-7">
        <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="메일로 돌아가기">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold">첨부 파일</h1>
          <p className="text-xs text-(--text-muted)">
            메일 첨부 4,182개 · 18.2 GB · 대용량 링크 12개 활성
          </p>
        </div>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="파일명 · 보낸사람 검색"
              className="h-9 w-[260px] rounded-lg bg-black/[.04] pl-8 pr-2.5 text-xs outline-none dark:bg-white/[.06]"
            />
          </div>
          <div className="flex rounded-lg bg-black/[.04] p-1 dark:bg-white/[.06]">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`flex h-7 w-8 items-center justify-center rounded-md ${view === "grid" ? "bg-(--surface-app) shadow-sm" : "text-(--text-muted)"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex h-7 w-8 items-center justify-center rounded-md ${view === "list" ? "bg-(--surface-app) shadow-sm" : "text-(--text-muted)"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[216px_1fr_300px]">
        <aside className="hidden flex-col gap-5 overflow-y-auto border-r border-(--border-app) p-3.5 lg:flex">
          <div>
            <p className="mb-2 px-1 text-[11px] font-bold text-(--text-muted)">종류</p>
            <div className="flex flex-col gap-0.5">
              {FILE_TYPES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActiveType(t.name)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                    activeType === t.name
                      ? "bg-(--color-primary)/10 font-semibold text-(--color-primary)"
                      : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="flex-1 truncate">{t.name}</span>
                  <span>{t.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 px-1 text-[11px] font-bold text-(--text-muted)">기간</p>
            <div className="flex flex-col gap-0.5">
              {FILE_PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePeriod(p)}
                  className={`rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                    activePeriod === p
                      ? "bg-(--color-primary)/10 font-semibold text-(--color-primary)"
                      : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto rounded-lg border border-(--border-app) p-3">
            <p className="text-[11px] font-semibold">저장 공간 18.2 / 50 GB</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div className="h-full rounded-full" style={{ width: "36%", backgroundColor: "var(--color-primary)" }} />
            </div>
            <p className="mt-1.5 text-[10.5px] text-(--text-muted)">
              큰 첨부 20개를 정리하면 4.1 GB를 확보할 수 있습니다.
            </p>
          </div>
        </aside>

        <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-bold">최근 첨부</p>
            <span className="text-xs text-(--text-muted)">{filteredCards.length}개</span>
            <div className="ml-auto flex gap-1">
              {FILE_SORTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSort(s)}
                  className={`h-7 rounded-full px-2.5 text-[11px] font-semibold transition ${
                    activeSort === s
                      ? "bg-[#17181B] text-white dark:bg-white dark:text-[#17181B]"
                      : "bg-black/5 text-(--text-muted) dark:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {filteredCards.length === 0 ? (
            <p className="py-10 text-center text-sm text-(--text-muted)">검색 결과가 없습니다.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredCards.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => openFile(f.name)}
                  className="rounded-xl border border-(--border-app) p-3 text-left transition hover:bg-black/[.02] dark:hover:bg-white/[.03]"
                >
                  <div
                    className="mb-2 flex h-16 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ backgroundColor: f.bg, color: f.fg }}
                  >
                    {f.ext}
                  </div>
                  <p className="truncate text-[11.5px] font-semibold">{f.name}</p>
                  <p className="truncate text-[10.5px] text-(--text-muted)">
                    {f.from} · {f.size}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filteredCards.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => openFile(f.name)}
                  className="flex items-center gap-3 rounded-lg border border-(--border-app) px-3 py-2 text-left transition hover:bg-black/[.02] dark:hover:bg-white/[.03]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                    style={{ backgroundColor: f.bg, color: f.fg }}
                  >
                    {f.ext}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{f.name}</span>
                  <span className="shrink-0 text-[11px] text-(--text-muted)">{f.from}</span>
                  <span className="w-16 shrink-0 text-right text-[11px] text-(--text-muted)">{f.size}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden flex-col gap-4 overflow-y-auto border-l border-(--border-app) p-4 lg:flex">
          <div>
            <p className="mb-2 text-xs font-bold">대용량 링크</p>
            <div className="flex flex-col gap-3">
              {BIG_LINKS.map((l) => (
                <div key={l.name}>
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold">{l.name}</p>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${LINK_STATE_STYLE[l.state]}`}>
                      {l.state}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${l.pct}%`,
                        backgroundColor: l.state === "만료됨" ? "#9A9EA5" : "var(--color-primary)",
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10.5px] text-(--text-muted)">
                    {l.expiry} · 다운로드 {l.downloads} · {l.size}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-black/[.02] p-3 dark:bg-white/[.03]">
            <p className="text-xs font-semibold">정리 제안</p>
            <p className="mt-1 text-[11px] text-(--text-muted)">
              2년 이상 지난 100 MB 이상 첨부 14개. 메일 본문은 유지하고 첨부만 삭제합니다. 총 3.2 GB 확보.
            </p>
            <button
              type="button"
              onClick={() => toast.info("정리 대상 첨부 14개 목록을 엽니다", { sub: "총 3.2 GB 확보 예상" })}
              className="mt-2 h-8 w-full rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: "#17181B" }}
            >
              목록 검토
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
