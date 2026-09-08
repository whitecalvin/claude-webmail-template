"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ORG_TREE } from "@/lib/mock-contacts";

// Left sidebar for /contacts: switches between the org chart tree and "my
// contacts" / "external partners" list views.
type ContactMode = "my" | "org";

export function OrgTreeSidebar({
  mode,
  selectedTeamId,
  onSelectTeam,
  onSelectMy,
}: {
  mode: ContactMode;
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onSelectMy: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const nodes = ORG_TREE.filter((n) => n.depth > 0 && (!q || n.name.toLowerCase().includes(q)));

  return (
    <aside className="flex h-full w-62.5 shrink-0 flex-col gap-3.5 border-r border-(--border-app) bg-(--surface-muted) p-3">
      <p className="px-1 text-[13px] font-bold tracking-tight">조직도</p>

      <div className="relative">
        <Search
          size={13}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름 · 부서"
          className="h-8.5 w-full rounded-[9px] border border-(--border-app) bg-background pl-7 pr-2.5 text-xs text-foreground outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {nodes.length === 0 && (
          <p className="px-2 py-3 text-center text-[11px] text-(--text-muted)">검색 결과가 없습니다.</p>
        )}
        {nodes.map((node) => {
          const isActive = mode === "org" && node.id === selectedTeamId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectTeam(node.id)}
              disabled={node.depth === 1}
              className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition ${
                isActive
                  ? "bg-(--color-primary)/10 font-semibold text-(--color-primary)"
                  : node.depth === 1
                    ? "cursor-default font-semibold text-foreground"
                    : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              style={{ paddingLeft: 8 + node.depth * 14 }}
            >
              <span className="flex-1 truncate">{node.name}</span>
              <span className="shrink-0 text-[11px] text-(--text-muted)">
                {node.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-(--border-app) pt-3">
        {[
          { key: "org" as const, name: "조직도", color: "var(--color-primary)" },
          { key: "my" as const, name: "내 주소록", color: "#2e8b5b" },
          { key: "partners" as const, name: "외부 파트너", color: "#a9762a" },
        ].map((src) => (
          <button
            key={src.key}
            type="button"
            onClick={() => (src.key === "my" ? onSelectMy() : undefined)}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs ${
              (src.key === "my" && mode === "my") ||
              (src.key === "org" && mode === "org")
                ? "bg-(--color-primary)/10 font-semibold"
                : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ backgroundColor: src.color }}
            />
            {src.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
