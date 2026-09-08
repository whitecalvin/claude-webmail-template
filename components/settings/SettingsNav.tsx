"use client";

import { Link } from "@/i18n/navigation";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

// Desktop settings sidebar. Pure Link-based navigation so the same nav shell
// (this component + ModuleRail) renders identically whether the current
// section is a tab on /settings?tab=... or one of the standalone routes
// like /rules or /security.
export function SettingsNav({ active }: { active: SettingsNavKey }) {
  return (
    <aside className="flex h-full w-[236px] shrink-0 flex-col gap-3 border-r border-(--border-app) bg-(--surface-muted) p-3">
      <p className="px-1.5 text-sm font-bold tracking-tight">설정</p>
      <nav className="flex flex-col gap-0.5">
        {SETTINGS_NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-2.5 py-2 text-left text-[12.5px] transition ${
              active === item.key
                ? "bg-(--color-primary)/10 font-semibold text-(--color-primary)"
                : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
