"use client";

import { X } from "lucide-react";
import {
  SYNTAX_RECIPES,
  SYNTAX_RULES,
  SYN_CONTENT,
  SYN_PEOPLE,
} from "@/lib/mock-search-syntax";

// Reference sheet of search operators, opened from the (?) icon on the
// search page. Purely informational — clicking an operator doesn't insert it.
export function SearchSyntaxPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 sm:p-8">
      <div className="w-full max-w-3xl rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
        <div className="mb-4 flex items-start gap-3">
          <div>
            <h2 className="text-lg font-bold">검색 고급 문법</h2>
            <p className="mt-1 text-xs text-(--text-muted)">
              검색창에서{" "}
              <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">?</code> 를 누르면 이
              패널이 열립니다
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-bold text-(--text-muted)">사람 · 대상</p>
            <div className="flex flex-col gap-2">
              {SYN_PEOPLE.map((s) => (
                <div key={s.op} className="text-xs">
                  <code className="font-mono font-semibold" style={{ color: "var(--color-primary)" }}>
                    {s.op}
                  </code>
                  <p className="text-[11px] text-(--text-muted)">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-(--text-muted)">내용 · 상태</p>
            <div className="flex flex-col gap-2">
              {SYN_CONTENT.map((s) => (
                <div key={s.op} className="text-xs">
                  <code className="font-mono font-semibold" style={{ color: "var(--color-primary)" }}>
                    {s.op}
                  </code>
                  <p className="text-[11px] text-(--text-muted)">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-(--border-app) p-3.5">
              <p className="mb-2 text-xs font-bold">조합 규칙</p>
              <ul className="flex flex-col gap-1.5">
                {SYNTAX_RULES.map((r) => (
                  <li key={r} className="flex gap-1.5 text-[11px] leading-relaxed text-(--text-muted)">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-(--color-primary)" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-(--border-app) p-3.5">
              <p className="mb-2 text-xs font-bold">자주 쓰는 조합</p>
              <div className="flex flex-col gap-2">
                {SYNTAX_RECIPES.map((r) => (
                  <div key={r.q}>
                    <code className="block truncate font-mono text-[10.5px] font-semibold">{r.q}</code>
                    <p className="text-[10.5px] text-(--text-muted)">{r.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] text-(--text-muted)">
                자주 쓰는 조합은 저장해 사이드바에 고정할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
