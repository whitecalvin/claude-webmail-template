"use client";

import { Link } from "@/i18n/navigation";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

// Desktop settings sidebar. Every entry points to its own App Router page.
export function SettingsNav({ active }: { active: SettingsNavKey }) {
  return (
    <aside className="flex h-12 w-full shrink-0 items-center border-b border-(--border-app) bg-(--surface-muted) px-2 lg:h-full lg:w-[236px] lg:flex-col lg:items-stretch lg:gap-3 lg:border-b-0 lg:border-r lg:p-3">
      <p className="hidden px-1.5 text-sm font-bold tracking-tight lg:block">설정</p>
      <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {SETTINGS_NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-[12.5px] transition ${
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
